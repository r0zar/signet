import { useEffect } from "react"
import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"

// Define the config
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Define notification types
type NotificationType = "success" | "error" | "info"

// Define notification data structure for the custom event
interface NotificationEventDetail {
  type: NotificationType
  title: string
  message: string
  isWalletConnection?: boolean
}

// The notification component - now just a router to the appropriate specific component
const SignetNotification = ({ anchor }: PlasmoCSUIProps) => {
  // Setup event listeners for backward compatibility
  useEffect(() => {
    console.log("[Signet Notification Router] Setting up backward compatibility router")
    
    const handleNotificationEvent = (event: CustomEvent<NotificationEventDetail>) => {
      console.log("[Signet Notification Router] Routing legacy event:", event.detail)
      
      const { isWalletConnection, ...eventDetail } = event.detail
      
      // Determine which new event to dispatch
      if (isWalletConnection || 
          eventDetail.title === "Wallet Connected" || 
          eventDetail.message?.toLowerCase().includes("already connected") ||
          eventDetail.message?.toLowerCase().includes("connected to signet")) {
        // Route to wallet notification
        window.dispatchEvent(new CustomEvent('signet:show-wallet-notification', {
          detail: eventDetail
        }))
      } else {
        // Default to signature notification
        window.dispatchEvent(new CustomEvent('signet:show-signature-notification', {
          detail: eventDetail
        }))
      }
    }
    
    // Also handle window messages for backward compatibility
    const handleWindowMessage = (event: MessageEvent) => {
      // Only accept messages from the same window
      if (event.source !== window) return;
      
      // Check if this is a notification request
      if (event.data && 
          typeof event.data === 'object' && 
          event.data.type === 'SIGNET_SHOW_NOTIFICATION') {
        
        console.log("[Signet Notification Router] Routing legacy window message:", event.data);
        
        // Extract notification details from the message
        const { notificationType, title, message, isWalletConnection } = event.data;
        
        // Route based on notification type
        if (isWalletConnection || 
            title === "Wallet Connected" || 
            (message && (
              message.toLowerCase().includes("already connected") ||
              message.toLowerCase().includes("connected to signet")
            ))) {
          window.dispatchEvent(new CustomEvent('signet:show-wallet-notification', {
            detail: {
              type: notificationType || "info",
              title: title || "Notification",
              message: message || "Notification from Signet Extension"
            }
          }))
        } else {
          window.dispatchEvent(new CustomEvent('signet:show-signature-notification', {
            detail: {
              type: notificationType || "info",
              title: title || "Notification",
              message: message || "Notification from Signet Extension"
            }
          }))
        }
      }
    };
    
    // Listen for legacy events
    window.addEventListener("signet:show-notification", handleNotificationEvent as EventListener);
    window.addEventListener("message", handleWindowMessage);
    
    console.log("[Signet Notification Router] Legacy event routing set up");
    
    // Clean up
    return () => {
      window.removeEventListener("signet:show-notification", handleNotificationEvent as EventListener);
      window.removeEventListener("message", handleWindowMessage);
    }
  }, [])
  
  // This component doesn't render anything itself
  return null
}

export default SignetNotification

// Keep the overlay anchor and style for Plasmo
export const getOverlayAnchor = () => document.body
export const getStyle = () => document.createElement("style")

// Debug log to confirm the content script is loaded
console.log("[Signet Notification Router] Content script loaded")