export const PAYMENT_METHODS = {
  BANK_ACCOUNT: 'bank_account',
  PAYBILL: 'paybill',
  LIPA_NA_MPESA: 'lipa_na_mpesa',
  SEND_MONEY: 'send_money'
} as const;

// Define types for the payment methods
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export interface PaymentAccountDetails {
  paybill?: { businessCode: string; accountNumber: string };
  lipa_na_mpesa?: { tillNumber: string };
  bank_account?: { bankName: string; accountNumber: string; branch: string };
  send_money?: { phoneNumber: string };
}

export interface PaymentDestination {
  methods: PaymentMethod[];
  defaultMethod: PaymentMethod;
  accounts: PaymentAccountDetails;
}

export interface PaymentMethodConfig {
  name: string;
  description: string;
  fields: string[];
}

// Define the specific payment options as a type
export type PaymentOption = 
  | "Tithe"
  | "Offering"
  | "Youth Membership"
  | "Church Membership Registration"
  | "Church Emergency Fund"
  | "Youth Monthly Contributions"
  | "Youth Emergency Fund";

export const PAYMENT_CONFIG: {
  paymentDestinations: Record<PaymentOption, PaymentDestination>;
  methods: Record<PaymentMethod, PaymentMethodConfig>;
} = {
  paymentDestinations: {
    "Tithe": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.LIPA_NA_MPESA],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "TITHE001" },
        lipa_na_mpesa: { tillNumber: "1234567" },
        bank_account: { bankName: "KCB", accountNumber: "1101234567", branch: "Main" }
      }
    },
    "Offering": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.LIPA_NA_MPESA],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "OFFERING001" },
        lipa_na_mpesa: { tillNumber: "1234568" },
        bank_account: { bankName: "Equity", accountNumber: "1201234567", branch: "Main" }
      }
    },
    "Youth Membership": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "YOUTH001" },
        send_money: { phoneNumber: "254712345678" },
        bank_account: { bankName: "Co-op", accountNumber: "1301234567", branch: "Main" }
      }
    },
    "Church Membership Registration": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.LIPA_NA_MPESA, PAYMENT_METHODS.BANK_ACCOUNT],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "REG001" },
        lipa_na_mpesa: { tillNumber: "1234569" },
        bank_account: { bankName: "KCB", accountNumber: "1401234567", branch: "Main" }
      }
    },
    "Church Emergency Fund": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.SEND_MONEY, PAYMENT_METHODS.BANK_ACCOUNT],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "EMERGENCY001" },
        send_money: { phoneNumber: "254712345679" },
        bank_account: { bankName: "KCB", accountNumber: "1501234567", branch: "Main" }
      }
    },
    "Youth Monthly Contributions": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.LIPA_NA_MPESA],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "YOUTH_MONTHLY001" },
        lipa_na_mpesa: { tillNumber: "1234570" },
        bank_account: { bankName: "Equity", accountNumber: "1601234567", branch: "Main" }
      }
    },
    "Youth Emergency Fund": {
      methods: [PAYMENT_METHODS.PAYBILL, PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.PAYBILL,
      accounts: {
        paybill: { businessCode: "123456", accountNumber: "YOUTH_EMERGENCY001" },
        send_money: { phoneNumber: "254712345680" },
        bank_account: { bankName: "Co-op", accountNumber: "1701234567", branch: "Main" }
      }
    }
  },

  methods: {
    [PAYMENT_METHODS.BANK_ACCOUNT]: {
      name: "Bank Transfer",
      description: "Transfer to church bank account",
      fields: ['bankName', 'accountNumber', 'branch']
    },
    [PAYMENT_METHODS.PAYBILL]: {
      name: "PayBill",
      description: "Pay via M-Pesa PayBill",
      fields: ['businessCode', 'accountNumber']
    },
    [PAYMENT_METHODS.LIPA_NA_MPESA]: {
      name: "Lipa na M-Pesa",
      description: "Pay via M-Pesa Till Number",
      fields: ['tillNumber']
    },
    [PAYMENT_METHODS.SEND_MONEY]: {
      name: "Send Money",
      description: "Send directly via M-Pesa",
      fields: ['phoneNumber']
    }
  }
};