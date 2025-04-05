import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../ui/card"
  import { ShieldCheck,Link,ChartLine  } from 'lucide-react';

export const Benefits = () => {
  return (
    <div className='max-w-4xl mx-auto mt-40'>
        <h1 className='text-4xl font-semibold'>Powered by Blockchain Technology</h1>
        <h2 className='mt-5 text-gray-600'>Leveraging blockchain for immutable records, transparent transactions, and verifiable certifications across the agricultural supply chain.
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
            <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-green-400 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
             Verified Certifications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600 text-left'> Organic, Fair Trade, and other certifications verified and stored on blockchain for ultimate authenticity.</p>

            </CardContent>

            </Card>

            <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-indigo-500 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <Link className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
             Verified Certifications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600 text-left'> Every step from farm to table is recorded on blockchain, creating unalterable proof of origin and journey.</p>

            </CardContent>

            </Card>

            <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-blue-300 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <ChartLine className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
             Verified Certifications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600 text-left'> Financial institutions can access verified farm data for fairer loan assessments and faster approvals.</p>

            </CardContent>

            </Card>
        </div>
    </div>
  )
}
