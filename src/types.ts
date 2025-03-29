export type BillType = 'electric' | 'water' | 'gas';

export interface Bill {
  amount: number;
  startDate: string;
  endDate: string;
  days: number;
}

export interface Person {
  id: number;
  startDate: string;
  endDate: string;
  days: number;
}

export interface BillPaymentResult {
  overlapDays: number;
  payment: number;
}

export interface CalculationResult {
  id: number;
  totalDays: number;
  electric: BillPaymentResult;
  water: BillPaymentResult;
  gas: BillPaymentResult;
  totalPayment: number;
  [key: string]: any; // Index signature for dynamic access to bill types
}