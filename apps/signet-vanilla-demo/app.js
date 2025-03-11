// Import SDK functionality
import {
  subscribe,
  MessageType,
  checkExtensionInstalled,
  getSignetStatus,
  getBalance,
  getBalances,
  createTransfer
} from 'signet-sdk';

// State tracking
let extensionAvailable = false;
let currentStatus = null;
let activeSubnet = null;
let walletAddress = null;

// Message tracking for debugging
const messageTracker = {
  counts: { extension: 0, status: 0, balance: 0, transfer: 0, mining: 0 },
  track(type) {
    if (type === MessageType.CHECK_EXTENSION_INSTALLED) {
      this.counts.extension++;
    } else if (type === MessageType.GET_STATUS) {
      this.counts.status++;
    } else if (type === MessageType.GET_BALANCE || type === MessageType.GET_BALANCES) {
      this.counts.balance++;
    } else if (type === MessageType.CREATE_TRANSFER_TX) {
      this.counts.transfer++;
    } else if (type === MessageType.MINE_BLOCK || type === MessageType.MINE_ALL_PENDING_BLOCKS) {
      this.counts.mining++;
    }

    // Update the debug badge - simplified
    const badge = document.getElementById('debug-badge');
    if (badge) {
      const total = this.counts.extension + this.counts.status +
        this.counts.balance + this.counts.transfer + this.counts.mining;
      badge.textContent = `API Calls: ${total}`;
    }

    // Log full details to console for debugging
    console.log(`Message counts:`, this.counts);
  }
};

// Initialize the app
function init() {
  // Listen for messages from the extension
  subscribe((message) => {
    // Track message for debugging
    messageTracker.track(message.type);

    // Log message to console
    console.log('Received message:', message);

    // Update UI based on message type
    if (message.type === MessageType.CHECK_EXTENSION_INSTALLED) {
      extensionAvailable = message.data?.installed === true;
      updateStatus();
    } else if (message.type === MessageType.GET_STATUS) {
      // Update state if we get status update
      if (message.data?.connected) {
        // Just update state variables, don't change panel visibility
        activeSubnet = message.data.activeSubnet;
        walletAddress = message.data.wallet?.address;
      }
    }

    // Display the message in the log panel
    displayMessage(message);
  });

  // Set up click handlers
  document.getElementById('check-extension').addEventListener('click', () => {
    checkExtensionInstalled()
      .then(result => {
        extensionAvailable = result.installed;
        updateStatus();
        displayMessage({
          type: 'Manual Extension Check',
          data: result
        });
      });
  });

  document.getElementById('get-status').addEventListener('click', () => {
    getSignetStatus()
      .then(result => {
        // Store essential information only
        currentStatus = result;

        if (result.connected) {
          // Update critical state variables
          activeSubnet = result.activeSubnet;
          walletAddress = result.wallet?.address;

          // Update connection status badge
          const connectionBadge = document.getElementById('connection-badge');
          connectionBadge.style.display = 'inline-block';
          connectionBadge.textContent = `Connected: ${activeSubnet || 'No Subnet'}`;

          // Update wallet badge if available
          if (walletAddress) {
            const shortenedAddress = walletAddress.slice(0, 5) + '...' + walletAddress.slice(-4);
            const balanceBadge = document.getElementById('balance-badge');
            balanceBadge.style.display = 'inline-block';
            balanceBadge.textContent = shortenedAddress;
          }
        } else {
          // Just hide status badges if not connected
          document.getElementById('connection-badge').style.display = 'none';
          document.getElementById('balance-badge').style.display = 'none';

          // Set state variables to null
          activeSubnet = null;
          walletAddress = null;
        }

        displayMessage({
          type: 'Status Check',
          data: result
        });
      });
  });

  // Set up subnet action handlers
  document.getElementById('get-balance').addEventListener('click', () => {
    getBalance()
      .then(result => {
        displayMessage({
          type: 'Get Balance',
          data: result
        });

        // If we have active subnet balance, show it in connection badge
        if (activeSubnet && result[activeSubnet]) {
          const connectionBadge = document.getElementById('connection-badge');
          connectionBadge.textContent = `${activeSubnet}: ${result[activeSubnet]}`;
        }
      })
      .catch(error => {
        displayMessage({
          type: 'Error',
          error: error.message
        });
      });
  });

  document.getElementById('get-all-balances').addEventListener('click', () => {
    getBalances()
      .then(result => {
        displayMessage({
          type: 'Get All Balances',
          data: result
        });
      })
      .catch(error => {
        displayMessage({
          type: 'Error',
          error: error.message
        });
      });
  });

  // Set up transfer handlers
  document.getElementById('create-transfer').addEventListener('click', () => {
    const transferForm = document.querySelector('.transfer-form');
    transferForm.style.display = transferForm.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('submit-transfer').addEventListener('click', () => {
    const to = document.getElementById('transfer-to').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);

    if (!to || isNaN(amount) || amount <= 0) {
      displayMessage({
        type: 'Error',
        error: 'Please provide a valid recipient address and amount'
      });
      return;
    }

    createTransfer({ to, amount, subnet: activeSubnet, nonce: Date.now() })
      .then(result => {
        displayMessage({
          type: 'Create Transfer',
          data: result
        });

        // Clear form
        document.getElementById('transfer-to').value = '';
        document.getElementById('transfer-amount').value = '';
        document.querySelector('.transfer-form').style.display = 'none';
      })
      .catch(error => {
        displayMessage({
          type: 'Error',
          error: error.message
        });
      });
  });

  // Perform initial extension check on app startup
  console.log('Performing initial extension check...');
  checkExtensionInstalled()
    .then(result => {
      console.log('Initial extension check result:', result);
      extensionAvailable = result.installed;
      updateStatus();
      displayMessage({
        type: 'Initial Extension Check',
        data: result
      });

      // Just log that extension is available
      if (result.installed) {
        console.log('Extension is available - click "Get Status" to connect');
      }
    })
    .catch(error => {
      console.error('Initial extension check failed:', error);
      displayMessage({
        type: 'Error',
        error: error.message
      });
    });
}

// Update the extension status badge
function updateStatus() {
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

// Display a message in the log panel
function displayMessage(data) {
  const responseElement = document.getElementById('response');
  responseElement.textContent = JSON.stringify(data, null, 2);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);