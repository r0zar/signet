/**
 * MinimizedButton component - shown when SignetController is minimized
 * Now uses useSignet hook directly for state and actions
 */

import { motion } from 'framer-motion'
import { colors } from '../../shared/styles/theme'
import { useSignet } from '../../shared/hooks/useSignet'

export function MinimizedButton() {
  // Get setVisible from context
  const { setVisible } = useSignet()
  
  // Handle click to maximize
  const handleClick = () => setVisible(true)
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
      onClick={handleClick}
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