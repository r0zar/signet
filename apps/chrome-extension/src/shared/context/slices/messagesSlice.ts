import { useState, useCallback, useEffect } from 'react'
import {
  subscribe,
  send,
  respond,
  MessageType,
  type Message
} from 'signet-sdk/src/messaging'
import { sendMessage } from '../utils'
import type {
  HandlerResponse,
  Status,
  TransactionResult,
  Transfer
} from '../types'
import { Storage } from '@plasmohq/storage'

// Define type-safe interfaces for message data
interface BalanceRequestData {
  address?: string;
}

interface MineBlockRequestData {
  subnetId: string;
  batchSize?: number;
}

interface MineAllBlocksRequestData {
  batchSize?: number;
}

interface TransferRequestData {
  to: string;
  amount: number;
  subnet?: string;
}

// Initialize storage for permissions
const permissionsStorage = new Storage({ area: "local" })

// Simple permission data structure
interface PermissionData {
  allowed: boolean;
  timestamp: string;
}

// Helper function to generate permission storage key
function getPermissionKey(origin: string, messageType: string): string {
  return `permission:${origin}:${messageType}`;
}

export interface MessagesState {
  messages: Message[]
  pendingPermissions: PermissionRequest[]
}

export interface MessagesActions {
  clearMessages: () => void
  addMessage: (message: Message) => void
  handleSDKMessage: (message: Message) => void
  approvePermission: (requestId: string) => void
  denyPermission: (requestId: string) => void
  rememberPermission: (requestId: string, allow: boolean) => void
}

export type MessagesSlice = MessagesState & MessagesActions

// Types for permission system
export interface PermissionRequest {
  id: string
  messageId: string
  type: MessageType
  origin: string
  timestamp: string
  data: any
}

// Import types from context-types
import type { SubnetSlice } from './subnetSlice'
import type { TransactionSlice } from './transactionSlice'

