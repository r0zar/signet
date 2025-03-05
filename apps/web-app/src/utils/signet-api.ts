// Types for the Signet Extension API
export interface SignatureResult {
  signature: string;
  message: any;
  timestamp: number;
  status: 'completed' | 'rejected' | 'failed';
}

export interface SignetAPI {
  signStructuredData: (data: any) => Promise<SignatureResult>;
}

// Function to check if the Signet extension is available
export function isSignetExtensionInstalled(): boolean {
  // Check multiple indicators to determine if extension is installed
  const hasSignetAPI = typeof window !== 'undefined' && typeof window.SignetAPI !== 'undefined';
  const hasMarker = document.getElementById('signet-extension-marker') !== null;
  const hasFlag = typeof window !== 'undefined' && window.SIGNET_EXTENSION_INSTALLED === true;
  
  // Check for the extension-specific event listener capability
  const hasEventCapability = typeof window !== 'undefined' && 
    (window.signetEventListenerRegistered === true || 
     typeof window.addEventListener === 'function');
  
  return hasSignetAPI || hasMarker || hasFlag || 
    (hasEventCapability && document.head.querySelector('meta[name="signet-extension-compat"]') !== null);
}

// Function to initialize the Signet API for demo purposes
export function initializeDemoSignetAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.textContent = `
        window.SignetAPI = {
          signStructuredData: function(structuredData) {
            return new Promise(function(resolve, reject) {
              try {
                // Show signing in progress notification
                if (typeof window.signetShowInfo === 'function') {
                  window.signetShowInfo(
                    "Signing in Progress", 
                    "Please wait while we process your signature from " + window.location.hostname
                  );
                } else {
                  window.dispatchEvent(new CustomEvent("signet:show-notification", {
                    detail: {
                      type: "info",
                      title: "Signing in Progress",
                      message: "Please wait while we process your signature from " + window.location.hostname
                    }
                  }));
                }
                
                // Update UI elements
                const signingIndicator = document.getElementById('signing-indicator');
                if (signingIndicator) {
                  signingIndicator.classList.remove('hidden');
                }
                
                const signatureContainer = document.getElementById('signature-container');
                if (signatureContainer) {
                  signatureContainer.classList.add('border-pulse');
                }
                
                // Simulate signing process with delay
                setTimeout(function() {
                  // Hide signing indicator
                  if (signingIndicator) {
                    signingIndicator.classList.add('hidden');
                  }
                  
                  if (signatureContainer) {
                    signatureContainer.classList.remove('border-pulse');
                  }
                  
                  // Show success notification
                  if (typeof window.signetShowSuccess === 'function') {
                    window.signetShowSuccess(
                      "Signature Complete", 
                      "Successfully signed data from " + window.location.hostname
                    );
                  } else {
                    window.dispatchEvent(new CustomEvent("signet:show-notification", {
                      detail: {
                        type: "success",
                        title: "Signature Complete",
                        message: "Successfully signed data from " + window.location.hostname
                      }
                    }));
                  }
                  
                  // Resolve with signature
                  resolve({ 
                    signature: 'sig_' + Math.random().toString(36).substring(2, 15),
                    message: structuredData,
                    timestamp: Date.now(),
                    status: 'completed'
                  });
                }, 1500);
              } catch (err) {
                console.error("Error during signing:", err);
                
                // If notification fails, still proceed with the signing
                setTimeout(function() {
                  resolve({ 
                    signature: 'sig_' + Math.random().toString(36).substring(2, 15),
                    message: structuredData,
                    timestamp: Date.now(),
                    status: 'completed'
                  });
                }, 1500);
              }
            });
          }
        };
        window.SIGNET_EXTENSION_INSTALLED = true;
        window.dispatchEvent(new CustomEvent('signet-wallet-connected'));
      `;
      document.head.appendChild(script);
      resolve();
    } catch (err) {
      console.error("Failed to initialize demo Signet API:", err);
      reject(err);
    }
  });
}

// Global types are defined in vite-env.d.ts