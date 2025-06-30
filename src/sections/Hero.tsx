import React, { useEffect, useRef, useState } from 'react';

const HeroSection = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const landRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [moonVisible, setMoonVisible] = useState(false);

  useEffect(() => {
    // Initial animation sequence - both land and moon start at same time
    setTimeout(() => {
      setIsLoaded(true);
      setMoonVisible(true); // Moon appears at same time as land
    }, 100);

    // Scroll listener for synchronized zoom and land movement
    const handleScroll = () => {
      // Only trigger scroll animations after hero is fully loaded and moon is visible
      if (!isLoaded || !moonVisible) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const maxScroll = windowHeight * 0.8;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Synchronized moon zoom and land movement
      const moonContainer = document.querySelector('.moon-container') as HTMLElement;
      const landElement = landRef.current;
      
      if (moonContainer && landElement) {
        // Keep glow effect and limit zoom
        moonContainer.style.setProperty('animation', 'glow 3s ease-in-out infinite', 'important');
        
        // Moon zooms smoothly based on scroll progress (limited zoom)
        const scale = 1 + (scrollProgress * 1.5); // Scale from 1 to 2.5 (limited zoom)
        
        // Apply smooth zoom based on scroll position with !important - keep centered
        moonContainer.style.setProperty('transform', `translate(50%, -50%) scale(${scale})`, 'important');
        moonContainer.style.setProperty('opacity', '1', 'important');
        
        // Land goes down more on scroll
        const landTranslateY = scrollProgress * 40; // Increased from 15% to 40% down (more movement)
        
        landElement.style.transform = `translateY(${landTranslateY}%)`;
        landElement.style.transition = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded, moonVisible]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <style jsx>{`
        @keyframes slideUpFromBottom {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes moonZoom {
          0% {
            transform: translate(50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(75%, -50%) scale(4);
            opacity: 1;
          }
        }

        @keyframes moonZoomOut {
          0% {
            transform: translate(75%, -50%) scale(4);
            opacity: 1;
          }
          100% {
            transform: translate(50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.4));
          }
        }

        @keyframes moonRise {
          0% {
            opacity: 0;
            transform: translate(50%, 100%);
          }
          100% {
            opacity: 1;
            transform: translate(50%, -50%);
          }
        }

        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/assets/hero images/hero-4.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          z-index: 1;
        }

        .moon-container {
          position: absolute;
          right: 50%;
          top: 50%;
          transform: translate(50%, -50%);
          width: 800px;
          height: 800px;
          z-index: 3;
          animation: glow 3s ease-in-out infinite;
          opacity: 0;
        }

        .moon-container.visible {
          animation: moonRise 2s ease-out forwards, glow 3s ease-in-out infinite;
        }

        .moon-container.zooming {
          animation: moonZoom 0.8s ease-out forwards, glow 3s ease-in-out infinite;
          opacity: 1;
        }

        .moon-container.zooming-out {
          animation: moonZoomOut 0.8s ease-out forwards, glow 3s ease-in-out infinite;
          opacity: 1;
        }

        .moon {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 50%;
          animation: rotate 60s linear infinite;
        }

        .moon-1 {
          background-image: url('/assets/hero images/hero-2.png');
        }

        .land-image {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/assets/hero images/hero-1.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: bottom center;
          z-index: 4;
          transform: translateY(60%);
          opacity: 0;
          transition: all 0.8s ease-out;
        }

        .land-image.loaded {
          transform: translateY(20%);
          opacity: 1;
        }

        .hero-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-title {
          font-size: 6rem;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
          animation: textGlow 4s ease-in-out infinite;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1.5s ease-out;
          text-align: center;
        }

        .hero-title.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #d3d3d3;
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeInUp 2s ease-out 1s forwards;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(211, 211, 211, 0.3);
          border: 1px solid rgba(211, 211, 211, 0.2);
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          background: rgba(211, 211, 211, 0.05);
          backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-content {
            padding: 2rem;
          }
          
          .moon-container {
            width: 500px;
            height: 500px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-content {
            padding: 1.5rem;
          }
          
          .moon-container {
            width: 350px;
            height: 350px;
          }
        }
      `}</style>

      <div className="hero-section">
        {/* Background Image */}
        <div className="background-image"></div>

        {/* Single Moon Container */}
        <div className={`moon-container ${moonVisible ? 'visible' : ''}`}>
          <div 
            ref={moonRef}
            className="moon moon-1"
          ></div>
      </div>

        {/* Land Image */}
        <div 
          ref={landRef}
          className={`land-image ${isLoaded ? 'loaded' : ''}`}
        ></div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 ref={textRef} className={`hero-title ${isLoaded ? 'loaded' : ''}`}>
            Welcome to the Future
          </h1>
          <p className="hero-subtitle">
            Where innovation meets imagination
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;