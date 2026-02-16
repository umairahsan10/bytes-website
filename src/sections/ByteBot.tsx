'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePageReload } from '../hooks/usePageReload';

// Cycle animated text for the keyword (Intelligence ⇢ Innovation ⇢ Growth)
const CycleText = ({ className = "" }: { className?: string }) => {
  const words = ["Intelligence", "Innovation", "Growth"];
  const [index, setIndex] = useState(0);

  const total = words.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 3000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={`word_${index}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`inline-block ${className}`}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
};

const ByteBotsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introducingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const nextGenRef = useRef<HTMLDivElement>(null);
  const redefiningRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Debounced resize handler for better performance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to only animate when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Skip animation if reduced motion or not visible
    if (prefersReducedMotion || !isVisible) return;

    // For mobile we no longer skip the animation – instead we make sure the elements
    // start from the same initial state as desktop.  No early return here so the
    // scroll listener is always attached.
    if (isMobile) {
      if (secondSectionRef.current) {
        secondSectionRef.current.style.opacity = '0';
        secondSectionRef.current.style.transform = 'scale(0.8)';
      }
      if (headingRef.current) {
        headingRef.current.style.position = '';
        headingRef.current.style.left = '';
        headingRef.current.style.top = '';
        headingRef.current.style.transform = '';
      }
    }

    const handleScroll = () => {
      if (!containerRef.current || !stickyContainerRef.current) return;

      // BATCH ALL DOM READS FIRST (prevents layout thrashing)
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;
      
      // Pre-read all element rectangles before any writes
      const nextGenRect = nextGenRef.current?.getBoundingClientRect();
      const headingRect = headingRef.current?.getBoundingClientRect();
      const stickyRect = stickyContainerRef.current.getBoundingClientRect();

      // Calculate scroll progress through the container
      const scrollStart = 0; // When container top hits viewport top
      const scrollEnd = -containerHeight + windowHeight; // When container bottom hits viewport bottom
      
      // Determine if we're in the animation zone
      const isInAnimationZone = containerTop <= scrollStart && containerTop >= scrollEnd;
      
      if (isInAnimationZone) {
        // Calculate progress (0 to 1)
        const progress = Math.max(0, Math.min(1, (scrollStart - containerTop) / (scrollStart - scrollEnd)));
        
        // Calculate all animation values BEFORE any DOM writes
        const introducingPhase = Math.min(1, progress / 0.2);
        const subheadingPhase = Math.max(0, Math.min(1, (progress - 0.2) / 0.2));
        const secondSectionPhase = Math.max(0, Math.min(1, (progress - 0.4) / 0.6));
        const headingProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.7));
        
        // Calculate positions
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = windowHeight / 2;
        const mobileOffset = isMobile ? 40 : 0;
        const textAlignmentOffset = 110;
        const targetX = nextGenRect ? nextGenRect.left + textAlignmentOffset - mobileOffset : viewportCenterX;
        const targetY = nextGenRect && headingRect ? nextGenRect.top - headingRect.height / 2 - 8 : viewportCenterY;
        const currentX = viewportCenterX + (targetX - viewportCenterX) * headingProgress;
        const currentY = viewportCenterY + (targetY - viewportCenterY) * headingProgress;
        const currentScale = 1 - 0.5 * headingProgress;
        
        // NOW DO ALL DOM WRITES (batched for performance)
        stickyContainerRef.current.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;`;

        // Animate elements based on progress
        if (headingRef.current && introducingRef.current && subheadingRef.current && 
            secondSectionRef.current && redefiningRef.current && aboutRef.current) {
          
          // Apply all styles with GPU acceleration hints
          introducingRef.current.style.cssText = `
            opacity: ${1 - introducingPhase};
            transform: translate3d(0, ${-60 - introducingPhase * 60}px, 0);
            will-change: opacity, transform;
          `;
          
          subheadingRef.current.style.cssText = `
            opacity: ${1 - subheadingPhase};
            transform: translate3d(0, ${subheadingPhase * 40}px, 0);
            will-change: opacity, transform;
          `;
          
          secondSectionRef.current.style.cssText = `
            opacity: ${secondSectionPhase};
            transform: scale(${0.8 + secondSectionPhase * 0.2}) translateZ(0);
            will-change: opacity, transform;
          `;
          
          redefiningRef.current.style.cssText = `
            opacity: ${secondSectionPhase};
            transform: translate3d(0, ${(1 - secondSectionPhase) * 60}px, 0);
            will-change: opacity, transform;
          `;

          aboutRef.current.style.cssText = `
            opacity: ${secondSectionPhase};
            transform: translate3d(0, ${(1 - secondSectionPhase) * 60}px, 0);
            will-change: opacity, transform;
          `;
          
          headingRef.current.style.cssText = `
            position: fixed;
            left: ${currentX}px;
            top: ${currentY}px;
            transform: translate(-50%, -50%) scale(${currentScale}) translateZ(0);
            transform-origin: center center;
            z-index: 1001;
            transition: none;
            will-change: transform;
          `;
          
          // Change heading color as it moves to blue background
          const headingSpan = headingRef.current.querySelector('span');
          if (headingSpan) {
            if (headingProgress > 0.5) {
              headingSpan.classList.remove('text-[#01084E]');
              headingSpan.classList.add('text-white');
            } else {
              headingSpan.classList.add('text-[#01084E]');
              headingSpan.classList.remove('text-white');
            }
          }

          // Final landing position
        if (progress >= 1) {
            headingRef.current.style.position = 'absolute';
            headingRef.current.style.left = `${targetX}px`;
            headingRef.current.style.top = `${targetY}px`;
            headingRef.current.style.transform = 'translate(-50%, -50%) scale(0.5)';
            headingRef.current.style.transformOrigin = 'center center';
            headingRef.current.style.zIndex = '10';
          }
        }
      } else {
        // Reset sticky positioning
        stickyContainerRef.current.style.position = '';
        stickyContainerRef.current.style.top = '';
        stickyContainerRef.current.style.left = '';
        stickyContainerRef.current.style.width = '';
        stickyContainerRef.current.style.height = '';
        stickyContainerRef.current.style.zIndex = '';
        
        // Reset all element styles
        if (headingRef.current && introducingRef.current && subheadingRef.current && 
            secondSectionRef.current && redefiningRef.current && aboutRef.current) {
          
          if (containerTop > scrollStart) {
            // Before animation - reset to initial state
            headingRef.current.style.position = '';
            headingRef.current.style.left = '';
            headingRef.current.style.top = '';
            headingRef.current.style.transform = '';
            headingRef.current.style.transformOrigin = '';
            headingRef.current.style.zIndex = '';
            headingRef.current.style.transition = '';
            
            introducingRef.current.style.opacity = '';
            introducingRef.current.style.transform = '';
            
            subheadingRef.current.style.opacity = '';
            subheadingRef.current.style.transform = '';
            
            secondSectionRef.current.style.opacity = '0';
            secondSectionRef.current.style.transform = 'scale(0.8)';
            
            redefiningRef.current.style.opacity = '0';
            redefiningRef.current.style.transform = 'translateY(60px)';
            
            aboutRef.current.style.opacity = '0';
            aboutRef.current.style.transform = 'translateY(60px)';
            
            // Reset heading color to dark blue
            const headingSpan = headingRef.current.querySelector('span');
            if (headingSpan) {
              headingSpan.classList.add('text-[#01084E]');
              headingSpan.classList.remove('text-white');
            }
                     } else {
             // After animation - keep final state
             secondSectionRef.current.style.opacity = '1';
             secondSectionRef.current.style.transform = 'scale(1)';
             secondSectionRef.current.style.position = 'relative';
             secondSectionRef.current.style.minHeight = '100vh';
             
             redefiningRef.current.style.opacity = '1';
             redefiningRef.current.style.transform = 'translateY(0)';
             
             aboutRef.current.style.opacity = '1';
             aboutRef.current.style.transform = 'translateY(0)';
             
             introducingRef.current.style.opacity = '0';
             subheadingRef.current.style.opacity = '0';
             
             // Keep heading in final position relative to the second section
             if (headingRef.current && nextGenRect && headingRect) {
               const mobileOffsetFinal = isMobile ? 80 : 0;
               const textAlignmentOffsetFinal = 40;
               headingRef.current.style.position = 'absolute';
               headingRef.current.style.left = `${nextGenRect.left - stickyRect.left + textAlignmentOffsetFinal - mobileOffsetFinal}px`;
               headingRef.current.style.top = `${nextGenRect.top - stickyRect.top - headingRect.height / 2 - 8}px`;
               headingRef.current.style.transform = 'translate(-50%, -50%) scale(0.5)';
               headingRef.current.style.transformOrigin = 'center center';
               headingRef.current.style.zIndex = '10';
               
               // Keep heading white on blue background
               const headingSpan = headingRef.current.querySelector('span');
               if (headingSpan) {
                 headingSpan.classList.remove('text-[#01084E]');
                 headingSpan.classList.add('text-white');
               }
             }
           }
        }
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMobile, isVisible, prefersReducedMotion]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          .byte-bots-section * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        .bg-desktop-bot {
          background-image: url('/assets/bytes-bot/bot_bg.webp') !important;
        }
        .final-bg-desktop {
          background-image: url('/assets/bytes-bot/bot_bg.webp') !important;
        }
      `}} />
      <div
        ref={containerRef}
        className="relative byte-bots-section"
        style={{ 
          height: "200vh",
          background: "linear-gradient(to bottom, #f9fafb 0%, #f9fafb 50%, #01084E 50%, #01084E 100%)"
        }}
      >
      {/* Sticky container that will stick during animation */}
      <div
        ref={stickyContainerRef}
        className="relative w-full h-screen"
      >
        {/* First Section - Hero (always visible initially) */}
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 bg-gray-50">
        <div className="text-center">
          <h2
            ref={introducingRef}
            className="text-base sm:text-3xl font-medium text-gray-500 tracking-widest uppercase mb-2"
          >
            Introducing
          </h2>
          <h2
            ref={headingRef}
            className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 whitespace-nowrap"
          >
            <span className="text-[#01084E]">
              Byte Bots
            </span>
          </h2>
          <p
            ref={subheadingRef}
            className="text-gray-600 text-base sm:text-4xl max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
          >
          </p>
          </div>
        </div>
        
        {/* Second Section - Overlayed and initially hidden */}
        <div 
          ref={secondSectionRef}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex flex-col sm:flex-row items-center justify-center"
          style={{
            backgroundImage: `url('/assets/bytes-bot/botm_bg.webp')`,
            opacity: 0,
            transform: "scale(0.8)",
            minHeight: "100vh",
            minWidth: "100vw"
          }}
        >
          {/* Desktop background overlay */}
          <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-desktop-bot pointer-events-none" style={{ zIndex: 0 }}></div>
          
          <div className="w-full h-full flex relative z-10">
            {/* Left side - 50% width for content */}
            <div className="w-full sm:w-1/2 flex items-center justify-start pl-8 sm:pl-16 mt-14">
              <div className="max-w-xl sm:mt-0 -mt-32">
                {/* Next-Gen Chatbots block */}
                <div ref={nextGenRef} className="mb-8 leading-tight">
                  <span className="text-white font-bold text-3xl sm:text-2xl">Next-Gen </span>
                  <span className="font-bold text-3xl sm:text-2xl text-[#00ece2]">Chatbots</span>
                  <div className="text-white text-lg sm:text-base font-semibold leading-tight">Human-like minds</div>
                </div>

                {/* Redefining impact heading */}
                <h3
                  ref={redefiningRef}
                  className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 leading-tight"
                  style={{ 
                    opacity: 0, 
                    transform: "translateY(60px)"
                  }}
                >
                  <span className="text-white">THE FUTURE OF</span><br/>
                  <span className="text-[#00ece2]">COMMUNICATION</span><br/>
                  <span className="text-white">IS NOW</span><br/>
                  <span className="text-[#00ece2]">POWERED BY </span>
                  <span className="text-white font-bold">AI</span><br/>
                </h3>

                <Link
                  href="/products/byte-bots"
                  className="cursor-pointer text-white font-semibold px-6 py-3 rounded-full bg-[#00ece2] hover:bg-[#00ece2]/80 mt-6 inline-block" 
                >
                  EXPLORE MORE
                </Link>
              </div>
            </div>

            {/* Right side - 50% width, empty space */}
              <div 
                ref={aboutRef} 
                className="hidden sm:flex w-1/2 items-center justify-center"
                style={{
                  opacity: 0, 
                transform: 'translateY(60px)'
              }}
            >
              {/* Empty space or future content */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Final section - visible after animation */}
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
           style={{
             backgroundImage: `url('/assets/bytes-bot/botm_bg.webp')`
           }}>
        {/* Desktop background overlay */}
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat final-bg-desktop pointer-events-none"></div>
        
        <div className="w-full h-full flex flex-col sm:flex-row relative z-10">
          {/* Left side - 50% width for content - EXACT SAME LAYOUT AS ANIMATION */}
          <div className="w-full sm:w-1/2 flex items-center justify-start pl-8 sm:pl-16">
            <div className="max-w-xl sm:mt-0 -mt-32">
              {/* Byte Bots heading positioned over Next-Gen */}
              <div className="relative mb-8">
                <h2 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white mb-2 whitespace-nowrap">
                  Byte Bots
                </h2>
                <div className="leading-tight">
                  <span className="text-white font-bold text-3xl sm:text-2xl">Next-Gen </span>
                  <span className="font-bold text-3xl sm:text-2xl text-[#00ece2]">Chatbots</span>
                  <div className="text-white text-lg sm:text-base font-semibold leading-tight">Human-like minds</div>
                </div>
              </div>

              {/* Redefining impact heading */}
              <h3 className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 leading-tight">
                <span className="text-white">THE FUTURE OF</span><br/>
                <span className="text-[#00ece2]">COMMUNICATION</span><br/>
                <span className="text-white">IS NOW</span><br/>
                <span className="text-[#00ece2]">POWERED BY </span>
                <span className="text-white font-bold">AI</span><br/>
              </h3>

              <Link
                href="/products/byte-bots"
                className="cursor-pointer text-white font-semibold px-6 py-3 rounded-full bg-[#00ece2] hover:bg-[#00ece2]/80 mt-6 inline-block" 
              >
                EXPLORE MORE
              </Link>
            </div>
          </div>

          {/* Right side - 50% width, empty space - MATCHING ANIMATION LAYOUT */}
          <div className="hidden sm:flex w-1/2 items-center justify-center">
            {/* Empty space to match animation layout */}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ByteBotsSection;