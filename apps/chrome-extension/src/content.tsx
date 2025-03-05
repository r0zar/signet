import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"

import { CountButton } from "~features/count-button"
import { initializeAPI } from "~utils/api-injector"
import { setupExtensionNotificationHelpers, injectNotificationHelpers } from "~utils/notification-helpers"
import { setupPrimaryMessageHandler, setupSecondaryMessageHandler } from "~utils/message-handlers"

// Global types are declared in src/types/global.d.ts

// Extension configuration
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// =============================================
// Initialize Signet Extension Components
// =============================================

// Setup message handlers
setupPrimaryMessageHandler();
setupSecondaryMessageHandler();

// Setup notification helpers
setupExtensionNotificationHelpers();

// Initialize API injection
initializeAPI();

// Execute injection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectNotificationHelpers);
} else {
  injectNotificationHelpers();
}

// Add helper message to console for testing
console.log("[Signet Extension] Content script loaded on:", window.location.href);
console.log("[Signet Extension] Visual notification system ready.");

// =============================================
// React Overlay Component
// =============================================

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
      {/* <CountButton /> */}
    </div>
  )
}

export default PlasmoOverlay