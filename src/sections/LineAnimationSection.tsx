'use client';

import FlowerBytesAnimation from '@/components/FlowerBytesAnimation';
import TextAnimation from "@/components/TextAnimation";

export const LineAnimationSection = () => {
  return (
    <section id="about" className="relative w-full min-h-[100vh] overflow-hidden">
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