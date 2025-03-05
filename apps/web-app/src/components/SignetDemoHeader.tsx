import React from 'react';

const SignetDemoHeader: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 border border-primary-legacy/20 rounded-full shadow-glow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-legacy mr-2"></span>
        Interactive Experience
      </div>
      
      <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Signet Signer Demo
      </h2>
      
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        Connect to the Signet Signer extension and experience secure, wallet-less structured data signing
      </p>
      
      <div className="flex items-center justify-center mt-8 space-x-4 text-sm">
        <div className="flex items-center px-3 py-1.5 rounded-lg bg-black/30 border border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-300">Secure</span>
        </div>
        
        <div className="flex items-center px-3 py-1.5 rounded-lg bg-black/30 border border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-300">Fast</span>
        </div>
        
        <div className="flex items-center px-3 py-1.5 rounded-lg bg-black/30 border border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
          </svg>
          <span className="text-gray-300">Private</span>
        </div>
      </div>
    </div>
  );
};

export default SignetDemoHeader;