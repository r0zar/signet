/**
 * Main content script for injecting the SignetApp into web pages
 */
import type { PlasmoCSConfig } from "plasmo"
import '../shared/styles/form-elements.css'
import { SignetProvider } from "~shared/context/SignetContext"
import { SignetController } from "./components/SignetController"
import { Notifications } from "./components/Notifications"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

/**
 * Main overlay component for the Chrome extension
 * We wrap SignetApp in a div with specific styles to ensure
 * no styles leak to webpage even without Shadow DOM
 */
const PlasmoOverlay = () => {
  return (
    <div id="signet-root" style={{
      all: 'initial',
      position: 'fixed',
      top: 12,
      left: 10,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none', // Allow clicks to pass through to the page
      zIndex: 999999,
      fontFamily: 'Inter, sans-serif',
      display: 'block',
      boxSizing: 'border-box',
      backgroundColor: 'transparent'
    }}>
      <SignetProvider>
        {/* The controller and notifications are separate components that share the same context */}
        <SignetController />
        <Notifications />
      </SignetProvider>
    </div>
  )
}

export default PlasmoOverlay