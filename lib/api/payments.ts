import axios from "axios";
import { PAYMENT_METHODS, PaymentMethod, PaymentOption } from "../paymentConfig";

const API_BASE_URL = "https://your-backend-url.com/api";

export interface PaymentData {
  destination: PaymentOption;
  method: PaymentMethod;
  amount: number;
  description: string;
  userId: string;
  accountDetails: any;
  additionalInfo?: any;
  senderPhoneNumber?: string; // Added for M-Pesa Send Money
}

// Main payment function that handles all payment methods
export const makePayment = async (paymentData: PaymentData) => {
  try {
    let response;

    switch (paymentData.method) {
      case PAYMENT_METHODS.SEND_MONEY:
        response = await initiateSendMoneyPayment(paymentData);
        break;
      
      case PAYMENT_METHODS.BANK_ACCOUNT:
        response = await initiateBankTransferPayment(paymentData);
        break;
      
      default:
        throw new Error("Unsupported payment method");
    }

    return response;
  } catch (error: any) {
    console.error("Payment initiation failed:", error.response?.data || error.message);
    throw error;
  }
};

// Send Money (P2P) - Primary payment method
const initiateSendMoneyPayment = async (paymentData: PaymentData) => {
  if (!paymentData.senderPhoneNumber) {
    throw new Error("Sender phone number is required for M-Pesa payments");
  }

  const response = await axios.post(`${API_BASE_URL}/payments/send-money`, {
    recipientPhone: paymentData.accountDetails.phoneNumber, // Church number (+254110490333)
    amount: paymentData.amount,
    description: paymentData.description,
    userId: paymentData.userId,
    senderPhone: paymentData.senderPhoneNumber, // User's selected M-Pesa number
    paymentDestination: paymentData.destination, // e.g., "Tithe", "Offering", etc.
  });
  return response.data;
};

// Bank Transfer - Alternative payment method
const initiateBankTransferPayment = async (paymentData: PaymentData) => {
  const response = await axios.post(`${API_BASE_URL}/payments/bank-transfer`, {
    bankName: paymentData.accountDetails.bankName,
    accountNumber: paymentData.accountDetails.accountNumber,
    branch: paymentData.accountDetails.branch,
    amount: paymentData.amount,
    description: paymentData.description,
    userId: paymentData.userId,
    senderBank: paymentData.additionalInfo?.senderBank,
    transactionRef: paymentData.additionalInfo?.transactionRef,
    paymentDestination: paymentData.destination,
  });
  return response.data;
};

// Helper function to get user phone number (now handled by PaymentProfileContext)
export const getUserPhoneNumber = async (): Promise<string> => {
  // This should now be handled by the PaymentProfileContext
  // Users will select their M-Pesa number from their saved numbers
  throw new Error("Use PaymentProfileContext to get user's M-Pesa numbers");
};

// Simplified payment initiation for M-Pesa Send Money
export const initiateMpesaPayment = async (
  destination: PaymentOption,
  amount: number,
  description: string,
  userId: string,
  senderPhoneNumber: string
) => {
  try {
    // Get the recipient phone number from payment config
    const recipientPhone = getRecipientPhoneNumber(destination);
    
    const response = await axios.post(`${API_BASE_URL}/payments/mpesa-send`, {
      recipientPhone,
      amount,
      description,
      userId,
      senderPhone: senderPhoneNumber,
      destination,
    });
    
    return response.data;
  } catch (error: any) {
    console.error("M-Pesa payment initiation failed:", error.response?.data || error.message);
    throw error;
  }
};

// Get recipient phone number based on payment destination
const getRecipientPhoneNumber = (destination: PaymentOption): string => {
  // All payments go to the same youth account number
  return "+254110490333";
};

// Fetch payment methods for a specific destination
export const getPaymentMethods = async (destination: PaymentOption) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/methods/${destination}`);
    return response.data;
  } catch (error: any) {
    console.error("Fetching payment methods failed:", error.response?.data || error.message);
    throw error;
  }
};

// Verify transaction status
export const verifyTransaction = async (transactionId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}/status`);
    return response.data;
  } catch (error: any) {
    console.error("Verifying transaction failed:", error.response?.data || error.message);
    throw error;
  }
};

// Get transaction history for user
export const getUserTransactions = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Fetching user transactions failed:", error.response?.data || error.message);
    throw error;
  }
};

// Simplified payment function for the common use case
export const makeMpesaPayment = async (
  destination: PaymentOption,
  amount: number,
  description: string,
  userId: string,
  senderPhoneNumber: string
) => {
  const paymentData: PaymentData = {
    destination,
    method: PAYMENT_METHODS.SEND_MONEY,
    amount,
    description,
    userId,
    accountDetails: {
      phoneNumber: "+254110490333" // Fixed recipient number
    },
    senderPhoneNumber
  };

  return await makePayment(paymentData);
};