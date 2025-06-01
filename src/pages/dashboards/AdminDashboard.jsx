import React, { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Users, ChartBar, Database, Settings, ChartPie } from 'lucide-react'
import { supabase } from '../../supabase'
import { toast } from 'sonner'
import { ethers } from "ethers"
import FarmSupplyChain from "../../abi/FarmSupplyChain.json"
import { VerificationStage } from '../../components/sections/VerificationStage'

export const AdminDashboard = () => {
  const [pendingVerifiers, setPendingVerifiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState(0)
  const [activeUsers,setActiveUsers] = useState(0)

  useEffect(() => {
    fetchPendingVerifiers()
    fetchAllUsers()
    fetchActiveUsers()
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
      alert(error.message || 'Failed to fetch pending verifiers')
    } finally {
      setLoading(false)
    }
  }

  const approveVerifier = async (verifierId) => {
    try {
  // Find the selected verifier by their ID
  const verifier = pendingVerifiers.find((verifier) => verifier.id === verifierId);
  if (!verifier) {
    throw new Error('Verifier not found');
  }

  // Log the wallet address to verify it is correct
  console.log("Wallet Address:", verifier.wallet_address);

  // Ensure the wallet address is valid
  if (!ethers.utils.isAddress(verifier.wallet_address)) {
    throw new Error("Invalid Ethereum address");
  }

  // Upload to blockchain
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);

  const account = verifier.wallet_address; // Correct address of the verifier
  const tx = await contract.addVerifier(account);

  const receipt = await tx.wait();
  console.log("Verifier added! TX:", receipt.transactionHash);
  toast.success("Verifier added successfully!", verifier)

            
               
                 // Filter for a specific event by name
            const VerifierAddedEvents = receipt.events?.filter(
              (x) => x.event === "VerifierAdded"
            );
            
            if (VerifierAddedEvents && VerifierAddedEvents.length > 0) {
              const event = VerifierAddedEvents[0];
              const verifier = event.args.verifier.toString();
              console.log("VerifierAdded event args:", ...event.args, verifier);
              alert("Verifier added successfully!", verifier)
            }


      const { error } = await supabase
        .from('web3_users')
        .update({ status: 'active' })
        .eq('id', verifierId)

      if (error) throw error
      alert('Verifier approved successfully!')
      // Refresh the list
      fetchPendingVerifiers()
    } catch (error) {
      console.error('Error approving verifier:', error)
      alert(error.message || 'Failed to approve verifier')
    }
  }

  const rejectVerifier = async (verifierId) => {
    try {

   
      // Update the status in Supabase
      const { error } = await supabase
        .from('web3_users')
        .update({ status: 'rejected' })
        .eq('id', verifierId)
      if (error) throw error
      toast.success('Verifier rejected successfully!')
      // Refresh the list
      fetchPendingVerifiers()
    } catch (error) {
      console.error('Error rejecting verifier:', error)
      toast.error(error.message || 'Failed to reject verifier')
    }
  }
  


  const fetchAllUsers = async() => {
      try {
        const { count, error} = await supabase
        .from('web3_users')
        .select('id', {count: 'exact'})

        if (error) {
          throw error
        } else {
          setUserCount(count)
        }
      } catch (error) {
        console.error("Error fetching total Number of users",error)
      }
  }

  const fetchActiveUsers = async() => {
    try {
      const {data, error} = await supabase
      .from('web3_users')
      .select('*')
      .eq('status','active')

      if(error){
        throw error
      }else {
        setActiveUsers(data.length)
      }
    } catch (error) {
      console.error("Error fetching all active users",error)
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
            <p className="text-3xl font-bold">{userCount}</p>
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
              <span className="text-xl font-bold">{userCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="text-xl font-bold text-green-600">{activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Verifications</span>
              <span className="text-xl font-bold text-yellow-600">{pendingVerifiers.length}</span>
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
                    <span className="text-gray-600">{verifier.wallet_address.slice(0, 6)}...{verifier.wallet_address.slice(-15)}</span>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className='flex gap-2'>
                  <Button
                    onClick={() => approveVerifier(verifier.id)}
                    variant="outline"
                    size="sm"
                    className="bg-green-600 text-white hover:text-white hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => rejectVerifier(verifier.id)}
                    variant="outline"
                    size="sm"
                    className="bg-red-100 text-red-400 hover:text-red-500 hover:bg-red-200 border-red-500"
                  >
                    Reject
                  </Button>
                  </div>
                  
                </div>
              ))}
              {pendingVerifiers.length === 0 && (
                <p className="text-gray-500 text-center">No pending verifiers</p>
              )}
            </div>
          )}
        </Card>
      </div>
<div className="mt-6">
     <VerificationStage/>
</div>
    </div>
  )
}