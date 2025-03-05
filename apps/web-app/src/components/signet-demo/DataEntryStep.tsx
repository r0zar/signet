import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { showNotification } from '../../utils/notification';

interface DataEntryStepProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const DataEntryStep: React.FC<DataEntryStepProps> = ({ onSubmit }) => {
  // State for data template selection and editing
  const [template, setTemplate] = useState<'transfer' | 'message'>('transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidData, setIsValidData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [jsonValue, setJsonValue] = useState('');
  
  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Default data templates
  const transferTemplate = {
    action: "token_transfer",
    from: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    to: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
    amount: "100",
    token: "STX",
    memo: "Payment for services",
    timestamp: Date.now()
  };
  
  const messageTemplate = {
    action: "message_attestation",
    message: "I agree to the terms and conditions",
    user: "user123",
    domain: window.location.hostname,
    timestamp: Date.now()
  };
  
  // Update the JSON data when template changes
  useEffect(() => {
    const data = template === 'transfer' ? transferTemplate : messageTemplate;
    const formattedJson = JSON.stringify(data, null, 2);
    setJsonValue(formattedJson);
    
    if (textareaRef.current) {
      textareaRef.current.value = formattedJson;
    }
    
    // Reset validation state
    setIsValidData(true);
    setErrorMessage('');
  }, [template]);
  
  // Handle JSON change
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonValue(value);
    
    try {
      JSON.parse(value);
      setIsValidData(true);
      setErrorMessage('');
    } catch (err) {
      setIsValidData(false);
      setErrorMessage('Invalid JSON format');
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!isValidData) {
      showNotification('error', {
        title: 'Invalid Data',
        message: errorMessage || 'Please provide valid JSON data'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Parse JSON data
      const data = JSON.parse(jsonValue);
      
      // Validate required fields
      if (template === 'transfer') {
        if (!data.action || !data.amount || !data.from || !data.to) {
          throw new Error('Required fields missing for token transfer');
        }
      } else {
        if (!data.message) {
          throw new Error('Message content is required');
        }
      }
      
      // Update timestamp to current time
      data.timestamp = Date.now();
      
      // Submit the data
      await onSubmit(data);
    } catch (error) {
      console.error('Data submission error:', error);
      setIsSubmitting(false);
      
      showNotification('error', {
        title: 'Submission Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Data to Sign</h3>
            
            <div className="flex p-0.5 bg-gray-800/70 rounded-lg border border-gray-700/50 shadow-inner">
              <button
                onClick={() => setTemplate('transfer')}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  template === 'transfer'
                    ? 'bg-primary-legacy text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Token Transfer
              </button>
              <button
                onClick={() => setTemplate('message')}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  template === 'message'
                    ? 'bg-primary-legacy text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Message Signing
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden transition-all">
            <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-mono text-gray-500">structured-data.json</div>
              </div>
              
              <button
                onClick={() => {
                  // Reset to original template
                  const data = template === 'transfer' ? transferTemplate : messageTemplate;
                  const formattedJson = JSON.stringify(data, null, 2);
                  setJsonValue(formattedJson);
                  
                  if (textareaRef.current) {
                    textareaRef.current.value = formattedJson;
                  }
                  
                  setIsValidData(true);
                  setErrorMessage('');
                }}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={12}
                className={`w-full px-4 py-3 bg-gray-900/80 text-white font-mono text-sm focus:outline-none resize-none transition-colors ${!isValidData ? 'border-red-500 bg-red-900/10' : ''}`}
                spellCheck="false"
                defaultValue={jsonValue}
                onChange={handleJsonChange}
              />
              
              {!isValidData && (
                <div className="absolute bottom-2 left-2 right-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-800/50">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-legacy mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-white">About {template === 'transfer' ? 'Token Transfers' : 'Message Signing'}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {template === 'transfer' 
                ? 'This demo shows how to securely sign token transfer data. In a real application, this would authorize moving tokens from one address to another.' 
                : 'Message signing allows you to prove ownership of your wallet by signing a plain text message. This is commonly used for authentication and attestations.'}
            </p>
          </div>
          
          <button
            className={`w-full py-3.5 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
              isSubmitting 
                ? 'bg-primary-legacy/60 cursor-wait' 
                : isValidData
                  ? 'bg-primary-legacy hover:bg-primary-legacy/90 shadow-lg'
                  : 'bg-gray-700 cursor-not-allowed'
            } text-white`}
            onClick={handleSubmit}
            disabled={isSubmitting || !isValidData}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sign Data</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
      
      <motion.div
        className="space-y-6 hidden md:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gray-900/40 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="text-sm font-medium text-white">Data Structure Preview</div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400 font-mono">
              {template === 'transfer' ? 'Token Transfer' : 'Message Signing'}
            </div>
          </div>
          
          <div className="p-5 space-y-5">
            {template === 'transfer' ? (
              <>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Currency Transfer</div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-white mr-2">100</span>
                      <span className="text-sm text-gray-400">STX</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-800"></div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">From</span>
                    <span className="text-white font-mono">SP2ZNG...55KS</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">To</span>
                    <span className="text-white font-mono">SP3FBR...SVTE</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Memo</span>
                    <span className="text-white">Payment for services</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Message Attestation</div>
                    <div className="text-sm text-gray-300">
                      "I agree to the terms and conditions"
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-800"></div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Domain</span>
                    <span className="text-white">{window.location.hostname}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">User</span>
                    <span className="text-white">user123</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Timestamp</span>
                    <span className="text-white">Just now</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900/40 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="text-sm font-medium text-white">What happens next?</div>
          </div>
          
          <div className="p-5">
            <ol className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary-legacy/15 border border-primary-legacy/30 flex items-center justify-center text-xs text-primary-legacy font-medium mr-3">
                  1
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Data Signing</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your data will be securely signed by the Signet extension without exposing your private keys
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary-legacy/15 border border-primary-legacy/30 flex items-center justify-center text-xs text-primary-legacy font-medium mr-3">
                  2
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Signature Generation</p>
                  <p className="text-xs text-gray-400 mt-1">
                    A unique cryptographic signature will be created specifically for this data
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary-legacy/15 border border-primary-legacy/30 flex items-center justify-center text-xs text-primary-legacy font-medium mr-3">
                  3
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Signature Verification</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You'll see the result and can verify the signature integrity
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataEntryStep;