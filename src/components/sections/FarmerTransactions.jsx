import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import FarmSupplyChain from "../../abi/FarmSupplyChain.json"

const getTransactionType = (type) => {
    // Match the TransactionType enum from the smart contract
    switch (Number(type)) {
        case 0:
            return 'Crop Sale'
        case 1:
            return 'Crowdfunding'
        default:
            return 'Unknown'
    }
}

export const FarmerTransactions = () => {
    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [walletAddress, setWalletAddress] = useState('')
    const [ethToFcfaRate, setEthToFcfaRate] = useState(3500000) // Default rate from contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    // Get wallet address when component mounts
    useEffect(() => {
        const getWalletAddress = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    })
                    setWalletAddress(accounts[0])
                } catch (error) {
                    console.error("Error connecting to wallet:", error)
                }
            }
        }
        getWalletAddress()
    }, [])

    // Fetch transactions when wallet address is available
    useEffect(() => {
        if (walletAddress) {
            fetchFarmerTransactions(walletAddress)
        }
    }, [walletAddress])

    // Add this useEffect to get the current rate from contract
    useEffect(() => {
        const getEthToFcfaRate = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, provider)
                    const rate = await contract.ethToFcfaRate()
                    setEthToFcfaRate(rate.toNumber())
                } catch (error) {
                    console.error("Error fetching ETH to FCFA rate:", error)
                }
            }
        }
        getEthToFcfaRate()
    }, [])

    // Add this function to convert ETH to FCFA
    const weiToFcfa = (weiAmount) => {
        const ethAmount = ethers.utils.formatEther(weiAmount)
        const fcfaAmount = (parseFloat(ethAmount) * ethToFcfaRate).toFixed(0)
        return new Intl.NumberFormat('fr-FR').format(fcfaAmount) + ' FCFA'
    }

    const parseTransaction = (transaction) => {
        try {
            console.log('Raw transaction:', transaction)
            
            const parsedTransaction = {
                tid: transaction.tid ? transaction.tid.toString() : '0',
                pid: transaction.pid ? transaction.pid.toString() : '0',
                from: transaction.from || '',
                to: transaction.to || '',
                amount: weiToFcfa(transaction.amount || 0), // Convert to FCFA here
                timestamp: transaction.timestamp ? 
                    new Date(transaction.timestamp.toNumber() * 1000).toLocaleString() : 
                    new Date().toLocaleString(),
                transaction_type: getTransactionType(Number(transaction.transaction_type))
            }
            
            console.log('Parsed transaction:', parsedTransaction)
            return parsedTransaction
        } catch (error) {
            console.error('Error parsing transaction:', error)
            console.log('Problematic transaction:', transaction)
            return null
        }
    }

    const fetchFarmerTransactions = async (farmerAddress) => {
        try {
            setLoading(true)

            if (!window.ethereum) {
                throw new Error('Please install MetaMask')
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer)

            const data = await contract.getFarmerTransactions(farmerAddress)
            console.log('Raw transaction data:', data)

            const formattedData = data
                .map(parseTransaction)
                .filter(transaction => transaction !== null)
                .slice(-5) // Get the last 5 transactions

            console.log('Formatted transactions:', formattedData)
            setTransactions(formattedData)

        } catch (error) {
            console.error("Error fetching farmer transactions:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full overflow-x-auto shadow-md rounded-lg">
            {loading ? (
                <div className="animate-pulse mt-8">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
            ) : transactions.length > 0 ? (
                <div className="min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TxID</th>
                                {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th> */}
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="w-24 truncate">From</div>
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="w-24 truncate">To</div>
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (FCFA)</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="w-16 truncate">{transaction.tid}</div>
                                    </td>
                                    {/* <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="w-16 truncate">{transaction.pid}</div>
                                    </td> */}
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="w-24 truncate" title={transaction.from}>
                                            {transaction.from}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="w-24 truncate" title={transaction.to}>
                                            {transaction.to}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="w-20 truncate">{transaction.amount}</div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="w-24 truncate">{transaction.transaction_type}</div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="w-32 truncate">{transaction.timestamp}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-8">No transactions available</p>
            )}
        </div>
    )
}
