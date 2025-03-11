/**
 * MempoolTab - Visualizes pending transactions in the mempool and enables mining
 */

import { useState } from 'react';
import { useSignetContext } from '~shared/context/SignetContext';
import { colors } from '../../../shared/styles/theme';
import { motion } from 'framer-motion';

// Helper interface for Status
interface Status {
  subnet: string;
  txQueue: any[];
  lastProcessedBlock?: number;
}

export function MempoolTab() {
  const { status, isLoading, refreshStatus, mineAllPendingBlocks } = useSignetContext();
  const [isMining, setIsMining] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'mining'>('list');

  // Collect transactions from all subnets
  const allTxs = getAllTransactions(status);
  const txQueueSize = allTxs.length;

  // Helper function to collect transactions from all subnets
  function getAllTransactions(status: Record<string, Status> | null): Array<any> {
    if (!status) return [];

    // Flatten all txQueues from all subnets into a single array
    return Object.entries(status).flatMap(([subnetId, subnetStatus]) => {
      // Add subnet identifier to each transaction
      return (subnetStatus.txQueue || []).map(tx => ({
        ...tx,
        ...tx.data,
        subnetId,
        subnetName: subnetStatus.subnet.split('.')[1] // Extract subnet name
      }));
    });
  }

  // Handle mining all pending transactions
  const handleMineAll = async () => {
    if (txQueueSize > 0) {
      setIsMining(true);
      try {
        await mineAllPendingBlocks();
        // Refresh status after mining
        await refreshStatus();
      } catch (error) {
        console.error("Mining error:", error);
      } finally {
        setIsMining(false);
      }
    }
  };

  return (
    <div style={{
      padding: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      height: '290px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '0 8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: colors.cyber, fontWeight: 'bold' }}>
            Pending Transactions: {txQueueSize}
          </span>
          
          {/* Tab Toggle Buttons */}
          {txQueueSize > 0 && (
            <div style={{ 
              display: 'flex', 
              background: 'rgba(1, 4, 9, 0.5)',
              borderRadius: '4px',
              border: '1px solid rgba(125, 249, 255, 0.2)',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setActiveView('list')}
                style={{
                  background: activeView === 'list' ? 'rgba(125, 249, 255, 0.1)' : 'transparent',
                  color: activeView === 'list' ? colors.cyber : colors.steel,
                  border: 'none',
                  fontSize: '10px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  borderRight: '1px solid rgba(125, 249, 255, 0.1)'
                }}
              >
                List
              </button>
              <button
                onClick={() => setActiveView('mining')}
                style={{
                  background: activeView === 'mining' ? 'rgba(125, 249, 255, 0.1)' : 'transparent',
                  color: activeView === 'mining' ? colors.cyber : colors.steel,
                  border: 'none',
                  fontSize: '10px',
                  padding: '2px 6px',
                  cursor: 'pointer'
                }}
              >
                Mining
              </button>
            </div>
          )}
        </div>

        <motion.button
          onClick={refreshStatus}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'none',
            border: 'none',
            color: colors.steel,
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <motion.span
            animate={isLoading ? { rotate: [0, 360] } : {}}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
          >
            ↻
          </motion.span>
          Refresh
        </motion.button>
      </div>

      {/* Transaction List View */}
      {(activeView === 'list' || txQueueSize === 0) && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.cyber} rgba(1, 4, 9, 0.5)`,
        }}>
          {txQueueSize === 0 ? (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: colors.steel,
              fontSize: '14px'
            }}>
              No pending transactions in mempool
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>
              {allTxs.map((tx, index) => (
                <motion.div
                  key={`${tx.type}-${tx.nonce}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: 'rgba(1, 4, 9, 0.6)',
                    border: '1px solid rgba(125, 249, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '11px'
                  }}>
                    <div>
                      <span style={{ color: colors.cyber, textTransform: 'uppercase' }}>
                        {tx.type}
                      </span>
                      <span style={{
                        color: '#FFAA00',
                        fontSize: '9px',
                        marginLeft: '4px',
                        opacity: 0.9,
                        background: 'rgba(255, 170, 0, 0.1)',
                        padding: '1px 4px',
                        borderRadius: '2px'
                      }}>
                        {tx.subnetName}
                      </span>
                    </div>
                    <span style={{ color: colors.steel }}>
                      Nonce: {tx.nonce}
                    </span>
                  </div>

                  {tx.type === 'transfer' && (
                    <div style={{ fontSize: '11px', color: '#FFFFFF' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                        <div>From: <span style={{ color: colors.steel }}>
                          {tx.signer && typeof tx.signer === 'string' 
                            ? `${tx.signer.slice(0, 6)}...${tx.signer.slice(-4)}`
                            : 'Unknown'}
                        </span></div>
                        <div>To: <span style={{ color: colors.steel }}>
                          {tx.to && typeof tx.to === 'string'
                            ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                            : 'Unknown'}
                        </span></div>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: '4px', color: '#36C758' }}>
                        Amount: {tx.amount}
                      </div>
                    </div>
                  )}

                  {tx.type === 'predict' && (
                    <div style={{ fontSize: '11px', color: '#FFFFFF' }}>
                      <div>From: <span style={{ color: colors.steel }}>
                        {tx.signer && typeof tx.signer === 'string'
                          ? `${tx.signer.slice(0, 6)}...${tx.signer.slice(-4)}`
                          : 'Unknown'}
                      </span></div>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ color: colors.steel }}>Market: {tx.marketId}</span> |
                        <span style={{ color: colors.steel }}> Outcome: {tx.outcomeId}</span>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: '4px', color: '#FFCC00' }}>
                        Amount: {tx.amount}
                      </div>
                    </div>
                  )}

                  {tx.type === 'claim-reward' && (
                    <div style={{ fontSize: '11px', color: '#FFFFFF' }}>
                      <div>Claimer: <span style={{ color: colors.steel }}>
                        {tx.signer && typeof tx.signer === 'string'
                          ? `${tx.signer.slice(0, 6)}...${tx.signer.slice(-4)}`
                          : 'Unknown'}
                      </span></div>
                      <div style={{ textAlign: 'right', marginTop: '4px', color: '#DA2FB7' }}>
                        Receipt ID: {tx.receiptId}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mining View */}
      {activeView === 'mining' && txQueueSize > 0 && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          padding: '0 16px'
        }}>
          <div style={{ textAlign: 'center', color: colors.steel, fontSize: '14px' }}>
            <span>
              <span style={{ color: colors.cyber, fontWeight: 'bold' }}>{txQueueSize}</span> transactions ready to be mined
            </span>
          </div>

          <motion.button
            onClick={handleMineAll}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(125, 249, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            disabled={isMining || isLoading}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(125, 249, 255, 0.2) 0%, rgba(1, 4, 9, 0.5) 100%)',
              border: `2px solid ${colors.cyber}`,
              color: colors.cyber,
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isMining || isLoading ? 'default' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 10px rgba(125, 249, 255, 0.3)'
            }}
          >
            {isMining || isLoading ? (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '24px' }}
              >
                ⚙️
              </motion.div>
            ) : (
              <>
                <span style={{ fontSize: '24px' }}>⚡</span>
                <span>MINE ALL</span>
              </>
            )}
          </motion.button>

          <div style={{
            textAlign: 'center',
            color: colors.steel,
            fontSize: '12px',
            maxWidth: '260px'
          }}>
            Mining will process all pending transactions and publish them to the blockchain
          </div>

          {/* Subnets overview */}
          {status && Object.keys(status).length > 0 && (
            <div style={{ 
              marginTop: '10px',
              width: '100%', 
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontSize: '11px', color: colors.steel, marginBottom: '2px' }}>Subnets with pending transactions:</div>
              
              {Object.entries(status).map(([subnetId, subnetData]) => {
                const txCount = subnetData.txQueue?.length || 0;
                if (txCount === 0) return null;
                
                return (
                  <div 
                    key={subnetId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 8px',
                      background: 'rgba(1, 4, 9, 0.4)',
                      borderRadius: '4px',
                      border: '1px solid rgba(125, 249, 255, 0.1)',
                      fontSize: '11px'
                    }}
                  >
                    <span style={{ color: colors.cyber }}>
                      {subnetData.subnet.split('.')[1]}
                    </span>
                    <span style={{ color: '#FFAA00' }}>
                      {txCount} transaction{txCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}