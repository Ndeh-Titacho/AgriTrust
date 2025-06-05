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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'farmer', 'verifier', 'admin'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'pending', 'rejected'

  useEffect(() => {
    fetchPendingVerifiers()
    fetchAllUsers()
    fetchActiveUsers()
  }, [])

  useEffect(() => {
    handleSearch({ preventDefault: () => {} });
  }, [roleFilter, statusFilter]);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setIsSearching(true);
      let query = supabase
        .from('web3_users')
        .select('*');

      // Apply search query if exists
      if (searchQuery.trim()) {
        query = query.or(
          `wallet_address.ilike.%${searchQuery}%,
           email.ilike.%${searchQuery}%,
           full_name.ilike.%${searchQuery}%`
        );
      }

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Execute the query
      const { data, error } = await query;
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const { error } = await supabase
        .from('web3_users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

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
      <div className="mt-8">
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by wallet, email, or name"
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant='outline' type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="verifier">Verifiers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </form>
        
        {/* Search Results */}
        {isSearching ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((user) => (
              <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="mb-2 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{user.wallet_address}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'verifier' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  {user.email && <p className="text-sm text-gray-600">{user.email}</p>}
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  {user.status !== 'active' && (
                    <Button
                      onClick={() => updateUserStatus(user.id, 'active')}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      Activate
                    </Button>
                  )}
                  {user.status !== 'pending' && (
                    <Button
                      onClick={() => updateUserStatus(user.id, 'pending')}
                      variant="outline"
                      size="sm"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                    >
                      Set Pending
                    </Button>
                  )}
                  {user.status !== 'rejected' && (
                    <Button
                      onClick={() => updateUserStatus(user.id, 'rejected')}
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' 
              ? 'No users found matching your criteria' 
              : 'Search for users using the form above'}
          </p>
        )}
      </Card>
      </div>
    </div>
  )
}