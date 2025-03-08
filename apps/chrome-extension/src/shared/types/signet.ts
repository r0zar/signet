/**
 * Types for Signet extension messaging system
 */

// Basic notification types
export type NotificationType =
  | "OP_TRANSFER"
  | "OP_PREDICT"
  | "SYSTEM"
  | "ERROR";

// Transaction types
export enum TransactionType {
  TRANSFER = 'transfer',
  PREDICT = 'predict',
  CLAIM_REWARD = 'claim-reward'
}

// Standard notification data structure
export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  details?: string;
  timestamp: string;
  color?: string;
  duration?: number;
  id: string;
  // Rich notification features
  imageUrl?: string;
  htmlContent?: string;
  actions?: NotificationAction[];
}

// Notification action button
export interface NotificationAction {
  id: string;
  label: string;
  color?: string;
  action: 'approve' | 'reject' | 'dismiss' | 'custom';
  customAction?: string;
}

// Extension message types
export enum ExtensionMessageType {
  // UI control messages
  TOGGLE_EXTENSION = 'TOGGLE_EXTENSION',
  SHOW_3D = 'SHOW_3D',
  HIDE_3D = 'HIDE_3D',
  SHOW_3D_PANEL = 'SHOW_3D_PANEL',
  HIDE_3D_PANEL = 'HIDE_3D_PANEL',
  CHANGE_COLOR = 'CHANGE_COLOR',

  // Notification messages
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',

  // Wallet messages
  WALLET_UPDATE = 'WALLET_UPDATE',

  // Response messages
  NOTIFICATION_RESPONSE = 'NOTIFICATION_RESPONSE',

  // Test messages
  TEST_MESSAGE = 'TEST_MESSAGE',
  
  // Log messages
  LOG_NODE = 'LOG_NODE',             // Node status logs
  LOG_DAPP = 'LOG_DAPP',             // dApp communication logs
  LOG_CONSOLE = 'LOG_CONSOLE',       // Console/UI logs
  LOG_SYSTEM = 'LOG_SYSTEM',         // System operation logs
  LOG_DEBUG = 'LOG_DEBUG',           // Debug information
  LOG_ERROR = 'LOG_ERROR',           // Error logs 
  LOG_WARNING = 'LOG_WARNING',       // Warning logs
  CLEAR_LOGS = 'CLEAR_LOGS'          // Clear logs command
}

// Base message interface
export interface ExtensionMessage {
  type: ExtensionMessageType | string;
  [key: string]: any;
}

// Toggle extension message
export interface ToggleExtensionMessage extends ExtensionMessage {
  type: ExtensionMessageType.TOGGLE_EXTENSION;
}

// 3D cube message
export interface Show3DMessage extends ExtensionMessage {
  type: ExtensionMessageType.SHOW_3D;
  color?: string;
  duration?: number;
}

// 3D panel message
export interface Show3DPanelMessage extends ExtensionMessage {
  type: ExtensionMessageType.SHOW_3D_PANEL;
  color?: string;
  duration?: number;
}

// Notification message
export interface ShowNotificationMessage extends ExtensionMessage {
  type: ExtensionMessageType.SHOW_NOTIFICATION;
  title: string;
  message: string;
  details?: string;
  color?: string;
  duration?: number;
  notificationType?: NotificationType;
  // Rich notification features
  imageUrl?: string;
  htmlContent?: string;
  actions?: NotificationAction[];
}

// Color change message
export interface ChangeColorMessage extends ExtensionMessage {
  type: ExtensionMessageType.CHANGE_COLOR;
  color: string;
}

// Wallet update message
export interface WalletUpdateMessage extends ExtensionMessage {
  type: ExtensionMessageType.WALLET_UPDATE;
  address: string;
  balance: string;
  previousBalance?: string;
  delta?: string;
  reason?: string;
  relatedTransaction?: {
    id: string;
    type: string;
    timestamp: number;
    marketId?: string;
    marketName?: string;
  };
}

// Notification response message
export interface NotificationResponseMessage extends ExtensionMessage {
  type: ExtensionMessageType.NOTIFICATION_RESPONSE;
  id: string;
  notificationType: NotificationType;
  approved: boolean;
  timestamp: number;
  result?: any;
  rejectionReason?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Test message
export interface TestMessage extends ExtensionMessage {
  type: ExtensionMessageType.TEST_MESSAGE;
  timestamp: number;
}

// Base log message interface
export interface LogMessage extends ExtensionMessage {
  type: ExtensionMessageType.LOG_NODE | 
        ExtensionMessageType.LOG_DAPP | 
        ExtensionMessageType.LOG_CONSOLE | 
        ExtensionMessageType.LOG_SYSTEM | 
        ExtensionMessageType.LOG_DEBUG | 
        ExtensionMessageType.LOG_ERROR | 
        ExtensionMessageType.LOG_WARNING;
  message: string;
  timestamp: string;
  details?: any;
}

// Clear logs message
export interface ClearLogsMessage extends ExtensionMessage {
  type: ExtensionMessageType.CLEAR_LOGS;
  logTypes?: Array<ExtensionMessageType>;
}