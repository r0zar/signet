import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'

// Import the components
import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
    ],
  },
])

// Simple function to check for extension and update status
const initExtensionConnectivity = () => {
  let connectionChecked = false;
  
  const updateExtensionStatus = (isConnected: boolean) => {
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const connectionDetails = document.getElementById('connection-details');
    
    if (!statusIcon || !statusText || !connectionDetails) return;
    
    if (isConnected) {
      // Connected
      statusIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      `;
      statusIcon.className = "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center";
      statusText.textContent = "Extension Connected";
      statusText.className = "text-lg font-medium text-green-500";
      connectionDetails.textContent = "Signet Signer extension is installed and connected to this page.";
    } else {
      // Not connected
      statusIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      `;
      statusIcon.className = "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center";
      statusText.textContent = "Extension Not Detected";
      statusText.className = "text-lg font-medium text-red-500";
      connectionDetails.textContent = "The Signet Signer extension is not installed or is disabled. Please install it from the Chrome Web Store.";
    }
    
    connectionChecked = true;
  };
  
  const checkExtension = () => {
    // Check for either the API or the flag
    if (typeof window.SignetAPI !== 'undefined' || window.SIGNET_EXTENSION_INSTALLED === true) {
      updateExtensionStatus(true);
      return true;
    } else {
      // Not immediately available, let's wait before final conclusion
      if (connectionChecked) {
        updateExtensionStatus(false);
      }
      return false;
    }
  };
  
  // Initial check
  document.addEventListener('DOMContentLoaded', () => {
    const statusBox = document.getElementById('extension-status-box');
    const checkButton = document.getElementById('check-connection');
    
    if (!statusBox || !checkButton) {
      setTimeout(() => {
        // Try again if elements aren't available yet
        const retryBox = document.getElementById('extension-status-box');
        const retryButton = document.getElementById('check-connection');
        
        if (retryBox && retryButton) {
          checkExtension();
          retryButton.addEventListener('click', checkExtension);
        }
      }, 1000);
      return;
    }
    
    // First check
    setTimeout(checkExtension, 500);
    
    // Set up manual check button
    checkButton.addEventListener('click', () => {
      const statusText = document.getElementById('status-text');
      const connectionDetails = document.getElementById('connection-details');
      
      if (statusText && connectionDetails) {
        statusText.textContent = "Checking extension status...";
        statusText.className = "text-lg font-medium text-yellow-500";
        connectionDetails.textContent = "Connecting to Signet Signer extension...";
      }
      
      setTimeout(checkExtension, 100);
    });
    
    // Listen for the extension's ready event
    window.addEventListener('signet-api-ready', () => {
      updateExtensionStatus(true);
    });
  });
};

// Add debug logs to see if extension is present
console.log("[Web App] Page loading, checking for extension marker...");

// Check for extension marker every second, up to 10 seconds
let checkCount = 0;
const maxChecks = 10;

function checkExtensionMarker() {
  if (checkCount >= maxChecks) {
    console.log("[Web App] Extension detection timed out after", maxChecks, "attempts");
    updateWalletStatus();
    return;
  }
  
  checkCount++;
  
  // Check for multiple possible indicators of extension presence
  const markerElement = document.getElementById('signet-extension-marker');
  const hasMarker = !!markerElement;
  const hasGlobalFlag = typeof window.SIGNET_EXTENSION_INSTALLED !== 'undefined';
  const hasAPI = typeof window.SignetAPI !== 'undefined';
  
  console.log("[Web App] Extension check:", {
    attempt: checkCount,
    hasMarkerElement: hasMarker,
    hasGlobalFlag,
    hasAPI,
    extensionAPIObject: window.SignetAPI
  });
  
  // Update UI based on detection
  updateWalletStatus(hasMarker, hasAPI);
  
  if (!hasMarker && !hasGlobalFlag && !hasAPI) {
    setTimeout(checkExtensionMarker, 1000);
  }
}

