import { Subnet } from './subnet';
import { WELSH, PREDICTIONS } from './constants';
import type { TransactionRequest, Status, TransactionResult } from './types';

/**
 * SubnetRegistry - Manages multiple subnet instances
 * Provides a unified interface for operations across different subnet contracts
 */
export class SubnetRegistry {
  private subnets: Map<string, Subnet> = new Map();
  private _signer: string = '';

  constructor() {
    // Initialize subnet instances for each supported contract
    this.initializeSubnets();
  }

  /**
   * Initialize all supported subnet instances
   */
  private initializeSubnets(): void {
    // Create Welsh subnet
    const welshSubnet = new Subnet(WELSH);
    this.subnets.set(WELSH, welshSubnet);

    // Create Predictions subnet
    // const predictionsSubnet = new Subnet(PREDICTIONS);
    // this.subnets.set(PREDICTIONS, predictionsSubnet);
  }

  /**
   * Get all subnet statuses
   */
  public getStatus(): Record<string, Status> {
    const statuses: Record<string, Status> = {};

    for (const [contractId, subnet] of this.subnets.entries()) {
      statuses[contractId] = subnet.getStatus();
    }

    return statuses;
  }

  /**
   * Set signer address for all subnets
   */
  set signer(address: string) {
    // Only update if the address is different to avoid unnecessary updates
    if (this._signer !== address) {
      console.log(`Updating signer from ${this._signer} to ${address}`);
      this._signer = address;
      // Update signer for all subnets
      for (const subnet of this.subnets.values()) {
        subnet.signer = address;
      }
    }
  }

  /**
   * Get current signer address
   */
  get signer(): string {
    return this._signer;
  }

  /**
   * Process a transaction request on the appropriate subnet
   */
  public async processTxRequest(txRequest: TransactionRequest, subnetId?: string): Promise<void> {
    // If subnet is specified, use that specific subnet
    if (subnetId && this.subnets.has(subnetId)) {
      await this.subnets.get(subnetId).processTxRequest(txRequest);
      return;
    }

    // Otherwise, try to determine subnet from the transaction type
    for (const subnet of this.subnets.values()) {
      if (subnet.canProcessTransaction(txRequest)) {
        await subnet.processTxRequest(txRequest);
        return;
      }
    }

    throw new Error(`No subnet found that can process transaction type: ${txRequest.type}`);
  }

  /**
   * Get balance for a specific address across all subnets
   */
  public async getBalance(address?: string): Promise<Record<string, number>> {
    const balances: Record<string, number> = {};
    const userAddress = address || this._signer;

    if (!userAddress) {
      throw new Error('No address provided and no signer set');
    }

    for (const [contractId, subnet] of this.subnets.entries()) {
      balances[contractId] = await subnet.getBalance(userAddress);
    }

    return balances;
  }

  /**
   * Get all balances across all subnets
   */
  public async getBalances(): Promise<Record<string, Record<string, number>>> {
    const allBalances: Record<string, Record<string, number>> = {};

    for (const [contractId, subnet] of this.subnets.entries()) {
      allBalances[contractId] = await subnet.getBalances();
    }

    return allBalances;
  }

  /**
   * Deposit tokens to a specific subnet
   */
  public async deposit(amount: number, subnetId: string): Promise<TransactionResult> {
    if (!this.subnets.has(subnetId)) {
      throw new Error(`Subnet not found: ${subnetId}`);
    }

    return await this.subnets.get(subnetId).deposit(amount);
  }

  /**
   * Withdraw tokens from a specific subnet
   */
  public async withdraw(amount: number, subnetId: string): Promise<TransactionResult> {
    if (!this.subnets.has(subnetId)) {
      throw new Error(`Subnet not found: ${subnetId}`);
    }

    return await this.subnets.get(subnetId).withdraw(amount);
  }

  /**
   * Mine a block on a specific subnet
   */
  public async mineBlock(subnetId: string, batchSize?: number): Promise<TransactionResult> {
    if (!this.subnets.has(subnetId)) {
      throw new Error(`Subnet not found: ${subnetId}`);
    }

    return await this.subnets.get(subnetId).mineBlock(batchSize);
  }

  /**
   * Mine blocks on all subnets that have pending transactions
   */
  public async mineAllPendingBlocks(batchSize?: number): Promise<Record<string, TransactionResult>> {
    const results: Record<string, TransactionResult> = {};

    for (const [contractId, subnet] of this.subnets.entries()) {
      // Only mine if there are pending transactions
      if (subnet.hasPendingTransactions()) {
        try {
          results[contractId] = await subnet.mineBlock(batchSize);
        } catch (error) {
          console.error(`Error mining block for subnet ${contractId}:`, error);
        }
      }
    }

    if (Object.keys(results).length === 0) {
      throw new Error('No pending transactions to mine on any subnet');
    }

    return results;
  }

  /**
   * Generate a signature for a message using the appropriate subnet
   */
  public async generateSignature(message: any, subnetId: string): Promise<string> {
    if (!this.subnets.has(subnetId)) {
      throw new Error(`Subnet not found: ${subnetId}`);
    }

    return await this.subnets.get(subnetId).generateSignature(message);
  }

  /**
   * Refresh balances for an address across all subnets
   */
  public async refreshBalances(address?: string): Promise<void> {
    for (const subnet of this.subnets.values()) {
      await subnet.refreshBalances(address);
    }
  }

  /**
   * Get all subnet identifiers
   */
  public getSubnetIds(): string[] {
    return Array.from(this.subnets.keys());
  }

  /**
   * Get a specific subnet instance
   */
  public getSubnet(subnetId: string): Subnet | undefined {
    return this.subnets.get(subnetId);
  }
}