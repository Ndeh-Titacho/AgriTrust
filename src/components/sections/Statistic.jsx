import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../ui/card"

export const Statistic = () => {
  return (
    <div className='mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 '>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle>
            <h1 className='text-4xl text-green-500 font-bold'>5000+</h1>
            </CardTitle>
            <CardDescription className="font-bold  text-gray-600 text-base sm:text-lg">
            Verified Farms
            </CardDescription>
          </CardHeader>
            </Card>

            <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle>
            <h1 className='text-4xl text-indigo-500 font-bold'>1.2M</h1>
            </CardTitle>
            <CardDescription className="font-bold  text-gray-600 text-base sm:text-lg">
            Blockchain Transactions
            </CardDescription>
          </CardHeader>
            </Card>

            <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle>
            <h1 className='text-4xl text-blue-300 font-bold'>$12M</h1>
            </CardTitle>
            <CardDescription className="font-bold  text-gray-600 text-base sm:text-lg">
            Farmer Funding
            </CardDescription>
          </CardHeader>
            </Card>

            <Card className="shadow-lg">
            <CardHeader className="flex flex-col justify-start space-y-4">
            <CardTitle>
            <h1 className='text-4xl text-stone-600 font-bold'>95%</h1>
            </CardTitle>
            <CardDescription className="font-bold  text-gray-600 text-base sm:text-lg">
            Customer Trust Rating
            </CardDescription>
          </CardHeader>
            </Card>
    </div>
  )
}
