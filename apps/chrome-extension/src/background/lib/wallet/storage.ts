/**
 * Secure storage of wallet data
 */
import { SecureStorage } from "@plasmohq/storage/secure";
import { Storage } from "@plasmohq/storage";
import type { SeedPhrase, Account, WalletState, CreateAccountOptions } from './types';

// Storage keys
const WALLET_STATE_KEY = 'wallet_state';
const WALLET_VERSION_KEY = 'wallet_version';
const WALLET_SESSION_KEY = 'wallet_session';
const CURRENT_VERSION = 1;

// Session duration in milliseconds (15 minutes)
const SESSION_DURATION = 15 * 60 * 1000;

// Regular storage for non-sensitive data
const regularStorage = new Storage({ area: "local" });

// Secure storage for sensitive data
let secureStorage: SecureStorage | null = null;

// Global wallet password used for key encryption - stored in memory only
export let walletPassword: string | null = null;

/**
 * Session data structure for temporary wallet sessions
 */
interface WalletSession {
  password: string;
  expiresAt: number;
}

/**
 * Initialize secure storage with a password
 */
export async function initializeSecureStorage(password: string): Promise<boolean> {
  try {
    secureStorage = new SecureStorage();
    await secureStorage.setPassword(password);

    // Store password in memory for account encryption
    walletPassword = password;

    // Check if wallet is already initialized
    const isInitialized = await isWalletInitialized();

    if (!isInitialized) {
      // Create initial empty wallet state
      const initialState: WalletState = {
        seedPhrases: [],
        accounts: [],
        activeAccountId: null,
        isInitialized: true
      };

      // Store initial state
      await secureStorage.set(WALLET_STATE_KEY, initialState);

      // Store version
      await regularStorage.set(WALLET_VERSION_KEY, CURRENT_VERSION);
    }

    // Create a session for this login (valid for 15 minutes)
    await createWalletSession(password);

    return true;
  } catch (error) {
    console.error("Failed to initialize secure storage:", error);
    secureStorage = null;
    walletPassword = null;
    return false;
  }
}

/**
 * Check if the wallet has been initialized
 */
export async function isWalletInitialized(): Promise<boolean> {
  try {
    // First check version in regular storage
    const version = await regularStorage.get(WALLET_VERSION_KEY);
    if (!version) {
      return false;
    }

    // Then check if secure storage has the wallet state
    if (!secureStorage) {
      return false;
    }

    const state = await secureStorage.get<WalletState>(WALLET_STATE_KEY);
    return !!state?.isInitialized;
  } catch {
    return false;
  }
}

/**
 * Check if secure storage is ready to use
 */
export function isSecureStorageReady(): boolean {
  return secureStorage !== null;
}

/**
 * Get the current wallet state
 */
export async function getWalletState(): Promise<WalletState | null> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    return await secureStorage.get<WalletState>(WALLET_STATE_KEY);
  } catch (error) {
    console.error("Failed to get wallet state:", error);
    return null;
  }
}

/**
 * Save the wallet state
 */
async function saveWalletState(state: WalletState): Promise<boolean> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    await secureStorage.set(WALLET_STATE_KEY, state);
    return true;
  } catch (error) {
    console.error("Failed to save wallet state:", error);
    return false;
  }
}

/**
 * Add a new seed phrase to the wallet
 */
export async function addSeedPhrase(name: string, phrase: string): Promise<SeedPhrase | null> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    // Check if name already exists
    const existingPhrase = state.seedPhrases.find(sp => sp.name === name);
    if (existingPhrase) {
      throw new Error(`A seed phrase with name "${name}" already exists`);
    }

    // Create new seed phrase with unique ID
    const newSeedPhrase: SeedPhrase = {
      id: `seed_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      phrase,
      createdAt: Date.now()
    };

    // Add to state
    state.seedPhrases.push(newSeedPhrase);

    // Save state
    await saveWalletState(state);

    return newSeedPhrase;
  } catch (error) {
    console.error("Failed to add seed phrase:", error);
    return null;
  }
}

/**
 * Get a seed phrase by ID
 */
export async function getSeedPhrase(id: string): Promise<SeedPhrase | null> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    return state.seedPhrases.find(sp => sp.id === id) || null;
  } catch (error) {
    console.error("Failed to get seed phrase:", error);
    return null;
  }
}

/**
 * Get all seed phrases
 */
export async function getAllSeedPhrases(): Promise<SeedPhrase[]> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    return state.seedPhrases;
  } catch (error) {
    console.error("Failed to get all seed phrases:", error);
    return [];
  }
}

/**
 * Delete a seed phrase and all its accounts
 */
export async function deleteSeedPhrase(id: string): Promise<boolean> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    // Remove the seed phrase
    state.seedPhrases = state.seedPhrases.filter(sp => sp.id !== id);

    // Remove all accounts associated with this seed phrase
    state.accounts = state.accounts.filter(acc => acc.seedPhraseId !== id);

    // If active account was from this seed phrase, reset it
    if (state.activeAccountId) {
      const activeAccount = state.accounts.find(a => a.id === state.activeAccountId);
      if (activeAccount && activeAccount.seedPhraseId === id) {
        state.activeAccountId = state.accounts.length > 0 ? state.accounts[0].id : null;
      }
    }

    // Save state
    await saveWalletState(state);

    return true;
  } catch (error) {
    console.error("Failed to delete seed phrase:", error);
    return false;
  }
}

/**
 * Add a new account derived from a seed phrase
 */
export async function addAccount(account: Account): Promise<boolean> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    // Ensure account has an ID
    if (!account.id) {
      account.id = `account_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Add the account
    state.accounts.push(account);

    // If this is the first account or it's marked as active, set it as active
    if (!state.activeAccountId || account.isActive) {
      state.activeAccountId = account.id;

      // Ensure only one account is active
      state.accounts.forEach(acc => {
        if (acc.id !== account.id) {
          acc.isActive = false;
        }
      });
    }

    // Save state
    await saveWalletState(state);

    return true;
  } catch (error) {
    console.error("Failed to add account:", error);
    return false;
  }
}

