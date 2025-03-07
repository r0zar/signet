import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMessageHandler } from '../../hooks/useMessageHandler'
import { useNotifications } from '../../hooks/useNotifications'
import { colors, keyframes } from '../../styles/theme'
import { ExtensionMessageType, type WalletUpdateMessage, type NotificationResponseMessage } from '../../types/messages'
import '../../styles/form-elements.css'

// Components
import PanelHeader from '../ui/PanelHeader'
import PanelFooter from '../ui/PanelFooter'
import MessageLog from '../ui/MessageLog'
import ActionButton from '../ui/ActionButton'
import Notification3D from '../notifications/Notification3D'
import NotificationPanel from '../notifications/NotificationPanel'

/**
 * Main SignetController component - handles the overlay UI and notifications
 */
export default function SignetController() {
  const [visible, setVisible] = useState(true)
  const [isLogExpanded, setIsLogExpanded] = useState(false)

  // Initialize notification system first so we can access its functions
  const {
    currentNotification,
    isPanelExiting,
    showCubeNotification,
    cubeColor,
    handleDismissPanel,
    showTransactionNotification,
    showPredictionNotification,
    showSystemNotification,
    showErrorNotification,
    showCube,
    hideCube
  } = useNotifications()

  // State for wallet data
  const [walletData, setWalletData] = useState<{
    address: string;
    balance: string;
    lastUpdate?: number;
  } | null>(null);

  // Initialize message handler
  const { messages, addMessage, sendMessage } = useMessageHandler({
    onHandleMessage: (event) => {
      if (event.data && typeof event.data === 'object') {
        // Handle toggle extension messages
        if (event.data.type === ExtensionMessageType.TOGGLE_EXTENSION) {
          setVisible(prev => !prev) // Use function form to avoid closure issues
          addMessage(`Extension toggled via message`)
        }

        // Handle wallet update messages
        else if (event.data.type === ExtensionMessageType.WALLET_UPDATE) {
          // No function dependency here, just data processing
          const data = event.data as WalletUpdateMessage;

          // Update wallet data
          setWalletData({
            address: data.address,
            balance: data.balance,
            lastUpdate: Date.now()
          });

          // Create a notification only if delta and reason are present
          if (data.delta && data.reason) {
            const isPositiveChange = data.delta.startsWith('+');
            const notificationColor = isPositiveChange ? colors.neonGreen : colors.neonOrange;

            showSystemNotification(
              `WALLET ${isPositiveChange ? 'INCREASE' : 'DECREASE'}`,
              `${data.address.substring(0, 6)}...${data.address.substring(data.address.length - 4)} ${data.delta}`,
              {
                details: data.reason + (data.relatedTransaction?.marketName
                  ? ` - ${data.relatedTransaction.marketName}`
                  : ''),
                color: notificationColor,
                duration: 5000,
                htmlContent: `
                  <div style="text-align: left; padding: 5px;">
                    <div style="font-size: 14px; margin-bottom: 5px;">${data.delta}</div>
                    <div>New Balance: <span style="color: ${isPositiveChange ? '#50fa7b' : '#ff79c6'}">${data.balance}</span></div>
                    ${data.previousBalance ? `<div>Previous: ${data.previousBalance}</div>` : ''}
                    <div style="font-size: 11px; margin-top: 8px; font-style: italic;">${data.reason}</div>
                  </div>
                `
              }
            );
          }
        }
      }
    }
  })

  // Add a test message
  const handleAddTestMessage = () => {
    addMessage(`Test message at ${new Date().toLocaleTimeString()}`)
  }

  // Toggle 3D cube
  const handleToggle3D = () => {
    if (showCubeNotification) {
      hideCube()
      addMessage('3D notification hidden')
    } else {
      showCube()
      addMessage('3D notification shown')
    }
  }

  // Show a test notification
  const handleShowTestNotification = () => {
    showTransactionNotification(
      'TEST NOTIFICATION',
      'This is a test notification',
      { details: 'Testing the notification system' }
    )
    addMessage('Test notification shown')
  }

  // Show a test prediction market notification
  const handleShowPrediction = () => {
    showPredictionNotification(
      'PREDICTION MARKET',
      'Blaze Protocol signature request',
      { details: 'Market: Will ETH reach $5000 by EOY?' }
    )
    addMessage('Prediction notification shown')
  }

  // Handle approval of notification (for prediction markets)
  const handleApprove = () => {
    if (currentNotification) {
      addMessage(`Approved: ${currentNotification.title}`)

      // Generate mock transaction data
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 42)}`;
      const mockSignature = `0x${Math.random().toString(16).substring(2, 130)}`;
      const mockReceiptId = `receipt-${Date.now()}`;

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
      };

      // Send enhanced notification response message back to dapp
      window.postMessage(enhancedResponse, '*');

      handleDismissPanel()
    }
  }

  // Handle rejection of notification (for prediction markets)
  const handleReject = () => {
    if (currentNotification) {
      addMessage(`Rejected: ${currentNotification.title}`)

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
      };

      // Send enhanced notification response message back to dapp
      window.postMessage(enhancedRejection, '*');

      handleDismissPanel()
    }
  }

  // No render if invisible - show minimized toggle button
  if (!visible) {
    return (
      <motion.div
        className="signet-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          top: '16px',
          left: '16px',
          background: `rgba(13, 17, 23, 0.7)`,
          backdropFilter: 'blur(4px)',
          border: `1px solid ${colors.cyber}`,
          color: colors.cyber,
          borderRadius: '4px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: `0 0 10px ${colors.cyber}44, 0 0 20px ${colors.cyber}22`,
          pointerEvents: 'auto' // Make it clickable
        }}
        onClick={() => setVisible(true)}
        whileHover={{
          boxShadow: `0 0 15px ${colors.cyber}66, 0 0 25px ${colors.cyber}44`,
          scale: 1.05
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            boxShadow: ['0 0 2px rgba(125, 249, 255, 0.8)', '0 0 8px rgba(125, 249, 255, 0.8)', '0 0 2px rgba(125, 249, 255, 0.8)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors.cyber,
            marginRight: '4px'
          }}
        />
        S
      </motion.div>
    )
  }

  return (
    <div className="signet-container signet-scrollbar" style={{ pointerEvents: 'none' }}>
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

      {/* Main Control Panel - Top Left */}
      <motion.div
        className="signet-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: '32px',
          left: '20px',
          width: '320px',
          background: `linear-gradient(180deg, ${colors.spaceBlack} 0%, ${colors.spaceVoid} 100%)`,
          borderRadius: '6px',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          zIndex: 999999,
          border: `1px solid rgba(125, 249, 255, 0.3)`,
          boxShadow: `0 0 15px rgba(0, 0, 0, 0.7), 0 0 5px ${colors.cyber}22`,
          pointerEvents: 'auto' // Enable pointer events for the panel
        }}
      >
        {/* Header */}
        <PanelHeader title="SIGNET CONTROLLER" onClose={() => setVisible(false)} />

        {/* Body */}
        <div style={{
          padding: '16px',
          color: colors.white,
          position: 'relative'
        }}>
          {/* Button row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <ActionButton
              label="LOG MESSAGE"
              color={colors.neonGreen}
              onClick={handleAddTestMessage}
            />

            <ActionButton
              label={showCubeNotification ? 'HIDE 3D' : 'SHOW 3D'}
              color={showCubeNotification ? colors.neonPink : colors.cyber}
              active={showCubeNotification}
              animated={true}
              onClick={handleToggle3D}
            />

            <ActionButton
              label="TEST NOTIFY"
              color={colors.neonOrange}
              onClick={handleShowTestNotification}
            />

            <ActionButton
              label="TEST PREDICT"
              color={colors.neonPurple}
              onClick={handleShowPrediction}
            />
          </div>

          {/* Message log */}
          <MessageLog
            messages={messages}
            expanded={isLogExpanded}
            onToggleExpand={setIsLogExpanded}
          />
        </div>

        {/* Footer */}
        <PanelFooter />
      </motion.div>

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