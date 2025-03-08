# Signet Extension Integration Guide

This README explains how to integrate your dapp with the Signet Chrome extension notification and event system.

> **Important Update**: The extension now uses CSS isolation techniques to prevent styles from leaking onto the page content. This ensures that extension styles do not interfere with your web application's appearance.
>
> The isolation approach includes:
> 1. Prefixing all CSS classes with `signet-` to avoid collisions
> 2. Using a full-page container with pointer-events set to none (so clicks pass through to the page)
> 3. Applying pointer-events: auto only to interactive components
> 4. Using inline styles for critical elements to avoid global style leakage

## Overview

Signet extension provides a seamless way for dapps to:
- Request transaction signatures
- Request OP_PREDICT operations  
- Display notifications to users
- Receive responses from user interactions

## Sending Events to Signet

Dapps communicate with Signet using the `window.postMessage` API.

### Basic Usage

```javascript
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  title: 'TRANSACTION CONFIRMATION',
  message: 'Please confirm this transaction',
  details: 'Transfer 0.5 sBTC to SP...',
  notificationType: 'OP_TRANSFER',
  duration: 10000 // Optional auto-dismiss after 10 seconds
}, '*');
```

### Supported Event Types

#### UI Control Events
```javascript
// Toggle extension visibility
window.postMessage({ type: 'TOGGLE_EXTENSION' }, '*');

// Show 3D cube notification
window.postMessage({
  type: 'SHOW_3D',
  color: 'rgb(255, 100, 200)', // Optional
  duration: 5000 // Optional auto-dismiss after 5 seconds
}, '*');

// Hide 3D cube notification
window.postMessage({ type: 'HIDE_3D' }, '*');

// Change UI color
window.postMessage({
  type: 'CHANGE_COLOR',
  color: 'rgb(125, 249, 255)'
}, '*');
```

#### Notification Events

##### Basic Notification
```javascript
// Show notification
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  title: 'NOTIFICATION TITLE',
  message: 'Notification message here',
  details: 'Additional details here', // Optional
  color: 'rgb(125, 249, 255)', // Optional
  duration: 5000, // Optional auto-dismiss after 5 seconds
  notificationType: 'OP_TRANSFER' // Optional, defaults to 'SYSTEM'
}, '*');

// Hide current notification
window.postMessage({ type: 'HIDE_NOTIFICATION' }, '*');
```

##### Rich Notifications with Images and HTML
```javascript
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  title: 'NFT PURCHASE SUCCESSFUL',
  message: 'You have successfully purchased an NFT',
  notificationType: 'OP_TRANSFER',
  // Rich content features
  imageUrl: 'https://example.com/nft-image.jpg',
  htmlContent: `
    <div style="text-align: center;">
      <span style="color: #50fa7b; font-weight: bold;">Transaction successful!</span>
      <p>Your new NFT is now in your wallet.</p>
      <div style="font-size: 10px; color: #bd93f9;">
        Transaction hash: 0x71c...9e3f
      </div>
    </div>
  `
}, '*');
```

##### Custom Action Buttons
```javascript
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  title: 'ACCOUNT VERIFICATION',
  message: 'Verify your account to continue',
  notificationType: 'SYSTEM',
  // Custom action buttons
  actions: [
    {
      id: 'skip-action',
      label: 'SKIP',
      action: 'reject',
      color: 'rgb(255, 100, 100)'
    },
    {
      id: 'verify-action',
      label: 'VERIFY NOW',
      action: 'approve',
      color: 'rgb(100, 255, 100)'
    }
  ]
}, '*');
```

### Notification Types

Signet supports several notification types with different behaviors:

1. **TRANSACTION** - For transaction confirmations
   ```javascript
   window.postMessage({
     type: 'SHOW_NOTIFICATION',
     title: 'CONFIRM TRANSACTION',
     message: 'Please confirm this transaction',
     details: 'Send 0.1 sBTC to SP...',
     notificationType: 'OP_TRANSFER'
   }, '*');
   ```

2. **OP_PREDICT** - For prediction market operations (requires explicit user approval)
   ```javascript
   window.postMessage({
     type: 'SHOW_NOTIFICATION',
     title: 'PREDICTION CONFIRMATION',
     message: 'Blaze Protocol signature request',
     details: 'Market: Will sBTC reach $5000 by EOY?',
     notificationType: 'OP_PREDICT'
   }, '*');
   ```
   
   > **Note**: OP_PREDICT notifications will NOT auto-dismiss and require explicit user approval or rejection.

3. **SYSTEM** - System-level notifications
   ```javascript
   window.postMessage({
     type: 'SHOW_NOTIFICATION',
     title: 'SYSTEM NOTIFICATION',
     message: 'Wallet connected successfully',
     notificationType: 'SYSTEM'
   }, '*');
   ```

4. **ERROR** - Error messages
   ```javascript
   window.postMessage({
     type: 'SHOW_NOTIFICATION',
     title: 'ERROR',
     message: 'Failed to connect to wallet',
     details: 'Network error: timeout',
     notificationType: 'ERROR'
   }, '*');
   ```

## Receiving Responses from Signet

To receive responses from Signet (especially important for OP_PREDICT operations), add a message event listener:

```javascript
window.addEventListener('message', (event) => {
  // Validate the message is from Signet
  if (!event.data || typeof event.data !== 'object') return;
  
  // Handle notification responses
  if (event.data.type === 'NOTIFICATION_RESPONSE') {
    const { id, notificationType, approved, result } = event.data;
    
    if (notificationType === 'OP_PREDICT') {
      if (approved) {
        // User approved the prediction market operation
        console.log('User approved prediction:', id);
        
        // Access the detailed result data
        const { transactionHash, signature, receiptId, metadata } = event.data.result;
        
        console.log('Transaction Hash:', transactionHash);
        console.log('Receipt ID:', receiptId);
        
        if (metadata) {
          console.log('Market:', metadata.marketName);
          console.log('Outcome:', metadata.outcomeName);
          console.log('Amount:', metadata.amount);
          console.log('Odds:', metadata.odds);
          console.log('Potential Payout:', metadata.potentialPayout);
        }
        
        // Issue NFT receipt or update UI
      } else {
        // User rejected the prediction market operation
        console.log('User rejected prediction:', id);
        
        // Access the rejection reason
        const { code, message, details } = event.data.rejectionReason || {};
        
        console.log('Rejection Code:', code);
        console.log('Rejection Reason:', message);
        console.log('Details:', details);
        
        // Handle rejection based on reason
      }
    }
  }
  
  // Handle enhanced wallet balance updates
  if (event.data.type === 'WALLET_UPDATE') {
    const { 
      address, 
      balance, 
      previousBalance, 
      delta, 
      reason,
      relatedTransaction 
    } = event.data;
    
    console.log(`Wallet ${address} balance updated: ${balance}`);
    
    if (delta && reason) {
      console.log(`Change: ${delta} due to: ${reason}`);
    }
    
    if (relatedTransaction) {
      console.log(`Related to transaction: ${relatedTransaction.id}`);
      console.log(`Market: ${relatedTransaction.marketName}`);
    }
    
    // Update UI with new balance data
  }
});
```

## Example: Complete OP_PREDICT Flow

Here's a complete example of an OP_PREDICT workflow with enhanced response handling:

```javascript
// 1. Create a unique ID for tracking this request
const requestId = `predict-${Date.now()}`;

// 2. Send the OP_PREDICT request
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  id: requestId,
  title: 'PREDICTION MARKET',
  message: 'Sign prediction market creation',
  details: 'Market: Will BTC hit $100k in 2025?',
  notificationType: 'OP_PREDICT'
}, '*');

// 3. Listen for the response
window.addEventListener('message', (event) => {
  if (
    event.data && 
    typeof event.data === 'object' &&
    event.data.type === 'NOTIFICATION_RESPONSE' &&
    event.data.id === requestId
  ) {
    if (event.data.approved) {
      // User approved - access the enhanced result data
      const result = event.data.result;
      console.log('Prediction approved at:', new Date(event.data.timestamp).toLocaleString());
      console.log('Transaction hash:', result.transactionHash);
      console.log('Receipt ID:', result.receiptId);
      
      // Access the detailed metadata
      if (result.metadata) {
        const { 
          marketId, 
          marketName, 
          outcomeId, 
          outcomeName,
          amount,
          odds,
          potentialPayout,
          feeAmount,
          networkFee
        } = result.metadata;
        
        console.log(`Market: ${marketName} (${marketId})`);
        console.log(`Outcome: ${outcomeName} (${outcomeId})`);
        console.log(`Amount: ${amount} with odds of ${odds}`);
        console.log(`Potential payout: ${potentialPayout}`);
        console.log(`Fees: ${feeAmount} + ${networkFee} network fee`);
      }
      
      // Issue NFT receipt with detailed data
      issueNFTReceipt(result);
    } else {
      // User rejected - access rejection details
      const rejection = event.data.rejectionReason;
      console.log(`Prediction rejected at: ${new Date(event.data.timestamp).toLocaleString()}`);
      
      if (rejection) {
        console.log(`Rejection code: ${rejection.code}`);
        console.log(`Reason: ${rejection.message}`);
        
        // Handle different rejection reasons
        switch(rejection.code) {
          case 'USER_REJECTED':
            showRejectionMessage('User declined the prediction');
            break;
          case 'INSUFFICIENT_FUNDS':
            showRejectionMessage('Insufficient funds for prediction');
            break;
          default:
            showRejectionMessage(rejection.message);
        }
      } else {
        showRejectionMessage('Request was rejected');
      }
    }
  }
});

// 4. Function to issue NFT receipt
function issueNFTReceipt(transactionData) {
  // Issue NFT receipt for the approved prediction
  // ...
  
  // Then notify the user
  window.postMessage({
    type: 'SHOW_NOTIFICATION',
    title: 'RECEIPT ISSUED',
    message: 'NFT receipt has been issued',
    details: 'Check your wallet for the NFT',
    notificationType: 'SYSTEM',
    duration: 5000
  }, '*');
}
```

