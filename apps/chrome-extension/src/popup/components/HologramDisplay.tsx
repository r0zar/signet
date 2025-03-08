/**
 * HologramDisplay component for the extension popup
 * Displays a 3D holographic visualization
 * Now uses the useSignet hook directly for state
 */

import { motion } from "framer-motion"
import { colors } from "../../shared/styles/theme"
import { useSignet } from "../../shared/hooks/useSignet"

export function HologramDisplay() {
  // Get state directly from the hook
  const { systemStatus, nodeStatus } = useSignet()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      style={{
        background: 'rgba(13, 17, 23, 0.6)',
        border: '1px solid rgba(125, 249, 255, 0.3)',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Panel border effect - top */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #7DF9FF 50%, transparent 100%)',
          opacity: 0.8
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)'
          }}
        />
      </motion.div>

      {/* 3D Hologram placeholder */}
      <div style={{
        margin: '20px auto',
        width: '120px',
        height: '120px',
        position: 'relative'
      }}>
        <motion.div
          animate={{
            rotateY: [0, 360],
            boxShadow: [
              '0 0 15px rgba(125, 249, 255, 0.5)',
              '0 0 25px rgba(125, 249, 255, 0.7)',
              '0 0 15px rgba(125, 249, 255, 0.5)'
            ]
          }}
          transition={{
            rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
            boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(125, 249, 255, 0.2) 0%, rgba(13, 17, 23, 0.2) 100%)',
            border: '1px solid rgba(125, 249, 255, 0.6)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            animate={{
              rotateX: [0, 360],
              rotateZ: [0, -360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              width: '70%',
              height: '70%',
              borderRadius: '2px',
              background: 'radial-gradient(circle, rgba(125, 249, 255, 0.1) 0%, rgba(125, 249, 255, 0.4) 100%)',
              border: '1px solid rgba(125, 249, 255, 0.6)',
              boxShadow: '0 0 15px rgba(125, 249, 255, 0.5)',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '1px',
              background: 'rgba(125, 249, 255, 0.8)',
              transform: 'translate(-50%, -50%)'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1px',
              height: '100%',
              background: 'rgba(125, 249, 255, 0.8)',
              transform: 'translate(-50%, -50%)'
            }} />
          </motion.div>
        </motion.div>

        {/* Scanning lines effect */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(125, 249, 255, 0.8) 50%, transparent 100%)',
            boxShadow: '0 0 5px rgba(125, 249, 255, 0.8)'
          }}
        />
      </div>

      {/* Status data */}
      <div style={{
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px'
      }}>
        <div>STATUS: {nodeStatus === 'active' ? 'ACTIVE' : 
                       nodeStatus === 'starting' ? 'STARTING' : 'STOPPED'}</div>
        <div>POWER: {systemStatus.power}%</div>
        <div>SHIELD: {systemStatus.shield}%</div>
      </div>
    </motion.div>
  );
}