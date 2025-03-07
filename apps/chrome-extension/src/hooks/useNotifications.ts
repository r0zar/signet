import { useState, useCallback, useEffect } from 'react'
import {
  type NotificationData,
  type NotificationType,
  ExtensionMessageType
} from '../types/messages'
import { createNotification, generateId } from '../services/notificationService'

interface UseNotificationsConfig {
  autoHideDuration?: number
}

/**
 * Hook for managing notifications within the extension
 */
export function useNotifications(config: UseNotificationsConfig = {}) {
  const { autoHideDuration = 5000 } = config

  // Current notification being displayed in the panel
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null)
  // For exit animations
  const [isPanelExiting, setIsPanelExiting] = useState(false)
  // 3D cube notification visibility
  const [showCubeNotification, setShowCubeNotification] = useState(false)
  // Cube color
  const [cubeColor, setCubeColor] = useState<string>('rgb(125, 249, 255)')

  // Handle panel dismissal - define this first to avoid dependency cycle
  const handleDismissPanel = useCallback(() => {
    // Animation is now handled by framer-motion's AnimatePresence
    // We can directly remove the notification
    setCurrentNotification(null)
  }, [])

  // Show a notification
  const showNotification = useCallback((notification: NotificationData) => {
    setCurrentNotification(notification)

    // Auto-hide if duration provided AND notification type doesn't require user action
    if (notification.duration && notification.type !== 'OP_PREDICT') {
      const timer = setTimeout(() => {
        handleDismissPanel()
      }, notification.duration)

      // Clean up timer if component unmounts or notification changes
      return () => clearTimeout(timer)
    }
  }, [handleDismissPanel])

  // Create and show a notification with type
  const createAndShowNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    // For notifications requiring user action, don't set auto-hide duration
    const duration = type === 'OP_PREDICT'
      ? undefined  // No auto-hide duration for prediction notifications
      : (options.duration || autoHideDuration)

    const notification = createNotification(type, title, message, {
      id: options.id || generateId(),
      details: options.details,
      color: options.color,
      duration: duration,
      htmlContent: options.htmlContent
    })

    showNotification(notification)
    return notification
  }, [autoHideDuration, showNotification])

  // Show 3D cube notification
  const showCube = useCallback((color?: string, duration?: number) => {
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
  }, [])

  // Hide 3D cube notification
  const hideCube = useCallback(() => {
    setShowCubeNotification(false)
  }, [])

  // Create various notification types
  const showTransactionNotification = useCallback((
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    return createAndShowNotification('TRANSACTION', title, message, options)
  }, [createAndShowNotification])

  const showPredictionNotification = useCallback((
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    // Explicitly set duration to undefined to prevent auto-dismissal
    const predictionOptions = {
      ...options,
      duration: undefined
    }
    return createAndShowNotification('OP_PREDICT', title, message, predictionOptions)
  }, [createAndShowNotification])

  const showSystemNotification = useCallback((
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    return createAndShowNotification('SYSTEM', title, message, options)
  }, [createAndShowNotification])

  const showErrorNotification = useCallback((
    title: string,
    message: string,
    options: Partial<NotificationData> = {}
  ) => {
    return createAndShowNotification('ERROR', title, message, options)
  }, [createAndShowNotification])

  // Listen for notification messages from window
  useEffect(() => {
    const handleNotificationMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      const { type } = event.data;

      switch (type) {
        case ExtensionMessageType.SHOW_NOTIFICATION:
          const { title, message, details, notificationType, color, duration, htmlContent } = event.data;
          createAndShowNotification(
            notificationType || 'SYSTEM',
            title || 'NOTIFICATION',
            message || 'New notification received',
            { details, color, duration, id: event.data.id, htmlContent }
          );
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
      }
    };

    window.addEventListener('message', handleNotificationMessage);

    return () => {
      window.removeEventListener('message', handleNotificationMessage);
    };
  }, [createAndShowNotification, handleDismissPanel, showCube, hideCube]);

  return {
    currentNotification,
    isPanelExiting,
    showCubeNotification,
    cubeColor,
    showNotification,
    handleDismissPanel,
    showTransactionNotification,
    showPredictionNotification,
    showSystemNotification,
    showErrorNotification,
    showCube,
    hideCube
  }
}