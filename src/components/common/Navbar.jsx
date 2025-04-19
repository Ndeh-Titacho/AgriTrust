import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Wallet } from 'lucide-react'
import { useWeb3Auth } from '../../contexts/Web3AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const ROLE_OPTIONS = [
  { value: 'farmer', label: 'Farmer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'financial', label: 'Financial Institution' },
  { value: 'admin', label: 'Admin' },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { account, loading, userRole, error, connectWallet, disconnectWallet, setUserRole, clearError } = useWeb3Auth()
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    clearError()
    setUserRole(role)
  }

  return (
    <header className="w-full fixed top-0 left-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-2 lg:px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text">
              AgriTrust
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {userRole && (
              <Link 
                to={`/${userRole}-dashboard`}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {error && (
              <span className="text-red-500 text-sm hidden md:block">{error}</span>
            )}
            
            {account ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden md:block">
                      {`${account.slice(0, 6)}...${account.slice(-4)}`}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {!userRole && (
                    <>
                      <DropdownMenuLabel>Select Role:</DropdownMenuLabel>
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <DropdownMenuItem 
                          key={value}
                          onClick={() => handleRoleSelect(value)}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {userRole && (
                    <>
                      <DropdownMenuItem>
                        Current Role: {ROLE_OPTIONS.find(r => r.value === userRole)?.label}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem 
                    onClick={disconnectWallet}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              {userRole && (
                <Link
                  to={`/${userRole}-dashboard`}
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!userRole && account && (
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium mb-2">Select Role:</h3>
                  <div className="flex flex-col space-y-2">
                    {ROLE_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          handleRoleSelect(value)
                          setIsOpen(false)
                        }}
                        className="text-left px-2 py-1 hover:bg-gray-100 rounded"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}