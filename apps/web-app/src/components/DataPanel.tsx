import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { showNotification } from '../utils/notification';

interface DataPanelProps {
  onSign: (data: Record<string, unknown>) => Promise<void>;
}

const DataPanel: React.FC<DataPanelProps> = ({ onSign }) => {
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'transfer' | 'message'>('transfer');
  const [showSigningIndicator, setShowSigningIndicator] = useState(false);
  // Template data
  const defaultTransferData = {
    action: "token_transfer",
    from: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    to: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
    amount: "100",
    token: "STX",
    memo: "Payment for services",
    timestamp: Date.now()
  };

  const defaultMessageData = {
    action: "message_attestation",
    message: "I agree to the terms and conditions",
    user: "user123",
    domain: window.location.hostname,
    timestamp: Date.now()
  };
  
  const [dataInput, setDataInput] = useState(JSON.stringify(defaultTransferData, null, 2));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize the data input with the selected template
  const updateDataInput = (template: 'transfer' | 'message') => {
    const data = template === 'transfer' ? 
      { ...defaultTransferData, timestamp: Date.now() } : 
      { ...defaultMessageData, timestamp: Date.now() };
    
    const formatted = JSON.stringify(data, null, 2);
    setDataInput(formatted);
    
    // Also update the textarea value directly for immediate visual feedback
    if (textareaRef.current) {
      textareaRef.current.value = formatted;
    }
  };

  // Set transfer data template
  const handleTransferTemplate = () => {
    setActiveTemplate('transfer');
    updateDataInput('transfer');
  };

  // Set message data template
  const handleMessageTemplate = () => {
    setActiveTemplate('message');
    updateDataInput('message');
  };

  // Reset to default data
  const handleReset = () => {
    if (activeTemplate === 'transfer') {
      handleTransferTemplate();
    } else {
      handleMessageTemplate();
    }
  };

  // Handle signing
  const handleSign = async () => {
    if (typeof window.SignetAPI === 'undefined') {
      showNotification('error', {
        title: "Wallet Not Connected",
        message: "Please connect your wallet to sign data"
      });
      return;
    }

    // Get the current value from the textarea ref
    const jsonText = textareaRef.current?.value || dataInput;
    if (!jsonText.trim()) {
      showNotification('error', {
        title: "Empty Data",
        message: "Please provide data to sign"
      });
      return;
    }

    let structuredData: Record<string, unknown>;
    try {
      structuredData = JSON.parse(jsonText);
      
      // Validate required fields based on template
      if (activeTemplate === 'transfer') {
        if (!structuredData.action || !structuredData.amount || !structuredData.timestamp) {
          throw new Error("Required fields missing for token transfer");
        }
      } else {
        if (!structuredData.message || !structuredData.timestamp) {
          throw new Error("Required fields missing for message signing");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showNotification('error', {
        title: "Invalid Data",
        message: `Please provide valid JSON data: ${errorMessage}`
      });
      return;
    }

    // Show signing indicator
    setShowSigningIndicator(true);
    setIsSigningInProgress(true);
    
    try {
      await onSign(structuredData);
    } catch (error) {
      showNotification('error', {
        title: "Signing Failed",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsSigningInProgress(false);
      setShowSigningIndicator(false);
    }
  };

  return (
    <div className="p-6 space-y-6" id="data-panel">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Data to Sign</h3>
          <div className="flex p-0.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <button
              onClick={handleTransferTemplate}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                activeTemplate === 'transfer'
                  ? 'bg-primary-legacy text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Token Transfer
            </button>
            <button
              onClick={handleMessageTemplate}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                activeTemplate === 'message'
                  ? 'bg-primary-legacy text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Message Signing
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-black/30 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-gray-500">structured-data.json</div>
            <button onClick={handleReset} className="text-xs text-gray-500 hover:text-white transition-colors">
              Reset
            </button>
          </div>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={12}
              defaultValue={JSON.stringify(defaultTransferData, null, 2)}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/70 text-white font-mono text-sm focus:outline-none resize-none"
              spellCheck="false"
            />
            {showSigningIndicator && (
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center flex-col animate-fade-in"
            >
              <div className="w-16 h-16 rounded-full bg-primary-legacy/20 border border-primary-legacy/30 flex items-center justify-center mb-4 shadow-glow">
                <svg className="animate-spin w-8 h-8 text-primary-legacy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-white text-base font-medium">Signing Your Data...</p>
              <p className="text-gray-400 text-sm mt-1">Please wait while we process your signature</p>
            </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-800/50">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-legacy mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-white">About {activeTemplate === 'transfer' ? 'Token Transfers' : 'Message Signing'}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {activeTemplate === 'transfer' 
                ? 'This demo shows how to securely sign token transfer data. In a real application, this would authorize moving tokens from one address to another.' 
                : 'Message signing allows you to prove ownership of your wallet by signing a plain text message. This is commonly used for authentication and attestations.'}
            </p>
          </div>
          
          <button
            id="sign-data-btn"
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
              isSigningInProgress
                ? 'bg-primary-legacy/50 text-white/70 cursor-wait'
                : 'bg-primary-legacy hover:bg-primary-legacy/90 text-white shadow-glow-sm'
            }`}
            onClick={handleSign}
            disabled={isSigningInProgress}
          >
            {isSigningInProgress ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Sign with Signet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;