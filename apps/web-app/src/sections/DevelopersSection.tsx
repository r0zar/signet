import React from 'react';

const DevelopersSection: React.FC = () => {
  return (
    <section id="developers" className="py-24 bg-gradient-to-br from-[#0A1428] to-[#0f0f23]">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-secondary-legacy uppercase bg-secondary-legacy/10 rounded-full">
              For Developers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Build on <span className="text-gray-200">Blaze Protocol</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Integrate Blaze Protocol into your application with our simple SDK and use Signet Signer for secure transaction signing.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Simple integration with any web3 application</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Comprehensive documentation and examples</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Robust error handling and fallback mechanisms</span>
              </li>
            </ul>
            <a href="https://docs.blazeprotocol.xyz" target="_blank" rel="noopener" className="btn-primary inline-flex items-center py-3 px-6">
              Read the Documentation
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="flex-1">
            <div className="bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-sm text-gray-400">index.js</div>
              </div>
              <pre className="p-6 overflow-auto text-sm font-mono leading-relaxed text-gray-300" style={{ maxHeight: '400px', background: '#101010', padding: '1rem' }}>
                {`// Example: Using Blaze Protocol with Signet Signer
import { Blaze } from '@blaze/sdk';

// Initialize the Blaze client
const blaze = new Blaze({
  subnet: "example.subnet.blaze.xyz",
  appName: "My Awesome App"
});

// Transfer tokens using Blaze protocol
const transfer = async () => {
  try {
    // Signet Signer handles the signing process
    const result = await blaze.transfer({
      to: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      amount: 100,
      metadata: {
        note: "Payment for services",
        invoiceId: "INV-2023-001"
      }
    });
    
    // Transaction is preconfirmed in ~200ms
    console.log("Transfer preconfirmed:", result);
    
    // Wait for full confirmation
    const receipt = await result.wait();
    console.log("Transfer settled on-chain:", receipt);
    
    return receipt;
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error;
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;