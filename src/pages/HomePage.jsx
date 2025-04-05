import React from 'react'
import { Navbar } from '../components/layouts/navbar'
import { HeroSection } from '../components/sections/HeroSection'
import { Role } from '../components/sections/Role'
import { Benefits } from '@/components/sections/Benefits'
import { Statistic } from '@/components/sections/Statistic'
import { Explore } from '@/components/sections/Explore'
import { Footer } from '@/components/layouts/Footer'

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-green-100">
      <Navbar/>
      <main className="w-full">
        <div className="w-full">
          <HeroSection/>
          <Role/>
          <Benefits/>
          <Statistic/>
        </div>
        <div className="w-full bg-green-100">
          <Explore/>
        </div>
      </main>
      <Footer/>
    </div>
  )
}