import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 rounded-full">
            Core Benefits
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Key Features of <span className="text-gray-200">Blaze Protocol</span>
          </h2>
          <p className="text-xl text-gray-400">
            Designed to streamline blockchain transactions while maintaining the highest security standards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="feature-card group hover:border-primary-legacy/30 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Near-Instant Transactions</h3>
            <p className="text-gray-400">
              Experience ~200ms preconfirmation times, making transactions feel instantaneous for users.
            </p>
          </div>
          <div className="feature-card group hover:border-primary-legacy/30 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Scalable Subnet Architecture</h3>
            <p className="text-gray-400">
              Dedicated subnets process millions of transactions per day, limited only by the underlying blockchain capacity.
            </p>
          </div>
          <div className="feature-card group hover:border-primary-legacy/30 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Full Security Guarantees</h3>
            <p className="text-gray-400">
              Maintain the security of the base layer while enjoying the speed of a layer 2 solution.
            </p>
          </div>
          <div className="feature-card group hover:border-primary-legacy/30 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Wallet-less UX</h3>
            <p className="text-gray-400">
              Abstract away web3 complexity while preserving the security and decentralization of blockchain technology.
            </p>
          </div>
          <div className="feature-card group hover:border-primary-legacy/30 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Multi-Chain Support</h3>
            <p className="text-gray-400">
              Built for Bitcoin and Stacks ecosystems with a unified interface and consistent user experience.
            </p>
          </div>
          <div className="feature-card group hover:border-primary-legacy/30 p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6 group-hover:bg-primary-legacy group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">Developer-Friendly</h3>
            <p className="text-gray-400">
              Comprehensive APIs and SDKs make integration into your existing applications simple and straightforward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;