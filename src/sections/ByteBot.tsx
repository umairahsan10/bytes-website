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

  useEffect(() => {
    const handleScroll = () => {
      if (
        !headingRef.current ||
        !introducingRef.current ||
        !subheadingRef.current ||
        !targetRef.current ||
        !containerRef.current ||
        !firstSectionRef.current ||
        !redefiningRef.current ||
        !aboutRef.current
      )
        return;

      const scrollY = window.scrollY;

      // Get the container's position relative to the document
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + scrollY;

      // Get first section dimensions
      const firstSectionRect = firstSectionRef.current.getBoundingClientRect();
      const firstSectionHeight = firstSectionRect.height;
      const firstSectionTop = containerTop;

      // Calculate trigger points relative to this component
      const triggerPoint = firstSectionTop + firstSectionHeight * 0.1; // Start when 30% through first section
      const animationDistance = firstSectionHeight * 0.8; // Animation duration

      // Only animate if we're scrolling within this component's area
      const componentBottom = containerTop + containerRef.current.offsetHeight;
      const isInComponentArea =
        scrollY >= firstSectionTop && scrollY <= componentBottom;

      if (scrollY > triggerPoint && isInComponentArea) {
        const progress = Math.min(
          1,
          (scrollY - triggerPoint) / animationDistance
        );
        // Two-phase animation
        const subheadingPhase = Math.min(1, progress / 0); // 0 to 1 in first 10%
        const redefiningPhase = Math.max(0, (progress - 0.3) / 0.7); // 0 to 1 from 30% to 100%
        // Introducing: fade out quickly at the very beginning of the animation
        const introducingPhase = Math.min(1, progress / 0.2); // complete within first 20%
        introducingRef.current.style.opacity = `${1 - introducingPhase}`;
        introducingRef.current.style.transform = `translateY(${introducingPhase * 30}px)`;
        introducingRef.current.style.transition = "opacity 0.4s, transform 0.4s";
        // Subheading: fade out and slide down in first 30%
        subheadingRef.current.style.opacity = `${1 - subheadingPhase}`;
        subheadingRef.current.style.transform = `translateY(${
          subheadingPhase * 40
        }px)`;
        subheadingRef.current.style.transition = "opacity 0.4s, transform 0.4s";
        // Redefining: fade in and slide from further left, only after subheading is gone
        redefiningRef.current.style.opacity = `${redefiningPhase}`;
        redefiningRef.current.style.transform = `translateX(${
          (1 - redefiningPhase) * -120
        }px)`;
        redefiningRef.current.style.transition = "opacity 0.4s, transform 0.4s";

        // About section slides in with same phase
        aboutRef.current.style.opacity = `${redefiningPhase}`;
        aboutRef.current.style.transform = `translateX(${
          (1 - redefiningPhase) * -120
        }px)`;
        aboutRef.current.style.transition = "opacity 0.4s, transform 0.4s";

        // Get target position relative to the document
        const targetRect = targetRef.current.getBoundingClientRect();
        const targetX = targetRect.left;
        const targetY = targetRect.top + scrollY;

        // Get original heading position (centered in first section)
        const originalRect = headingRef.current.getBoundingClientRect();
        const originalX = (window.innerWidth - originalRect.width) / 2;
        const originalY =
          firstSectionTop + (firstSectionHeight - originalRect.height) / 2;

        // Calculate current position
        const currentX = originalX + (targetX - originalX) * progress;
        const currentY = originalY + (targetY - originalY) * progress;
        const currentScale = 1 - 0.5 * progress;

        // Apply fixed positioning during animation
        headingRef.current.style.position = "fixed";
        headingRef.current.style.left = `${currentX}px`;
        headingRef.current.style.top = `${currentY - scrollY}px`;
        headingRef.current.style.transform = `scale(${currentScale})`;
        headingRef.current.style.transformOrigin = "left top";
        headingRef.current.style.zIndex = "1000";
        headingRef.current.style.pointerEvents = "none";

        // When animation is complete, switch to absolute positioning within container
        if (progress >= 1) {
          const landingOffset = 16;
          headingRef.current.style.position = "absolute";
          headingRef.current.style.top = `${
            targetY - containerTop + landingOffset
          }px`;
          headingRef.current.style.left = `${targetX}px`;
          headingRef.current.style.transform = "scale(0.5)";
          headingRef.current.style.zIndex = "10";
        }
      } else if (scrollY <= triggerPoint || !isInComponentArea) {
        headingRef.current.style.position = "";
        headingRef.current.style.left = "";
        headingRef.current.style.top = "";
        headingRef.current.style.transform = "";
        headingRef.current.style.transformOrigin = "";
        headingRef.current.style.zIndex = "";
        headingRef.current.style.pointerEvents = "";
        introducingRef.current.style.opacity = "";
        introducingRef.current.style.transform = "";
        introducingRef.current.style.transition = "";
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

    // Use throttled scroll for better performance
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

    window.addEventListener("scroll", scrollListener);
    window.addEventListener("resize", scrollListener); // Handle window resize

    // Initial call after a short delay to ensure all elements are positioned
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("resize", scrollListener);
    };
  }, []);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
      }}
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
                style={{ opacity: 0, transform: "translateX(-120px)" }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight transition-all duration-400"
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
            <div ref={aboutRef} className="space-y-6 sm:space-y-8" style={{opacity:0, transform:'translateX(-120px)'}}>
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
