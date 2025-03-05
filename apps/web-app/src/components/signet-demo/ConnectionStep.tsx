import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isSignetExtensionInstalled, initializeDemoSignetAPI } from '../../utils/signet-api';
import { showNotification } from '../../utils/notification';

interface ConnectionStepProps {
  onSuccess: () => void;
}

const ConnectionStep: React.FC<ConnectionStepProps> = ({ onSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<'checking' | 'not-installed' | 'installed' | 'connected'>('checking');

  // Check for extension on mount
  useEffect(() => {
    const checkExtension = async () => {
      if (typeof window.SignetAPI !== 'undefined') {
        setExtensionStatus('connected');
      } else if (isSignetExtensionInstalled()) {
        setExtensionStatus('installed');
      } else {
        setExtensionStatus('not-installed');
      }
    };

    checkExtension();
  }, []);

  // Handler for connection
  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      if (extensionStatus === 'connected') {
        // Already connected
        showNotification('success', {
          title: 'Already Connected',
          message: 'You are already connected to Signet'
        });
        onSuccess();
        return;
      }

      // Initialize the API
      await initializeDemoSignetAPI();

      setTimeout(() => {
        const connected = typeof window.SignetAPI !== 'undefined';
        if (connected) {
          setExtensionStatus('connected');
          // showNotification('success', {
          //   title: 'Connection Successful',
          //   message: 'Your Signet wallet is now connected'
          // });
          onSuccess();
        } else {
          throw new Error('Failed to connect to Signet API');
        }
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error('Connection error:', error);
      showNotification('error', {
        title: 'Connection Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-10 grid md:grid-cols-2 gap-10">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-center mb-8">
          <div className="w-36 h-36 relative">
            <div className="absolute inset-0 bg-primary-legacy/15 rounded-full animate-ping opacity-40"></div>
            <div className="relative w-full h-full rounded-full bg-primary-legacy/15 border border-primary-legacy/40 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-white">Connect to Signet Signer</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
            Secure and private structured data signing without exposing your private keys. Signet creates a secure connection between your browser and the blockchain.
          </p>
        </div>

        <div className="space-y-5 pt-4">
          <button
            className={`w-full py-4 px-5 rounded-xl font-medium flex items-center justify-center space-x-3 transition-all ${isConnecting
              ? 'bg-primary-legacy/60 cursor-wait'
              : extensionStatus === 'connected'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-primary-legacy hover:bg-primary-legacy/90'
              } text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-legacy focus:ring-offset-gray-900`}
            onClick={handleConnect}
            disabled={isConnecting}
            aria-busy={isConnecting}
            aria-live={isConnecting ? "polite" : "off"}
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : extensionStatus === 'connected' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Continue to Next Step</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
                <span>Connect to Signet</span>
              </>
            )}
          </button>

          {extensionStatus === 'not-installed' && (
            <>
              <div className="flex items-center justify-center py-2">
                <div className="h-px flex-1 bg-gray-800"></div>
                <div className="px-4 text-xs text-gray-500">or</div>
                <div className="h-px flex-1 bg-gray-800"></div>
              </div>

              <a
                href="https://chrome.google.com/webstore/detail/signet-signer/abcdefghijklmnopqrstuvwxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-5 rounded-xl font-medium text-center border border-primary-legacy/50 text-primary-legacy hover:bg-primary-legacy/10 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Install Extension
                </div>
              </a>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        className="space-y-8 hidden md:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gray-900/50 rounded-xl border border-gray-800/80 overflow-hidden shadow-lg">
          <div className="px-6 py-5 border-b border-gray-800/60 flex items-center justify-between">
            <div className="text-sm font-medium text-white">Connection Status</div>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center ${extensionStatus === 'checking'
              ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
              : extensionStatus === 'not-installed'
                ? 'bg-red-500/15 border-red-500/40 text-red-400'
                : extensionStatus === 'installed'
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                  : 'bg-green-500/15 border-green-500/40 text-green-400'
              }`}>
              <span className={`h-2 w-2 rounded-full mr-2 ${extensionStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
                extensionStatus === 'not-installed' ? 'bg-red-500' :
                  extensionStatus === 'installed' ? 'bg-blue-500' : 'bg-green-500'
                }`}></span>
              {extensionStatus === 'checking' ? 'Checking...' :
                extensionStatus === 'not-installed' ? 'Not Installed' :
                  extensionStatus === 'installed' ? 'Extension Found' : 'Connected'}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start space-x-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${extensionStatus === 'connected' || extensionStatus === 'installed'
                ? 'bg-green-500/15 text-green-500 border border-green-500/40'
                : 'bg-gray-800/80 text-gray-500 border border-gray-700/60'
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Extension Detection</div>
                <div className="text-xs text-gray-400 mt-1.5">Signet extension {extensionStatus === 'connected' || extensionStatus === 'installed' ? 'installed and ready' : 'not detected'}</div>
              </div>
            </div>

            <div className="flex items-start space-x-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${extensionStatus === 'connected'
                ? 'bg-green-500/15 text-green-500 border border-green-500/40'
                : 'bg-gray-800/80 text-gray-500 border border-gray-700/60'
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">API Connection</div>
                <div className="text-xs text-gray-400 mt-1.5">Signet API is {extensionStatus === 'connected' ? 'ready for use' : 'waiting to connect'}</div>
              </div>
            </div>

            <div className="flex items-start space-x-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${extensionStatus === 'connected'
                ? 'bg-green-500/15 text-green-500 border border-green-500/40'
                : 'bg-gray-800/80 text-gray-500 border border-gray-700/60'
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Ready to Sign</div>
                <div className="text-xs text-gray-400 mt-1.5">{extensionStatus === 'connected' ? 'Ready to sign structured data' : 'Waiting for connection'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-800/80 shadow-lg">
          <div className="h-48 bg-gradient-to-tr from-primary-legacy/25 to-black/80 flex items-center justify-center relative p-4">
            {/* Browser Extension Mockup */}
            <div className="w-full max-w-[300px] bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800">
              {/* Extension Header */}
              <div className="bg-gray-800 p-3 flex items-center border-b border-gray-700">
                <div className="w-8 h-8 rounded-full bg-primary-legacy/10 flex items-center justify-center border border-primary-legacy/30 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-legacy" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Signet Signer</h3>
                  <p className="text-xs text-gray-400">Ready to sign</p>
                </div>
                <div className="ml-auto px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  Active
                </div>
              </div>
              
              {/* Extension Content */}
              <div className="p-3">
                <div className="p-2 bg-gray-800/50 rounded border border-gray-800 text-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-1 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div className="text-xs font-medium text-white">Secure Signing</div>
                </div>
                
                <div className="text-[10px] text-gray-400 text-center">
                  Private keys stay in your browser
                </div>
              </div>
            </div>
            
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-primary-legacy/5 rounded-full blur-3xl"></div>
          </div>
          <div className="p-5 bg-black/50">
            <div className="text-sm font-medium text-white mb-1.5">Signet Signer Extension</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Seamlessly sign transactions and messages without exposing your private keys. All cryptographic operations happen locally in your browser.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectionStep;