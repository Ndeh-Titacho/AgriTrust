import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { UserAuth } from '../context/supabaseAuthContext'
import { useWallet } from '../context/WalletContext'

export const AuthPage = () => {
  const navigate = useNavigate()
  const { selectedRole, signInUser, signUpNewUsers } = UserAuth()
  const { connectWallet, account, loading, error } = useWallet()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [authError, setAuthError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">No Role Selected</h2>
          <p className="text-gray-600 mb-4">Please select a role first to continue</p>
          <Button onClick={() => navigate('/')} className="w-full">
            Go Back to Role Selection
          </Button>
        </Card>
      </div>
    )
  }

  // Handle wallet authentication navigation
  useEffect(() => {
    if (account && selectedRole) {
      switch (selectedRole) {
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
    }
  }, [account, selectedRole, navigate])

  // Modify handleLogin to use role-based navigation
  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError(null)
    setIsLoading(true)
    try {
      const { success, error } = await signInUser(email, password)
      if (!success) throw new Error(error)
      
      switch (selectedRole) {
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
      setAuthError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthError(null)
    setIsLoading(true)
    try {
      const { success, error } = await signUpNewUsers(email, password, fullName)
      if (!success) throw new Error(error)
      navigate('/dashboard')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
            <p className="text-blue-100 text-center mt-2">
              Selected as: <span className="font-semibold capitalize">{selectedRole}</span>
            </p>
          </div>

          <div className="p-6">
            {/* Web3 Wallet Section */}
            <div className="mb-8">
              {!account ? (
                <Button
                  onClick={() => connectWallet(selectedRole)}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-lg text-lg font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg"
                >
                  <Wallet className="h-6 w-6" />
                  {loading ? 'Connecting...' : 'Connect Web3 Wallet'}
                </Button>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium text-center">Wallet Connected</p>
                  <p className="font-mono text-sm text-center text-gray-600 mt-1">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
              )}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Authentication Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button variant="secondary" type="submit" className="w-full hover:bg-blue-100" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button varient="secondary" type="submit" className="w-full text-black hover:bg-blue-100" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>

              {authError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
                  {authError}
                </div>
              )}
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}