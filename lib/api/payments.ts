import axios from "axios";
import { PAYMENT_METHODS } from "../paymentConfig";

const API_BASE_URL = "https://your-backend-url.com/api";

export interface PaymentData {
  destination: string;
  method: string;
  amount: number;
  description: string;
  userId: string;
  accountDetails: any;
  additionalInfo?: any;
}

// Main payment function that handles all payment methods
export const makePayment = async (paymentData: PaymentData) => {
  try {
    let response;

    switch (paymentData.method) {
      case PAYMENT_METHODS.PAYBILL:
        response = await initiatePaybillPayment(paymentData);
        break;
      
      case PAYMENT_METHODS.LIPA_NA_MPESA:
        response = await initiateLipaNaMpesaPayment(paymentData);
        break;
      
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

// PayBill payment
const initiatePaybillPayment = async (paymentData: PaymentData) => {
  const response = await axios.post(`${API_BASE_URL}/payments/paybill`, {
    businessCode: paymentData.accountDetails.businessCode,
    accountNumber: paymentData.accountDetails.accountNumber,
    amount: paymentData.amount,
    description: paymentData.description,
    userId: paymentData.userId,
    phoneNumber: await getUserPhoneNumber(),
  });
  return response.data;
};

// Lipa na M-Pesa (Till Number)
const initiateLipaNaMpesaPayment = async (paymentData: PaymentData) => {
  const response = await axios.post(`${API_BASE_URL}/payments/lipa-na-mpesa`, {
    tillNumber: paymentData.accountDetails.tillNumber,
    amount: paymentData.amount,
    description: paymentData.description,
    userId: paymentData.userId,
    phoneNumber: await getUserPhoneNumber(),
  });
  return response.data;
};

// Send Money (P2P)
const initiateSendMoneyPayment = async (paymentData: PaymentData) => {
  const response = await axios.post(`${API_BASE_URL}/payments/send-money`, {
    recipientPhone: paymentData.accountDetails.phoneNumber,
    amount: paymentData.amount,
    description: paymentData.description,
    userId: paymentData.userId,
    senderPhone: await getUserPhoneNumber(),
  });
  return response.data;
};

// Bank Transfer
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
  });
  return response.data;
};

// Helper functions
const getUserPhoneNumber = async (): Promise<string> => {
  // Implement based on your user management system
  return "254712345678";
};

// Fetch payment methods for a specific destination
export const getPaymentMethods = async (destination: string) => {
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