import React from 'react';

const SignetSignerSection: React.FC = () => {
  return (
    <section id="signet" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 rounded-full">
            Browser Extension
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Meet <span className="text-gray-200">Signet Signer</span>
          </h2>
          <p className="text-xl text-gray-400">
            The companion extension for Blaze Protocol that enables secure, user-friendly structured data signing for true wallet-less web3 experiences.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="space-y-6 mb-8">
              {/* Feature 1 */}
              <div className="feature-card group p-6 hover:border-primary-legacy/30 transition-all duration-300">
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-legacy/10 text-primary-legacy mr-4 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">Secure Signing</h4>
                    <p className="text-gray-400">Enable secure structured data signing without exposing private keys</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="feature-card group p-6 hover:border-primary-legacy/30 transition-all duration-300">
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-legacy/10 text-primary-legacy mr-4 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">Fast Transactions</h4>
                    <p className="text-gray-400">One-click approval workflow speeds up the transaction signing process</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="feature-card group p-6 hover:border-primary-legacy/30 transition-all duration-300">
                <div className="flex items-start">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-legacy/10 text-primary-legacy mr-4 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">Web2 UX with Web3 Security</h4>
                    <p className="text-gray-400">Bridge the gap between traditional web and blockchain technology</p>
                  </div>
                </div>
              </div>
            </div>

            <a 
              href="https://chrome.google.com/webstore/detail/signet-signer/extension-id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-8 py-3 font-medium text-white bg-primary-legacy rounded-lg shadow-lg hover:bg-primary-legacy/90 transition-all duration-300"
            >
              Download Extension
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <div className="flex-1 relative">
            {/* Browser Extension UI Mockup */}
            <div className="card-charisma p-1 rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-primary-legacy/20 relative z-10">
              <div className="w-full rounded-lg bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800">
                {/* Browser chrome bar */}
                <div className="bg-gray-800 rounded-t-lg flex items-center p-3 border-b border-gray-700">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full flex items-center px-4 py-1 text-gray-300 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>signet-signer.app</span>
                  </div>
                  <div className="ml-4 p-1.5 rounded-full bg-primary-legacy text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Signet Signer Content */}
                <div className="bg-gray-900 min-h-[400px] flex flex-col">
                  {/* Header */}
                  <div className="px-6 py-6 border-b border-gray-800 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-legacy/10 flex items-center justify-center border border-primary-legacy/30 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-legacy" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Signet Signer</h3>
                      <p className="text-gray-400 text-sm">Secure signature request</p>
                    </div>
                    <div className="ml-auto px-2.5 py-1 bg-green-500/20 border border-green-500/30 rounded-md flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-400 text-xs">Connected</span>
                    </div>
                  </div>

                  {/* Transaction to sign */}
                  <div className="p-6 flex-1">
                    <div className="mb-6">
                      <h4 className="text-gray-300 font-medium mb-2">Transaction to sign</h4>
                      <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-400">App requesting</div>
                          <div className="text-sm text-white font-medium">blockchain-dapp.com</div>
                        </div>

                        <div className="flex mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary-legacy/10 flex items-center justify-center border border-primary-legacy/30 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h5 className="text-white font-medium">Token Transfer</h5>
                            <div className="flex items-center mt-1">
                              <span className="text-xl font-bold text-white">100</span>
                              <span className="text-gray-400 ml-2">STX</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 border-t border-gray-700 pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">From</span>
                            <span className="text-white font-mono">SP2ZNG...55KS</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">To</span>
                            <span className="text-white font-mono">SP3FBR...SVTE</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Network fee</span>
                            <span className="text-white">0.006 STX</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-primary-legacy hover:bg-primary-legacy/90 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Sign Transaction
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between text-sm">
                    <div className="text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary-legacy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      All signing happens locally
                    </div>
                    <div className="text-primary-legacy hover:text-primary-legacy/80 transition-colors cursor-pointer">
                      View details
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary-legacy/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-secondary-legacy/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Global decorative elements */}
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-primary-legacy/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-legacy/5 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4"></div>
    </section>
  );
};

export default SignetSignerSection;