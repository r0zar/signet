import React, { useState } from 'react';
import SignetDemoHeader from '../components/SignetDemoHeader';
import SignetDemoCard from '../components/SignetDemoCard';
import ConnectionPanel from '../components/ConnectionPanel';
import DataPanel from '../components/DataPanel';
import SignatureResults from '../components/SignatureResults';
import DeveloperSection from '../components/DeveloperSection';
import { showNotification } from '../utils/notification';
import { SignatureResult } from '../utils/signet-api';

const SignetDemoSection: React.FC = () => {
  // Component state
  const [isConnected, setIsConnected] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState<'waiting' | 'signing' | 'completed' | 'failed' | 'invalid'>('waiting');
  const [signatureResult, setSignatureResult] = useState<SignatureResult | undefined>(undefined);
  const [signatureTimestamp, setSignatureTimestamp] = useState('-');
  const [signatureHighlight, setSignatureHighlight] = useState(false);

  // Handle wallet connection
  const handleConnect = () => {
    setIsConnected(true);
  };

  // Handle data signing
  const handleSignData = async (data: Record<string, unknown>) => {
    if (typeof window.SignetAPI === 'undefined') {
      showNotification('error', {
        title: "Wallet Not Connected",
        message: "Please connect your wallet to sign data"
      });
      return;
    }

    setSignatureStatus('signing');
    
    try {
      const signature = await window.SignetAPI.signStructuredData(data);
      
      setSignatureResult(signature);
      setSignatureStatus('completed');
      
      // Update timestamp
      const date = new Date();
      setSignatureTimestamp(date.toLocaleTimeString());

      // Add success highlight animation using React state
      setSignatureHighlight(true);
      setTimeout(() => {
        setSignatureHighlight(false);
      }, 2000);
    } catch (error) {
      setSignatureStatus('failed');
      console.error('Signing error:', error);
      
      // Provide more specific user feedback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showNotification('error', {
        title: "Signature Failed",
        message: `Failed to sign data: ${errorMessage}`
      });
    }
  };

  return (
    <section id="signet-demo" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary-legacy/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-secondary-legacy/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-primary-legacy/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/2 -right-32 w-96 h-96 bg-secondary-legacy/5 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 border border-primary-legacy/20 rounded-full shadow-glow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-legacy mr-2"></span>
            Interactive Experience
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Signet Demo Experience
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Experience secure, wallet-less structured data signing with a step-by-step interactive demo
          </p>
          
          <div className="flex flex-wrap items-center justify-center mt-8 gap-3 text-sm">
            <div className="flex items-center px-4 py-2 rounded-lg bg-black/30 border border-gray-800 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Secure</span>
            </div>
            
            <div className="flex items-center px-4 py-2 rounded-lg bg-black/30 border border-gray-800 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Fast</span>
            </div>
            
            <div className="flex items-center px-4 py-2 rounded-lg bg-black/30 border border-gray-800 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
              <span className="text-gray-300">Private</span>
            </div>
          </div>
        </div>

        {/* Demo Card with improved styling */}
        <div className="max-w-5xl mx-auto shadow-2xl shadow-primary-legacy/20 rounded-2xl overflow-hidden bg-gradient-to-b from-black/80 to-gray-900/80 backdrop-blur-sm border border-primary-legacy/10">
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-black border-b border-primary-legacy/20 p-5">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary-legacy/10 flex items-center justify-center border border-primary-legacy/30 shadow-glow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-legacy" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Interactive Signer Demo</h3>
                <div className="flex items-center mt-1">
                  <div 
                    id="status-indicator" 
                    className={`h-2.5 w-2.5 rounded-full mr-2 ${
                      isConnected 
                        ? signatureStatus === 'completed' 
                          ? 'bg-green-500' 
                          : signatureStatus === 'signing' 
                            ? 'bg-blue-500 animate-pulse' 
                            : 'bg-primary-legacy' 
                        : 'bg-yellow-500 animate-pulse'
                    }`}
                  ></div>
                  <span 
                    id="connection-status" 
                    className={`text-xs ${
                      isConnected 
                        ? signatureStatus === 'completed' 
                          ? 'text-green-500' 
                          : signatureStatus === 'signing' 
                            ? 'text-blue-500' 
                            : 'text-primary-legacy' 
                        : 'text-yellow-500'
                    }`}
                  >
                    {isConnected 
                      ? signatureStatus === 'completed' 
                        ? 'Signature Complete' 
                        : signatureStatus === 'signing' 
                          ? 'Signing in progress' 
                          : 'Connected' 
                      : 'Waiting for connection'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <span className="px-3 py-1 rounded-md bg-black/30 border border-gray-700/50 text-xs text-gray-400 font-mono">wallet://signet</span>
              <div className="px-3 py-1 rounded-md bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-mono flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                Secure Connection
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 min-h-[550px]">
            {/* Left panel: Connection and Data Entry */}
            <div className="border-r border-primary-legacy/10 relative overflow-hidden bg-black/40">
              {isConnected ? (
                <DataPanel onSign={handleSignData} />
              ) : (
                <ConnectionPanel onConnect={handleConnect} />
              )}
            </div>

            {/* Right panel: Signature Results */}
            <div className="bg-black/40 border-gray-700/50">
              <SignatureResults 
                signature={signatureResult}
                status={signatureStatus}
                timestamp={signatureTimestamp}
                highlight={signatureHighlight}
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/40 border-t border-primary-legacy/10 py-4 px-5">
            <div className="text-xs text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              End-to-end encrypted signature processing
            </div>
            <a
              href="https://chrome.google.com/webstore/detail/signet-signer/extension-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-legacy hover:text-primary-legacy/80 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Signet Signer
            </a>
          </div>
        </div>

        {/* Developer section */}
        <div className="mt-20">
          <DeveloperSection />
        </div>
      </div>
    </section>
  );
};

export default SignetDemoSection;