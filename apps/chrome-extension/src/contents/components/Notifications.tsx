/**
 * Notifications Component
 * 
 * Responsible for displaying notifications based on messages from the SignetContext
 * This component handles the display, animation, and dismissal of notifications
 * as well as permission requests from web applications
 * 
 * Key features:
 * - Uses a React component for the "Remember this decision" checkbox
 * - Directly updates state through useState instead of custom events
 * - Handles permission approvals and denials with rememberChoice flag
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSignetContext } from '~shared/context/SignetContext';
import NotificationPanel from '~shared/notifications/NotificationPanel';
import type { Message } from 'signet-sdk/src/messaging';
import { MessageType } from 'signet-sdk/src/messaging';
import { colors } from '~shared/styles/theme';
import type { PermissionRequest } from '~shared/context/slices/messagesSlice';

// Base notification timeout in milliseconds
const DEFAULT_TIMEOUT = 5000;

// SVG Icons for different permission types
const PermissionIcons = {
  status: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8V13" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16.01L12.01 15.9989" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12V8H6C3.79086 8 2 6.20914 2 4V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V16" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 4C2 5.10457 2.89543 6 4 6H16V2H4C2.89543 2 2 2.89543 2 4Z" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12C22 13.1046 21.1046 14 20 14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12Z" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  subnet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18L5 21L2 18" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17V11" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 6L19 3L16 6" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 13V7" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 16L12 19L9 16" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17V3" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V14" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17.01L12.01 16.9989" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

// Custom Icons for permission notifications
const CustomIcons = {
  checkExtension: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.0801V12.0001C21.9988 14.1565 21.3005 16.2548 20.0093 17.9819C18.7182 19.7091 16.9033 20.9726 14.8354 21.584C12.7674 22.1954 10.5573 22.122 8.53447 21.3747C6.51168 20.6274 4.78465 19.2462 3.61096 17.4371C2.43727 15.628 1.87979 13.4882 2.02168 11.3364C2.16356 9.18467 2.99721 7.13643 4.39828 5.49718C5.79935 3.85793 7.69279 2.71549 9.79619 2.24025C11.8996 1.76502 14.1003 1.98245 16.07 2.86011" stroke="#7DF9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 4L12 14.01L9 11.01" stroke="#7DF9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  getStatus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4H12.01M12 20H12.01M4 12H4.01M20 12H20.01M17.657 6.343H17.667M6.343 17.657H6.353M6.343 6.343H6.353M17.657 17.657H17.667" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  defaultPermission: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V14" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17.01L12.01 16.9989" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

// RememberChoice checkbox component
interface RememberChoiceCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const RememberChoiceCheckbox: React.FC<RememberChoiceCheckboxProps> = ({ checked, onChange }) => (
  <div style={{
    marginTop: '15px',
    padding: '8px',
    background: 'rgba(125, 249, 255, 0.05)',
    borderRadius: '4px'
  }}>
    <label style={{
      display: 'flex',
      alignItems: 'center',
      fontSize: '10px',
      color: '#8C9CA8',
      gap: '6px'
    }}>
      <div style={{ position: 'relative', width: '16px', height: '16px' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            width: '16px',
            height: '16px',
            border: '1px solid rgba(125, 249, 255, 0.5)',
            background: 'rgba(1, 4, 9, 0.8)',
            borderRadius: '2px',
            position: 'relative',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: checked ? '0 0 5px rgba(125, 249, 255, 0.5)' : 'none',
            backgroundColor: checked ? 'rgba(125, 249, 255, 0.2)' : 'rgba(1, 4, 9, 0.8)',
            borderColor: checked ? 'rgba(125, 249, 255, 0.8)' : 'rgba(125, 249, 255, 0.5)',
            margin: 0,
            padding: 0
          }}
        />
        {checked && (
          <div style={{
            position: 'absolute',
            left: '5px',
            top: '2px',
            width: '4px',
            height: '8px',
            border: 'solid #7DF9FF',
            borderWidth: '0 2px 2px 0',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 2px rgba(125, 249, 255, 0.8)',
            pointerEvents: 'none'
          }} />
        )}
      </div>
      Remember this decision for this website
    </label>
  </div>
);

// Permission level indicator component
interface PermissionLevelIndicatorProps {
  level: 'critical' | 'sensitive' | 'info';
}

const PermissionLevelIndicator: React.FC<PermissionLevelIndicatorProps> = ({ level }) => {
  const levelColors = {
    critical: "#FF3B30",
    sensitive: "#FF9500",
    info: "#36C758"
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      gap: '6px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: levelColors[level],
        boxShadow: `0 0 8px ${levelColors[level]}aa`,
        animation: 'pulse 2s infinite'
      }}></div>
      <div style={{
        fontSize: '10px',
        fontFamily: 'monospace',
        color: levelColors[level],
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 'bold'
      }}>
        {level} permission
      </div>
    </div>
  );
};

// Feature explanation component with icon
interface FeatureExplanationProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureExplanation: React.FC<FeatureExplanationProps> = ({ icon, text }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '10px'
  }}>
    <div style={{
      width: '20px',
      minWidth: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {icon}
    </div>
    <span style={{ color: '#f8f8f2' }}>{text}</span>
  </div>
);

// Origin banner component
interface OriginBannerProps {
  origin: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
}

const OriginBanner: React.FC<OriginBannerProps> = ({ origin, type, message }) => {
  const bannerColors = {
    info: colors.neonGreen,
    warning: colors.neonOrange,
    critical: colors.neonRed
  };

  const bgColors = {
    info: 'rgba(54, 199, 88, 0.08)',
    warning: 'rgba(255, 149, 0, 0.08)',
    critical: 'rgba(255, 59, 48, 0.1)'
  };

  return (
    <div style={{
      background: bgColors[type],
      borderLeft: `2px solid ${bannerColors[type]}`,
      padding: '8px 10px',
      margin: '12px 0',
      fontSize: '11px'
    }}>
      <strong style={{ color: '#fff' }}>{origin}</strong> {message}
    </div>
  );
};

// Operation type display component
interface OperationTypeDisplayProps {
  type: string;
}

const OperationTypeDisplay: React.FC<OperationTypeDisplayProps> = ({ type }) => (
  <div style={{
    fontFamily: 'monospace',
    color: colors.cyber,
    background: 'rgba(125, 249, 255, 0.05)',
    padding: '4px 8px',
    marginTop: '5px',
    borderRadius: '2px',
    fontSize: '10px',
    letterSpacing: '1px',
    marginLeft: '24px'
  }}>
    {type}
  </div>
);

// Extension check permission content
interface ExtensionCheckContentProps {
  origin: string;
  rememberCheckbox: React.ReactNode;
}

const ExtensionCheckContent: React.FC<ExtensionCheckContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={{ color: '#f8f8f2', fontFamily: 'monospace' }}>
    <PermissionLevelIndicator level="info" />

    <OriginBanner
      origin={origin}
      type="info"
      message="wants to detect Signet"
    />

    <div style={{ margin: '15px 0' }}>
      <FeatureExplanation
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H14M4 18H10" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        text="Check if Signet extension is installed"
      />

      <FeatureExplanation
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        text="Retrieve extension version information"
      />
    </div>

    {rememberCheckbox}
  </div>
);

// Get status permission content
interface GetStatusContentProps {
  origin: string;
  rememberCheckbox: React.ReactNode;
}

const GetStatusContent: React.FC<GetStatusContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={{ color: '#f8f8f2', fontFamily: 'monospace' }}>
    <PermissionLevelIndicator level="info" />

    <OriginBanner
      origin={origin}
      type="info"
      message="wants to read Signet status"
    />

    <div style={{ margin: '15px 0' }}>
      <FeatureExplanation
        icon={PermissionIcons.status}
        text="View connection status"
      />

      <FeatureExplanation
        icon={PermissionIcons.subnet}
        text="See available subnets"
      />

      <FeatureExplanation
        icon={PermissionIcons.wallet}
        text="Access wallet address"
      />
    </div>

    {rememberCheckbox}
  </div>
);

// Default permission content
interface DefaultPermissionContentProps {
  origin: string;
  type: string;
  rememberCheckbox: React.ReactNode;
}

const DefaultPermissionContent: React.FC<DefaultPermissionContentProps> = ({ origin, type, rememberCheckbox }) => (
  <div style={{ color: '#f8f8f2', fontFamily: 'monospace' }}>
    <PermissionLevelIndicator level="critical" />

    <OriginBanner
      origin={origin}
      type="critical"
      message="is requesting access to Signet"
    />

    <div style={{ margin: '10px 0', color: '#8C9CA8', fontSize: '11px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '20px',
          minWidth: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {PermissionIcons.warning}
        </div>
        <span>This website is requesting permission for an operation of type:</span>
      </div>
      <OperationTypeDisplay type={type} />
    </div>

    {rememberCheckbox}
  </div>
);

export function Notifications() {
  const {
    messages,
    pendingPermissions,
    approvePermission,
    denyPermission,
    rememberPermission
  } = useSignetContext();

  const [activeNotification, setActiveNotification] = useState<Message | null>(null);
  const [activePermission, setActivePermission] = useState<PermissionRequest | null>(null);
  const [dismissTimeout, setDismissTimeout] = useState<NodeJS.Timeout | null>(null);
  const [rememberChoice, setRememberChoice] = useState<boolean>(false);

  // Listen for new messages and handle notifications
  useEffect(() => {
    // If we have active notifications, don't show another one
    if (activeNotification || activePermission) return;

    // First check if we have pending permissions
    if (pendingPermissions.length > 0) {
      setActivePermission(pendingPermissions[0]);
      return;
    }
  }, [messages, pendingPermissions, activeNotification, activePermission]);

  // Clean up timeout when component unmounts or notification changes
  useEffect(() => {
    return () => {
      if (dismissTimeout) {
        clearTimeout(dismissTimeout);
      }
    };
  }, [dismissTimeout]);

  // Handle user dismissal of notification
  const handleDismiss = () => {
    // Clear any existing timeout
    if (dismissTimeout) {
      clearTimeout(dismissTimeout);
      setDismissTimeout(null);
    }

    // Clear the active notification
    setActiveNotification(null);
  };

  // Handle approval of permission request
  const handlePermissionApprove = () => {
    if (!activePermission) return;

    if (rememberChoice) {
      rememberPermission(activePermission.id, true);
    } else {
      approvePermission(activePermission.id);
    }

    setActivePermission(null);
    setRememberChoice(false);
  };

  // Handle denial of permission request
  const handlePermissionDeny = () => {
    if (!activePermission) return;

    if (rememberChoice) {
      rememberPermission(activePermission.id, false);
    } else {
      denyPermission(activePermission.id);
    }

    setActivePermission(null);
    setRememberChoice(false);
  };

  // Render remember choice checkbox with state
  const renderRememberChoice = () => (
    <RememberChoiceCheckbox
      checked={rememberChoice}
      onChange={() => setRememberChoice(!rememberChoice)}
    />
  );

  // Format a permission request as a notification
  const formatPermissionNotification = (permission: PermissionRequest) => {
    // Create reusable JSX components for the content
    const getExtensionCheckContent = () => (
      <ExtensionCheckContent
        origin={permission.origin}
        rememberCheckbox={renderRememberChoice()}
      />
    );

    const getStatusContent = () => (
      <GetStatusContent
        origin={permission.origin}
        rememberCheckbox={renderRememberChoice()}
      />
    );

    const getDefaultContent = () => (
      <DefaultPermissionContent
        origin={permission.origin}
        type={permission.type}
        rememberCheckbox={renderRememberChoice()}
      />
    );

    // Different formatting based on message type
    switch (permission.type) {
      case MessageType.CHECK_EXTENSION_INSTALLED:
        return {
          title: 'EXTENSION CHECK',
          type: 'SDK_PERMISSION',
          color: colors.cyber,
          customIcon: CustomIcons.checkExtension,
          message: getExtensionCheckContent(),
          actions: [
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
          ]
        };

      case MessageType.GET_STATUS:
        return {
          title: 'GET STATUS REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.cyber,
          customIcon: CustomIcons.getStatus,
          message: getStatusContent(),
          actions: [
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
          ]
        };

      default:
        return {
          title: 'PERMISSION REQUEST',
          type: 'SDK_PERMISSION',
          color: colors.neonOrange,
          customIcon: CustomIcons.defaultPermission,
          message: getDefaultContent(),
          actions: [
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
          ]
        };
    }
  };

  return (
    <div className="signet-notifications" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {activePermission && (
          <NotificationPanel
            notification={formatPermissionNotification(activePermission)}
            onDismiss={handlePermissionDeny}
            onApprove={handlePermissionApprove}
            onReject={handlePermissionDeny}
          />
        )}
        {!activePermission && activeNotification && (
          <NotificationPanel
            notification={activeNotification}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}