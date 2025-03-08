/**
 * ActionPanel component - displays dapp communication buttons
 * Now uses the useSignet hook directly for state and actions
 */

import { colors } from '../../shared/styles/theme'
import ActionButton from '../../shared/ui/ActionButton'
import { useSignet } from '../../shared/hooks/useSignet'
import { ExtensionMessageType } from '../../shared/types/signet'

export function ActionPanel() {
  // Access state and actions directly from the context
  const {
    showCubeNotification,
    showCube,
    hideCube,
    showTransactionNotification,
    showPredictionNotification,
    send
  } = useSignet()

  // Action handlers
  const handleAddTestMessage = () => {
    send('system', `Test message at ${new Date().toLocaleTimeString()}`)
  }

  const handleToggle3D = () => {
    if (showCubeNotification) {
      hideCube()
      send('system', '3D notification hidden')
    } else {
      showCube()
      send('system', '3D notification shown')
    }
  }

  const handleShowTestNotification = () => {
    showTransactionNotification(
      'TEST NOTIFICATION',
      'This is a test notification',
      { details: 'Testing the notification system' }
    )
    send('system', 'Test notification shown')
  }

  const handleShowPrediction = () => {
    showPredictionNotification(
      'PREDICTION MARKET',
      'Blaze Protocol signature request',
      { details: 'Market: Will ETH reach $5000 by EOY?' }
    )
    send('system', 'Prediction notification shown')
  }
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '4px',
      padding: '8px',
      borderLeft: '2px solid rgba(125, 249, 255, 0.4)'
    }}>
      <h4 style={{
        width: '100%',
        margin: '0 0 6px 0',
        fontSize: '12px',
        color: colors.cyber,
        fontWeight: 'normal'
      }}>
        DAPP COMMUNICATION
      </h4>

      {/* Button row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px'
      }}>
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

        <ActionButton
          label="TEST MSG"
          color={colors.neonGreen}
          onClick={handleAddTestMessage}
        />
      </div>
    </div>
  )
}