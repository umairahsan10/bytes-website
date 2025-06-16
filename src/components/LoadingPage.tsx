'use client';

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
        // Set mounted to true after component mounts
        setIsMounted(true);

        // Initialize loading animation for logo-name
        const logoAnimation = gsap.to(".logo-name", {
            opacity: 0.5,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: "power1.inOut"
        });

        const fadeOutLoader = () => {
            // Stop the logo name animation
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

        // Wait for everything to load
        const handleLoad = () => {
            setTimeout(fadeOutLoader, loadingDuration);
        };

        // Ensure minimum loading time
        const minTimer = setTimeout(() => {
            if (document.readyState === 'complete') {
                handleLoad();
            } else {
                window.addEventListener('load', handleLoad);
            }
        }, minLoadingTime);

        // Fallback: If load event doesn't fire after 30 seconds
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
            <style jsx>{`
                @import url("https://fonts.googleapis.com/css2?family=Michroma&display=swap");
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:opsz,wght@8..144,700&display=swap');

                /* Ensure the loading page is hidden until styles are applied */
                .loading-page {
                    position: fixed;
                    top: 0;
                    left: 0;
                    background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: center;
                    justify-content: center;
                    color: #191654;
                    z-index: 9999;
                    overflow: hidden;
                    opacity: 0; /* Start hidden */
                    animation: fadeIn 0.2s forwards; /* Quick fade-in once mounted */
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
                    height: 200px;
                    width: 200px;
                    stroke: white;
                    fill-opacity: 0;
                    stroke-width: 3.5px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    margin-bottom: -20px;
                }

                .letter {
                    stroke-dasharray: 1500;
                    stroke-dashoffset: 1500;
                    opacity: 0;
                    animation: draw 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards, glow 3s ease-in-out infinite;
                    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
                    transform-origin: center;
                }

                .letter:nth-child(2) {
                    animation-delay: 2s, 5.5s;
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
                    height: 30px;
                    overflow: hidden;
                }

                .logo-name {
                    color: #fff;
                    font-size: 20px;
                    letter-spacing: 12px;
                    text-transform: uppercase;
                    margin-left: 20px;
                    font-weight: bolder;
                    transition: opacity 0.3s ease;
                    font-family: "Michroma", sans-serif;
                    opacity: 0; /* Start hidden */
                    animation: textFadeIn 0.2s forwards; /* Quick fade-in */
                }

                @keyframes textFadeIn {
                    to {
                        opacity: 1;
                    }
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
                    href="https://fonts.googleapis.com/css2?family=Roboto+Serif:opsz,wght@8..144,700&display=swap"
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
                    style={{ width: '200px', height: '200px', overflow: 'hidden' }}
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
};

export default LoadingPage;