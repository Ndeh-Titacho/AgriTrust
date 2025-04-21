import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../ui/button'
import { Wallet, X, LogOut, Menu } from 'lucide-react'
import { useWallet } from '../../../context/WalletContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../../ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar'
import { Badge } from '../../ui/badge'


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { connectWallet, disconnectWallet, account, loading, userRole } = useWallet()
  const [selectedRole, setSelectedRole] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedRole(userRole || 'No role')
  }, [userRole])

  // Define spacing and button classes
  const spacing = "flex items-center justify-between"
  const button = "px-4 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
  const mobileButton = "text-left px-4 py-2 rounded-md"

  const renderGreeting = () => {  
    if (account) {
      return (
        <span className='font-medium text-indigo-500'> 
          <span className='font-normal text-gray-600'>Good day, </span> 
          { loading ? '....' : `${account.slice(0,6)}...${account.slice(-4)}`}
        </span>
      )
    }
    return null
  }

  const handleSignOut = async () => {
    await disconnectWallet()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (!selectedRole || selectedRole === 'No role') return '/dashboard'
    
    switch (selectedRole.toLowerCase()) {
      case 'admin':
        return '/admin/dashboard'
      case 'farmer':
        return '/farmer/dashboard'
      case 'consumer':
        return '/consumer/dashboard'
      case 'verifier':
        return '/verifier/dashboard'
      case 'financial':
        return '/financial/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <header className="w-full fixed top-0 left-0 bg-white/80 backdrop-blur-md border-b border-gray-200/20 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className={`${spacing} h-16 sm:h-[70px]`}>
          <div>
            <h1 className='font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text'>AgriTrust</h1>
          </div>
          {/* Greeting Message */}
          {renderGreeting()}          
          {/* Desktop Menu */}
          <div className='hidden lg:block'>
            <ul className='flex gap-2 md:gap-4'>
              <li><Link to="/" className={button}>Home</Link></li>
              <li><Link to={getDashboardPath()} className={button}>Dashboard</Link></li>
              <li><Link to="/marketplace" className={button}>Marketplace</Link></li>
              <li><Link to="/contact" className={button}>Contact</Link></li>
            </ul>
          </div>
          
          {/* Auth Section */}
          <div className='hidden lg:flex items-center gap-4'>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full px-3 py-1 text-sm font-medium capitalize">
              {selectedRole || 'No Role'}
            </Badge>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Wallet className="h-4 w-4 text-indigo-600" />
              <span>{`${account?.slice(0, 6)}...${account?.slice(-4)}`}</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut/>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            <div className="flex flex-col gap-2">
              <Link to="/" className={mobileButton}>Home</Link>
              <Link to={getDashboardPath()} className={mobileButton}>Dashboard</Link>
              <Link to="/marketplace" className={mobileButton}>Marketplace</Link>
              <Link to="/contact" className={mobileButton}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
