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
  // Whether we have revealed the progress bar yet (after the SVG animation finishes)
  const [showProgress, setShowProgress] = useState(false);

  // We intentionally set up our timers *every* time the component mounts.
  // In React 18 Strict Mode (development), the component mounts, unmounts, and mounts again.
  // By guarding the completion logic with `completedRef`, we guarantee that we only run `onLoadComplete` once
  // while still allowing each mount to set up its own timers.
  useEffect(() => {
    const SVG_ANIMATION_DURATION = 3000; // 3 s to match new logo animation duration
    document.body.style.overflow = 'hidden';

    // We will declare timer refs so they can be cleared in cleanup
    let progressTimer: ReturnType<typeof setInterval> | undefined;
    let fallbackTimeout: ReturnType<typeof setTimeout> | undefined;
    let svgDelayTimeout: ReturnType<typeof setTimeout> | undefined;

    // ---------- Function that kicks off the progress bar stage ----------
    const startProgressStage = () => {
      setShowProgress(true);

      // ---------- Progress updater ----------
      let internalProgress = 0;
      const PROGRESS_INTERVAL = 25; // ms

      progressTimer = setInterval(() => {
        if (!completedRef.current && internalProgress < 99) {
          internalProgress += 1;
          setProgress(internalProgress);
        }
      }, PROGRESS_INTERVAL);

      const MINIMUM_DISPLAY_TIME = 2500; // 2.5 seconds minimum *after* progress stage starts
      const FADE_OUT_DURATION = 800; // 0.8 seconds fade out

      const completeLoading = () => {
        if (completedRef.current) return;

        if (progressTimer) clearInterval(progressTimer);
        setProgress(100);

        const VISUAL_COMPLETE_DELAY = 150; // ms so users see full bar

        setTimeout(() => {
          gsap.to('.loading-page', {
            opacity: 0,
            duration: FADE_OUT_DURATION / 1000,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set('.loading-page', { display: 'none' });
              document.body.style.overflow = 'auto';
              onLoadComplete();
            },
          });
        }, VISUAL_COMPLETE_DELAY);

        completedRef.current = true;
      };

      const startTime = Date.now();

      const finishAfterMinimum = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);
        setTimeout(completeLoading, remaining);
      };

      if (document.readyState === 'complete') {
        finishAfterMinimum();
      } else {
        window.addEventListener('load', finishAfterMinimum, { once: true });
      }

      // Fallback in case onload never fires
      fallbackTimeout = setTimeout(completeLoading, 12000);
    };

    // ---------- Initial setup: ensure overlay visible and schedule progress stage ----------
    gsap.set('.loading-page', { opacity: 1, display: 'flex' });

    // Wait for the SVG stroke animation to finish before starting the progress bar
    svgDelayTimeout = setTimeout(startProgressStage, SVG_ANIMATION_DURATION);

    // ---------- Cleanup ----------
    return () => {
      if (progressTimer) clearInterval(progressTimer);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      if (svgDelayTimeout) clearTimeout(svgDelayTimeout);
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
        {showProgress && (
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
        )}
      </svg>
    </div>
  );
};

export default LoadingPage; 