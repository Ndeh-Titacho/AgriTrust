import React from 'react'
import {  Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle, } from '../components/ui/card'

    import { Badge } from '../components/ui/badge'
    import { ChartNetworkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Marketplace = () => {
  return (
    <div className='font-poppins'>
        <header className='flex flex-col justify-start items-start '>
            <h1 className='font-bold text-4xl'>Marketplace</h1>
            <span className='text-gray-500'>Browse and purchase verified agricultural products</span>
        </header>

{/* Cards */}     
       <div>
        <Card>
            <CardHeader>
                <img src="" alt="item image" />
                <CardTitle>
                   <Badge className="bg-blue-400">
                    <ChartNetworkIcon/>
                    On-Chain</Badge>
                    <Badge className="bg-gray-100 text-green-600">Verified Farm</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <div className='flex justify-between items-center text-black text-xl font-medium'>
                        <h1>Organic Apples</h1>
                        <h1>250XAF</h1>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Fruit</h1>
                        <h1>per unit</h1>
                    </div>
                    <div className='flex justify-start'>
                        <h1>Berry best farm . Ndop</h1>
                    </div>
                    <div>
                        <Badge> Organic </Badge>
                    </div>
                </CardDescription>
            </CardContent>
            <CardFooter>
                <div className='flex justify-between items-center  w-full'>
                    <span>Show More</span>
                    <Button variant='secondary' className="text-white bg-green-600 hover:bg-green-400">
                        Purchase
                    </Button>
                </div>
            </CardFooter>
        </Card>

        </div>
    </div>
  )
}
