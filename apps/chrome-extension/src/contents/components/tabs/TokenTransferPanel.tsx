/**
 * TokenTransferPanel - Form for creating token transfer transactions
 */

import { useState, useEffect } from 'react';
import { useSignetContext } from '~shared/context/SignetContext';
import { colors } from '../../../shared/styles/theme';
import { motion } from 'framer-motion';
import { tokenAssets, type Asset } from '../../../background/lib/constants';

export function TokenTransferPanel() {
  const { signer, refreshStatus, createTransfer, getAssetBalances } = useSignetContext();

  // Form state for transfer tab
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset>(tokenAssets[0]);
  const [assetBalances, setAssetBalances] = useState<Record<string, number>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Load asset balances when signer changes
  useEffect(() => {
    if (signer) {
      loadAssetBalances();
    }
  }, [signer]);

  // Load balances of all assets
  const loadAssetBalances = async () => {
    if (!signer) return;

    setIsLoadingBalances(true);
    try {
      const balances = await getAssetBalances();
      setAssetBalances(balances);
    } catch (error) {
      console.error('Failed to load asset balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Handle transfer submission
  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    if (recipient && amount && selectedAsset) {
      try {
        // Use Date.now() as the nonce
        const nonce = Math.floor(Date.now());

        await createTransfer(
          recipient,
          parseFloat(amount),
          nonce,
          selectedAsset.subnet
        );

        // Reset form after successful submission
        setRecipient('');
        setAmount('');

        // Refresh status and balances
        refreshStatus();
        loadAssetBalances();
      } catch (err) {
        console.error('Transfer error:', err);
      }
    }
  };

  return (
    <form onSubmit={handleCreateTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Asset Selection Section */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <label
            htmlFor="asset"
            style={{
              fontSize: '12px',
              color: colors.steel,
            }}
          >
            Token
          </label>

          <button
            type="button"
            onClick={loadAssetBalances}
            style={{
              background: 'none',
              border: 'none',
              color: colors.cyber,
              fontSize: '10px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLoadingBalances ? 'Refreshing...' : 'Refresh Balances'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '8px'
        }}>
          {tokenAssets.map(asset => (
            <div
              key={asset.id}
              role="button"
              onClick={() => setSelectedAsset(asset)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                background: selectedAsset.id === asset.id
                  ? 'rgba(125, 249, 255, 0.1)'
                  : 'rgba(1, 4, 9, 0.8)',
                border: `1px solid ${selectedAsset.id === asset.id
                  ? 'rgba(125, 249, 255, 0.6)'
                  : 'rgba(125, 249, 255, 0.3)'}`,
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Asset icon placeholder */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  background: 'rgba(125, 249, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: colors.cyber
                }}>
                  {asset.symbol.charAt(0)}
                </div>

                <div>
                  <div style={{ fontSize: '14px', color: colors.cyber }}>
                    {asset.name}
                  </div>
                  <div style={{ fontSize: '10px', color: colors.steel }}>
                    {asset.symbol}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '14px',
                color: colors.cyber,
                fontWeight: 'bold'
              }}>
                {isLoadingBalances
                  ? '...'
                  : assetBalances[asset.id] !== undefined
                    ? assetBalances[asset.id].toLocaleString()
                    : '0'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}>
          <label
            htmlFor="recipient"
            style={{
              fontSize: '12px',
              color: colors.steel
            }}
          >
            Transfer Details
          </label>

          {!isLoadingBalances && assetBalances[selectedAsset.id] !== undefined && (
            <button
              type="button"
              onClick={() => setAmount(assetBalances[selectedAsset.id].toString())}
              style={{
                background: 'none',
                border: 'none',
                color: colors.cyber,
                fontSize: '10px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Max: {assetBalances[selectedAsset.id]}
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ flex: '3 1 0', minWidth: 0 }}>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient (ST...)"
              style={{
                padding: '8px',
                background: 'rgba(1, 4, 9, 0.8)',
                border: '1px solid rgba(125, 249, 255, 0.3)',
                borderRadius: '4px',
                color: colors.cyber,
                fontSize: '14px',
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(125, 249, 255, 0.6)';
                e.target.style.boxShadow = '0 0 0 1px rgba(125, 249, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(125, 249, 255, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ flex: '2 1 0', minWidth: 0, position: 'relative' }}>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              min="1"
              step="1"
              style={{
                padding: '8px',
                paddingRight: '24px', // Make room for our custom controls
                background: 'rgba(1, 4, 9, 0.8)',
                border: '1px solid rgba(125, 249, 255, 0.3)',
                borderRadius: '4px',
                color: colors.cyber,
                fontSize: '14px',
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(125, 249, 255, 0.6)';
                e.target.style.boxShadow = '0 0 0 1px rgba(125, 249, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(125, 249, 255, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div className="signet-number-control">
              <div 
                className="signet-number-up" 
                onClick={() => {
                  const current = parseFloat(amount) || 0;
                  setAmount((current + 1).toString());
                }}
              >
                ▲
              </div>
              <div 
                className="signet-number-down" 
                onClick={() => {
                  const current = parseFloat(amount) || 0;
                  if (current >= 2) {
                    setAmount((current - 1).toString());
                  }
                }}
              >
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, boxShadow: '0 0 8px rgba(125, 249, 255, 0.4)' }}
        whileTap={{ scale: 0.98 }}
        disabled={!recipient || !amount || isLoadingBalances}
        style={{
          padding: '8px 16px',
          background: (!recipient || !amount || isLoadingBalances)
            ? 'rgba(125, 249, 255, 0.05)'
            : 'rgba(125, 249, 255, 0.1)',
          border: '1px solid rgba(125, 249, 255, 0.4)',
          borderRadius: '4px',
          color: (!recipient || !amount || isLoadingBalances)
            ? 'rgba(125, 249, 255, 0.4)'
            : colors.cyber,
          cursor: (!recipient || !amount || isLoadingBalances) ? 'default' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          marginTop: '8px'
        }}
      >
        Transfer {selectedAsset.symbol}
      </motion.button>
    </form>
  );
}