import React from 'react';

const DeveloperSection: React.FC = () => {
  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <div className="text-center mb-3">
        <h3 className="text-base font-semibold text-white mb-1">Developer Integration</h3>
        <p className="text-xs text-gray-400">
          Just a few lines of code to integrate
        </p>
      </div>

      <div className="bg-gray-900/80 rounded-lg border border-gray-800 p-2 text-left mb-3 shadow-md overflow-hidden">
        <div className="flex items-center px-2 py-1 border-b border-gray-800 mb-2">
          <div className="flex space-x-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">index.js</span>
        </div>
        <pre className="text-xs font-mono text-gray-300 overflow-x-auto px-3 py-2">
          <code>
            <div className="text-blue-400">// Check if Signet extension is installed</div>
            <div><span className="text-yellow-300">if</span> (<span className="text-purple-400">window</span>.<span className="text-blue-300">SignetAPI</span>) {'{'}</div>
            <div className="ml-4"><span className="text-blue-400">// Data to sign</span></div>
            <div className="ml-4"><span className="text-yellow-300">const</span> <span className="text-green-300">data</span> = {'{'}</div>
            <div className="ml-8"><span className="text-blue-300">action</span>: <span className="text-yellow-200">"token_transfer"</span>,</div>
            <div className="ml-8"><span className="text-blue-300">amount</span>: <span className="text-yellow-200">"100"</span>,</div>
            <div className="ml-8"><span className="text-blue-300">recipient</span>: <span className="text-yellow-200">"SP2ZNGJ8XY..."</span>,</div>
            <div className="ml-8"><span className="text-blue-300">timestamp</span>: <span className="text-purple-400">Date</span>.<span className="text-blue-300">now</span>()</div>
            <div className="ml-4">{'}'};</div>
            <div></div>
            <div className="ml-4"><span className="text-blue-400">// Request signature</span></div>
            <div className="ml-4"><span className="text-yellow-300">const</span> <span className="text-green-300">result</span> = <span className="text-yellow-300">await</span> <span className="text-purple-400">window</span>.<span className="text-blue-300">SignetAPI</span>.<span className="text-blue-300">signStructuredData</span>(data);</div>
            <div className="ml-4"><span className="text-purple-400">console</span>.<span className="text-blue-300">log</span>(<span className="text-yellow-200">"Signature:"</span>, result.<span className="text-blue-300">signature</span>);</div>
            <div>{'}'}</div>
          </code>
        </pre>
      </div>

      <div className="flex justify-center">
        <a
          href="https://docs.signet.network/develop"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center px-3 py-1.5 bg-transparent border border-primary-legacy/30 text-primary-legacy rounded-lg hover:bg-primary-legacy/10 transition-colors text-xs"
        >
          View Documentation
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default DeveloperSection;