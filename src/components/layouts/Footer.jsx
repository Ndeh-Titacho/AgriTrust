import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../ui/card"
  import { Wheat } from 'lucide-react';
  import { FaXTwitter,FaGithub, FaLink,FaRegEnvelope  } from "react-icons/fa6";
  import { ArrowUp } from 'lucide-react'

export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className='mt-20'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 border-y py-10'>
          <div>
               <CardHeader className="flex space-y-4">
                       <CardTitle className="bg-green-400 w-[50px] h-[50px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
                         <Wheat className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
                       </CardTitle>
                       <CardDescription className="  font-bold flex items-center justify-center align-center text-4xl sm:text-xl h-[50px]  bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text">
                         AgriTrust
                       </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-start  w-2/3">
                    <p className='text-sm text-gray-600 text-left'>Bringing transparency and trust to the agricultural supply chain through blockchain technology.</p>
                </CardContent>
                <CardFooter className='flex justify-between w-40 mt-5'>
                    <a href=''><FaXTwitter/></a>
                    <a href=''><FaGithub/></a>
                    <a href=""> < FaLink/></a>
                    <a href=""><FaRegEnvelope /></a>
                </CardFooter>
          </div>

          <div>
               <CardHeader className="flex space-y-4">
                       <CardTitle  className='text-gray-600'>
                       FOR FARMERS
                       </CardTitle>
                 
                </CardHeader>
                <CardContent className="flex flex-col justify-start text-left mt-5 gap-4">
                    <a href='' className='text-sm text-gray-600'> Dashboard</a>
                    <a href='' className='text-sm text-gray-600'> List Products</a>
                    <a href='' className='text-sm text-gray-600'> Apply for Verification</a>
                    <a href='' className='text-sm text-gray-600'> Funding Options</a>
                </CardContent>
               
          </div>

          <div>
               <CardHeader className="flex space-y-4">
                       <CardTitle className='text-gray-600'>
                      FOR CONSUMERS
                       </CardTitle>
                 
                </CardHeader>
                <CardContent className="flex flex-col justify-start text-left mt-5 gap-4">
                    <a href='' className='text-sm text-gray-600'> Marketplace</a>
                    <a href='' className='text-sm text-gray-600'> Verify Products</a>
                    <a href='' className='text-sm text-gray-600'> Support Farmers</a>
                    <a href='' className='text-sm text-gray-600'> Learn About Certifications</a>
                </CardContent>
               
          </div>

          <div>
               <CardHeader className="flex space-y-4">
                       <CardTitle className='text-gray-600'>
                       FOR VERIFIERS
                       </CardTitle>
                 
                </CardHeader>
                <CardContent className="flex flex-col justify-start text-left mt-5 gap-4">
                    <a href='' className='text-sm text-gray-600'> Verifier Portal</a>
                    <a href='' className='text-sm text-gray-600'> Evaluation Process</a>
                    <a href='' className='text-sm text-gray-600'> Issue Certificates</a>
                    <a href='' className='text-sm text-gray-600'> Blockchain Integration</a>
                </CardContent>
               
          </div>
        </div>
        <div className='text-gray-600 py-8 px-2 flex flex-col  justify-center md:flex-row md:justify-between '>
            <div>
            <p>&copy; {new Date().getFullYear()} AgriTrust. All rights reserved.</p> 
            </div>
            <div className='flex gap-4 justify-center'>
                <a href="">Privacy Policy</a>
                <a href="">Terms of Service</a>
                <a href=""> Contact Us</a>
            </div>
        </div>
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
    </div>
  )
}
