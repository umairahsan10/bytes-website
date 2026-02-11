import React, { useEffect, useRef, useState } from 'react';
import TextFlip from '../components/TextFlip';
import { usePageReload } from '../hooks/usePageReload';
import OptimizedImage from '../components/OptimizedImage';

const HeroSection = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const landRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [moonVisible, setMoonVisible] = useState(false);

  // Handle page reloads
  usePageReload((event) => {
    if (event.isPageReload) {
      // Reset states on page reload
      setIsLoaded(false);
      setMoonVisible(false);
      
      // Re-initialize after a short delay
      setTimeout(() => {
        setIsLoaded(true);
        setMoonVisible(true);
      }, 200);
    }
  });

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
      
      // Disable scroll animations on mobile for better performance
      const isMobile = window.innerWidth <= 768;
      if (isMobile) return;
      
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
    // Wrapper ensures additional scroll space so the hero can stay pinned while its animation plays
    <div className="hero-wrapper relative w-full">
      {/* The following inline styles apply only to this component */}
      <style jsx>{`
        /* Wrapper grants extra scroll length (180% of viewport) */
        .hero-wrapper {
          height: 180vh; /* allows about 80vh of scroll while hero is pinned */
        }

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
          /* Make the hero stay fixed while its container scrolls */
          position: sticky;
          top: 0;

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
          z-index: 1;
        }
        
        .background-image img {
          object-fit: cover;
          object-position: center;
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
          will-change: transform, opacity; /* GPU acceleration */
          transform: translate3d(50%, -50%, 0); /* Force GPU rendering */
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
          border-radius: 50%;
          animation: rotate 60s linear infinite;
          will-change: transform; /* GPU acceleration for rotation */
          backface-visibility: hidden; /* Smoother animations */
        }
        
        .moon img {
          border-radius: 50%;
          object-fit: contain;
        }

        .moon-1 {
          /* Styles for moon container */
        }

        .land-image {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          transform: translateY(60%);
          opacity: 0;
          transition: all 0.8s ease-out;
          will-change: transform, opacity; /* GPU acceleration */
        }
        
        .land-image img {
          object-fit: cover;
          object-position: bottom center;
        }

        .land-image.loaded {
          /* Start exactly where the scroll-driven animation begins */
          transform: translateY(0%);
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
          font-size: 4.5rem;
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
          will-change: opacity, transform; /* GPU acceleration */
        }

        .hero-title.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-subtitle {
          font-size: 2rem;
          color: #d3d3d3;
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeInUp 2s ease-out 1s forwards;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(211, 211, 211, 0.3);
          /* Remove bordered background so subtitle sits cleanly on hero */
          border: none;
          background: transparent;
          backdrop-filter: none;
          padding: 0.5rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-subtitle.loaded {
          opacity: 1;
        }

        /* Hide the forced line-break by default */
        .mobile-break {
          display: none;
        }

        @media (max-width: 768px) {
          /* Mobile performance optimizations */
          .hero-wrapper {
            height: 100vh !important; /* Reduce scroll complexity */
          }

          /* Simplified animations for mobile */
          .moon-container {
            width: 500px;
            height: 500px;
            animation: glow 4s ease-in-out infinite !important;
            will-change: auto; /* Reduce GPU usage */
          }

          /* Disable zoom effect on mobile for better performance */
          .moon-container.zooming,
          .moon-container.zooming-out {
            animation: glow 4s ease-in-out infinite !important;
          }

          /* Reduce rotation complexity */
          .moon {
            animation: rotate 120s linear infinite !important; /* Slower rotation */
          }

          .hero-title {
            font-size: 2.8rem; /* smaller heading on tablets/mobile */
            animation-duration: 2s !important;
          }
          
          .future-word {
            display: block; /* push to next line on smaller screens */
          }
          
          .hero-subtitle {
            font-size: 1rem; /* reduce subtitle size */
            text-align: center;
            animation-duration: 1.5s !important;
          }
          
          .hero-content {
            padding: 2rem;
          }

          .mobile-break {
            display: block; /* reveal the break on mobile */
          }

          /* Optimize land image for mobile */
          .land-image {
            will-change: auto;
          }

          /* Reduce glow effects on mobile */
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
            }
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.2rem; /* smaller heading on very small devices */
          }
          
          .hero-subtitle {
            font-size: 0.9rem;
            text-align: center;
          }
          
          .hero-content {
            padding: 1.5rem;
          }
          
          .moon-container {
            width: 350px;
            height: 350px;
          }

          .mobile-break {
            display: block;
          }
        }
      `}</style>

      <div className="hero-section">
        {/* Background Image - Priority loading for hero */}
        <div className="background-image">
          <OptimizedImage 
            src="/assets/hero images/hero-4.png"
            alt="Hero background"
            fill
            priority
            quality={90}
            objectFit="cover"
            sizes="100vw"
          />
        </div>

        {/* Single Moon Container */}
        <div className={`moon-container ${moonVisible ? 'visible' : ''}`}>
          <div 
            ref={moonRef}
            className="moon moon-1"
          >
            <OptimizedImage 
              src="/assets/hero images/hero-2.png"
              alt="Moon"
              fill
              priority
              quality={85}
              objectFit="contain"
            />
          </div>
        </div>

        {/* Land Image */}
        <div 
          ref={landRef}
          className={`land-image ${isLoaded ? 'loaded' : ''}`}
        >
          <OptimizedImage 
            src="/assets/hero images/hero-1.png"
            alt="Landscape"
            fill
            priority
            quality={85}
            objectFit="cover"
            sizes="100vw"
          />
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 ref={textRef} className={`hero-title ${isLoaded ? 'loaded' : ''}`}>
            Full Stack Digital <span className="future-word">Power House</span>
          </h1>
          <div className="hero-subtitle">
            <TextFlip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;