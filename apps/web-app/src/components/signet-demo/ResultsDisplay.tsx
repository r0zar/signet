import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignatureResult } from '../../utils/signet-api';

interface ResultsDisplayProps {
  status: 'idle' | 'waiting' | 'signing' | 'completed' | 'failed';
  result?: SignatureResult;
  data: Record<string, unknown> | null;
  showSuccessEffect: boolean;
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  status, 
  result, 
  data, 
  showSuccessEffect,
  onRestart 
}) => {
  const [activeTab, setActiveTab] = useState<'signature' | 'data' | 'analytics'>('signature');
  
  // Helper function to format a timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    
    return new Date(timestamp).toLocaleString(undefined, { 
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Calculate total processing time
  const calculateProcessingTime = () => {
    if (!result?.timestamp) return '0.0';
    
    const now = Date.now();
    const processingTime = (result.timestamp - (data?.timestamp as number || 0)) / 1000;
    
    return processingTime.toFixed(2);
  };
  
  return (
    <div className="p-8 grid md:grid-cols-2 gap-8">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-4">
          {/* Status indicator */}
          <div className="bg-gray-900/70 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="text-sm font-medium text-white">Signature Status</div>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center ${
                status === 'idle' ? 'bg-gray-700/50 text-gray-400' :
                status === 'waiting' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' :
                status === 'signing' ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' :
                status === 'completed' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
                'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                  status === 'idle' ? 'bg-gray-500' :
                  status === 'waiting' ? 'bg-blue-500' :
                  status === 'signing' ? 'bg-yellow-500 animate-pulse' :
                  status === 'completed' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></span>
                <span>
                  {status === 'idle' ? 'Not Started' :
                   status === 'waiting' ? 'Waiting' :
                   status === 'signing' ? 'Signing in Progress' :
                   status === 'completed' ? 'Signature Verified' :
                   'Signing Failed'}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              {status === 'signing' ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary-legacy/20 border border-primary-legacy/30 flex items-center justify-center mb-4 shadow-glow">
                    <svg className="animate-spin w-8 h-8 text-primary-legacy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Processing Your Signature</h3>
                  <p className="text-gray-400 text-sm max-w-sm text-center">
                    Your data is being securely signed by the Signet extension. This usually takes less than a second.
                  </p>
                </div>
              ) : status === 'completed' ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-green-500 bg-green-500/10 border border-green-500/30 mr-3 ${
                      showSuccessEffect ? 'animate-pulse' : ''
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">Signing Complete</h3>
                      <p className="text-sm text-gray-400">Your data has been successfully signed</p>
                    </div>
                  </div>
                  
                  {/* Tab navigation */}
                  <div className="flex p-0.5 bg-gray-800/70 rounded-lg border border-gray-700/50 shadow-inner">
                    <button
                      onClick={() => setActiveTab('signature')}
                      className={`flex-1 text-xs px-3 py-1.5 rounded-md transition-colors ${
                        activeTab === 'signature'
                          ? 'bg-primary-legacy text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Signature
                    </button>
                    <button
                      onClick={() => setActiveTab('data')}
                      className={`flex-1 text-xs px-3 py-1.5 rounded-md transition-colors ${
                        activeTab === 'data'
                          ? 'bg-primary-legacy text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Signed Data
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`flex-1 text-xs px-3 py-1.5 rounded-md transition-colors ${
                        activeTab === 'analytics'
                          ? 'bg-primary-legacy text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Analytics
                    </button>
                  </div>
                  
                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'signature' && (
                      <motion.div
                        key="signature-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <div className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-2 bg-black/30 border-b border-gray-800">
                            <div className="flex items-center text-xs text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-primary-legacy" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span>Signature Hash</span>
                            </div>
                            <button
                              onClick={() => {
                                if (result?.signature) {
                                  navigator.clipboard.writeText(result.signature);
                                  
                                  // Show a simple toast
                                  const toast = document.createElement('div');
                                  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm';
                                  toast.textContent = 'Copied to clipboard!';
                                  document.body.appendChild(toast);
                                  
                                  setTimeout(() => {
                                    toast.style.opacity = '0';
                                    setTimeout(() => document.body.removeChild(toast), 300);
                                  }, 2000);
                                }
                              }}
                              className="text-xs bg-primary-legacy/10 hover:bg-primary-legacy/20 text-primary-legacy px-2 py-1 rounded-md transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                              Copy
                            </button>
                          </div>
                          
                          <div className="p-3 bg-black/20">
                            <div className="font-mono text-xs text-white/80 break-all max-h-[100px] overflow-auto">
                              {result?.signature || 'No signature available'}
                            </div>
                          </div>
                          
                          <div className="p-2 bg-black/30 border-t border-gray-800 flex justify-between text-xs text-gray-400">
                            <div>
                              <span className="mr-1">Generated:</span>
                              <span className="text-white">{formatTimestamp(result?.timestamp)}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                              <span>Valid</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'data' && (
                      <motion.div
                        key="data-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <div className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden">
                          <div className="p-2 bg-black/30 border-b border-gray-800 flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                              Signed Content
                            </div>
                            <div className="text-xs px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                              {data?.action === 'token_transfer' ? 'Token Transfer' : 'Message Signing'}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-black/20">
                            <pre className="font-mono text-xs text-white/80 max-h-[100px] overflow-auto">
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'analytics' && (
                      <motion.div
                        key="analytics-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3">
                            <div className="text-xs text-blue-400 mb-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Process Time
                            </div>
                            <div className="flex items-end">
                              <span className="text-xl font-bold text-white">{calculateProcessingTime()}</span>
                              <span className="text-xs text-gray-400 ml-1.5">seconds</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3">
                            <div className="text-xs text-purple-400 mb-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              Security
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-white">High Protection</span>
                              <span className="text-xxs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded ml-2">ECC</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3">
                            <div className="text-xs text-green-400 mb-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                              </svg>
                              Signature Size
                            </div>
                            <div className="flex items-end">
                              <span className="text-xl font-bold text-white">
                                {result ? Math.min(512, Math.floor((result.signature?.length || 0) / 2)) : 0}
                              </span>
                              <span className="text-xs text-gray-400 ml-1.5">bytes</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3">
                            <div className="text-xs text-yellow-400 mb-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                              </svg>
                              Network Fee
                            </div>
                            <div className="flex items-end">
                              <span className="text-xl font-bold text-white">0.006</span>
                              <span className="text-xs text-gray-400 ml-1.5">STX</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : status === 'failed' ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Signing Failed</h3>
                  <p className="text-gray-400 text-sm max-w-sm text-center mb-6">
                    We couldn't complete the signing process. This could be due to a connection issue or because the extension was closed.
                  </p>
                  <button 
                    className="px-4 py-2 bg-primary-legacy hover:bg-primary-legacy/90 text-white rounded-lg transition-colors text-sm font-medium"
                    onClick={onRestart}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Waiting for Data</h3>
                  <p className="text-gray-400 text-sm max-w-sm text-center">
                    Looks like we're waiting for data to sign. Please go back to the previous step and submit some data.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {status === 'completed' && (
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors text-sm font-medium"
                onClick={onRestart}
              >
                Start New Signature
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      <motion.div
        className="space-y-6 hidden md:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gray-900/40 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="text-sm font-medium text-white">How Blockchain Signatures Work</div>
          </div>
          
          <div className="p-5 space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
              
              <div className="relative pl-10 pb-6">
                <div className="absolute left-[14px] top-1 w-3 h-3 rounded-full bg-primary-legacy/20 border border-primary-legacy/50"></div>
                <h4 className="text-sm font-medium text-white mb-1">Data Preparation</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your data is structured and prepared for signing. This includes adding a timestamp, arranging fields, and ensuring it's in the correct format.
                </p>
              </div>
              
              <div className="relative pl-10 pb-6">
                <div className="absolute left-[14px] top-1 w-3 h-3 rounded-full bg-primary-legacy/20 border border-primary-legacy/50"></div>
                <h4 className="text-sm font-medium text-white mb-1">Cryptographic Signing</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The Signet extension uses your private key to create a unique signature for this specific data. The private key never leaves your browser.
                </p>
              </div>
              
              <div className="relative pl-10">
                <div className="absolute left-[14px] top-1 w-3 h-3 rounded-full bg-primary-legacy/20 border border-primary-legacy/50"></div>
                <h4 className="text-sm font-medium text-white mb-1">Verification</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The signature can be verified against the original data using your public key, proving that you authorized this transaction without revealing your private key.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/40 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="text-sm font-medium text-white">Signature Security</div>
          </div>
          
          <div className="p-5">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">Tamper-Proof</div>
                <p className="text-xs text-gray-400">
                  Any change to the signed data would invalidate the signature, making forgery impossible.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">Private Key Safety</div>
                <p className="text-xs text-gray-400">
                  Your private keys never leave your browser extension, keeping them secure at all times.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">Verified Identity</div>
                <p className="text-xs text-gray-400">
                  Signatures cryptographically prove ownership of the keys, providing strong identity verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsDisplay;