import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../sections/HeroSection'
import KeyMetricsSection from '../sections/KeyMetricsSection'
import HowItWorksSection from '../sections/HowItWorksSection'
import FeaturesSection from '../sections/FeaturesSection'
import SignetSignerSection from '../sections/SignetSignerSection'
import SignetDemoSection from '../sections/SignetDemoSection'
import NewSignetDemoSection from '../components/signet-demo/NewSignetDemoSection'
import DevelopersSection from '../sections/DevelopersSection'
import AboutSection from '../sections/AboutSection'
import CtaSection from '../sections/CtaSection'

// Global types are defined in vite-env.d.ts

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
  // Toggle for using the new demo UI
  const [useNewDemo] = useState(true);
  
  // Check for extension on page load
  useEffect(() => {
    // Add a slight delay to make sure extension has time to inject
    setTimeout(() => {
      const hasExtension = typeof window.signetShowInfo === 'function';
      
      // If we have the extension's notification function, show a welcome message
      if (hasExtension && window.signetShowInfo) {
        window.signetShowInfo(
          "Signet Demo Loaded", 
          "Welcome to the Signet Signer demo page"
        );
        
        console.log("Signet extension detected with notification capability");
      } else {
        // Otherwise, try the event based approach
        try {
          window.dispatchEvent(new CustomEvent("signet:show-notification", {
            detail: {
              type: "info",
              title: "Signet Demo Loaded",
              message: "Welcome to the Signet Signer demo page"
            }
          }));
          console.log("Dispatched notification event");
        } catch (err) {
          console.error("Failed to show welcome notification:", err);
        }
      }
    }, 1000);
  }, []);

  return (
    <div className="landing-page">
      <ScrollToAnchor />
      <HeroSection />
      <KeyMetricsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SignetSignerSection />
      {useNewDemo ? <NewSignetDemoSection /> : <SignetDemoSection />}
      <DevelopersSection />
      <AboutSection />
      <CtaSection />
    </div>
  );
}