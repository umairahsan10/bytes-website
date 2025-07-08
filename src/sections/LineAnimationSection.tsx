'use client';

import FlowerBytesAnimation from '@/components/FlowerBytesAnimation';
import TextAnimation from "@/components/TextAnimation";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const LineAnimationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Pin the section for twice the viewport height to allow both animations to finish
    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: true,
      scrub: false,
    });

    return () => {
      pinTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about-line" className="relative w-full bg-[#010a14] overflow-hidden">
      {/* Sticky container keeps animation and text pinned together */}
      <div className="sticky top-0 h-screen w-full">
        {/* Background line animation */}
        <FlowerBytesAnimation />

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <TextAnimation />
        </div>
      </div>
    </section>
  );
}; 