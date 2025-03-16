/**
 * SignetController - Main entry point for the Signet extension UI
 * Responsible for the main control panel and its minimized state
 * Uses the SignetContext for state management and real-time blockchain interactions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes, colors } from '../../shared/styles/theme'
import { useSignetContext } from '~shared/context/SignetContext';
import PanelHeader from '~shared/ui/PanelHeader';

// Import tab components
import { LogsTab } from './tabs/LogsTab';
import { WalletTab } from './tabs/WalletTab';
import { TransferTab } from './tabs/TransferTab';
import { MempoolTab } from './tabs/MempoolTab';
import { PermissionsTab } from './tabs/PermissionsTab';

// Import the Status interface
interface Status {
  subnet: string;
  txQueue: any[];
}

/**
 * Helper function to count the total number of pending transactions across all subnets
 */
function countPendingTx(status: Record<string, Status> | null): number {
  if (!status) return 0;

  // Sum up all pending transactions across all subnets
  return Object.values(status).reduce((total, subnetStatus) => {
    return total + (subnetStatus.txQueue?.length || 0);
  }, 0);
}

/**
 * Controller component that uses the SignetContext
 */
export function SignetController() {
  // Get state and actions from context
  const { status, error } = useSignetContext();
  const [visible, setVisible] = useState(false);

  // Show controller when an error occurs
  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  // Show controller when transactions are pending in any subnet
  // useEffect(() => {
  //   if (status) {
  //     // Check if any subnet has pending transactions
  //     const hasPendingTx = Object.values(status).some(
  //       subnetStatus => subnetStatus.txQueue && subnetStatus.txQueue.length > 0
  //     );

  //     if (hasPendingTx) {
  //       setVisible(true);
  //     }
  //   }
  // }, [status]);

  return (
    <div className="signet-container" style={{ pointerEvents: 'none' }}>
      {/* Main Controller UI */}
      {visible ? (
        <ControlPanel onClose={() => setVisible(false)} />
      ) : (
        <MinimizedButton
          onClick={() => setVisible(true)}
          showBadge={countPendingTx(status) > 0 || error !== null}
          txCount={countPendingTx(status)}
          hasError={error !== null}
        />
      )}
    </div>
  );
}

/**
 * Minimized button component with status indicator
 */
function MinimizedButton({
  onClick,
  showBadge = false,
  txCount = 0,
  hasError = false
}: {
  onClick: () => void;
  showBadge?: boolean;
  txCount?: number;
  hasError?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '12px',
        left: '14px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0D1117 0%, #010409 100%)',
        border: `1px solid ${hasError ? 'rgba(255, 78, 78, 0.6)' : 'rgba(125, 249, 255, 0.4)'}`,
        color: hasError ? 'rgba(255, 78, 78, 0.9)' : 'rgba(125, 249, 255, 0.9)',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: hasError
          ? '0 2px 10px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 78, 78, 0.4)'
          : '0 2px 10px rgba(0, 0, 0, 0.3), 0 0 5px rgba(125, 249, 255, 0.2)',
        zIndex: 999999,
        pointerEvents: 'auto'
      }}
    >
      <motion.span
        animate={hasError
          ? { scale: [1, 1.1, 1] }
          : (txCount > 0 ? { rotate: [0, 5, 0, -5, 0] } : {})}
        transition={{
          duration: hasError ? 1.5 : 0.5,
          repeat: Infinity,
          repeatDelay: hasError ? 0 : 5
        }}
      >
        ⚡
      </motion.span>

      {/* Notification badge for pending transactions */}
      {showBadge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: hasError ? '#FF4E4E' : '#36C758',
            border: '2px solid #0D1117',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            boxShadow: hasError
              ? '0 0 5px rgba(255, 78, 78, 0.8)'
              : '0 0 5px rgba(54, 199, 88, 0.8)'
          }}
        >
          {hasError ? '!' : txCount > 0 ? txCount : ''}
        </motion.div>
      )}
    </motion.button>
  );
}

