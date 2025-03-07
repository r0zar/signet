import { useState, useEffect, useCallback } from 'react'
import { type ExtensionMessage, ExtensionMessageType } from '../types/messages'

interface MessageHandlerConfig {
  onHandleMessage?: (event: MessageEvent) => void
  initialMessages?: string[]
  maxMessages?: number
}

/**
 * Hook for handling window messages in the extension
 */
export function useMessageHandler(config: MessageHandlerConfig = {}) {
  const {
    onHandleMessage,
    initialMessages = [],
    maxMessages = 5
  } = config

  const [messages, setMessages] = useState<string[]>(initialMessages)

  // Add a new message to the log with timestamp
  const addMessage = useCallback((text: string) => {
    const now = new Date()
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    // Truncate long messages
    const truncatedText = text.length > 45 ? text.substring(0, 45) + '...' : text
    setMessages(prev => [...prev.slice(-(maxMessages - 1)), `[${timestamp}] ${truncatedText}`])
  }, [maxMessages])

  // Format a message object for logging
  const formatMessage = useCallback((data: any): string => {
    // Format object nicely for logging
    const eventType = data.type ? `[${data.type}]` : ''
    const shortDesc = Object.entries(data)
      .filter(([key]) => key !== 'type')
      .map(([key, val]) => {
        // Format value based on type
        const strVal = typeof val === 'string'
          ? val.length > 15 ? val.slice(0, 15) + '...' : val
          : typeof val === 'object'
            ? '{...}'
            : String(val)
        return `${key}:${strVal}`
      })
      .slice(0, 2) // Only show first 2 properties
      .join(', ')

    return `${eventType} ${shortDesc}`
  }, [])

  // Send a message to the window
  const sendMessage = useCallback((message: ExtensionMessage) => {
    window.postMessage(message, '*')

    // Also log it
    addMessage(`Sent ${message.type}`)
  }, [addMessage])

  // Window message event handler
  const handleWindowMessage = useCallback((event: MessageEvent) => {
    if (event.data && typeof event.data === 'object') {
      // Log the message
      addMessage(formatMessage(event.data))

      // Call external handler if provided
      if (onHandleMessage) {
        onHandleMessage(event)
      }
    }
  }, [addMessage, formatMessage, onHandleMessage])

  // Set up event listener
  useEffect(() => {
    window.addEventListener('message', handleWindowMessage)

    // Add initial message
    addMessage('Extension loaded successfully!')

    return () => {
      window.removeEventListener('message', handleWindowMessage)
    }
  }, [])

  return {
    messages,
    addMessage,
    sendMessage
  }
}