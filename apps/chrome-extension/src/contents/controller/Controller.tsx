/**
 * Main SignetController component with tabbed interface
 * Now uses the SignetContext provider for state management
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { keyframes, colors } from '../../shared/styles/theme'

// Components
import PanelHeader from '../../shared/ui/PanelHeader'
import PanelFooter from '../../shared/ui/PanelFooter'
import MessageLog from '../../shared/ui/MessageLog'
import Notification3D from '../../shared/notifications/Notification3D'
import NotificationPanel from '../../shared/notifications/NotificationPanel'

// Refactored components
import { MinimizedButton } from './MinimizedButton'
import { ActionPanel } from './ActionPanel'

// State management
import { ExtensionMessageType, type NotificationResponseMessage } from '~shared/types/signet'
import { useSignet } from '~shared/hooks/useSignet'

/**
 * Main SignetController component with tabbed navigation
 */
export function SignetController() {
  // Active tab state (0-3 for the 4 tabs)
  const [activeTab, setActiveTab] = useState(0);

  // Get all required state and actions from context
  const {
    nodeStatus,
    currentNotification,
    isPanelExiting,
    showCubeNotification,
    cubeColor,
    visible,
    messages,
    handleDismissPanel,
    hideCube,
    setVisible,
    send
  } = useSignet()

  // Handle approval of notification (for prediction markets)
  const handleApprove = () => {
    if (currentNotification) {
      send('dapp', `Approved: ${currentNotification.title}`)

      // Generate mock transaction data
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 42)}`
      const mockSignature = `0x${Math.random().toString(16).substring(2, 130)}`
      const mockReceiptId = `receipt-${Date.now()}`

      // Generate enhanced response with additional metadata
      const enhancedResponse: NotificationResponseMessage = {
        type: ExtensionMessageType.NOTIFICATION_RESPONSE,
        id: currentNotification.id,
        notificationType: currentNotification.type,
        approved: true,
        timestamp: Date.now(),
        result: {
          transactionHash: mockTxHash,
          signature: mockSignature,
          receiptId: mockReceiptId,
          metadata: {
            // Include detailed market and prediction data for OP_PREDICT operations
            marketId: `market-${Math.floor(Math.random() * 10000)}`,
            marketName: currentNotification.details || "Unknown Market",
            outcomeId: 1,
            outcomeName: "Yes",
            amount: Math.floor(Math.random() * 100),
            odds: parseFloat((Math.random() * 5 + 1).toFixed(2)),
            potentialPayout: Math.floor(Math.random() * 500),
            feeAmount: parseFloat((Math.random() * 2).toFixed(2)),
            networkFee: parseFloat((Math.random() * 0.01).toFixed(4))
          }
        }
      }

      // Send notification response message back to dapp
      window.postMessage(enhancedResponse, '*')

      handleDismissPanel()
    }
  }

  // Handle rejection of notification (for prediction markets)
  const handleReject = () => {
    if (currentNotification) {
      send('dapp', `Rejected: ${currentNotification.title}`)

      // Create enhanced rejection response with structured reason
      const enhancedRejection: NotificationResponseMessage = {
        type: ExtensionMessageType.NOTIFICATION_RESPONSE,
        id: currentNotification.id,
        notificationType: currentNotification.type,
        approved: false,
        timestamp: Date.now(),
        rejectionReason: {
          code: 'USER_REJECTED',
          message: 'User rejected the request',
          details: 'The user manually declined the operation'
        }
      }

      // Send notification response message back to dapp
      window.postMessage(enhancedRejection, '*')

      handleDismissPanel()
    }
  }

  // Navigate to previous tab
  const goToPreviousTab = () => {
    setActiveTab(prev => (prev === 0 ? 3 : prev - 1))
  }

  // Navigate to next tab
  const goToNextTab = () => {
    setActiveTab(prev => (prev === 3 ? 0 : prev + 1))
  }

  // Tab titles for the navigation bar
  const tabTitles = ['LOGS', 'ACTIONS', 'NETWORK', 'SETTINGS']

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Logs tab
        return (
          <MessageLog
            messages={messages.map(msg => msg.content)}
            expanded={true} // Always expanded in the logs tab
            onToggleExpand={() => { }}
          />
        )
      case 1: // Actions tab
        return (
          <ActionPanel />
        )
      case 2: // Network tab - currently empty
        return (
          <div style={{
            height: '290px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.steel,
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{
              fontSize: '24px',
              color: colors.cyber,
              opacity: 0.5
            }}>
              NETWORK
            </div>
            <div style={{ fontSize: '14px' }}>
              Coming soon...
            </div>
          </div>
        )
      case 3: // Settings tab - currently empty
        return (
          <div style={{
            height: '290px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.steel,
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{
              fontSize: '24px',
              color: colors.cyber,
              opacity: 0.5
            }}>
              SETTINGS
            </div>
            <div style={{ fontSize: '14px' }}>
              Coming soon...
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="signet-container" style={{ pointerEvents: 'none' }}>
      {/* 3D Notification - Top Right */}
      <AnimatePresence>
        {showCubeNotification && (
          <Notification3D
            color={cubeColor}
            onClose={hideCube}
          />
        )}
      </AnimatePresence>

      {/* Message Notification Panel - Top Center */}
      <AnimatePresence mode="wait">
        {currentNotification && (
          <NotificationPanel
            key={currentNotification.id}
            notification={currentNotification}
            isExiting={isPanelExiting}
            onDismiss={handleDismissPanel}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </AnimatePresence>

      {/* Minimized button or full control panel */}
      {!visible ? (
        <MinimizedButton />
      ) : (
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
            border: `1px solid rgba(125, 249, 255, 0.3)`,
            boxShadow: `0 0 15px rgba(0, 0, 0, 0.7), 0 0 5px rgba(125, 249, 255, 0.3)`,
            pointerEvents: 'auto' // Enable pointer events for the panel
          }}
        >
          {/* Header */}
          <PanelHeader title="SIGNET CONTROLLER" onClose={() => setVisible(false)} />

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

            {/* Tab Title */}
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
                letterSpacing: '1px'
              }}
            >
              {tabTitles[activeTab]}
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
                padding: '16px',
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

          {/* Footer */}
          <PanelFooter isActive={nodeStatus === 'active'} />
        </motion.div>
      )}

      {/* Inject keyframes */}
      <style>
        {keyframes.slideInUp}
        {keyframes.slideInRight}
        {keyframes.shimmer}
        {keyframes.scanLine}
        {keyframes.spin}
      </style>
    </div>
  )
}