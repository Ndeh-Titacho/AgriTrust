import React, { useState } from 'react'
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
import { Link, ShieldCheck, Tag, Search, Wheat, ChevronDown, ChevronUp, CircleAlert  } from 'lucide-react'
import { Button } from '../components/ui/button'
import fruits from '../assets/julia.jpg'

export const Marketplace = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='font-poppins'>
        <header className='flex flex-col justify-start items-start '>
            <h1 className='font-bold text-4xl'>Marketplace</h1>
            <span className='text-gray-500'>Browse and purchase verified agricultural products</span>
        </header>


{/* Search Form */}
<div className='py-8'> 
    <Input type='text' placeholder="Search products... " className="w-80"/>
</div>
{/* Cards */}     
       <div>
        <Card>
            <CardHeader className="relative p-0">
                <img src={fruits} alt="item image" />
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
                        <h1>Organic Apples</h1>
                        <h1>250XAF</h1>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1 className='flex items-center gap-1'> <Tag size={12}/>Fruit</h1>
                        <h1>per unit</h1>
                    </div>
                    <div className='flex justify-start'>
                        <h1 className='flex items-center gap-1'> <Wheat size={13} className='text-green-600'/> Berry best farm . Ndop</h1>
                    </div>
                    <div>
                        <Badge> Organic </Badge>
                    </div>
                </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col w-full gap-4">
                <div className='flex justify-between items-center w-full'>
                    <Button 
                        variant="secondary"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2"
                    >
                        {isExpanded ? (
                        <>
                            Show Less
                            <ChevronUp size={16} />
                        </>
                        ) : (
                        <>
                            Show More
                            <ChevronDown size={16} />
                        </>
                        )}
                    </Button>
                    <Button 
                        variant='secondary' 
                        className="text-white bg-green-600 hover:bg-green-400"
                    >
                        Purchase
                    </Button>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                <div className="border-t pt-4 w-full">
    
                    <div className="mt-4">
                    <h3 className="font-semibold text-sm text-gray-600 text-left">Product Details</h3>
                    <p className="mt-1 text-gray-600 text-left">
                        Fresh organic apples grown using sustainable farming practices. 
                        Our apples are harvested at peak ripeness and stored in 
                        temperature-controlled facilities to ensure maximum freshness.
                    </p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='flex items-center gap-1 '> <CircleAlert size={15} className='text-blue-300'/> <h4> Blockchain verifier origin</h4></span>
                        <a className='text-green-600 hover:text-underline'>View Certificate</a>
                    </div>
                </div>
                )}
            </CardFooter>
        </Card>

        </div>
    </div>
  )
}
