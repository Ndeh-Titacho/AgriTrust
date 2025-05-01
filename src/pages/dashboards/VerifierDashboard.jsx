import React, { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle2, Clock, FileText, ShieldCheck, ClipboardList, CheckCircle } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { supabase } from '../../supabase'
import { PendingVerifications } from '@/components/sections/PendingVerifications'
import { CompletedVerifications } from '@/components/sections/CompletedVerifications'


export const VerifierDashboard = () => {
  const { account, status } = useWallet()
  const [userStatus, setUserStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productsToVerify, setProductsToVerify] = useState([])
  const [verificationHistory, setVerificationHistory] = useState([])
  const [activeComponent, setActiveComponent] = useState('')

  useEffect(() => {
    fetchUserStatus()
    if (userStatus === 'active') {
      fetchProductsToVerify()
      fetchVerificationHistory()
    }
  }, [account, userStatus])

  const fetchUserStatus = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('web3_users')
        .select('status')
        .eq('wallet_address', account)
        .single()

      if (error) throw error
      setUserStatus(data.status)
    } catch (error) {
      console.error('Error fetching user status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductsToVerify = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('verification_status', 'pending')
        .limit(5)

      if (error) throw error
      setProductsToVerify(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVerificationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('verifier_address', account)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setVerificationHistory(data || [])
    } catch (error) {
      console.error('Error fetching verification history:', error)
    }
  }

  const handleVerifyProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          verification_status: 'verified',
          verified_by: account,
          verified_at: new Date().toISOString()
        })
        .eq('id', productId)

      if (error) throw error
      
      // Add to verification history
      await supabase
        .from('verifications')
        .insert({
          product_id: productId,
          verifier_address: account,
          created_at: new Date().toISOString()
        })

      // Refresh lists
      fetchProductsToVerify()
      fetchVerificationHistory()
    } catch (error) {
      console.error('Error verifying product:', error)
    }
  }

  const mobileButton = "text-left px-4 py-2 rounded-md"

  if (loading) {
    return (
      <div className='flex flex-col items-start justify-start'>
             <h1 className="text-3xl font-bold">Verifier Portal </h1>
             <div className='grid grid-cols-1 md:grid-cols-2  w-full '>
             <span className='text-gray-600 text-left'>Evaluate farms and issue blockchain certificates</span>
            
             </div>
             </div>
    )
  }

  if (userStatus === 'pending') {
    return (
      <div className="p-6">
          <div className='flex flex-col items-start justify-start'>
             <h1 className="text-3xl font-bold">Verifier Portal</h1>
             <div className='grid grid-cols-1 md:grid-cols-2  w-full '>
             <span className='text-gray-600 text-left'>Evaluate farms and issue blockchain certificates</span>
            
             </div>
             </div>

        

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <h2 className="text-xl font-semibold text-yellow-900">
                Pending Approval
              </h2>
              <p className="text-gray-600">
                Your verifier status is currently pending approval from the admin.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Status: Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Wallet Address:</span>
              <span className="font-mono text-gray-900">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Estimated Approval Time:</span>
              <span className="text-gray-900">1-2 business days</span>
            </div>
          </div>

          <Button 
            onClick={fetchUserStatus}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600"
          >
            Check Status
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
        <div className='flex flex-col items-start justify-start'>
             <h1 className="text-3xl font-bold">Verifier Portal</h1>
             <div className='grid grid-cols-1 md:grid-cols-2  w-full '>
             <span className='text-gray-600 text-left'>Evaluate farms and issue blockchain certificates</span>
            
             </div>
             </div>
      {/* Navigation Section */}
      <nav className="nav mt-8">
        <ul className="flex flex-col sm:flex-row gap-3 w-full">
          <li className="flex flex-row w-full gap-2">
            <Button 
              variant="ghost" 
              size="default" 
              className={`flex-1 justify-center sm:justify-start rounded-lg font-semibold border border-indigo-100 bg-white hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${activeComponent === 'Pending' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : ''} ${mobileButton}`}
              onClick={() => setActiveComponent("Pending")}
            >
              Pending Verifications
            </Button>
            <Button 
              variant="ghost" 
              size="default" 
              className={`flex-1 justify-center sm:justify-start rounded-lg font-semibold border border-indigo-100 bg-white hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${activeComponent === 'Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : ''} ${mobileButton}`}
              onClick={() => setActiveComponent("Completed")}
            >
              Completed Verifications
            </Button>
          </li>
        </ul>
      </nav>

      <div className="mt-4">
        {activeComponent === 'Pending' && (
          <PendingVerifications />
        )}
        {activeComponent === 'Completed' && (
          <CompletedVerifications />
        )}
        {/* You can add more components here for other tabs */}
      </div>
    </div>
  );
}