// Helper function to update wallet status elements in UI
function updateWalletStatus(hasMarker = false, hasAPI = false) {
  const statusText = document.getElementById('status-text');
  const statusIcon = document.getElementById('status-icon');
  const connectionDetails = document.getElementById('connection-details');
  
  if (!statusText || !statusIcon || !connectionDetails) {
    return; // Elements not ready yet
  }
  
  if (hasAPI) {
    // Connected
    statusText.textContent = "Wallet Connected";
    statusText.className = "text-lg font-medium text-green-500";
    statusIcon.className = "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center";
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    `;
    connectionDetails.textContent = "Your Signet wallet is connected to this dApp.";
  } else if (hasMarker) {
    // Extension detected but not connected
    statusText.textContent = "Connection Required";
    statusText.className = "text-lg font-medium text-yellow-500";
    statusIcon.className = "w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center";
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    `;
    connectionDetails.textContent = "Please click 'Connect Wallet' to continue.";
  } else {
    // No extension detected
    statusText.textContent = "Extension Not Detected";
    statusText.className = "text-lg font-medium text-red-500";
    statusIcon.className = "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center";
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    `;
    connectionDetails.textContent = "Please install the Signet Signer extension.";
  }
}

// Start checking shortly after page loads
setTimeout(checkExtensionMarker, 500);

// Initialize the signing demo functionality
const initSigningDemo = () => {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("[Web App] DOM loaded, initializing signing demo");
    
    // Check if demo elements are available
    const checkElements = () => {
      const structuredDataInput = document.getElementById('structuredData') as HTMLTextAreaElement;
      const signButton = document.getElementById('signButton');
      const signStatus = document.getElementById('signStatus');
      const signatureOutput = document.getElementById('signatureOutput');

      if (!structuredDataInput || !signButton || !signStatus || !signatureOutput) {
        console.log('[Web App] Signing demo elements not found, will try to initialize later');
        setTimeout(checkElements, 1000);
        return;
      }

      // Handle signing request
      // Create a more visible extension status indicator
      const createStatusIndicator = () => {
        const container = document.createElement('div');
        container.className = 'rounded-md p-3 mb-4 flex items-center';
        container.id = 'extension-status-container';
        
        const icon = document.createElement('div');
        icon.className = 'mr-3 flex-shrink-0';
        icon.innerHTML = `<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"></svg>`;
        
        const textDiv = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'text-sm font-medium';
        title.id = 'extension-status-title';
        
        const message = document.createElement('div');
        message.className = 'text-sm';
        message.id = 'extension-status-message';
        
        textDiv.appendChild(title);
        textDiv.appendChild(message);
        container.appendChild(icon);
        container.appendChild(textDiv);
        
        // Insert before the form
        const formParent = structuredDataInput.closest('.space-y-4');
        if (formParent && formParent.parentNode) {
          formParent.parentNode.insertBefore(container, formParent);
        }
        
        return {
          container,
          icon: icon.querySelector('svg'),
          title,
          message
        };
      };
      
      const statusIndicator = createStatusIndicator();
      
      // Update the status indicator
      const updateStatus = (status: 'loading' | 'success' | 'error', title: string, message: string) => {
        if (!statusIndicator) return;
        
        statusIndicator.container.className = 'rounded-md p-3 mb-4 flex items-center ' + 
          (status === 'loading' ? 'bg-blue-50 dark:bg-blue-900/30' : 
           status === 'success' ? 'bg-green-50 dark:bg-green-900/30' : 
           'bg-red-50 dark:bg-red-900/30');
        
        // Set the appropriate icon based on status
        if (status === 'loading' && statusIndicator.icon && statusIndicator.icon.parentElement) {
          statusIndicator.icon.parentElement.innerHTML = `
            <div class="mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>`;
        } else if (status === 'success' && statusIndicator.icon && statusIndicator.icon.parentElement) {
          statusIndicator.icon.parentElement.innerHTML = `
            <div class="mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>`;
        } else if (statusIndicator.icon && statusIndicator.icon.parentElement) {
          statusIndicator.icon.parentElement.innerHTML = `
            <div class="mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>`;
        }
        
        // Update after replacing SVG element
        if (statusIndicator.icon && statusIndicator.icon.parentElement) {
          const newSvg = statusIndicator.icon.parentElement.querySelector('svg');
          if (newSvg) {
            statusIndicator.icon = newSvg;
          }
        }
        
        statusIndicator.title.className = 'text-sm font-medium ' + 
          (status === 'loading' ? 'text-blue-800 dark:text-blue-300' : 
           status === 'success' ? 'text-green-800 dark:text-green-300' : 
           'text-red-800 dark:text-red-300');
        statusIndicator.title.textContent = title;
        
        statusIndicator.message.className = 'text-sm ' + 
          (status === 'loading' ? 'text-blue-700 dark:text-blue-200' : 
           status === 'success' ? 'text-green-700 dark:text-green-200' : 
           'text-red-700 dark:text-red-200');
        statusIndicator.message.textContent = message;
        
        // Also update the status text for compatibility
        if (signStatus) {
          signStatus.textContent = title;
          signStatus.className = 'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md ' + 
            (status === 'loading' ? 'text-blue-400' : 
             status === 'success' ? 'text-green-400' : 
             'text-red-400');
        }
      };
      
      // Show initial loading status
      updateStatus('loading', 'Checking for extension...', 'Searching for Signet Signer extension');
      
      // Check for SignetAPI every second for up to 10 seconds
      let checkCount = 0;
      const maxChecks = 20; // Increased number of checks
      
      const checkForAPI = () => {
        // Check if window.SignetAPI exists
        if (typeof window.SignetAPI !== 'undefined') {
          updateStatus('success', 'Extension detected!', 'Signet Signer is ready to use');
          return true;
        } else {
          checkCount++;
          if (checkCount < maxChecks) {
            setTimeout(checkForAPI, 500); // Check more frequently
          } else {
            updateStatus('error', 'Extension not detected', 'Please install the Signet Signer extension');
          }
          return false;
        }
      };
      
      // Start checking immediately
      checkForAPI();
      
      // Listen for API ready event
      window.addEventListener('signet-api-ready', () => {
        updateStatus('success', 'Extension detected!', 'Signet Signer is ready to use');
      });
      
      signButton.addEventListener('click', async () => {
        let structuredData;

        try {
          structuredData = JSON.parse(structuredDataInput.value);
        } catch (error) {
          signStatus.textContent = 'Invalid JSON in structured data';
          signStatus.classList.add('text-red-500');
          return;
        }

        // Check if the extension is available
        if (!window.SignetAPI) {
          signStatus.textContent = 'Extension not detected. Please install Signet Signer.';
          signStatus.classList.add('text-red-500');
          return;
        }

        // Update status
        signStatus.textContent = 'Signing data...';
        signStatus.classList.remove('text-red-500', 'text-green-500');
        signStatus.classList.add('text-yellow-500');
        signatureOutput.textContent = '';

        try {
          // Call the extension to sign the data - no need to provide a private key as it's handled by extension
          const signature = await window.SignetAPI.signStructuredData(structuredData);
          
          // Update UI with success
          signStatus.textContent = 'Successfully signed data!';
          signStatus.classList.remove('text-yellow-500', 'text-red-500');
          signStatus.classList.add('text-green-500');
          signatureOutput.textContent = JSON.stringify(signature, null, 2);
        } catch (error: any) {
          // Update UI with error
          signStatus.textContent = `Error: ${error?.message || 'Unknown error'}`;
          signStatus.classList.remove('text-yellow-500', 'text-green-500');
          signStatus.classList.add('text-red-500');
          signatureOutput.textContent = JSON.stringify({ error: error?.message || 'Unknown error' }, null, 2);
        }
      });
    };

    checkElements();
  });
};

// Global types are defined in vite-env.d.ts

// Initialize both features when the page loads
if (typeof window !== 'undefined') {
  initExtensionConnectivity();
  initSigningDemo();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)