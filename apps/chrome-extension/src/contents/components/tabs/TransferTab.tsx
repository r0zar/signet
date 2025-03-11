/**
 * TransferTab - Component that shows tabs for tokens and NFTs
 */

import { useState, useEffect } from 'react';
import { useSignetContext } from '~shared/context/SignetContext';
import { colors } from '../../../shared/styles/theme';
import { TokenTransferPanel } from './TokenTransferPanel';
import { NftTransferPanel } from './NftTransferPanel';

export function TransferTab() {
  const { signer } = useSignetContext();
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');
  
  // Skip NFTs balance check when tab initially loads
  const [hasLoadedNFTs, setHasLoadedNFTs] = useState(false);
  
  // Only set NFTs as loaded after first explicit navigation to NFT tab
  useEffect(() => {
    if (activeTab === 'nfts' && !hasLoadedNFTs) {
      setHasLoadedNFTs(true);
    }
  }, [activeTab]);

  // Tab styles
  const getTabStyle = (tab: 'tokens' | 'nfts') => ({
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    color: activeTab === tab ? colors.cyber : colors.steel,
    background: activeTab === tab ? 'rgba(125, 249, 255, 0.1)' : 'transparent',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? colors.cyber : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{
      padding: '16px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {!signer ? (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          color: colors.steel,
          fontSize: '14px'
        }}>
          Please set up and select an account in the WALLET tab
        </div>
      ) : (
        <>
          {/* Tab navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(125, 249, 255, 0.2)',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setActiveTab('tokens')}
              style={getTabStyle('tokens')}
            >
              Tokens
            </button>
            <button
              onClick={() => setActiveTab('nfts')}
              style={getTabStyle('nfts')}
            >
              NFTs
            </button>
          </div>
          
          {/* Tab content */}
          {activeTab === 'tokens' ? (
            <TokenTransferPanel />
          ) : (
            <NftTransferPanel skipInitialLoad={!hasLoadedNFTs} />
          )}
        </>
      )}
    </div>
  );
}