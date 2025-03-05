/**
 * Global type declarations for Signet Extension
 */

interface Window {
  // Signet API exposed to websites
  SignetAPI?: {
    signStructuredData: (data: any) => Promise<any>
  };
  
  // Flag indicating extension is installed
  SIGNET_EXTENSION_INSTALLED?: boolean;
  
  // Notification helper functions
  signetShowSuccess: (title?: string, message?: string) => string;
  signetShowError: (title?: string, message?: string) => string;
  signetShowInfo: (title?: string, message?: string) => string;
  
  // Test function
  signetTest?: () => string;
}