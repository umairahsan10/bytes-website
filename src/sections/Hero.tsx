'use client';

import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useRef, useEffect } from 'react';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const splineAppRef = useRef<any | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          splineAppRef.current?.play();
          observer.unobserve(entry.target);
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="bg-[#010a14] w-full h-screen flex flex-col md:flex-row items-center md:justify-between px-4 sm:px-6 md:px-12 lg:px-24 pt-24 pb-16 md:py-28 gap-y-12 md:gap-y-0">
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full md:flex-1 text-center md:text-left"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Empowering Innovation
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-[#f0f0f0] max-w-lg mx-auto md:mx-0">
          Transform your ideas into reality with our cutting-edge digital solutions.
        </p>
      </motion.div>

      {/* Right Section */}
      <div
        ref={containerRef}
        className="w-full md:flex-1 h-48 sm:h-60 md:h-[450px] lg:h-[550px] xl:h-[650px]"
      >
        <Spline
          scene="https://prod.spline.design/ZbwLTUMOYxeHDpVi/scene.splinecode"
          renderOnDemand
          onLoad={(app) => {
            splineAppRef.current = app;
          }}
        />
      </div>
    </section>
  );
};
