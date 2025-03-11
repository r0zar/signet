# Signet Vanilla JS Demo

A simple vanilla JavaScript application that demonstrates the capabilities of the Signet SDK. This demo showcases how to use the Signet SDK without any frontend framework.

## Features

- Basic and enhanced notification interfaces
- Transaction notifications and confirmations
- Prediction market interaction
- Wallet information retrieval
- Rich notifications with HTML content
- UI theme customization
- 3D animation effects

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```

3. Open your browser to the URL shown in the terminal (typically http://localhost:3000)

## How It Works

This demo uses the basic Signet SDK messaging system to communicate with the Signet browser extension. It implements:

- A wrapper around the core SDK functionality
- UI for triggering different SDK features
- State management for wallet information and transaction results
- Display of response data from the extension

## Implementation Details

The application is built with:
- Vanilla JavaScript (ES Modules)
- HTML & CSS
- The Signet SDK for messaging
- PicoCSS for minimal styling

## Structure

- `index.html` - The main HTML file with UI elements
- `app.js` - JavaScript implementation of the demo
- `package.json` - Project dependencies and scripts

## Requirements

- Chrome with the Signet extension installed
- Node.js and pnpm for development

## Development

This project is part of the Signet ecosystem. To develop or extend it:

1. Make sure you have the Signet browser extension installed
2. The extension should respond to the messages sent by the app
3. Check the browser console for debugging information

## Notes

- Without the Signet extension, the app will show "Extension Not Detected"
- All interactions are simulated if the extension is not available
- The UI is designed to match the cyberpunk aesthetic of the Signet extension