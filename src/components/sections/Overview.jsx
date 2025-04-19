import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../ui/card"
  import { Wheat, ShieldCheck, ArrowRightLeft   } from 'lucide-react'
  import { Table } from '../sections/Table'

export const Overview = () => {
  return (
    <div >
        <div className='grid md:grid-cols-3 gap-4'>

        
        <Card>
            <CardHeader>
                <span className='flex gap-2 text-xl font-medium items-center'>
                <Wheat size={20} className='text-green-600'/> Products
                </span>

            <CardTitle className="text-gray-600 text-md font-normal text-left">
                Your listed products
            </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around  w-48">
                <h1 className='text-4xl font-semibold'>3</h1>
            </CardContent>
            <CardFooter>
                <h1 className='text-gray-600'>2 active listings</h1>
            </CardFooter>
        </Card>


        <Card>
            <CardHeader>
                <span className='flex gap-2 text-xl font-medium items-center'>
                <ShieldCheck size={20} className='text-green-600'/> Verification
                </span>

            <CardTitle className="text-gray-600 text-md font-normal text-left">
                Verification status
            </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around  w-48">
                <h1 className='text-4xl font-semibold'>2/4</h1>
            </CardContent>
            <CardFooter>
                <h1 className='text-gray-600'>Stages completed</h1>
            </CardFooter>
        </Card>


        <Card>
            <CardHeader>
                <span className='flex gap-2 text-xl font-medium items-center'>
                <ArrowRightLeft size={20} className='text-green-600'/> Balance
                </span>

            <CardTitle className="text-gray-600 text-md font-normal text-left">
                Your current balance
            </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around  w-48">
                <h1 className='text-4xl font-semibold'>59000.00XAF</h1>
            </CardContent>
            <CardFooter>
                <h1 className='text-gray-600'>Last transaction: 9/14/2025</h1>
            </CardFooter>
        </Card>
        </div>

        {/* Table wrapped in Card */}
        <Card className="col-span-3 mt-5">
            <CardHeader>
                <span className='flex gap-2 text-xl font-medium items-center'>
                    <ArrowRightLeft size={20} className='text-green-600'/> Recent Transactions
                </span>
                <CardTitle className="text-gray-600 text-md font-normal text-left">
                    Your latest transactions and updates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table />
            </CardContent>
        </Card>
    </div>
  )
}
