'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingPageProps {
  onLoadingComplete: () => void;
  loadingDuration?: number;
  minLoadingTime?: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  onLoadingComplete, 
  loadingDuration = 7000, 
  minLoadingTime = 2000 
}) => {
  const loadingPageRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    // Set initial state
    gsap.set(loadingPageRef.current, {
      opacity: 1,
      display: "flex"
    });

    // Initialize loading animation for the letter
    if (letterRef.current) {
      gsap.to(letterRef.current, {
        opacity: 0.8,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "power1.inOut"
      });
    }

    // Function to fade out loading page
    const fadeOutLoader = () => {
      gsap.to(loadingPageRef.current, {
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        onComplete: () => {
          onLoadingComplete();
        }
      });
      
      // Stop the letter animation
      if (letterRef.current) {
        gsap.to(letterRef.current, {
          opacity: 1,
          duration: 0.5
        });
      }
    };

    // Wait for everything to load
    const handleLoad = () => {
      setTimeout(fadeOutLoader, loadingDuration);
    };

    // Add a small buffer time to ensure smooth transition
    const loadTimer = setTimeout(handleLoad, minLoadingTime);

    // Fallback: If load event doesn't fire after 30 seconds
    const fallbackTimer = setTimeout(() => {
      if (loadingPageRef.current && loadingPageRef.current.style.display !== 'none') {
        fadeOutLoader();
      }
    }, 30000);

    // Cleanup
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(fallbackTimer);
      gsap.killTweensOf(loadingPageRef.current);
      gsap.killTweensOf(letterRef.current);
    };
  }, [onLoadingComplete, loadingDuration, minLoadingTime]);

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Michroma&display=swap");
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:opsz,wght@8..144,700&display=swap');

        .loading-page {
          position: fixed;
          top: 0;
          left: 0;
          background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          color: #191654;
          z-index: 9999;
          overflow: hidden;
        }

        .loading-page::before,
        .loading-page::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          animation: float 15s infinite linear;
        }

        .loading-page::before {
          top: -100px;
          left: -100px;
          animation-delay: -5s;
        }

        .loading-page::after {
          bottom: -100px;
          right: -100px;
          animation-delay: -2.5s;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.025);
          animation: float 20s infinite ease-in-out;
        }

        .bg-circle:nth-child(1) {
          width: 200px;
          height: 200px;
          top: 20%;
          left: 20%;
          animation-delay: -1s;
        }

        .bg-circle:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 40%;
          right: 20%;
          animation-delay: -3s;
        }

        .bg-circle:nth-child(3) {
          width: 250px;
          height: 250px;
          bottom: 20%;
          left: 30%;
          animation-delay: -5s;
        }

        @keyframes float {
          0% {
            transform: rotate(0deg) translate(50px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(50px) rotate(-360deg);
          }
        }

        #svg {
          height: 300px;
          width: 800px;
          stroke: white;
          fill-opacity: 0;
          stroke-width: 3.5px;
          stroke-linecap: round;
          stroke-linejoin: round;
          margin: 0 auto;
          display: block;
          animation: zoomOut 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: center;
          max-width: 100%;
        }

        .letter {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          animation: 
            draw 5s cubic-bezier(0.4, 0, 0.2, 1) forwards,
            glow 3s ease-in-out infinite 5s;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
          transform-origin: center;
          fill: white;
          stroke: white;
          stroke-width: 1;
          font-size: 90px;
          font-family: Arial, sans-serif;
          font-weight: 700;
        }

        @keyframes zoomOut {
          0% {
            transform: scale(2);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw {
          0% {
            stroke-dashoffset: 1500;
            fill-opacity: 0;
          }
          60% {
            fill-opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            fill-opacity: 1;
          }
        }

        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1));
            transform: scale(1.02);
          }
          100% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
            transform: scale(1);
          }
        }

        /* Responsive Styles */
        @media screen and (max-width: 768px) {
          #svg {
            height: 250px;
            width: 95vw;
          }

          .letter {
            font-size: 60px;
          }
        }

        @media screen and (max-width: 480px) {
          #svg {
            height: 200px;
          }

          .letter {
            font-size: 45px;
          }

          @keyframes zoomOut {
            0% {
              transform: scale(2.5);
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            100% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
        }
      `}</style>

      <div ref={loadingPageRef} className="loading-page">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
          <text 
            ref={letterRef}
            className="letter" 
            x="400" 
            y="200" 
            textAnchor="middle" 
            dominantBaseline="middle"
          >
            Bytes Platform
          </text>
        </svg>
      </div>
    </>
  );
};

export default LoadingPage;