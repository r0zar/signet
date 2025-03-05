type NotificationType = 'success' | 'error' | 'info';

interface NotificationOptions {
  title: string;
  message: string;
}

export function showNotification(type: NotificationType, options: NotificationOptions): void {
  try {
    // Try native extension functions first
    if (type === 'success' && typeof window.signetShowSuccess === 'function') {
      window.signetShowSuccess(options.title, options.message);
    } else if (type === 'error' && typeof window.signetShowError === 'function') {
      window.signetShowError(options.title, options.message);
    } else if (type === 'info' && typeof window.signetShowInfo === 'function') {
      window.signetShowInfo(options.title, options.message);
    } else {
      // Fallback to custom event
      window.dispatchEvent(new CustomEvent("signet:show-notification", {
        detail: {
          type,
          title: options.title,
          message: options.message
        }
      }));
    }
  } catch (err) {
    console.error("Failed to show notification:", err);
  }
}