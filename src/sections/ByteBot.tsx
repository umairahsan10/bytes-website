'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introducingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const redefiningRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Cache initial positions to avoid recalculating
  const [isReady, setIsReady] = useState(false);
  const initialPositionsRef = useRef<{
    originalX: number;
    originalY: number;
    targetX: number;
    targetY: number;
    containerTop: number;
    firstSectionHeight: number;
    firstSectionTop: number;
  } | null>(null);

  const calculateInitialPositions = () => {
    if (
      !headingRef.current ||
      !targetRef.current ||
      !containerRef.current ||
      !firstSectionRef.current
    ) return null;

    // Reset any existing transforms to get accurate measurements
    headingRef.current.style.position = "";
    headingRef.current.style.left = "";
    headingRef.current.style.top = "";
    headingRef.current.style.transform = "";
    headingRef.current.style.transformOrigin = "";
    headingRef.current.style.zIndex = "";
    headingRef.current.style.pointerEvents = "";
    headingRef.current.style.willChange = "";

    const scrollY = window.scrollY;
    
    // Get container position
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerTop = containerRect.top + scrollY;
    
    // Get first section dimensions
    const firstSectionRect = firstSectionRef.current.getBoundingClientRect();
    const firstSectionHeight = firstSectionRect.height;
    const firstSectionTop = containerTop;
    
    // Get target position
    const targetRect = targetRef.current.getBoundingClientRect();
    const targetX = targetRect.left;
    const targetY = targetRect.top + scrollY;
    
    // Get original heading position (centered in first section)
    const originalRect = headingRef.current.getBoundingClientRect();
    const originalX = (window.innerWidth - originalRect.width) / 2;
    const originalY = firstSectionTop + (firstSectionHeight - originalRect.height) / 2;
    
    return {
      originalX,
      originalY,
      targetX,
      targetY,
      containerTop,
      firstSectionHeight,
      firstSectionTop
    };
  };

  useEffect(() => {
    const updateInitialPositions = () => {
      const positions = calculateInitialPositions();
      if (positions) {
        initialPositionsRef.current = positions;
        setIsReady(true);
      }
    };

    // Multiple attempts to ensure we get stable measurements
    const timer1 = setTimeout(updateInitialPositions, 100);
    const timer2 = setTimeout(updateInitialPositions, 200);
    const timer3 = setTimeout(updateInitialPositions, 300);
    
    // Recalculate on window resize
    const handleResize = () => {
      setIsReady(false);
      setTimeout(updateInitialPositions, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !initialPositionsRef.current) return;

    const handleScroll = () => {
      if (
        !headingRef.current ||
        !introducingRef.current ||
        !subheadingRef.current ||
        !redefiningRef.current ||
        !aboutRef.current ||
        !initialPositionsRef.current
      ) return;

      const scrollY = window.scrollY;
      const {
        originalX,
        originalY,
        targetX,
        targetY,
        containerTop,
        firstSectionHeight,
        firstSectionTop
      } = initialPositionsRef.current;

      // Calculate trigger points
      const triggerPoint = firstSectionTop + firstSectionHeight * 0.1;
      const animationDistance = firstSectionHeight * 0.8;

      // Check if we're in the component area
      const componentBottom = containerTop + containerRef.current!.offsetHeight;
      const isInComponentArea = scrollY >= firstSectionTop && scrollY <= componentBottom;

      // Handle "Introducing" fade out before animation starts
      const preAnimationDistance = firstSectionHeight * 0.05; // 5% of section height before trigger
      const introducingTrigger = triggerPoint - preAnimationDistance;
      
      if (scrollY > introducingTrigger && scrollY <= triggerPoint) {
        // Fade out "Introducing" just before main animation starts
        const introducingProgress = (scrollY - introducingTrigger) / preAnimationDistance;
        introducingRef.current.style.opacity = `${1 - introducingProgress}`;
        introducingRef.current.style.transform = `translateY(${introducingProgress * 30}px)`;
        introducingRef.current.style.transition = "none";
      } else if (scrollY <= introducingTrigger) {
        // Reset introducing text when scrolling back up
        introducingRef.current.style.opacity = "";
        introducingRef.current.style.transform = "";
        introducingRef.current.style.transition = "";
      }

      // Only start main animation if we're past the trigger point AND in component area
      if (scrollY > triggerPoint && isInComponentArea) {
        const progress = Math.min(1, (scrollY - triggerPoint) / animationDistance);
        
        // Improved phase calculations with smoother transitions
        const subheadingPhase = Math.min(1, progress / 0.25); // Complete within first 25%
        const redefiningPhase = Math.max(0, (progress - 0.3) / 0.7); // Start at 30%, complete at 100%

        // Ensure introducing text stays hidden during main animation
        introducingRef.current.style.opacity = "0";
        introducingRef.current.style.transform = "translateY(30px)";
        introducingRef.current.style.transition = "none";

        // Animate subheading
        subheadingRef.current.style.opacity = `${1 - subheadingPhase}`;
        subheadingRef.current.style.transform = `translateY(${subheadingPhase * 40}px)`;
        subheadingRef.current.style.transition = "none"; // Remove transitions during animation

        // Animate redefining section
        redefiningRef.current.style.opacity = `${redefiningPhase}`;
        redefiningRef.current.style.transform = `translateX(${(1 - redefiningPhase) * -120}px)`;
        redefiningRef.current.style.transition = "none"; // Remove transitions during animation

        // Animate about section
        aboutRef.current.style.opacity = `${redefiningPhase}`;
        aboutRef.current.style.transform = `translateX(${(1 - redefiningPhase) * -120}px)`;
        aboutRef.current.style.transition = "none"; // Remove transitions during animation

        // Calculate heading position with stable interpolation
        const currentX = originalX + (targetX - originalX) * progress;
        const currentY = originalY + (targetY - originalY) * progress;
        const currentScale = 1 - 0.5 * progress;

        // Apply positioning with improved stability
        headingRef.current.style.position = "fixed";
        headingRef.current.style.left = `${Math.round(currentX)}px`;
        headingRef.current.style.top = `${Math.round(currentY - scrollY)}px`;
        headingRef.current.style.transform = `scale(${currentScale})`;
        headingRef.current.style.transformOrigin = "left top";
        headingRef.current.style.zIndex = "1000";
        headingRef.current.style.pointerEvents = "none";
        headingRef.current.style.willChange = "transform, left, top";

        // Finalize position when animation completes
        if (progress >= 1) {
          const landingOffset = 16;
          headingRef.current.style.position = "absolute";
          headingRef.current.style.top = `${Math.round(targetY - containerTop + landingOffset)}px`;
          headingRef.current.style.left = `${Math.round(targetX)}px`;
          headingRef.current.style.transform = "scale(0.5)";
          headingRef.current.style.zIndex = "10";
          headingRef.current.style.willChange = "auto";
        }
      } else if (scrollY <= triggerPoint) {
        // Reset all styles when before animation starts
        headingRef.current.style.position = "";
        headingRef.current.style.left = "";
        headingRef.current.style.top = "";
        headingRef.current.style.transform = "";
        headingRef.current.style.transformOrigin = "";
        headingRef.current.style.zIndex = "";
        headingRef.current.style.pointerEvents = "";
        headingRef.current.style.willChange = "";
        
        // Don't reset introducing text here - it's handled above
        
        subheadingRef.current.style.opacity = "";
        subheadingRef.current.style.transform = "";
        subheadingRef.current.style.transition = "";
        
        redefiningRef.current.style.opacity = "0";
        redefiningRef.current.style.transform = "translateX(-120px)";
        redefiningRef.current.style.transition = "";
        
        aboutRef.current.style.opacity = "0";
        aboutRef.current.style.transform = "translateX(-120px)";
        aboutRef.current.style.transition = "";
      }
    };

    // Optimized scroll handler with requestAnimationFrame
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    
    // Initial call only after positions are ready
    setTimeout(handleScroll, 50);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [isReady]);

  return (
    <div
      ref={containerRef}
      className="bg-gray-50 relative"
      style={{ isolation: "isolate" }}
    >
      {/* First Section - Hero */}
      <div
        ref={firstSectionRef}
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 relative"
      >
        <div className="text-center">
          <h2
            ref={introducingRef}
            className="text-base sm:text-3xl font-medium text-gray-500 tracking-widest uppercase mb-2"
            style={{
              opacity: 1,
              transform: "translateY(0px)",
              willChange: "opacity, transform",
            }}
          >
            Introducing
          </h2>
          <h1
            ref={headingRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6"
            style={{ willChange: "transform, left, top" }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Byte Bots
            </span>
          </h1>
          <p
            ref={subheadingRef}
            className="text-gray-600 text-base sm:text-4xl max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
            style={{
              opacity: 1,
              transform: "translateY(0px)",
              willChange: "opacity, transform",
            }}
          >
          </p>
        </div>
      </div>

      {/* Transition Space */}
      <div className="h-8"></div>

      {/* Second Section */}
      <div className="py-12 sm:py-20 px-4 sm:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Left side */}
            <div className="relative">
              {/* Target position for animated heading */}
              <div ref={targetRef} className="mb-6 sm:mb-8">
                {/* Invisible placeholder to reserve space */}
                <div className="opacity-0 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Our Services
                </div>
              </div>

              {/* Redefining impact heading with fade/slide in */}
              <h3
                ref={redefiningRef}
                style={{ 
                  opacity: 0, 
                  transform: "translateX(-120px)",
                  willChange: "opacity, transform"
                }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight"
              >
                <span className="text-black">Powered </span>
                <span className="text-black">by </span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Real{" "}
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                  Business{" "}
                </span>
                <CycleText className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" />
              </h3>

              <Link
                href="/products/byte-bots"
                className="cursor-pointer text-white font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 transform transition-transform duration-300 hover:scale-110 mb-6 sm:mb-8 text-sm sm:text-base inline-block"
              >
                EXPLORE MORE
              </Link>
            </div>

            {/* Right side */}
            <div 
              ref={aboutRef} 
              className="space-y-6 sm:space-y-8" 
              style={{
                opacity: 0, 
                transform: 'translateX(-120px)',
                willChange: "opacity, transform"
              }}
            >
              <div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  About Byte Bot
                </h4>
                <ul className="list-disc pl-5 text-gray-600 leading-relaxed text-sm sm:text-base space-y-2">
                  <li>
                    <span className="font-semibold">Seamless Integration:</span> Byte Bot connects effortlessly with tools like Salesforce, HubSpot, Slack, and WhatsApp, fitting into your existing workflows.
                  </li>
                  <li>
                    <span className="font-semibold">Conversion Powerhouse:</span> Drives outcomes with automated lead qualification, dynamic CTAs, and follow-ups via email or WhatsApp.
                  </li>
                  <li>
                    <span className="font-semibold">Data-Driven Insights:</span> Offers real-time dashboards, predictive sales forecasts, and SKU/region performance analytics.
                  </li>
                  <li>
                    <span className="font-semibold">Continuous Learning:</span> Adapts tone and vocabulary to your audience, enhancing engagement with contextual memory.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByteBotsSection;