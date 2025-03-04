import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToAnchor() {
  const location = useLocation();

  useEffect(() => {
    // Parse the URL hash (e.g., '#features')
    const hash = location.hash;

    // If there's a hash, find the element and scroll to it
    if (hash) {
      // Remove the '#' character
      const id = hash.replace('#', '');

      // Find the element
      const element = document.getElementById(id);

      if (element) {
        // Add a slight delay to ensure rendering is complete
        setTimeout(() => {
          // Get the navbar height to account for fixed header
          const navbarHeight = document.querySelector('.navbar')?.clientHeight || 0;

          // Calculate position with offset for the navbar
          const offsetPosition = element.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight - 20; // Extra 20px padding

          // Scroll to the element
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location]);

  return null;
}

export default function IndexPage() {
  return (
    <div className="landing-page">
      <ScrollToAnchor />
      {/* Hero Section - Modern gradient with improved layout */}
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

      {/* Key Metrics Section */}
      <section className="py-16 bg-black border-y border-white/5">
        <div className="container">
          <div className="flex flex-col items-center mb-8">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 rounded-full">
              Performance Metrics
            </div>
            <h2 className="text-2xl font-bold text-white">Blazing Fast Performance</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-6 text-center transform transition-all duration-300 hover:border-primary-legacy/30 hover:-translate-y-1 flex-1">
              <div className="text-white text-4xl md:text-5xl font-bold mb-2">~200<span className="text-2xl text-gray-300">ms</span></div>
              <p className="text-gray-400 text-sm md:text-base">Effective Block Time</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-6 text-center transform transition-all duration-300 hover:border-primary-legacy/30 hover:-translate-y-1 flex-1">
              <div className="text-white text-4xl md:text-5xl font-bold mb-2">10<span className="text-2xl text-gray-300">x</span></div>
              <p className="text-gray-400 text-sm md:text-base">Faster Than Base Layer</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-6 text-center transform transition-all duration-300 hover:border-primary-legacy/30 hover:-translate-y-1 flex-1">
              <div className="text-white text-4xl md:text-5xl font-bold mb-2">1M<span className="text-2xl text-gray-300">+</span></div>
              <p className="text-gray-400 text-sm md:text-base">Transactions Per Day</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-6 text-center transform transition-all duration-300 hover:border-primary-legacy/30 hover:-translate-y-1 flex-1">
              <div className="text-white text-4xl md:text-5xl font-bold mb-2">99.9<span className="text-2xl text-gray-300">%</span></div>
              <p className="text-gray-400 text-sm md:text-base">Uptime Reliability</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-secondary-legacy uppercase bg-secondary-legacy/10 rounded-full">
              Technology
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Blaze Protocol Works</h2>
            <p className="text-xl text-gray-400">
              Inspired by innovations in block propagation like FlashBlocks, Blaze delivers a seamless, near-instant experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-12">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-legacy text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Preconfirmation Blocks</h3>
                    <p className="text-gray-400">
                      Blaze creates preconfirmation blocks every 200ms, making transactions feel instant while maintaining security guarantees.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-legacy text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Subnet Architecture</h3>
                    <p className="text-gray-400">
                      Operators process transfers off-chain in specialized subnets and periodically settle them on-chain in batches, enabling high throughput.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-legacy text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">On-chain Settlement</h3>
                    <p className="text-gray-400">
                      All transactions are eventually settled on-chain, preserving the security guarantees of the underlying blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-black p-6 rounded-xl border border-gray-800 shadow-2xl relative z-10">
                <img src="/blaze-diagram.svg" alt="Blaze Protocol Architecture" className="w-full" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-legacy/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-legacy/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Signet Signer Section */}
      <section id="signet" className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 rounded-full">
                Browser Extension
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet <span className="text-gray-200">Signet Signer</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                The companion extension for Blaze Protocol that enables secure, user-friendly structured data signing for true wallet-less web3 experiences.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Secure Signing</h4>
                    <p className="text-gray-400">Enable secure structured data signing without exposing private keys</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-3 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Fast Transactions</h4>
                    <p className="text-gray-400">One-click approval workflow speeds up the transaction signing process</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-3 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Web2 UX with Web3 Security</h4>
                    <p className="text-gray-400">Bridge the gap between traditional web and blockchain technology</p>
                  </div>
                </div>
              </div>

              <a href="https://chrome.google.com/webstore/detail/signet-signer/extension-id" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center py-3 px-8">
                Download Extension
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            <div className="flex-1 relative">
              <div className="bg-black p-1 rounded-xl overflow-hidden border border-gray-800 shadow-2xl relative z-10">
                <div className="w-full rounded-lg bg-gradient-to-br from-gray-900 to-black p-4 border border-gray-800">
                  <svg width="100%" height="400" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="800" height="500" rx="8" fill="#0F1629" />

                    <rect x="0" y="0" width="800" height="60" rx="8" fill="#1A2032" />
                    <circle cx="40" cy="30" r="15" fill="#5546FF" />
                    <rect x="70" y="20" width="100" height="20" rx="4" fill="#2A3042" />
                    <circle cx="760" cy="30" r="15" fill="#2A3042" />

                    <rect x="30" y="80" width="740" height="100" rx="8" fill="#1A2032" />
                    <text x="50" y="110" fill="#888" fontSize="12">Total Balance</text>
                    <text x="50" y="145" fill="#fff" fontSize="24" fontWeight="bold">$2,718.13</text>
                    <text x="200" y="145" fill="#4ade80" fontSize="12">+1.2% today</text>

                    <rect x="50" y="160" width="100" height="30" rx="15" fill="#5546FF20" stroke="#5546FF" strokeWidth="1" />
                    <text x="70" y="180" fill="#fff" fontSize="12">Deposit</text>

                    <rect x="170" y="160" width="100" height="30" rx="15" fill="#5546FF20" stroke="#5546FF" strokeWidth="1" />
                    <text x="195" y="180" fill="#fff" fontSize="12">Send</text>

                    <rect x="290" y="160" width="100" height="30" rx="15" fill="#5546FF20" stroke="#5546FF" strokeWidth="1" />
                    <text x="315" y="180" fill="#fff" fontSize="12">Swap</text>

                    <rect x="30" y="200" width="740" height="80" rx="8" fill="#1A2032" />
                    <circle cx="70" cy="240" r="20" fill="#5546FF20" />
                    <text x="62" y="245" fill="#5546FF" fontSize="14" fontWeight="bold">STX</text>
                    <text x="110" y="230" fill="#fff" fontSize="14">Stacks</text>
                    <text x="110" y="255" fill="#888" fontSize="12">STX</text>
                    <text x="650" y="230" fill="#fff" fontSize="14">1,245.58</text>
                    <text x="650" y="255" fill="#888" fontSize="12">$1,432.42</text>
                    <text x="730" y="255" fill="#4ade80" fontSize="12">+2.4%</text>

                    <rect x="30" y="300" width="740" height="80" rx="8" fill="#1A2032" />
                    <circle cx="70" cy="340" r="20" fill="#F7931A20" />
                    <text x="62" y="345" fill="#F7931A" fontSize="14" fontWeight="bold">BTC</text>
                    <text x="110" y="330" fill="#fff" fontSize="14">Bitcoin</text>
                    <text x="110" y="355" fill="#888" fontSize="12">BTC</text>
                    <text x="650" y="330" fill="#fff" fontSize="14">0.0214</text>
                    <text x="650" y="355" fill="#888" fontSize="12">$1,285.71</text>
                    <text x="730" y="355" fill="#ef4444" fontSize="12">-0.8%</text>

                    <rect x="30" y="400" width="740" height="40" rx="8" fill="transparent" stroke="#1A2032" strokeWidth="2" strokeDasharray="4" />
                    <text x="350" y="425" fill="#888" fontSize="14">Add Token</text>
                  </svg>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-legacy/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-legacy/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
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
                <pre className="p-6 overflow-auto text-sm font-mono leading-relaxed text-gray-300">
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

      {/* About Blaze Section */}
      <section id="about" className="py-24 bg-black">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/10 rounded-full">
              The Technology
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Blaze Protocol</h2>
            <p className="text-xl text-gray-400">
              A layer 2 scaling solution enabling fast, off-chain transfers with on-chain settlement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-charisma hover:border-primary-legacy/30 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Subnet Architecture</h3>
              <p className="text-gray-400">
                Blaze uses a subnet architecture where operators process transfers off-chain and periodically settle them on-chain in batches, enabling high throughput and low latency.
              </p>
            </div>
            <div className="card-charisma hover:border-primary-legacy/30 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Structured Data Signing</h3>
              <p className="text-gray-400">
                The Signet Signer extension enables secure, user-friendly structured data signing for Blaze, bridging the gap between web2 UX and web3 security.
              </p>
            </div>
            <div className="card-charisma hover:border-primary-legacy/30 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-legacy/10 text-primary-legacy mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">High Performance</h3>
              <p className="text-gray-400">
                With preconfirmation blocks and optimized settlement, Blaze can process millions of transfers per day per node, limited only by the underlying blockchain capacity.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a href="https://blazeprotocol.xyz" target="_blank" rel="noopener" className="btn-outline inline-flex items-center py-3 px-6 border-primary-legacy/30 hover:bg-primary-legacy/10">
              Learn More About Blaze Protocol
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-legacy/20 via-secondary-legacy/20 to-primary-legacy/20"></div>
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Glowing orbs for visual effect */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary-legacy/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-secondary-legacy/30 rounded-full blur-3xl"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to Experience the Future of Blockchain?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get started with Blaze Protocol and Signet Signer today for lightning-fast transactions and a seamless user experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://chrome.google.com/webstore/detail/signet-signer/extension-id" target="_blank" rel="noopener noreferrer" className="btn-primary py-3 px-8 text-lg">
                Download Extension
              </a>
              <a href="https://docs.blazeprotocol.xyz" target="_blank" rel="noopener" className="btn-outline py-3 px-8 text-lg border-white/30 hover:border-primary-legacy hover:bg-primary-legacy/10">
                Read Documentation
              </a>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              No credit card required. Start integrating in minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}