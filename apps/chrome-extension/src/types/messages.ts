/**
 * Message types for communication between webpage and extension
 */

// Structured data for signing
export interface StructuredDataRequest {
  type: 'SIGNET_SIGN_STRUCTURED_DATA';
  id: string;
  data: {
    structuredData: any;
  };
}

// Structured data signing result
export interface StructuredDataResult {
  type: 'SIGNET_SIGN_STRUCTURED_DATA_RESULT';
  id: string;
  result: {
    success: boolean;
    signature?: string;
    error?: string;
  };
}

// Message to background service worker
export interface BackgroundRequest {
  type: string;
  domain: {
    name: string;
  };
  message: any;
}

// Background service worker response
export interface BackgroundResponse {
  success: boolean;
  signature?: string;
  error?: string;
}