export function ControlPanel({ onClose }: { onClose: () => void }) {
  // Active tab state (0-4 for the 5 tabs)
  const [activeTab, setActiveTab] = useState(1);
  const { status, error, refreshStatus, isWalletInitialized } = useSignetContext();

  // Tab titles for the navigation bar
  const tabTitles = ['LOGS', 'WALLET', 'TRANSFER', 'MEMPOOL', 'PERMISSIONS'];

  // Effect to check status on load
  useEffect(() => {
    refreshStatus();
  }, []);

  // Get the active account from context
  const { currentAccount } = useSignetContext();
  const hasActiveAccount = isWalletInitialized && currentAccount && currentAccount.stxAddress;

  // Navigate to previous tab - disable certain tabs if no account is active
  const goToPreviousTab = () => {
    let newTab = activeTab === 0 ? 4 : activeTab - 1;

    // If trying to navigate to Transfer or Mempool tab with no account, skip to previous
    // if (!hasActiveAccount && (newTab === 2 || newTab === 3)) {
    //   newTab = newTab === 2 ? 1 : 0;
    // }

    setActiveTab(newTab);
  }

  // Navigate to next tab - disable certain tabs if no account is active
  const goToNextTab = () => {
    let newTab = activeTab === 4 ? 0 : activeTab + 1;

    // If trying to navigate to Transfer or Mempool tab with no account, skip to next
    // if (!hasActiveAccount && (newTab === 2 || newTab === 3)) {
    //   newTab = newTab === 2 ? 4 : 4;
    // }

    setActiveTab(newTab);
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Logs tab
        return <LogsTab />;
      case 1: // Wallet tab
        return <WalletTab />;
      case 2: // Transfer tab
        if (!hasActiveAccount) {
          return (
            <div style={{
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: colors.steel,
              textAlign: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔐</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.cyber }}>
                Account Required
              </div>
              <div style={{ fontSize: '12px' }}>
                Please set up and activate an account in the WALLET tab before using transfers.
              </div>
              <motion.button
                onClick={() => setActiveTab(1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: 'rgba(125, 249, 255, 0.1)',
                  border: '1px solid rgba(125, 249, 255, 0.4)',
                  borderRadius: '4px',
                  color: colors.cyber,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Go to Wallet
              </motion.button>
            </div>
          );
        }
        return <TransferTab />;
      case 3: // Mempool tab
        if (!hasActiveAccount) {
          return (
            <div style={{
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: colors.steel,
              textAlign: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔐</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.cyber }}>
                Account Required
              </div>
              <div style={{ fontSize: '12px' }}>
                Please set up and activate an account in the WALLET tab to view the mempool.
              </div>
              <motion.button
                onClick={() => setActiveTab(1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: 'rgba(125, 249, 255, 0.1)',
                  border: '1px solid rgba(125, 249, 255, 0.4)',
                  borderRadius: '4px',
                  color: colors.cyber,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Go to Wallet
              </motion.button>
            </div>
          );
        }
        return <MempoolTab />;
      case 4: // Permissions tab
        return <PermissionsTab />;
      default:
        return null;
    }
  }

  return (
    <motion.div
      className="signet-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: '32px',
        left: '20px',
        width: '360px',
        background: `linear-gradient(180deg, #0D1117 0%, #010409 100%)`,
        borderRadius: '6px',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        zIndex: 999999,
        border: `1px solid ${error ? 'rgba(255, 78, 78, 0.3)' : 'rgba(125, 249, 255, 0.3)'}`,
        boxShadow: error
          ? '0 0 15px rgba(0, 0, 0, 0.7), 0 0 8px rgba(255, 78, 78, 0.3)'
          : '0 0 15px rgba(0, 0, 0, 0.7), 0 0 5px rgba(125, 249, 255, 0.3)',
        pointerEvents: 'auto' // Enable pointer events for the panel
      }}
    >
      {/* Header with subnet info */}
      <PanelHeader
        title={`SIGNET ${status ? 'CONTROLLER' : ''}`}
        onClose={onClose}
      />

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 8px',
        background: 'rgba(1, 4, 9, 0.7)',
        borderBottom: '1px solid rgba(125, 249, 255, 0.2)',
        height: '28px'
      }}>
        {/* Previous Tab Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousTab}
          style={{
            background: 'none',
            border: 'none',
            color: colors.cyber,
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px'
          }}
        >
          ◀
        </motion.button>

        {/* Tab Title - show lock icon for disabled tabs */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            color: colors.cyber,
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {tabTitles[activeTab]}
          {!hasActiveAccount && (activeTab === 2 || activeTab === 3) && (
            <span style={{ fontSize: '10px', color: 'rgba(125, 249, 255, 0.5)' }}>🔒</span>
          )}
        </motion.div>

        {/* Next Tab Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextTab}
          style={{
            background: 'none',
            border: 'none',
            color: colors.cyber,
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px'
          }}
        >
          ▶
        </motion.button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            color: '#ffffff',
            height: 'calc(100% - 44px)', // Adjust for header and tab navigation
            overflowY: 'auto',
            scrollbarColor: `#7DF9FF #010409`,
            scrollbarWidth: 'thin',
            scrollBehavior: 'smooth'
          }}
          className="signet-scrollbar"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Inject keyframes and global styles */}
      <style>
        {keyframes.slideInUp}
        {keyframes.slideInRight}
        {keyframes.shimmer}
        {keyframes.scanLine}
        {keyframes.spin}
        {`
          /* Disable browser autocomplete styling */
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            /* More aggressive approach to disable the autofill background */
            -webkit-box-shadow: 0 0 0 1000px rgba(1, 4, 9, 0.8) inset !important;
            -webkit-text-fill-color: rgb(125, 249, 255) !important;
            transition: background-color 5000s ease-in-out 0s;
            background-color: transparent !important;
            background-image: none !important;
            background-clip: content-box !important;
            color-scheme: dark !important;
          }

          /* Additional override to ensure no inner box remains */
          input[autocompleted],
          input:-internal-autofill-selected {
            background-color: transparent !important;
            background-image: none !important;
            -webkit-box-shadow: 0 0 0 1000px rgba(1, 4, 9, 0.8) inset !important;
          }

          /* Custom number input styling */
          /* Hide default spinners in Webkit browsers */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0 !important;
            opacity: 1 !important;
          }

          /* Hide default spinners in Firefox */
          input[type="number"] {
            -moz-appearance: textfield !important;
          }

          /* Custom spinners for number inputs using pseudo-elements */
          input[type="number"] {
            position: relative !important;
          }

          /* Style container for themed up/down controls */
          .signet-number-control {
            position: absolute;
            top: 1px;
            right: 1px;
            bottom: 1px;
            width: 18px;
            border-left: 1px solid rgba(125, 249, 255, 0.2);
            display: flex;
            flex-direction: column;
            pointer-events: none;
          }

          .signet-number-up,
          .signet-number-down {
            height: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: rgba(125, 249, 255, 0.7);
            background-color: rgba(1, 4, 9, 0.6);
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
            transition: background-color 0.2s ease, color 0.2s ease;
          }

          .signet-number-up {
            border-top-right-radius: 3px;
          }

          .signet-number-down {
            border-bottom-right-radius: 3px;
            border-top: 1px solid rgba(125, 249, 255, 0.2);
          }

          .signet-number-up:hover,
          .signet-number-down:hover {
            background-color: rgba(125, 249, 255, 0.1);
            color: rgba(125, 249, 255, 1);
          }

          .signet-number-up:active,
          .signet-number-down:active {
            background-color: rgba(125, 249, 255, 0.2);
          }
        `}
      </style>
    </motion.div>
  )
}