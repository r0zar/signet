/**
 * Wallet manager for handling seed phrases and accounts
 */
import {
  initializeSecureStorage,
  isWalletInitialized,
  isSecureStorageReady,
  addSeedPhrase,
  getSeedPhrase,
  getAllSeedPhrases,
  deleteSeedPhrase,
  addAccount,
  getAccount,
  getAllAccounts,
  getAccountsForSeedPhrase,
  setActiveAccount,
  getActiveAccount,
  deleteAccount,
  clearWalletData,
  walletPassword
} from './storage';

import {
  generateSeedPhrase,
  validateSeedPhrase,
  createAccountFromSeed
} from './seed';

import type {
  SeedPhrase,
  Account,
  WalletState,
  CreateAccountOptions
} from './types';

/**
 * Initialize the wallet with a password
 */
export async function initializeWallet(password: string): Promise<boolean> {
  return await initializeSecureStorage(password);
}

/**
 * Check if the wallet is initialized
 */
export async function checkWalletInitialized(): Promise<boolean> {
  return await isWalletInitialized();
}

/**
 * Generate and store a new seed phrase
 */
export async function createNewSeedPhrase(name: string): Promise<SeedPhrase | null> {
  if (!isSecureStorageReady()) {
    throw new Error("Wallet not initialized");
  }

  // Generate a new random seed phrase
  const phrase = generateSeedPhrase();

  // Store it securely
  return await addSeedPhrase(name, phrase);
}

/**
 * Import an existing seed phrase
 */
export async function importSeedPhrase(name: string, phrase: string): Promise<SeedPhrase | null> {
  if (!isSecureStorageReady()) {
    throw new Error("Wallet not initialized");
  }

  // Validate the seed phrase
  if (!validateSeedPhrase(phrase)) {
    throw new Error("Invalid seed phrase");
  }

  // Store it securely
  return await addSeedPhrase(name, phrase);
}

/**
 * Create a new account from a seed phrase
 */
export async function createAccount(options: CreateAccountOptions): Promise<Account | null> {
  if (!isSecureStorageReady()) {
    throw new Error("Wallet not initialized");
  }

  // Make sure we have a wallet password
  if (!walletPassword) {
    throw new Error("Wallet password not available");
  }

  // Get the seed phrase
  const seedPhrase = await getSeedPhrase(options.seedPhraseId);
  if (!seedPhrase) {
    throw new Error("Seed phrase not found");
  }

  // Find the next available index if not specified
  const index = options.index ?? await getNextAccountIndex(options.seedPhraseId);

  // Create the account using the global wallet password
  const account = await createAccountFromSeed(
    seedPhrase.phrase,
    seedPhrase.id,
    walletPassword, // Password is checked above, should never be empty
    index
  );

  // Set active status
  account.isActive = !!options.makeActive;

  // Store the account
  const success = await addAccount(account);

  if (success) {
    return account;
  }

  return null;
}

/**
 * Get the next available account index for a seed phrase
 */
async function getNextAccountIndex(seedPhraseId: string): Promise<number> {
  const accounts = await getAccountsForSeedPhrase(seedPhraseId);

  if (accounts.length === 0) {
    return 0;
  }

  // Find the highest index and add 1
  return Math.max(...accounts.map(acc => acc.index)) + 1;
}

/**
 * Change the active account
 */
export async function activateAccount(accountId: string): Promise<boolean> {
  if (!isSecureStorageReady()) {
    throw new Error("Wallet not initialized");
  }

  return await setActiveAccount(accountId);
}

/**
 * Get the currently active account
 */
export async function getCurrentAccount(): Promise<Account | null> {
  if (!isSecureStorageReady()) {
    throw new Error("Wallet not initialized");
  }

  return await getActiveAccount();
}

/**
 * Reset the wallet (clear all data)
 * Warning: This will delete all seed phrases and accounts
 */
export async function resetWallet(): Promise<boolean> {
  if (!isSecureStorageReady()) {
    throw new Error("Wallet not initialized");
  }

  return await clearWalletData();
}

// Re-export storage functions and types for convenience
export {
  getSeedPhrase,
  getAllSeedPhrases,
  deleteSeedPhrase,
  getAccount,
  getAllAccounts,
  getAccountsForSeedPhrase,
  deleteAccount,
  type SeedPhrase,
  type Account,
  type WalletState
};