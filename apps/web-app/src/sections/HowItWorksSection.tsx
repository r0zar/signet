import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-secondary-legacy uppercase bg-secondary-legacy/10 rounded-full">
            Technology
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How Blaze Protocol Works</h2>
          <p className="text-xl text-gray-400">
            Powered by off-chain digital signatures, Blaze delivers a seamless, near-instant experience
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
  );
};

export default HowItWorksSection;