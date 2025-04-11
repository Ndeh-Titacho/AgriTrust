import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Wallet, User, Menu, X } from 'lucide-react';
import { Button } from "../../components/ui/button"
import { useState } from 'react';
import { useWallet } from '../../context/WalletContext'

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { account, loading, connectWallet } = useWallet();
    const location = useLocation();
    const spacing = `flex justify-between items-center`;
    const button = "px-4 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
    const mobileButton = `w-full text-left hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100 transition-all duration-200`;

    const handleConnect = async () => {
        if (location.pathname !== '/login') {
            // If not on login page, redirect to login
            window.location.href = '/login';
            return;
        }
        await connectWallet();
    };

    return (
        <header className="w-full fixed top-0 left-0 bg-white z-50 shadow-sm">
            <div className="container mx-auto px-4 lg:px-8">
                <nav className={`${spacing} h-16 sm:h-[70px]`}>
                    <div>
                        <h1 className='font-bold text-2xl sm:text-3xl  bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text'>AgriTrust</h1>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className='hidden lg:block'>
                        <ul className='flex gap-2 md:gap-4'>
                            <li><Link to="/" className={button}>Home</Link></li>
                            <li><Link to="/dashboard" className={button}>Dashboard</Link></li>
                            <li><Link to="/about" className={button}>About</Link></li>
                            <li><Link to="/contact" className={button}>Contact</Link></li>
                        </ul>
                    </div>
                    
                    {/* Desktop Buttons */}
                    <div className='hidden lg:flex gap-2 md:gap-4'>
                        <Button 
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200"
                            onClick={handleConnect}
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
                        <Link to="/login">
                            <Button 
                                variant="outline" 
                                size='default' 
                                className='flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200'
                            >
                                <User className="h-4 w-4 text-indigo-600"/> 
                                <span className="hidden sm:inline">Login</span>
                            </Button>
                        </Link>
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
                    <div className="lg:hidden w-3/5 fixed top-17 right-0 px-4 py-4 bg-white border-t shadow-lg h-screen">
                        <div className='flex flex-col gap-4 mt-4'>
                            <Button 
                                variant="outline"
                                className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200"
                                onClick={handleConnect}
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

                            <Link to="/login" className="w-full">
                                <Button 
                                    variant="outline" 
                                    size='default' 
                                    className="flex w-full items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="h-4 w-4 text-indigo-600"/> 
                                    <span>Login</span>
                                </Button>
                            </Link>
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