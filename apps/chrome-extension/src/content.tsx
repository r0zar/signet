import { Cl, signStructuredData } from "@stacks/transactions"
import { generateWallet } from "@stacks/wallet-sdk"
import type { PlasmoCSConfig } from "plasmo"

// Extension configuration
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// =============================================
// Initialize Signet Extension Components
// =============================================

// Set up the primary message handler for structured data signing
window.addEventListener("message", async (event: MessageEvent) => {
  console.log("[SIGNET] New event:", event.data);

  // Check if this looks like a structured data request
  if (event.data.message.type === "SIGN_REQUEST") {
    // Create a Stacks private key from the provided key
    // Using a test key for development - this should be replaced with proper key management
    const wallet = await generateWallet({
      secretKey: 'grid moral stone clip annual method used car fold summer farm next miss mistake ability trip reason clip gallery sound shrug fix raise behind',
      password: 'test-password'
    });
    const privateKey = wallet.accounts[0].stxPrivateKey;
    const domain = Cl.tuple({
      name: Cl.stringAscii('name'),
      version: Cl.stringAscii('v0'),
      'chain-id': Cl.uint(1),
    });
    // Create a structured data message
    const cvMessage = event.data.message.data
    // TODO: Convert into clarity value
    const message = Cl.tuple({});

    // Sign the structured data hash
    const signature = signStructuredData({
      domain,
      message,
      privateKey
    });
    chrome.runtime.sendMessage({
      type: "SIGN_RESPONSE",
    })
  }
});


// =============================================
// React Overlay Component
// =============================================

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
    </div>
  )
}

export default PlasmoOverlay