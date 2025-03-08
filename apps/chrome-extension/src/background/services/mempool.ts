/**
 * Mempool Service
 * Manages pending transactions in the mempool
 */

interface Transaction {
  id: string;
  type: string;
  from: string;
  to?: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'mined' | 'failed';
  metadata?: Record<string, any>;
}

class MempoolService {
  private transactions: Transaction[] = [];
  private listeners: Array<(transactions: Transaction[]) => void> = [];

  constructor() {
    console.log('[BLAZE] Mempool online');
  }

  /**
   * Add a transaction to the mempool
   */
  public addTransaction(transaction: Transaction): void {
    console.log(`[BLAZE] Adding transaction to mempool: ${transaction.id}`);
    this.transactions.push({
      ...transaction,
      status: 'pending'
    });

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Get all transactions in the mempool
   */
  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  /**
   * Get the number of transactions in the mempool
   */
  public getSize(): number {
    return this.transactions.length;
  }

  /**
   * Get a transaction by ID
   */
  public getTransaction(id: string): Transaction | undefined {
    return this.transactions.find(tx => tx.id === id);
  }

  /**
   * Update transaction status
   */
  public updateTransaction(id: string, status: 'pending' | 'mined' | 'failed'): boolean {
    const index = this.transactions.findIndex(tx => tx.id === id);

    if (index !== -1) {
      this.transactions[index] = {
        ...this.transactions[index],
        status
      };

      // If transaction is mined or failed, remove it from the mempool
      if (status === 'mined' || status === 'failed') {
        this.transactions.splice(index, 1);
      }

      // Notify listeners
      this.notifyListeners();
      return true;
    }

    return false;
  }

  /**
   * Clear all transactions from the mempool
   */
  public clearAll(): void {
    this.transactions = [];
    this.notifyListeners();
  }

  /**
   * Add a listener for mempool changes
   */
  public addListener(listener: (transactions: Transaction[]) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   */
  public removeListener(listener: (transactions: Transaction[]) => void): void {
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
      listener([...this.transactions]);
    }
  }
}

// Export singleton instance
export const mempool = new MempoolService();