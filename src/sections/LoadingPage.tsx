'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingPage.css';

interface LoadingPageProps {
  onLoadComplete: () => void;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadComplete }) => {
  // Marks whether the loading sequence has already completed (to avoid duplicate completion in React Strict Mode)
  const completedRef = useRef(false);
  // Percentage progress state (0 - 100)
  const [progress, setProgress] = useState(0);

  // We intentionally set up our timers *every* time the component mounts.
  // In React 18 Strict Mode (development), the component mounts, unmounts, and mounts again.
  // By guarding the completion logic with `completedRef`, we guarantee that we only run `onLoadComplete` once
  // while still allowing each mount to set up its own timers.
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // ---------- Progress updater ----------
    // We update the progress roughly once every ~25 ms so that the counter appears smooth.
    // While the loader is active we increment from 0 → 99, reserving the final jump to 100
    // for when the loading sequence actually completes.
    let internalProgress = 0;
    const PROGRESS_INTERVAL = 25; // ms

    const progressTimer = setInterval(() => {
      // Only advance while we are still loading (not yet marked complete)
      if (!completedRef.current && internalProgress < 99) {
        internalProgress += 1;
        setProgress(internalProgress);
      }
    }, PROGRESS_INTERVAL);

    gsap.set(".loading-page", {
      opacity: 1,
      display: "flex"
    });

    const MINIMUM_DISPLAY_TIME = 2500; // 2.5 seconds minimum display time
    const FADE_OUT_DURATION = 800; // 0.8 seconds fade out

    const completeLoading = () => {
      if (completedRef.current) return; // Ensure we only finish once

      // Stop the incremental timer and show full bar
      clearInterval(progressTimer);
      setProgress(100);

      // Briefly keep the fully-filled bar visible before fading out
      const VISUAL_COMPLETE_DELAY = 150; // ms

      // Defer the fade-out animation slightly so the user can see completion
      setTimeout(() => {
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
      }, VISUAL_COMPLETE_DELAY);

      // Mark as completed (after we have already cleared the timer & scheduled fade)
      completedRef.current = true;
    };

    const startTime = Date.now();

    // Helper to ensure the loader stays for at least MINIMUM_DISPLAY_TIME
    const finishAfterMinimum = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);
      setTimeout(completeLoading, remaining);
    };

    // If the page has already fully loaded (e.g., on route change) we just respect the minimum time.
    if (document.readyState === 'complete') {
      finishAfterMinimum();
    } else {
      // Wait for the window load event which fires when all resources (images, fonts...) are done loading.
      window.addEventListener('load', finishAfterMinimum, { once: true });
    }

    // Fallback: ensure we never wait longer than 12 s in total.
    const fallbackTimeout = setTimeout(completeLoading, 12000);

    return () => {
      clearTimeout(fallbackTimeout);
      clearInterval(progressTimer);
      window.removeEventListener('load', finishAfterMinimum);
      document.body.style.overflow = 'auto';
    };
  }, [onLoadComplete]);

  const BAR_WIDTH = 220;
  const BAR_HEIGHT = 35;
  const barX = (800 - BAR_WIDTH) / 2; // Center horizontally within viewBox
  const barY = 320; // Roughly 80% of the 400-unit height

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

        {/* Progress bar */}
        <g className="progress-bar-group">
          {/* Outline */}
          <rect
            className="progress-bar-bg"
            x={barX}
            y={barY}
            width={BAR_WIDTH}
            height={BAR_HEIGHT}
            rx={BAR_HEIGHT / 2}
            ry={BAR_HEIGHT / 2}
          />
          {/* Fill */}
          <rect
            className="progress-bar-fill"
            x={barX}
            y={barY}
            width={(progress / 100) * BAR_WIDTH}
            height={BAR_HEIGHT}
            rx={BAR_HEIGHT / 2}
            ry={BAR_HEIGHT / 2}
          />
        </g>
      </svg>
    </div>
  );
};

export default LoadingPage; 