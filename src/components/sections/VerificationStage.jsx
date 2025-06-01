import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { ethers } from "ethers"
import FarmSupplyChain from "../../abi/FarmSupplyChain.json"
import { useState } from 'react'
import { toast } from 'sonner'

export const VerificationStage = () => {

    const [loading, setLoading] = useState(false)
    const [verifications, setVerifications] = useState([])
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"


    const fetchVerifications = async(pid) =>{
      try {
        setLoading(true)
    
        // Check if MetaMask is installed
        if (!window.ethereum) {
          throw new Error('Please install MetaMask')
        }
    
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' })
    
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer)
        
        // Convert pid to BigNumber if it's a number
        const productId = ethers.BigNumber.from(pid)
        
        const data = await contract.getProductVerifications(productId)
        toast.success("Verification progress fetched successfully")
        
        // Convert the data to a more readable format
        const formattedData = data.map(verification => ({
          pid: ethers.BigNumber.from(verification.pid).toString(),
          stage: ethers.BigNumber.from(verification.stage).toString(),
          status: verification.status.toString(),
          comments: verification.comments,
          verifier: verification.verifier,
          timestamp: new Date(verification.timestamp * 1000).toLocaleString()
        }))
        
        setVerifications(formattedData)
        
      } catch (error) {
        console.error("Error fetching verification progress:", error)
        toast.error(error.message || "Failed to fetch verification progress")
      } finally {
        setLoading(false)
      }
    }
    
  return (
    <div>
         {/*Verification Progress*/}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <h2 className="text-2xl font-semibold flex-1 text-black">Verification Progress</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const pid = document.getElementById('pid').value.trim();
              
              if (!pid) {
                toast.error('Please enter a valid product ID');
                return;
              }

              fetchVerifications(pid);
            }} className="flex gap-2">
              <input 
                type="text" 
                name="pid" 
                id="pid" 
                placeholder="Enter product ID"
                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-white"
                required
              />
              <Button variant="secondary" type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors duration-200">
                Get Progress
              </Button>
            </form>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Verification Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-emerald-300 transition-colors duration-200">
                <h4 className="font-medium text-emerald-600 mb-2">Stages</h4>
                <ul className="space-y-2">
                  <li className="text-emerald-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    0: Planting Stage
                  </li>
                  <li className="text-emerald-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    1: Mid-Growth Stage
                  </li>
                  <li className="text-emerald-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    2: Harvest Stage
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-emerald-300 transition-colors duration-200">
                <h4 className="font-medium text-emerald-600 mb-2">Status</h4>
                <ul className="space-y-2">
                  <li className="text-yellow-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    0: Pending
                  </li>
                  <li className="text-emerald-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    1: Approved
                  </li>
                  <li className="text-red-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    2: Rejected
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse mt-8">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ) : verifications.length > 0 ? (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-black mb-4">Verification History</h3>
              <div className="space-y-4">
                {verifications.map((verification, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg bg-white shadow-sm border-gray-100 hover:border-emerald-300 transition-colors duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-600">Product ID:</p>
                        <p className="text-gray-900">{verification.pid}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Stage:</p>
                        <p className="text-gray-900">{verification.stage}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Status:</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            verification.status === '0' ? 'bg-yellow-500' :
                            verification.status === '1' ? 'bg-emerald-500' :
                            verification.status === '2' ? 'bg-red-500' : 'bg-gray-400'
                          }`}>
                          </span>
                          <p className={` text-gray-900 ${
                            verification.status === '0' ? 'text-yellow-500' :
                            verification.status === '1' ? 'text-emerald-600' :
                            verification.status === '2' ? 'text-red-600' : ''
                          }`}>
                            {verification.status}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Verifier:</p>
                        <p className="text-gray-900">{verification.verifier}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Comments:</p>
                        <p className="text-gray-900">{verification.comments}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Timestamp:</p>
                        <p className="text-gray-900">{verification.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-8">No verification data available</p>
          )}<div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4">
            <div className="flex flex-col gap-4">
              {verifications.map((verification, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  {/* Status and Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {/* Status indicator and text */}
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          verification.status === '0'
                            ? 'bg-yellow-400'
                            : verification.status === '1'
                            ? 'bg-emerald-500'
                            : verification.status === '2'
                            ? 'bg-red-500'
                            : 'bg-gray-400'
                        }`}
                      ></span>
                      <p
                        className={`text-gray-900 ${
                          verification.status === '0'
                            ? 'text-yellow-500'
                            : verification.status === '1'
                            ? 'text-emerald-600'
                            : verification.status === '2'
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {verification.status}
                      </p>
                    </div>
                  </div>
                  {/* Details Section */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-600">Verifier:</p>
                    <p className="text-gray-900 break-all text-xs sm:text-sm">
                      {verification.verifier}
                    </p>
                    <p className="font-medium text-gray-600 mt-2">Comments:</p>
                    <p className="text-gray-900 break-words text-xs sm:text-sm">{verification.comments}</p>
                    <p className="font-medium text-gray-600 mt-2">Timestamp:</p>
                    <p className="text-gray-900 text-xs sm:text-sm">{verification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
