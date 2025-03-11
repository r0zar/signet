import { sendToBackground } from '@plasmohq/messaging'
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Message, send, subscribe } from 'signet-sdk/src/messaging'
import { assets } from '../../background/lib/constants';

// Define types for operations
type MessageAction =
  // Subnet operations
  | "getStatus"
  | "getBalance"
  | "getBalances"
  | "processTx"
  | "createTransferTx"
  | "createPredictionTx"
  | "createClaimRewardTx"
  | "deposit"
  | "withdraw"
  | "refreshBalances"
  | "mineBlock"
  | "mineAllPendingBlocks"
  | "generateSignature"
  | "setSigner"
  // Wallet related actions
  | "initializeWallet"
  | "checkWalletInitialized"
  | "createSeedPhrase"
  | "importSeedPhrase"
  | "getAllSeedPhrases"
  | "getSeedPhraseById"
  | "deleteSeedPhrase"
  | "createAccount"
  | "getAccount"
  | "getAllAccounts"
  | "getAccountsForSeedPhrase"
  | "activateAccount"
  | "getCurrentAccount"
  | "deleteAccount"
  | "resetWallet";

// Wallet types
export interface SeedPhrase {
  id: string;
  name: string;
  createdAt: number;
}

export interface Account {
  id: string;
  name: string;
  index: number;
  seedPhraseId: string;
  stxAddress: string;
  publicKey: string;
  createdAt: number;
  isActive: boolean;
}

// Transaction interfaces
interface TransactionRequest {
  type: string;
  signature: string;
  signer: string;
  nonce: number;
}

interface Transfer extends TransactionRequest {
  type: 'transfer';
  to: string;
  amount: number;
}

interface Prediction extends TransactionRequest {
  type: 'predict';
  marketId: number;
  outcomeId: number;
  amount: number;
}

interface ClaimReward extends TransactionRequest {
  type: 'claim-reward';
  receiptId: number;
}

interface TransactionResult {
  txid: string;
}

interface Status {
  subnet: string;
  txQueue: any[];
  lastProcessedBlock?: number;
}

// Basic response structure
interface HandlerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define the context type with state and actions
interface SignetContextType {
  // State
  messages: Message[];
  status: Record<string, Status> | null;
  isLoading: boolean;
  error: string | null;
  signer: string | null;

  // Asset operations
  getAssetBalances: () => Promise<Record<string, number>>;

  // Transaction creation
  createTransfer: (to: string, amount: number, nonce: number, subnet?: string) => Promise<Transfer>;
  createPrediction: (marketId: number, outcomeId: number, amount: number, nonce: number) => Promise<Prediction>;
  createClaimReward: (receiptId: number, nonce: number) => Promise<ClaimReward>;

  // Core operations
  getBalance: (address?: string) => Promise<Record<string, number>>;
  getBalances: () => Promise<Record<string, Record<string, number>>>;
  deposit: (amount: number, subnetId: string) => Promise<TransactionResult>;
  withdraw: (amount: number, subnetId: string) => Promise<TransactionResult>;
  mineBlock: (subnetId: string, batchSize?: number) => Promise<TransactionResult>;
  mineAllPendingBlocks: (batchSize?: number) => Promise<Record<string, TransactionResult>>;
  refreshBalances: (address?: string) => Promise<void>;

  // Utility operations
  setSigner: (address: string) => Promise<void>;
  generateSignature: (to: string, amount: number, nonce: number, subnetId: string) => Promise<string>;
  clearMessages: () => void;
  refreshStatus: () => Promise<Record<string, Status>>;

  // Wallet state
  isWalletInitialized: boolean;
  currentAccount: Account | null;
  accounts: Account[];
  seedPhrases: SeedPhrase[];

  // Wallet operations
  initializeWallet: (password: string) => Promise<boolean>;
  createSeedPhrase: (name: string) => Promise<SeedPhrase | null>;
  importSeedPhrase: (name: string, phrase: string) => Promise<SeedPhrase | null>;
  getAllSeedPhrases: () => Promise<SeedPhrase[]>;
  deleteSeedPhrase: (id: string) => Promise<boolean>;
  createAccount: (seedPhraseId: string, makeActive?: boolean, index?: number) => Promise<Account | null>;
  activateAccount: (id: string) => Promise<boolean>;
  getCurrentAccount: () => Promise<Account | null>;
  deleteAccount: (id: string) => Promise<boolean>;
  resetWallet: () => Promise<boolean>;
  refreshWalletState: () => Promise<void>;
}

