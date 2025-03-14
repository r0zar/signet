<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/signet-logo-light.png">
    <img alt="Signet Logo" src="./assets/signet-logo-dark.png" height="100">
  </picture>
  <br />
</p>
<div align="center">
  <h1>
    Signet Signer
  </h1>  
  <img alt="Signet Architecture" src="https://raw.githubusercontent.com/r0zar/signet/refs/heads/main/formatted_images/signet_monitor_cyan_strong_persp.png">
</div>

## Introduction

Signet is a comprehensive infrastructure for blockchain interaction that bridges web applications and decentralized protocols. It consists of two main components:

1. **Signet Wallet Extension**: A browser extension that enables users to securely create and manage blockchain identities, sign transactions, and control when and how their signed transactions are revealed to applications.

2. **Signet SDK**: A developer toolkit that allows web applications to seamlessly communicate with the Signet Wallet, request signatures, and manage transaction lifecycles.

Signet serves as the foundational user-facing component of the Blaze Protocol, making blockchain interactions as seamless as traditional web experiences.

## Key Features

### For Users

- **Two-Phase Transaction Authorization**: Sign operations and control when they are revealed to applications
- **Private Transaction Storage**: Store signed transactions privately until you decide to reveal them
- **Intuitive Permission System**: Fine-grained control over what applications can do with your identity
- **Transaction Batching**: Combine multiple actions into efficient batches for cost savings
- **Web2-Like Experience**: No cryptic confirmation modals or technical jargon

### For Developers

- **Simple Integration**: Add blockchain capabilities to any web application with minimal code
- **Optimistic UI Support**: Update interfaces immediately while transactions are pending
- **Transaction Management**: Control when and how to submit batched transactions
- **Flexible Authentication**: Use for identity and authentication without transaction overhead
- **Comprehensive TypeScript SDK**: Type-safe integration with your application

## Architecture

Signet implements a multi-layered architecture that separates transaction signing from settlement:

```mermaid
sequenceDiagram
    participant User
    participant SignetExt as Signet Wallet
    participant DApp as Web Application
    participant Chain as Blockchain
    
    User->>+DApp: Initiate action
    DApp->>+SignetExt: Request signature
    SignetExt->>User: Request approval
    User->>SignetExt: Approve operation
    SignetExt->>SignetExt: Generate and store signature
    SignetExt-->>-DApp: Return proof (not full transaction)
    
    DApp->>DApp: Update UI optimistically
    DApp->>SignetExt: Request transaction reveal
    SignetExt->>User: Request reveal approval
    User->>SignetExt: Approve reveal
    SignetExt-->>DApp: Reveal signed transaction
    DApp->>Chain: Submit transaction (single or batch)
    Chain-->>DApp: Confirm settlement
```