import { makeContractCall, broadcastTransaction, signStructuredData, fetchCallReadOnlyFunction, Cl, ClarityType } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { TransactionType, WELSH, subnetTokens, txTypeContracts } from './constants';
import type {
    TransactionRequest,
    Transfer,
    Prediction,
    ClaimReward,
    Status,
    TransactionResult,
    TransferMessage
} from './types';
import { Transaction } from './transaction';
import { Mempool } from './mempool';
import { buildDepositTxOptions, buildWithdrawTxOptions } from './utils';
import { createWelshDomain, createTransferMessage } from './signatures';
import { getCurrentAccount } from './wallet';

export class Subnet {
    subnet: `${string}.${string}`;
    tokenIdentifier: string;
    signer: string;
    balances: Map<string, number> = new Map();
    mempool: Mempool;
    lastProcessedBlock: number;

    constructor(subnetContract: `${string}.${string}` = WELSH) {
        this.signer = '';
        this.lastProcessedBlock = 0
        this.subnet = subnetContract;

        this.tokenIdentifier = subnetTokens[this.subnet as keyof typeof subnetTokens];
        if (!this.tokenIdentifier) {
            throw new Error(`No token identifier found for subnet: ${this.subnet}`);
        }

        // Initialize the mempool
        this.mempool = new Mempool(
            this.subnet,
            this.balances,
            this.fetchContractBalance.bind(this)
        );
    }

    /**
     * Check if this subnet can process the given transaction type
     */
    public canProcessTransaction(txRequest: TransactionRequest): boolean {
        // Check if this subnet processes this transaction type
        const txType = txRequest.type;
        const targetContract = txTypeContracts[txType]?.contract;

        return targetContract === this.subnet;
    }

    /**
     * Check if this subnet has any pending transactions
     */
    public hasPendingTransactions(): boolean {
        return this.mempool.getQueue().length > 0;
    }

    public getStatus(): Status {
        return {
            subnet: this.subnet,
            txQueue: this.mempool.getQueue(),
            lastProcessedBlock: this.lastProcessedBlock,
        };
    }

