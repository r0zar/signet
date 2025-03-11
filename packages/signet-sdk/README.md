# Signet SDK

A unified SDK for interacting with the Signet Chrome extension, with both high-level domain-specific APIs and low-level messaging capabilities.

## Features

- Domain-specific APIs for prediction markets and token transfers
- UI controls for extension interaction
- Wallet and transaction event subscription
- Low-level Message class system for custom communications
- Type-safe API with TypeScript support
- Backward compatibility with legacy message formats

## Installation

```bash
npm install signet-sdk
# or
yarn add signet-sdk
# or 
pnpm add signet-sdk
```

## Quick Start

### High-Level API (Recommended)

```typescript
import { blaze } from 'signet-sdk';

// Connect to the extension
blaze.connect();

// Check wallet status
const walletInfo = await blaze.getWalletInfo();
console.log(`Address: ${walletInfo.address}`);
console.log(`Balance: ${walletInfo.balance}`);

// Make a market prediction
const result = await blaze.predict({
  marketId: 'market-123',
  marketName: 'Will ETH reach $5000 by EOY?',
  outcomeId: 1,
  outcomeName: 'Yes',
  amount: 100,
  potentialPayout: 250
});

console.log(`Prediction confirmed! Transaction ID: ${result.txId}`);

// Transfer tokens
const transfer = await blaze.transfer({
  to: 'ST1234567890ABCDEFGHIJKLMNOPQRSTUV',
  amount: 50,
  token: 'WIF',
  memo: 'For goods and services'
});

// Subscribe to wallet updates
const unsubscribe = blaze.onWalletUpdate((walletInfo) => {
  console.log('Balance updated:', walletInfo.balance);
});

// Later: unsubscribe when no longer needed
unsubscribe();

// Change UI appearance
blaze.setUIOptions({
  theme: 'dark',
  accentColor: '#bd93f9',
  showControls: true
});

// Toggle extension visibility
blaze.toggleExtension();
```

### Low-Level API (For Advanced Use)

```typescript
import { signetClient, Message } from 'signet-sdk';

// Initialize the client
signetClient.init();

// Show a notification
signetClient.showNotification({
  title: 'Hello World',
  message: 'This is a test notification',
  details: 'Additional details here',
  notificationType: 'SYSTEM'
});

// Create a custom message
const message = Message.info('Custom action')
  .setTarget('app')
  .setSender('myApp')
  .setBroadcast(true)
  .withDetails({ 
    action: 'customAction',
    param1: 'value1',
    param2: 'value2'
  });

// Post message directly to extension
window.postMessage(message, '*');
```

## API Documentation

### BlazeClient

The `BlazeClient` provides high-level, domain-specific methods:

- `connect()` - Connect to the Blaze protocol
- `isConnected()` - Check connection status
- `getWalletInfo()` - Get current wallet information
- `transfer(params)` - Transfer tokens
- `predict(params)` - Make a prediction on a market
- `claimRewards(predictionId)` - Claim rewards from a successful prediction
- `setUIOptions(options)` - Customize UI appearance
- `toggleExtension()` - Toggle extension visibility
- `onWalletUpdate(callback)` - Subscribe to wallet updates
- `onTransaction(callback)` - Subscribe to transaction updates

### SignetClient

The `SignetClient` provides low-level communication:

- `init()` - Initialize the client
- `destroy()` - Clean up event listeners
- `isExtensionAvailable()` - Check if extension is installed
- `showNotification(options)` - Show a notification
- `hideNotification()` - Hide the current notification
- `toggleExtension()` - Toggle extension visibility
- `show3D(color, duration)` - Show the 3D cube notification
- `hide3D()` - Hide the 3D cube
- `changeColor(color)` - Change UI color

### Message Class

The `Message` class is the core of the communication system:

- `setLevel(level)` - Set message severity level
- `setTarget(target)` - Set message target component
- `setSender(sender)` - Set message sender identifier
- `setBroadcast(broadcast)` - Set broadcast flag
- `withDetails(details)` - Add structured data
- `asNotification(options)` - Convert to a notification

Static helpers:
- `Message.info(content)` - Create an info message
- `Message.warning(content)` - Create a warning message
- `Message.error(content)` - Create an error message
- `Message.debug(content)` - Create a debug message
- `Message.notification(content, options)` - Create a notification