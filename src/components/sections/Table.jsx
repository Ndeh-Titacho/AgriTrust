import React from 'react';
import { useProducts } from '../../context/ProductContext';

export const Table = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="col-span-3">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price(XAF)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} XAF</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.inventory}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Products</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{products.length}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
