import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const signUpNewUsers = async (email, password, fullName) => {
    try {
      if (!selectedRole) {
        throw new Error('Please select a role first')
      }

      // Get role_id first
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('role_name', selectedRole)
        .single()

      if (roleError) {
        console.error('Role error:', roleError)
        throw new Error('Invalid role selected')
      }

      // Create auth user with complete metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            role: selectedRole,
            role_id: roleData.id,
            username: email.split('@')[0],
            status: selectedRole === 'verifier' ? 'pending' : 'active',
            updated_at: new Date().toISOString()
          }
        }
      })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        throw signUpError
      }

      // Let the database trigger handle profile creation
      return { success: true, data }
    } catch (error) {
      console.error('Error in signUpNewUsers:', error)
      return { success: false, error: error.message }
    }
  }

  const signInUser = async (email, password) => {
    try {
      if (!selectedRole) {
        throw new Error('Please select a role first')
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get user profile with role info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          roles:role_id (
            role_name
          )
        `)
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      // Verify role matches
      if (profile.roles.role_name !== selectedRole) {
        await supabase.auth.signOut()
        throw new Error(`This account is registered as a ${profile.roles.role_name}, not a ${selectedRole}`)
      }

      // Verify account status
      if (profile.status === 'pending') {
        await supabase.auth.signOut()
        throw new Error('Your account is pending verification')
      }

      if (profile.status === 'inactive') {
        await supabase.auth.signOut()
        throw new Error('Your account has been deactivated')
      }

      // Set user role and session
      setUserRole(profile.roles.role_name)
      setSession(data.session)

    
      
      return { 
        success: true, 
        data: {
          ...data,
          profile
        }
      }
    } catch (error) {
      console.error('Error signing in:', error.message)
      return { 
        success: false, 
        error: error.message 
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) 
    console.error('Error signing out:', error.message)
    setSession(null)
    setUserRole(null)
    setSelectedRole(null)
  }

  // Check auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setUserRole(session.user.user_metadata.role)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        setUserRole(session.user.user_metadata.role)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

   /*  //get user metadata
    useEffect(() =>{

     const fetchUserMetadata = async () => {

      const { data: { user}, error} = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', session?.user.id)
      .single()

      if (user) {
        setUserInfo(user)
      }
      
      if (error) {
        console.error('Error fetching user metadata:', error.message)
      }
    }
},[]) */

  return (
    <AuthContext.Provider value={{
      session,
      userRole,
      selectedRole,
      setSelectedRole,
      handleRoleSelect,
      signUpNewUsers,
      signInUser,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return context
}