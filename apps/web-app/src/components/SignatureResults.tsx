import React from 'react';
import { type SignatureResult } from '../utils/signet-api';

interface SignatureResultsProps {
  signature?: SignatureResult;
  status: 'waiting' | 'signing' | 'completed' | 'failed' | 'invalid';
  timestamp?: string;
  highlight?: boolean;
}

const SignatureResults: React.FC<SignatureResultsProps> = ({ 
  signature, 
  status, 
  timestamp = '-',
  highlight = false
}) => {
  // Helper function to get status display
  const getStatusDisplay = () => {
    switch (status) {
      case 'waiting':
        return { 
          text: 'Waiting for signature...', 
          className: 'text-gray-400',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          ),
          badge: 'bg-gray-800 text-gray-400'
        };
      case 'signing':
        return { 
          text: 'Signing in progress...', 
          className: 'text-yellow-500',
          icon: (
            <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          badge: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
        };
      case 'completed':
        return { 
          text: 'Signature Verified', 
          className: 'text-green-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          badge: 'bg-green-500/10 text-green-500 border border-green-500/30'
        };
      case 'failed':
        return { 
          text: 'Signature Failed', 
          className: 'text-red-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          badge: 'bg-red-500/10 text-red-500 border border-red-500/30'
        };
      case 'invalid':
        return { 
          text: 'Invalid JSON Data', 
          className: 'text-red-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          badge: 'bg-red-500/10 text-red-500 border border-red-500/30'
        };
      default:
        return { 
          text: 'Unknown status', 
          className: 'text-gray-400',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          ),
          badge: 'bg-gray-800 text-gray-400'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Signature Results</h3>
        <div 
          id="result-status" 
          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1.5 ${statusDisplay.badge}`}
        >
          {statusDisplay.icon}
          <span>{statusDisplay.text}</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Signature Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-white">Generated Signature</h4>
            <div className="flex items-center text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span id="sign-timestamp">{timestamp}</span>
            </div>
          </div>
          
          <div 
            className={`w-full bg-gray-900/50 border ${highlight ? 'border-green-500/30' : 'border-gray-800'} rounded-lg transition-colors duration-500 overflow-hidden`}
          >
            <div className="flex items-center justify-between px-3 py-2 bg-black/30 border-b border-gray-800">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-legacy mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-white">Signature Hash</span>
              </div>
              <button 
                className="text-xs bg-primary-legacy/10 hover:bg-primary-legacy/20 text-primary-legacy px-2 py-1 rounded-md transition-colors flex items-center"
                disabled={!signature?.signature}
                onClick={() => {
                  if (signature?.signature) {
                    navigator.clipboard.writeText(signature.signature);
                    showTooltip();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy
              </button>
            </div>
            
            <div className="p-4 bg-black/10">
              <div 
                id="signature-output" 
                className="font-mono text-sm text-white/90 break-all min-h-[50px] max-h-[100px] overflow-y-auto"
              >
                {signature?.signature || (
                  <span className="text-gray-500 italic">
                    {status === 'waiting' ? 'Waiting for signature request...' : 
                     status === 'signing' ? 'Generating signature...' : 
                     'No signature available'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Transaction Analytics</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-blue-400 font-medium">Process Time</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white">
                  {status === 'completed' ? '0.2' : status === 'signing' ? '...' : '0.0'}
                </div>
                <div className="text-sm text-gray-400 font-medium">seconds</div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-purple-400 font-medium">Security Level</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-white">High Protection</div>
                <div className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-medium">ECC</div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-yellow-400 font-medium">Network Fee</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white">0.006</div>
                <div className="text-sm text-gray-400 font-medium">STX</div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
                <div className="text-xs text-green-400 font-medium">Signature Size</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white">
                  {signature?.signature ? 
                    Math.min(512, Math.floor(signature.signature.length / 2)) : 
                    status === 'signing' ? '...' : '0'}
                </div>
                <div className="text-sm text-gray-400 font-medium">bytes</div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-primary-legacy/5 border border-primary-legacy/20 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-primary-legacy/10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-legacy mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h4 className="text-sm font-medium text-white">How Signet Signing Works</h4>
          </div>
          
          <div className="px-4 py-3 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary-legacy/10 text-primary-legacy flex items-center justify-center text-sm font-medium flex-shrink-0 border border-primary-legacy/20">1</div>
              <div>
                <h5 className="text-xs font-medium text-white mb-0.5">Data Creation</h5>
                <p className="text-xs text-gray-400">Application prepares structured data for signing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary-legacy/10 text-primary-legacy flex items-center justify-center text-sm font-medium flex-shrink-0 border border-primary-legacy/20">2</div>
              <div>
                <h5 className="text-xs font-medium text-white mb-0.5">Secure Signing</h5>
                <p className="text-xs text-gray-400">Signet extension signs data without exposing private keys</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to show tooltip when copying
function showTooltip() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.textContent = 'Copied!';
  tooltip.className = 'fixed px-2 py-1 bg-primary-legacy text-white text-xs rounded shadow-md z-50 transition-opacity duration-300';
  
  // Position it near mouse
  const mouseEvent = window.event as MouseEvent;
  tooltip.style.top = `${mouseEvent.clientY - 30}px`;
  tooltip.style.left = `${mouseEvent.clientX - 20}px`;
  
  // Append to body
  document.body.appendChild(tooltip);
  
  // Remove after animation
  setTimeout(() => {
    tooltip.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(tooltip);
    }, 300);
  }, 1500);
}

export default SignatureResults;