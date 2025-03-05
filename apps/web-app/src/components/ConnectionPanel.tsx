import React, { useState, useEffect } from 'react';
import { showNotification } from '../utils/notification';
import { initializeDemoSignetAPI, isSignetExtensionInstalled } from '../utils/signet-api';

interface ConnectionPanelProps {
  onConnect: () => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  
  // Check for extension on component mount
  useEffect(() => {
    const checkExtension = async () => {
      // If SignetAPI is already available, auto-connect
      if (typeof window.SignetAPI !== 'undefined') {
        const statusIndicator = document.getElementById('status-indicator');
        const connectionStatus = document.getElementById('connection-status');
        
        if (statusIndicator && connectionStatus) {
          statusIndicator.className = "h-2.5 w-2.5 rounded-full bg-green-500 mr-2";
          connectionStatus.className = "text-xs text-green-500";
          connectionStatus.textContent = "Connected";
        }
        
        onConnect();
      }
      
      setConnectionChecked(true);
    };
    
    checkExtension();
  }, [onConnect]);
  
  const handleConnect = async () => {
    const isExtensionInstalled = isSignetExtensionInstalled(); 
    const hasAPI = typeof window.SignetAPI !== 'undefined';
    const statusIndicator = document.getElementById('status-indicator');
    const connectionStatus = document.getElementById('connection-status');
    
    setIsConnecting(true);
    
    const updateStatusIndicator = (color: string, text: string) => {
      if (statusIndicator && connectionStatus) {
        statusIndicator.className = `h-2.5 w-2.5 rounded-full bg-${color}-500 mr-2`;
        connectionStatus.className = `text-xs text-${color}-500`;
        connectionStatus.textContent = text;
      }
    };
    
    if (hasAPI) {
      // Already connected
      updateStatusIndicator('green', 'Connected');
      
      showNotification('success', {
        title: "Wallet Connected",
        message: "Your wallet is already connected to this site"
      });
      
      onConnect();
      setIsConnecting(false);
      return;
    }
    
    if (!isExtensionInstalled) {
      // No extension detected
      updateStatusIndicator('red', 'Extension not detected');
      
      showNotification('error', {
        title: "Extension Not Found",
        message: "Please install the Signet Signer extension first"
      });
      
      setIsConnecting(false);
      return;
    }
    
    // Show connecting state
    updateStatusIndicator('yellow', 'Connecting...');
    
    try {
      // Initialize the demo API
      await initializeDemoSignetAPI();
      
      // Check if connected successfully
      setTimeout(() => {
        const connected = typeof window.SignetAPI !== 'undefined';
        if (connected) {
          updateStatusIndicator('green', 'Connected');
          
          showNotification('success', {
            title: "Wallet Connected",
            message: "Your Signet wallet is now connected to this dApp"
          });
          
          onConnect();
        }
        setIsConnecting(false);
      }, 500);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      
      updateStatusIndicator('red', 'Connection failed');
      
      showNotification('error', {
        title: "Connection Failed",
        message: `Failed to connect to wallet: ${err instanceof Error ? err.message : 'Unknown error'}`
      });
      
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-6 space-y-6" id="connection-panel">
      {connectionChecked ? (
        <>
          <div className="flex flex-col items-center text-center mb-2">
            <div className="w-20 h-20 mb-4 relative">
              <div className="absolute inset-0 bg-primary-legacy/10 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-full h-full rounded-full bg-primary-legacy/10 border border-primary-legacy/30 flex items-center justify-center shadow-glow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Connect to Signet Signer</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Enable secure structured data signing with the Signet Signer extension for wallet-less web3 experiences
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900/40 rounded-lg border border-gray-800 overflow-hidden">
              <div className="px-3 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="text-sm font-medium text-white">Extension Status</div>
                <div className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-medium flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>
                  Waiting for connection
                </div>
              </div>
              
              <div className="px-3 py-3">
                <div className="flex items-center py-2">
                  <div className="w-8 h-8 rounded-full bg-primary-legacy/10 flex items-center justify-center text-primary-legacy flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Secure Connection</div>
                    <div className="text-xs text-gray-400">All data is signed and processed locally</div>
                  </div>
                </div>
                
                <div className="flex items-center py-2">
                  <div className="w-8 h-8 rounded-full bg-primary-legacy/10 flex items-center justify-center text-primary-legacy flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Fast Transactions</div>
                    <div className="text-xs text-gray-400">Sign structured data with a single click</div>
                  </div>
                </div>
                
                <div className="flex items-center py-2">
                  <div className="w-8 h-8 rounded-full bg-primary-legacy/10 flex items-center justify-center text-primary-legacy flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Private Key Safety</div>
                    <div className="text-xs text-gray-400">Keys never leave your browser extension</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              id="connect-wallet-btn"
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all
                ${isConnecting 
                  ? 'bg-primary-legacy/60 cursor-wait' 
                  : 'bg-primary-legacy hover:bg-primary-legacy/90 shadow-glow-sm'}`}
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                  <span>Connect to Signet</span>
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center">
              <div className="h-px flex-1 bg-gray-800"></div>
              <div className="px-3 text-xs text-gray-500">or</div>
              <div className="h-px flex-1 bg-gray-800"></div>
            </div>

            <a
              href="https://chrome.google.com/webstore/detail/signet-signer/abcdefghijklmnopqrstuvwxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-4 rounded-lg font-medium text-center border border-primary-legacy/50 text-primary-legacy hover:bg-primary-legacy/10 transition-colors"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Install Extension
              </div>
            </a>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <svg className="animate-spin h-8 w-8 text-primary-legacy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ConnectionPanel;