// src/pages/dashboards/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/supabaseAuthContext';
import { useWallet } from '../../context/WalletContext';
import { Button } from '../../components/ui/button';
import { PiggyBank, Plus, Users, FileCheck, LayoutDashboard, Loader2 } from 'lucide-react';
import { Overview } from '../../components/sections/Overview';
import { Products } from '../../components/sections/Products';
import { Verifications } from '../../components/sections/Verifications';
import { AddProductModal } from '../../components/sections/AddProduct';
import { RequestCrowdfunding } from '../../components/sections/RequestCrowdfunding';
import { ProductProvider } from '../../context/ProductContext';
import VerifierContacts from '../../components/sections/VerifiersContacts';
import { RequestVerification } from '../../components/sections/RequestVerification';

export const FarmerDashboard = () => {
  const { account } = useWallet();
  const { selectedRole } = UserAuth();
  const [activeComponent, setActiveComponent] = useState('Overview');
  const [activeTab, setActiveTab] = useState('contacts');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);

  // Mock function to fetch products - replace with your actual data fetching logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Your product fetching logic here
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const tabs = [
    {
      id: 'contacts',
      label: 'Verifier Contacts',
      icon: <Users className="h-4 w-4 mr-2" />,
      component: <VerifierContacts />
    },
    {
      id: 'verification',
      label: 'Request Verification',
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      component: <RequestVerification productId={selectedProductId} />
    }
  ];

  const renderComponent = () => {
    switch(activeComponent) {
      case "Overview":
        return <Overview />;
      case "Products":
        return <Products />;
      case "Verifications":
        return (
          <div className="mt-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="mt-4">
                {tabs.find(tab => tab.id === activeTab)?.component}
              </div>
            </div>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto font-poppins">
          <div className='flex flex-col items-start justify-start'>
            <h1 className="text-2xl sm:text-3xl font-bold">Farmer Dashboard</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
              <span className='text-gray-600 text-sm sm:text-base'>
                Manage your farm, products and certifications.
              </span>
              <div className='flex gap-2 pt-2 sm:pt-4 md:justify-end'>
                <RequestCrowdfunding />
                <AddProductModal />
              </div>
            </div>
          </div>

          <div className='mt-6 space-y-6'>
            <ul className='flex flex-wrap gap-1 sm:gap-2'>
              {["Overview", "Products", "Verifications"].map((item) => (
                <li key={item}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm sm:text-base ${
                      activeComponent === item
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    onClick={() => setActiveComponent(item)}
                  >
                    {item}
                  </Button>
                </li>
              ))}
            </ul>

            <div className="mt-2">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </ProductProvider>
  );
};