/**
 * Get an account by ID
 */
export async function getAccount(id: string): Promise<Account | null> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    return state.accounts.find(acc => acc.id === id) || null;
  } catch (error) {
    console.error("Failed to get account:", error);
    return null;
  }
}

/**
 * Get all accounts
 */
export async function getAllAccounts(): Promise<Account[]> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    return state.accounts;
  } catch (error) {
    console.error("Failed to get all accounts:", error);
    return [];
  }
}

/**
 * Get accounts for a specific seed phrase
 */
export async function getAccountsForSeedPhrase(seedPhraseId: string): Promise<Account[]> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    return state.accounts.filter(acc => acc.seedPhraseId === seedPhraseId);
  } catch (error) {
    console.error("Failed to get accounts for seed phrase:", error);
    return [];
  }
}

/**
 * Set the active account
 */
export async function setActiveAccount(id: string): Promise<boolean> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    // Make sure the account exists
    const accountExists = state.accounts.some(acc => acc.id === id);
    if (!accountExists) {
      throw new Error("Account not found");
    }

    // Update active status for all accounts
    state.accounts.forEach(acc => {
      acc.isActive = acc.id === id;
    });

    // Set active account ID
    state.activeAccountId = id;

    // Save state
    await saveWalletState(state);

    return true;
  } catch (error) {
    console.error("Failed to set active account:", error);
    return false;
  }
}

/**
 * Get the active account
 */
export async function getActiveAccount(): Promise<Account | null> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state || !state.activeAccountId) {
      return null;
    }

    return state.accounts.find(acc => acc.id === state.activeAccountId) || null;
  } catch (error) {
    console.error("Failed to get active account:", error);
    return null;
  }
}

/**
 * Delete an account
 */
export async function deleteAccount(id: string): Promise<boolean> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    const state = await getWalletState();
    if (!state) {
      throw new Error("Failed to get wallet state");
    }

    // Remove the account
    state.accounts = state.accounts.filter(acc => acc.id !== id);

    // If this was the active account, set a new one
    if (state.activeAccountId === id) {
      state.activeAccountId = state.accounts.length > 0 ? state.accounts[0].id : null;

      // Mark the new active account
      if (state.activeAccountId) {
        state.accounts.forEach(acc => {
          acc.isActive = acc.id === state.activeAccountId;
        });
      }
    }

    // Save state
    await saveWalletState(state);

    return true;
  } catch (error) {
    console.error("Failed to delete account:", error);
    return false;
  }
}

/**
 * Clear all wallet data (for testing or reset)
 */
export async function clearWalletData(): Promise<boolean> {
  if (!secureStorage) {
    throw new Error("Secure storage not initialized");
  }

  try {
    // Create empty state
    const emptyState: WalletState = {
      seedPhrases: [],
      accounts: [],
      activeAccountId: null,
      isInitialized: true
    };

    // Save empty state
    await saveWalletState(emptyState);

    // Clear any active session
    await clearWalletSession();

    return true;
  } catch (error) {
    console.error("Failed to clear wallet data:", error);
    return false;
  }
}

/**
 * Create a new wallet session that lasts for 15 minutes
 */
export async function createWalletSession(password: string): Promise<boolean> {
  try {
    // Create session data
    const session: WalletSession = {
      password: password,
      expiresAt: Date.now() + SESSION_DURATION
    };

    // Store session data in local storage
    await regularStorage.set(WALLET_SESSION_KEY, session);
    return true;
  } catch (error) {
    console.error("Failed to create wallet session:", error);
    return false;
  }
}

/**
 * Check if there's a valid wallet session
 */
export async function hasValidWalletSession(): Promise<boolean> {
  try {
    const session = await regularStorage.get<WalletSession>(WALLET_SESSION_KEY);

    if (!session) {
      return false;
    }

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      // Clean up expired session
      await clearWalletSession();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to check wallet session:", error);
    return false;
  }
}

/**
 * Get the password from a valid session
 */
export async function getWalletSessionPassword(): Promise<string | null> {
  try {
    const session = await regularStorage.get<WalletSession>(WALLET_SESSION_KEY);

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      // Clean up expired session
      await clearWalletSession();
      return null;
    }

    // Extend session duration when used
    await extendWalletSession();

    return session.password;
  } catch (error) {
    console.error("Failed to get wallet session password:", error);
    return null;
  }
}

/**
 * Extend the current wallet session by resetting its expiration time
 */
export async function extendWalletSession(): Promise<boolean> {
  try {
    const session = await regularStorage.get<WalletSession>(WALLET_SESSION_KEY);

    if (!session) {
      return false;
    }

    // Update expiration time
    session.expiresAt = Date.now() + SESSION_DURATION;

    // Save updated session
    await regularStorage.set(WALLET_SESSION_KEY, session);
    return true;
  } catch (error) {
    console.error("Failed to extend wallet session:", error);
    return false;
  }
}

/**
 * Clear the current wallet session
 */
export async function clearWalletSession(): Promise<boolean> {
  try {
    await regularStorage.remove(WALLET_SESSION_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear wallet session:", error);
    return false;
  }
}