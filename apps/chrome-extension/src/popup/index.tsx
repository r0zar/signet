/**
 * Main popup component for the extension
 * Now uses the centralized useSignet hook for state management
 */
import { keyframes } from "../shared/styles/theme"
import "../shared/styles/style.css"

// Import components
import { StatusDisplay } from "./components/StatusDisplay"
import { HologramDisplay } from "./components/HologramDisplay"
import { ConsoleView } from "./components/ConsoleView"
import { SystemMetrics } from "./components/SystemMetrics"
import { SignetProvider } from "~shared/context/SignetContext"

// Wrapped popup component with providers
const PopupWithProvider = () => (
  <SignetProvider>
    <IndexPopup />
  </SignetProvider>
)

// Default export is the wrapped component with provider
export default PopupWithProvider

// The actual Popup component that uses the context
function IndexPopup() {

  return (
    <div
      style={{
        margin: '0px',
        width: '360px',
        height: '500px',
        background: 'linear-gradient(180deg, #0D1117 0%, #010409 100%)',
        border: '1px solid rgba(125, 249, 255, 0.3)',
        borderRadius: '0px',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 5px rgba(125, 249, 255, 0.5)',
      }}
    >
      {/* Top status bar */}
      <StatusDisplay />

      {/* Main interface section */}
      <div style={{
        position: 'relative',
        padding: '0px',
        height: 'calc(100% - 80px)', // Account for top and bottom bars
        overflow: 'hidden'
      }}>
        {/* Background grid lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(125, 249, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(125, 249, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          zIndex: 0
        }} />

        {/* Holographic display */}
        <HologramDisplay />

        {/* Console view */}
        <ConsoleView />
      </div>

      {/* System metrics and controls */}
      <SystemMetrics />

      {/* Inject keyframes for animations */}
      <style>
        {keyframes.slideInUp}
        {keyframes.slideInRight}
        {keyframes.shimmer}
        {keyframes.scanLine}
        {keyframes.spin}
      </style>
    </div>
  )
}

// No export needed here since we export the wrapped component above
