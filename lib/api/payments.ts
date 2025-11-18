import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where
} from 'firebase/firestore';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { db, functions } from '../firebase';
import { PaymentMethod, PaymentOption } from "../paymentConfig";

export interface PaymentData {
  destination: PaymentOption;
  method: PaymentMethod;
  amount: number;
  description: string;
  userId: string;
  accountDetails: any;
  additionalInfo?: any;
  senderPhoneNumber?: string;
}

export interface Transaction {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  description: string;
  mpesaReceiptNumber?: string;
  confirmationMessage?: string;
  timestamp: string;
  destination: string;
  senderPhone: string;
  recipientPhone: string;
  createdAt?: any;
}

// Define proper types for Cloud Function responses
interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId: string;
  details?: {
    from: string;
    to: string;
    amount: number;
    description: string;
  };
  note?: string;
}

interface TransactionsResponse {
  success: boolean;
  transactions: Transaction[];
}

// Cloud function references with proper typing
const initiateMpesaPaymentCF = httpsCallable<{
  amount: number;
  phoneNumber: string;
  description: string;
  destination: PaymentOption;
}, PaymentResponse>(functions, 'initiateMpesaPayment');

const getUserTransactionsCF = httpsCallable<{
  limit?: number;
}, TransactionsResponse>(functions, 'getUserTransactions');

// Main payment function
export const makePayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  try {
    if (!paymentData.senderPhoneNumber) {
      throw new Error("Sender phone number is required");
    }

    const result: HttpsCallableResult<PaymentResponse> = await initiateMpesaPaymentCF({
      amount: paymentData.amount,
      phoneNumber: paymentData.senderPhoneNumber,
      description: paymentData.description,
      destination: paymentData.destination,
    });

    return result.data;
  } catch (error: any) {
    console.error("Payment initiation failed:", error);
    throw new Error(error.message || "Failed to initiate payment");
  }
};

// Get user transactions
export const getUserTransactions = async (limit: number = 50): Promise<TransactionsResponse> => {
  try {
    const result: HttpsCallableResult<TransactionsResponse> = await getUserTransactionsCF({ limit });
    return result.data;
  } catch (error: any) {
    console.error("Fetching transactions failed:", error);
    // Return fallback empty response
    return {
      success: false,
      transactions: []
    };
  }
};

// Real-time transaction listener
export const subscribeToTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const transactionsQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(transactionsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const transactions: Transaction[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        status: data.status || 'pending',
        amount: data.amount || 0,
        description: data.description || '',
        timestamp: data.timestamp || new Date().toISOString(),
        destination: data.destination || '',
        senderPhone: data.senderPhone || '',
        recipientPhone: data.recipientPhone || '',
        createdAt: data.createdAt,
        mpesaReceiptNumber: data.mpesaReceiptNumber,
        confirmationMessage: data.confirmationMessage
      };
    });
    callback(transactions);
  });
};

// Fallback functions for when Cloud Functions aren't deployed
export const makeMockPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  console.log('Mock Payment:', {
    from: paymentData.senderPhoneNumber,
    to: paymentData.accountDetails.phoneNumber,
    amount: paymentData.amount,
    description: paymentData.description,
    destination: paymentData.destination
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    message: 'Payment initiated successfully! (Development Mode)',
    transactionId: 'dev_' + Date.now(),
    details: {
      from: paymentData.senderPhoneNumber || '',
      to: paymentData.accountDetails.phoneNumber,
      amount: paymentData.amount,
      description: paymentData.description
    },
    note: 'Cloud Functions not deployed yet - using mock data'
  };
};

export const getMockTransactions = async (limit: number = 50): Promise<TransactionsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockTransactions: Transaction[] = [
    {
      id: 'dev_1',
      timestamp: new Date().toISOString(),
      status: 'completed',
      amount: 500,
      description: 'Sunday service tithe payment',
      destination: 'Tithe',
      senderPhone: '254741103341',
      recipientPhone: '254110490333',
      mpesaReceiptNumber: 'DEV123',
      confirmationMessage: 'MPESA Confirmed: DEV123. You sent Ksh 500 to Rongai Church.'
    },
    {
      id: 'dev_2',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
      amount: 1200,
      description: 'Youth conference payment',
      destination: 'Youth Membership',
      senderPhone: '254741103341',
      recipientPhone: '254110490333',
      mpesaReceiptNumber: 'DEV456',
      confirmationMessage: 'MPESA Confirmed: DEV456. You sent Ksh 1200 to Rongai Youth.'
    }
  ];

  return {
    success: true,
    transactions: mockTransactions.slice(0, limit)
  };
};