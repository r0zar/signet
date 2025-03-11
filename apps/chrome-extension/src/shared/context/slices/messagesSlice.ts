import { useState } from 'react'
import { subscribe, type Message } from 'signet-sdk/src/messaging'

export interface MessagesState {
  messages: Message[]
}

export interface MessagesActions {
  clearMessages: () => void
  addMessage: (message: Message) => void
}

export type MessagesSlice = MessagesState & MessagesActions

// Custom hook for the messages slice
export function useMessagesSlice(): MessagesSlice {
  const [messages, setMessages] = useState<Message[]>([])

  // Clear all messages
  const clearMessages = () => setMessages([])

  // Add a new message
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  return {
    // State
    messages,

    // Actions
    clearMessages,
    addMessage
  }
}

// Setup message subscriber function for the main context
export function setupMessageSubscriber(addMessage: (message: Message) => void) {
  return subscribe((message) => {
    // Add received message to the log
    addMessage(message)
  })
}