/**
 * Signature utility functions for Signet Extension
 */

import { 
  ClarityValue, 
  stringAsciiCV, 
  stringUtf8CV, 
  intCV, 
  uintCV, 
  trueCV, 
  falseCV, 
  noneCV,
  someCV,
  bufferCV,
  standardPrincipalCV,
  contractPrincipalCV,
  tupleCV,
  listCV
} from '@stacks/transactions';

import { 
  SignaturePayload, 
  SignatureMessageType, 
  TrustSettings,
  SignatureRequestStatus,
  ExtensionMessageType,
  SignatureRequestMessage,
  SignatureResponseMessage,
  OpPredictPayload,
  TransactionPayload,
  StructuredDataPayload,
  ClarityTypeData
} from '../types/signature';

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Formats a number as STX with appropriate suffix
 */
export function formatSTX(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)} STX`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)} mSTX`;
  } else {
    return `${amount} μSTX`;
  }
}

/**
 * Gets the origin from a URL
 */
export function getOrigin(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch (e) {
    return url;
  }
}

/**
 * Checks if an origin is trusted for a specific signature type
 */
export function isOriginTrusted(
  origin: string,
  type: SignatureMessageType,
  trustSettings: TrustSettings
): boolean {
  const trustedOrigin = trustSettings.trustedOrigins.find(
    (trusted) => trusted.origin === origin
  );

  if (!trustedOrigin) {
    return false;
  }

  return trustedOrigin.allowedTypes.includes(type) && !trustedOrigin.requireConfirmation;
}

/**
 * Determines if a signature request can be auto-signed
 */
export function canAutoSign(
  payload: SignaturePayload,
  trustSettings: TrustSettings
): boolean {
  if (!trustSettings.autoSignEnabled) {
    return false;
  }

  const origin = payload.source.origin;
  const trusted = isOriginTrusted(origin, payload.type, trustSettings);

  if (!trusted) {
    return false;
  }

  // Check amount limits for transactions and predictions
  if (payload.type === SignatureMessageType.TRANSACTION) {
    const txPayload = payload as TransactionPayload;
    const trustedOrigin = trustSettings.trustedOrigins.find(to => to.origin === origin);
    const maxAmount = trustedOrigin?.maxAmount || trustSettings.globalMaxAmount;
    
    // For now, we're assuming the transaction amount is accessible.
    // You'll need to update this once you have the actual transaction structure.
    const amount = 0; // Replace with actual amount extraction
    
    return amount <= maxAmount;
  }

  if (payload.type === SignatureMessageType.OP_PREDICT) {
    const predictPayload = payload as OpPredictPayload;
    const trustedOrigin = trustSettings.trustedOrigins.find(to => to.origin === origin);
    const maxAmount = trustedOrigin?.maxAmount || trustSettings.globalMaxAmount;
    
    if (!predictPayload.amount) {
      return true;
    }
    
    return predictPayload.amount <= maxAmount;
  }

  return true;
}

/**
 * Creates a signature request message
 */
export function createSignatureRequest(
  payload: SignaturePayload,
  origin: string
): SignatureRequestMessage {
  return {
    type: ExtensionMessageType.SIGNATURE_REQUEST,
    payload,
    origin,
    id: generateRequestId(),
    timestamp: Date.now(),
    showNotification: true
  };
}

/**
 * Creates a signature response message
 */
export function createSignatureResponse(
  requestId: string,
  status: SignatureRequestStatus,
  signature?: string,
  error?: string
): SignatureResponseMessage {
  return {
    type: ExtensionMessageType.SIGNATURE_RESPONSE,
    payload: {
      requestId,
      status,
      signature,
      error
    },
    id: generateRequestId(),
    timestamp: Date.now()
  };
}

/**
 * Converts JSON to Clarity Value
 */
export function jsonToClarityValue(value: any): ClarityValue {
  if (value === null) {
    return noneCV();
  }

  if (typeof value === 'boolean') {
    return value ? trueCV() : falseCV();
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? 
      (value >= 0 ? uintCV(value) : intCV(value)) : 
      // For non-integers, convert to string
      stringAsciiCV(value.toString());
  }

  if (typeof value === 'string') {
    // Handle different string formats
    if (value.startsWith('0x')) {
      // Hex strings become buffers
      return bufferCV(Buffer.from(value.slice(2), 'hex'));
    } else if (value.includes('.')) {
      // Might be a contract principal
      const [address, contractName] = value.split('.');
      if (address && contractName) {
        try {
          return contractPrincipalCV(address, contractName);
        } catch (e) {
          // If not a valid principal, treat as a regular string
          return stringUtf8CV(value);
        }
      }
    } else if (value.startsWith('S') || value.startsWith('P')) {
      // Might be a standard principal
      try {
        return standardPrincipalCV(value);
      } catch (e) {
        // If not a valid principal, treat as a regular string
        return stringUtf8CV(value);
      }
    }
    
    // Default to UTF8 string
    return stringUtf8CV(value);
  }

  if (Array.isArray(value)) {
    return listCV(value.map(jsonToClarityValue));
  }

  if (typeof value === 'object') {
    const result: Record<string, ClarityValue> = {};
    
    for (const [key, val] of Object.entries(value)) {
      result[key] = jsonToClarityValue(val);
    }
    
    return tupleCV(result);
  }

  // Default fallback
  return noneCV();
}

/**
 * Converts a structured data payload to a Clarity Value
 */
export function convertToClarityValue(data: ClarityTypeData): ClarityValue {
  // This is a simplified version - for full implementation,
  // you would need to handle all Clarity types properly
  if (data.type === 'string-ascii') {
    return stringAsciiCV(data.value);
  } else if (data.type === 'string-utf8') {
    return stringUtf8CV(data.value);
  } else if (data.type === 'int') {
    return intCV(data.value);
  } else if (data.type === 'uint') {
    return uintCV(data.value);
  } else if (data.type === 'bool') {
    return data.value ? trueCV() : falseCV();
  } else if (data.type === 'tuple') {
    const tupleData: Record<string, ClarityValue> = {};
    for (const [key, val] of Object.entries(data.value)) {
      tupleData[key] = jsonToClarityValue(val);
    }
    return tupleCV(tupleData);
  } else if (data.type === 'list') {
    return listCV(data.value.map(jsonToClarityValue));
  } else if (data.type === 'optional') {
    return data.value === null ? noneCV() : someCV(jsonToClarityValue(data.value));
  } else {
    // Default case
    return jsonToClarityValue(data.value);
  }
}

/**
 * Get a human-readable description of a signature request
 */
export function getSignatureDescription(payload: SignaturePayload): string {
  switch (payload.type) {
    case SignatureMessageType.TRANSACTION:
      return 'Transaction Signature Request';
    
    case SignatureMessageType.STRUCTURED_DATA:
      const structuredPayload = payload as StructuredDataPayload;
      return structuredPayload.message || 'Structured Data Signature Request';
    
    case SignatureMessageType.OP_PREDICT:
      const predictPayload = payload as OpPredictPayload;
      return predictPayload.marketQuestion || 
        `Prediction Market: ${predictPayload.marketId}`;
    
    case SignatureMessageType.AUTH:
      return `Authentication Request from ${payload.source.appName || payload.source.origin}`;
    
    case SignatureMessageType.MESSAGE:
      return 'Message Signature Request';
    
    default:
      return 'Signature Request';
  }
}