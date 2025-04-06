import React, { createContext, useContext, useState } from 'react'
import { ethers } from 'ethers'
import { supabase } from '../supabase'

const WalletContext = createContext({})

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState("")
  const [status, setStatus] = useState("")

  const storeWalletInfo = async (address, selectedRole) => {
    try {
      // Create a clean object with only the data we want to store
      const userData = {
        wallet_address: address,
        role: selectedRole,
        status: status,
        auth_type: 'web3',
        last_connected: new Date().toISOString()
      }
      console.log('Status before storage:', status);

      const { error } = await supabase
        .from('web3_users')
        .upsert(userData, {
          onConflict: 'wallet_address',
          returning: 'minimal'
        })

      if (error) throw error
      
      setUserRole(selectedRole)
      console.log('Wallet info stored successfully')
      
    } catch (error) {
      console.error('Error storing wallet info:', error)
      setError(error.message)
    }
  }

  const checkExistingWallet = async (address) => {
    try {
      const { data, error } = await supabase
        .from('web3_users')
        .select('role')
        .eq('wallet_address', address)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found - new wallet
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error checking wallet:', error)
      setError(error.message)
      return null
    }
  }

  const connectWallet = async (selectedRole = null) => {
    try {
      setLoading(true)
      setError("")
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to connect wallet")
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })

      const account = accounts[0]
      
      // Check if wallet exists
      const existingUser = await checkExistingWallet(account)
      
      if (existingUser) {
        // Wallet exists - set role from database
        setAccount(account)
        setUserRole(existingUser.role)
        console.log(`Existing user found with role: ${existingUser.role}`)
        
        if (selectedRole && existingUser.role !== selectedRole) {
          throw new Error(`This wallet is already registered as a ${existingUser.role}`)
        }
      } else {
        // New wallet - proceed with registration
        if (!selectedRole) {
          throw new Error("Please select a role to register")
        }
        
        // Set status first
        if(selectedRole === 'verifier'){
          setStatus('pending')
          console.log('Setting status to pending')
        } else {
          setStatus('active')
          console.log('Setting status to active')
        }
        
        // Wait for state update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('Current status after setting:', status);
        
        setAccount(account)
        await storeWalletInfo(account, selectedRole)
      }

      // Initialize ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      console.log("Connected to:", network.name)

      // Listen for account changes with existing user check
      window.ethereum.on('accountsChanged', async (accounts) => {
        const newAccount = accounts[0] || ""
        if (newAccount) {
          const existingUser = await checkExistingWallet(newAccount)
          setAccount(newAccount)
          if (existingUser) {
            setUserRole(existingUser.role)
          } else {
            setUserRole("")
          }
        } else {
          setAccount("")
          setUserRole("")
        }
      })

    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError(error.message)
      setAccount("")
      setUserRole("")
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount("")
    setUserRole("")
  }

  

 

  return (
    <WalletContext.Provider value={{
      account,
      loading,
      error,
      userRole,
      connectWallet,
      disconnectWallet,
      
      isConnected: Boolean(account),
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context;
};