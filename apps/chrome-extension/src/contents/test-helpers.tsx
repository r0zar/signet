import type { PlasmoCSConfig } from "plasmo"

// Configure this content script to run on all URLs in the MAIN world
// This allows us to modify the window object
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN",
  all_frames: true,
  run_at: "document_start"
}

// Main function to inject test functions into the page
const injectTestFunctions = () => {
  console.log("[Signet Test] Preparing to inject test functions into page...")

  // Create a message channel to communicate from injected script back to content script
  const channel = new MessageChannel();
  channel.port1.onmessage = (event) => {
    console.log("[Signet Test] Message from injected script:", event.data);

    // Forward messages to service worker
    if (event.data && event.data.type === "forwardToServiceWorker") {
      chrome.runtime.sendMessage(event.data.message)
        .then(response => {
          console.log("[Signet Test] Service worker response:", response);
        })
        .catch(error => {
          console.error("[Signet Test] Service worker error:", error);
        });
    }
  };

  // Create an inline script element with our test functions
  const script = document.createElement('script');
  script.innerHTML = `
    // Flag to track if we've already set up the functions
    if (!window.signetFunctionsInjected) {
      console.log("🔥 Signet Test Functions - Injecting into page context");
      
      // Create a success notification
      window.signetShowSuccess = function(title = "Signature Complete", message = "Your data was successfully signed by Signet Extension") {
        console.log("🔥 Signet Test: Showing success notification", { title, message });
        
        // Log message (will be picked up by content script via channel)
        window.postMessage({
          type: "SIGNET_TEST_FUNCTION_CALLED",
          function: "signetShowSuccess",
          title,
          message,
          timestamp: new Date().toISOString()
        }, "*");
        
        // Dispatch the notification event
        window.dispatchEvent(
          new CustomEvent("signet:show-notification", {
            detail: {
              type: "success",
              title,
              message
            }
          })
        );
        
        // Alert for visual confirmation
        
        return "Success notification triggered";
      };

      // Create an error notification
      window.signetShowError = function(title = "Signature Failed", message = "Failed to sign your data. Please try again.") {
        console.log("🔥 Signet Test: Showing error notification", { title, message });
        
        // Log message (will be picked up by content script via channel)
        window.postMessage({
          type: "SIGNET_TEST_FUNCTION_CALLED",
          function: "signetShowError",
          title,
          message,
          timestamp: new Date().toISOString()
        }, "*");
        
        // Dispatch the notification event
        window.dispatchEvent(
          new CustomEvent("signet:show-notification", {
            detail: {
              type: "error",
              title,
              message
            }
          })
        );
        
        // Alert for visual confirmation
        
        return "Error notification triggered";
      };

      // Create an info notification
      window.signetShowInfo = function(title = "Signing in Progress", message = "Please wait while we process your signature request...") {
        console.log("🔥 Signet Test: Showing info notification", { title, message });
        
        // Log message (will be picked up by content script via channel)
        window.postMessage({
          type: "SIGNET_TEST_FUNCTION_CALLED",
          function: "signetShowInfo",
          title,
          message,
          timestamp: new Date().toISOString()
        }, "*");
        
        // Dispatch the notification event
        window.dispatchEvent(
          new CustomEvent("signet:show-notification", {
            detail: {
              type: "info",
              title,
              message
            }
          })
        );
        
        // Alert for visual confirmation
        
        return "Info notification triggered";
      };
      
      // Mark as injected to avoid duplicates
      window.signetFunctionsInjected = true;
      
      console.log("🔥 Signet Test Functions successfully injected. Available functions:");
      console.log("- window.signetShowSuccess(title, message)");
      console.log("- window.signetShowError(title, message)");
      console.log("- window.signetShowInfo(title, message)");
    } else {
      console.log("🔥 Signet Test Functions already injected");
    }
  `;

  // Listen for messages from the injected script
  window.addEventListener('message', (event) => {
    // Ensure message is from the same window
    if (event.source !== window) return;

    // Handle test function calls
    if (event.data && event.data.type === 'SIGNET_TEST_FUNCTION_CALLED') {
      console.log('[Signet Test] Function called in page:', event.data);

      // Forward to service worker
      chrome.runtime.sendMessage({
        type: 'testFunctionCalled',
        data: {
          function: event.data.function,
          title: event.data.title,
          message: event.data.message,
          timestamp: event.data.timestamp,
          url: window.location.href
        }
      }).catch(error => {
        console.error('[Signet Test] Failed to notify service worker:', error);
      });
    }
  });

  // Add a listener to hear successful event dispatches
  window.addEventListener('signet:test-event', (event) => {
    console.log('[Signet Test] Test event caught in content script:', event);

    // Notify service worker that events are working
    chrome.runtime.sendMessage({
      type: 'testEventReceived',
      data: {
        event: 'signet:test-event',
        detail: event.detail,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    }).catch(error => {
      console.error('[Signet Test] Failed to notify service worker about test event:', error);
    });
  });

  // Add the script to the page
  if (document.documentElement) {
    document.documentElement.appendChild(script);
    script.remove(); // Remove after execution
    console.log("[Signet Test] Script injected into page");
  } else {
    // If document not ready yet, wait for it
    console.log("[Signet Test] Document not ready, waiting...");
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.appendChild(script);
      script.remove();
      console.log("[Signet Test] Script injected into page (delayed)");
    });
  }

  // Notify service worker that the test helpers have been loaded
  chrome.runtime.sendMessage({
    type: 'testHelpersLoaded',
    data: {
      timestamp: new Date().toISOString(),
      url: window.location.href
    }
  }).catch(error => {
    console.error('[Signet Test] Failed to notify service worker about test helpers loading:', error);
  });
};

// Run the function when script is executed
injectTestFunctions();

// No React component needed for this content script
export default function TestHelpers() {
  return null
}