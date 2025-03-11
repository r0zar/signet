/**
 * Seed phrase generation and handling
 */
import type { Account } from './types';
import { getStxAddress, generateWallet, randomSeedPhrase } from '@stacks/wallet-sdk';
import { STACKS_MAINNET } from '@stacks/network';
import { getAddressFromPublicKey, privateKeyToPublic } from '@stacks/transactions';


/**
 * Generate a random seed phrase using crypto secure randomness
 * This is a simplified example - in production, use a proper BIP39 implementation
 */
export function generateSeedPhrase(): string {
  return randomSeedPhrase();
}

/**
 * Validate a seed phrase
 * In a real implementation, this would check for proper BIP39 structure
 */
export function validateSeedPhrase(phrase: string): boolean {
  // Basic validation - check for 12 words
  const words = phrase.trim().split(/\s+/);
  return words.length >= 12;
}

/**
 * Create a new account from a seed phrase
 */
export async function createAccountFromSeed(
  seedPhrase: string,
  seedPhraseId: string,
  password: string,
  index: number = 0,
): Promise<Account> {
  const wallet = await generateWallet({
    secretKey: seedPhrase,
    password: password || "", // Use password for encryption if provided
  });

  const privateKey = wallet.accounts[index].stxPrivateKey;
  const publicKey = privateKeyToPublic(privateKey);
  const stxAddress = getStxAddress(wallet.accounts[index], STACKS_MAINNET);

  // Generate a name from the address for display purposes
  const shortenedAddress = `${stxAddress.substring(0, 5)}...${stxAddress.substring(stxAddress.length - 4)}`;
  const name = `Account ${index + 1} (${shortenedAddress})`;

  // Create unique ID for the account
  const id = `account_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    name,
    index,
    seedPhraseId,
    stxAddress,
    privateKey,
    publicKey: publicKey.toString(),
    createdAt: Date.now(),
    isActive: false
  };
}