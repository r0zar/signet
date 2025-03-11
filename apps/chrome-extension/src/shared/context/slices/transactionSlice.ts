import { useState } from 'react'
import type { ClaimReward, Prediction, Transfer } from '../types'
import { sendMessage } from '../utils'

export interface TransactionActions {
  createTransfer: (to: string, amount: number, nonce: number, subnet?: string) => Promise<Transfer>
  createPrediction: (marketId: number, outcomeId: number, amount: number, nonce: number) => Promise<Prediction>
  createClaimReward: (receiptId: number, nonce: number) => Promise<ClaimReward>
}

export type TransactionSlice = TransactionActions

export function useTransactionSlice(signer: string | null): TransactionSlice {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Transaction operations
  const createTransfer = async (to: string, amount: number, nonce: number, subnet?: string): Promise<Transfer> => {
    setIsLoading(true);
    setError(null);

    if (!signer) {
      setError("No signer set");
      setIsLoading(false);
      throw new Error("No signer set");
    }

    try {
      const result = await sendMessage<{ transaction: Transfer }>("createTransferTx", {
        to,
        amount,
        nonce,
        signer,
        subnet // Pass the subnet to the handler
      });
      return result.transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create transfer";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const createPrediction = async (marketId: number, outcomeId: number, amount: number, nonce: number): Promise<Prediction> => {
    setIsLoading(true);
    setError(null);

    if (!signer) {
      setError("No signer set");
      setIsLoading(false);
      throw new Error("No signer set");
    }

    try {
      const result = await sendMessage<{ transaction: Prediction }>("createPredictionTx", {
        marketId,
        outcomeId,
        amount,
        nonce,
        signer
      });
      return result.transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create prediction";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const createClaimReward = async (receiptId: number, nonce: number): Promise<ClaimReward> => {
    setIsLoading(true);
    setError(null);

    if (!signer) {
      setError("No signer set");
      setIsLoading(false);
      throw new Error("No signer set");
    }

    try {
      const result = await sendMessage<{ transaction: ClaimReward }>("createClaimRewardTx", {
        receiptId,
        nonce,
        signer
      });
      return result.transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create claim reward";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    createTransfer,
    createPrediction,
    createClaimReward
  }
}