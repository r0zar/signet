import React from 'react';

const CtaSection: React.FC = () => {
  return (
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
  );
};

export default CtaSection;