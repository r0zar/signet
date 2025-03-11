import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import { type Message } from 'signet-sdk/src/messaging'
import type { SignetContextType } from './context-types'
import { setupMessageSubscriber, useMessagesSlice } from './slices/messagesSlice'
import { useSubnetSlice } from './slices/subnetSlice'
import { useTransactionSlice } from './slices/transactionSlice'
import { useWalletSlice } from './slices/walletSlice'
import type { Account, SeedPhrase, Status } from './types'

// Create a minimal default context with error handling
const defaultContext: SignetContextType = {
  // Messages state
  messages: [],
  clearMessages: () => { },
  addMessage: () => { },

  // Subnet state
  status: null,
  isLoading: false,
  error: null,
  signer: null,

  // Utility operations
  getAssetBalances: async () => { throw new Error("Context not initialized") },
  getBalance: async () => { throw new Error("Context not initialized") },
  getBalances: async () => { throw new Error("Context not initialized") },
  deposit: async () => { throw new Error("Context not initialized") },
  withdraw: async () => { throw new Error("Context not initialized") },
  mineBlock: async () => { throw new Error("Context not initialized") },
  mineAllPendingBlocks: async () => { throw new Error("Context not initialized") },
  refreshBalances: async () => { throw new Error("Context not initialized") },
  setSigner: async () => { throw new Error("Context not initialized") },
  generateSignature: async () => { throw new Error("Context not initialized") },
  refreshStatus: async () => { throw new Error("Context not initialized") },

  // Transaction operations
  createTransfer: async () => { throw new Error("Context not initialized") },
  createPrediction: async () => { throw new Error("Context not initialized") },
  createClaimReward: async () => { throw new Error("Context not initialized") },

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
  refreshWalletState: async () => { throw new Error("Context not initialized") },
  checkWalletInitialization: async () => { throw new Error("Context not initialized") }
}

// Create context
const SignetContext = createContext<SignetContextType>(defaultContext)

// Provider props
interface SignetProviderProps {
  children: ReactNode
}

// The actual provider component
export function SignetProvider({ children }: SignetProviderProps) {
  // Initialize message slice 
  const messagesSlice = useMessagesSlice();

  // Use the Wallet slice with a callback to update the subnet slice's signer
  const walletSlice = useWalletSlice((account: Account | null) => {
    // This callback gets called when the active account changes
    if (account) {
      // Update the signer in the subnet slice
      subnetSlice.setSigner(account.stxAddress);
    }
  });

  // Initialize subnet slice with the wallet's current account address as initial signer
  const subnetSlice = useSubnetSlice();

  // Initialize transaction slice (depends on signer from subnet slice)
  const transactionSlice = useTransactionSlice(subnetSlice.signer);

  // Setup message subscriber
  useEffect(() => {
    // Subscribe to all messages
    const unsubscribe = setupMessageSubscriber(messagesSlice.addMessage);

    // Cleanup on unmount
    return unsubscribe;
  }, [messagesSlice.addMessage]);

  // Get initial status and wallet state
  useEffect(() => {
    subnetSlice.refreshStatus();
    walletSlice.checkWalletInitialization();
  }, [subnetSlice.refreshStatus, walletSlice.checkWalletInitialization]);

  // Create context value by merging all slices
  const contextValue: SignetContextType = {
    ...subnetSlice,
    ...transactionSlice,
    ...walletSlice,
    ...messagesSlice
  };

  return (
    <SignetContext.Provider value={contextValue}>
      {children}
    </SignetContext.Provider>
  );
}

// Custom hook for using the context
export function useSignetContext() {
  const context = useContext(SignetContext);
  if (context === undefined) {
    throw new Error('useSignetContext must be used within a SignetProvider');
  }
  return context;
}

// Re-export types for convenience
export type { Account, SeedPhrase, Status, Message };