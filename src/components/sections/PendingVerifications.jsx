import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { supabase } from '../../supabase';
import { ContinueVerification } from './ContinueVerification';

export const PendingVerifications = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('verification_status', 'pending');
      if (error) {
        setError('Failed to fetch pending products.');
        setPendingProducts([]);
      } else {
        setPendingProducts(data || []);
      }
      setLoading(false);
    };
    fetchPendingProducts();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading pending verifications...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!pendingProducts.length) return <div className="p-6 text-center">No pending verifications found.</div>;

  // Define the number of steps and calculate progress in steps
  const TOTAL_STEPS = 4; // Example: change as needed
  // Optionally, you can customize how many steps are completed based on product fields/status
  const getStepProgress = (product) => {
    // Example logic: you can refine this based on real workflow
    // For now, simulate based on id (for demo)
    let stepsCompleted = 1 + (product.id % TOTAL_STEPS); // 1 to TOTAL_STEPS
    return {
      stepsCompleted,
      percent: Math.round((stepsCompleted / TOTAL_STEPS) * 100)
    };
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {pendingProducts.map((product) => {
        const { stepsCompleted, percent } = getStepProgress(product);
        return (
          <Card key={product.id} className="bg-white/95 rounded-lg shadow border border-gray-100 max-w-xs w-full mx-auto flex flex-col justify-between p-0">
            <CardHeader className="pb-1 border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base font-semibold text-green-900 truncate pt-4">{product.name || `Product #${product.id}`}</CardTitle>
                <div className="flex flex-col justify-start text-start gap-2 text-xs text-gray-500 ">
                  {product.type && <span className="">{product.type}</span>}
                  {product.price && <span className="">{product.price} XAF</span>}
                  {product.inventory !== undefined && <span>Inventory: {product.inventory}</span>}
                </div>
                <div className="text-xs text-gray-400">
                  {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                </div>
                <div className={`self-start px-2 py-1 mt-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 shadow-sm whitespace-nowrap`}>
                  {product.verification_status.charAt(0).toUpperCase() + product.verification_status.slice(1)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-2 px-3 flex flex-col text-left gap-2">
              {product.image_data && (
                <div className="flex justify-center mb-2">
                  <img src={product.image_data} alt="Product" className="w-full h-24 object-cover rounded border border-gray-200" />
                </div>
              )}
              {product.description && (
                <div>
                  <h4 className="text-xs font-medium mb-0.5 text-gray-700">Description</h4>
                  <div className="text-xs text-gray-700 line-clamp-2">{product.description}</div>
                </div>
              )}
              <div>
                <h4 className="text-xs font-medium mb-0.5 text-gray-700">Farming Inputs</h4>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(product.farmingInputs)
                    ? product.farmingInputs.map((input, idx) => (
                        <span key={idx} className="bg-green-100 text-green-900 text-[10px] px-1.5 py-0.5 rounded-full border border-green-200">
                          {input}
                        </span>
                      ))
                    : <span className="text-xs text-gray-600">{product.farmingInputs}</span>
                  }
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-[11px] mb-1 text-gray-500 font-medium">
                  <span>Verification Progress</span>
                  <span className="font-semibold text-green-700">{stepsCompleted} / {TOTAL_STEPS} Steps</span>
                </div>
                <div className="h-3 relative rounded bg-gray-200 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                  <div className="absolute left-0 top-0 h-full w-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold drop-shadow-sm">{percent}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex flex-col gap-2 border-t border-gray-100 bg-gray-50 rounded-b-lg pb-5">
              <Button size="sm" variant="outline" className="w-full  hover:bg-blue-400 hover:text-white font-medium rounded-full shadow">
                View Details
              </Button>
             <ContinueVerification/>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
