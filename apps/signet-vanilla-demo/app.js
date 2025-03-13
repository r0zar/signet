// Import SDK functionality
import {
  subscribe,
  MessageType,
  checkExtensionInstalled,
  getSignetStatus,
  getBalance,
  getBalances,
  createTransfer,
  requestTransactionCustody,
  searchMempool,
  getSubnetIds,
  getSubnetData
} from 'signet-sdk';

// State tracking
let extensionAvailable = false;
let currentStatus = null;
let selectedSubnetId = null;  // Currently selected subnet ID
let subnets = {};           // Map of subnet IDs to subnet data
let lastTransactionSignature = null; // For custody demonstration

// Message tracking for debugging
const messageTracker = {
  counts: { extension: 0, status: 0, balance: 0, transfer: 0, mining: 0, custody: 0, search: 0 },
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
    } else if (type === MessageType.REQUEST_TRANSACTION_CUSTODY) {
      this.counts.custody++;
    } else if (type === MessageType.SEARCH_MEMPOOL) {
      this.counts.search++;
    }

    // Update the debug badge - simplified
    const badge = document.getElementById('debug-badge');
    if (badge) {
      const total = this.counts.extension + this.counts.status +
        this.counts.balance + this.counts.transfer + this.counts.mining + 
        this.counts.custody + this.counts.search;
      badge.textContent = `API Calls: ${total}`;
    }
  }
};

