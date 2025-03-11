import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { colors, keyframes } from '../styles/theme'
import type { Message } from 'signet-sdk/src/messaging';
import { MessageType } from 'signet-sdk/src/messaging';

// Helper function to format a timestamp
const formatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return '00:00:00';
  }
};

// Helper function to get color based on message type
const getMessageColor = (msg: Message): string => {
  if (!msg.type) return colors.white;

  switch (msg.type) {
    case MessageType.ERROR:
      return colors.neonRed;
    case MessageType.CHECK_EXTENSION_INSTALLED:
      return colors.neonGreen;
    case MessageType.GET_STATUS:
      return colors.neonOrange;
    case MessageType.LOG:
      return colors.white;
    default:
      return colors.cyber;
  }
};

// Helper function to truncate long strings
const truncate = (str: string, length: number = 50): string => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// Helper function to format data object into a string
const formatData = (data: any): string => {
  if (!data) return '';

  try {
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      // Handle special case for common data shapes
      if (data.installed !== undefined) {
        return `installed: ${data.installed}${data.version ? `, version: ${data.version}` : ''}`;
      }
      if (data.connected !== undefined) {
        return `connected: ${data.connected}${data.activeSubnet ? `, subnet: ${data.activeSubnet}` : ''}`;
      }

      // Default object formatter
      return truncate(JSON.stringify(data));
    }
    return String(data);
  } catch (error) {
    return '[Error formatting data]';
  }
};

interface MessageLogProps {
  messages: Message[]
  maxHeight?: number
  expanded?: boolean
  onToggleExpand?: (expanded: boolean) => void
  showDetailedView?: boolean
}

/**
 * Displays log messages with cyberpunk styling
 */
export default function MessageLog({
  messages,
  maxHeight = 280,
  expanded: initialExpanded = false,
  onToggleExpand,
  showDetailedView = false
}: MessageLogProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (onToggleExpand) {
      onToggleExpand(newExpanded);
    }
  };

  const handleMessageClick = (msg: Message) => {
    if (showDetailedView) {
      setSelectedMessage(selectedMessage?.id === msg.id ? null : msg);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        className="signet-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          background: 'rgba(1, 4, 9, 0.9)',
          border: '1px solid rgba(125, 249, 255, 0.3)',
          borderRadius: '6px',
          padding: '12px',
          height: '100%',
          maxHeight: maxHeight,
          overflowY: 'auto',
          position: 'relative'
        }}
        ref={containerRef}
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

        {/* Log Title removed - will be provided by parent component */}

        {/* Add padding at the top to make room for the header */}
        <div style={{ paddingTop: '30px' }}></div>

        {messages.length === 0 ? (
          <div style={{
            color: colors.steel,
            fontFamily: 'monospace',
            fontSize: '11px',
            padding: '10px',
            textAlign: 'center',
            background: 'rgba(125, 249, 255, 0.05)',
            borderRadius: '4px',
            border: '1px dashed rgba(125, 249, 255, 0.1)'
          }}>
            No messages intercepted yet...
            <div style={{ fontSize: '10px', marginTop: '4px', color: colors.steel }}>
              Messages will appear here when SDK communication occurs
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id || index}>
              <motion.div
                whileHover={{ backgroundColor: 'rgba(125, 249, 255, 0.06)' }}
                onClick={() => handleMessageClick(msg)}
                style={{
                  padding: '6px 8px',
                  margin: '3px 0',
                  borderRadius: '4px',
                  borderLeft: `2px solid ${getMessageColor(msg)}80`,
                  background: selectedMessage?.id === msg.id ? 'rgba(125, 249, 255, 0.1)' : 'transparent',
                  cursor: showDetailedView ? 'pointer' : 'default',
                  transition: 'background 0.15s ease'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    color: getMessageColor(msg),
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    gap: '8px'
                  }}
                >
                  {/* Message direction indicator */}
                  <div style={{
                    minWidth: '40px',
                    color: msg.request ? colors.neonOrange : colors.neonGreen,
                    fontSize: '9px',
                    background: msg.request ? 'rgba(255, 149, 0, 0.1)' : 'rgba(54, 199, 88, 0.1)',
                    padding: '1px 4px',
                    borderRadius: '2px',
                    textAlign: 'center'
                  }}>
                    {msg.request ? "→ REQ" : (msg.response ? "← RES" : "EVENT")}
                  </div>

                  {/* Message type */}
                  <div style={{ flex: 1, fontWeight: 'bold' }}>
                    {msg.type}
                  </div>

                  {/* Timestamp */}
                  <div style={{
                    color: colors.steel,
                    fontSize: '9px',
                    opacity: 0.7
                  }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>

                {/* Message data */}
                <div style={{
                  marginTop: '3px',
                  color: colors.white,
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  whiteSpace: selectedMessage?.id === msg.id || isExpanded ? 'pre-wrap' : 'nowrap',
                  overflow: 'hidden',
                  textOverflow: selectedMessage?.id === msg.id || isExpanded ? 'clip' : 'ellipsis',
                  paddingLeft: '40px'
                }}>
                  {formatData(msg.data)}
                </div>

                {/* Display message details if expanded */}
                {selectedMessage?.id === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: '6px',
                      padding: '6px',
                      borderRadius: '4px',
                      background: 'rgba(1, 4, 9, 0.5)',
                      border: '1px solid rgba(125, 249, 255, 0.1)',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: colors.white
                    }}
                  >
                    <div style={{ marginBottom: '4px', color: colors.cyber, fontSize: '9px' }}>
                      ID: {msg.id}
                    </div>
                    <pre style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}>
                      {JSON.stringify(msg, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))
        )}
      </motion.div>

      {/* Removed expand/collapse toggle button */}

      {/* Add style for the scrollbar */}
      <style>{`
        .signet-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .signet-scrollbar::-webkit-scrollbar-track {
          background: rgba(1, 4, 9, 0.5);
          border-radius: 3px;
        }
        .signet-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(125, 249, 255, 0.3);
          border-radius: 3px;
        }
        .signet-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(125, 249, 255, 0.5);
        }
      `}</style>
    </div>
  );
}