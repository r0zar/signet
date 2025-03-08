import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '~shared/styles/theme'

interface MessageLogProps {
  messages: string[]
  maxHeight?: number
  expanded?: boolean
  onToggleExpand?: (expanded: boolean) => void
}

/**
 * Displays log messages with cyberpunk styling
 */
export default function MessageLog({
  messages,
  maxHeight = 65,
  expanded: initialExpanded = false,
  onToggleExpand
}: MessageLogProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    if (onToggleExpand) {
      onToggleExpand(newExpanded)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        className="signet-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          background: 'rgba(1, 4, 9, 0.8)',
          border: '1px solid rgba(125, 249, 255, 0.3)',
          borderRadius: '6px',
          padding: '8px',
          maxHeight: isExpanded ? maxHeight * 2.3 : maxHeight,
          overflowY: 'auto',
          position: 'relative',
          transition: 'max-height 0.3s ease-in-out'
        }}
      >
        {/* Top shimmer for message log */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1px',
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

        {/* CRT scan lines effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'repeating-linear-gradient(0deg, rgba(125, 249, 255, 0.03) 0px, rgba(125, 249, 255, 0.03) 1px, transparent 1px, transparent 2px)',
          pointerEvents: 'none'
        }} />

        {messages.length === 0 ? (
          <div style={{
            color: colors.steel,
            fontFamily: 'monospace',
            fontSize: '10px',
            padding: '3px'
          }}>
            No messages yet...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                padding: '3px 0',
                borderBottom: index === messages.length - 1 ? 'none' : `1px solid rgba(140, 156, 168, 0.1)`,
                color: colors.white,
                fontFamily: 'monospace',
                fontSize: '10px',
                whiteSpace: isExpanded ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: isExpanded ? 'clip' : 'ellipsis'
              }}
            >
              {msg}
            </div>
          ))
        )}
      </motion.div>

      {/* Expand/collapse toggle button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          width: '16px',
          height: '16px',
          backgroundColor: `rgba(13, 17, 23, 0.9)`,
          border: `1px solid ${colors.cyber}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '8px',
          color: colors.cyber,
          zIndex: 1
        }}
      >
        {isExpanded ? '▲' : '▼'}
      </motion.div>
    </div>
  )
}