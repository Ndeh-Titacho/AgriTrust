import React from 'react'
import { Navbar } from './layouts/Navbar'
import { Footer } from './layouts/Footer'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

export const RootLayout = () => {
  return (
    <div>
        <Navbar/>
        <div className='min-h-screen'>
           <Outlet/>
        </div>
        <Footer/>
        <Toaster position="top-right" />
    </div>
  )
}
