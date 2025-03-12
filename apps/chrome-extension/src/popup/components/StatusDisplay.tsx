/**
 * StatusDisplay component for the extension popup
 * Shows the connection status with animated indicators based on real metrics
 */

import { motion } from "framer-motion"
import { colors } from "../../shared/styles/theme"
import { useSignetContext } from "~shared/context/SignetContext"
import { useEffect, useState } from "react"

export function StatusDisplay() {
  // Get state from the context
  const { status, error, isLoading, refreshStatus } = useSignetContext();
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  // Auto-refresh status and timestamp
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      refreshStatus().catch(console.error);
      setTimestamp(new Date().toISOString());
    }, 5000);

    return () => clearInterval(refreshTimer);
  }, [refreshStatus]);

  // Helper function to count all pending transactions
  const countPendingTx = () => {
    if (!status) return 0;
    return Object.values(status).reduce(
      (total, subnetStatus) => total + (subnetStatus.txQueue?.length || 0),
      0
    );
  };

  // Helper function to get highest block number
  const getHighestBlock = () => {
    if (!status) return 0;
    const blocks = Object.values(status)
      .map(subnetStatus => 0);
    return blocks.length > 0 ? Math.max(...blocks) : 0;
  };

  // Calculate indicators based on real state
  const hasActiveSignal = status && Object.keys(status).length > 0;
  const txQueueSize = countPendingTx();
  const blockHeight = getHighestBlock();
  const subnetCount = status ? Object.keys(status).length : 0;

  // Calculate power level as a percentage based on txQueueSize (max 100)
  const powerPercent = Math.min(100, txQueueSize * 5); // 5% per tx, max 100%

  // Display loading text
  const statusText = isLoading ? "SYNCING" : error ? "ERROR" : "SIGNET";

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
            boxShadow: isLoading
              ? ['0 0 2px rgba(125, 249, 255, 0.8)', '0 0 8px rgba(125, 249, 255, 0.8)', '0 0 2px rgba(125, 249, 255, 0.8)']
              : error
                ? ['0 0 2px rgba(255, 78, 78, 0.8)', '0 0 8px rgba(255, 78, 78, 0.8)', '0 0 2px rgba(255, 78, 78, 0.8)']
                : ['0 0 2px rgba(125, 249, 255, 0.8)', '0 0 8px rgba(125, 249, 255, 0.8)', '0 0 2px rgba(125, 249, 255, 0.8)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: error ? '#FF4E4E' : colors.cyber,
          }}
        />
        <motion.span
          animate={{ opacity: isLoading ? [1, 0.5, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: '12px', fontWeight: 'bold', color: error ? '#FF4E4E' : colors.cyber }}
        >
          {statusText}
        </motion.span>
        {blockHeight > 0 && (
          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', marginLeft: '4px' }}>
            #{blockHeight}
          </span>
        )}
        {subnetCount > 0 && (
          <span style={{
            fontSize: '9px',
            color: 'rgba(54, 199, 88, 0.8)',
            background: 'rgba(54, 199, 88, 0.1)',
            padding: '1px 3px',
            borderRadius: '2px',
            marginLeft: '4px'
          }}>
            {subnetCount} subnet{subnetCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>TX</span>
          <div style={{ position: 'relative' }}>
            <motion.div
              style={{
                width: '30px',
                height: '6px',
                background: `linear-gradient(90deg, #7DF9FF 0%, ${hasActiveSignal ? '#36C758' : '#666666'} 100%)`,
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden',
                opacity: hasActiveSignal ? 1 : 0.5
              }}
            >
              {hasActiveSignal && (
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
              )}
            </motion.div>
            {txQueueSize > 0 && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-18px',
                fontSize: '8px',
                background: colors.cyber,
                color: '#000',
                padding: '1px 3px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                {txQueueSize}
              </span>
            )}
          </div>
        </div>
        <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>MEM</span>
          <motion.div
            style={{
              width: '30px',
              height: '6px',
              background: `linear-gradient(90deg, #DA2FB7 0%, ${powerPercent > 50 ? '#8C32C1' : '#666666'} 100%)`,
              borderRadius: '3px',
              position: 'relative',
              overflow: 'hidden',
              opacity: powerPercent > 0 ? 1 : 0.5
            }}
          >
            {powerPercent > 0 && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  // Speed up animation as power increases
                  repeatDelay: Math.max(0, 0.5 - (powerPercent / 200))
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}