    /**
     * Fetch a user's on-chain balance from the contract
     */
    private async fetchContractBalance(user: string): Promise<number> {
        const [contractAddress, contractName] = this.subnet.split('.');
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress,
                contractName,
                functionName: 'get-balance',
                functionArgs: [Cl.principal(user)],
                network: STACKS_MAINNET,
                senderAddress: user
            });
            console.log(result)
            const balance = result.type === ClarityType.UInt ? Number(result.value) : 0;

            // Store the confirmed balance in our Map
            this.balances.set(user, balance);

            return balance;
        } catch (error: unknown) {
            console.error('Failed to fetch contract balance:', error);
            return 0;
        }
    }

    // get all balances
    async getBalances() {
        // First, collect all unique users affected by transactions
        const usersInQueue = this.mempool.getAffectedUsers();

        // Fetch on-chain balances for all users that might not be in the balances Map
        const fetchPromises = [];
        for (const user of Array.from(usersInQueue)) {
            if (!this.balances.has(user)) {
                fetchPromises.push(this.fetchContractBalance(user));
            }
        }

        // Wait for all balance fetches to complete
        if (fetchPromises.length > 0) {
            await Promise.all(fetchPromises);
        }

        // Get total balances with pending changes applied
        const totalBalances = this.mempool.getTotalBalances();
        return Object.fromEntries(totalBalances);
    }

    /**
     * Get a user's complete balance information
     */
    async getBalance(user?: string): Promise<number> {
        const address = user || this.signer;
        return this.mempool.getBalance(address);
    }

    private async executeTransaction(txOptions: any): Promise<TransactionResult> {
        // Get the active account from wallet
        const activeAccount = await getCurrentAccount();

        if (!activeAccount || !activeAccount.privateKey) {
            throw new Error('No active account or private key found');
        }

        const transaction = await makeContractCall({
            ...txOptions,
            senderKey: activeAccount.privateKey,
            network: STACKS_MAINNET,
        });

        console.log('Broadcasting transaction:', transaction);
        const response = await broadcastTransaction({
            transaction,
            network: STACKS_MAINNET,
        });

        console.log(response)
        return response
    }

    public async processTxRequest(txRequest: TransactionRequest) {
        // Validate based on transaction type
        switch (txRequest.type) {
            case TransactionType.TRANSFER:
                await this.validateTransferOperation(txRequest as Transfer);
                break;
            case TransactionType.PREDICT:
                await this.validatePredictionOperation(txRequest as Prediction);
                break;
            case TransactionType.CLAIM_REWARD:
                await this.validateClaimOperation(txRequest as ClaimReward);
                break;
            default:
                throw new Error(`Unknown transaction type: ${txRequest.type}`);
        }

        // Create a new Transaction object and put it in the queue
        const transaction = new Transaction(txRequest);
        this.mempool.addTransaction(transaction);
    }

    /**
     * Process transactions from the mempool and mine a new block
     * Groups transactions by type and processes each group separately
     * @param batchSize Optional number of transactions to process (default: up to 200)
     * @returns Transaction result containing the txid if successful
     */
    public async mineBlock(batchSize?: number): Promise<TransactionResult> {
        const queue = this.mempool.getQueue();

        // Don't process if queue is empty
        if (queue.length === 0) {
            throw new Error('No transactions to mine');
        }

        // Group transactions by type
        const txByType = this.mempool.getTransactionsByType();
        const maxBatchSize = batchSize || 200;

        // Process each type of transaction separately
        for (const [txType, txs] of txByType.entries()) {
            if (txs.length === 0) continue;

            // Get the contract info for this transaction type
            const [contractAddress, contractName] = this.subnet.split('.');

            if (!contractAddress || !contractName) {
                console.error(`Invalid contract format for ${txType}`);
                continue;
            }

            // Get transactions to mine (up to batch size)
            const txsToMine = txs.slice(0, maxBatchSize);

            // Build transaction options
            const txOptions = this.mempool.buildBatchTxOptions(
                txsToMine,
                txType,
                contractAddress,
                contractName,
            );

            try {
                // Execute the batch transaction
                console.log(`Mining ${txType} transactions:`, txsToMine.length);
                const result = await this.executeTransaction(txOptions);

                // Remove the processed transactions from the mempool
                this.mempool.removeTransactions(txsToMine);

                // Return after processing one batch - we can process more in the next mine call
                return result;
            } catch (error) {
                console.error(`Failed to mine ${txType} transactions:`, error);
                // Continue with next transaction type
            }
        }

        throw new Error('Failed to mine any transactions');
    }

    async deposit(amount: number) {
        try {
            // Build deposit transaction options
            const txOptions = buildDepositTxOptions({
                signer: this.signer,
                subnet: this.subnet,
                amount,
            });

            // Execute the deposit transaction
            const result = await this.executeTransaction(txOptions);

            // Note: We don't refresh balance here since on-chain updates take ~30 seconds
            // Users should explicitly refresh balances when needed or wait for SSE events

            return result;
        } catch (error: unknown) {
            throw error;
        }
    }

    async withdraw(amount: number) {
        try {
            // Build withdraw transaction options
            const txOptions = buildWithdrawTxOptions({
                subnet: this.subnet,
                amount,
                signer: this.signer
            });

            // Execute the withdraw transaction
            const result = await this.executeTransaction(txOptions);

            // Note: We don't refresh balance here since on-chain updates take ~30 seconds
            // Users should explicitly refresh balances when needed or wait for SSE events

            return result;
        } catch (error: unknown) {
            throw error;
        }
    }

    async generateSignature(message: TransferMessage): Promise<string> {
        // Get the active account from wallet
        const activeAccount = await getCurrentAccount();

        if (!activeAccount || !activeAccount.privateKey) {
            throw new Error('No active account or private key found');
        }

        const signature = await signStructuredData({
            domain: createWelshDomain(),
            message: createTransferMessage(message),
            privateKey: activeAccount.privateKey
        });
        return signature;
    }

    async verifyTransferSignature(data: Transfer | Prediction): Promise<boolean> {
        const [contractAddress, contractName] = this.subnet.split('.');
        try {
            // Determine recipient based on transaction type
            const recipient = data.type === TransactionType.TRANSFER
                ? (data as Transfer).to
                : this.subnet

            const amount = data.type === TransactionType.TRANSFER
                ? (data as Transfer).amount
                : (data as Prediction).amount;

            const result = await fetchCallReadOnlyFunction({
                contractAddress,
                contractName,
                functionName: 'verify-transfer-signer',
                functionArgs: [
                    Cl.tuple({
                        signature: Cl.bufferFromHex(data.signature),
                        nonce: Cl.uint(data.nonce)
                    }),
                    Cl.principal(recipient),
                    Cl.uint(amount)
                ],
                network: STACKS_MAINNET,
                senderAddress: this.signer
            });

            return result.type === ClarityType.ResponseOk;
        } catch (error: unknown) {
            console.error('Transfer signature verification failed:', error);
            return false;
        }
    }

    async verifyClaimSignature(claim: ClaimReward): Promise<boolean> {
        const [contractAddress, contractName] = this.subnet.split('.');
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress,
                contractName,
                functionName: 'verify-receipt-signer',
                functionArgs: [
                    Cl.tuple({
                        signature: Cl.bufferFromHex(claim.signature),
                        nonce: Cl.uint(claim.nonce)
                    }),
                    Cl.uint(claim.receiptId)
                ],
                network: STACKS_MAINNET,
                senderAddress: this.signer
            });

            return result.type === ClarityType.ResponseOk;
        } catch (error: unknown) {
            console.error('Claim signature verification failed:', error);
            return false;
        }
    }

    async validateTransferOperation(operation: Transfer): Promise<void> {
        if (!operation.to || !operation.signature) {
            throw new Error('Invalid transfer operation: missing required fields');
        }
        if (operation.amount <= 0) {
            throw new Error('Invalid transfer operation: amount must be positive');
        }
        if (operation.nonce <= 0) {
            throw new Error('Invalid transfer operation: nonce must be positive');
        }
        // Verify signature
        const isValid = await this.verifyTransferSignature(operation);
        if (!isValid) {
            throw new Error('Invalid transfer operation: signature verification failed');
        }
    }

    async validatePredictionOperation(operation: Prediction): Promise<void> {
        if (!operation.signature) {
            throw new Error('Invalid prediction operation: missing required fields');
        }
        if (operation.amount <= 0) {
            throw new Error('Invalid prediction operation: amount must be positive');
        }
        if (operation.nonce <= 0) {
            throw new Error('Invalid prediction operation: nonce must be positive');
        }
        if (operation.marketId < 0 || operation.outcomeId < 0) {
            throw new Error('Invalid prediction operation: market/outcome IDs must be positive');
        }

        // Verify signature using the same method as transfers
        // since predictions use the same token transfer signature
        const isValid = await this.verifyTransferSignature(operation);
        if (!isValid) {
            throw new Error('Invalid prediction operation: signature verification failed');
        }
    }

    async validateClaimOperation(operation: ClaimReward): Promise<void> {
        if (!operation.signature) {
            throw new Error('Invalid claim operation: missing required fields');
        }
        if (operation.nonce <= 0) {
            throw new Error('Invalid claim operation: nonce must be positive');
        }
        if (operation.receiptId <= 0) {
            throw new Error('Invalid claim operation: receipt ID must be positive');
        }

        // Verify claim signature with the receipt verification function
        const isValid = await this.verifyClaimSignature(operation);
        if (!isValid) {
            throw new Error('Invalid claim operation: signature verification failed');
        }
    }

    /**
     * Refresh on-chain balances for a specific user or all users in the balances Map
     */
    async refreshBalances(user?: string): Promise<void> {
        if (user) {
            // Refresh for a single user
            await this.fetchContractBalance(user);
        } else {
            // Refresh for all users in the balances Map
            const refreshPromises = Array.from(this.balances.keys()).map(address =>
                this.fetchContractBalance(address)
            );

            if (refreshPromises.length > 0) {
                await Promise.all(refreshPromises);
            }
        }
    }
}