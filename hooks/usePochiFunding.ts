import { useState } from 'react';
import { fundPochiViaSTK } from '../lib/mpesa/mpesaAPI';

export const usePochiFunding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fundPochi = async (amount: number = 10, phoneNumber: string = "254110490333") => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate amount for real transactions
      if (amount < 10) {
        throw new Error('Minimum amount for M-Pesa is 10 KSH');
      }
      
      console.log(`💸 Initiating REAL payment: KSH ${amount}`);
      console.log(`📱 From: ${phoneNumber} (0110490333)`);
      console.log(`🏢 To Pochi: 0741103341`);
      
      const result = await fundPochiViaSTK(amount, phoneNumber);
      console.log('✅ REAL Payment initiated:', result);
      
      alert(`M-Pesa prompt sent to 0110490333! Check your phone to complete payment of KSH ${amount} to Pochi la Biashara.`);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.errorMessage || err.message || 'Payment failed';
      setError(errorMessage);
      alert(`Payment failed: ${errorMessage}`);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fundPochi,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};