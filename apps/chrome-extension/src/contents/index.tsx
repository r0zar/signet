/**
 * Main content script for injecting the SignetController into web pages
 */
import type { PlasmoCSConfig } from "plasmo"
import { SignetProvider } from '../shared/hooks/useSignet'
import { SignetController } from './controller/Controller'
import '../shared/styles/form-elements.css'

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

/**
 * Main overlay component for the Chrome extension
 * We wrap SignetController in a div with specific styles to ensure
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
        <SignetController />
      </SignetProvider>
    </div>
  )
}

export default PlasmoOverlay