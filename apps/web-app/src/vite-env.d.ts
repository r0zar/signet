/// <reference types="vite/client" />

// Define global types for SignetAPI
interface SignatureResult {
  signature: string;
  message: any;
  timestamp: number;
  status: 'completed' | 'rejected' | 'failed';
}

interface SignetAPI {
  signStructuredData: (structuredData: any) => Promise<SignatureResult>;
}

interface Window {
  SignetAPI?: SignetAPI;
  signetShowSuccess?: (title: string, message: string) => void;
  signetShowError?: (title: string, message: string) => void;
  signetShowInfo?: (title: string, message: string) => void;
  SIGNET_EXTENSION_INSTALLED?: boolean;
  signetEventListenerRegistered?: boolean;
  signetExtensionVersion?: string;
  signetIsReady?: boolean;
  signetCheckConnection?: () => Promise<boolean>;
  signetLastConnect?: number;
}
