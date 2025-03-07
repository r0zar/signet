import { motion } from 'framer-motion'
import { colors } from '../../styles/theme'

interface PanelHeaderProps {
  title: string
  onClose: () => void
}

/**
 * Header component for panels with title and close button
 */
export default function PanelHeader({ title, onClose }: PanelHeaderProps) {
  return (
    <div style={{
      background: `linear-gradient(90deg, rgba(13, 17, 23, 0.8) 0%, rgba(125, 249, 255, 0.1) 50%, rgba(13, 17, 23, 0.8) 100%)`,
      padding: '10px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 0 rgba(125, 249, 255, 0.3)',
      position: 'relative'
    }}>
      {/* Header shimmer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${colors.cyber} 50%, transparent 100%)`,
        opacity: 0.8
      }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)'
          }}
        />
      </div>
      
      <div style={{
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        color: colors.white
      }}>
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
            marginRight: '8px'
          }}
        />
        <span style={{ color: colors.cyber }}>{title.split(' ')[0]}</span>{' '}
        {title.split(' ').slice(1).join(' ')}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: 'transparent',
          border: 'none',
          color: colors.white,
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px'
        }}
        onClick={onClose}
      >
        ×
      </motion.button>
    </div>
  )
}