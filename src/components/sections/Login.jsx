import React, { useState, useEffect } from 'react'
import { Wallet, Wheat, ShoppingBag, Award, Landmark } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { FullTabs } from '../ui/FullTabs'
import { useWallet } from '../../context/WalletContext'

export const Login = () => {
  const { account, loading, connectWallet } = useWallet()
  const [selectedRole, setSelectedRole] = useState("")

  useEffect(() => {
    const handleClickOutside = (event) => {
      const roleCards = document.querySelectorAll('.role-card')
      let clickedInside = false
      
      roleCards.forEach(card => {
        if (card.contains(event.target)) {
          clickedInside = true
        }
      })
      
      if (!clickedInside) {
        setSelectedRole("")
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    console.log(`Selected Role: ${role}`)
  }

  const handleConnect = async () => {
    if (!selectedRole) {
      alert("Please select a role first")
      return
    }
    await connectWallet(selectedRole)
  }

  

  return (
    <div className='flex items-center justify-center min-h-screen pt-20'>
      <div className='border p-8 rounded-lg shadow-md w-full max-w-md'>
        <div className='flex flex-col items-center space-y-6'>
          <h1 className='text-4xl font-bold text-center'>Welcome to AgriTrust</h1>
          <h2 className='text-gray-600 text-center'>Transparent, trusted, traceable</h2>

          <div className='bg-indigo-200 w-full rounded-lg p-6 flex flex-col items-center space-y-4'>
            <div className='rounded-md flex gap-4 items-center justify-center w-full'>
              <Wallet className='text-indigo-600' /> 
              <span className='font-semibold'>
                {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Web3 Authentication'}
              </span>
            </div>
            
            <Button 
              variant="secondary" 
              className="bg-indigo-500 text-white w-full hover:bg-indigo-600 disabled:bg-gray-400"
              onClick={handleConnect}
              disabled={loading || !selectedRole}
            >
              {loading ? 'Connecting...' : account ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>

          <div>
            <h2 className='font-semibold text-left pb-2'>Select your role</h2>
            <div className='grid grid-cols-2 gap-4'>

              {/* Farmer Role Cards */}
              <Card onClick={() => handleRoleSelect("farmer")} 
                className={`role-card hover:border-green-300 cursor-pointer transition-all duration-200
                ${selectedRole === "farmer" ? "border-green-500 bg-green-50" : ""}`}>
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="bg-green-400 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                    <Wheat/>
                  </CardTitle>
                  <CardDescription  className="font-bold text-black text-base sm:text-lg">
                    Farmer
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <p className='text-sm text-gray-600'>List products, get verified, and secure funding</p>
                </CardContent>
              </Card>

              {/* Consumer Role Cards */}
              <Card onClick={() => handleRoleSelect("consumer")} 
                className={`role-card hover:border-blue-300 cursor-pointer transition-all duration-200
                ${selectedRole === "consumer" ? "border-blue-500 bg-blue-50" : ""}`}>
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="bg-blue-300 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                    <ShoppingBag/>
                  </CardTitle>
                  <CardDescription  className="font-bold text-black text-base sm:text-lg">
                    Consumer
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <p className='text-sm text-gray-600'>Find verified products</p>
                </CardContent>
              </Card>

              {/* Verifier Role Cards */}
              <Card onClick={() => handleRoleSelect("verifier")} 
                className={`role-card hover:border-indigo-400 cursor-pointer transition-all duration-200
                ${selectedRole === "verifier" ? "border-indigo-500 bg-indigo-50" : ""}`}>
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="bg-indigo-400 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                    <Award/>
                  </CardTitle>
                  <CardDescription  className="font-bold text-black text-base sm:text-lg">
                    Verifier
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <p className='text-sm text-gray-600'>Verify farms and produce</p>
                </CardContent>
              </Card>

              {/* Financial Role Cards */}
              <Card onClick={() => handleRoleSelect("financial")} 
                className={`role-card hover:border-stone-400 cursor-pointer transition-all duration-200
                ${selectedRole === "financial" ? "border-stone-500 bg-stone-50" : ""}`}>
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="bg-stone-600 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                    <Landmark/>
                  </CardTitle>
                  <CardDescription  className="font-bold text-black text-base sm:text-lg">
                    Financial
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <p className='text-sm text-gray-600'>Fund farmers and manage loans</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <FullTabs selectedRole={selectedRole} />
        </div>
      </div>
    </div>
  )
}
