/**
 * SignetContext - Unified context provider for all extension functionality
 * Combines controller state, notifications, and dApp message handling
 */

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { Storage } from '@plasmohq/storage'
import { sendToBackground } from "@plasmohq/messaging"
import { ExtensionMessageType } from "../types/signet"
import { colors } from '../styles/theme'
import type { NotificationData, NotificationType, ExtensionMessage } from '../types/signet'

// Initialize storage
const storage = new Storage()

export interface NodeStatus {
  status: 'active' | 'starting' | 'stopped';
  mempoolSize: number;
  lastBlock?: {
    height: number;
    timestamp: number;
    hash: string;
  };
}

export interface SystemStatus {
  power: number;
  signal: number;
  shield: number;
}

// Map our log types to extension message types
export const logTypeToMessageType = {
  'node': ExtensionMessageType.LOG_NODE,
  'dapp': ExtensionMessageType.LOG_DAPP,
  'console': ExtensionMessageType.LOG_CONSOLE,
  'system': ExtensionMessageType.LOG_SYSTEM,
  'debug': ExtensionMessageType.LOG_DEBUG,
  'error': ExtensionMessageType.LOG_ERROR,
  'warning': ExtensionMessageType.LOG_WARNING
}

// Map message types back to log types
export const messageTypeToLogType = {
  [ExtensionMessageType.LOG_NODE]: 'node',
  [ExtensionMessageType.LOG_DAPP]: 'dapp',
  [ExtensionMessageType.LOG_CONSOLE]: 'console',
  [ExtensionMessageType.LOG_SYSTEM]: 'system',
  [ExtensionMessageType.LOG_DEBUG]: 'debug',
  [ExtensionMessageType.LOG_ERROR]: 'error',
  [ExtensionMessageType.LOG_WARNING]: 'warning'
}

// Message types for internal application use
export type SignetMessageType = 'node' | 'dapp' | 'console' | 'system' | 'debug' | 'error' | 'warning'

// Message structure for internal application messages
export interface SignetMessage {
  type: SignetMessageType
  content: string
  timestamp: string
  details?: any
  broadcast?: boolean // Whether to broadcast over window.postMessage
}

// Create a type for the Signet context value
interface SignetContextValue {
  // UI State
  visible: boolean
  isLogExpanded: boolean
  nodeStatus: 'active' | 'starting' | 'stopped'
  mempoolSize: number

  // Popup UI State
  systemStatus: SystemStatus
  displayText: string

  // Unified Message System
  messages: SignetMessage[]

  // Notification State
  currentNotification: NotificationData | null
  isPanelExiting: boolean
  showCubeNotification: boolean
  cubeColor: string

  // UI Actions
  setVisible: (visible: boolean) => void
  setIsLogExpanded: (expanded: boolean) => void
  toggleVisibility: () => void
  performHealthCheck: () => Promise<any>

  // Unified Messaging System
  send: (type: SignetMessageType, content: string, details?: any, broadcast?: boolean) => void
  clearMessages: (types?: SignetMessageType[]) => void

  // System Status Actions
  setNodeStatus: (status: 'active' | 'starting' | 'stopped') => void
  setMempoolSize: (size: number) => void
  setSystemStatus: (status: SystemStatus) => void

  // dApp Communication
  sendToDapp: (message: ExtensionMessage) => void

  // Notification Actions
  handleDismissPanel: () => void
  showNotification: (notification: NotificationData) => void
  showTransactionNotification: (title: string, message: string, options?: Partial<NotificationData>) => NotificationData
  showPredictionNotification: (title: string, message: string, options?: Partial<NotificationData>) => NotificationData
  showSystemNotification: (title: string, message: string, options?: Partial<NotificationData>) => NotificationData
  showErrorNotification: (title: string, message: string, options?: Partial<NotificationData>) => NotificationData
  showCube: (color?: string, duration?: number) => void
  hideCube: () => void
}

// Create the context with a default empty value
const SignetContext = createContext<SignetContextValue | undefined>(undefined)

// Provider props type
interface SignetProviderProps {
  children: ReactNode
  maxLogMessages?: number
  maxNodeLogs?: number
  onDappMessage?: (event: MessageEvent) => void
}

/**
 * Provider component for Signet functionality
 */
