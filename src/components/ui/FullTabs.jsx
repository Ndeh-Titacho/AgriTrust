import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from '../ui/button'
import { UserAuth } from '../../context/supabaseAuthContext'

export const FullTabs = ({ selectedRole }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { signInUser, signUpNewUsers } = UserAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      const result = await signUpNewUsers(email, password, selectedRole)
      
      if (result.success) {
        navigate("/Dashboard")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signInUser(email, password)
      
      if (result.success) {
        navigate("/Dashboard")
      } else {
        throw new Error(result.error)
      }
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
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={loading || !email || !password || !confirmPassword} 
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