// Initialize the app
function init() {
  // Listen for messages from the extension
  subscribe((message) => {
    // Track message for debugging
    messageTracker.track(message.type);

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
        console.log('Status result:', result);

        // Store the status result
        currentStatus = result;

        // Clear previous subnets and reset selection
        subnets = {};

        // Check if we have any subnets
        const subnetIds = getSubnetIds(result);
        const hasSubnets = subnetIds.length > 0;

        if (hasSubnets) {
          console.log('Found subnets:', subnetIds);

          // Store subnet data
          for (const subnetId of subnetIds) {
            subnets[subnetId] = result[subnetId];
          }

          // Select first subnet as default if not already selected
          if (!selectedSubnetId || !result[selectedSubnetId]) {
            selectedSubnetId = subnetIds[0];
          }

          // Get info for the selected subnet
          const subnetData = result[selectedSubnetId];
          console.log('Selected subnet:', selectedSubnetId, subnetData);

          // Update UI based on subnet data
          updateUI(selectedSubnetId, subnetData);

          // Enable operations if we have a signer
          const hasSigner = !!subnetData.signer;
          enableOperations(hasSigner);
        } else {
          console.log('No subnets found');

          // Reset state
          selectedSubnetId = null;

          // Update UI for disconnected state
          hideAllBadges();
          disableOperations();
        }

        // Display the message
        displayMessage({
          type: 'Status Check',
          data: result
        });
      })
      .catch(error => {
        console.error('Status check failed:', error);

        // Reset state
        selectedSubnetId = null;
        subnets = {};

        // Update UI for disconnected state
        hideAllBadges();
        disableOperations();

        // Display error
        displayMessage({
          type: 'Error',
          error: error.message || 'Failed to get status'
        });
      });
  });

  // Set up subnet action handlers
  document.getElementById('get-balance').addEventListener('click', () => {
    if (!selectedSubnetId) {
      displayMessage({
        type: 'Error',
        error: 'No subnet selected'
      });
      return;
    }

    // Get the subnet data
    const subnetData = subnets[selectedSubnetId];
    if (!subnetData) {
      displayMessage({
        type: 'Error',
        error: 'Selected subnet data not found'
      });
      return;
    }

    // Get the signer address if available
    const signerAddress = subnetData.signer;

    // Call getBalance with the subnet ID
    getBalance(selectedSubnetId, signerAddress)
      .then(result => {
        displayMessage({
          type: 'Get Balance',
          data: result
        });

        // Update the connection badge to show balance
        const connectionBadge = document.getElementById('connection-badge');
        const balance = Object.values(result)[0] || 0;
        const tokenShort = subnetData.token.split('::')[1] || 'tokens';
        connectionBadge.textContent = `Balance: ${balance} ${tokenShort}`;
      })
      .catch(error => {
        displayMessage({
          type: 'Error',
          error: error.message
        });
      });
  });

  document.getElementById('get-all-balances').addEventListener('click', () => {
    // Get balances across all subnets - no subnet parameter needed
    getBalances()
      .then(result => {
        displayMessage({
          type: 'Get All Balances',
          data: result
        });

        // Update the connection badge to show summary of balances if we have results
        if (Object.keys(result).length > 0) {
          const connectionBadge = document.getElementById('connection-badge');
          const totalSubnets = Object.keys(result).length;
          connectionBadge.textContent = `Balances from ${totalSubnets} subnet${totalSubnets !== 1 ? 's' : ''}`;
        }
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
    if (!selectedSubnetId) {
      displayMessage({
        type: 'Error',
        error: 'No subnet selected'
      });
      return;
    }

    const to = document.getElementById('transfer-to').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);

    if (!to || isNaN(amount) || amount <= 0) {
      displayMessage({
        type: 'Error',
        error: 'Please provide a valid recipient address and amount'
      });
      return;
    }

    const nonce = Date.now();
    createTransfer({ subnetId: selectedSubnetId, to, amount, nonce })
      .then(result => {
        displayMessage({
          type: 'Create Transfer',
          data: result
        });
        
        // Enable request custody if we have a transaction in the response
        if (result.success && result.transaction) {
          // Store transaction properties for search/custody
          // This simulates how apps would track their own transactions
          lastTransactionSignature = {
            // These properties get stored in tx.data:
            type: 'transfer',
            nonce: nonce,
            to: to,
            amount: parseFloat(amount),
            subnetId: selectedSubnetId
          };
          
          // Show the custody request UI
          const custodyControls = document.getElementById('custody-actions');
          if (custodyControls) {
            custodyControls.classList.add('enabled');
            const custodyButton = document.getElementById('request-custody');
            if (custodyButton) {
              custodyButton.removeAttribute('disabled');
              custodyButton.classList.remove('disabled');
            }
          }
        }

        // Clear form
        // document.getElementById('transfer-to').value = '';
        // document.getElementById('transfer-amount').value = '';
        // document.querySelector('.transfer-form').style.display = 'none';
      })
      .catch(error => {
        displayMessage({
          type: 'Error',
          error: error.message
        });
      });
  });

  // Perform initial extension check on app startup with a delay
  console.log('Scheduling initial extension check...');

  // First show a loading message
  displayMessage({
    type: 'Initializing',
    message: 'Starting Signet SDK demo...'
  });

  // Delay for UX - gives the page time to render before permission prompt
  setTimeout(() => {
    console.log('Performing initial extension check...');

    // First check if extension is installed
    checkExtensionInstalled()
      .then(result => {
        console.log('Initial extension check result:', result);
        extensionAvailable = result.installed;
        updateStatus();
        displayMessage({
          type: 'Initial Extension Check',
          data: result
        });

        // If extension is available, automatically get status after a short delay
        if (result.installed) {
          console.log('Extension is available - getting status...');

          // Message to user
          displayMessage({
            type: 'Connection',
            message: 'Extension detected! Getting Signet status...'
          });

          // Small delay before getting status to avoid UI jank
          setTimeout(() => {
            // Simulate click on get-status button
            document.getElementById('get-status').click();
          }, 1000);
        }
      })
      .catch(error => {
        console.error('Initial extension check failed:', error);
        displayMessage({
          type: 'Error',
          error: error.message
        });
      });
  }, 500);
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

// Update UI based on subnet data
function updateUI(subnetId, subnetData) {
  if (!subnetId || !subnetData) {
    hideAllBadges();
    return;
  }

  console.log('Updating UI for subnet:', subnetId);

  // Update connection badge
  const connectionBadge = document.getElementById('connection-badge');
  connectionBadge.style.display = 'inline-block';

  // Show token in connection badge if available
  if (subnetData.token) {
    const tokenShort = subnetData.token.split('::')[1] || subnetData.token;
    connectionBadge.textContent = `Connected: ${tokenShort}`;
  } else {
    connectionBadge.textContent = `Connected: ${subnetId.split('.')[1] || subnetId}`;
  }

  // Update signer badge if available
  if (subnetData.signer) {
    const shortenedSigner = subnetData.signer.slice(0, 5) + '...' + subnetData.signer.slice(-4);

    const signerBadge = document.getElementById('signer-badge');
    if (signerBadge) {
      signerBadge.textContent = `Signer: ${shortenedSigner}`;
      signerBadge.style.display = 'inline-block';
      signerBadge.classList.remove('outline');
      signerBadge.classList.add('success');
    }

    // Also update balance badge to show subnet
    const balanceBadge = document.getElementById('balance-badge');
    if (balanceBadge) {
      balanceBadge.textContent = `Subnet: ${subnetId.split('.')[1] || subnetId}`;
      balanceBadge.style.display = 'inline-block';
    }
  }

  // Update subnet operations title with token info
  if (subnetData.token) {
    const subnetActionsTitle = document.querySelector('#subnet-actions .panel-title');
    if (subnetActionsTitle) {
      const tokenShort = subnetData.token.split('::')[1] || subnetData.token;
      subnetActionsTitle.textContent = `Get Balance (${tokenShort})`;
    }
  }
}

// Hide all status badges
function hideAllBadges() {
  document.getElementById('connection-badge').style.display = 'none';
  document.getElementById('balance-badge').style.display = 'none';

  const signerBadge = document.getElementById('signer-badge');
  if (signerBadge) {
    signerBadge.style.display = 'none';
  }

  // Reset subnet operations title
  const subnetActionsTitle = document.querySelector('#subnet-actions .panel-title');
  if (subnetActionsTitle) {
    subnetActionsTitle.textContent = 'Get Balance';
  }

  // Update all balances title 
  const allBalancesTitle = document.querySelector('#all-balances-actions .panel-title');
  if (allBalancesTitle) {
    allBalancesTitle.textContent = 'Get All Balances';
  }
}

// Enable operation buttons and panels
function enableOperations(enable = true) {
  console.log('Enable operations:', enable);

  const subnetButtons = document.querySelectorAll('#subnet-actions button');
  const allBalancesButtons = document.querySelectorAll('#all-balances-actions button');
  const transferButtons = document.querySelectorAll('#transfer-actions button');
  // Don't enable custody buttons here - they should only be enabled after a transaction is created

  // Update panels
  const subnetActionsPanel = document.getElementById('subnet-actions');
  const allBalancesPanel = document.getElementById('all-balances-actions');
  const transferActionsPanel = document.getElementById('transfer-actions');
  const custodyActionsPanel = document.getElementById('custody-actions');

  if (enable) {
    subnetActionsPanel.classList.add('enabled');
    allBalancesPanel.classList.add('enabled');
    transferActionsPanel.classList.add('enabled');
    // Don't enable custody panel by default - only after transaction is created
  } else {
    subnetActionsPanel.classList.remove('enabled');
    allBalancesPanel.classList.remove('enabled');
    transferActionsPanel.classList.remove('enabled');
    custodyActionsPanel.classList.remove('enabled');
    
    // Make sure custody button is disabled
    const custodyButton = document.getElementById('request-custody');
    if (custodyButton) {
      custodyButton.setAttribute('disabled', 'disabled');
      custodyButton.classList.add('disabled');
    }
  }

  // Update subnet buttons
  subnetButtons.forEach(button => {
    if (enable) {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    }
  });

  // Update all balances buttons - these can be enabled even if no specific subnet is selected
  allBalancesButtons.forEach(button => {
    if (enable) {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    }
  });

  // Update transfer buttons
  transferButtons.forEach(button => {
    if (enable) {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    }
  });
}

// Disable all operations
function disableOperations() {
  enableOperations(false);
}

// Handle mempool search and custody requests
function initMempoolHandlers() {
  // Mempool search handler
  const searchButton = document.getElementById('search-mempool');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      if (!selectedSubnetId) {
        displayMessage({
          type: 'Error',
          error: 'No subnet selected'
        });
        return;
      }

      // If we have lastTransactionSignature, use that for precise search
      // This shows how an app would find specific transactions it created
      let criteria = {};
      
      if (lastTransactionSignature) {
        // Use the same properties we saved from our last transaction
        criteria = { ...lastTransactionSignature };
        
        // Remove subnetId if present since we pass it separately
        if (criteria.subnetId) {
          delete criteria.subnetId;
        }
      } else {
        // Otherwise just search by signer
        const subnetData = subnets[selectedSubnetId];
        if (subnetData && subnetData.signer) {
          criteria.signer = subnetData.signer;
        }
      }
      
      // Search the mempool with these criteria
      searchMempool(criteria, selectedSubnetId)
        .then(result => {
          displayMessage({
            type: 'Search Mempool',
            data: result
          });
          
          // If we found transactions, enable the custody button
          if (result.success && result.transactions && result.transactions.length > 0) {
            // We already have the transaction criteria in lastTransactionSignature
            // No need to modify it from search results since we used it for the search
            
            // If we don't have lastTransactionSignature but found transactions
            if (!lastTransactionSignature) {
              // Store the latest transaction's details for custody request
              const latestTx = result.transactions[0];
              
              // Store transaction properties (except signature which is masked)
              // We'll use a combination of properties to uniquely identify it
              if (latestTx.type === 'transfer') {
                lastTransactionSignature = {
                  nonce: latestTx.nonce,
                  to: latestTx.to,
                  amount: latestTx.amount,
                  type: latestTx.type
                };
              } else {
                // For other transaction types, just use what we have
                lastTransactionSignature = {
                  nonce: latestTx.nonce,
                  type: latestTx.type
                };
              }
            }
            
            // Enable the custody button
            const custodyButton = document.getElementById('request-custody');
            if (custodyButton) {
              custodyButton.removeAttribute('disabled');
              custodyButton.classList.remove('disabled');
            }
            
            const custodyControls = document.getElementById('custody-actions');
            if (custodyControls) {
              custodyControls.classList.add('enabled');
            }
          } else {
            // No transactions found, disable the custody button
            const custodyButton = document.getElementById('request-custody');
            if (custodyButton) {
              custodyButton.setAttribute('disabled', 'disabled');
              custodyButton.classList.add('disabled');
            }
          }
        })
        .catch(error => {
          displayMessage({
            type: 'Error',
            error: error.message || 'Failed to search mempool'
          });
        });
    });
  }
  
  // Custody request handler
  const custodyButton = document.getElementById('request-custody');
  if (custodyButton) {
    custodyButton.addEventListener('click', () => {
      if (!lastTransactionSignature) {
        displayMessage({
          type: 'Error',
          error: 'No transaction criteria available. Search mempool first.'
        });
        return;
      }

      if (!selectedSubnetId) {
        displayMessage({
          type: 'Error',
          error: 'No subnet selected'
        });
        return;
      }

      // Request custody using search criteria (no signature needed)
      requestTransactionCustody(lastTransactionSignature, selectedSubnetId)
        .then(result => {
          displayMessage({
            type: 'Transaction Custody Request',
            data: result
          });

          // Disable the custody button after successful request
          if (result.success) {
            custodyButton.setAttribute('disabled', 'disabled');
            custodyButton.classList.add('disabled');
            
            const custodyControls = document.getElementById('custody-actions');
            if (custodyControls) {
              custodyControls.classList.remove('enabled');
            }
            
            // Clear the transaction criteria
            lastTransactionSignature = null;
          }
        })
        .catch(error => {
          displayMessage({
            type: 'Error',
            error: error.message || 'Failed to request transaction custody'
          });
        });
    });
  }
}

// Display a message in the log panel
function displayMessage(data) {
  const responseElement = document.getElementById('response');
  responseElement.textContent = JSON.stringify(data, null, 2);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  init();
  initMempoolHandlers();
});