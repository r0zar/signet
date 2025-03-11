/**
 * IronmanHUD component for the extension popup
 * Displays an advanced HUD-style terminal interface with real-time blockchain data
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../../shared/styles/theme";
import { useSignetContext } from "~shared/context/SignetContext";

// Random character set for glitch effects
const glitchCharacters = "!@#$%^&*()_+-=[]{}|;:,./<>?`~";

// Generate random string for terminal glitch effect
const getRandomString = (length: number) => {
  return Array.from({ length }, () =>
    glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)]
  ).join('');
};

// HUD section component
const HUDSection = ({
  title,
  value,
  color = "rgba(125, 249, 255, 0.8)",
  position,
  width,
  height,
  glitchIntensity = 0.05,
  children
}) => {
  const [glitchText, setGlitchText] = useState("");
  const [showGlitch, setShowGlitch] = useState(false);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < glitchIntensity) {
        setGlitchText(getRandomString(value?.toString().length || 5));
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [value, glitchIntensity]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute',
        ...position,
        width,
        height,
        border: `1px solid ${color}`,
        borderRadius: '2px',
        padding: '4px',
        overflow: 'hidden',
        backdropFilter: 'blur(2px)'
      }}
    >

      {/* Background hex pattern */}
      <HexPattern color={color} />

      {/* Section header */}
      <div style={{
        borderBottom: `1px solid ${color}`,
        fontSize: '8px',
        fontWeight: 'bold',
        color: color,
        padding: '2px 4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'monospace'
      }}>
        <span>{title}</span>
        {/* Radar blip animation */}
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: '6px' }}
        >●</motion.span>
      </div>

      {/* Section content */}
      <div style={{
        padding: '4px',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'monospace',
        letterSpacing: '0.5px',
        height: 'calc(100% - 16px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {children || (
          <div style={{ textAlign: 'center' }}>
            <span style={{
              color: color,
              fontSize: '12px',
              fontWeight: 'bold',
              position: 'relative'
            }}>
              {showGlitch ? glitchText : value}
              {/* Text shadow effect */}
              <motion.span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'rgba(255, 0, 0, 0.5)',
                  clipPath: 'inset(0 0 0 0)',
                  filter: 'blur(0.5px)'
                }}
                animate={{
                  x: ['-1px', '1px', '-1px'],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut'
                }}
              >
                {showGlitch ? glitchText : value}
              </motion.span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Scan line effect component
const ScanLine = () => (
  <motion.div
    animate={{
      y: ['0%', '100%'],
      opacity: [0.1, 0.2, 0.1]
    }}
    transition={{
      y: { duration: 2, repeat: Infinity, ease: 'linear' },
      opacity: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    }}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '2px',
      background: 'rgba(125, 249, 255, 0.2)',
      zIndex: 100,
      pointerEvents: 'none'
    }}
  />
);

// Hexagon background pattern
const HexPattern = ({ color }) => {
  const hexSize = 16;
  const rows = 12
  const cols = 12;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.05,
      zIndex: 0
    }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const offsetX = row % 2 === 0 ? 0 : hexSize / 2;

        return (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              borderColor: [color, color.replace('0.8', '0.6'), color]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.01,
              repeat: Infinity
            }}
            style={{
              position: 'absolute',
              left: `${col * hexSize + offsetX}px`,
              top: `${row * (hexSize * 0.75)}px`,
              width: `${hexSize - 2}px`,
              height: `${hexSize - 2}px`,
              borderRadius: '1px',
              border: `1px solid ${color.replace('0.8', '0.3')}`,
              transform: 'rotate(45deg)'
            }}
          />
        );
      })}
    </div>
  );
};

// Memory bar component
const MemoryBar = ({ value, color, max = 100 }) => {
  const percent = (value / max) * 100;

  return (
    <div style={{
      width: '100%',
      height: '6px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '2px'
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5 }}
        style={{
          height: '100%',
          background: color,
          boxShadow: `0 0 4px ${color}`
        }}
      />
    </div>
  );
};

