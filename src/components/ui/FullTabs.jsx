import React from 'react'
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
import { Button } from '../ui/button'

export const FullTabs = ({ selectedRole }) => {
  return (
    <div className='w-full'>
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
                <Button  disabled={!selectedRole} className="w-full  bg-blue-400 hover:bg-blue-500 text-white transition-colors">
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
                <Button disabled={!selectedRole} className="w-full bg-blue-400 hover:bg-blue-500 text-white transition-colors">
                  Create Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
