/**
 * Message Handlers for Signet Chrome Extension
 * 
 * This module handles the communication between the webpage and the extension,
 * processing messages for tasks like structured data signing.
 */

import { showSuccess, showError, showInfo } from './notification-helpers';
import type {
  StructuredDataRequest,
  StructuredDataResult,
  BackgroundRequest,
  BackgroundResponse
} from '../types/messages';

// Process a structured data signing request
export const processSigningRequest = async (
  data: StructuredDataRequest['data'], 
  id: string
): Promise<void> => {
  console.log("[Signet Content Script]: Processing signing request", data);

  try {
    // Show initial notification
    showInfo('Signature Request', `Signing structured data from ${window.location.hostname}...`);

    // Forward the signing request to the background service worker
    const request: BackgroundRequest = {
      type: "signStructuredData",
      domain: { name: window.location.hostname },
      message: data.structuredData
    };
    
    const result = await chrome.runtime.sendMessage<BackgroundRequest, BackgroundResponse>(request);

    // Show success/failure notification
    if (result.success) {
      showSuccess('Signature Complete', 'Successfully signed data from ' + window.location.hostname);
    } else {
      showError('Signature Failed', result.error || "Failed to sign data from " + window.location.hostname);
    }

    // Send the result back to the webpage
    const response: StructuredDataResult = {
      type: "SIGNET_SIGN_STRUCTURED_DATA_RESULT",
      id: id,
      result
    };
    
    window.postMessage(response, window.location.origin);
  } catch (error) {
    console.error("[Content Script]: Error processing signing request:", error);

    // Show error notification
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    showError('Signature Failed', "Error processing signing request: " + errorMessage);

    // Send error back to the webpage
    const errorResponse: StructuredDataResult = {
      type: "SIGNET_SIGN_STRUCTURED_DATA_RESULT",
      id: id,
      result: { success: false, error: errorMessage }
    };
    
    window.postMessage(errorResponse, window.location.origin);
  }
};

// Set up the primary message handler for structured data signing
export const setupPrimaryMessageHandler = (): void => {
  window.addEventListener("message", async (event: MessageEvent) => {
    // Debug message received
    console.log("[Signet Debug] Message received:", event.data);

    // Only accept messages from the same origin or trusted origins
    if (event.source !== window) {
      console.log("[Signet Debug] Ignoring message from different source");
      return;
    }

    // Check if this is a message event with data
    if (!event.data || typeof event.data !== 'object') {
      console.log("[Signet Debug] Message has no data or invalid data type");
      return;
    }

    // Check if this looks like a structured data request
    if (event.data.type === "SIGNET_SIGN_STRUCTURED_DATA") {
      const request = event.data as StructuredDataRequest;
      console.log("[Signet Debug] Structured data signing request:", request.type);
      
      await processSigningRequest(request.data, request.id);
    }
  });
};

// Set up the secondary message handler for structured data signing
export const setupSecondaryMessageHandler = (): void => {
  window.addEventListener("message", function (event: MessageEvent) {
    console.log("[Signet Debug - Secondary Handler] Message received:", event.data);

    if (event.source !== window) {
      console.log("[Signet Debug - Secondary Handler] Ignoring message from different source");
      return;
    }

    if (event.data.type !== 'SIGNET_SIGN_STRUCTURED_DATA') {
      console.log("[Signet Debug - Secondary Handler] Not a signing request");
      return;
    }

    // Type-check and process the request
    const request = event.data as StructuredDataRequest;
    console.log("[Signet Debug - Secondary Handler] Processing signing request:", request.id, request.data);

    // Create a notification from the secondary handler using events
    showInfo('Secondary Handler', 'Processing signing request via secondary handler...');

    // Process the signing request
    const backgroundRequest: BackgroundRequest = {
      type: "signStructuredData",
      domain: { name: window.location.hostname },
      message: request.data.structuredData
    };
    
    chrome.runtime.sendMessage<BackgroundRequest, BackgroundResponse>(backgroundRequest)
      .then(result => {
        // Create and send the result response
        const response: StructuredDataResult = {
          type: "SIGNET_SIGN_STRUCTURED_DATA_RESULT",
          id: request.id,
          result: result
        };
        
        window.postMessage(response, window.location.origin);
      })
      .catch(error => {
        // Handle error case
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        // Create and send error response
        const errorResponse: StructuredDataResult = {
          type: "SIGNET_SIGN_STRUCTURED_DATA_RESULT",
          id: request.id,
          result: { success: false, error: errorMessage }
        };
        
        window.postMessage(errorResponse, window.location.origin);
      });
  });
};