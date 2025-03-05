import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-[#112240] py-20 md:py-28">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1 text-left">
            <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 rounded-full">
              Layer 2 Scaling Solution
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Blaze Protocol: <span className="text-primary-legacy">10x Faster Transactions</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Blaze Protocol is a layer 2 scaling solution for Bitcoin and Stacks, enabling fast, off-chain transfers with on-chain settlement through subnet architecture.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://chrome.google.com/webstore/detail/signet-signer/extension-id" target="_blank" rel="noopener noreferrer" className="btn-primary py-3 px-8 text-lg">Download Extension</a>
              <a href="#about" className="btn-outline py-3 px-8 text-lg">Learn More</a>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl shadow-primary-legacy/20">
              <div className="w-full rounded-xl bg-gradient-to-br from-black/50 to-gray-800/40 p-8 border border-gray-700">
                <svg width="100%" height="250" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="800" height="500" rx="8" fill="#0F1629" />
                  <rect x="40" y="40" width="720" height="60" rx="8" fill="#1A2032" />
                  <circle cx="70" cy="70" r="15" fill="#5546FF" />
                  <rect x="100" y="60" width="120" height="20" rx="4" fill="#2A3042" />
                  <rect x="600" y="60" width="140" height="20" rx="4" fill="#2A3042" />

                  <rect x="40" y="120" width="320" height="340" rx="8" fill="#1A2032" />
                  <rect x="60" y="140" width="280" height="80" rx="4" fill="#2A3042" />
                  <rect x="60" y="240" width="280" height="30" rx="4" fill="#2A3042" />
                  <rect x="60" y="290" width="280" height="30" rx="4" fill="#2A3042" />
                  <rect x="60" y="340" width="280" height="30" rx="4" fill="#2A3042" />
                  <rect x="60" y="390" width="280" height="30" rx="4" fill="#2A3042" />

                  <rect x="380" y="120" width="380" height="160" rx="8" fill="#1A2032" />
                  <rect x="400" y="140" width="340" height="120" rx="4" fill="#2A3042" />
                  <circle cx="420" cy="170" r="10" fill="#5546FF" />
                  <rect x="440" y="160" width="180" height="20" rx="2" fill="#3A4052" />
                  <rect x="440" y="190" width="280" height="15" rx="2" fill="#3A4052" />
                  <rect x="440" y="215" width="280" height="15" rx="2" fill="#3A4052" />

                  <rect x="380" y="300" width="380" height="160" rx="8" fill="#1A2032" />
                  <rect x="400" y="320" width="340" height="120" rx="4" fill="#2A3042" />
                  <circle cx="420" cy="350" r="10" fill="#F7931A" />
                  <rect x="440" y="340" width="180" height="20" rx="2" fill="#3A4052" />
                  <rect x="440" y="370" width="280" height="15" rx="2" fill="#3A4052" />
                  <rect x="440" y="395" width="280" height="15" rx="2" fill="#3A4052" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-legacy/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-legacy/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;