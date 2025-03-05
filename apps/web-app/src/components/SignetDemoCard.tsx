import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';

interface SignetDemoCardProps {
  children: React.ReactNode;
}

const SignetDemoCard: React.FC<SignetDemoCardProps> = ({ children }) => {
  return (
    <Card variant="glass" className="max-w-5xl mx-auto backdrop-blur-sm border border-gray-800/50 shadow-xl overflow-hidden">
      <CardHeader className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-black border-b border-gray-800/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-legacy/10 flex items-center justify-center border border-primary-legacy/30 shadow-glow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-legacy" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Signet Signer Demo</h3>
            <div className="flex items-center mt-1">
              <div id="status-indicator" className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
              <span id="connection-status" className="text-xs text-yellow-500">Waiting for connection</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <span className="px-3 py-1 rounded-md bg-black/30 border border-gray-700/50 text-xs text-gray-400 font-mono">wallet://signet</span>
          <div className="px-3 py-1 rounded-md bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-mono flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
            Secure Connection
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 min-h-[500px] p-0 overflow-hidden">
        {children}
      </CardContent>

      <CardFooter className="flex items-center justify-between bg-black/20 border-t border-gray-800/50 py-3 px-4">
        <div className="text-xs text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          End-to-end encrypted signatures
        </div>
        <a
          href="https://chrome.google.com/webstore/detail/signet-signer/abcdefghijklmnopqrstuvwxyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-legacy hover:text-primary-legacy/80 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Install Extension
        </a>
      </CardFooter>
    </Card>
  );
};

export default SignetDemoCard;