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

// Subnet data returned by the extension
export interface SubnetData {
    subnet: string;
    signer: string;
    token: string;
    txQueue: any[];
}

// Status response is a map of subnet IDs to subnet data
export interface SignetStatusResponse {
    [subnetId: string]: SubnetData;
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
        // Return empty object on error
        return {};
    }
}

/**
 * Helper function to get all subnet IDs from status response
 */
export function getSubnetIds(status: SignetStatusResponse): string[] {
    return Object.keys(status);
}

/**
 * Helper function to get subnet data for a specific subnet
 */
export function getSubnetData(status: SignetStatusResponse, subnetId: string): SubnetData | null {
    return status[subnetId] || null;
}

// Define transaction-related interfaces
export interface TransactionResult {
    success: boolean;
    error?: string;
    transaction?: {
        to: string;
        amount: number;
        nonce: number;
        signature: string;
        signer: string;
        subnetId: string;
        type: string;
    };
}

// Subnet operations

/**
 * Get balance for a specific subnet and address
 * @param subnetId The subnet ID to get balance for
 * @param address Optional address to check balance for (uses current signer if not provided)
 */
export async function getBalance(subnetId: string, address?: string): Promise<Record<string, number>> {
    try {
        const response = await request<{ subnet: string, address?: string }, Record<string, number>>({
            type: MessageType.GET_BALANCE,
            data: {
                subnet: subnetId,
                address
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to get balance:', error);
        return {};
    }
}

/**
 * Get all balances across all subnets
 * @returns A map of subnet IDs to balance records
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
    subnetId: string;
    to: string;
    amount: number;
    nonce: number;
}): Promise<TransactionResult> {
    try {
        const response = await request<{
            subnetId: string;
            to: string;
            amount: number;
            nonce: number;
        }, TransactionResult>({
            type: MessageType.CREATE_TRANSFER_TX,
            data: params
        });

        return response.data;
    } catch (error) {
        console.error('Failed to create transfer:', error);
        return { success: false };
    }
}

/**
 * Signature request for a prediction transaction
 */
export async function signPrediction(data: any): Promise<any> {
    try {
        const response = await request<any, any>({ type: MessageType.SIGN_PREDICTION, data });
        return response.data;
    } catch (error) {
        console.error('Failed to create prediction:', error);
        return { success: false };
    }
}