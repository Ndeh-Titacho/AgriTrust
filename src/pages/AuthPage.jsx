import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Wallet, User, Shield, Users, Settings } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { UserAuth } from '../context/supabaseAuthContext'
import { useWallet } from '../context/WalletContext'
import { motion } from 'framer-motion'

const roleIcons = {
  'farmer': <User className="h-5 w-5 text-green-500" />,
  'consumer': <Users className="h-5 w-5 text-blue-500" />,
  'verifier': <Shield className="h-5 w-5 text-purple-500" />,
  'financial': <Wallet className="h-5 w-5 text-orange-500" />,
  'admin': <Settings className="h-5 w-5 text-indigo-500" />
}

const roleColors = {
  'farmer': 'bg-green-50 text-green-700',
  'consumer': 'bg-blue-50 text-blue-700',
  'verifier': 'bg-purple-50 text-purple-700',
  'financial': 'bg-orange-50 text-orange-700',
  'admin': 'bg-indigo-50 text-indigo-700'
}

const roleDescriptions = {
  'farmer': 'Manage your farm products and track their journey through the supply chain',
  'consumer': 'Verify product authenticity and track their journey from farm to table',
  'verifier': 'Verify product information and ensure data accuracy in the supply chain',
  'financial': 'Manage financial transactions and track payments in the supply chain',
  'admin': 'Manage system settings and user permissions'
}

export const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    selectedRole, 
    handleRoleSelect, 
    signInUser, 
    signUpNewUsers 
  } = UserAuth()
  const { connectWallet, account, loading, error } = useWallet()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [authError, setAuthError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get role from URL parameters
  const searchParams = new URLSearchParams(location.search)
  const roleFromUrl = searchParams.get('role')

  // Set the role when component mounts
  useEffect(() => {
    if (roleFromUrl) {
      handleRoleSelect(roleFromUrl)
    }
  }, [roleFromUrl, handleRoleSelect])

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)
      const account = await connectWallet(selectedRole)
      if (account) {
        // Navigate to appropriate dashboard based on role
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
          case 'admin':
            navigate('/admin/dashboard')
            break
          default:
            navigate('/dashboard')
        }
      }
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center font-poppins bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8"
        >
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-4">Select Your Role</CardTitle>
              <CardDescription className="text-slate-600 mb-6">
                Choose your role to continue with the authentication process
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              {Object.entries(roleIcons).map(([role, Icon]) => (
                <motion.div
                  key={role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${roleColors[role]} hover:bg-${roleColors[role].split(' ')[0].split('-')[0]}-100`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div className="flex items-center gap-3">
                      {Icon}
                      <div>
                        <span className="font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                        <p className="text-sm text-slate-500 mt-1">
                          {roleDescriptions[role]}
                        </p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8"
      >
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 mb-4">Connect Your Wallet</CardTitle>
            <CardDescription className="text-slate-600 mb-6">
              Connect your wallet to continue as a {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700">Wallet Address</Label>
                <span className="text-sm text-slate-500">
                  {account ? account.slice(0, 6) + '...' + account.slice(-4) : 'Not connected'}
                </span>
              </div>
              <Input
                placeholder="Your wallet address will be shown here"
                value={account || ''}
                readOnly
                className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleConnectWallet}
              disabled={isLoading || loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
            >
              {isLoading || loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Wallet className="h-5 w-5 text-white" />
                  <span>Connect Wallet</span>
                </span>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3">
                {error}
              </div>
            )}

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3">
                {authError}
              </div>
            )}

            <div className="text-center text-sm text-slate-500">
              By connecting your wallet, you agree to our{' '}
              <a href="/terms" className="text-purple-600 hover:text-purple-800">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-800">
                Privacy Policy
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}