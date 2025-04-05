import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Explore = () => {
  return (
    <div className='px-8'>
      <h1 className='text-4xl font-semibold py-2'>Ready to Join the Agricultural Revolution?</h1>
      <h2 className='text-gray-600'>Whether you're a farmer looking for fair prices, a consumer wanting transparent products, or a verifier ensuring authenticity — AgriTrust is your platform.</h2>

      <div className='mt-6'>
        <Link to="/login"> <Button 
          variant="secondary" 
          size="lg" 
          className="group relative w-full sm:w-auto rounded-full 
            bg-green-600 hover:bg-green-700 active:bg-green-700
            text-white py-3 px-6 touch-manipulation
            transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          onClick={() => console.log('Explore clicked')}
        > 
          Explore the Marketplace
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300"/>
        </Button></Link>
        
      </div>
    </div>
  )
}
