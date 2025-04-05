import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Wallet, User, Menu, X } from 'lucide-react';
import { Button } from "../../components/ui/button"
import { useState } from 'react';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const spacing = `flex justify-between items-center`;
    const button = `hover:bg-blue-500 hover:text-white active:bg-blue-600 transition-all duration-200 touch-manipulation px-6 py-3 rounded-lg`;
    const mobileButton = `py-4 text-base touch-manipulation active:bg-gray-100 transition-all duration-200`;
    
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
                        <Button variant='secondary' size='default' className={`${button} border`}>
                            <Wallet className="mr-2 h-4 w-4"/> Connect Wallet
                        </Button>
                        <Button variant="secondary" size='default' className={`${button} border`}>
                            <User className="mr-2 h-4 w-4"/> <Link to="/login">Login</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden w-3/5 fixed top-17 right-0 px-4 py-4 bg-white border-t shadow-lg h-screen transform transition-transform duration-300 ease-in-out border-1">
                        <div className='flex flex-col gap-4 mt-4'>
                            <Button 
                                variant='secondary' 
                                size='default' 
                                className="group border justify-start hover:bg-blue-500 [&:hover>*]:text-white active:bg-blue-600 transition-all duration-200 touch-manipulation"
                                onClick={() => console.log('Connect Wallet')}
                            >
                                <Wallet className="mr-2 h-5 w-5"/> 
                                <span>Connect Wallet</span>
                            </Button>
                            <Button 
                                variant="secondary" 
                                size='default' 
                                className="group border justify-start hover:bg-blue-500 [&:hover>*]:text-white active:bg-blue-600 transition-all duration-200 touch-manipulation"
                                onClick={() => console.log('Login')}
                            >
                                <User className="mr-2 h-5 w-5"/> 
                                <span> <Link to="/login">Login</Link></span>
                            </Button>
                        </div>
                        <div className='px-4 py-4'>
                            <ul className='space-y-4'>
                                <li>
                                    <Button 
                                        variant="ghost" 
                                        size="default" 
                                        className={`w-full justify-start ${mobileButton}`}
                                    >
                                        Home
                                    </Button>
                                </li>
                                <li>
                                    <Button 
                                        variant="ghost" 
                                        size="default" 
                                        className={`w-full justify-start ${mobileButton}`}
                                    >
                                        Dashboard
                                    </Button>
                                </li>
                                <li>
                                    <Button 
                                        variant="ghost" 
                                        size="default" 
                                        className={`w-full justify-start ${mobileButton}`}
                                    >
                                        About
                                    </Button>
                                </li>
                                <li>
                                    <Button 
                                        variant="ghost" 
                                        size="default" 
                                        className={`w-full justify-start ${mobileButton}`}
                                    >
                                        Contact
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}