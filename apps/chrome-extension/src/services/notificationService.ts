import type { NotificationData, NotificationType } from '../types/messages'
import { notificationColors } from '../styles/theme'

/**
 * Generates a random ID for notifications
 */
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 9);

/**
 * Creates a notification object with all required properties
 */
export function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  options: Partial<NotificationData> = {}
): NotificationData {
  return {
    type,
    title,
    message,
    timestamp: new Date().toLocaleTimeString(),
    color: options.color || notificationColors[type],
    id: options.id || generateId(),
    details: options.details,
    duration: options.duration,
    // Rich notification features
    imageUrl: options.imageUrl,
    htmlContent: options.htmlContent,
    actions: options.actions
  }
}

/**
 * Example notification templates
 */
export const exampleNotifications = {
  transaction: createNotification(
    "TRANSACTION",
    "TRANSACTION SUCCESSFUL",
    "Transaction successfully processed",
    { details: "TX: 0x71c...9e3f" }
  ),

  prediction: createNotification(
    "OP_PREDICT",
    "PREDICTION MARKET",
    "Blaze Protocol signature request",
    { details: "Market: Will ETH reach $5000 by EOY?" }
  ),

  system: createNotification(
    "SYSTEM",
    "SYSTEM NOTICE",
    "System update required",
    { details: "Please update to v1.2.0" }
  ),

  error: createNotification(
    "ERROR",
    "CONNECTION ERROR",
    "Failed to connect to network",
    { details: "Check your connection and try again" }
  )
}