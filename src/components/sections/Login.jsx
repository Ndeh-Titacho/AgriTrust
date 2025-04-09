import React from 'react'
import { Wallet, Wheat, ShoppingBag, Award, Landmark } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { FullTabs } from '../ui/FullTabs'
import { UserAuth } from '../../context/supabaseAuthContext'
import { useWallet } from '../../context/WalletContext'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const { handleRoleSelect, selectedRole } = UserAuth()
  const { connectWallet, account, loading, error } = useWallet()
  const navigate = useNavigate()

  const handleRoleClick = (roleId) => {
    handleRoleSelect(roleId)
    navigate('/auth')
  }

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'List products, get verified, and secure funding',
      icon: Wheat,
      bgColor: 'bg-green-400',
      hoverBorder: 'hover:border-green-300',
      selectedBg: 'bg-green-50',
      selectedBorder: 'border-green-500'
    },
    {
      id: 'consumer',
      title: 'Consumer',
      description: 'Find verified products',
      icon: ShoppingBag,
      bgColor: 'bg-blue-300',
      hoverBorder: 'hover:border-blue-300',
      selectedBg: 'bg-blue-50',
      selectedBorder: 'border-blue-500'
    },
    {
      id: 'verifier',
      title: 'Verifier',
      description: 'Verify farms and produce',
      icon: Award,
      bgColor: 'bg-indigo-400',
      hoverBorder: 'hover:border-indigo-400',
      selectedBg: 'bg-indigo-50',
      selectedBorder: 'border-indigo-500'
    },
    {
      id: 'financial',
      title: 'Financial',
      description: 'Fund farmers and manage loans',
      icon: Landmark,
      bgColor: 'bg-stone-600',
      hoverBorder: 'hover:border-stone-400',
      selectedBg: 'bg-stone-50',
      selectedBorder: 'border-stone-500'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-100'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'>
          {/* Header Section */}
          <div className='relative bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-white'>
            <h1 className='text-4xl font-bold text-center mb-2'>
              Welcome to AgriTrust
            </h1>
            <h2 className='text-blue-100 text-center'>
              Transparent • Trusted • Traceable
            </h2>
          </div>

          <div className='p-8'>
            <h2 className='text-xl font-semibold mb-4'>Select your role</h2>
            <div className='grid grid-cols-2 gap-4'>
              {roles.map((role) => {
                const Icon = role.icon
                return (
                  <Card 
                    key={role.id}
                    onClick={() => handleRoleClick(role.id)}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  >
                    <CardHeader className="flex flex-col items-center p-4">
                      <div className={`${role.bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-3 
                        group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white group-hover:rotate-12 transition-all duration-300"/>
                      </div>
                      <CardTitle className="text-center mb-2">{role.title}</CardTitle>
                      <CardDescription className="text-center text-sm">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