export function SignetProvider({
  children,
  maxLogMessages = 10,
  maxNodeLogs = 20,
  onDappMessage
}: SignetProviderProps) {
  //
  // Controller UI State
  //

  // UI visibility state
  const [visible, setVisible] = useState(false)
  const [isLogExpanded, setIsLogExpanded] = useState(false)

  // Node state
  const [nodeStatus, setNodeStatus] = useState<'active' | 'starting' | 'stopped'>('stopped')
  const [nodeLogs, setNodeLogs] = useState<string[]>([])
  const [mempoolSize, setMempoolSize] = useState(0)

  // System status for popup UI
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    power: 100,
    signal: 85,
    shield: 92
  })

  // Console logs for popup UI
  const [consoleLines, setConsoleLines] = useState<string[]>([])
  const [displayText, setDisplayText] = useState('')

  // Message log state for dApp communication
  const [dappMessages, setDappMessages] = useState<string[]>([])

  // Unified message storage
  const [messages, setMessages] = useState<SignetMessage[]>([])

  //
  // Notification System State
  //

  // Current notification being displayed in the panel
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null)

  // For exit animations
  const [isPanelExiting, setIsPanelExiting] = useState(false)

  // 3D cube notification visibility
  const [showCubeNotification, setShowCubeNotification] = useState(false)

  // Cube color
  const [cubeColor, setCubeColor] = useState<string>('rgb(125, 249, 255)')

  //
  // Unified Messaging System
  //

  // Send a message through the unified messaging system
  const send = (type: SignetMessageType, content: string, details?: any, broadcast: boolean = false) => {
    const now = new Date()
    const timestamp = now.toISOString()

    // Create the internal message
    const signetMessage: SignetMessage = {
      type,
      content,
      timestamp,
      details,
      broadcast
    }

    // If message should be broadcasted, send it via window.postMessage
    if (broadcast) {
      // Get the corresponding extension message type
      const messageType = logTypeToMessageType[type]

      // Create the external message (compatible with LogMessage interface)
      const externalMessage = {
        type: messageType,
        message: content,
        timestamp,
        details
      }

      // Broadcast to other components
      window.postMessage(externalMessage, '*')
    }

    // Also log to console for debugging
    if (type === 'error') {
      console.error(`[${type.toUpperCase()}] ${content}`, details || '')
    } else if (type === 'warning') {
      console.warn(`[${type.toUpperCase()}] ${content}`, details || '')
    } else {
      console.log(`[${type.toUpperCase()}] ${content}`, details || '')
    }

    // Add to unified messages
    setMessages(prev => [...prev, signetMessage])

    // Update display text for console logs to maintain typing effect
    if (type === 'console') {
      // Update the typing effect for console logs
      const consoleEntries = messages
        .filter(msg => msg.type === 'console')
        .map(msg => `> ${msg.content}`)
        .join('\n');

      // Schedule typing effect update
      setTimeout(() => {
        setDisplayText(consoleEntries);
      }, 10);
    }

    return signetMessage
  }

  // Clear messages by type
  const clearMessages = (types?: SignetMessageType[]) => {
    // Option to broadcast the clear message to other components
    const broadcast = true

    if (broadcast) {
      // Convert SignetMessageType array to ExtensionMessageType array
      const messageTypes = types?.map(type => logTypeToMessageType[type])

      // Create the clear message
      const clearMessage = {
        type: ExtensionMessageType.CLEAR_LOGS,
        logTypes: messageTypes
      }

      // Send the clear message through the window messaging system
      window.postMessage(clearMessage, '*')
    }

    // Perform the actual clearing in our local state
    if (!types || types.length === 0) {
      // Clear all messages
      setMessages([])
      setDisplayText('')
    } else {
      // Clear only specific message types
      setMessages(prev => prev.filter(msg => !types.includes(msg.type)))

      // If clearing console messages, also clear the display text
      if (types.includes('console')) {
        setDisplayText('')
      }
    }
  }

  //
  // Controller Functions
  //

  // Toggle controller visibility
  const toggleVisibility = () => {
    setVisible(prev => !prev)
  }

  // Load UI visibility state from storage
  useEffect(() => {
    const loadVisibility = async () => {
      try {
        const storedVisible = await storage.get("signetControllerVisible")
        if (typeof storedVisible === 'boolean') {
          setVisible(storedVisible)
        }
      } catch (error) {
        console.error("Failed to load visibility state:", error)
      }
    }

    loadVisibility()
  }, [])

  // Save visibility state when it changes
  useEffect(() => {
    const saveVisibility = async () => {
      try {
        await storage.set("signetControllerVisible", visible)
      } catch (error) {
        console.error("Failed to save visibility state:", error)
      }
    }

    saveVisibility()
  }, [visible])

  // Health check function
  const performHealthCheck = async () => {
    try {
      // Query node status
      const response = await sendToBackground({ name: 'PING' })

      if (response && response.status) {
        setNodeStatus(response.status)
        send('node', `Node status: ${response.status.toUpperCase()}`)
      }

      return response
    } catch (error) {
      console.error("Health check failed:", error)
      send('error', "Health check failed", error)
      return { status: 'error' }
    }
  }

  // Perform health check on mount
  useEffect(() => {
    performHealthCheck()
  }, [])

  //
  // dApp Communication Functions
  //

  // Format a message object for logging
  const formatDappMessage = (data: any): string => {
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
  }

  // Send a message to dApp
  const sendToDapp = (message: ExtensionMessage) => {
    window.postMessage(message, '*')
    // Also log it
    send('dapp', `Sent ${message.type}`)
  }

  //
  // Notification Functions
  //

  // Handle panel dismissal
  const handleDismissPanel = () => {
    // Animation is now handled by framer-motion's AnimatePresence
    // We can directly remove the notification
    setCurrentNotification(null)
  }

  // Show a notification
  const showNotification = (notification: NotificationData) => {
    setCurrentNotification(notification)

    // Auto-hide if duration provided AND notification type doesn't require user action
    if (notification.duration && notification.type !== 'OP_PREDICT') {
      const timer = setTimeout(() => {
        handleDismissPanel()
      }, notification.duration)

      // Clean up timer if component unmounts or notification changes
      return () => clearTimeout(timer)
    }
  }

  // Create and show a notification with type
  const createNotification = (
    type: NotificationType,
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ): NotificationData => {
    // For notifications requiring user action, don't set auto-hide duration
    const duration = type === 'OP_PREDICT'
      ? undefined  // No auto-hide duration for prediction notifications
      : (options.duration || 5000)

    // Create the notification object
    const notification: NotificationData = {
      type,
      title,
      message,
      details: options.details,
      color: options.color,
      duration: duration,
      htmlContent: options.htmlContent,
      id: options.id || Date.now().toString(),
      timestamp: new Date().toISOString()
    }

    showNotification(notification)
    return notification
  }

  // Show 3D cube notification
  const showCube = (color?: string, duration?: number) => {
    if (color) {
      setCubeColor(color)
    }

    setShowCubeNotification(true)

    if (duration) {
      const timer = setTimeout(() => {
        setShowCubeNotification(false)
      }, duration)

      // Clean up timer if component unmounts
      return () => clearTimeout(timer)
    }
  }

  // Hide 3D cube notification
  const hideCube = () => {
    setShowCubeNotification(false)
  }

  // Create various notification types
  const showTransactionNotification = (
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    return createNotification('OP_TRANSFER', title, message, options)
  }

  const showPredictionNotification = (
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    // Explicitly set duration to undefined to prevent auto-dismissal
    const predictionOptions = {
      ...options,
      duration: undefined
    }
    return createNotification('OP_PREDICT', title, message, predictionOptions)
  }

  const showSystemNotification = (
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    return createNotification('SYSTEM', title, message, options)
  }

  const showErrorNotification = (
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    return createNotification('ERROR', title, message, options)
  }

  // Handle window messages from dApps with error protection
  const handleDappMessage = (event: MessageEvent) => {
    try {
      console.log('Received dApp message:', event.data)
      if (event.data && typeof event.data === 'object') {
        // Special handling for BLAZE_NODE_STATUS messages
        if (event.data.type === 'BLAZE_NODE_STATUS') {
          try {
            // Format a clearer message for Blaze node status
            const status = event.data.status;
            if (!status) return; // Skip if status is missing

            const statusText = status === 'active' ? 'ACTIVE ✅' :
              status === 'starting' ? 'STARTING ⏳' :
                'STOPPED ⛔';

            send('dapp', `Blaze Node: ${statusText}`);
          } catch (err) {
            // Silently ignore errors in status handling
          }
        } else {
          // Standard logging for other messages
          try {
            send('dapp', formatDappMessage(event.data));
          } catch (err) {
            // Silently ignore formatting errors
          }
        }

        // Handle notification and log messages
        switch (event.data.type) {
          case ExtensionMessageType.SHOW_NOTIFICATION:
            const { title, message, details, notificationType, color, duration, htmlContent } = event.data;
            createNotification(
              notificationType || 'SYSTEM',
              title || 'NOTIFICATION',
              message || 'New notification received',
              { details, color, duration, id: event.data.id, htmlContent }
            );
            break;

          case ExtensionMessageType.TOGGLE_EXTENSION:
            setVisible(prev => !prev);
            send('dapp', `Extension toggled via message`);
            break;

          case ExtensionMessageType.HIDE_NOTIFICATION:
            handleDismissPanel();
            break;

          case ExtensionMessageType.SHOW_3D:
            showCube(event.data.color, event.data.duration);
            break;

          case ExtensionMessageType.HIDE_3D:
            hideCube();
            break;

          // Handle incoming log messages from other components
          case ExtensionMessageType.LOG_NODE:
          case ExtensionMessageType.LOG_DAPP:
          case ExtensionMessageType.LOG_CONSOLE:
          case ExtensionMessageType.LOG_SYSTEM:
          case ExtensionMessageType.LOG_DEBUG:
          case ExtensionMessageType.LOG_ERROR:
          case ExtensionMessageType.LOG_WARNING:
            // Convert the message type to log type
            const logType = messageTypeToLogType[event.data.type as keyof typeof messageTypeToLogType];
            if (logType) {
              // Store directly in our logs state (but avoid recursion by not sending a new message)
              const logEntry = {
                type: logType,
                message: event.data.message,
                timestamp: event.data.timestamp,
                details: event.data.details
              };
              // setLogs(prev => [...prev, logEntry]);
            }
            break;

          // Handle clear logs command
          case ExtensionMessageType.CLEAR_LOGS:
            if (event.data.logTypes) {
              // Convert message types to log types
              const logTypesToClear = event.data.logTypes
                .map((msgType: ExtensionMessageType) => messageTypeToLogType[msgType as keyof typeof messageTypeToLogType])
                .filter(Boolean);

              // Clear specific log types
              // setLogs(prev => prev.filter(log => !logTypesToClear.includes(log.type)));

              // If clearing console logs, clear display text
              if (logTypesToClear.includes('console')) {
                setDisplayText('');
              }
            } else {
              // Clear all logs
              // setLogs([]);
              setDisplayText('');
            }
            break;
        }

        // Call external handler if provided
        if (onDappMessage) {
          try {
            onDappMessage(event);
          } catch (err) {
            // Silently ignore handler errors
          }
        }
      }
    } catch (err) {
      // Catch-all error handler to prevent crashing
      console.error('Error in dApp message handler:', err);
    }
  }

  // Set up event listener for dApp messages
  useEffect(() => {
    window.addEventListener('message', handleDappMessage);

    // Add initial message
    send('dapp', 'Signet loaded successfully!');

    return () => {
      window.removeEventListener('message', handleDappMessage);
    };
  }, []);

  // Console typing effect based on unified messages
  useEffect(() => {
    // Get console messages and format for display
    const consoleText = messages
      .filter(msg => msg.type === 'console')
      .map(msg => `> ${msg.content}`)
      .join('\n');

    if (consoleText === '') {
      setDisplayText('');
      return;
    }

    // Start typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= consoleText.length) {
        setDisplayText(consoleText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 10); // Fast typing speed

    return () => clearInterval(typingInterval);
  }, [messages]);

  // Create context value object
  const contextValue: SignetContextValue = {
    // UI State
    visible,
    isLogExpanded,
    nodeStatus,
    mempoolSize,

    // Popup UI State
    systemStatus,
    displayText,

    // Unified Message System
    messages,

    // UI Actions
    setVisible,
    setIsLogExpanded,
    toggleVisibility,
    performHealthCheck,

    // Unified Messaging Functions
    send,
    clearMessages,

    // System Status Actions
    setNodeStatus,
    setMempoolSize,
    setSystemStatus,

    // dApp Communication
    sendToDapp,

    // Notification State
    currentNotification,
    isPanelExiting,
    showCubeNotification,
    cubeColor,

    // Notification Actions
    handleDismissPanel,
    showNotification,
    showTransactionNotification,
    showPredictionNotification,
    showSystemNotification,
    showErrorNotification,
    showCube,
    hideCube
  }

  return (
    <SignetContext.Provider value={contextValue} >
      {children}
    </SignetContext.Provider>
  )
}

/**
 * Hook to use the Signet context
 */
export function useSignet() {
  const context = useContext(SignetContext)

  if (context === undefined) {
    throw new Error('useSignet must be used within a SignetProvider')
  }

  return context
}