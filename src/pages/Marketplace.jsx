import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Link, ShieldCheck, Tag, Search, Wheat, ChevronDown, ChevronUp, CircleAlert } from 'lucide-react'
import { Button } from '../components/ui/button'
import { supabase } from '../supabase'
import { toast } from "sonner"
import { Toaster } from "sonner"
import { motion } from 'framer-motion';
import { SupportCrowdfund } from '../components/sections/SupportCrowdfund'
import { PurchaseProduct } from '../components/sections/PurchaseProduct'
import { VerificationStage } from '../components/sections/VerificationStage'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";


export const Marketplace = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [products, setProducts] = useState([])
  const [crowdfunding, setCrowdfunding] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [viewVerificationPid, setViewVerificationPid] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchCrowdfunding()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('No products found')
      }
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error.message)
      toast.error(error.message || "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCrowdfunding = async () => {
    try {
      const { data, error } = await supabase
        .from('crowdfunding_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCrowdfunding(data || [])
    } catch (error) {
      console.error('Error fetching crowdfunding requests:', error)
      toast.error(error.message || "Failed to fetch crowdfunding requests")
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getImageSrc = (imageData) => {
    if (!imageData) return '/placeholder-image.jpg'
    // Check if it's a base64 data URL
    if (imageData.startsWith('data:')) {
      return imageData
    }
    // If it's a path, prepend the images directory
    return `/images/${imageData}`
  }

  const toggleDropdown = (productId) => {
    setOpenDropdown(prev => prev === productId ? null : productId);
  };


  
  return (
    <div className='font-poppins mt-10'>
      <Toaster />
      
      <header className='flex flex-col justify-start items-start'>
        <h1 className='font-bold text-4xl'>Marketplace</h1>
        <span className='text-gray-500'>Browse and purchase verified agricultural products</span>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mt-4 mb-8">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'marketplace' ? 'border-green-600 text-green-600 bg-gray-100' : 'border-transparent text-gray-500 bg-transparent'}`}
          onClick={() => setActiveTab('marketplace')}
        >
          Marketplace
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'crowdfund' ? 'border-green-600 text-green-600 bg-gray-100' : 'border-transparent text-gray-500 bg-transparent'}`}
          onClick={() => setActiveTab('crowdfund')}
        >
          Support Crowdfund
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'marketplace' && (
        <>
          {/* Search Form */}
          <div className='py-8'> 
            <Input 
              type='text' 
              placeholder="Search products..." 
              className="w-80"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              {error}
              <Button 
                variant="outline"
                className="mt-4"
                onClick={fetchProducts}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No products found matching "{searchQuery}"
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <div>
    <span className="font-semibold">Product ID:</span> {product.pid || 'N/A'}
  </div>
                    <CardHeader className="relative p-0">
                      <img 
                        src={getImageSrc(product.image_url)}
                        alt={product.name} 
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg'
                        }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge className="bg-blue-400 p-2">
                          <Link size={14}/>
                          On-Chain</Badge>
                          {product.verification_status === 'verified' && (
                            <Badge className="bg-gray-100 text-green-600 gap-1">
                              <ShieldCheck size={14}/>
                              Verified Farm</Badge>
                          )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        <div className='flex justify-between items-center text-black text-xl font-medium'>
                          <h1>{product.name}</h1>
                          <h1>{product.price} XAF</h1>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='flex gap-1 items-center'>
                            <Tag size={14}/>
                            <span className='text-gray-500'>
                            {product.type}
                          </span>
                          </span>
                          
                          <span className='text-gray-500'>
                            per unit
                          </span>
                        
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='flex gap-1 items-center'>
                            <Wheat size={14} className='text-green-600'/>
                            <span className='text-gray-500'>
                              {product.inventory} in stock
                            </span>
                          </span>
                          
                        </div>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: openDropdown === product.id ? 'auto' : 0,
                            opacity: openDropdown === product.id ? 1 : 0
                          }}
                          transition={{ 
                            duration: 0.3,
                            ease: "easeInOut"
                          }}
                          className='overflow-hidden'
                        >
                          <div className='flex flex-col items-start items-center mt-4'>
                          <p className='text-xl text-black font-medium '>Product Details</p>
                          <p className='mt-1 text-gray-600'>{product.description}</p>
                          </div>

                          <div className='flex justify-between items-center mx-0'>
                            <span className='flex items-center gap-1 mt-4 truncate'>
                              <CircleAlert size={14} className='text-blue-300'/>
                              <span className='text-gray-500'> Blockchain verified origin</span>
                            </span>
                            <span>
                              <Button
                               variant="link" 
                               className="text-green-700 pt-1"
                               onClick={() => setViewVerificationPid(product.id)}>View Verification
                               </Button>
                               {viewVerificationPid === product.id && (
                               <Dialog open={!!viewVerificationPid} onOpenChange={() => setViewVerificationPid(null)}>
                               <DialogContent
                                 className="w-[95%] max-w-[1400px] p-8"
                                 style={{ minHeight: '500px', maxHeight: '90vh', overflowY: 'auto' }}
                               >
                                 <DialogHeader>
                                   <DialogTitle>Product Verification Certificate</DialogTitle>
                                   <DialogDescription>
                                     Blockchain-based verification for this product.
                                   </DialogDescription>
                                 </DialogHeader>
                                 <div className="w-full overflow-x-auto">
                                    <VerificationStage 
                                      pid={viewVerificationPid} 
                                      onClick={() => setViewVerificationPid(null)} 
                                    />
                                  </div>
                                 <DialogFooter>
                                   <DialogClose asChild>
                                     <Button onClick={() => setViewVerificationPid(null)}>Close</Button>
                                   </DialogClose>
                                 </DialogFooter>
                               </DialogContent>
                             </Dialog>
                               )} 
                            </span>
                          </div>
                          
                        </motion.div>
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <div className='flex justify-between gap-30 items-center'>
                        <Button 
                          variant="link" 
                          onClick={() => toggleDropdown(product.id)}
                        >
                          {openDropdown === product.id ? 'Hide details' : 'Show more'}
                        </Button>
                      <PurchaseProduct product={product} />
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
      {activeTab === 'crowdfund' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crowdfunding.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No crowdfunding requests found
            </div>
          ) : (
            crowdfunding.map(request => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle>{request.title}</CardTitle>
                  <span>Cid: {request.cid || 'N/A'}</span>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-gray-700">{request.description}</div>
                  <div className="mb-2">
                    <span className="font-semibold">Target:</span> {request.target_amount} XAF
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Raised:</span> {request.current_amount} XAF
                  </div>
                  <div className="progress-bar-container" style={{ width: '100%', background: '#eee', borderRadius: '8px', margin: '8px 0' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(request.current_amount / request.target_amount) * 100}%`,
                        background: '#4caf50',
                        height: '12px',
                        borderRadius: '8px',
                        transition: 'width 0.3s',
                        opacity: request.current_amount >= request.target_amount ? 0.7 : 1
                      }}
                    ></div>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Duration:</span> {request.duration_days} days
                  </div>
                </CardContent>
                <CardFooter>
                  <SupportCrowdfund/>
                 
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
