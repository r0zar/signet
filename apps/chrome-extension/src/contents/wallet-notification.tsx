import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useEffect, useState } from "react"
import { 
  BaseNotificationContainer, 
  BaseNotificationEventDetail, 
  useBaseNotification,
  getBaseNotificationStyle
} from "./base-notification"

// Define the config
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Specific event type for wallet connections
interface WalletNotificationEventDetail extends BaseNotificationEventDetail {}

// Custom hook for wallet notification state
const useWalletNotification = () => {
  const { notificationProps, createNotificationHandler } = useBaseNotification("Wallet")
  
  // Handle notification events
  useEffect(() => {
    const handleNotificationEvent = createNotificationHandler()
    
    // Add the specific event listener
    window.addEventListener("signet:show-wallet-notification", 
      handleNotificationEvent as EventListener)
    
    // Log component ready
    console.log("[Signet Wallet] Component mounted and listening for events")
    
    // Log to service worker
    try {
      chrome.runtime.sendMessage({
        type: "walletNotificationComponentReady",
        data: {
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      })
    } catch (error) {
      console.error("[Signet Wallet] Failed to notify service worker:", error)
    }
    
    // Clean up
    return () => {
      window.removeEventListener("signet:show-wallet-notification", 
        handleNotificationEvent as EventListener)
    }
  }, [])
  
  return notificationProps
}

// The wallet connection notification component
const WalletNotification = ({ anchor }: PlasmoCSUIProps) => {
  const { type, title, message, visible, key } = useWalletNotification()
  
  // Always use success color for wallet connections
  const accentColor = "#10b981"  // Success green
  
  // Simple checkmark icon
  const checkmarkIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={accentColor}/>
    </svg>
  )

  // If not visible, render an empty div
  if (!visible) {
    return <div style={{ display: "none" }}></div>
  }

  // Simplified wallet connection popup
  return (
    <div 
      key={key}
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        width: "auto",
        maxWidth: "320px",
        backgroundColor: "rgba(23, 23, 23, 0.95)",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        zIndex: 2147483647,
        animation: "walletNotificationSlideIn 0.3s ease-out forwards"
      }}
    >
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px"
        }}
      >
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: `${accentColor}20`,
            marginRight: "12px",
            flexShrink: 0
          }}
        >
          {checkmarkIcon}
        </div>
        <div
          style={{
            flex: 1
          }}
        >
          <div 
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "white",
              marginBottom: "4px"
            }}
          >
            Connection Successful
          </div>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "12px",
              lineHeight: "1.4"
            }}
          >
            {message}
          </div>
        </div>
      </div>
      
      {/* Thin progress bar */}
      <div 
        style={{
          width: "100%",
          height: "2px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          overflow: "hidden"
        }}
      >
        <div 
          style={{
            height: "100%",
            backgroundColor: accentColor,
            width: "100%",
            animation: "signetProgressAnimation 3s linear forwards"
          }}
        />
      </div>
    </div>
  )
}

// Export the default component
export default WalletNotification

// Configure as a full-screen overlay
export const getOverlayAnchor = () => document.body

// Add custom style for animations
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes walletNotificationSlideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes signetProgressAnimation {
      from { width: 100%; }
      to { width: 0%; }
    }
    
    @keyframes walletNotificationFadeOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(10%);
      }
    }
  `
  return style
}