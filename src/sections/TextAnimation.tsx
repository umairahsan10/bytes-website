'use client'

import React, { useRef, useEffect, JSX } from 'react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { gsap } from 'gsap/dist/gsap';
import styled from '@emotion/styled';

const phrase = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.";

const LoadingContainer = styled.div`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  font-family: "Montserrat", sans-serif;
  height: 100vh;
  max-width: 100%;
  overflow-x: hidden;

  .container {
    background-color: #0a1647;
    color: #fff;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .loading-page {
    position: absolute;
    top: 0;
    left: 0;
    background: #0a1647;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    color: #191654;
    z-index: 9999;
    overflow: hidden;
  }

  #svg {
    height: 300px;
    width: 90vw;
    max-width: 800px;
    stroke: white;
    fill-opacity: 0;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
    margin: 0 auto;
    display: block;
    animation: zoomOut 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    transform-origin: center;
  }

  .letter {
    stroke-dasharray: 1500;
    stroke-dashoffset: 1500;
    animation: 
      draw 5s cubic-bezier(0.4, 0, 0.2, 1) forwards,
      glow 3s ease-in-out infinite 5s;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
    transform-origin: center;
    stroke-width: 1;
  }

  .bytes {
    fill: white;
    stroke: white;
    font-size: 140px;
    letter-spacing: 2px;
  }

  .platform {
    fill: #FFD700;
    stroke: #FFD700;
    font-size: 35px;
    letter-spacing: 8px;
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

  .text-animation {
    font-family: 'Roboto Serif', serif;
    font-size: 120px;
    font-weight: 700;
    color: white;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    animation: textReveal 2s ease-in-out;
    letter-spacing: 10px;
  }

  @keyframes textReveal {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
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
  }

  @media screen and (max-width: 768px) {
    #svg {
      height: 200px;
      width: 90vw;
    }

    .bytes {
      font-size: 90px;
    }

    .platform {
      font-size: 25px;
    }
  }

  @media screen and (max-width: 480px) {
    #svg {
      height: 150px;
      width: 90vw;
    }

    .bytes {
      font-size: 70px;
    }

    .platform {
      font-size: 20px;
    }

    @keyframes zoomOut {
      0% {
        transform: scale(4);
        opacity: 0;
      }
      30% {
        opacity: 1;
      }
      100% {
        transform: scale(3);
        opacity: 1;
      }
    }
  }
`;

function TextAnimation() {
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(wordRefs.current, { opacity: 0.2 });
      createAnimation();
    }
  }, []);

  const createAnimation = () => {
    gsap.to(wordRefs.current, {
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
        start: 'top',
        end: `+=${window.innerHeight / 1.5}`,
      },
      opacity: 1,
      ease: "none",
      stagger: 0.2
    });
  };

  const splitWords = (phrase: string) => {
    const words = phrase.split(" ");
    return (
      <p className="text-line" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {words.map((word, i) => (
          <span 
            key={word + "_" + i} 
            className="word"
            ref={el => { if (el) wordRefs.current.push(el) }}
            style={{ opacity: 0.2, fontFamily: "'Poppins', sans-serif" }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    );
  };

  return (
    <main ref={container} className="text-main">
      <div ref={body} className="text-body">
        {splitWords(phrase)}
      </div>
    </main>
  );
}

export const LoadingPage = () => {
  useEffect(() => {
    // Prevent scrollbars while the loader is showing
    document.body.style.overflow = 'hidden';

    // Set initial state
    gsap.set(".loading-page", {
      opacity: 1,
      display: "flex"
    });

    // Initialize loading animation
    gsap.to(".logo-name", {
      opacity: 0.5,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "power1.inOut"
    });

    // Function to fade out loading page
    const fadeOutLoader = () => {
      gsap.to(".loading-page", {
        opacity: 0,
        display: "none",
        duration: 1.5,
        delay: 0.5
      });
      
      // Stop the logo name animation
      gsap.to(".logo-name", {
        opacity: 1,
        duration: 0.5
      });

      // Re-enable scrolling once the loader is fully gone (after the fade)
      gsap.delayedCall(1.6, () => {
        document.body.style.overflow = 'auto';
      });
    };

    // Wait for everything to load
    const loadTimeout = setTimeout(fadeOutLoader, 7000);

    // Fallback: If load event doesn't fire after 30 seconds
    const fallbackTimeout = setTimeout(() => {
      if (document.querySelector('.loading-page')?.style.display !== 'none') {
        fadeOutLoader();
      }
    }, 30000);

    // Cleanup function
    return () => {
      clearTimeout(loadTimeout);
      clearTimeout(fallbackTimeout);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <LoadingContainer>
      <div className="container">
        {/* <p>Welcome Views!</p> */}
      </div>

      <div className="loading-page">
        <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
          <text 
            className="letter bytes" 
            x="400" 
            y="180" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontFamily="Montserrat, sans-serif" 
            fontWeight="700"
          >
            BYTES.
          </text>
          <text 
            className="letter platform" 
            x="480" 
            y="260" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontFamily="Montserrat, sans-serif" 
            fontWeight="700"
          >
            PLATFORM
          </text>
        </svg>
      </div>
    </LoadingContainer>
  );
};

export default TextAnimation;