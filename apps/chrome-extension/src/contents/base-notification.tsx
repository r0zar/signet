import { useEffect, useState } from "react"
import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"

// Base notification types
export type NotificationType = "success" | "error" | "info"

// Base notification props
export type BaseNotificationProps = PlasmoCSUIProps & {
  type?: NotificationType
  title?: string
  message?: string
}

// Base notification event detail
export interface BaseNotificationEventDetail {
  type: NotificationType
  title: string
  message: string
}

// Base notification state hook
export const useBaseNotification = (eventName: string) => {
  const [notificationProps, setNotificationProps] = useState<{
    type: NotificationType
    title: string
    message: string
    visible: boolean
    key: number
  }>({
    type: "info",
    title: "Notification",
    message: "This is a notification from Signet Extension",
    visible: false,
    key: 0
  })

  // Return event handler for reuse
  const createNotificationHandler = () => {
    console.log(`[Signet ${eventName}] Setting up event listeners`)
    
    // Page load detection
    const pageLoadTime = Date.now();
    const isInitialLoadPeriod = () => (Date.now() - pageLoadTime) < 1000;

    // Create the custom event handler
    const handleNotificationEvent = (event: CustomEvent<BaseNotificationEventDetail>) => {
      console.log(`[Signet ${eventName}] Custom event received:`, event.detail)
      
      const { type, title, message } = event.detail
      
      // Skip for Signet Demo
      if (title === "Signet Demo" || title?.includes("Signet Demo")) {
        console.log(`[Signet ${eventName}] Skipping auto-notification for Signet Demo`);
        return;
      }
      
      // Prevent during page load
      if (isInitialLoadPeriod()) {
        console.log(`[Signet ${eventName}] Skipping auto-notification during initial page load period`);
        return;
      }

      // Update notification properties
      setNotificationProps({
        type: type || "info",
        title: title || "Notification",
        message: message || "Notification from Signet Extension",
        visible: true,
        key: Date.now()
      })
      
      // Report to service worker
      try {
        chrome.runtime.sendMessage({
          type: "notificationShown",
          data: {
            type,
            title,
            message,
            eventType: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href
          }
        });
      } catch (error) {
        console.error(`[Signet ${eventName}] Error sending message to service worker:`, error);
      }

      // Auto-hide after 3 seconds (reduced from 5)
      setTimeout(() => {
        setNotificationProps(prev => ({
          ...prev,
          visible: false
        }))
      }, 3000)
    }
    
    return handleNotificationEvent;
  }

  return { notificationProps, createNotificationHandler }
}

// Basic notification container
export const BaseNotificationContainer = ({ 
  children, 
  key,
  accentColor
}: { 
  children: React.ReactNode, 
  key: number,
  accentColor: string
}) => {
  return (
    <div 
      key={key}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        zIndex: 2147483647,
        opacity: 1,
        transition: "opacity 0.3s ease-in-out",
        pointerEvents: "none"
      }}
    >
      <div 
        style={{
          backgroundColor: "rgba(23, 23, 23, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 24px 38px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.22)",
          maxWidth: "400px",
          width: "90%",
          overflow: "hidden",
          transform: "scale(1)",
          transition: "transform 0.3s ease-in-out",
          borderTop: `4px solid ${accentColor}`,
          pointerEvents: "auto"
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Shared styles
export const getBaseNotificationStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes signetProgressAnimation {
      from { width: 100%; }
      to { width: 0%; }
    }
  `
  return style
}