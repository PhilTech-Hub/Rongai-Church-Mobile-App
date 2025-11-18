export const PAYMENT_METHODS = {
  SEND_MONEY: 'send_money',
  BANK_ACCOUNT: 'bank_account'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export interface PaymentMethodConfig {
  name: string;
  description: string;
  fields: string[];
}

export interface PaymentAccountDetails {
  send_money?: { phoneNumber: string };
  bank_account?: { bankName: string; accountNumber: string; branch: string };
}

export interface PaymentDestination {
  methods: PaymentMethod[];
  defaultMethod: PaymentMethod;
  accounts: PaymentAccountDetails;
}

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
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" } // Church number
      }
    },
    "Offering": {
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" }
      }
    },
    "Youth Membership": {
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" }
      }
    },
    "Church Membership Registration": {
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" }
      }
    },
    "Church Emergency Fund": {
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" }
      }
    },
    "Youth Monthly Contributions": {
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" }
      }
    },
    "Youth Emergency Fund": {
      methods: [PAYMENT_METHODS.SEND_MONEY],
      defaultMethod: PAYMENT_METHODS.SEND_MONEY,
      accounts: {
        send_money: { phoneNumber: "0110490333" }
      }
    }
  },

  methods: {
    [PAYMENT_METHODS.SEND_MONEY]: {
      name: "Send Money",
      description: "Send directly via M-Pesa to church number",
      fields: ['phoneNumber']
    },
    [PAYMENT_METHODS.BANK_ACCOUNT]: {
      name: "Bank Transfer",
      description: "Transfer to church bank account",
      fields: ['bankName', 'accountNumber', 'branch']
    }
  }
};