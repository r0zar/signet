import type { PlasmoMessaging } from "@plasmohq/messaging"
import { subnetRegistry } from "../index"
import { TransactionType, WELSH, assets } from "../lib/constants"
import type {
  TransactionRequest,
  Transfer,
  Prediction,
  ClaimReward,
  TransferMessage
} from "../lib/types"

// Import wallet functionality
import * as wallet from "../lib/wallet"
import type { SeedPhrase, Account, CreateAccountOptions } from "../lib/wallet/types"
import type { MessageAction } from "~shared/context/types"

interface MessageRequest {
  action: MessageAction;
  data?: any;
}

/**
 * Unified background message handler
 * Routes messages to the appropriate service based on action
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const { action, data } = req.body as MessageRequest;
    console.log(`Handling:`, req.body);

    let response;

    switch (action) {
      // Subnet operations
      case "getStatus":
        response = subnetRegistry.getStatus();
        break;

      case "getBalance":
        const welsh = await subnetRegistry.getSubnet(WELSH).fetchContractBalance(data.address);
        response = { [WELSH]: welsh }
        break;

      case "getBalances":
        response = await subnetRegistry.getBalances();
        break;

      // Asset operations
      case "getAssetBalances":
        const subnetBalances = await subnetRegistry.getBalance(data.address);

        // Convert to asset balances
        const assetBalances: Record<string, number> = {};

        // Map each asset to its corresponding subnet balance
        for (const asset of assets) {
          // Find the subnet balance for this asset's subnet
          const balance = subnetBalances[asset.subnet] || 0;
          assetBalances[asset.id] = balance;
        }

        response = assetBalances;
        break;

      case "setSigner":
        if (!data?.address || typeof data.address !== "string") {
          throw new Error("Invalid signer address");
        }
        subnetRegistry.signer = data.address;
        response = { success: true, signer: subnetRegistry.signer };
        break;

      // Wallet initialization
      case "initializeWallet":
        if (!data?.password || typeof data.password !== "string") {
          throw new Error("Invalid wallet password");
        }
        response = await wallet.initializeWallet(data.password);
        break;

      case "checkWalletInitialized":
        response = await wallet.checkWalletInitialized();
        break;

      case "hasActiveWalletSession":
        response = await wallet.hasActiveSession();
        break;

      case "initializeFromSession":
        response = await wallet.initializeFromSession();
        break;

      case "endWalletSession":
        response = await wallet.endSession();
        break;

      // Seed phrase management
      case "createSeedPhrase":
        if (!data?.name || typeof data.name !== "string") {
          throw new Error("Invalid seed phrase name");
        }
        response = await wallet.createNewSeedPhrase(data.name);
        break;

      case "importSeedPhrase":
        if (!data?.name || typeof data.name !== "string" ||
          !data?.phrase || typeof data.phrase !== "string") {
          throw new Error("Invalid seed phrase import data");
        }
        response = await wallet.importSeedPhrase(data.name, data.phrase);
        break;

      case "getAllSeedPhrases":
        response = await wallet.getAllSeedPhrases();
        break;

      case "getSeedPhraseById":
        if (!data?.id || typeof data.id !== "string") {
          throw new Error("Invalid seed phrase ID");
        }
        response = await wallet.getSeedPhrase(data.id);
        break;

      case "deleteSeedPhrase":
        if (!data?.id || typeof data.id !== "string") {
          throw new Error("Invalid seed phrase ID");
        }
        response = await wallet.deleteSeedPhrase(data.id);
        break;

      // Account management
      case "createAccount":
        if (!data?.seedPhraseId || typeof data.seedPhraseId !== "string") {
          throw new Error("Invalid account creation data");
        }

        const options: CreateAccountOptions = {
          seedPhraseId: data.seedPhraseId,
          index: data.index,
          makeActive: data.makeActive
        };

        response = await wallet.createAccount(options);

        // If account creation successful and marked active, update the subnet registry signer
        if (response && response.isActive) {
          subnetRegistry.signer = response.stxAddress;
        }
        break;

      case "getAccount":
        if (!data?.id || typeof data.id !== "string") {
          throw new Error("Invalid account ID");
        }
        response = await wallet.getAccount(data.id);
        break;

      case "getAllAccounts":
        response = await wallet.getAllAccounts();
        break;

      case "getAccountsForSeedPhrase":
        if (!data?.seedPhraseId || typeof data.seedPhraseId !== "string") {
          throw new Error("Invalid seed phrase ID");
        }
        response = await wallet.getAccountsForSeedPhrase(data.seedPhraseId);
        break;

      case "activateAccount":
        if (!data?.id || typeof data.id !== "string") {
          throw new Error("Invalid account ID");
        }

        const activateResult = await wallet.activateAccount(data.id);

        // If activation successful, update the subnet registry signer
        if (activateResult) {
          const activeAccount = await wallet.getAccount(data.id);
          if (activeAccount) {
            subnetRegistry.signer = activeAccount.stxAddress;
          }
        }

        response = activateResult;
        break;

      case "getCurrentAccount":
        const currentAccount = await wallet.getCurrentAccount();

        // If there's a current account, update the subnet registry signer
        if (currentAccount) {
          subnetRegistry.signer = currentAccount.stxAddress;
        }

        response = currentAccount;
        break;

      case "deleteAccount":
        if (!data?.id || typeof data.id !== "string") {
          throw new Error("Invalid account ID");
        }
        response = await wallet.deleteAccount(data.id);
        break;

      case "resetWallet":
        response = await wallet.resetWallet();
        break;

      case "processTx":
        // Process different transaction types
        if (!data || !data.type || !data.subnetId) {
          throw new Error("Not all transaction data provided");
        }

        // Process transaction on the appropriate subnet
        await subnetRegistry.processTxRequest(data);
        response = { success: true };
        break;

      case "createTransferTx":
        // Validate input data
        if (!data.to || typeof data.amount !== "number" || typeof data.nonce !== "number") {
          throw new Error("Invalid transfer data");
        }

        // Sign the transfer using the specified subnet
        const transferSignature = await subnetRegistry.generateTransferSignature({
          to: data.to,
          amount: data.amount,
          nonce: data.nonce
        }, data.subnetId);

        // Create transfer transaction
        const transferTx = {
          type: TransactionType.TRANSFER,
          subnetId: data.subnetId,
          signature: transferSignature,
          signer: subnetRegistry.signer,
          to: data.to,
          amount: data.amount,
          nonce: data.nonce
        };

        // Process it on the appropriate subnet
        await subnetRegistry.processTxRequest(transferTx);

        response = { success: true, transaction: transferTx };
        break;

      case "createPredictionTx":
        // Validate input data
        if (!data.to || typeof data.amount !== "number" || typeof data.nonce !== "number") {
          throw new Error("Invalid transfer data");
        }

        // Sign the transfer using the specified subnet
        const signature = await subnetRegistry.generateTransferSignature({
          to: data.to,
          amount: data.amount,
          nonce: data.nonce
        }, data.subnetId);

        // Create transfer transaction
        const predictionTx: Prediction = {
          type: TransactionType.PREDICT,
          subnetId: data.to,
          signature: signature,
          signer: subnetRegistry.signer,
          amount: data.amount,
          nonce: data.nonce,
          marketId: data.marketId,
          outcomeId: data.outcomeId
        };

        // Process it on the appropriate subnet
        await subnetRegistry.processTxRequest(predictionTx);

        response = { success: true, transaction: predictionTx };
        break;

      case "deposit":
        if (typeof data?.amount !== "number") {
          throw new Error("Invalid deposit amount");
        }

        if (!data?.subnetId) {
          throw new Error("Subnet ID is required for deposit");
        }

        response = await subnetRegistry.deposit(data.amount, data.subnetId);
        break;

      case "withdraw":
        if (typeof data?.amount !== "number") {
          throw new Error("Invalid withdraw amount");
        }

        if (!data?.subnetId) {
          throw new Error("Subnet ID is required for withdraw");
        }

        response = await subnetRegistry.withdraw(data.amount, data.subnetId);
        break;

      case "refreshBalances":
        await subnetRegistry.refreshBalances(data?.address);
        response = { success: true };
        break;

      case "mineSingleTransaction":
        // Validate input data
        if (!data?.signature) {
          throw new Error("Transaction signature is required for single mining");
        }

        // Mine the transaction
        response = await subnetRegistry.mineSingleTransaction(data.signature, data.subnetId);
        break;

      case "mineBatchTransactions":
        // Validate input data
        if (!data?.signatures || !Array.isArray(data.signatures) || data.signatures.length === 0) {
          throw new Error("Array of transaction signatures is required for batch mining");
        }

        // Mine the batch of transactions
        response = await subnetRegistry.mineBatchTransactions(data.signatures);
        break;

      case "discardTransaction":
        // Validate input data
        if (!data?.signature) {
          throw new Error("Transaction signature is required for discarding");
        }

        // Discard the transaction from the mempool
        response = subnetRegistry.discardTransaction(data.signature, data.subnetId);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Send successful response
    res.send({
      success: true,
      data: response
    });

  } catch (error) {
    console.error("Error in message handler:", error);

    // Send error response
    res.send({
      success: false,
      error: error.message || "Unknown error"
    });
  }
}

export default handler