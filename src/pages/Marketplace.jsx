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

export const Marketplace = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
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
      
      // Check if data is empty
      if (!data || data.length === 0) {
        throw new Error('No products found')
      }
      
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error.message)
      
      // Show error toast
      toast.error(error.message || "Failed to fetch products")
    } finally {
      setIsLoading(false)
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

  return (
    <div className='font-poppins'>
      <Toaster />
      
      <header className='flex flex-col justify-start items-start'>
        <h1 className='font-bold text-4xl'>Marketplace</h1>
        <span className='text-gray-500'>Browse and purchase verified agricultural products</span>
      </header>

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
                      <Badge className="bg-gray-100 text-green-600 gap-1">
                        <ShieldCheck size={14}/>
                        Verified Farm</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <div className='flex justify-between items-center text-black text-xl font-medium'>
                      <h1>{product.name}</h1>
                      <h1>{product.price} XAF</h1>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-500'>
                        {product.type}
                      </span>
                      <span className='text-gray-500'>
                        {product.inventory} in stock
                      </span>
                    </div>
                    <p className='mt-2 text-gray-600'>{product.description}</p>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
