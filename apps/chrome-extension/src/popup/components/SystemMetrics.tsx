/**
 * SystemMetrics component for the extension popup
 * Displays bottom control bar with system information and action buttons
 */

import { motion } from "framer-motion"
import { colors } from "../../shared/styles/theme"
import { useSignetContext } from "~shared/context/SignetContext"

export function SystemMetrics() {
  // Get state and actions from the context
  const { status, refreshStatus, isLoading, refreshBalances, mineAllPendingBlocks } = useSignetContext();

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
      .map(subnetStatus => subnetStatus.lastProcessedBlock || 0);
    return blocks.length > 0 ? Math.max(...blocks) : 0;
  };

  // Calculate metrics based on real data
  const txQueueSize = countPendingTx();
  const blockHeight = getHighestBlock();
  const subnetCount = status ? Object.keys(status).length : 0;

  // Format subnet version string
  const subnetVersions = status
    ? Object.values(status).map(s => s.subnet.split('.')[1]).join(', ')
    : 'NA';

  // Truncate if too long
  const subnetVersion = subnetCount > 2
    ? `${subnetCount} SUBNETS`
    : subnetVersions;

  // Handle refresh click
  const handleRefreshClick = () => {
    refreshStatus();
    refreshBalances();
  };

  // Handle mine click when transactions are pending
  const handleMineClick = () => {
    if (txQueueSize > 0) {
      mineAllPendingBlocks();
    }
  };

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
      {/* System readout with real metrics */}
      <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)' }}>
        {/* <div>SUBNET: {subnetVersion}</div>
        <div>BLOCK: #{blockHeight || 'SYNC'}</div> */}
      </div>

      {/* Control buttons with real actions */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {/* Refresh button */}
        <motion.button
          onClick={handleRefreshClick}
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
          <motion.div
            animate={isLoading ? {
              rotate: [0, 360]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: isLoading ? Infinity : 0,
              ease: "linear"
            }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#7DF9FF',
              boxShadow: '0 0 4px #7DF9FF'
            }}
          />
          SYNC
        </motion.button>

        {/* Mine transactions button - only active when transactions are pending */}
        <motion.button
          onClick={handleMineClick}
          whileHover={txQueueSize > 0 ? { scale: 1.05, boxShadow: '0 0 8px rgba(125, 249, 255, 0.8)' } : {}}
          whileTap={txQueueSize > 0 ? { scale: 0.95 } : {}}
          style={{
            background: txQueueSize > 0
              ? 'rgba(125, 249, 255, 0.15)'
              : 'rgba(125, 249, 255, 0.05)',
            border: `1px solid ${txQueueSize > 0
              ? 'rgba(125, 249, 255, 0.4)'
              : 'rgba(125, 249, 255, 0.2)'}`,
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '10px',
            color: txQueueSize > 0 ? '#7DF9FF' : 'rgba(125, 249, 255, 0.4)',
            cursor: txQueueSize > 0 ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: txQueueSize > 0 ? 1 : 0.7
          }}
        >
          {/* Status indicator dot with activity animation based on queue size */}
          <motion.div
            animate={txQueueSize > 0
              ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
                boxShadow: [
                  '0 0 2px rgba(125, 249, 255, 0.8)',
                  '0 0 6px rgba(125, 249, 255, 0.8)',
                  '0 0 2px rgba(125, 249, 255, 0.8)'
                ]
              }
              : { opacity: 0.5 }
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              // Speed up animation as queue grows
              repeatDelay: Math.max(0, 0.5 - (txQueueSize / 40))
            }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: txQueueSize > 0 ? '#7DF9FF' : 'rgba(125, 249, 255, 0.4)',
              boxShadow: txQueueSize > 0 ? '0 0 4px #7DF9FF' : 'none'
            }}
          />
          {/* Button label showing transaction count */}
          <span style={{ display: 'flex', alignItems: 'center' }}>
            MINE {txQueueSize > 0 ? `(${txQueueSize})` : ''}
          </span>
        </motion.button>
      </div>
    </div>
  );
}