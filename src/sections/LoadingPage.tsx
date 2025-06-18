'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LoadingPage.css';

interface LoadingPageProps {
  onLoadComplete: () => void;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadComplete }) => {
  // Marks whether the loading sequence has already completed (to avoid duplicate completion in React Strict Mode)
  const completedRef = useRef(false);

  // We intentionally set up our timers *every* time the component mounts.
  // In React 18 Strict Mode (development), the component mounts, unmounts, and mounts again.
  // By guarding the completion logic with `completedRef`, we guarantee that we only run `onLoadComplete` once
  // while still allowing each mount to set up its own timers.
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    gsap.set(".loading-page", {
      opacity: 1,
      display: "flex"
    });

    const MINIMUM_DISPLAY_TIME = 2500; // 2 seconds minimum display time
    const FADE_OUT_DURATION = 800; // 0.8 seconds fade out

    const completeLoading = () => {
      if (completedRef.current) return; // Ensure we only finish once
      completedRef.current = true;
      gsap.to(".loading-page", {
        opacity: 0,
        duration: FADE_OUT_DURATION / 1000,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(".loading-page", { display: "none" });
          document.body.style.overflow = 'auto';
          onLoadComplete();
        }
      });
    };

    // Single timeout for the main animation
    const loadTimeout = setTimeout(completeLoading, MINIMUM_DISPLAY_TIME);

    // Fallback timeout
    const fallbackTimeout = setTimeout(completeLoading, MINIMUM_DISPLAY_TIME + FADE_OUT_DURATION + 2000);

    return () => {
      clearTimeout(loadTimeout);
      clearTimeout(fallbackTimeout);
      document.body.style.overflow = 'auto';
    };
  }, [onLoadComplete]);

  return (
    <div className="loading-page">
      <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
        <text 
          className="letter bytes" 
          x="50%" 
          y="45%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontFamily="Montserrat, sans-serif" 
          fontWeight="700"
        >
          BYTES.
        </text>
        <text 
          className="letter platform" 
          x="50%" 
          y="65%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontFamily="Montserrat, sans-serif" 
          fontWeight="700"
        >
          PLATFORM
        </text>
      </svg>
    </div>
  );
};

export default LoadingPage; 