// Custom hook for the messages slice
export function useMessagesSlice(subnetSlice?: SubnetSlice, transactionSlice?: TransactionSlice): MessagesSlice {
  const [messages, setMessages] = useState<Message[]>([])
  const [pendingPermissions, setPendingPermissions] = useState<PermissionRequest[]>([])

  // We'll access storage directly instead of using a hook for more control
  // Permissions will be fetched directly from storage when needed

  // Clear all messages
  const clearMessages = () => setMessages([])

  // Add a new message
  function addMessage(message: Message) {
    setMessages(prev => [...prev, message])
  }

  // Handle an incoming SDK message
  async function handleSDKMessage(message: Message) {
    // Log all messages
    addMessage(message)

    // Check if this is a request that requires a response
    if (!message.request) {
      return
    }

    // Create a permission request object 
    const permRequest = {
      id: crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}-${Math.random()}`,
      messageId: message.id,
      type: message.type,
      origin: message.origin || 'unknown',
      timestamp: new Date().toISOString(),
      data: message.data
    };

    // Check for saved permission decision using direct storage access
    const origin = permRequest.origin;
    const messageType = permRequest.type;

    // Helper function to add to pending permissions
    function addToPendingPermissions() {
      // Add to pending permissions based on type
      switch (message.type) {
        case MessageType.CHECK_EXTENSION_INSTALLED:
        case MessageType.GET_STATUS:
        case MessageType.GET_BALANCE:
        case MessageType.GET_BALANCES:
        case MessageType.MINE_BLOCK:
        case MessageType.MINE_ALL_PENDING_BLOCKS:
        case MessageType.CREATE_TRANSFER_TX:
          // Add to pending permissions for user approval
          setPendingPermissions(prev => [...prev, permRequest]);
          break;

        default:
          // Unknown message type - respond with error
          respond(message, undefined, {
            code: 'UNKNOWN_MESSAGE_TYPE',
            message: `Unknown message type: ${message.type}`
          });
      }
    }

    // Debug permission check
    console.log('Checking permissions for:', { origin, messageType });

    // Get permission directly using compound key
    const permissionKey = getPermissionKey(origin, messageType);

    try {
      // Fetch the specific permission
      const savedPermission = await permissionsStorage.get(permissionKey) as PermissionData | undefined;
      console.log(`Checking permission for ${permissionKey}:`, savedPermission);

      // If we have a saved permission decision
      if (savedPermission && typeof savedPermission.allowed === 'boolean') {
        console.log('Found saved permission decision:', savedPermission);

        // Check if permission has expired (30 days)
        const MAX_PERMISSION_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
        const permissionTimestamp = new Date(savedPermission.timestamp).getTime();
        const currentTime = new Date().getTime();

        if (currentTime - permissionTimestamp > MAX_PERMISSION_AGE_MS) {
          console.log('Permission has expired, requesting new permission');
          // Permission expired, fall through to request new permission
          addToPendingPermissions();
        }
        else if (savedPermission.allowed === true) {
          console.log('Auto-approving based on saved permission');

          // Find original message and auto-approve based on type
          const originalMessage = message;

          // Process auto-approval based on message type
          switch (permRequest.type) {
            case MessageType.CHECK_EXTENSION_INSTALLED:
              // Auto-approve extension check
              // Using a small timeout to avoid blocking UI during a bunch of concurrent requests
              setTimeout(() => {
                respond(originalMessage, {
                  installed: true,
                  version: chrome.runtime.getManifest().version
                });
              }, 10);
              break;

            case MessageType.GET_STATUS:
              try {
                // Use the passed subnetSlice.refreshStatus if available, otherwise fall back to sendMessage
                const getStatus = subnetSlice?.refreshStatus || (() => sendMessage<Record<string, Status>>("getStatus"));

                // Get status and respond  
                const statusData = await getStatus();

                // Directly respond with the status data from the slice
                respond(originalMessage, statusData || {});
              } catch (error) {
                // Error response
                respond(originalMessage, undefined, {
                  code: 'STATUS_ERROR',
                  message: error instanceof Error ? error.message : 'Failed to get status'
                });
              }
              break;

            case MessageType.GET_BALANCE:
              try {
                const balance = await subnetSlice.getBalance()
                respond(originalMessage, balance);
              } catch (error) {
                respond(originalMessage, undefined, {
                  code: 'BALANCE_ERROR',
                  message: error instanceof Error ? error.message : 'Failed to get balance'
                });
              }
              break;

            case MessageType.GET_BALANCES:
              try {
                const balances = await subnetSlice.getBalances()
                subnetSlice.refreshStatus();
                subnetSlice.getAssetBalances();
                respond(originalMessage, balances);
              } catch (error) {
                respond(originalMessage, undefined, {
                  code: 'BALANCES_ERROR',
                  message: error instanceof Error ? error.message : 'Failed to get all balances'
                });
              }
              break;

            case MessageType.CREATE_TRANSFER_TX:
              try {
                const data = originalMessage.data as TransferRequestData;
                const result = await transactionSlice.createTransfer(data.to, data.amount, 0, data.subnet);
                subnetSlice.refreshStatus();
                subnetSlice.getAssetBalances();
                respond(originalMessage, result);
              } catch (error) {
                respond(originalMessage, undefined, {
                  code: 'CREATE_TRANSFER_ERROR',
                  message: error instanceof Error ? error.message : 'Failed to create transfer transaction'
                });
              }
              break;
          }
        } else if (savedPermission.allowed === false) {
          console.log('Auto-denying based on saved permission');

          // Auto-deny the request
          respond(message, undefined, {
            code: 'PERMISSION_DENIED',
            message: 'Permission denied by saved preference'
          });
        }

        return; // Skip adding to pending permissions
      } else {
        // No saved permission found, add to pending permissions
        console.log('No saved permission found, requesting user approval');
        addToPendingPermissions();
      }
    } catch (error) {
      console.error(`Error checking permission for ${permissionKey}:`, error);
      // On error, default to asking for permission
      addToPendingPermissions();
    }
  }

  // Approve a pending permission
  async function approvePermission(requestId: string) {
    // Find the permission request
    const request = pendingPermissions.find(p => p.id === requestId)
    if (!request) return

    // Find the original message
    const originalMessage = messages.find(m => m.id === request.messageId)
    if (!originalMessage) return

    // Handle the approved request based on message type
    switch (request.type) {
      case MessageType.CHECK_EXTENSION_INSTALLED:
        // Respond with extension info
        respond(originalMessage, {
          installed: true,
          version: chrome.runtime.getManifest().version
        });
        break;

      case MessageType.GET_STATUS:
        try {
          // Use the passed subnetSlice if available, otherwise fall back to sendMessage
          const getStatus = subnetSlice?.refreshStatus || (() => sendMessage<Record<string, Status>>("getStatus"));

          // Get status from background and respond
          const statusData = await getStatus();

          // Directly respond with the status data (or empty object if undefined)
          respond(originalMessage, statusData || {});
        } catch (error) {
          // Error response
          respond(originalMessage, undefined, {
            code: 'STATUS_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get status'
          });
        }
        break;

      case MessageType.GET_BALANCE:
        try {
          const data = originalMessage.data as BalanceRequestData;
          const balance = await sendMessage<Record<string, number>>("getBalance", {
            address: data.address
          });
          respond(originalMessage, balance);
        } catch (error) {
          respond(originalMessage, undefined, {
            code: 'BALANCE_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get balance'
          });
        }
        break;

      case MessageType.GET_BALANCES:
        try {
          const balances = await sendMessage<Record<string, Record<string, number>>>("getBalances");
          respond(originalMessage, balances);
        } catch (error) {
          respond(originalMessage, undefined, {
            code: 'BALANCES_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get all balances'
          });
        }
        break;

      case MessageType.MINE_BLOCK:
        try {
          const data = originalMessage.data as MineBlockRequestData;
          const result = await sendMessage<TransactionResult>("mineBlock", {
            subnetId: data.subnetId,
            batchSize: data.batchSize
          });
          respond(originalMessage, result);
        } catch (error) {
          respond(originalMessage, undefined, {
            code: 'MINE_BLOCK_ERROR',
            message: error instanceof Error ? error.message : 'Failed to mine block'
          });
        }
        break;

      case MessageType.MINE_ALL_PENDING_BLOCKS:
        try {
          const data = originalMessage.data as MineAllBlocksRequestData;
          const result = await sendMessage<Record<string, TransactionResult>>("mineAllPendingBlocks", {
            batchSize: data.batchSize
          });
          respond(originalMessage, result);
        } catch (error) {
          respond(originalMessage, undefined, {
            code: 'MINE_ALL_BLOCKS_ERROR',
            message: error instanceof Error ? error.message : 'Failed to mine all pending blocks'
          });
        }
        break;

      case MessageType.CREATE_TRANSFER_TX:
        try {
          const data = originalMessage.data as TransferRequestData;
          const result = await sendMessage<{ success: boolean, transaction: Transfer }>("createTransferTx", data);

          respond(originalMessage, result);
        } catch (error) {
          respond(originalMessage, undefined, {
            code: 'CREATE_TRANSFER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to create transfer transaction'
          });
        }
        break
    }

    // Remove from pending permissions
    setPendingPermissions(prev => prev.filter(p => p.id !== requestId))
  }

  // Deny a pending permission
  function denyPermission(requestId: string) {
    // Find the permission request
    const request = pendingPermissions.find(p => p.id === requestId)
    if (!request) return

    // Find the original message
    const originalMessage = messages.find(m => m.id === request.messageId)
    if (!originalMessage) return

    // Respond with permission denied error
    respond(originalMessage, undefined, {
      code: 'PERMISSION_DENIED',
      message: 'Permission denied by user'
    })

    // Remove from pending permissions
    setPendingPermissions(prev => prev.filter(p => p.id !== requestId))
  }

  // Remember permission for future use
  const rememberPermission = (requestId: string, allow: boolean) => {
    console.log('Remember permission called with', { requestId, allow });

    // Find the permission request
    const request = pendingPermissions.find(p => p.id === requestId)
    if (!request) {
      console.error('Permission request not found:', requestId);
      return;
    }

    console.log('Found request:', request);

    // Generate the permission key
    const permissionKey = getPermissionKey(request.origin, request.type);

    // Create the permission data
    const permissionData: PermissionData = {
      allowed: allow,
      timestamp: new Date().toISOString()
    };

    console.log(`Saving permission for ${permissionKey}:`, permissionData);

    // Save directly to storage using the key
    permissionsStorage.set(permissionKey, permissionData)
      .then(() => {
        console.log(`Permission saved successfully for ${permissionKey}`);
      })
      .catch(error => {
        console.error(`Error saving permission for ${permissionKey}:`, error);
      });

    // Process the permission request
    if (allow) {
      approvePermission(requestId)
    } else {
      denyPermission(requestId)
    }
  }

  return {
    // State
    messages,
    pendingPermissions,

    // Actions
    clearMessages,
    addMessage,
    handleSDKMessage,
    approvePermission,
    denyPermission,
    rememberPermission
  }
}

// Setup message subscriber function for the main context
export function setupMessageSubscriber(
  addMessage: (message: Message) => void,
  handleSDKMessage: (message: Message) => void
) {
  return subscribe((message) => {
    // Add received message to the log
    addMessage(message)

    // Process message if it's a request
    if (message.request) {
      handleSDKMessage(message)
    }
  })
}