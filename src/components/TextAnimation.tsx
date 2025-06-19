'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * TextAnimation – animates each word of a long paragraph as the user scrolls.
 * The opacity of every word transitions from 0.2 → 1 based on scroll position.
 * This component is self-contained and does not rely on any global CSS. It
 * uses Tailwind utility classes for layout & typography so it can live as an
 * isolated section inside the bytes-website without leaking styles.
 */
const phrase =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.";

export default function TextAnimation() {
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // gsap plugin registration
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(wordRefs.current, { opacity: 0.2 });

    gsap.to(wordRefs.current, {
      opacity: 1,
      ease: 'none',
      stagger: 0.2,
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom center',
        scrub: true,
      },
    });
  }, []);

  // Split the phrase into words so we can target them individually.
  const words = phrase.split(' ');

  return (
    <div ref={container} className="flex items-center justify-center w-full min-h-screen px-4">
      <p className="text-center text-white text-3xl md:text-5xl leading-snug max-w-4xl">
        {words.map((word, idx) => (
          <span
            key={`${word}-${idx}`}
            ref={(el) => {
              if (el) wordRefs.current[idx] = el;
            }}
            className="inline-block mr-1 opacity-20"
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
} 