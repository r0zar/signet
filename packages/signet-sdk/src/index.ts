/**
 * Signet SDK - Lightweight messaging API for Signet extension communication
 */

// Export the core messaging system
import { MessageType, request, send } from './messaging';

// Export the core messaging system
export {
    send,
    request,
    respond,
    subscribe,
    cleanup,
    MessageType
} from './messaging';
export type { Message } from './messaging';

// Flag to track if we've attempted initialization
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Type definitions for responses
export interface ExtensionStatusResponse {
    installed: boolean;
    version?: string;
}

export interface SignetStatusResponse {
    connected: boolean;
    activeSubnet?: string;
    availableSubnets?: string[];
    wallet?: {
        address?: string;
        balance?: {
            [tokenId: string]: string;
        };
    };
}

// No caching - we'll check the extension status each time
// This will help us debug any issues with duplicate checks

/**
 * Helper function to check if the Signet extension is installed
 * This should trigger a permission prompt just like getStatus
 */
export async function checkExtensionInstalled(): Promise<ExtensionStatusResponse> {
    try {

        // Try multiple times with increasing delays
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                // Use a regular request that will trigger permission flow
                const response = await request<null, ExtensionStatusResponse>({
                    type: MessageType.CHECK_EXTENSION_INSTALLED,
                    data: null
                }, 0); // 0 means no timeout - wait indefinitely for user response

                // Return the result immediately
                return response.data;
            } catch (error) {
                // Wait briefly before retry
                if (attempt < 1) await new Promise(r => setTimeout(r, 500));
            }
        }

        // If all attempts fail, assume extension is not installed
        return { installed: false };
    } catch (error) {
        // If timeout or error, assume extension is not installed
        return { installed: false };
    }
}

/**
 * Helper function to get the current status of Signet
 */
export async function getSignetStatus(): Promise<SignetStatusResponse> {
    try {

        // Directly request status without checking extension first
        // This allows us to see all permission requests
        const response = await request<null, SignetStatusResponse>({
            type: MessageType.GET_STATUS,
            data: null
        }, 0); // 0 means no timeout - wait indefinitely for user response

        return response.data;
    } catch (error) {
        // Return disconnected status on error
        return { connected: false };
    }
}

// Define transaction-related interfaces
export interface TransactionResult {
    success: boolean;
    txId?: string;
    error?: string;
    details?: any;
}

// Subnet operations

/**
 * Get balance for the current connected wallet or a specific address
 */
export async function getBalance(address?: string): Promise<Record<string, number>> {
    try {

        const response = await request<{ address?: string }, Record<string, number>>({
            type: MessageType.GET_BALANCE,
            data: { address }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to get balance:', error);
        return {};
    }
}

/**
 * Get all balances across all subnets
 */
export async function getBalances(): Promise<Record<string, Record<string, number>>> {
    try {

        const response = await request<null, Record<string, Record<string, number>>>({
            type: MessageType.GET_BALANCES,
            data: null
        });

        return response.data;
    } catch (error) {
        console.error('Failed to get balances:', error);
        return {};
    }
}

/**
 * Create and execute a transfer transaction
 */
export async function createTransfer(params: {
    to: string;
    amount: number;
    nonce: number;
    subnet?: string;
}): Promise<TransactionResult> {
    try {
        // The extension handles nonce calculation
        const response = await request<{
            to: string;
            amount: number;
            nonce: number;
            subnet?: string;
        }, TransactionResult>({
            type: MessageType.CREATE_TRANSFER_TX,
            data: {
                to: params.to,
                amount: params.amount,
                subnet: params.subnet,
                nonce: params.nonce
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to create transfer:', error);
        return { success: false };
    }
}