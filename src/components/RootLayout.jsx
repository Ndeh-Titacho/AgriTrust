import React from 'react'
import { Navbar } from './layouts/Navbar'
import { Footer } from './layouts/Footer'
import { Outlet } from 'react-router-dom'

export const RootLayout = () => {
  return (
    <div>
        <Navbar/>
        <div className='min-h-screen'>
           <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}