// Create a default context
const defaultContext: SignetContextType = {
  // Subnet state
  messages: [],
  status: null,
  isLoading: false,
  error: null,
  signer: null,

  // Asset operations
  getAssetBalances: async () => { throw new Error("Context not initialized") },

  // Transaction operations
  createTransfer: async () => { throw new Error("Context not initialized") },
  createPrediction: async () => { throw new Error("Context not initialized") },
  createClaimReward: async () => { throw new Error("Context not initialized") },

  // Subnet operations
  getBalance: async () => { throw new Error("Context not initialized") },
  getBalances: async () => { throw new Error("Context not initialized") },
  deposit: async () => { throw new Error("Context not initialized") },
  withdraw: async () => { throw new Error("Context not initialized") },
  mineBlock: async () => { throw new Error("Context not initialized") },
  mineAllPendingBlocks: async () => { throw new Error("Context not initialized") },
  refreshBalances: async () => { throw new Error("Context not initialized") },

  // Utility operations
  setSigner: async () => { throw new Error("Context not initialized") },
  generateSignature: async () => { throw new Error("Context not initialized") },
  clearMessages: () => { },
  refreshStatus: async () => { throw new Error("Context not initialized") },

  // Wallet state
  isWalletInitialized: false,
  currentAccount: null,
  accounts: [],
  seedPhrases: [],

  // Wallet operations
  initializeWallet: async () => { throw new Error("Context not initialized") },
  createSeedPhrase: async () => { throw new Error("Context not initialized") },
  importSeedPhrase: async () => { throw new Error("Context not initialized") },
  getAllSeedPhrases: async () => { throw new Error("Context not initialized") },
  deleteSeedPhrase: async () => { throw new Error("Context not initialized") },
  createAccount: async () => { throw new Error("Context not initialized") },
  activateAccount: async () => { throw new Error("Context not initialized") },
  getCurrentAccount: async () => { throw new Error("Context not initialized") },
  deleteAccount: async () => { throw new Error("Context not initialized") },
  resetWallet: async () => { throw new Error("Context not initialized") },
  refreshWalletState: async () => { throw new Error("Context not initialized") }
}

// Create context
const SignetContext = createContext<SignetContextType>(defaultContext)

// Provider props
interface SignetProviderProps {
  children: ReactNode
}

// Helper function to send messages to the background service
async function sendMessage<T>(action: MessageAction, data?: any): Promise<T> {
  try {
    const response = await sendToBackground<{ action: MessageAction, data?: any }, HandlerResponse<T>>({
      name: 'handler',
      body: { action, data }
    });

    if (!response.success) {
      throw new Error(response.error || "Unknown error occurred");
    }

    return response.data as T;
  } catch (error) {
    console.error(`Error in ${action} message:`, error);
    throw error;
  }
}

