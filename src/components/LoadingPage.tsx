'use client';

<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingPageProps {
    onLoadingComplete?: () => void;
    loadingDuration?: number;
    minLoadingTime?: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
    onLoadingComplete,
    loadingDuration = 2000,
    minLoadingTime = 1000,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const logoAnimation = gsap.to(".logo-name", {
            opacity: 0.5,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: "power1.inOut"
        });

        const fadeOutLoader = () => {
            logoAnimation.kill();
            gsap.to(".logo-name", {
                opacity: 1,
                duration: 0.5
            });
            gsap.to(".loading-page", {
                opacity: 0,
                duration: 1.5,
                delay: 0.5,
                onComplete: () => {
                    setIsVisible(false);
                    onLoadingComplete?.();
                }
            });
        };

        const handleLoad = () => {
            setTimeout(fadeOutLoader, loadingDuration);
        };

        const minTimer = setTimeout(() => {
            if (document.readyState === 'complete') {
                handleLoad();
            } else {
                window.addEventListener('load', handleLoad);
            }
        }, minLoadingTime);

        const fallbackTimer = setTimeout(() => {
            if (isVisible) {
                fadeOutLoader();
            }
        }, 30000);

        return () => {
            logoAnimation.kill();
            clearTimeout(minTimer);
            clearTimeout(fallbackTimer);
            window.removeEventListener('load', handleLoad);
        };
    }, [onLoadingComplete, loadingDuration, minLoadingTime, isVisible]);

    if (!isVisible || !isMounted) return null;

    return (
        <>
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Michroma&display=swap");
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:opsz,wght@8..144,700&display=swap');

                body {
                    margin: 0;
                    overflow: hidden; /* Prevent scroll during loading */
                }

                .loading-page {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        45deg,
                        #2c5364,
                        #ff00ff,
                        #00ffcc,
                        #ff5733
                    );
                    background-size: 400%;
                    animation: gradientShift 8s ease infinite;
                    z-index: 10001;
                    overflow: hidden;
                    opacity: 0;
                    animation: fadeIn 0.2s forwards;
                }

                @keyframes gradientShift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }

                .loading-page::before,
                .loading-page::after {
                    content: '';
                    position: absolute;
                    width: 20vw;
                    height: 20vw;
                    border-radius: 50%;
                    background: radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.2),
                        rgba(255, 0, 255, 0.3),
                        rgba(0, 255, 204, 0.1)
                    );
                    animation: pulse 4s ease-in-out infinite, erraticFloat 6s ease-in-out infinite;
                }

                .loading-page::before {
                    top: -5vw;
                    left: -5vw;
                    animation-delay: -2s, -1s;
                }

                .loading-page::after {
                    bottom: -5vw;
                    right: -5vw;
                    animation-delay: -3s, -2s;
                }

                .bg-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.15),
                        rgba(255, 165, 0, 0.2),
                        rgba(0, 0, 255, 0.1)
                    );
                    animation: pulse 5s ease-in-out infinite, erraticFloat 7s ease-in-out infinite;
                }

                .bg-circle:nth-child(1) {
                    width: 15vw;
                    height: 15vw;
                    top: 20%;
                    left: 20%;
                    animation-delay: -1s, -3s;
                }

                .bg-circle:nth-child(2) {
                    width: 10vw;
                    height: 10vw;
                    top: 40%;
                    right: 20%;
                    animation-delay: -2s, -4s;
                }

                .bg-circle:nth-child(3) {
                    width: 18vw;
                    height: 18vw;
                    bottom: 20%;
                    left: 30%;
                    animation-delay: -3s, -5s;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                }

                @keyframes erraticFloat {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    20% {
                        transform: translate(5vw, -3vw) rotate(30deg);
                    }
                    40% {
                        transform: translate(-3vw, 4vw) rotate(-20deg);
                    }
                    60% {
                        transform: translate(4vw, 2vw) rotate(40deg);
                    }
                    80% {
                        transform: translate(-2vw, -5vw) rotate(-10deg);
                    }
                    100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                }

                #svg {
                    width: 40vw;
                    height: 40vw;
                    max-width: 200px;
                    max-height: 200px;
                    stroke: #fff;
                    fill-opacity: 0;
                    stroke-width: 4px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    animation: spinAndGlow 6s ease-in-out infinite;
                }

                .letter {
                    stroke-dasharray: 1500;
                    stroke-dashoffset: 1500;
                    opacity: 0;
                    animation: draw 3s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                        colorShift 4s ease-in-out infinite;
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
                    transform-origin: center;
                }

                .letter:nth-child(2) {
                    animation-delay: 1.5s, 2s;
                }

                @keyframes spinAndGlow {
                    0% {
                        transform: rotate(0deg) scale(1);
                        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
                    }
                    50% {
                        transform: rotate(180deg) scale(1.2);
                        filter: drop-shadow(0 0 20px rgba(0, 255, 255, 1));
                    }
                    100% {
                        transform: rotate(360deg) scale(1);
                        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
                    }
                }

                @keyframes colorShift {
                    0% {
                        stroke: #fff;
                    }
                    25% {
                        stroke: #ff00ff;
                    }
                    50% {
                        stroke: #00ffcc;
                    }
                    75% {
                        stroke: #ff5733;
                    }
                    100% {
                        stroke: #fff;
                    }
                }

                @keyframes draw {
                    0% {
                        stroke-dashoffset: 1500;
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }

                .name-container {
                    height: 2rem;
                    overflow: hidden;
                }

                .logo-name {
                    color: #fff;
                    font-size: 1.5rem;
                    letter-spacing: 0.75rem;
                    text-transform: uppercase;
                    margin-left: 1rem;
                    font-weight: bolder;
                    font-family: "Michroma", sans-serif;
                    animation: glitch 2s linear infinite, bounce 1.5s ease-in-out infinite;
                    text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6);
                }

                @keyframes glitch {
                    0% {
                        transform: translate(0);
                        text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6);
                    }
                    2% {
                        transform: translate(-2px, 2px);
                        text-shadow: -2px 2px 10px rgba(255, 0, 255, 1), 2px -2px 20px rgba(0, 255, 255, 1);
                    }
                    4% {
                        transform: translate(2px, -2px);
                        text-shadow: 2px -2px 10px rgba(255, 0, 255, 1), -2px 2px 20px rgba(0, 255, 255, 1);
                    }
                    6% {
                        transform: translate(0);
                        text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6);
                    }
                    100% {
                        transform: translate(0);
                        text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6);
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                /* Mobile devices (up to 768px) */
                @media (max-width: 768px) {
                    .loading-page::before,
                    .loading-page::after {
                        width: 30vw;
                        height: 30vw;
                    }

                    .bg-circle:nth-child(1) {
                        width: 20vw;
                        height: 20vw;
                    }

                    .bg-circle:nth-child(2) {
                        width: 15vw;
                        height: 15vw;
                    }

                    .bg-circle:nth-child(3) {
                        width: 25vw;
                        height: 25vw;
                    }

                    #svg {
                        width: 60vw;
                        height: 60vw;
                        max-width: 150px;
                        max-height: 150px;
                    }

                    .logo-name {
                        font-size: 1rem;
                        letter-spacing: 0.5rem;
                        margin-left: 0.5rem;
                    }

                    .name-container {
                        height: 1.5rem;
                    }
                }

                /* Small mobile devices (up to 480px) */
                @media (max-width: 480px) {
                    #svg {
                        width: 80vw;
                        height: 80vw;
                        max-width: 120px;
                        max-height: 120px;
                    }

                    .logo-name {
                        font-size: 0.8rem;
                        letter-spacing: 0.4rem;
                    }

                    .name-container {
                        height: 1.2rem;
                    }
                }

                /* Portrait orientation */
                @media (orientation: portrait) {
                    #svg {
                        width: 50vw;
                        height: 50vw;
                        max-width: 180px;
                        max-height: 180px;
                    }
                }

                /* High-resolution devices */
                @media (min-resolution: 2dppx) {
                    #svg {
                        stroke-width: 5px; /* Thicker stroke for clarity */
                    }

                    .logo-name {
                        text-shadow: 0 0 12px rgba(255, 0, 255, 0.9), 0 0 24px rgba(0, 255, 255, 0.7);
                    }
                }

                /* Hide main content until loading is complete */
                .main-content {
                    display: none;
                }
            `}</style>
            <head>
                <link
                    rel="preload"
                    href="https://fonts.googleapis.com/css2?family=Michroma&display=swap"
                    as="style"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href=" queues://fonts.googleapis.com/css2?family=Roboto+Serif:opsz,wght@8..144,700&display=swap"
                    as="style"
                    crossOrigin="anonymous"
                />
            </head>
            <div className="loading-page">
                <div className="bg-circle"></div>
                <div className="bg-circle"></div>
                <div className="bg-circle"></div>
                <svg
                    id="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 500 400"
                >
                    <path
                        className="letter"
                        d="M100,60 L100,340 L180,340 Q280,340 280,270 Q280,215 220,200 
                        Q280,185 280,150 Q280,60 180,60 L100,60 Z
                        M135,95 L180,95 Q240,95 240,150 Q240,185 180,185 L135,185 Z
                        M135,215 L180,215 Q240,215 240,270 Q240,305 180,305 L135,305 Z"
                        fillRule="evenodd"
                    />
                    <path
                        className="letter"
                        d="M300,60 L300,340 L335,340 L335,200 L390,200 Q440,200 440,130 Q440,60 390,60 L300,60 Z
                        M335,95 L385,95 Q405,95 405,130 Q405,165 385,165 L335,165 Z"
                        fillRule="evenodd"
                    />
                </svg>
                <div className="name-container">
                    <div className="logo-name">Bytes</div>
                </div>
            </div>
        </>
    );
=======
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
>>>>>>> Stashed changes
};

export default LoadingPage;