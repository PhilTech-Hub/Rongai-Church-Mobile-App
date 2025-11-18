export interface MpesaNumber {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  isDefault: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface UserPaymentProfile {
  userId: string;
  mpesaNumbers: MpesaNumber[];
  defaultPaymentMethod: 'mpesa';
}