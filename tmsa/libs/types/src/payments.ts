export type PaymentProvider = 'stripe' | 'cinetpay' | 'wallet';

export type PaymentStatus =
  | 'initialized'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded';

export interface PaymentIntent {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementReport {
  id: string;
  provider: PaymentProvider;
  totalAmount: number;
  currency: string;
  executionDate: string;
  entries: Array<{
    reference: string;
    amount: number;
    fees: number;
  }>;
}
