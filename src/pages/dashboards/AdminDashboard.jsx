import React, { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Users, ChartBar, Database, Settings, ChartPie } from 'lucide-react'
import { supabase } from '../../supabase'

export const AdminDashboard = () => {
  const [pendingVerifiers, setPendingVerifiers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingVerifiers()
  }, [])

  const fetchPendingVerifiers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('web3_users')
        .select('*')
        .eq('role', 'verifier')
        .eq('status', 'pending')

      if (error) throw error
      setPendingVerifiers(data || [])
    } catch (error) {
      console.error('Error fetching pending verifiers:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveVerifier = async (verifierId) => {
    try {
      const { error } = await supabase
        .from('web3_users')
        .update({ status: 'active' })
        .eq('id', verifierId)

      if (error) throw error
      
      // Refresh the list
      fetchPendingVerifiers()
    } catch (error) {
      console.error('Error approving verifier:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Statistics */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-gray-500">All registered users</p>
            </div>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold">125</p>
          </div>
        </Card>

        {/* Transaction Statistics */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Transactions</h3>
              <p className="text-gray-500">Today's transactions</p>
            </div>
            <ChartBar className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold">84</p>
          </div>
        </Card>

        {/* Storage Statistics */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Storage</h3>
              <p className="text-gray-500">Used/Total</p>
            </div>
            <Database className="h-6 w-6 text-purple-500" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold">75%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Management</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="text-xl font-bold">125</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="text-xl font-bold text-green-600">102</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Verifications</span>
              <span className="text-xl font-bold text-yellow-600">15</span>
            </div>
          </div>
          <Button className="mt-4 w-full">Manage Users</Button>
        </Card>

        {/* Verifier Management */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Verifiers</h3>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerifiers.map((verifier) => (
                <div key={verifier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{verifier.wallet_address.slice(0, 6)}...{verifier.wallet_address.slice(-4)}</span>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                  </div>
                  <Button
                    onClick={() => approveVerifier(verifier.id)}
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Approve
                  </Button>
                </div>
              ))}
              {pendingVerifiers.length === 0 && (
                <p className="text-gray-500 text-center">No pending verifiers</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}