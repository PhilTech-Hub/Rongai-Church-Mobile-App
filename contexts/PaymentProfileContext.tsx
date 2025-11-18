import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MpesaNumber, UserPaymentProfile } from '../lib/paymentTypes';

interface PaymentProfileContextType {
  paymentProfile: UserPaymentProfile | null;
  addMpesaNumber: (phoneNumber: string) => Promise<void>;
  removeMpesaNumber: (id: string) => Promise<void>;
  setDefaultMpesaNumber: (id: string) => Promise<void>;
  verifyMpesaNumber: (id: string, otp: string) => Promise<void>;
  getDefaultMpesaNumber: () => MpesaNumber | null;
  isLoading: boolean;
  sendVerificationOTP: (phoneNumber: string) => Promise<void>;
}

const PaymentProfileContext = createContext<PaymentProfileContextType | undefined>(undefined);

export function PaymentProfileProvider({ children }: { children: React.ReactNode }) {
  const [paymentProfile, setPaymentProfile] = useState<UserPaymentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions
  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned;
    }
    return '+' + cleaned;
  };

  const loadFromStorage = async (): Promise<UserPaymentProfile | null> => {
    return null; // Return null for demo
  };

  const saveToStorage = async (profile: UserPaymentProfile): Promise<void> => {
    console.log('Saving profile:', profile);
  };

  // Verify M-Pesa number function
  const verifyMpesaNumber = useCallback(async (id: string, otp: string) => {
    try {
      setIsLoading(true);
      const updatedMpesaNumbers = paymentProfile?.mpesaNumbers.map(mp => 
        mp.id === id 
          ? { 
              ...mp, 
              isVerified: true, 
              verifiedAt: new Date().toISOString() 
            }
          : mp
      ) || [];

      const updatedProfile = {
        ...paymentProfile!,
        mpesaNumbers: updatedMpesaNumbers
      };

      setPaymentProfile(updatedProfile);
      await saveToStorage(updatedProfile);
    } catch (error) {
      console.error('Failed to verify M-Pesa number:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [paymentProfile]); // Add paymentProfile as dependency

  // Send verification OTP function
  const sendVerificationOTP = useCallback(async (phoneNumber: string) => {
    try {
      console.log(`Sending OTP to ${phoneNumber}`);
      // In real app: await api.sendOTP(phoneNumber);
      
      // For demo, we'll automatically verify after 2 seconds
      setTimeout(() => {
        const numberToVerify = paymentProfile?.mpesaNumbers.find(
          mp => mp.phoneNumber === phoneNumber && !mp.isVerified
        );
        if (numberToVerify) {
          verifyMpesaNumber(numberToVerify.id, "123456"); // Demo OTP
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  }, [paymentProfile, verifyMpesaNumber]); // Add both dependencies

  // Load user payment profile
  const loadUserPaymentProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedProfile = await loadFromStorage();
      if (storedProfile) {
        setPaymentProfile(storedProfile);
      } else {
        const newProfile: UserPaymentProfile = {
          userId: "user_123",
          mpesaNumbers: [],
          defaultPaymentMethod: 'mpesa'
        };
        setPaymentProfile(newProfile);
        await saveToStorage(newProfile);
      }
    } catch (error) {
      console.error('Failed to load payment profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load profile on component mount
  useEffect(() => {
    loadUserPaymentProfile();
  }, [loadUserPaymentProfile]);

  // Add M-Pesa number
  const addMpesaNumber = useCallback(async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      
      const newMpesaNumber: MpesaNumber = {
        id: Date.now().toString(),
        phoneNumber: formatPhoneNumber(phoneNumber),
        isVerified: false,
        isDefault: paymentProfile?.mpesaNumbers.length === 0,
        createdAt: new Date().toISOString()
      };

      const updatedProfile = {
        ...paymentProfile!,
        mpesaNumbers: [...(paymentProfile?.mpesaNumbers || []), newMpesaNumber]
      };

      setPaymentProfile(updatedProfile);
      await saveToStorage(updatedProfile);
      
      await sendVerificationOTP(newMpesaNumber.phoneNumber);
    } catch (error) {
      console.error('Failed to add M-Pesa number:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [paymentProfile, sendVerificationOTP]);

  // Remove M-Pesa number
  const removeMpesaNumber = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const updatedMpesaNumbers = paymentProfile?.mpesaNumbers.filter(mp => mp.id !== id) || [];
      
      let finalMpesaNumbers = updatedMpesaNumbers;
      const removedWasDefault = paymentProfile?.mpesaNumbers.find(mp => mp.id === id)?.isDefault;
      
      if (removedWasDefault && updatedMpesaNumbers.length > 0) {
        finalMpesaNumbers = updatedMpesaNumbers.map((mp, index) => ({
          ...mp,
          isDefault: index === 0
        }));
      }

      const updatedProfile = {
        ...paymentProfile!,
        mpesaNumbers: finalMpesaNumbers
      };

      setPaymentProfile(updatedProfile);
      await saveToStorage(updatedProfile);
    } catch (error) {
      console.error('Failed to remove M-Pesa number:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [paymentProfile]);

  // Set default M-Pesa number
  const setDefaultMpesaNumber = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const updatedMpesaNumbers = paymentProfile?.mpesaNumbers.map(mp => ({
        ...mp,
        isDefault: mp.id === id
      })) || [];

      const updatedProfile = {
        ...paymentProfile!,
        mpesaNumbers: updatedMpesaNumbers
      };

      setPaymentProfile(updatedProfile);
      await saveToStorage(updatedProfile);
    } catch (error) {
      console.error('Failed to set default M-Pesa number:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [paymentProfile]);

  // Get default M-Pesa number
  const getDefaultMpesaNumber = useCallback((): MpesaNumber | null => {
    return paymentProfile?.mpesaNumbers.find(mp => mp.isVerified && mp.isDefault) || 
           paymentProfile?.mpesaNumbers.find(mp => mp.isVerified) || 
           null;
  }, [paymentProfile]);

  const value = {
    paymentProfile,
    addMpesaNumber,
    removeMpesaNumber,
    setDefaultMpesaNumber,
    verifyMpesaNumber,
    getDefaultMpesaNumber,
    isLoading,
    sendVerificationOTP
  };

  return (
    <PaymentProfileContext.Provider value={value}>
      {children}
    </PaymentProfileContext.Provider>
  );
}

export function usePaymentProfile() {
  const context = useContext(PaymentProfileContext);
  if (context === undefined) {
    throw new Error('usePaymentProfile must be used within a PaymentProfileProvider');
  }
  return context;
}