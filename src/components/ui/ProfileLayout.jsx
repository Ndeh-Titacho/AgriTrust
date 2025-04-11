import React from 'react'
import { Navbar } from '../layouts/afterAuthUI/Navbar'
import { Footer } from '../layouts/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/supabaseAuthContext'

export const ProfileLayout = () => {
  const { selectedRole } = UserAuth()
  const navigate = useNavigate()

  // Redirect if no role is selected
  React.useEffect(() => {
    if (!selectedRole) {
      navigate('/')
    }
  }, [selectedRole, navigate])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[70px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

