import React, { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle2, Clock, FileText, ShieldCheck, ClipboardList, CheckCircle } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { supabase } from '../../supabase'

export const VerifierDashboard = () => {
  const { account, status } = useWallet()
  const [userStatus, setUserStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productsToVerify, setProductsToVerify] = useState([])
  const [verificationHistory, setVerificationHistory] = useState([])

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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'pending')
        .limit(5)

      if (error) throw error
      setProductsToVerify(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
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
          status: 'verified',
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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Verifier Dashboard</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    )
  }

  if (userStatus === 'pending') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Verifier Dashboard</h1>

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
      <h1 className="text-2xl font-bold mb-6">Verifier Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Products to Verify */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Products to Verify</h3>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">{productsToVerify.length} pending</span>
            </div>
          </div>

          <div className="space-y-4">
            {productsToVerify.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.description?.slice(0, 50)}...</p>
                </div>
                <Button
                  onClick={() => handleVerifyProduct(product.id)}
                  variant="outline"
                  size="sm"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Verify
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Verification History</h3>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">{verificationHistory.length} verified</span>
            </div>
          </div>

          <div className="space-y-4">
            {verificationHistory.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-medium">{verification.product_name}</h4>
                  <p className="text-sm text-gray-500">
                    Verified on {new Date(verification.created_at).toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Button className="w-full"
             variant="outline">
             
              <ShieldCheck className="h-5 w-5 mr-2" />
              Verify Multiple Products
            </Button>
            <Button variant="outline" className="w-full">
              <ClipboardList className="h-5 w-5 mr-2" />
              View All History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
