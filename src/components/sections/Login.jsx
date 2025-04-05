import React from 'react'
import { Wallet,Wheat,ShoppingBag, Award, Landmark } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle, } from '../ui/card'
    import { Tabs,
        TabsContent,
        TabsList,
        TabsTrigger, } from '../ui/tabs'
        import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const Login = () => {
  return (
    <div className='flex items-center justify-center min-h-screen pt-20'>
      <div className='border p-8 rounded-lg shadow-md w-full max-w-md'>
        <div className='flex flex-col items-center space-y-6'>
          <h1 className='text-4xl font-bold text-center'>Welcome to AgriTrust</h1>
          <h2 className='text-gray-600 text-center'>Transparent, trusted, traceable</h2>

          <div className='bg-indigo-200 w-full rounded-lg p-6 flex flex-col items-center space-y-4'>
            <div className=' rounded-md flex gap-4 items-center justify-center w-full '>
              <Wallet className='text-indigo-600' /> 
              <span className='font-semibold'>Web3 Authentication</span>
            </div>
            
            <Button 
              variant="secondary" 
              className="bg-indigo-500 text-white w-full hover:bg-indigo-600"
            >
              Connect Wallet
            </Button>
          </div>

            <div>
            <h2 className='font-semibold text-left pb-2'>Select your role</h2>
            <div className='grid grid-cols-2 gap-4'>
            <Card>
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="bg-green-400 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                        <Wheat/>
                    </CardTitle>
                    <CardDescription  className="font-bold text-black text-base sm:text-lg">
                        Farmer
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <p className='text-sm text-gray-600'>List products, get verified, and secure funding</p>
                </CardContent>
                
            </Card>
            <Card>
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="bg-blue-300 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                        <ShoppingBag/>
                    </CardTitle>
                    <CardDescription  className="font-bold text-black text-base sm:text-lg">
                        Consumer
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <p className='text-sm text-gray-600'>Find verified products</p>
                </CardContent>
                
            </Card>

            <Card>
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="bg-indigo-400 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                        <Award/>
                    </CardTitle>
                    <CardDescription  className="font-bold text-black text-base sm:text-lg">
                        Verifier
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <p className='text-sm text-gray-600'>Verify farms and produce</p>
                </CardContent>
                
            </Card>

            <Card>
                <CardHeader className="flex flex-col items-center">
                    <CardTitle className="bg-stone-600 w-[50px] h-[50px] flex items-center justify-center rounded-full p-2 text-white">
                        <Landmark/>
                    </CardTitle>
                    <CardDescription  className="font-bold text-black text-base sm:text-lg">
                        Financial
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <p className='text-sm text-gray-600'>Fund farmers and manage loans</p>
                </CardContent>
                
            </Card>
            

          </div>
          </div>

          <Tabs defaultValue="login" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="Enter your password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full text-black hover:bg-blue-500 hover:text-white transition-colors">
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm your password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full text-black hover:bg-blue-500 hover:text-white transition-colors">
                  Create Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  )
}