// The actual provider component
export function SignetProvider({ children }: SignetProviderProps) {
  // Initialize state for subnet
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Record<string, Status>>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signer, setSigner] = useState<string | null>(null)

  // Initialize state for wallet
  const [isWalletInitialized, setIsWalletInitialized] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [seedPhrases, setSeedPhrases] = useState<SeedPhrase[]>([])

  // Setup message subscriber
  useEffect(() => {
    // Subscribe to all messages
    const unsubscribe = subscribe((message) => {
      // Add all messages to the message log
      setMessages(prev => [...prev, message])
    })

    // Cleanup on unmount
    return unsubscribe
  }, [])

  // Get initial status and wallet state
  useEffect(() => {
    refreshStatus()
    checkWalletInitialization()
  }, [])

  // Actions
  const clearMessages = () => setMessages([])

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

  // Wallet functionality

  // Check if wallet is initialized
  const checkWalletInitialization = async () => {
    setIsLoading(true);
    try {
      const initialized = await sendMessage<boolean>("checkWalletInitialized");
      setIsWalletInitialized(initialized);

      if (initialized) {
        // If wallet is initialized, load its state
        await refreshWalletState();
      }
    } catch (err) {
      console.error("Error checking wallet initialization:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Refresh wallet state (accounts, seed phrases, current account)
  const refreshWalletState = async () => {
    setIsLoading(true);
    try {
      // Get all accounts
      const allAccounts = await sendMessage<Account[]>("getAllAccounts");
      setAccounts(allAccounts);

      // Get all seed phrases
      const allSeedPhrases = await sendMessage<SeedPhrase[]>("getAllSeedPhrases");
      setSeedPhrases(allSeedPhrases);

      // Get current account
      const current = await sendMessage<Account | null>("getCurrentAccount");
      setCurrentAccount(current);

      // If there's a current account, update the signer
      if (current) {
        setSigner(current.stxAddress);
      }
    } catch (err) {
      console.error("Error refreshing wallet state:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Initialize wallet with password
  const initializeWallet = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<boolean>("initializeWallet", { password });
      setIsWalletInitialized(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize wallet";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Create a new seed phrase
  const createSeedPhrase = async (name: string): Promise<SeedPhrase | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<SeedPhrase | null>("createSeedPhrase", { name });
      if (result) {
        // Update state with new seed phrase
        setSeedPhrases(prev => [...prev, result]);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create seed phrase";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Import an existing seed phrase
  const importSeedPhrase = async (name: string, phrase: string): Promise<SeedPhrase | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<SeedPhrase | null>("importSeedPhrase", { name, phrase });
      if (result) {
        // Update state with new seed phrase
        setSeedPhrases(prev => [...prev, result]);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to import seed phrase";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Get all seed phrases
  const getAllSeedPhrases = async (): Promise<SeedPhrase[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<SeedPhrase[]>("getAllSeedPhrases");
      setSeedPhrases(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get seed phrases";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Delete a seed phrase
  const deleteSeedPhrase = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<boolean>("deleteSeedPhrase", { id });
      if (result) {
        // Remove from state
        setSeedPhrases(prev => prev.filter(sp => sp.id !== id));

        // Remove associated accounts
        setAccounts(prev => prev.filter(acc => acc.seedPhraseId !== id));

        // If current account was from this seed phrase, clear it
        if (currentAccount && currentAccount.seedPhraseId === id) {
          setCurrentAccount(null);
          setSigner(null);
        }
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete seed phrase";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Create a new account from a seed phrase
  const createAccount = async (
    seedPhraseId: string,
    makeActive: boolean = false,
    index?: number
  ): Promise<Account | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<Account | null>("createAccount", {
        seedPhraseId,
        makeActive,
        index
      });

      if (result) {
        // Add to accounts list
        setAccounts(prev => [...prev, result]);

        // If marked as active, update current account and signer
        if (result.isActive) {
          setCurrentAccount(result);
          setSigner(result.stxAddress);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Set an account as active
  const activateAccount = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<boolean>("activateAccount", { id });

      if (result) {
        // Update active status for all accounts
        const updatedAccounts = accounts.map(acc => ({
          ...acc,
          isActive: acc.id === id
        }));

        setAccounts(updatedAccounts);

        // Set current account
        const activated = updatedAccounts.find(acc => acc.id === id) || null;
        setCurrentAccount(activated);

        // Update signer
        if (activated) {
          setSigner(activated.stxAddress);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to activate account";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Get current active account
  const getCurrentAccount = async (): Promise<Account | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<Account | null>("getCurrentAccount");
      setCurrentAccount(result);

      // Update signer
      if (result) {
        setSigner(result.stxAddress);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get current account";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Delete an account
  const deleteAccount = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<boolean>("deleteAccount", { id });

      if (result) {
        // Remove from accounts list
        setAccounts(prev => prev.filter(acc => acc.id !== id));

        // If it was the current account, clear it
        if (currentAccount && currentAccount.id === id) {
          await refreshWalletState(); // Get the new active account
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete account";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Reset wallet (clear all data)
  const resetWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage<boolean>("resetWallet");

      if (result) {
        // Clear all state
        setAccounts([]);
        setSeedPhrases([]);
        setCurrentAccount(null);
        setSigner(null);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset wallet";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  console.log({ status })

  // Create context value
  const contextValue: SignetContextType = {
    // Subnet state
    messages,
    status,
    isLoading,
    error,
    signer,

    // Asset operations
    getAssetBalances,

    // Subnet actions
    createTransfer,
    createPrediction,
    createClaimReward,
    getBalance,
    getBalances,
    deposit,
    withdraw,
    mineBlock,
    mineAllPendingBlocks,
    refreshBalances,
    setSigner: updateSigner,
    generateSignature,
    clearMessages,
    refreshStatus,

    // Wallet state
    isWalletInitialized,
    currentAccount,
    accounts,
    seedPhrases,

    // Wallet actions
    initializeWallet,
    createSeedPhrase,
    importSeedPhrase,
    getAllSeedPhrases,
    deleteSeedPhrase,
    createAccount,
    activateAccount,
    getCurrentAccount,
    deleteAccount,
    resetWallet,
    refreshWalletState
  }

  return (
    <SignetContext.Provider value={contextValue}>
      {children}
    </SignetContext.Provider>
  )
}

// Custom hook for using the context
export function useSignetContext() {
  const context = useContext(SignetContext)
  if (context === undefined) {
    throw new Error('useSignetContext must be used within a SignetProvider')
  }
  return context
}