import React from 'react';
import { motion } from 'framer-motion';

interface DemoCardProps {
  children: React.ReactNode;
}

const DemoCard: React.FC<DemoCardProps> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto mb-24">
      <motion.div
        className="relative bg-gradient-to-b from-gray-800/60 to-gray-900/80 backdrop-blur-xl border border-gray-700/60 rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow: '0 0 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px 0px rgba(74, 47, 189, 0.15)'
        }}
      >

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/40 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-primary-legacy/20 flex items-center justify-center border border-primary-legacy/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-legacy" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Signet Demo Experience</h3>
              <div className="flex items-center mt-1.5 space-x-3">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                  <span className="text-xs text-green-400">Secure</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
                  <span className="text-xs text-blue-400">Fast</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-purple-500 mr-1.5"></span>
                  <span className="text-xs text-purple-400">Private</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-mono flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="min-h-[500px]">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default DemoCard;