import { createClerkClient } from '@clerk/chrome-extension/background';
import { signStructuredData } from '@stacks/transactions';
import { generateWallet } from '@stacks/wallet-sdk';

console.log('[Service Worker]: Loaded - ' + new Date().toLocaleTimeString())

// Helper function to log with timestamp
function logWithTime(message, data = null) {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[Service Worker ${timestamp}]: ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
}

// Log startup information
logWithTime('Signet Extension service worker initialized');
logWithTime('Extension ID:', chrome.runtime.id);

// Set up listeners for debugging
chrome.runtime.onInstalled.addListener((details) => {
  logWithTime('Extension installed or updated:', details.reason);
});

chrome.runtime.onConnect.addListener((port) => {
  logWithTime('Connection established on port:', port.name);
  
  port.onDisconnect.addListener(() => {
    logWithTime('Port disconnected:', port.name);
  });
});

const publishableKey = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY
if (!publishableKey) {
  throw new Error('Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file')
}

async function getToken() {
  const clerk = await createClerkClient({
    publishableKey,
    syncHost: process.env.PLASMO_PUBLIC_CLERK_SYNC_HOST
  });

  // is there is no signed in user then return null
  if (!clerk.session) {
    return null;
  }

  const token = await clerk.session?.getToken();
  return `${token} - ${clerk.user.id}`
}

// List of trusted origins that can request auto-signing
const TRUSTED_ORIGINS = [
  'http://localhost:5173',  // For local development testing
  'https://trusted-app-1.com',
  'https://trusted-app-2.com'
];

// Sign structured data if the request is from a trusted dApp
async function signStructuredDataRequest(domain, message, origin) {
  logWithTime(`Attempting to sign structured data from: ${origin}`);
  logWithTime('Domain:', domain);
  logWithTime('Message:', message);

  // Check if the origin is trusted
  if (!TRUSTED_ORIGINS.includes(origin)) {
    logWithTime(`Origin not trusted for auto-signing: ${origin}`);
    return { success: false, error: 'Origin not trusted for auto-signing' };
  }

  try {
    logWithTime('Origin trusted, proceeding with signing');
    
    // Create a Stacks private key from the provided key
    // Using a test key for development - this should be replaced with proper key management
    const wallet = await generateWallet({ secretKey: 'test-key', password: 'test-password' });
    const privateKey = wallet.accounts[0].stxPrivateKey;
    logWithTime('Wallet generated successfully');

    // Sign the structured data hash
    const signature = signStructuredData({
      domain,
      message,
      privateKey
    });

    logWithTime('Data signed successfully');
    logWithTime('Signature:', signature);
    
    return { success: true, signature };
  } catch (error) {
    logWithTime('Error signing data:', error);
    return { success: false, error: error.message || 'Unknown error during signing' };
  }
}

// Create a listener to listen for messages from content scripts
// NOTE: A runtime listener cannot be async.
//       It must return true, in order to keep the connection open and send a response later.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const tabId = sender.tab?.id || 'unknown';
  const url = sender.url || sender.tab?.url || 'unknown';
  const origin = sender.origin || (new URL(url)).origin;
  
  logWithTime(`Message received from tab ${tabId} (${url}):`);
  logWithTime('Request type:', request.type);
  logWithTime('Sender details:', {
    tabId,
    url,
    origin,
    frameId: sender.frameId
  });
  
  // Handle token requests
  if (request.type === 'getToken') {
    logWithTime('Handling request for the user\'s current token');
    
    getToken()
      .then((token) => {
        logWithTime('Token retrieved successfully');
        logWithTime('Token:', token);
        sendResponse({ token });
      })
      .catch((error) => {
        logWithTime('Error retrieving token:', error);
        // Send `null` when there is no authenticated user
        sendResponse({ token: null });
      });
    return true;
  }

  // Handle signing requests
  if (request.type === 'signStructuredData') {
    logWithTime(`Handling structured data signing request from: ${origin}`);
    logWithTime('Request payload:', request);

    const { domain, message } = request;
    
    signStructuredDataRequest(domain, message, origin)
      .then((result) => {
        logWithTime('Signing complete, sending result back to content script');
        logWithTime('Result:', result);
        sendResponse(result);
      })
      .catch((error) => {
        logWithTime('Error in signing process:', error);
        sendResponse({ 
          success: false, 
          error: error.message || 'Unknown error during signing process' 
        });
      });
    return true;
  }
  
  // Handle notification events (for debugging)
  if (request.type === 'notificationShown') {
    logWithTime('Notification shown event received:', request.data);
    sendResponse({ received: true });
    return true;
  }
  
  // Handle test function calls
  if (request.type === 'testFunctionCalled') {
    logWithTime('Test function called:', request.data);
    sendResponse({ received: true });
    return true;
  }
  
  // Handle notification component ready event
  if (request.type === 'notificationComponentReady') {
    logWithTime('Notification component initialized on page:', request.data);
    sendResponse({ received: true });
    return true;
  }
  
  // Handle test helpers loaded event
  if (request.type === 'testHelpersLoaded') {
    logWithTime('Test helpers loaded on page:', request.data);
    sendResponse({ received: true });
    return true;
  }
  
  // Handle test event received
  if (request.type === 'testEventReceived') {
    logWithTime('Test event successfully dispatched and caught on page:', request.data);
    sendResponse({ received: true });
    return true;
  }

  // Default response for unknown request types
  logWithTime('Unknown request type received:', request.type);
  sendResponse({ error: 'Unknown request type' });
  return true;
});

