import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Wheat, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useProducts } from '../../context/ProductContext';

export const Products = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className='flex gap-2 text-xl font-medium items-center'>
              <Wheat size={20} className='text-green-600'/> Products
            </span>
            <div>
              <Button variant="secondary" className="bg-green-600 text-white hover:bg-green-500"><Plus/> New Product</Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>A list of your products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price (XAF)</TableHead>
                <TableHead className="text-right">Inventory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>{product.price} XAF</TableCell>
                  <TableCell className="text-right">{product.inventory}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total Products</TableCell>
                <TableCell className="text-right">{products.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
