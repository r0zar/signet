import { MessageType, respond, type Message } from 'signet-sdk/src/messaging'
import { sendToBackground } from '@plasmohq/messaging'
import type { BlockchainSlice } from '../slices/blockchainSlice'
import type { HandlerResponse, MessageAction, Status, Transfer } from '../types'

/**
 * Service to handle message processing, responses, and communication with background script
 */
export class MessageHandlerService {
  private blockchainSlice: BlockchainSlice

  constructor(blockchainSlice: BlockchainSlice) {
    this.blockchainSlice = blockchainSlice
  }

  /**
   * Send a message to the background script with proper error handling
   * @param action The action to perform
   * @param data Optional data to send with the action
   * @returns Promise resolving to the response data
   */
  async sendMessage<T>(action: MessageAction, data?: any): Promise<T> {
    try {
      const response = await sendToBackground<{ action: MessageAction, data?: any }, HandlerResponse<T>>({
        name: 'handler',
        body: { action, data }
      })

      if (!response.success) {
        throw new Error(response.error || "Unknown error occurred")
      }

      return response.data as T
    } catch (error) {
      console.error(`Error in ${action} message:`, error)
      throw error
    }
  }

  /**
   * Check if a message type is supported
   */
  isSupportedMessageType(type: MessageType): boolean {
    return [
      MessageType.CHECK_EXTENSION_INSTALLED,
      MessageType.GET_STATUS,
      MessageType.GET_BALANCE,
      MessageType.GET_BALANCES,
      MessageType.CREATE_TRANSFER_TX,
      MessageType.SIGN_PREDICTION
    ].includes(type)
  }

  /**
   * Handle a message based on its type
   */
  async handleMessage(message: Message): Promise<void> {
    switch (message.type) {
      case MessageType.CHECK_EXTENSION_INSTALLED:
        await this.handleCheckExtensionInstalled(message)
        break

      case MessageType.GET_STATUS:
        await this.handleGetStatus(message)
        break

      case MessageType.GET_BALANCE:
        await this.handleGetBalance(message)
        break

      case MessageType.GET_BALANCES:
        await this.handleGetBalances(message)
        break

      case MessageType.CREATE_TRANSFER_TX:
        await this.handleCreateTransferTx(message)
        break

      case MessageType.SIGN_PREDICTION:
        await this.handleSignPrediction(message)
        break

      default:
        // Unknown message type
        respond(message, undefined, {
          code: 'UNKNOWN_MESSAGE_TYPE',
          message: `Unknown message type: ${message.type}`
        })
    }

    // For all message types except GET_STATUS, refresh status to keep UI updated
    if (message.type !== MessageType.GET_STATUS) {
      this.refreshStatus()
    }
  }

  /**
   * Refresh blockchain status after message handling
   */
  refreshStatus(): void {
    if (this.blockchainSlice) {
      try {
        // Use setTimeout to avoid blocking UI
        setTimeout(async () => {
          await this.blockchainSlice.refreshStatus()
          console.log('Status refreshed after message processing')
        }, 100)
      } catch (err) {
        console.error('Failed to refresh status after message:', err)
      }
    }
  }

  /**
   * Handle CHECK_EXTENSION_INSTALLED message
   */
  async handleCheckExtensionInstalled(message: Message): Promise<void> {
    // Using a small timeout to avoid blocking UI during concurrent requests
    setTimeout(() => {
      respond(message, {
        installed: true,
        version: chrome.runtime.getManifest().version
      })
    }, 10)
  }

  /**
   * Handle GET_STATUS message
   */
  async handleGetStatus(message: Message): Promise<void> {
    try {
      // Use blockchainSlice.refreshStatus if available
      const statusData = await this.blockchainSlice.refreshStatus()
      respond(message, statusData || {})
    } catch (error) {
      respond(message, undefined, {
        code: 'STATUS_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get status'
      })
    }
  }

  /**
   * Handle GET_BALANCE message
   */
  async handleGetBalance(message: Message): Promise<void> {
    try {
      const data = message.data as { address?: string }
      const balance = await this.blockchainSlice.getBalance(data?.address)
      respond(message, balance)
    } catch (error) {
      respond(message, undefined, {
        code: 'BALANCE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get balance'
      })
    }
  }

  /**
   * Handle GET_BALANCES message
   */
  async handleGetBalances(message: Message): Promise<void> {
    try {
      const balances = await this.blockchainSlice.getBalances()
      this.blockchainSlice.refreshStatus()
      this.blockchainSlice.getAssetBalances()
      respond(message, balances)
    } catch (error) {
      respond(message, undefined, {
        code: 'BALANCES_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get all balances'
      })
    }
  }

  /**
   * Handle CREATE_TRANSFER_TX message
   */
  async handleCreateTransferTx(message: Message): Promise<void> {
    try {
      const data = message.data as Transfer
      const result = await this.sendMessage<{ success: boolean, transaction: Transfer }>(
        "createTransferTx",
        data
      )

      if (this.blockchainSlice) {
        this.blockchainSlice.refreshStatus()
        this.blockchainSlice.getAssetBalances(data.signer)
      }

      respond(message, result)
    } catch (error) {
      respond(message, undefined, {
        code: 'CREATE_TRANSFER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create transfer transaction'
      })
    }
  }

  /**
   * Handle SIGN_PREDICTION message
   */
  async handleSignPrediction(message: Message): Promise<void> {
    try {
      const data = message.data
      const result = await this.sendMessage<{ success: boolean, transaction: Transfer }>("createPredictionTx", data)

      if (this.blockchainSlice) {
        this.blockchainSlice.refreshStatus()
        this.blockchainSlice.getAssetBalances(data.signer)
      }

      respond(message, result)
    } catch (error) {
      respond(message, undefined, {
        code: 'SIGN_PREDICTION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to sign prediction'
      })
    }
  }
}