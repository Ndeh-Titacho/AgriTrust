// src/components/sections/VerifiersContacts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VerifiersContacts = () => {
  const [verifiers, setVerifiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerifiers = async () => {
      try {
        // Get all users with the verifier role from web3_users
        const { data: verifiers, error: verifierError } = await supabase
          .from('web3_users')
          .select('id, wallet_address, role, phone_number')
          .eq('role', 'verifier')
          .order('wallet_address', { ascending: true }); // Changed from full_name to wallet_address

        if (verifierError) throw verifierError;

        // Format verifiers with wallet address
        const formattedVerifiers = (verifiers || []).map(verifier => ({
          id: verifier.id,
          wallet_address: verifier.wallet_address,
          phone: verifier.phone_number, // Make sure this matches your column name
          role: verifier.role
        }));

        setVerifiers(formattedVerifiers);
      } catch (err) {
        console.error('Error fetching verifiers:', err);
        setError('Failed to load verifier contacts');
        toast.error('Failed to load verifier contacts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiers();
  }, []);

  const openWhatsApp = (phoneNumber) => {
    try {
      if (!phoneNumber) {
        toast.error('No phone number available for this verifier');
        return;
      }

      // Convert to string in case it's a number or other type
      const phoneStr = String(phoneNumber).trim();
      
      if (!phoneStr) {
        toast.error('Invalid phone number');
        return;
      }

      // Remove any non-numeric characters and ensure it starts with country code
      let cleanNumber = phoneStr.replace(/\D/g, '');
      
      // If the number doesn't start with a country code, assume it's a local number
      // and add a default country code (e.g., 1 for US, 91 for India, etc.)
      // You might want to adjust this based on your requirements
      if (cleanNumber.length === 10) {
        cleanNumber = '1' + cleanNumber; // Default to US country code
      }

      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error('Could not open WhatsApp. Please try again or use another contact method.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50  ">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Verifier Contacts
          </h3>
          <p className="mt-1 w-full text-sm text-gray-500">
            Contact a verifier for product verification
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          {verifiers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No verifiers found
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {verifiers.map((verifier) => (
                <li key={verifier.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {verifier.wallet_address.substring(0, 6)}...{verifier.wallet_address.slice(-4)}
                        </h4>
                        <div className="flex space-x-3 mt-1">
                          {verifier.phone && (
                            <button
                              onClick={() => openWhatsApp(verifier.phone)}
                              className="text-green-600 hover:text-green-800"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="h-5 w-5" />
                            </button>
                          )}
                          {verifier.phone && (
                            <a
                              href={`tel:${verifier.phone}`}
                              className="text-blue-600 hover:text-blue-800"
                              title="Call"
                            >
                              <Phone className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {verifier.role || 'Verifier'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiersContacts;