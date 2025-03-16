/**
 * Dexterity integration for Signet Extension
 * 
 * This module encapsulates all Dexterity-related functionality used by the Signet extension,
 * including token subnet deployment and other blockchain interactions.
 */

import { Dexterity, type SubnetWrapperParams, type DeploymentResult } from "dexterity-sdk";

/**
 * Configure Dexterity SDK with the appropriate settings
 * @param stxAddress The current STX address to use
 * @param network Optional network to use (defaults to mainnet)
 */
export async function configureDexterity(stxAddress: string, network: 'mainnet' | 'testnet' = 'mainnet'): Promise<void> {
  await Dexterity.configure({
    mode: "server",
    stxAddress,
    network,
  });

  console.log(`Dexterity configured with address: ${stxAddress}, network: ${network}`);
}

/**
 * Deploy a token subnet wrapper contract using Dexterity
 * @param params The subnet parameters
 * @param stxAddress The STX address to use as the deployer
 * @param privateKey Optional private key for signing the transaction
 * @returns Promise resolving to deployment result
 */
export async function deployTokenSubnet(
  params: {
    tokenContract: string;
    versionName: string;
    versionNumber: string;
    batchSize: number;
    description?: string;
  },
  stxAddress: string,
  privateKey?: string
): Promise<DeploymentResult> {
  try {
    // Configure Dexterity first
    await configureDexterity(stxAddress);

    // Validate required parameters
    if (!params.tokenContract || !params.versionName || !params.versionNumber) {
      return {
        success: false,
        error: "Required parameters missing: tokenContract, versionName, and versionNumber are required"
      };
    }

    // Convert parameters to SubnetWrapperParams
    const subnetParams: SubnetWrapperParams = {
      tokenContract: params.tokenContract,
      versionName: params.versionName,
      versionNumber: params.versionNumber,
      batchSize: params.batchSize || 200, // Default to 200 if not specified
      description: params.description
    };

    // Deploy the subnet wrapper contract using Dexterity with credentials
    const credentials = privateKey ? { privateKey, stxAddress } : undefined;
    const result = await Dexterity.deployTokenSubnet(subnetParams, credentials);

    // Return the deployment result
    return result;
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error deploying token subnet:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error deploying token subnet"
    };
  }
}

/**
 * Generate subnet wrapper contract code without deploying
 * Used for previewing contract code before deployment
 * @param params The subnet parameters
 * @param stxAddress Optional STX address to use for the contract ID
 * @returns Promise resolving to code generation result
 */
export async function generateSubnetCode(params: {
  tokenContract: string;
  versionName: string;
  versionNumber: string;
  batchSize: number;
  description?: string;
}, stxAddress?: string
): Promise<{ success: boolean; code?: string; contractId?: string; error?: string }> {
  try {
    // Configure Dexterity if stxAddress is provided
    if (stxAddress) {
      await configureDexterity(stxAddress);
    }

    // Convert parameters to SubnetWrapperParams
    const subnetParams: SubnetWrapperParams = {
      tokenContract: params.tokenContract,
      versionName: params.versionName,
      versionNumber: params.versionNumber,
      batchSize: params.batchSize || 200,
      description: params.description
    };

    // Generate code using new Dexterity.generateSubnetCode function
    const codeResult = Dexterity.generateSubnetCode(subnetParams);
    
    return {
      success: true,
      code: codeResult.code,
      contractId: codeResult.contractId
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error generating subnet code"
    };
  }
}