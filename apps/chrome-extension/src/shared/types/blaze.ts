import { TransactionType } from './signet';

// Simplified transaction status - only what we need for MVP
export enum TxStatus {
  PENDING = 'pending',    // Waiting to be processed
  SUBMITTED = 'submitted' // Sent to blockchain
}

// Base transaction interface
export interface BaseTransaction {
  id: string;
  type: TransactionType;
  signature: string;
  signer: string;
  timestamp: number;
  status: TxStatus;
}

// Transaction types
export interface TransferTransaction extends BaseTransaction {
  type: TransactionType.TRANSFER;
  to: string;
  amount: number;
  nonce: number;
}

export interface PredictionTransaction extends BaseTransaction {
  type: TransactionType.PREDICT;
  marketId: number;
  outcomeId: number;
  amount: number;
  nonce: number;
}

export interface ClaimRewardTransaction extends BaseTransaction {
  type: TransactionType.CLAIM_REWARD;
  receiptId: number;
  nonce: number;
}

export type Transaction =
  | TransferTransaction
  | PredictionTransaction
  | ClaimRewardTransaction;

// Simple mempool state
export interface MempoolState {
  transactions: Record<string, Transaction>;
  lastProcessed: number;
}