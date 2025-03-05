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

// Specific event type for signature notifications
interface SignatureNotificationEventDetail extends BaseNotificationEventDetail {}

// Custom hook for signature notification state
const useSignatureNotification = () => {
  const { notificationProps, createNotificationHandler } = useBaseNotification("Signature")
  
  // Handle notification events
  useEffect(() => {
    const handleNotificationEvent = createNotificationHandler()
    
    // Add the specific event listener
    window.addEventListener("signet:show-signature-notification", 
      handleNotificationEvent as EventListener)
    
    // Log component ready
    console.log("[Signet Signature] Component mounted and listening for events")
    
    // Log to service worker
    try {
      chrome.runtime.sendMessage({
        type: "signatureNotificationComponentReady",
        data: {
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      })
    } catch (error) {
      console.error("[Signet Signature] Failed to notify service worker:", error)
    }
    
    // Clean up
    return () => {
      window.removeEventListener("signet:show-signature-notification", 
        handleNotificationEvent as EventListener)
    }
  }, [])
  
  return notificationProps
}

// The signature notification component
const SignatureNotification = ({ anchor }: PlasmoCSUIProps) => {
  const { type, title, message, visible, key } = useSignatureNotification()
  
  // Determine accent color based on type
  const accentColor = 
    type === "success" ? "#10b981" : 
    type === "error" ? "#ef4444" : 
    "#5546FF" // Signet brand color for info

  // Determine icon based on type
  let icon = null
  if (type === "success") {
    icon = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={accentColor}/>
      </svg>
    )
  } else if (type === "error") {
    icon = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill={accentColor}/>
      </svg>
    )
  } else {
    icon = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill={accentColor}/>
      </svg>
    )
  }

  // If not visible, render an empty div
  if (!visible) {
    return <div style={{ display: "none" }}></div>
  }

  // Get display title
  const displayTitle = type === "success" ? "Signature Complete" : 
                       type === "error" ? "Signature Failed" : 
                       "Signature Request"

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
        animation: "signatureNotificationSlideIn 0.3s ease-out forwards"
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
          {icon}
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
            {displayTitle}
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
      
      {/* Mini signature animation for success */}
      {type === "success" && (
        <div 
          style={{
            padding: "0 16px 8px",
            display: "flex",
            justifyContent: "center",
            opacity: 0.8
          }}
        >
          <svg width="140" height="30" viewBox="0 0 200 60">
            <path
              d="M20,40 C30,20 40,30 50,40 C60,50 70,20 80,30 C90,40 100,20 110,30 C120,40 130,20 140,40 C150,50 160,30 180,35"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: 500,
                strokeDashoffset: 0,
                animation: "signetSignatureAnimation 2s ease-in-out forwards"
              }}
            />
          </svg>
        </div>
      )}
      
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
export default SignatureNotification

// Configure as a full-screen overlay
export const getOverlayAnchor = () => document.body

// Add custom style for animations
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes signatureNotificationSlideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes signetSignatureAnimation {
      from { stroke-dashoffset: 500; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes signetProgressAnimation {
      from { width: 100%; }
      to { width: 0%; }
    }
    
    @keyframes signatureNotificationFadeOut {
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