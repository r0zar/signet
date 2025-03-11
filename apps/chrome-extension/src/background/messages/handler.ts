import type { PlasmoMessaging } from "@plasmohq/messaging"
import { subnetRegistry } from "../index"
import { TransactionType, assets } from "../lib/constants"
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

export type MessageAction =
  | "getStatus"
  | "getBalance"
  | "getBalances"
  | "getAssetBalances"
  | "processTx"
  | "createTransferTx"
  | "createPredictionTx"
  | "createClaimRewardTx"
  | "deposit"
  | "withdraw"
  | "refreshBalances"
  | "mineBlock"
  | "mineAllPendingBlocks"
  | "generateSignature"
  | "setSigner"
  // Wallet related actions
  | "initializeWallet"
  | "checkWalletInitialized"
  | "createSeedPhrase"
  | "importSeedPhrase"
  | "getAllSeedPhrases"
  | "getSeedPhraseById"
  | "deleteSeedPhrase"
  | "createAccount"
  | "getAccount"
  | "getAllAccounts"
  | "getAccountsForSeedPhrase"
  | "activateAccount"
  | "getCurrentAccount"
  | "deleteAccount"
  | "resetWallet";

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
        response = await subnetRegistry.getBalance(data?.address);
        break;

      case "getBalances":
        response = await subnetRegistry.getBalances();
        break;

      // Asset operations
      case "getAssetBalances":
        const subnetBalances = await subnetRegistry.getBalance(data?.address);

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
        console.log(data)
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
        if (!data) {
          throw new Error("No transaction data provided");
        }

        // Process transaction on the appropriate subnet
        // If subnetId is provided, use that specific subnet
        if (data.subnetId) {
          await subnetRegistry.processTxRequest(data as TransactionRequest, data.subnetId);
        } else {
          // Otherwise let the registry figure out which subnet to use
          await subnetRegistry.processTxRequest(data as TransactionRequest);
        }

        response = { success: true };
        break;

      case "createTransferTx":
        // Validate input data
        if (!data?.to || typeof data.amount !== "number" || !data?.signer || typeof data.nonce !== "number") {
          throw new Error("Invalid transfer data");
        }

        // Determine which subnet to use
        const subnetId = data.subnet || assets[0].subnet; // Default to first asset's subnet if not specified

        // Generate signature using the specified subnet
        const transferSignature = await subnetRegistry.generateSignature({
          to: data.to,
          amount: data.amount,
          nonce: data.nonce
        }, subnetId);

        // Create transfer transaction
        const transferTx: Transfer = {
          type: TransactionType.TRANSFER,
          signature: transferSignature,
          signer: data.signer,
          to: data.to,
          amount: data.amount,
          nonce: data.nonce
        };

        // Process it on the appropriate subnet
        await subnetRegistry.processTxRequest(transferTx, subnetId);

        response = { success: true, transaction: transferTx };
        break;

      case "createPredictionTx":
        // Validate input data
        if (typeof data?.marketId !== "number" ||
          typeof data?.outcomeId !== "number" ||
          typeof data?.amount !== "number" ||
          !data?.signer ||
          typeof data?.nonce !== "number") {
          throw new Error("Invalid prediction data");
        }

        // Find the predictions subnet
        const predictionsSubnetId = assets.find(a => a.symbol === "PREDICT")?.subnet ||
          assets[1]?.subnet; // Fallback to the second asset if available

        if (!predictionsSubnetId) {
          throw new Error("Predictions subnet not found");
        }

        // Generate signature using the predictions subnet
        const predictionSignature = await subnetRegistry.generateSignature({
          to: predictionsSubnetId, // Use predictions subnet as target
          amount: data.amount,
          nonce: data.nonce
        }, predictionsSubnetId);

        // Create prediction transaction
        const predictionTx: Prediction = {
          type: TransactionType.PREDICT,
          signature: predictionSignature,
          signer: data.signer,
          marketId: data.marketId,
          outcomeId: data.outcomeId,
          amount: data.amount,
          nonce: data.nonce
        };

        // Process it on the predictions subnet
        await subnetRegistry.processTxRequest(predictionTx, predictionsSubnetId);

        response = { success: true, transaction: predictionTx };
        break;

      case "createClaimRewardTx":
        // Validate input data
        if (typeof data?.receiptId !== "number" || !data?.signer || typeof data?.nonce !== "number") {
          throw new Error("Invalid claim reward data");
        }

        // Find the predictions subnet (claims are processed on the predictions subnet)
        const claimSubnetId = assets.find(a => a.symbol === "PREDICT")?.subnet ||
          assets[1]?.subnet; // Fallback to the second asset if available

        if (!claimSubnetId) {
          throw new Error("Predictions subnet not found for claim");
        }

        // Create message for signing
        const message = {
          receipt_id: data.receiptId,
          nonce: data.nonce
        };

        // Use subnet registry to generate signature
        const claimSignature = await subnetRegistry.generateSignature({
          to: claimSubnetId, // Use predictions subnet as target
          amount: 0, // We're not transferring tokens, but reusing signature
          nonce: data.nonce
        }, claimSubnetId);

        // Create claim reward transaction
        const claimTx: ClaimReward = {
          type: TransactionType.CLAIM_REWARD,
          signature: claimSignature,
          signer: data.signer,
          receiptId: data.receiptId,
          nonce: data.nonce
        };

        // Process it on the predictions subnet
        await subnetRegistry.processTxRequest(claimTx, claimSubnetId);

        response = { success: true, transaction: claimTx };
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

      case "mineBlock":
        if (data?.subnetId && typeof data.subnetId === "string") {
          // Mine a specific subnet
          response = await subnetRegistry.mineBlock(data.subnetId, data?.batchSize);
        } else {
          // Mine all pending transactions across all subnets
          response = await subnetRegistry.mineAllPendingBlocks(data?.batchSize);
        }
        break;

      case "mineAllPendingBlocks":
        // Mine all pending transactions across all subnets
        response = await subnetRegistry.mineAllPendingBlocks(data?.batchSize);
        break;

      case "generateSignature":
        if (!data?.to || typeof data?.amount !== "number" || typeof data?.nonce !== "number") {
          throw new Error("Invalid signature request data");
        }

        // Determine which subnet to use, defaulting to the first asset if not specified
        const sigSubnetId = data.subnetId || assets[0].subnet;

        response = await subnetRegistry.generateSignature({
          to: data.to,
          amount: data.amount,
          nonce: data.nonce
        }, sigSubnetId);
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