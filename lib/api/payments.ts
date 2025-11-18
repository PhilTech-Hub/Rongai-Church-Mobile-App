import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
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

// Cloud function references
const initiateMpesaPaymentCF = httpsCallable(functions, 'initiateMpesaPayment');
const getUserTransactionsCF = httpsCallable(functions, 'getUserTransactions');

// Main payment function
export const makePayment = async (paymentData: PaymentData) => {
  try {
    if (!paymentData.senderPhoneNumber) {
      throw new Error("Sender phone number is required");
    }

    const result = await initiateMpesaPaymentCF({
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
export const getUserTransactions = async (limit: number = 50): Promise<{
  success: boolean;
  transactions: Transaction[];
}> => {
  try {
    const result = await getUserTransactionsCF({ limit });
    return result.data;
  } catch (error: any) {
    console.error("Fetching transactions failed:", error);
    throw new Error(error.message || "Failed to fetch transactions");
  }
};

// Real-time transaction listener
export const subscribeToTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const { db } = require('../firebase');
  const { collection, query, where, orderBy, onSnapshot } = require('firebase/firestore');

  const transactionsQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(transactionsQuery, (snapshot: any) => {
    const transactions = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(transactions);
  });
};