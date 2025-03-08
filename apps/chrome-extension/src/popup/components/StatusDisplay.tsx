/**
 * StatusDisplay component for the extension popup
 * Shows the connection status with animated indicators
 * Now uses the useSignet hook directly for state
 */

import { motion } from "framer-motion"
import { colors } from "../../shared/styles/theme"
import { useSignet } from "../../shared/hooks/useSignet"

export function StatusDisplay() {
  // Get state directly from the hook instead of props
  const { systemStatus } = useSignet()
  
  return (
    <div style={{
      background: `linear-gradient(90deg, rgba(13, 17, 23, 0.8) 0%, rgba(125, 249, 255, 0.1) 50%, rgba(13, 17, 23, 0.8) 100%)`,
      padding: '8px 12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(125, 249, 255, 0.3)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <motion.div
          animate={{
            boxShadow: ['0 0 2px rgba(125, 249, 255, 0.8)', '0 0 8px rgba(125, 249, 255, 0.8)', '0 0 2px rgba(125, 249, 255, 0.8)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: colors.cyber,
          }}
        />
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.cyber }}>SIGNET</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>SIGNAL</span>
          <motion.div
            style={{
              width: '30px',
              height: '6px',
              background: 'linear-gradient(90deg, #7DF9FF 0%, #36C758 100%)',
              borderRadius: '3px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
              }}
            />
          </motion.div>
        </div>
        <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>PWR</span>
          <motion.div
            style={{
              width: '30px',
              height: '6px',
              background: 'linear-gradient(90deg, #DA2FB7 0%, #8C32C1 100%)',
              borderRadius: '3px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}