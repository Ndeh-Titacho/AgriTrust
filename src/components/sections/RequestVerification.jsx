// src/components/sections/RequestVerification.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { toast } from 'react-hot-toast';
import { Check, X, Loader2, Send, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const RequestVerification = ({ productId }) => {
  const [verifiers, setVerifiers] = useState([]);
  const [selectedVerifier, setSelectedVerifier] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    const fetchVerifiers = async () => {
      try {
        const { data: verifiers, error } = await supabase
          .from('web3_users')
          .select('id, wallet_address, role')
          .eq('role', 'verifier');

        if (error) throw error;

        setVerifiers(verifiers || []);
      } catch (err) {
        console.error('Error fetching verifiers:', err);
        toast.error('Failed to load verifiers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVerifier) {
      toast.error('Please select a verifier');
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);

    try {
      const requestedAt = new Date().toISOString();
      
      // Insert verification request into Supabase
      const { data, error } = await supabase
        .from('verification_requests')
        .insert([{
          verifier_id: selectedVerifier,
          status: 'pending',
          created_at: requestedAt,
          updated_at: requestedAt
        }])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setVerificationRequested(true);
        toast.success('Verification request sent successfully');
      }
    } catch (err) {
      console.error('Error requesting verification:', err);
      const errorMessage = err.message || 'Failed to send verification request';
      setRequestError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin h-6 w-6 text-green-600" />
      </div>
    );
  }


  if (verificationRequested) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Verification Requested</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your verification request has been sent to the verifier.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Request Product Verification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="verifier" className="block text-sm font-medium text-gray-700 mb-1">
            Select Verifier
          </label>
          <select
            id="verifier"
            value={selectedVerifier}
            onChange={(e) => setSelectedVerifier(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
            required
            disabled={isSubmitting}
          >
            <option value="">-- Select a verifier --</option>
            {verifiers.map((verifier) => (
              <option key={verifier.id} value={verifier.id}>
                {verifier.wallet_address}
              </option>
            ))}
          </select>
        </div>

        {requestError && (
          <div className="text-red-500 text-sm mt-2">{requestError}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !selectedVerifier}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Sending...
              </>
            ) : (
              <>
                <Send className="-ml-1 mr-2 h-4 w-4" />
                Send Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestVerification;