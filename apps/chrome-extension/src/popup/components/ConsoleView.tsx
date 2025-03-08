/**
 * ConsoleView component for the extension popup
 * Displays a terminal/console with log messages
 * Now uses the useSignet hook directly for state
 */

import { motion } from "framer-motion"
import { useSignet } from "../../shared/hooks/useSignet"

export function ConsoleView() {
  // Get state directly from the hook
  const { displayText } = useSignet()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      style={{
        background: 'rgba(1, 4, 9, 0.8)',
        border: '1px solid rgba(125, 249, 255, 0.3)',
        borderRadius: '6px',
        padding: '12px',
        position: 'relative',
        height: '100px',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {/* Panel border effect - shimmer at top */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(125, 249, 255, 0.6) 50%, transparent 100%)',
          opacity: 0.6
        }}
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '30%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)'
          }}
        />
      </motion.div>

      {/* Panel detail - "circuit" lines */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '6px',
        width: '25px',
        height: '30px',
        zIndex: 2
      }}>
        <div style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          width: '2px',
          height: '100%',
          background: 'rgba(125, 249, 255, 0.15)'
        }} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '0px',
          width: '10px',
          height: '2px',
          background: 'rgba(125, 249, 255, 0.15)'
        }} />
        <div style={{
          position: 'absolute',
          top: '18px',
          right: '0px',
          width: '15px',
          height: '2px',
          background: 'rgba(125, 249, 255, 0.15)'
        }} />
        <div style={{
          position: 'absolute',
          top: '28px',
          right: '0px',
          width: '5px',
          height: '2px',
          background: 'rgba(125, 249, 255, 0.15)'
        }} />
      </div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(125, 249, 255, 0.03) 0px, rgba(125, 249, 255, 0.03) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none'
      }} />

      <pre style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7DF9FF',
        margin: 0,
        height: '100%',
        overflow: 'hidden'
      }}>
        {displayText}
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >_</motion.span>
      </pre>
    </motion.div>
  );
}