/**
 * SystemMetrics component for the extension popup
 * Displays bottom control bar with system information and action buttons
 */

import { motion } from "framer-motion"
import { colors } from "../../shared/styles/theme"
import { useSignetContext } from "~shared/context/SignetContext"

export function SystemMetrics() {
  // Get state and actions from the context
  const { status, refreshStatus, isLoading, refreshBalances } = useSignetContext();

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
      </div>
    </div>
  );
}