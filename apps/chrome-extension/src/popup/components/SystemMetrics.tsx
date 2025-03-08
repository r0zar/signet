/**
 * SystemMetrics component for the extension popup
 * Displays bottom control bar with system information and action buttons
 * Now uses the useSignet hook directly for state
 */

import { motion } from "framer-motion"
import { colors } from "../../shared/styles/theme"
import { useSignet } from "../../shared/hooks/useSignet"

export function SystemMetrics() {
  // Get state and actions directly from the hook
  const {
    nodeStatus,
    mempoolSize
  } = useSignet()

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(180deg, rgba(13, 17, 23, 0.9) 0%, #0D1117 100%)',
      padding: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid rgba(125, 249, 255, 0.3)',
      zIndex: 2
    }}>
      {/* System readout */}
      <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)' }}>
        <div>SYS: V0.1.0</div>
        <div>ENV: BROWSER</div>
      </div>

      {/* Control buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgba(125, 249, 255, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(125, 249, 255, 0.1)',
            border: '1px solid rgba(125, 249, 255, 0.4)',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '10px',
            color: '#7DF9FF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#7DF9FF',
            boxShadow: '0 0 4px #7DF9FF'
          }} />
          SCAN
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgba(125, 249, 255, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(125, 249, 255, 0.1)',
            border: '1px solid rgba(125, 249, 255, 0.4)',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '10px',
            color: nodeStatus === 'active' ? '#7DF9FF' :
              nodeStatus === 'starting' ? '#FFD700' : '#FF6347',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {/* Status indicator dot with pulse animation */}
          <motion.div
            animate={nodeStatus === 'active'
              ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
                boxShadow: [
                  '0 0 2px rgba(125, 249, 255, 0.8)',
                  '0 0 6px rgba(125, 249, 255, 0.8)',
                  '0 0 2px rgba(125, 249, 255, 0.8)'
                ]
              }
              : nodeStatus === 'starting'
                ? { opacity: [0.4, 0.8, 0.4] }
                : { opacity: 0.5 }
            }
            transition={{
              duration: nodeStatus === 'active' ? 2 : 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: nodeStatus === 'active' ? '#7DF9FF' :
                nodeStatus === 'starting' ? '#FFD700' : '#FF6347',
              boxShadow: nodeStatus === 'active' ? '0 0 4px #7DF9FF' : 'none'
            }}
          />
          {/* Button label with mempool info */}
          <span style={{ display: 'flex', alignItems: 'center' }}>
            BLAZE {mempoolSize > 0 ? `(${mempoolSize})` : ''}
          </span>
        </motion.button>
      </div>
    </div>
  );
}