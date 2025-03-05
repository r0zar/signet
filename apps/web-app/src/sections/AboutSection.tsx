import React from 'react';

const AboutSection: React.FC = () => {
  return (
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
  );
};

export default AboutSection;