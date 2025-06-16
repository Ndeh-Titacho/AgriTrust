import React, { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle2, Clock, FileText, ShieldCheck, ClipboardList, CheckCircle, Bell, X } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { supabase } from '../../supabase'
import { PendingVerifications } from '@/components/sections/PendingVerifications'
import { CompletedVerifications } from '@/components/sections/CompletedVerifications'
import { VerificationStage } from '@/components/sections/VerificationStage'
import toast from 'react-hot-toast'

export const VerifierDashboard = () => {
  const { account, status } = useWallet()
  const [userStatus, setUserStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productsToVerify, setProductsToVerify] = useState([])
  const [verificationHistory, setVerificationHistory] = useState([])
  const [activeComponent, setActiveComponent] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [verificationRequests, setVerificationRequests] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

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

  // Fetch verification requests for the current verifier
  const fetchVerificationRequests = async () => {
    if (!account) {
      console.log('No account connected');
      return;
    }
    
    try {
      console.log('Fetching verification requests for account:', account);
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*') // Changed from verifier_id to verifier_wallet to match your schema
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched verification requests:', data);
      setVerificationRequests(data || []);
      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error in fetchVerificationRequests:', error);
      if (toast) {
        toast.error('Failed to load verification requests');
      } else {
        console.error('Toast is not available');
      }
    }
  };

  // Update verification request status
  const updateRequestStatus = async (requestId, status) => {
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      
      // Refresh the requests list
      await fetchVerificationRequests();
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
      return false;
    }
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Mark as read when opening
    if (!showNotifications && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  // Set up real-time subscription for verification requests
  useEffect(() => {
    if (!account) return;

    fetchVerificationRequests();
    
    const subscription = supabase
      .channel('verification_requests')
      .on('postgres_changes', 
        { 
          event: '*',
          schema: 'public',
          table: 'verification_requests',
          filter: `verifier_id=eq.${account}`
        }, 
        (payload) => {
          fetchVerificationRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [account]);

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
             <h1 className="text-3xl font-bold">Verifier Dashboard </h1>
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
             <h1 className="text-3xl font-bold">Verifier Dashboard </h1>
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
    <div className="min-h-screen bg-gray-50 relative">
     
        <div className='flex flex-col items-start justify-start'>
             <h1 className="text-3xl font-bold">Verifier Portal</h1>
             <div className='grid grid-cols-1 md:grid-cols-2  w-full '>
             <span className='text-gray-600 text-left'>Evaluate farms and issue blockchain certificates</span>
            
             </div>
             </div>
      {/* Notification Bell */}
      <div className="absolute top-8 right-8">
        <button 
          onClick={toggleNotifications}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Verification Requests</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {verificationRequests.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No pending verification requests
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {verificationRequests.map((request) => (
                    <li key={request.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            New Verification Request
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              const success = await updateRequestStatus(request.id, 'approved');
                              if (success) {
                                toast.success('Request approved');
                              }
                            }}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              const success = await updateRequestStatus(request.id, 'rejected');
                              if (success) {
                                toast.success('Request rejected');
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
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

      <div>
        <VerificationStage/>
      </div>
    </div>
  );
}
