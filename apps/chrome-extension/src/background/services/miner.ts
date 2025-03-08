/**
 * Miner Service
 * Handles block creation and transaction mining
 */

import { TransactionType } from '~shared/types/signet';
import { mempool } from './mempool';

export interface Block {
  height: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  transactions: string[];
  miner: string;
  difficulty: number;
  nonce: number;
}

export type MinerStatus = 'active' | 'starting' | 'stopped';

export interface MinerState {
  status: MinerStatus;
  hashrate: number;
  lastBlock?: Block;
}


// Contract addresses
export const WELSH = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.blaze-welsh-v1';
export const PREDICTIONS = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.predictions-v1';

// Map transaction types to their target contracts and batch functions
export const txTypeContracts: Record<TransactionType, {
  contract: string,
  batchFunction: string
}> = {
  [TransactionType.TRANSFER]: {
    contract: WELSH,
    batchFunction: 'batch-transfer'
  },
  [TransactionType.PREDICT]: {
    contract: PREDICTIONS,
    batchFunction: 'batch-predict'
  },
  [TransactionType.CLAIM_REWARD]: {
    contract: PREDICTIONS,
    batchFunction: 'batch-claim-reward'
  }
};

class MinerService {
  private state: MinerState = {
    status: 'stopped',
    hashrate: 0
  };

  private miningInterval: NodeJS.Timeout | null = null;
  private blockchain: Block[] = [];
  private listeners: Array<(state: MinerState) => void> = [];

  constructor() {
    console.log('[BLAZE] Miner online');

    // Create genesis block
    this.blockchain.push({
      height: 0,
      timestamp: Date.now(),
      hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      transactions: [],
      miner: 'genesis',
      difficulty: 1,
      nonce: 0
    });
  }

  /**
   * Start mining
   */
  public startMining(): void {
    if (this.state.status !== 'stopped') {
      return;
    }

    console.log('[BLAZE] Starting miner...');
    this.setState({
      status: 'starting',
      hashrate: 0
    });

    // Simulate miner startup
    setTimeout(() => {
      this.setState({
        status: 'active',
        hashrate: Math.floor(Math.random() * 50) + 10
      });

      // Start mining loop
      this.miningInterval = setInterval(() => {
        this.mineNextBlock();
      }, 10000); // Mine a block every 10 seconds

      console.log('[BLAZE] Miner active');
    }, 2000);
  }

  /**
   * Stop mining
   */
  public stopMining(): void {
    if (this.state.status === 'stopped') {
      return;
    }

    console.log('[BLAZE] Stopping miner...');

    // Clear mining interval
    if (this.miningInterval) {
      clearInterval(this.miningInterval);
      this.miningInterval = null;
    }

    this.setState({
      status: 'stopped',
      hashrate: 0
    });

    console.log('[BLAZE] Miner stopped');
  }

  /**
   * Mine the next block
   */
  private mineNextBlock(): void {
    // Get transactions from mempool
    const pendingTxs = mempool.getTransactions();

    if (pendingTxs.length === 0) {
      console.log('[BLAZE] No transactions to mine');
      return;
    }

    // Get the latest block
    const lastBlock = this.blockchain[this.blockchain.length - 1];

    // Create new block
    const newBlock: Block = {
      height: lastBlock.height + 1,
      timestamp: Date.now(),
      hash: this.generateRandomHash(),
      previousHash: lastBlock.hash,
      transactions: pendingTxs.map(tx => tx.id),
      miner: 'extension-miner',
      difficulty: Math.floor(Math.random() * 3) + 1,
      nonce: Math.floor(Math.random() * 1000000)
    };

    // Add to blockchain
    this.blockchain.push(newBlock);

    // Update miner state
    this.setState({
      lastBlock: newBlock,
      hashrate: Math.floor(Math.random() * 50) + 10
    });

    // Update transaction status
    for (const tx of pendingTxs) {
      mempool.updateTransaction(tx.id, 'mined');
    }

    console.log(`[BLAZE] Mined block #${newBlock.height} with ${pendingTxs.length} transactions`);
  }

  /**
   * Generate a random hash (for simulation)
   */
  private generateRandomHash(): string {
    return '0x' + Array.from(
      { length: 64 },
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  /**
   * Get the current miner state
   */
  public getState(): MinerState {
    return { ...this.state };
  }

  /**
   * Update the miner state
   */
  private setState(newState: Partial<MinerState>): void {
    this.state = { ...this.state, ...newState };

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Get blockchain
   */
  public getBlockchain(): Block[] {
    return [...this.blockchain];
  }

  /**
   * Get latest block
   */
  public getLatestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  /**
   * Add a listener for state changes
   */
  public addListener(listener: (state: MinerState) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   */
  public removeListener(listener: (state: MinerState) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }
}

// Export singleton instance
export const miner = new MinerService();