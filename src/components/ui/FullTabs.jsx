import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserAuth } from '../../context/supabaseAuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from '../ui/button'

export const FullTabs = () => {
  const navigate = useNavigate()
  const { signInUser, signUpNewUsers, selectedRole } = UserAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!selectedRole) {
      setError('Please select a role first')
      setLoading(false)
      return
    }

    try {
      const { success, error, data } = await signInUser(email, password)
      
      if (!success) {
        throw new Error(error)
      }

      // Redirect based on role
      switch (data.profile.roles.role_name) {
        case 'farmer':
          navigate('/farmer/dashboard')
          break
        case 'consumer':
          navigate('/consumer/dashboard')
          break
        case 'verifier':
          navigate('/verifier/dashboard')
          break
        case 'financial':
          navigate('/financial/dashboard')
          break
        default:
          navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!selectedRole) {
      setError('Please select a role first')
      setLoading(false)
      return
    }

    try {
      const { success, error } = await signUpNewUsers(email, password, fullName)
      if (!success) {
        throw new Error(error)
      }
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full'>
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {/* {selectedRole && (
        <div className="text-center mb-4 p-2 bg-blue-50 rounded">
          Selected Role: <span className="font-semibold capitalize">{selectedRole}</span>
        </div>
      )} */}
      
      <Tabs defaultValue="login" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="login-email" 
                    type="email" 
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="login-password" 
                    type="password" 
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"  
                  disabled={loading || !email || !password || !selectedRole} 
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white transition-colors">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <form onSubmit={handleSignUp}>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="register-email" 
                    type="email" 
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="register-password" 
                    type="password" 
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    id="name" 
                    type="text" 
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={loading || !email || !password || !fullName} 
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white transition-colors">
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
