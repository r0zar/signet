import React from 'react';
import { motion } from 'framer-motion';

interface DemoHeaderProps {
  currentStep: 'connect' | 'data' | 'results';
}

const DemoHeader: React.FC<DemoHeaderProps> = ({ currentStep }) => {
  // Step data for progress indicator
  const steps = [
    { id: 'connect', label: 'Connect Extension', number: 1 },
    { id: 'data', label: 'Prepare Data', number: 2 },
    { id: 'results', label: 'View Signature', number: 3 }
  ];
  
  return (
    <div className="text-center max-w-4xl mx-auto mb-20">
      {/* Demo badge */}
      <motion.div 
        className="inline-flex items-center px-5 py-2.5 mb-8 text-xs font-semibold tracking-wider text-primary-legacy uppercase bg-primary-legacy/15 border border-primary-legacy/30 rounded-full shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: '0 4px 12px -2px rgba(74, 47, 189, 0.2)'
        }}
      >
        <span className="h-2 w-2 rounded-full bg-primary-legacy mr-2.5"></span>
        Interactive Demo
      </motion.div>
      
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Signet Signer Experience
      </h2>
      
      {/* Description */}
      <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-14">
        See how easy it is to sign structured data with Signet. Follow the steps below to experience secure, wallet-less web3 interactions.
      </p>
      
      {/* Step indicator */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center max-w-2xl w-full">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step circle */}
              <div className="relative flex-shrink-0">
                <motion.div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    currentStep === step.id 
                      ? 'bg-primary-legacy text-white shadow-lg' 
                      : currentStep === steps[index+1]?.id || currentStep === steps[index+2]?.id
                        ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                        : 'bg-gray-800/70 text-gray-400 border border-gray-700/50'
                  }`}
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: currentStep === step.id ? 1.1 : 1,
                    backgroundColor: currentStep === step.id ? 'var(--primary-legacy)' : undefined
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: currentStep === step.id ? '0 4px 12px -2px rgba(74, 47, 189, 0.4)' : undefined
                  }}
                >
                  {currentStep === steps[index+1]?.id || currentStep === steps[index+2]?.id ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="font-semibold text-lg">{step.number}</span>
                  )}
                </motion.div>
                
                {/* Pulsing effect for active step */}
                {currentStep === step.id && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-primary-legacy/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.7, 0], scale: 1.5 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              
              {/* Step label */}
              <div className={`text-sm font-medium mx-3 ${
                currentStep === step.id 
                  ? 'text-primary-legacy' 
                  : currentStep === steps[index+1]?.id || currentStep === steps[index+2]?.id 
                    ? 'text-green-500'
                    : 'text-gray-500'
              }`}>
                {step.label}
              </div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 bg-gray-800/60 rounded-full">
                  <motion.div 
                    className="h-full bg-primary-legacy rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: currentStep === steps[index+1]?.id || currentStep === steps[index+2]?.id ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoHeader;