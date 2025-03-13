/**
 * ConsoleView component for the extension popup
 * Displays a terminal/console with transaction logs and subnet status
 */

import { motion } from "framer-motion"
import { useSignetContext } from "~shared/context/SignetContext"
import { useEffect, useState } from "react"

export function ConsoleView() {
  // Get state from the context
  const { messages, status, currentAccount, error } = useSignetContext();
  const [logText, setLogText] = useState<string[]>([]);

  // Update log text based on state changes
  useEffect(() => {
    const logs: string[] = ['SIGNET SUBNET MONITOR'];

    // Add version info
    logs.push('');

    // Check for connected subnets
    if (status && Object.keys(status).length > 0) {
      const subnetCount = Object.keys(status).length;
      logs.push(`[SYSTEM] Connected to ${subnetCount} subnet${subnetCount > 1 ? 's' : ''}`);

      // List each subnet
      Object.values(status).forEach(subnetStatus => {
        if (subnetStatus && subnetStatus.subnet) {
          const subnetName = subnetStatus.subnet.split('.')[1];
          logs.push(`  └─ ${subnetName}`);
        }
      });
    } else {
      logs.push('[SYSTEM] No subnets connected');
    }

    // Add signer info
    if (currentAccount && currentAccount.stxAddress) {
      logs.push(`[SIGNER] ${currentAccount.stxAddress.substring(0, 6)}...${currentAccount.stxAddress.substring(currentAccount.stxAddress.length - 4)}`);
    } else {
      logs.push('[SIGNER] No active signer');
    }

    // Count total pending transactions across all subnets
    const totalPendingTx = status
      ? Object.values(status).reduce((count, subnetStatus) => count + (subnetStatus.txQueue?.length || 0), 0)
      : 0;

    logs.push(`[MEMPOOL] ${totalPendingTx} transactions pending`);

    // Add error info if present
    if (error) {
      logs.push('');
      logs.push(`[ERROR] ${error}`);
    }

    // Add recent message logs (limit to last 3)
    if (messages && messages.length > 0) {
      logs.push('');
      logs.push('RECENT ACTIVITY:');

      const recentMessages = messages.slice(-3);
      recentMessages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString().split(' ')[0];
        logs.push(`[${time}] ${msg.type}: ${JSON.stringify(msg.data).substring(0, 30)}...`);
      });
    }

    setLogText(logs);
  }, [messages, status, currentAccount, error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      style={{
        background: 'rgba(1, 4, 9, 0.8)',
        border: '1px solid rgba(125, 249, 255, 0.3)',
        borderRadius: '2px',
        padding: '12px',
        position: 'relative',
        height: '110px',
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

      {/* Console text */}
      <div style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7DF9FF',
        margin: 0,
        height: '100%',
        overflow: 'auto',
        lineHeight: '1.4',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(125, 249, 255, 0.3) rgba(1, 4, 9, 0.5)'
      }}>
        {logText.map((line, index) => (
          <div key={index}>
            {line.startsWith('[ERROR]') ? (
              <span style={{ color: '#FF4E4E' }}>{line}</span>
            ) : line.startsWith('[SIGNER]') ? (
              <span style={{ color: '#36C758' }}>{line}</span>
            ) : line.includes('RECENT ACTIVITY:') ? (
              <span style={{ color: '#FFCC00' }}>{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >_</motion.span>
      </div>
    </motion.div>
  );
}