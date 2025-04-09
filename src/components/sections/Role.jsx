import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/supabaseAuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Wheat, ShoppingBag, Award, Landmark } from 'lucide-react';

export const Role = () => {
  const navigate = useNavigate()
  const { handleRoleSelect } = UserAuth()

  const handleClick = (roleType) => {
    handleRoleSelect(roleType)
    navigate('/auth')
  }

  return (
    <div className='bg-white p-4 sm:p-6 lg:p-10 rounded-lg shadow-md max-w-4xl mx-auto'>
      <h2 className='text-2xl mb-4'>Choose Your Role</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Farmer Card */}
        <Card className="w-full relative z-10">
          <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-green-400 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <Wheat className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
              I am a Farmer
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600'>List products, get verified, and secure funding</p>
          </CardContent>
          <CardFooter className='flex justify-end px-4 py-2'>
            <button 
              className="bg-green-500 hover:bg-green-700 active:bg-green-700
                text-white py-3 px-6 rounded-lg w-full sm:w-auto
                touch-manipulation text-center text-base"
              onClick={() => handleClick('farmer')}
            >
              Enter
            </button>
          </CardFooter>
        </Card>

        {/* Consumer Card */}
        <Card className="w-full relative z-10">
          <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-blue-300 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
              I am a Consumer
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600'>Find verified products and support farmers</p>
          </CardContent>
          <CardFooter className='flex justify-end px-4 py-2'>
            <button 
              className="bg-blue-300 hover:bg-blue-500 active:bg-blue-500
                text-white py-3 px-6 rounded-lg w-full sm:w-auto
                touch-manipulation text-center text-base"
              onClick={() => handleClick('consumer')}
            >
              Enter
            </button>
          </CardFooter>
        </Card>

        {/* Verifier Card */}
        <Card className="w-full relative z-10">
          <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-indigo-400 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
              I am a Verifier
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600'>Evaluate farms and issue blockchain certificates</p>
          </CardContent>
          <CardFooter className='flex justify-end px-4 py-2'>
            <button 
              className="bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-500
                text-white py-3 px-6 rounded-lg w-full sm:w-auto
                touch-manipulation text-center text-base"
              onClick={() => handleClick('verifier')}
            >
              Enter
            </button>
          </CardFooter>
        </Card>

        {/* Financial Institution Card */}
        <Card className="w-full relative z-10">
          <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle className="bg-stone-600 w-[60px] flex items-center justify-center rounded-lg p-4 text-white group-hover:scale-110 transition-transform duration-300">
              <Landmark className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"/>
            </CardTitle>
            <CardDescription className="font-bold text-black text-base sm:text-lg">
              Financial Institution
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start">
            <p className='text-sm text-gray-600'>Access records and approve farm loans</p>
          </CardContent>
          <CardFooter className='flex justify-end px-4 py-2'>
            <button 
              className="bg-stone-600 hover:bg-stone-500 active:bg-stone-500
                text-white py-3 px-6 rounded-lg w-full sm:w-auto
                touch-manipulation text-center text-base"
              onClick={() => handleClick('financial')}
            >
              Enter
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
