/**
 * API Injector module for Signet Chrome Extension
 * 
 * This module handles the injection of Signet's structured data signing API
 * into webpages, enabling websites to use the extension's capabilities.
 */

// Inject API into the page
export const injectSigningAPI = () => {
  // Define the function to inject API and trigger event
  const injectFunction = function () {
    // Create global API object
    window.SignetAPI = {
      signStructuredData: function (structuredData) {
        return new Promise(function (resolve, reject) {
          var requestId = 'req_' + Math.random().toString(36).substring(2, 15);

          var listener = function (event) {
            if (event.data &&
              event.data.type === 'SIGNET_SIGN_STRUCTURED_DATA_RESULT' &&
              event.data.id === requestId) {
              window.removeEventListener('message', listener);
              var result = event.data.result;
              if (result.success) {
                resolve(result.signature);
              } else {
                reject(new Error(result.error || 'Signing failed'));
              }
            }
          };

          window.addEventListener('message', listener);

          window.postMessage({
            type: 'SIGNET_SIGN_STRUCTURED_DATA',
            id: requestId,
            data: { structuredData: structuredData }
          }, '*');
        });
      }
    };

    // Also set the flag
    window.SIGNET_EXTENSION_INSTALLED = true;

    // Log and dispatch event
    console.log('[SignetAPI]: API injected and ready');
    window.dispatchEvent(new CustomEvent('signet-api-ready'));
  };

  const script = document.createElement('script');
  script.textContent = '(' + injectFunction.toString() + ')();';
  (document.head || document.documentElement).appendChild(script);
  script.remove(); // Remove after execution
};

// Add a visual marker that the extension is installed
export const addExtensionMarker = () => {
  const marker = document.createElement('div');
  marker.id = 'signet-extension-marker';
  marker.style.display = 'none';
  marker.setAttribute('data-extension-version', '1.0.0');
  marker.setAttribute('data-extension-api-injected', 'pending');
  document.body.appendChild(marker);

  // Add an event listener to update the marker when API is ready
  window.addEventListener('signet-api-ready', function () {
    const marker = document.getElementById('signet-extension-marker');
    if (marker) {
      marker.setAttribute('data-extension-api-injected', 'success');
    }
  });
};

// Main injection function to install the API
export const injectAPI = () => {
  console.log("[Signet Extension] Injecting API into page");

  // Inject the signing API
  injectSigningAPI();
  
  // Add extension marker
  addExtensionMarker();

  console.log("[Signet Extension] API injection completed");
};

// Initialize the API - call this from content.tsx
export const initializeAPI = () => {
  // Try to inject immediately and again after DOM is loaded to ensure it happens
  try {
    if (document.head && document.body) {
      injectAPI();
    }
  } catch (err) {
    console.error("[Signet Extension] Early injection failed:", err);
  }

  // Also inject on DOMContentLoaded for reliability
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[Signet Extension] DOM fully loaded, injecting API");
    try {
      injectAPI();
    } catch (err) {
      console.error("[Signet Extension] DOMContentLoaded injection failed:", err);
    }
  });
};