import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import HALO from "vanta/dist/vanta.halo.min";

const ByteBotsSection = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const redefiningRef = useRef<HTMLHeadingElement>(null);
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !headingRef.current ||
        !subheadingRef.current ||
        !targetRef.current ||
        !containerRef.current ||
        !firstSectionRef.current ||
        !redefiningRef.current
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
        const currentScale = 1 - 0.4 * progress; // Scale from 1 to 0.6

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
          headingRef.current.style.transform = "scale(0.6)";
          headingRef.current.style.zIndex = "10";
        }
      } else if (scrollY <= triggerPoint || !isInComponentArea) {
        // Reset to original state when outside animation area
        headingRef.current.style.position = "";
        headingRef.current.style.left = "";
        headingRef.current.style.top = "";
        headingRef.current.style.transform = "";
        headingRef.current.style.transformOrigin = "";
        headingRef.current.style.zIndex = "";
        headingRef.current.style.pointerEvents = "";
        subheadingRef.current.style.opacity = "";
        subheadingRef.current.style.transform = "";
        subheadingRef.current.style.transition = "";
        redefiningRef.current.style.opacity = "0";
        redefiningRef.current.style.transform = "translateX(-120px)";
        redefiningRef.current.style.transition = "";
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

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          baseColor: 0x0,
          backgroundColor: 0xffffff,
          amplitudeFactor: 1.5,
          size: 1.0,
        })
      );
    }
    return () => {
      if (vantaEffect && typeof vantaEffect.destroy === "function")
        vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        vantaRef.current = node;
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
          <h1
            ref={headingRef}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Byte{" "}
            </span>
            <span className="text-black"> Bot</span>
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
            The Future of Conversation
          </p>
        </div>
      </div>

      {/* Transition Space */}
      <div className="h-8"></div>

      {/* Second Section */}
      <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-8 relative">
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
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h3>

              <button className="text-orange-500 font-semibold hover:text-orange-600 transition-colors mb-6 sm:mb-8 text-sm sm:text-base">
                GET IN TOUCH →
              </button>
            </div>

            {/* Right side */}
            <div className="space-y-8 sm:space-y-12">
              {/* AI transformation */}
              <div>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-black">
                  AI transformation
                </h4>
                <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  We maximize the power and promise of AI to drive
                  transformative business outcomes through our comprehensive AI
                  consulting services and solutions.
                </p>
                <button className="text-orange-500 font-semibold hover:text-orange-600 transition-colors text-sm sm:text-base">
                  LEARN MORE →
                </button>
              </div>

              {/* Data & Analytics */}
              <div>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-black">
                  Data & Analytics
                </h4>
                <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  We enable enterprises to transform data into a business
                  advantage by tapping into the capabilities of ML, advanced
                  analytics, generative AI, and connected intelligence.
                </p>
                <button className="text-orange-500 font-semibold hover:text-orange-600 transition-colors text-sm sm:text-base">
                  LEARN MORE →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByteBotsSection;
