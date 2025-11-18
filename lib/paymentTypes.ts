// lib/paymentTypes.ts
export interface MpesaNumber {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  branchCode?: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export interface UserPaymentProfile {
  userId: string;
  mpesaNumbers: MpesaNumber[];
  bankAccounts: BankAccount[];
  defaultPaymentMethod: 'mpesa' | 'bank';
  createdAt?: string;
  updatedAt?: string;
}