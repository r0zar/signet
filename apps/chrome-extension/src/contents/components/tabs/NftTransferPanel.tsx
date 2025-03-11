/**
 * NftTransferPanel - Component for NFT transfers and viewing
 */

import { useState, useEffect } from 'react';
import { useSignetContext } from '~shared/context/SignetContext';
import { colors } from '../../../shared/styles/theme';
import { motion } from 'framer-motion';
import { nftAssets, type Asset } from '../../../background/lib/constants';

// Accept skipInitialLoad as an optional prop to prevent automatic balance loading
type NftTransferPanelProps = {
  skipInitialLoad?: boolean;
};

export function NftTransferPanel({ skipInitialLoad = false }: NftTransferPanelProps = {}) {
  const { signer, refreshStatus, createTransfer } = useSignetContext();
  
  // State for NFTs - use manually defined balances for now
  const [selectedNft, setSelectedNft] = useState<Asset>(nftAssets[0]);
  const [recipient, setRecipient] = useState('');
  // Default fixed balances - this is a temporary solution until the backend NFT support is implemented
  const [nftBalances, setNftBalances] = useState<Record<string, number>>({
    'prediction': 1 // Give the user one prediction NFT for demo purposes
  });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
  
  // Skip the automatic balance loading for NFTs since they're not fully supported yet
  useEffect(() => {
    // Intentionally empty - will be implemented when backend support is added
  }, [signer]);

  // Placeholder method for NFT balance loading - will be implemented properly when backend support is added
  const loadNftBalances = async () => {
    if (!signer) return;

    setIsLoadingBalances(true);
    try {
      // In the future, this will call a dedicated NFT balance endpoint
      // For now, we're using fixed demo balances set in the state initialization
      console.log('NFT balance loading is currently using fixed demo values');
      // Simulate a short loading time for UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Failed to load NFT balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Handle NFT transfer
  const handleTransferNft = async (e) => {
    e.preventDefault();
    
    if (!recipient || selectedNftId === null) {
      return;
    }
    
    try {
      // Use Date.now() as the nonce
      const nonce = Math.floor(Date.now());
      
      // For NFTs, we use a special transfer operation
      // We could potentially modify this to use a different method for NFTs
      await createTransfer(
        recipient,
        1, // NFTs are transferred as a whole
        nonce,
        selectedNft.subnet
      );
      
      // Reset form
      setRecipient('');
      setSelectedNftId(null);
      
      // Refresh
      refreshStatus();
      loadNftBalances();
    } catch (err) {
      console.error('NFT transfer error:', err);
    }
  };

  // Check if the user has any NFTs
  const hasNfts = nftAssets.some(asset => 
    nftBalances[asset.id] !== undefined && nftBalances[asset.id] > 0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* NFT Selection */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <label
            style={{
              fontSize: '12px',
              color: colors.steel,
            }}
          >
            Your NFTs
          </label>
          
          <button
            type="button"
            onClick={loadNftBalances}
            style={{
              background: 'none',
              border: 'none',
              color: colors.cyber,
              fontSize: '10px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLoadingBalances ? 'Refreshing...' : 'Refresh NFTs'}
          </button>
        </div>
        
        {isLoadingBalances ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '20px',
            color: colors.steel 
          }}>
            Loading NFTs...
          </div>
        ) : !hasNfts ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            border: '1px dashed rgba(125, 249, 255, 0.3)',
            borderRadius: '4px',
            color: colors.steel,
            fontSize: '14px' 
          }}>
            You don't have any NFTs yet
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px' 
          }}>
            {nftAssets.map(asset => {
              if (!nftBalances[asset.id] || nftBalances[asset.id] <= 0) return null;
              
              // For each NFT type, the user might have multiple tokens
              return (
                <div 
                  key={asset.id}
                  style={{
                    border: `1px solid rgba(125, 249, 255, 0.3)`,
                    borderRadius: '4px',
                    padding: '12px',
                    background: 'rgba(1, 4, 9, 0.8)',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '8px' 
                  }}>
                    {/* NFT icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      background: 'rgba(125, 249, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      color: colors.cyber
                    }}>
                      {asset.symbol.charAt(0)}
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '16px', color: colors.cyber, fontWeight: 'bold' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.steel }}>
                        {asset.symbol} • {nftBalances[asset.id]} owned
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock NFT Items - in a real implementation these would be individual tokens */}
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    {Array.from({ length: nftBalances[asset.id] }, (_, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setSelectedNft(asset);
                          setSelectedNftId(i + 1);
                        }}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '4px',
                          background: selectedNftId === i + 1 && selectedNft.id === asset.id
                            ? 'rgba(125, 249, 255, 0.3)' 
                            : 'rgba(125, 249, 255, 0.1)',
                          border: selectedNftId === i + 1 && selectedNft.id === asset.id
                            ? '2px solid rgba(125, 249, 255, 0.8)'
                            : '1px solid rgba(125, 249, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ 
                          fontSize: '12px', 
                          color: colors.cyber,
                          textAlign: 'center'
                        }}>
                          ID<br/>{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Transfer Form */}
      {!isLoadingBalances && hasNfts && (
        <form 
          onSubmit={handleTransferNft}
          style={{ 
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            border: '1px solid rgba(125, 249, 255, 0.2)',
            borderRadius: '4px',
            background: 'rgba(125, 249, 255, 0.03)'
          }}
        >
          <div style={{ fontSize: '14px', color: colors.cyber, fontWeight: 'bold', marginBottom: '8px' }}>
            Transfer NFT
          </div>
          
          <div>
            <label
              htmlFor="nft-recipient"
              style={{
                display: 'block',
                fontSize: '12px',
                color: colors.steel,
                marginBottom: '4px'
              }}
            >
              Recipient Address
            </label>
            <input
              id="nft-recipient"
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
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 8px rgba(125, 249, 255, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            disabled={!recipient || selectedNftId === null}
            style={{
              padding: '8px 16px',
              background: (!recipient || selectedNftId === null)
                ? 'rgba(125, 249, 255, 0.05)'
                : 'rgba(125, 249, 255, 0.1)',
              border: '1px solid rgba(125, 249, 255, 0.4)',
              borderRadius: '4px',
              color: (!recipient || selectedNftId === null)
                ? 'rgba(125, 249, 255, 0.4)'
                : colors.cyber,
              cursor: (!recipient || selectedNftId === null) ? 'default' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              marginTop: '8px'
            }}
          >
            Transfer {selectedNft?.name} #{selectedNftId}
          </motion.button>
        </form>
      )}
    </div>
  );
}