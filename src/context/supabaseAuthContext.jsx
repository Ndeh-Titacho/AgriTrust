import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)

  // Sign up new user
  const signUpNewUsers = async (email, password, selectedRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: selectedRole,
            status: selectedRole === 'verifier' ? 'pending' : 'active',
            created_at: new Date().toISOString(),
          },
        },
      })

      if (error) throw error

      // Store user role in the database
      const userData = {
        id: data.user.id,
        email: email,
        role: selectedRole,
        status: selectedRole === 'verifier' ? 'pending' : 'active',
        created_at: new Date().toISOString(),
      }

      const { error: dbError } = await supabase
        .from('users')
        .insert([userData])

      if (dbError) throw dbError

      return { success: true, data }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, error: error.message || 'An error occurred during signup' }
    }
  }

  // Sign in user
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      // Get user role from database
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (dbError) throw dbError

      setUserRole(userData.role)
      return { success: true, data }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, error: error.message || 'An error occurred during sign-in' }
    }
  }

  // Sign out user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setSession(null)
      setUserRole(null)
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message || 'An error occurred during sign-out' }
    }
  }

  // Initialize session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (dbError) {
          console.error('Error fetching user role:', dbError)
          setUserRole(null)
        } else {
          setUserRole(userData?.role)
        }
      } else {
        setUserRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        userRole,
        signUpNewUsers,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