## Best Practices

1. **Use unique IDs** for each notification to track responses
2. **Set appropriate durations** based on notification importance
3. **Don't auto-dismiss** notifications that require user action
4. **Check for extension presence** before sending messages
5. **Provide clear details** in notification messages
6. **Handle response errors** gracefully

## Type Definitions

For TypeScript users, here are the key type definitions:

```typescript
// Notification types
type NotificationType = 'OP_TRANSFER' | 'OP_PREDICT' | 'SYSTEM' | 'ERROR';

// Extension message types
enum ExtensionMessageType {
  // UI control messages
  TOGGLE_EXTENSION = 'TOGGLE_EXTENSION',
  SHOW_3D = 'SHOW_3D',
  HIDE_3D = 'HIDE_3D',
  CHANGE_COLOR = 'CHANGE_COLOR',
  
  // Notification messages
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',
  
  // Wallet messages
  WALLET_UPDATE = 'WALLET_UPDATE',
  
  // Response messages
  NOTIFICATION_RESPONSE = 'NOTIFICATION_RESPONSE'
}

// Notification message structure
interface ShowNotificationMessage {
  type: 'SHOW_NOTIFICATION';
  id?: string;
  title: string;
  message: string;
  details?: string;
  color?: string;
  duration?: number;
  notificationType?: NotificationType;
}

// Response message structure
interface NotificationResponseMessage {
  type: 'NOTIFICATION_RESPONSE';
  id: string;
  notificationType: NotificationType;
  approved: boolean;
  timestamp: number;
  result?: {
    transactionHash?: string;
    signature?: string;
    receiptId?: string;
    [key: string]: any;
  };
  rejectionReason?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Enhanced wallet update message
interface WalletUpdateMessage {
  type: 'WALLET_UPDATE';
  address: string;
  balance: string;
  previousBalance?: string;
  delta?: string;
  reason?: string;
  relatedTransaction?: {
    id: string;
    type: string;
    timestamp: number;
    marketId?: string;
    marketName?: string;
  };
}
```

## Enhanced Response Examples

### Approval Response

Here's an example of a complete enhanced response after user approval:

```json
{
  "type": "NOTIFICATION_RESPONSE",
  "id": "predict-1717181920",
  "notificationType": "OP_PREDICT",
  "approved": true,
  "timestamp": 1717181920000,
  "result": {
    "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "signature": "0xabc123...",
    "receiptId": "receipt-9876543210",
    "metadata": {
      "marketId": "market-123",
      "marketName": "Will BTC reach $100k in 2024?",
      "outcomeId": 1,
      "outcomeName": "Yes",
      "amount": 50,
      "odds": 3.5,
      "potentialPayout": 175,
      "feeAmount": 2.5,
      "networkFee": 0.001
    }
  }
}
```

### Rejection Response

Here's an example of a structured rejection response:

```json
{
  "type": "NOTIFICATION_RESPONSE",
  "id": "predict-1717181920",
  "notificationType": "OP_PREDICT",
  "approved": false,
  "timestamp": 1717181920000,
  "rejectionReason": {
    "code": "USER_REJECTED",
    "message": "User canceled the prediction",
    "details": "User felt the odds were not favorable"
  }
}
```

## Testing Your Integration

You can test your integration with the Signet extension by:

1. Installing the extension from the Chrome Web Store
2. Sending test messages from your dapp's console
3. Checking for responses in the console

Example tests:

```javascript
// Basic notification test
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  title: 'TEST NOTIFICATION',
  message: 'This is a test notification',
  details: 'Testing Signet integration',
  notificationType: 'SYSTEM',
  duration: 5000
}, '*');

// Rich notification test with image and HTML
window.postMessage({
  type: 'SHOW_NOTIFICATION',
  id: 'test-rich-notification',
  title: 'RICH NOTIFICATION TEST',
  message: 'This is a rich notification with HTML',
  notificationType: 'SYSTEM',
  imageUrl: 'https://placehold.co/200x100/7df9ff/ffffff?text=Test+Image',
  htmlContent: `
    <div style="text-align: center; padding: 5px;">
      <div style="color: #50fa7b; margin-bottom: 5px;">Rich content test</div>
      <div style="font-size: 10px; color: #bd93f9;">This supports custom HTML formatting</div>
    </div>
  `,
  duration: 10000
}, '*');

// Wallet update test
window.postMessage({
  type: 'WALLET_UPDATE',
  address: 'sp1abcdef1234567890abcdef1234567890abcdef',
  balance: '1240.50',
  previousBalance: '1200.50',
  delta: '+40.00',
  reason: 'PREDICTION_WIN',
  relatedTransaction: {
    id: 'tx-987654321',
    type: 'MARKET_RESOLUTION',
    timestamp: Date.now(),
    marketId: 'market-456',
    marketName: 'Will ETH merge in August 2024?'
  }
}, '*');
```

## Need Help?

If you have questions or encounter issues while integrating with Signet, reach out to the Signet team through:
- [GitHub Issues](https://github.com/charisma/signet/issues)
- Discord: [Join our server](https://discord.gg/signet)