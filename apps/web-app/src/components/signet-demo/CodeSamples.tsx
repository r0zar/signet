import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CodeSamplesProps {
  currentStep: 'connect' | 'data' | 'results';
}

const CodeSamples: React.FC<CodeSamplesProps> = ({ currentStep }) => {
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('typescript');
  
  // Define code samples for each step
  const connectCode = {
    javascript: `// Check if Signet extension is installed and connect
if (window.SignetAPI) {
  console.log("Signet is already connected");
} else {
  // Request connection
  const signetConnect = document.getElementById("signet-connect");
  signetConnect.addEventListener("click", async () => {
    // Wait for connection event
    window.addEventListener("signet-wallet-connected", () => {
      console.log("Signet wallet connected!");
    });
  });
}`,
    typescript: `// Check if Signet extension is installed and connect
interface SignetAPI {
  signStructuredData: (data: Record<string, unknown>) => Promise<{
    signature: string;
    timestamp: number;
    status: 'completed' | 'rejected' | 'failed';
  }>;
}

// Add SignetAPI to window object
declare global {
  interface Window {
    SignetAPI?: SignetAPI;
  }
}

if (window.SignetAPI) {
  console.log("Signet is already connected");
} else {
  // Request connection
  const signetConnect = document.getElementById("signet-connect");
  signetConnect?.addEventListener("click", async () => {
    // Wait for connection event
    window.addEventListener("signet-wallet-connected", () => {
      console.log("Signet wallet connected!");
    });
  });
}`
  };
  
  const dataCode = {
    javascript: `// Prepare structured data for signing
const data = {
  action: "token_transfer",
  from: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
  to: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
  amount: "100",
  token: "STX",
  memo: "Payment for services",
  timestamp: Date.now()
};

// Validate data before sending
function validateData(data) {
  if (!data.action) return false;
  if (!data.amount) return false;
  if (!data.from || !data.to) return false;
  return true;
}

// Only proceed if data is valid
if (validateData(data)) {
  // Ready to sign in the next step
  console.log("Data prepared for signing:", data);
} else {
  console.error("Invalid data format");
}`,
    typescript: `// Prepare structured data for signing
interface TransferData {
  action: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  memo?: string;
  timestamp: number;
}

// Create data object
const data: TransferData = {
  action: "token_transfer",
  from: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
  to: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
  amount: "100",
  token: "STX",
  memo: "Payment for services",
  timestamp: Date.now()
};

// Validate data before sending
function validateData(data: TransferData): boolean {
  if (!data.action) return false;
  if (!data.amount) return false;
  if (!data.from || !data.to) return false;
  return true;
}

// Only proceed if data is valid
if (validateData(data)) {
  // Ready to sign in the next step
  console.log("Data prepared for signing:", data);
} else {
  console.error("Invalid data format");
}`
  };
  
  const signCode = {
    javascript: `// Sign data with Signet extension
async function signWithSignet(data) {
  try {
    // Check if Signet is connected
    if (!window.SignetAPI) {
      throw new Error("Signet extension not connected");
    }
    
    // Request signature
    const result = await window.SignetAPI.signStructuredData(data);
    
    // Handle successful signature
    console.log("Signature:", result.signature);
    console.log("Status:", result.status);
    console.log("Timestamp:", new Date(result.timestamp));
    
    return result;
  } catch (error) {
    console.error("Signing failed:", error);
    throw error;
  }
}

// Use the function
const data = { /* your data object */ };
signWithSignet(data)
  .then(result => {
    // Process the signature
    verifySignature(result.signature, data);
  })
  .catch(err => {
    // Handle errors
    showErrorToUser(err.message);
  });`,
    typescript: `// Sign data with Signet extension
interface SignatureResult {
  signature: string;
  timestamp: number;
  status: 'completed' | 'rejected' | 'failed';
}

async function signWithSignet(data: Record<string, unknown>): Promise<SignatureResult> {
  try {
    // Check if Signet is connected
    if (!window.SignetAPI) {
      throw new Error("Signet extension not connected");
    }
    
    // Request signature
    const result = await window.SignetAPI.signStructuredData(data);
    
    // Handle successful signature
    console.log("Signature:", result.signature);
    console.log("Status:", result.status);
    console.log("Timestamp:", new Date(result.timestamp));
    
    return result;
  } catch (error) {
    console.error("Signing failed:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Use the function
const data: Record<string, unknown> = { /* your data object */ };
signWithSignet(data)
  .then(result => {
    // Process the signature
    verifySignature(result.signature, data);
  })
  .catch((err: Error) => {
    // Handle errors
    showErrorToUser(err.message);
  });`
  };
  
  // Get the appropriate code based on step and language
  const getCode = () => {
    if (currentStep === 'connect') return connectCode[language];
    if (currentStep === 'data') return dataCode[language];
    return signCode[language];
  };
  
  return (
    <motion.div
      className="max-w-4xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="bg-gray-900/30 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="text-base font-medium text-white">Code Reference</div>
          
          <div className="flex p-0.5 bg-gray-800/70 rounded-lg border border-gray-700/50 shadow-inner">
            <button
              onClick={() => setLanguage('javascript')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                language === 'javascript'
                  ? 'bg-yellow-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setLanguage('typescript')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                language === 'typescript'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              TypeScript
            </button>
          </div>
        </div>
        
        <div className="max-h-[350px] overflow-auto">
          <div className="relative">
            <pre className="text-sm font-mono p-5 text-gray-300 overflow-x-auto">
              <code>
                {getCode()}
              </code>
            </pre>
            
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => {
                  const code = getCode();
                  navigator.clipboard.writeText(code);
                  
                  // Show a simple toast
                  const toast = document.createElement('div');
                  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm transition-opacity duration-300';
                  toast.textContent = 'Code copied to clipboard!';
                  document.body.appendChild(toast);
                  
                  setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => document.body.removeChild(toast), 300);
                  }, 2000);
                }}
                className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 text-xs text-white transition-colors flex items-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy Code
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex border-t border-gray-800 divide-x divide-gray-800">
          <a
            href="https://docs.signet.network/sdk/reference"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 text-center text-sm text-primary-legacy hover:text-primary-legacy/80 transition-colors"
          >
            SDK Reference
          </a>
          <a
            href="https://github.com/signet-examples/react-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 text-center text-sm text-primary-legacy hover:text-primary-legacy/80 transition-colors"
          >
            Example Projects
          </a>
          <a
            href="https://discord.gg/signet-community"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 text-center text-sm text-primary-legacy hover:text-primary-legacy/80 transition-colors"
          >
            Developer Community
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeSamples;