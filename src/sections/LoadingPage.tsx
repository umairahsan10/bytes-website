'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LoadingPage.css';

interface LoadingPageProps {
  onLoadComplete: () => void;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadComplete }) => {
  const completedRef = useRef(false);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    gsap.timeline()
      .to(".loading-page", {
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        duration: 0.1,
        ease: "none"
      });

    // Glow animation for logo
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0.2, filter: 'brightness(0.4) drop-shadow(0 0 0px #00A3FF)' },
        { opacity: 1, filter: 'brightness(1) drop-shadow(0 0 20px #00A3FF)', duration: 1.2, ease: 'power2.out' }
      );
    }

    // Auto-dismiss after 3 seconds
    const timeout = setTimeout(() => handleFinish(), 3000);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;

    gsap.to(".loading-page", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onLoadComplete();
        document.body.style.overflow = 'auto';
      }
    });
  };

  return (
    <div className="loading-page">
      <img
        ref={logoRef}
        src="/assets/bytes-logo.png"
        alt="Bytes Logo"
        className="loading-logo"
        onClick={handleFinish}
      />
    </div>
  );
};

export default LoadingPage; 