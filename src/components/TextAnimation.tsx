"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * TextAnimation – animates each word of a long paragraph as the user scrolls.
 * Each word fades from 0.2 → 1 based on scroll position.
 */

const phrase =
  "Bytes Platform builds custom websites and digital marketing strategies that drive measurable growth. Our team handles design, development, SEO, SEM and social media with clear communication and transparent reporting. From SSL security to performance optimization, we deliver end-to-end solutions that help you stand out online.";

export default function TextAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Grab all spans inside the container
    const words = gsap.utils.toArray<HTMLSpanElement>(
      containerRef.current.querySelectorAll("span")
    );

    gsap.set(words, { opacity: 0.2 });

    const tl = gsap.to(words, {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", // begin when section is pinned
        end: "+=200%", // finish across the whole pin duration
        scrub: true,
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full min-h-screen px-4 space-y-8"
    >
      <h2 className="text-white text-4xl md:text-6xl font-bold text-center relative -top-20 md:-top-22">About Us</h2>
      <p className="text-center text-white/90 text-2x1 md:text-4xl leading-snug w-[70%] max-w-none relative -top-6 md:-top-8">
        {phrase.split(" ").map((word, idx) => (
          <span key={`${word}-${idx}`} className="inline-block mr-1 opacity-20">
            {word}
          </span>
        ))}
      </p>
    </div>
  );
} 