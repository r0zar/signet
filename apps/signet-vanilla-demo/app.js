// Import signet SDK
import { send, request, subscribe } from 'signet-sdk';

// State management
let extensionAvailable = false;
let walletInfo = null;
let lastResponse = null;
let txResult = null;

// Initialize the signet and blaze objects that will contain our methods
const signet = {};
const blaze = {};

// Initialize the SDK
function initializeSignet() {
  console.log('Initializing Signet SDK');

  // Set up listener for extension responses
  const unsubscribe = subscribe((message) => {
    console.log('Received message:', message);

    // Handle extension availability message
    if (message.type === 'SIGNET_AVAILABLE') {
      extensionAvailable = true;
      updateExtensionStatus();
    }

    // Handle wallet info updates
    if (message.type === 'WALLET_INFO_UPDATE') {
      walletInfo = message.data;
      updateWalletInfo();
    }
  });

  // Signal that the page is ready to receive messages from the extension
  window.postMessage({ type: 'SIGNET_SDK_READY' }, '*');

  // Request extension status (if available, it will respond)
  send({ type: 'CHECK_EXTENSION_STATUS', data: {} });

  // Set up signet API methods
  setupSignetAPI();

  // Set up blaze API methods
  setupBlazeAPI();
}

// Set up the Signet API methods
function setupSignetAPI() {
  // System notifications
  signet.showNotification = async (options) => {
    try {
      const response = await request({
        type: 'SHOW_NOTIFICATION',
        data: options
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to show notification:', error);
      updateResponse({ error: error.message });
    }
  };

  // Rich notifications with HTML content
  signet.createRichNotification = async (options) => {
    try {
      const response = await request({
        type: 'RICH_NOTIFICATION',
        data: options
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to create rich notification:', error);
      updateResponse({ error: error.message });
    }
  };

  // Show 3D animation
  signet.show3D = async (color = 'rgb(125, 249, 255)', duration = 5000) => {
    try {
      const response = await request({
        type: 'SHOW_3D',
        data: { color, duration }
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to show 3D animation:', error);
      updateResponse({ error: error.message });
    }
  };

  // Toggle extension visibility
  signet.toggleExtension = async () => {
    try {
      const response = await request({
        type: 'TOGGLE_EXTENSION',
        data: {}
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to toggle extension:', error);
      updateResponse({ error: error.message });
    }
  };

  // Update signet UI options
  signet.setUIOptions = async (options) => {
    try {
      const response = await request({
        type: 'SET_UI_OPTIONS',
        data: options
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to set UI options:', error);
      updateResponse({ error: error.message });
    }
  };

  // Check if extension is available
  Object.defineProperty(signet, 'isAvailable', {
    get: () => extensionAvailable
  });

  // Access wallet info
  Object.defineProperty(signet, 'walletInfo', {
    get: () => walletInfo
  });
}

// Set up the Blaze API methods
function setupBlazeAPI() {
  // Prediction market interaction
  blaze.predict = async (options) => {
    try {
      const response = await request({
        type: 'BLAZE_PREDICT',
        data: options
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to make prediction:', error);
      updateResponse({ error: error.message });
    }
  };

  // Token transfer
  blaze.transfer = async (options) => {
    try {
      const response = await request({
        type: 'BLAZE_TRANSFER',
        data: options
      });
      updateResponse(response);
      updateTxResult(response.data);
      return response;
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      updateResponse({ error: error.message });
    }
  };

  // Get wallet information
  blaze.getWalletInfo = async () => {
    try {
      const response = await request({
        type: 'GET_WALLET_INFO',
        data: {}
      });
      updateResponse(response);
      walletInfo = response.data;
      updateWalletInfo();
      return response.data;
    } catch (error) {
      console.error('Failed to get wallet info:', error);
      updateResponse({ error: error.message });
    }
  };

  // Update UI options
  blaze.setUIOptions = async (options) => {
    try {
      const response = await request({
        type: 'BLAZE_SET_UI_OPTIONS',
        data: options
      });
      updateResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to set UI options:', error);
      updateResponse({ error: error.message });
    }
  };
}

// UI update functions
function updateExtensionStatus() {
  const statusElement = document.getElementById('extension-status');
  if (extensionAvailable) {
    statusElement.textContent = 'Extension Available';
    statusElement.classList.remove('error');
    statusElement.classList.add('success');
  } else {
    statusElement.textContent = 'Extension Not Detected';
    statusElement.classList.remove('success');
    statusElement.classList.add('error');
  }
}

function updateWalletInfo() {
  if (walletInfo) {
    const walletInfoElement = document.getElementById('wallet-info');
    const balanceBadge = document.getElementById('balance-badge');
    const connectionBadge = document.getElementById('connection-badge');

    walletInfoElement.style.display = 'block';
    balanceBadge.textContent = `Balance: ${walletInfo.balance || '0.00'}`;

    if (walletInfo.address) {
      connectionBadge.style.display = 'inline-block';
    } else {
      connectionBadge.style.display = 'none';
    }
  }
}

function updateResponse(data) {
  lastResponse = data;
  const responseContainer = document.getElementById('response-container');
  const responseElement = document.getElementById('response');

  responseContainer.style.display = 'block';
  responseElement.textContent = JSON.stringify(data, null, 2);
}

function updateTxResult(data) {
  if (!data) return;

  txResult = data;
  const txResultElement = document.getElementById('tx-result');
  const txStatusElement = document.getElementById('tx-status');
  const txIdElement = document.getElementById('tx-id');

  txResultElement.style.display = 'block';

  // Update status badge
  txStatusElement.textContent = txResult.status || 'unknown';
  txStatusElement.className = 'badge';

  if (txResult.status === 'confirmed') {
    txStatusElement.classList.add('success');
  } else if (txResult.status === 'pending') {
    txStatusElement.classList.add('outline');
  } else {
    txStatusElement.classList.add('error');
  }

  // Update transaction ID
  if (txResult.txId) {
    txIdElement.textContent = txResult.txId;
  }
}

// UI Event handling
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
  });

  // Basic tab buttons
  document.getElementById('system-notification').addEventListener('click', handleSystemNotification);
  document.getElementById('error-notification').addEventListener('click', handleErrorNotification);
  document.getElementById('transaction-notification').addEventListener('click', handleTransactionNotification);
  document.getElementById('prediction-market').addEventListener('click', handlePredictionMarket);
  document.getElementById('show-3d').addEventListener('click', handleShow3D);
  document.getElementById('toggle-extension').addEventListener('click', handleToggleExtension);

  // Enhanced tab buttons
  document.getElementById('rich-notification').addEventListener('click', handleRichNotification);
  document.getElementById('transfer-tokens').addEventListener('click', handleTransferTokens);
  document.getElementById('get-wallet-info').addEventListener('click', handleGetWalletInfo);
  document.getElementById('set-ui-options').addEventListener('click', handleSetUIOptions);
}

// Button handlers
function handleSystemNotification() {
  signet.showNotification({
    title: 'SYSTEM MESSAGE',
    message: 'This is a system notification',
    details: 'It will auto-dismiss after 5 seconds',
    notificationType: 'SYSTEM',
    duration: 5000
  });
}

function handleErrorNotification() {
  signet.showNotification({
    title: 'ERROR',
    message: 'Something went wrong',
    details: 'Could not complete the operation',
    notificationType: 'ERROR',
    duration: 8000
  });
}

function handleTransactionNotification() {
  signet.showNotification({
    title: 'OP_TRANSFER',
    message: 'Please confirm this transaction',
    details: 'Send 0.1 sBTC to SP123456789',
    notificationType: 'OP_TRANSFER'
  })?.then(response => {
    updateResponse(response);
  });
}

function handlePredictionMarket() {
  blaze.predict({
    marketId: 'market-123',
    marketName: 'Will ETH reach $10k by EOY?',
    outcomeId: 1,
    outcomeName: 'Yes',
    amount: 100,
    potentialPayout: 250
  });
}

function handleShow3D() {
  signet.show3D('rgb(125, 249, 255)', 5000);
}

function handleToggleExtension() {
  signet.toggleExtension();
}

function handleRichNotification() {
  signet.createRichNotification({
    title: 'NFT PURCHASE',
    message: 'You have received an NFT receipt',
    notificationType: 'SYSTEM',
    duration: 10000,
    imageUrl: 'https://placehold.co/600x400/50fa7b/1a1a1a?text=NFT+Receipt',
    htmlContent: `
      <div style="text-align: center; padding: 10px;">
        <h3 style="color: #50fa7b; margin-bottom: 10px;">Prediction Receipt</h3>
        <p style="margin: 5px 0;">Your prediction has been recorded on the blockchain.</p>
        <div style="margin-top: 10px; padding: 8px; background: rgba(80, 250, 123, 0.1); border-radius: 4px;">
          <div style="color: #f1fa8c; font-family: monospace; font-size: 10px;">
            TxHash: 0x71c...9e3f
          </div>
        </div>
      </div>
    `,
    actions: [
      {
        id: 'view',
        label: 'VIEW DETAILS',
        action: 'approve',
        color: 'rgb(80, 250, 123)'
      },
      {
        id: 'dismiss',
        label: 'DISMISS',
        action: 'dismiss'
      }
    ]
  });
}

function handleTransferTokens() {
  blaze.transfer({
    to: 'ST1234567890ABCDEFGHIJKLMNOPQRSTUV',
    amount: 50,
    token: 'WIF',
    memo: 'Demo transfer'
  });
}

function handleGetWalletInfo() {
  blaze.getWalletInfo();
}

function handleSetUIOptions() {
  blaze.setUIOptions({
    theme: 'dark',
    accentColor: '#bd93f9',
    showControls: true
  });

  signet.showNotification({
    title: 'UI UPDATED',
    message: 'UI theme set to dark mode',
    details: 'UI preferences have been updated',
    notificationType: 'SYSTEM',
    duration: 3000
  });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  initializeSignet();
  setupEventListeners();
});

// Export for debugging
window.signet = signet;
window.blaze = blaze;