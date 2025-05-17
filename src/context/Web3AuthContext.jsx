import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner'
import { supabase } from '../supabase';

const Web3AuthContext = createContext();

export const Web3AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWallet = async (requestedRole) => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask")
        return
      }

      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Check if user exists and has the requested role
      let { data: user, error } = await supabase
        .from('web3_users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (requestedRole && (!user || user.role !== requestedRole)) {
        throw new Error(`Not authorized as ${requestedRole}`);
      }

      setAccount(address);
      setUserRole(user?.role || null);
      toast.success("Wallet connected successfully", { id: 'wallet' })
      
      return { address, role: user?.role };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error("Failed to connect wallet")
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setUserRole(null);
  };

  return (
    <Web3AuthContext.Provider value={{
      account,
      userRole,
      loading,
      connectWallet,
      disconnectWallet,
      isAdmin: userRole === 'admin'
    }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};