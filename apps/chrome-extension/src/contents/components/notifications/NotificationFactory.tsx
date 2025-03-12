import React, { ReactNode } from 'react';
import { MessageType } from 'signet-sdk/src/messaging';
import { colors } from '~shared/styles/theme';
import { CustomIcons } from './Icons';
import { FormattedNotification, PermissionRequest } from './types';
import {
  ExtensionCheckContent,
  GetStatusContent,
  BalanceContent,
  BalancesContent,
  TransferContent,
  DefaultPermissionContent
} from './PermissionContent';

/**
 * Factory class to create notification objects based on permission requests
 */
export class NotificationFactory {
  /**
   * Creates a formatted notification object for a permission request
   */
  static createPermissionNotification(
    permission: PermissionRequest,
    rememberCheckbox: ReactNode
  ): FormattedNotification {
    // Different formatting based on message type
    switch (permission.type) {
      case MessageType.CHECK_EXTENSION_INSTALLED:
        return {
          title: 'EXTENSION CHECK',
          type: 'SDK_PERMISSION',
          color: colors.cyber,
          customIcon: CustomIcons.checkExtension,
          message: (
            <ExtensionCheckContent
              origin={permission.origin}
              rememberCheckbox={rememberCheckbox}
            />
          ),
          actions: this.getStandardActions()
        };

      case MessageType.GET_STATUS:
        return {
          title: 'GET STATUS REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.cyber,
          customIcon: CustomIcons.getStatus,
          message: (
            <GetStatusContent
              origin={permission.origin}
              rememberCheckbox={rememberCheckbox}
            />
          ),
          actions: this.getStandardActions()
        };
        
      case MessageType.GET_BALANCE:
        return {
          title: 'BALANCE REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.neonOrange,
          customIcon: CustomIcons.getBalance,
          message: (
            <BalanceContent
              origin={permission.origin}
              rememberCheckbox={rememberCheckbox}
            />
          ),
          actions: this.getStandardActions()
        };

      case MessageType.GET_BALANCES:
        return {
          title: 'ALL BALANCES REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.neonOrange,
          customIcon: CustomIcons.getBalances,
          message: (
            <BalancesContent
              origin={permission.origin}
              rememberCheckbox={rememberCheckbox}
            />
          ),
          actions: this.getStandardActions()
        };

      case MessageType.CREATE_TRANSFER_TX:
        return {
          title: 'TRANSFER REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.neonRed,
          customIcon: CustomIcons.createTransfer,
          message: (
            <TransferContent
              origin={permission.origin}
              rememberCheckbox={rememberCheckbox}
            />
          ),
          actions: this.getStandardActions()
        };

      default:
        return {
          title: 'PERMISSION REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.neonOrange,
          customIcon: CustomIcons.defaultPermission,
          message: (
            <DefaultPermissionContent
              origin={permission.origin}
              type={permission.type}
              rememberCheckbox={rememberCheckbox}
            />
          ),
          actions: this.getStandardActions()
        };
    }
  }

  /**
   * Returns standard actions for permission notifications
   */
  private static getStandardActions() {
    return [
      {
        id: 'reject',
        label: 'DENY',
        action: 'reject',
        color: colors.neonRed
      },
      {
        id: 'approve',
        label: 'APPROVE',
        action: 'approve',
        color: colors.neonGreen
      }
    ];
  }
}