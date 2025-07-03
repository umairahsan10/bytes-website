'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlowerBytesAnimation from '@/components/FlowerBytesAnimation';
import TextAnimation from "@/components/TextAnimation";

export const LineAnimationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Create the main timeline for the 5-section scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=500vh', // Reduced to 4 viewport heights for early unpinning
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Pass scroll progress to child components
          const progress = self.progress;
          
          // Dispatch custom event with progress data
          const event = new CustomEvent('scrollProgress', {
            detail: { progress }
          });
          window.dispatchEvent(event);
        },
        onLeave: () => {
          // When leaving the pinned section, let it move up naturally with scroll
          // No animation needed - let the timeline handle the transition
        },
        onEnterBack: () => {
          // When re-entering, smoothly transition back in
          gsap.to(containerRef.current, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        },
        onLeaveBack: () => {
          // When scrolling back up and leaving, reset to initial state
          gsap.set(containerRef.current, { 
            y: 0
          });
          gsap.set(textContainerRef.current, { 
            opacity: 0 
          });
        }
      }
    });

    // Store reference to ScrollTrigger for cleanup
    scrollTriggerRef.current = tl.scrollTrigger;

    // Section 1 (0-20%): Fade in background and start 3D animation
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out'
    }, 0);

    // Section 2 (20-40%): Continue 3D animation progression
    tl.to({}, {
      duration: 0.2,
      ease: 'none',
      onUpdate: function() {
        // This section is handled by the 3D animation component
      }
    }, 0.2);

    // Section 3 (40-60%): Start text animation reveal
    tl.to(textContainerRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out'
    }, 0.4);

    // Section 4 (60-80%): Continue text animation and enhance 3D effects
    tl.to({}, {
      duration: 0.2,
      ease: 'none',
      onUpdate: function() {
        // This section is handled by the text animation component
      }
    }, 0.6);

    // Section 5 (80-100%): Complete all animations and prepare for transition out
    tl.to({}, {
      duration: 0.2,
      ease: 'none',
      onUpdate: function() {
        // Final polish animations handled by child components
      }
    }, 0.8);

    // Smooth transition out - move section up naturally with scroll
    tl.to(containerRef.current, {
      y: -200,
      duration: 0.15,
      ease: 'power2.inOut'
    }, 0.9);

    return () => {
      // Clean up ScrollTrigger properly
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      
      // Clear any remaining GSAP properties
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { clearProps: "all" });
      }
      if (containerRef.current) {
        gsap.set(containerRef.current, { clearProps: "all" });
      }
      if (textContainerRef.current) {
        gsap.set(textContainerRef.current, { clearProps: "all" });
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative w-full bg-[#010a14] min-h-[100vh] overflow-hidden"
    >
      {/* Main container that gets animated */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen opacity-0"
      >
        {/* Background line animation */}
        <FlowerBytesAnimation />

        {/* Text overlay */}
        <div 
          ref={textContainerRef}
          className="absolute inset-0 flex items-center justify-center z-10 opacity-0"
        >
          <TextAnimation />
        </div>
      </div>
    </section>
  );
}; 