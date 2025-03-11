import { useState } from 'react'
import { type Message } from 'signet-sdk/src/messaging'
import { assets } from '../../../background/lib/constants'
import { type Status, type TransactionResult } from '../types'
import { sendMessage } from '../utils'

export interface SubnetState {
  status: Record<string, Status> | null
  isLoading: boolean
  error: string | null
  signer: string | null
}

export interface SubnetActions {
  getAssetBalances: () => Promise<Record<string, number>>
  getBalance: (address?: string) => Promise<Record<string, number>>
  getBalances: () => Promise<Record<string, Record<string, number>>>
  deposit: (amount: number, subnetId: string) => Promise<TransactionResult>
  withdraw: (amount: number, subnetId: string) => Promise<TransactionResult>
  mineBlock: (subnetId: string, batchSize?: number) => Promise<TransactionResult>
  mineAllPendingBlocks: (batchSize?: number) => Promise<Record<string, TransactionResult>>
  refreshBalances: (address?: string) => Promise<void>
  setSigner: (address: string) => Promise<void>
  generateSignature: (to: string, amount: number, nonce: number, subnetId: string) => Promise<string>
  refreshStatus: () => Promise<Record<string, Status>>
}

export type SubnetSlice = SubnetState & SubnetActions

export function useSubnetSlice(): SubnetSlice {
  // Initialize state
  const [status, setStatus] = useState<Record<string, Status>>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signer, setSigner] = useState<string | null>(null)

  // Status fetching
  const refreshStatus = async (): Promise<Record<string, Status>> => {
    setIsLoading(true);
    setError(null);

    try {
      const statusData = await sendMessage<Record<string, Status>>("getStatus");
      setStatus(statusData);
      return statusData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch status";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Signer operations
  const updateSigner = async (address: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await sendMessage("setSigner", { address });
      setSigner(address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to set signer";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Asset operations
  const getAssetBalances = async (): Promise<Record<string, number>> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get balances from all subnets
      const subnetBalances = await sendMessage<Record<string, number>>("getBalance");

      // Convert to asset balances using the assets mapping
      const assetBalances: Record<string, number> = {};

      // Map each asset to its corresponding subnet balance
      for (const asset of assets) {
        // Find the subnet balance for this asset's subnet
        const balance = subnetBalances[asset.subnet] || 0;
        assetBalances[asset.id] = balance;
      }

      return assetBalances;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get asset balances";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Balance operations
  const getBalance = async (address?: string): Promise<Record<string, number>> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<Record<string, number>>("getBalance", { address });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get balance";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const getBalances = async (): Promise<Record<string, Record<string, number>>> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<Record<string, Record<string, number>>>("getBalances");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get balances";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const refreshBalances = async (address?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await sendMessage<void>("refreshBalances", { address });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh balances";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Token operations
  const deposit = async (amount: number, subnetId: string): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<TransactionResult>("deposit", { amount, subnetId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to deposit";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const withdraw = async (amount: number, subnetId: string): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<TransactionResult>("withdraw", { amount, subnetId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to withdraw";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Mining operations
  const mineBlock = async (subnetId: string, batchSize?: number): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<TransactionResult>("mineBlock", { subnetId, batchSize });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mine block";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Mine all pending blocks across subnets
  const mineAllPendingBlocks = async (batchSize?: number): Promise<Record<string, TransactionResult>> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<Record<string, TransactionResult>>("mineAllPendingBlocks", { batchSize });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mine all pending blocks";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Signature operations
  const generateSignature = async (to: string, amount: number, nonce: number, subnetId: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      return await sendMessage<string>("generateSignature", { to, amount, nonce, subnetId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate signature";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    // State
    status,
    isLoading,
    error,
    signer,

    // Actions
    getAssetBalances,
    getBalance,
    getBalances,
    deposit,
    withdraw,
    mineBlock,
    mineAllPendingBlocks,
    refreshBalances,
    setSigner: updateSigner,
    generateSignature,
    refreshStatus
  }
}