import { MessageType } from 'signet-sdk/src/messaging';
import { ReactNode } from 'react';

/**
 * Permission level for notifications
 */
export enum PermissionLevel {
  INFO = 'info',
  SENSITIVE = 'sensitive',
  CRITICAL = 'critical'
}

/**
 * Banner type for origin banners
 */
export enum BannerType {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

/**
 * Properties for notification actions (buttons)
 */
export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  color: string;
}

/**
 * Properties for a formatted notification
 */
export interface FormattedNotification {
  title: string;
  type: string;
  color: string;
  customIcon: ReactNode;
  message: ReactNode;
  actions: NotificationAction[];
}

/**
 * Common props for permission content components
 */
export interface PermissionContentProps {
  origin: string;
  rememberCheckbox: ReactNode;
}

/**
 * Props for default permission content
 */
export interface DefaultPermissionContentProps extends PermissionContentProps {
  type: string;
}

/**
 * Permissions request object
 */
export interface PermissionRequest {
  id: string;
  origin: string;
  type: MessageType;
  timestamp: string;
  message: any;
}