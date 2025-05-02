import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Badge
} from "../ui/badge"
import {
  Separator
} from "../ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"

const customBadgeVariants = {
  verified: "green",
  pending: "yellow",
  rejected: "red",
}

function CustomBadge(props) {
  const variant = props.variant || "verified"
  const otherProps = { ...props }
  delete otherProps.variant
  
  return (
    <Badge 
      variant={customBadgeVariants[variant]} 
      className="bg-green-500 text-white"
      {...otherProps}
    >
      {variant === "verified" ? (
        <>
          Verified
          <span className="ml-1">✓</span>
        </>
      ) : (
        variant
      )}
    </Badge>
  )
}

export const CompletedVerifications = () => {
  const [verifiedProducts, setVerifiedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVerifiedProducts()
  }, [])

  const fetchVerifiedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('verification_status', 'verified')

      if (error) throw error
      setVerifiedProducts(data)
    } catch (error) {
      console.error('Error fetching verified products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold">Loading verified products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Verified Products</h2>
        <Badge variant="secondary">Total: {verifiedProducts.length}</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedProducts.map((product) => (
          <Card key={product.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CustomBadge variant="verified">Verified</CustomBadge>
                  <span className="text-sm text-gray-600">
                    {new Date(product.verified_at).toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Product Details</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <p><span className="font-semibold">ID:</span> {product.pid}</p>
                    <p><span className="font-semibold">Category:</span> {product.type}</p>
                    <p><span className="font-semibold">Quantity:</span> {product.inventory}</p>
                    <p><span className="font-semibold">Unit price:</span> {product.price}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="verification" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <p><span className="font-semibold">Stage:</span> Fully Verified</p>
                    <p><span className="font-semibold">Status:</span> {product.verification_status}</p>
                    <p><span className="font-semibold">Verified By:</span> {product.verified_by}</p>
                    <p><span className="font-semibold">Verified At:</span> {new Date(product.verified_at).toLocaleString()}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
