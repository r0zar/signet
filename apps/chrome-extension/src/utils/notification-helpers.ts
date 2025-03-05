/**
 * Notification Helper Functions for Signet Chrome Extension
 * 
 * This module provides utility functions for creating and managing
 * notifications in both the extension context and injected page context.
 */

// Define notification types
export type NotificationType = 'success' | 'error' | 'info';

// Interface for notification data
export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
}

// Show a notification using the event system
export const showNotification = (data: NotificationData): string => {
  console.log(`[Signet Extension] ${data.type} notification triggered via event`);
  
  window.dispatchEvent(new CustomEvent('signet:show-notification', {
    detail: data
  }));
  
  return `${data.type} notification triggered!`;
};

// Success notification helper
export const showSuccess = (
  title = "Signature Complete", 
  message = "Your data was successfully signed by the Signet Extension"
): string => {
  return showNotification({ type: 'success', title, message });
};

// Error notification helper
export const showError = (
  title = "Signature Failed", 
  message = "Failed to sign data. Please try again."
): string => {
  return showNotification({ type: 'error', title, message });
};

// Info notification helper
export const showInfo = (
  title = "Signing in Progress", 
  message = "Please wait while we process your signature request..."
): string => {
  return showNotification({ type: 'info', title, message });
};

// Inject these notification helpers into the page context
export const injectNotificationHelpers = (): void => {
  try {
    const script = document.createElement('script');
    script.textContent = `
      // Make test functions available in page context
      window.signetTest = function() {
        console.log("[Signet] Test function executed");
        return "Test successful";
      };
      
      // Add notification test functions using the standard event system
      window.signetShowSuccess = function(title = "Signature Complete", message = "Your data was successfully signed by the Signet Extension") {
        console.log("[Signet] Success notification requested");
        window.dispatchEvent(new CustomEvent('signet:show-notification', { 
          detail: { type: 'success', title, message } 
        }));
        return "Success notification triggered!";
      };
      
      window.signetShowError = function(title = "Signature Failed", message = "Failed to sign data. Please try again.") {
        console.log("[Signet] Error notification requested");
        window.dispatchEvent(new CustomEvent('signet:show-notification', { 
          detail: { type: 'error', title, message } 
        }));
        return "Error notification triggered!";
      };
      
      window.signetShowInfo = function(title = "Signing in Progress", message = "Please wait while we process your signature request...") {
        console.log("[Signet] Info notification requested");
        window.dispatchEvent(new CustomEvent('signet:show-notification', { 
          detail: { type: 'info', title, message } 
        }));
        return "Info notification triggered!";
      };
      
      console.log("[Signet] Notification helpers injected and available in console");
    `;

    (document.head || document.documentElement).appendChild(script);
    script.remove(); // Remove after execution

    console.log("[Signet Extension] Notification helpers injected into page");
  } catch (e) {
    console.error("[Signet Extension] Failed to inject notification helpers:", e);
  }
};

// Add notification helper functions to the extension context
export const setupExtensionNotificationHelpers = (): void => {
  try {
    // Create simple test functions for the extension context
    const globalWindow = window || self || globalThis;

    globalWindow.signetShowSuccess = (title?: string, message?: string): string => 
      showSuccess(title, message);

    globalWindow.signetShowError = (title?: string, message?: string): string => 
      showError(title, message);

    globalWindow.signetShowInfo = (title?: string, message?: string): string => 
      showInfo(title, message);

    // Set up listener for notification events for logging
    window.addEventListener('signet:show-notification', (event: CustomEvent) => {
      if (event.detail && event.detail.type) {
        console.log("[Signet Extension] Notification event detected:", event.detail);
      }
    });

    console.log("[Signet Extension] All notification helpers added successfully");
  } catch (e) {
    console.error("[Signet Extension] Failed to add notification helpers:", e);
  }
};