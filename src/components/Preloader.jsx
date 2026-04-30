import React, { useState, useEffect } from 'react';
import TextScramble from './TextScramble';
import './Preloader.css';

export function Preloader() {
  const [complete, setComplete] = useState(false);
  const [unmount, setUnmount] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Step animations
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);

    // Simulate loading progress
    let current = 0;
    const progressInterval = setInterval(() => {
      current += Math.random() * 15 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(progressInterval);
      }
      setProgress(current);
    }, 200);

    // Wait for window load event (all assets ready)
    const handleLoad = () => {
      setProgress(100);
      clearInterval(progressInterval);
      setTimeout(() => setComplete(true), 400);
      setTimeout(() => setUnmount(true), 1200);
    };

    if (document.readyState === 'complete') {
      // Already loaded
      setTimeout(handleLoad, 2200);
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback: force reveal after 4s
      const fallback = setTimeout(handleLoad, 4000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearInterval(progressInterval);
        clearTimeout(fallback);
        window.removeEventListener('load', handleLoad);
      };
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(progressInterval);
    };
  }, []);

  if (unmount) return null;

  return (
    <div className={`preloader ${complete ? 'fade-out' : ''}`}>
      <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
        {step === 0 && (
          <TextScramble as="span" className="preloader-text" duration={0.6} speed={0.03} characterSet="01">
            INITIALIZING ENGINE
          </TextScramble>
        )}
        {step === 1 && (
          <TextScramble as="span" className="preloader-text" duration={0.6} speed={0.03} characterSet="01">
            COMPILING SHADERS
          </TextScramble>
        )}
        {step === 2 && (
          <TextScramble as="span" className="preloader-text" style={{ color: '#ffffff', fontWeight: '600' }} duration={0.8} speed={0.02} characterSet="XQKWZPBRTM">
            VIGNESH SAI
          </TextScramble>
        )}
      </div>
      <div className="preloader-loader">
        <div className="preloader-loader-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </div>
  );
}

export default Preloader;
