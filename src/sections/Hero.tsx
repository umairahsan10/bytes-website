'use client';

import { motion } from 'framer-motion';
import WebGLFluidOriginal from '@/components/WebGLFluidOriginal';
import ThreeDText from '@/components/ThreeDText';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* WebGL Fluid Background */}
      <div className="absolute inset-0 z-0">
        <WebGLFluidOriginal />
      </div>
      
      {/* 3D Text Content - Enable pointer events to interact with canvas */}
      <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ pointerEvents: 'none' }}>
        <ThreeDText />
      </div>
    </section>
  );
};
