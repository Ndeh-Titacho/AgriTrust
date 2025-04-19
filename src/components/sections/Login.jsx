import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Shield, Wallet, Settings } from 'lucide-react'

export const Login = () => {
  const navigate = useNavigate()

  const roles = [
    {
      title: 'Admin',
      description: 'Platform administrator with full system access',
      icon: <Settings className="h-6 w-6 text-indigo-600" />,
      path: '/auth?role=admin',
      color: 'bg-indigo-50 text-indigo-700'
    },
    {
      title: 'Farmer',
      description: 'Register and manage farm products',
      icon: <User className="h-6 w-6 text-green-600" />,
      path: '/auth?role=farmer',
      color: 'bg-green-50 text-green-700'
    },
    {
      title: 'Consumer',
      description: 'Purchase and verify products',
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      path: '/auth?role=consumer',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Verifier',
      description: 'Verify product information and ensure data accuracy',
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      path: '/auth?role=verifier',
      color: 'bg-purple-50 text-purple-700'
    }
  ]

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
                Select Your Role
              </h2>
              <p className="text-lg text-slate-600 text-center">
                Choose your role to continue with the authentication process
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {roles.map((role) => (
                <motion.div
                  key={role.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Link
                    to={role.path}
                    className={`block w-full p-6 rounded-xl transition-all duration-200 ${role.color} hover:bg-${role.color.split(' ')[0].split('-')[0]}-100`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-white">
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{role.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Terms and Privacy */}
          <div className="mt-12 text-center text-sm text-slate-500">
            By selecting a role, you agree to our{' '}
            <a href="/terms" className="text-purple-600 hover:text-purple-800">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-600 hover:text-purple-800">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
