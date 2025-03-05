import React from 'react';

const KeyMetricsSection: React.FC = () => {
  return (
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
  );
};

export default KeyMetricsSection;