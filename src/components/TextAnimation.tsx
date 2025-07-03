"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";

/**
 * TextAnimation – animates each word of a long paragraph based on scroll progress.
 * Each word fades from 0.2 → 1 based on scroll position from parent component.
 */

const phrase =
  "Bytes Platform builds custom websites and digital marketing strategies that drive measurable growth. Our team handles design, development, SEO, SEM and social media with clear communication and transparent reporting. From SSL security to performance optimization, we deliver end-to-end solutions that help you stand out online.";

export default function TextAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const scrollProgressRef = useRef(0);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Initialize words with low opacity
    gsap.set(wordsRef.current, { opacity: 0.2 });
  }, []);

  // Listen for scroll progress events from parent component
  useEffect(() => {
    const handleScrollProgress = (event: CustomEvent) => {
      const progress = event.detail.progress;
      
      // Only update if progress is valid
      if (typeof progress === 'number' && progress >= 0 && progress <= 1) {
        scrollProgressRef.current = progress;
        
        // Text animation starts at 40% scroll progress (section 3)
        const textStartProgress = 0.4;
        const textEndProgress = 1.0;
        
        if (progress >= textStartProgress) {
          const textProgress = (progress - textStartProgress) / (textEndProgress - textStartProgress);
          animateText(textProgress);
        } else {
          // Keep text hidden before section 3
          gsap.set(wordsRef.current, { opacity: 0.2 });
        }
      }
    };

    window.addEventListener('scrollProgress', handleScrollProgress as EventListener);
    
    return () => {
      window.removeEventListener('scrollProgress', handleScrollProgress as EventListener);
    };
  }, []);

  const animateText = (progress: number) => {
    const totalWords = wordsRef.current.length;
    
    // Calculate how many words should be revealed based on progress
    const wordsToReveal = Math.floor(progress * totalWords);
    
    wordsRef.current.forEach((word, index) => {
      if (index < wordsToReveal) {
        // Reveal word with stagger effect
        const wordProgress = Math.min(1, (progress * totalWords - index) * 2);
        gsap.to(word, {
          opacity: 0.2 + (wordProgress * 0.8),
          duration: 0.1,
          ease: "power2.out"
        });
      } else {
        // Keep word hidden or fade out when scrolling back
        gsap.to(word, {
          opacity: 0.2,
          duration: 0.1
        });
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full min-h-screen px-4 space-y-8"
    >
      <h2 className="text-white text-4xl md:text-6xl font-bold text-center">About Us</h2>
      <p className="text-center text-white/90 text-xl md:text-3xl leading-snug w-[70%] max-w-none">
        {phrase.split(" ").map((word, idx) => (
          <span 
            key={`${word}-${idx}`} 
            className="inline-block mr-1 opacity-20"
            ref={(el) => {
              if (el) wordsRef.current[idx] = el;
            }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
} 