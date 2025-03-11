/**
 * Core messaging functionality for Signet SDK
 * A simple wrapper around window.postMessage to handle communication
 * between applications and the Signet extension
 */

// Core message interface
export interface Message {
  id: string
  timestamp: string
  // Message classification
  type: string
  // General purpose data payload
  data: { [key: string]: any }
  // Flag to indicate if this message expects a response
  request?: boolean
  // Flag to link response messages to their requests
  response?: string
}

// Internal state
const listeners: Array<(message: Message) => void> = []
const pendingResponses: Map<string, {
  resolve: (response: Message) => void
  reject: (error: Error) => void
  timeoutId: NodeJS.Timeout
}> = new Map()

// Auto-initialize listener on first import
setupListener()

/**
 * Handle incoming messages from window.postMessage
 */
function handleIncomingMessage(event: MessageEvent): void {
  // Check if this is a valid Signet message
  if (!isValidMessage(event.data)) {
    console.error('Invalid message received:', event.data)
    return
  }

  const message = event.data as Message

  // Check if this is a response to a pending request
  if (message.response && pendingResponses.has(message.response)) {
    const { resolve, timeoutId } = pendingResponses.get(message.response)!

    // Clear the timeout and resolve the promise
    clearTimeout(timeoutId)
    resolve(message)

    // Remove from pending responses
    pendingResponses.delete(message.response)

    // We don't need to continue processing this as a new message
    return
  }

  // Notify all listeners
  listeners.forEach(listener => {
    try {
      listener(message)
    } catch (error) {
      console.error('Error in message listener:', error)
    }
  })
}

/**
 * Set up listener for incoming messages
 */
function setupListener(): void {
  window.addEventListener('message', handleIncomingMessage)
}

/**
 * Clean up when no longer needed
 */
export function cleanup(): void {
  window.removeEventListener('message', handleIncomingMessage)

  // Clear any pending response promises
  pendingResponses.forEach(({ reject, timeoutId }) => {
    clearTimeout(timeoutId)
    reject(new Error('Messaging system shut down'))
  })

  pendingResponses.clear()
  listeners.length = 0
}

/**
 * Prepare a message for sending
 */
function prepareMessage(message: Partial<Message>): Message {
  return {
    data: {},
    type: 'log',
    ...message,
    id: message.id || (crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random()}`),
    timestamp: message.timestamp || new Date().toISOString(),
  }
}

/**
 * Check if data is a valid Signet message
 */
function isValidMessage(msg: any): boolean {
  return (
    msg &&
    typeof msg === 'object' &&
    'type' in msg &&
    'data' in msg &&
    'id' in msg &&
    'timestamp' in msg
  )
}

/**
 * Send a message without expecting a response
 */
export function send(message: Partial<Message>): Message {
  const finalMessage = prepareMessage(message)
  window.postMessage(finalMessage, '*')
  return finalMessage
}

/**
 * Send a message and wait for a response
 */
export async function request(message: Partial<Message>, timeoutMs = 5000): Promise<Message> {
  const finalMessage = prepareMessage({
    ...message,
    request: true
  })

  const responsePromise = new Promise<Message>((resolve, reject) => {
    // Set up timeout to reject the promise if no response is received
    const timeoutId = setTimeout(() => {
      pendingResponses.delete(finalMessage.id)
      reject(new Error(`No response received within ${timeoutMs}ms`))
    }, timeoutMs)

    // Store promise resolution functions and timeout ID
    pendingResponses.set(finalMessage.id, { resolve, reject, timeoutId })
  })

  // Send the message
  window.postMessage(finalMessage, '*')

  // Return the promise
  return responsePromise
}

/**
 * Send a response to a message
 */
export function respond(originalMessage: Message, data?: any): Message {
  const responseMessage = prepareMessage({
    data: data || {},
    response: originalMessage.id
  })

  window.postMessage(responseMessage, '*')
  return responseMessage
}

/**
 * Subscribe to messages
 * Returns an unsubscribe function
 */
export function subscribe(callback: (message: Message) => void): () => void {
  listeners.push(callback)

  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(callback)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }
}