// Main HUD component
export function HologramDisplay() {
  // Get state from the context
  const { status, signer, isLoading, error } = useSignetContext();

  // Function to count all pending transactions across subnets
  const countPendingTx = () => {
    if (!status) return 0;
    return Object.values(status).reduce(
      (total, subnetStatus) => total + (subnetStatus.txQueue?.length || 0),
      0
    );
  };

  // Function to get the highest block from any subnet
  const getHighestBlock = () => {
    if (!status) return 0;
    const blocks = Object.values(status)
      .map(subnetStatus => subnetStatus.lastProcessedBlock || 0);
    return blocks.length > 0 ? Math.max(...blocks) : 0;
  };

  // Calculate metrics based on real data
  const txQueueSize = countPendingTx();
  const blockHeight = getHighestBlock();

  // Calculate sync progress (0-100%)
  const syncProgress = blockHeight ? Math.min(100, Math.max(1, Math.log10(blockHeight) * 25)) : 0;

  // Calculate transaction load (0-100%)
  const txLoad = Math.min(100, txQueueSize * 5); // Each transaction = 5% load up to 100%

  // Count connected subnets
  const subnetCount = status ? Object.keys(status).length : 0;

  // Function to get all pending transactions from all subnets
  const getAllPendingTransactions = () => {
    if (!status) return [];

    // Gather transactions from all subnets
    const allTxs = [];
    Object.entries(status).forEach(([subnetId, subnetStatus]) => {
      const txQueue = subnetStatus.txQueue || [];
      // Add subnet info to each transaction
      txQueue.forEach(tx => {
        allTxs.push({
          ...tx,
          ...tx.data,
          subnet: subnetStatus.subnet
        });
      });
    });

    // Sort by nonce descending (most recent first)
    return allTxs.sort((a, b) => b.nonce - a.nonce);
  };

  // Determine node status
  const nodeStatus = error ? 'ERROR' :
    !status || subnetCount === 0 ? 'OFFLINE' :
      isLoading ? 'SYNCING' :
        txQueueSize > 0 ? 'ACTIVE' : 'IDLE';

  // Determine display color based on status
  const displayColor = error ? 'rgba(255, 78, 78, 0.8)' : // Red for error
    isLoading ? 'rgba(255, 204, 0, 0.8)' : // Yellow for loading
      'rgba(125, 249, 255, 0.8)'; // Cyan for normal

  // Active signer color
  const signerColor = signer ? 'rgba(54, 199, 88, 0.8)' : 'rgba(125, 249, 255, 0.4)';

  // Data metrics
  const metrics = [
    {
      label: "BLOCKS",
      value: blockHeight.toString().padStart(6, '0'),
      color: 'rgba(125, 249, 255, 0.8)'
    },
    {
      label: "SUBNETS",
      value: subnetCount.toString(),
      color: subnetCount > 0 ? 'rgba(54, 199, 88, 0.8)' : 'rgba(255, 78, 78, 0.8)'
    },
    {
      label: "TX COUNT",
      value: txQueueSize.toString().padStart(3, '0'),
      color: txQueueSize > 0 ? 'rgba(255, 204, 0, 0.8)' : 'rgba(125, 249, 255, 0.8)'
    },
    {
      label: "STATUS",
      value: nodeStatus,
      color: nodeStatus === 'ERROR' ? 'rgba(255, 78, 78, 0.8)' :
        nodeStatus === 'SYNCING' ? 'rgba(255, 204, 0, 0.8)' :
          nodeStatus === 'ACTIVE' ? 'rgba(54, 199, 88, 0.8)' :
            'rgba(125, 249, 255, 0.8)'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      style={{
        background: 'rgba(8, 12, 18, 0.85)',
        // border: `1px solid ${displayColor.replace('0.8', '0.4')}`,
        borderRadius: '2px',
        padding: '0px',
        paddingBottom: '4px',
        marginBottom: '0px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        height: '220px', // Reduced height since we removed the system log
        boxShadow: `0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 8px ${displayColor.replace('0.8', '0.2')}`
      }}
    >

      {/* Scan line effect */}
      <ScanLine />

      {/* Status bar at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '16px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderBottom: `1px solid ${displayColor.replace('0.8', '0.4')}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        fontSize: '8px',
        color: displayColor,
        fontFamily: 'monospace',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >SIGNET</motion.span>
          <span>v1.0</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {metrics.map((metric, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{metric.label}:</span>
              <motion.span
                style={{ color: metric.color }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {metric.value}
              </motion.span>
            </div>
          ))}
        </div>
      </div>

      {/* Main HUD sections */}
      <div style={{
        position: 'relative',
        margin: '20px 0 0 0',
        height: 'calc(100% - 20px)',
        padding: '2px'
      }}>
        {/* Network Status Section */}
        <HUDSection
          title="NETWORK STATUS"
          value={nodeStatus}
          color={displayColor}
          position={{ top: '4px', left: '5px' }}
          width="45%"
          height="38%"
          glitchIntensity={0.03}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '8px' }}>NODE:</span>
                <span style={{
                  color: nodeStatus === 'ERROR' ? 'rgba(255, 78, 78, 0.8)' :
                    nodeStatus === 'SYNCING' ? 'rgba(255, 204, 0, 0.8)' :
                      nodeStatus === 'ACTIVE' ? 'rgba(54, 199, 88, 0.8)' :
                        'rgba(125, 249, 255, 0.8)',
                  fontWeight: 'bold',
                  fontSize: '8px'
                }}>
                  {nodeStatus}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '8px' }}>SYNC:</span>
                <span style={{
                  color: syncProgress > 75 ? 'rgba(54, 199, 88, 0.8)' :
                    syncProgress > 25 ? 'rgba(255, 204, 0, 0.8)' :
                      'rgba(125, 249, 255, 0.8)',
                  fontWeight: 'bold',
                  fontSize: '8px'
                }}>
                  {Math.round(syncProgress)}%
                </span>
              </div>
            </div>

            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '8px' }}>SYNC PROGRESS:</span>
              <MemoryBar
                value={syncProgress}
                color={syncProgress > 75 ? 'rgba(54, 199, 88, 0.8)' :
                  syncProgress > 25 ? 'rgba(255, 204, 0, 0.8)' :
                    'rgba(125, 249, 255, 0.8)'}
              />
            </div>
          </div>
        </HUDSection>

        {/* Blockchain Stats Section */}
        <HUDSection
          title="BLOCKCHAIN STATS"
          value={`${blockHeight}`}
          color={displayColor}
          position={{ top: '4px', right: '5px' }}
          width="45%"
          height="38%"
          glitchIntensity={0.02}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '8px' }}>CURRENT BLOCK:</span>
                <motion.span
                  style={{ color: displayColor, fontWeight: 'bold', fontSize: '8px' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  #{blockHeight}
                </motion.span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '8px' }}>TX LOAD:</span>
                <span style={{
                  color: txLoad > 75 ? 'rgba(255, 78, 78, 0.8)' :
                    txLoad > 25 ? 'rgba(255, 204, 0, 0.8)' :
                      'rgba(54, 199, 88, 0.8)',
                  fontWeight: 'bold',
                  fontSize: '8px'
                }}>
                  {Math.round(txLoad)}%
                </span>
              </div>
            </div>

            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '8px' }}>MEMPOOL LOAD:</span>
              <MemoryBar
                value={txLoad}
                color={txLoad > 75 ? 'rgba(255, 78, 78, 0.8)' :
                  txLoad > 25 ? 'rgba(255, 204, 0, 0.8)' :
                    'rgba(54, 199, 88, 0.8)'}
              />
            </div>
          </div>
        </HUDSection>

        {/* Transaction Log Section */}
        <HUDSection
          title="TRANSACTION LOG"
          value=""
          color={txQueueSize > 0 ? 'rgba(255, 204, 0, 0.8)' : displayColor}
          position={{ bottom: '5px', left: '5px' }}
          width="45%"
          height="45%"
          glitchIntensity={0.03}
        >
          <div style={{
            overflowY: 'hidden',
            height: '100%',
            fontSize: '8px',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {txQueueSize > 0 ? (
              <div>
                {/* Collect transactions from all subnets and show the latest */}
                {getAllPendingTransactions().slice(0, 3).map((tx, i) => (
                  <div key={i} style={{ marginBottom: '2px' }}>
                    <div style={{
                      color:
                        tx.type === 'transfer' ? 'rgba(54, 199, 88, 0.8)' :
                          tx.type === 'predict' ? 'rgba(255, 204, 0, 0.8)' :
                            'rgba(125, 249, 255, 0.8)',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{tx.type.toUpperCase()} #{tx.nonce}</span>
                      <span style={{
                        fontSize: '6px',
                        color: 'rgba(255, 204, 0, 0.6)',
                        alignSelf: 'center'
                      }}>
                        {tx.subnet.split('.')[1]}
                      </span>
                    </div>
                    <div style={{ fontSize: '7px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {tx.type === 'transfer' ?
                        `${tx.signer.slice(0, 4)}...${tx.signer.slice(-4)} → ${tx.to.slice(0, 4)}...${tx.to.slice(-4)}` :
                        tx.type === 'predict' ?
                          `Market: ${tx.marketId}, Outcome: ${tx.outcomeId}` :
                          'Claim Reward'
                      }
                    </div>
                  </div>
                ))}
                {txQueueSize > 3 && (
                  <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '7px', marginTop: '2px' }}>
                    + {txQueueSize - 3} more pending...
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(125, 249, 255, 0.5)'
              }}>
                No pending transactions
              </div>
            )}
          </div>
        </HUDSection>

        {/* Wallet Section */}
        <HUDSection
          title="WALLET STATUS"
          value=""
          color={signerColor}
          position={{ bottom: '5px', right: '5px' }}
          width="45%"
          height="45%"
          glitchIntensity={0.02}
        >
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {signer ? (
              <div>
                <div style={{
                  fontSize: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'rgba(54, 199, 88, 0.8)',
                  marginBottom: '4px'
                }}>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: '7px' }}
                  >●</motion.span>
                  <span style={{ fontWeight: 'bold' }}>WALLET CONNECTED</span>
                </div>
                <div style={{ fontSize: '7px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2px' }}>
                  ACTIVE ADDRESS:
                </div>
                <div style={{
                  fontSize: '8px',
                  color: 'rgba(125, 249, 255, 0.9)',
                  wordBreak: 'break-all'
                }}>
                  {signer.slice(0, 6)}...{signer.slice(-6)}
                </div>
                <MemoryBar
                  value={100}
                  color={'rgba(54, 199, 88, 0.8)'}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  color: 'rgba(255, 204, 0, 0.8)',
                }}>
                  <motion.span
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: '7px' }}
                  >●</motion.span>
                  <span>NO WALLET CONNECTED</span>
                </div>
                <div style={{
                  fontSize: '7px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '6px'
                }}>
                  Set up wallet in wallet tab
                </div>
              </div>
            )}
          </div>
        </HUDSection>
      </div>

      {/* Overlay scan effect */}
      <motion.div
        animate={{ opacity: [0, 0.03, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 1px,
            rgba(125, 249, 255, 0.1) 1px,
            rgba(125, 249, 255, 0.1) 2px
          )`,
          zIndex: 99,
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
}