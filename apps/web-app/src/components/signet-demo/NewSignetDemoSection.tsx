import React, { useState } from 'react';
import { SignatureResult } from '../../utils/signet-api';
import DemoHeader from './DemoHeader';
import DemoCard from './DemoCard';
import ConnectionStep from './ConnectionStep';
import DataEntryStep from './DataEntryStep';
import ResultsDisplay from './ResultsDisplay';
import CodeSamples from './CodeSamples';
import { motion } from 'framer-motion';

/**
 * SignetDemoSection - A modern, interactive demo showcasing Signet signing capabilities
 */
const NewSignetDemoSection: React.FC = () => {
  // Core state
  const [demoStep, setDemoStep] = useState<'connect' | 'data' | 'results'>('connect');
  const [signatureStatus, setSignatureStatus] = useState<'idle' | 'waiting' | 'signing' | 'completed' | 'failed'>('idle');
  const [signatureResult, setSignatureResult] = useState<SignatureResult | undefined>(undefined);
  const [signData, setSignData] = useState<Record<string, unknown> | null>(null);

  // UI-related state
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);

  // Handler for successful connection
  const handleConnectionSuccess = () => {
    setDemoStep('data');
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Handler for data submission
  const handleDataSubmit = async (data: Record<string, unknown>) => {
    setSignData(data);
    setSignatureStatus('signing');
    setDemoStep('results');

    try {
      if (typeof window.SignetAPI === 'undefined') {
        throw new Error('SignetAPI not found. Please connect first.');
      }

      const result = await window.SignetAPI.signStructuredData(data);
      setSignatureResult(result);
      setSignatureStatus('completed');
      setShowSuccessEffect(true);
      setTimeout(() => setShowSuccessEffect(false), 2000);
    } catch (error) {
      console.error('Signing error:', error);
      setSignatureStatus('failed');
    }
  };

  // Handler for restarting the demo
  const handleRestart = () => {
    setDemoStep('connect');
    setSignatureStatus('idle');
    setSignatureResult(undefined);
    setSignData(null);
  };

  return (
    <section id="signet-demo" className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        <DemoHeader currentStep={demoStep} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DemoCard>
            {demoStep === 'connect' && (
              <ConnectionStep onSuccess={handleConnectionSuccess} />
            )}

            {demoStep === 'data' && (
              <DataEntryStep onSubmit={handleDataSubmit} />
            )}

            {demoStep === 'results' && (
              <ResultsDisplay
                status={signatureStatus}
                result={signatureResult}
                data={signData}
                showSuccessEffect={showSuccessEffect}
                onRestart={handleRestart}
              />
            )}
          </DemoCard>
        </motion.div>

        {/* <CodeSamples currentStep={demoStep} /> */}
      </div>
    </section>
  );
};

export default NewSignetDemoSection;