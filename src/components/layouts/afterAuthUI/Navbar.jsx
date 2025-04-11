import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/button'
import { Wallet, User, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useWallet } from '../../../context/WalletContext'
import { UserAuth } from '../../../context/supabaseAuthContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar'
import { Badge } from '@/components/ui/badge'


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { connectWallet, account, loading, userRole } = useWallet()
  const { session, signOut } = UserAuth()
  const [userInfo, setUserInfo] = useState({full_name: '', email: '', avatar: '', role: ''})
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    if (session?.user) {
      setUserInfo({
        full_name: session.user.user_metadata.full_name || 'Anonymous',
        email: session.user.email || 'No email',
        avatar: session.user.user_metadata.avatar_url,
        role: session.user.user_metadata.role || 'No role'
      })
      setSelectedRole(session.user.user_metadata.role || 'No role')
    }
  }, [session])

  // Define spacing and button classes
  const spacing = "flex items-center justify-between"
  const button = "px-4 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
  const mobileButton = "text-left px-4 py-2 rounded-md"

  const renderGreeting = () => {  
    if(account) {
      return (
      <span className='bg-gradient-to-r from-blue-100 to-green-100 rounded-full px-3 py-2 text-indigo-500'>Good day, { loading? '....' : `${account.slice(0,6)}...${account.slice(-4)}`}</span>
  )
}
    else if (session?.user) {
      return (
        <span className="bg-gradient-to-r from-blue-100 to-green-100 rounded-full px-3 py-2 text-indigo-500">
          Good day, { loading? '....' : `${userInfo.full_name}`}   
          </span>
      )
    }
    return null
  }

  const renderAuthSection = () => {
    if (account) {
      // Show simplified view for wallet auth
      return (
        <div className='hidden lg:flex items-center gap-4'>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full px-3 py-1 text-sm font-medium capitalize">
            {userRole || 'No Role'} {/* Add fallback text */}
          </Badge>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Wallet className="h-4 w-4 text-indigo-600" />
            <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut/>
          </Button>
        </div>
      )
    }

    // Default view for traditional auth
    return (
      <div className='hidden lg:flex gap-2 md:gap-4'>
        <DropdownMenu className='cursor-pointer'>
          <DropdownMenuTrigger asChild>
            <div className="p-[2px] rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:shadow-lg transition-all duration-300">
              <Avatar className='w-12 h-12 cursor-pointer border-2 border-white'>
                <AvatarImage 
                  src={userInfo.avatar} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="bg-gray-200 text-gray-500 text-lg">
                  {userInfo.full_name.slice(0,2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="py-2"> <h1>{userInfo.full_name}</h1>
            <span className="text-sm text-gray-600"> </span>
            <span className="text-sm text-gray-600">{userInfo.email}</span> 
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
              <DropdownMenuGroup className='py-2 px-2'> 
                <span className="text-sm text-gray-600">Role: </span>
              <Badge className="bg-green-100 text-green-500 rounded-full px-2 py-1 text-xs font-semibold mr-2"> {userInfo.role}</Badge>
              </DropdownMenuGroup>
           

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
             
              <DropdownMenuItem>
              <Button 
          variant="outline"
          className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 w-full"
          onClick={connectWallet}
          disabled={loading}
        >
          <Wallet className="h-4 w-4 text-indigo-600" />
          <span className="hidden sm:inline">
            {loading 
              ? 'Connecting...' 
              : account 
                ? `${account.slice(0, 6)}...${account.slice(-4)}` 
                : 'Connect Wallet'
            }
          </span>
          <span className="sm:hidden">
            {loading 
              ? '...' 
              : account 
                ? `${account.slice(0, 4)}...` 
                : 'Connect'
            }
          </span>
        </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} 
            className="text-red-500">
             <LogOut className='text-red-500'/> Logout

            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <header className="w-full fixed top-0 left-0 bg-white z-50 shadow-sm">
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
              <li><Link to="/dashboard" className={button}>Dashboard</Link></li>
              <li><Link to="/about" className={button}>About</Link></li>
              <li><Link to="/contact" className={button}>Contact</Link></li>
            </ul>
          </div>
          
          {/* Render auth section based on auth type */}
          {renderAuthSection()}

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
          <div className="lg:hidden w-3/5 fixed top-17 right-0 px-4 py-4 bg-white border-t shadow-lg h-screen">
            <div className='flex flex-col gap-4 mt-4'>
              {account ? (
                // Wallet auth mobile view
                <>
                  <Badge className="bg-green-100 text-green-700 w-fit px-3 py-1 text-sm font-medium">
                    {userInfo.role}
                  </Badge>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={loading}
                  >
                    <Wallet className="h-4 w-4 text-indigo-600" />
                    <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                  </Button>
                </>
              ) : (
                // Traditional auth mobile view - existing dropdown
                <DropdownMenu className='cursor-pointer'>
                  <DropdownMenuTrigger asChild>
                    <div className="p-[2px] rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:shadow-lg transition-all duration-300">
                      <Avatar className='w-10 h-10 cursor-pointer border-2 border-white'>
                        <AvatarImage 
                          src={userInfo.avatar} 
                          alt="User Avatar" 
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-500">
                          {userInfo.full_name.slice(0,2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="py-2"> <h1>{userInfo.full_name}</h1>
                    <span className="text-sm text-gray-600"> </span>
                    <span className="text-sm text-gray-600">{userInfo.email}</span> 
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                      <DropdownMenuGroup className='py-2 px-2'> 
                        <span className="text-sm text-gray-600">Role: </span>
                      <Badge className="bg-green-100 text-green-500  rounded-full px-2 py-1 text-xs font-semibold mr-2"> {userInfo.role}</Badge>
                      </DropdownMenuGroup>
                   

                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                     
                      <DropdownMenuItem>
                      <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 w-full"
                  onClick={connectWallet}
                  disabled={loading}
                >
                  <Wallet className="h-4 w-4 text-indigo-600" />
                  <span className="hidden sm:inline">
                    {loading 
                      ? 'Connecting...' 
                      : account 
                        ? `${account.slice(0, 6)}...${account.slice(-4)}` 
                        : 'Connect Wallet'
                    }
                  </span>
                  <span className="sm:hidden">
                    {loading 
                      ? '...' 
                      : account 
                        ? `${account.slice(0, 4)}...` 
                        : 'Connect'
                    }
                  </span>
                </Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} 
                    className="text-red-500">
                     <LogOut className='text-red-500'/> Logout

                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className='px-4 py-4'>
              <ul className='space-y-4'>
                {['Home', 'Dashboard', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}>
                      <Button 
                        variant="ghost" 
                        size="default" 
                        className={`w-full justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ${mobileButton}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
