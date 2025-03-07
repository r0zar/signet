import type { PlasmoContentScript } from "plasmo"
import React from "react"
import SignetController from "./components/controller/SignetController"
import "./style.css" // Import styles

// Configure the content script to run on all pages
export const config: PlasmoContentScript = {
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
      <SignetController />
    </div>
  )
}

export default PlasmoOverlay