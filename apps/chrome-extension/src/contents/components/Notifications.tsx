/**
 * Notifications Component
 * 
 * Responsible for displaying notifications based on messages from the SignetContext
 * This component handles the display, animation, and dismissal of notifications
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSignetContext } from '~shared/context/SignetContext';
import NotificationPanel from '~shared/notifications/NotificationPanel';
import type { Message } from 'signet-sdk/src/messaging';

// Base notification timeout in milliseconds
const DEFAULT_TIMEOUT = 5000;

export function Notifications() {
  const { messages } = useSignetContext();
  const [activeNotification, setActiveNotification] = useState<Message | null>(null);
  const [dismissTimeout, setDismissTimeout] = useState<NodeJS.Timeout | null>(null);

  // Listen for new messages and handle notifications
  useEffect(() => {
    // Only process new messages if we don't have an active notification
    if (!activeNotification && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // Check if this message has a notification flag
      if (latestMessage.data?.notification === true) {
        setActiveNotification(latestMessage);
        
        // Set up auto-dismissal timeout if the notification is not modal
        if (!latestMessage.data?.modal) {
          const duration = latestMessage.data?.duration || DEFAULT_TIMEOUT;
          const timeout = setTimeout(() => {
            setActiveNotification(null);
          }, duration);
          
          setDismissTimeout(timeout);
        }
      }
    }
  }, [messages, activeNotification]);
  
  // Clean up timeout when component unmounts or notification changes
  useEffect(() => {
    return () => {
      if (dismissTimeout) {
        clearTimeout(dismissTimeout);
      }
    };
  }, [dismissTimeout]);

  // Handle user dismissal of notification
  const handleDismiss = () => {
    // Clear any existing timeout
    if (dismissTimeout) {
      clearTimeout(dismissTimeout);
      setDismissTimeout(null);
    }
    
    // Clear the active notification
    setActiveNotification(null);
  };

  return (
    <div className="signet-notifications" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {activeNotification && (
          <NotificationPanel
            notification={activeNotification}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}