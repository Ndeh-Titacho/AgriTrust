import React from 'react'
import { Leaf, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export const HeroSection = () => {
  return (
    <div className="flex min-h-[75vh] md:min-h-[calc(100vh-5rem)] items-center justify-center md:pt-20">
        <section className='w-full max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8'>
            {/* Badge Section */}
            <div className="flex items-center justify-center">
                <Badge className="px-4 py-2 text-base font-medium rounded-full text-green-800 bg-green-200">
                    <Leaf className="h-5 w-5 mr-2"/> Transparent. Trusted. Traceable.
                </Badge>
            </div>

            {/* Heading Section */}
            <div className="space-y-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">The Future of</h2>
                <div className="space-x-3">
                    <span className="text-4xl sm:text-6xl font-bold text-green-600">Agricultural</span> 
                    <span className="text-4xl block md:inline sm:text-6xl font-bold text-indigo-400">Trust</span>
                </div>
            </div>

            {/* Description Section */}
            <div className="flex justify-center">
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl text-center leading-relaxed">
                    AgriTrust connects farmers, consumers, verifiers, and financial institutions 
                    through blockchain technology — creating unparalleled transparency in the 
                    agricultural supply chain.
                </p>
            </div>

            {/* Button Section - Updated */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0'>
                <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full sm:w-auto rounded-full bg-green-600 hover:bg-green-700 
                      active:bg-green-800 text-white py-6 sm:py-3 text-lg sm:text-base
                      transition-all duration-200 touch-manipulation"
                    onClick={() => console.log('Get Started clicked')}
                >
                    Get Started <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto rounded-full hover:bg-blue-500 hover:text-white
                      active:bg-blue-600 py-6 sm:py-3 text-lg sm:text-base
                      transition-all duration-200 touch-manipulation"
                    onClick={() => console.log('Learn More clicked')}
                >
                    Learn More
                </Button>
            </div>
        </section>
    </div>
  )
}
