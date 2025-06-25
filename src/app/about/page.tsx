// "use client";

// import { Header } from "@/sections/Navbar";
// import { AboutSection } from "@/sections/About";
// import { Footer } from "@/sections/Footer";

// export default function AboutPage() {
//   return (
//     <main>
//       <Header />
//       <AboutSection />
//       <Footer />
//     </main>
//   );
// } 

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Header } from '@/sections/Navbar';

const AboutUsPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animated sections refs
  const heroRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const missionRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const valuesRef = useRef<HTMLDivElement | null>(null);

  // Animation controls
  const heroInView = useInView(heroRef, { amount: 0.3 });
  const storyInView = useInView(storyRef, { amount: 0.3 });
  const missionInView = useInView(missionRef, { amount: 0.3 });
  const teamInView = useInView(teamRef, { amount: 0.3 });
  const valuesInView = useInView(valuesRef, { amount: 0.3 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const StarField = () => {
    const stars = Array.from({ length: 100 }, (_, i) => (
      <motion.div
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        className="absolute bg-white rounded-full"
        style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ));
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{stars}</div>;
  };

  const GeometricShapes = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-64 h-64 border border-yellow-400/20 rounded-full"
        style={{ left: '10%', top: '20%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-32 h-32 border border-yellow-400/30 rotate-45"
        style={{ right: '15%', top: '30%' }}
        animate={{ rotate: 405 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-48 h-48 border border-yellow-400/10 rounded-full"
        style={{ left: '70%', bottom: '20%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <StarField />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 193, 7, 0.05) 0%, transparent 50%)`,
        }}
      />
    </div>
  );

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Decorative shapes & mouse-follow gradient */}
      <GeometricShapes />

      {/* Site-wide Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center px-6 pt-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={textVariants as any} className="space-y-6">
              <h1 className="text-7xl lg:text-9xl font-bold leading-none">
                EFFECTIVE
                <br />
                SOLUTIONS
              </h1>
              <div className="w-24 h-1 bg-yellow-400" />
            </motion.div>

            <motion.p variants={textVariants as any} className="text-lg text-gray-300 max-w-md">
              We make awesome websites that sell
            </motion.p>

            <motion.div variants={textVariants as any} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">▶</span>
              </div>
              <span className="text-sm">Our works</span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={scaleIn as any}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Placeholder for astronaut image */}
            <div className="relative w-96 h-96 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <div className="w-80 h-80 bg-black rounded-full flex items-center justify-center">
                <div className="text-8xl text-yellow-400 font-bold">IMG</div>
              </div>
            </div>

            <motion.div
              className="absolute top-8 right-8 bg-black/80 backdrop-blur-sm rounded-lg p-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="text-yellow-400 text-2xl font-bold">200+</div>
              <div className="text-xs text-white">Projects completed</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="min-h-screen bg-white text-black py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInLeft as any}
            initial="hidden"
            animate={storyInView ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Placeholder for rocket image */}
            <div className="relative w-96 h-96 mx-auto">
              <div className="absolute inset-0 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-80 h-80 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="text-6xl text-black font-bold">IMG</div>
                </div>
                <div className="absolute -right-8 top-1/2 w-24 h-24 bg-gray-300 rounded-full" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={storyInView ? 'visible' : 'hidden'}
            className="space-y-8 order-1 lg:order-2"
          >
            <motion.div variants={textVariants as any} className="space-y-6">
              <h2 className="text-7xl lg:text-9xl font-bold leading-none">
                EFFECTIVE
                <br />
                SOLUTIONS
              </h2>
              <div className="w-24 h-1 bg-yellow-400" />
            </motion.div>

            <motion.p variants={textVariants as any} className="text-lg text-gray-600 max-w-md">
              We make awesome websites that sell
            </motion.p>

            <motion.div variants={textVariants as any} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">▶</span>
              </div>
              <span className="text-sm">Our works</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="min-h-screen bg-black text-white py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={missionInView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={textVariants as any} className="space-y-6">
              <h2 className="text-7xl lg:text-9xl font-bold leading-none">
                EFFECTIVE
                <br />
                SOLUTIONS
              </h2>
              <div className="w-24 h-1 bg-yellow-400" />
            </motion.div>
            <motion.p variants={textVariants as any} className="text-lg text-gray-300 max-w-md">
              We make great selling sites, promote and support them
            </motion.p>
            <motion.div variants={textVariants as any} className="space-y-4">
              <div className="bg-yellow-400 text-black px-8 py-6 inline-block">
                <h3 className="text-4xl font-bold">01</h3>
              </div>
              <div className="space-y-3 ml-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm">PROJECT NAME</span>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>— Site targeting</div>
                  <div>— Mobile version</div>
                  <div>— Special animations</div>
                  <div>— Integration with CRM/ERP and</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            variants={slideInRight as any}
            initial="hidden"
            animate={missionInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Placeholder for astronaut image */}
            <div className="relative w-96 h-96 mx-auto">
              <div className="absolute inset-0 bg-gray-800 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-6xl text-yellow-400 font-bold">IMG</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="min-h-screen bg-white text-black py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInLeft as any}
            initial="hidden"
            animate={teamInView ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Placeholder for phone mockup */}
            <div className="relative w-80 h-96 mx-auto">
              <div className="w-full h-full bg-yellow-400 rounded-3xl p-6 flex flex-col">
                <div className="flex-1 bg-white rounded-2xl p-4 flex items-center justify-center">
                  <div className="text-4xl text-black font-bold">IMG</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">START PROJECT</span>
                    <span className="text-xs">OUR WORKS</span>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 rounded-lg text-sm"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-yellow-400 font-bold">01</div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={teamInView ? 'visible' : 'hidden'}
            className="space-y-8 order-1 lg:order-2"
          >
            <motion.div variants={textVariants as any} className="space-y-6">
              <h2 className="text-7xl lg:text-9xl font-bold leading-none">
                EFFECTIVE
                <br />
                SOLUTIONS
              </h2>
              <div className="w-24 h-1 bg-yellow-400" />
            </motion.div>
            <motion.p variants={textVariants as any} className="text-lg text-gray-600 max-w-md">
              We make great selling sites, promote and support them
            </motion.p>
            <motion.div variants={textVariants as any} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-sm">PROJECT NAME</div>
              </div>
              <div className="space-y-1 text-sm text-gray-500">
                <div>— Site targeting</div>
                <div>— Mobile version</div>
                <div>— Special animations</div>
                <div>— Integration with CRM/ERP and</div>
              </div>
            </motion.div>
            <motion.button
              variants={textVariants as any}
              className="bg-yellow-400 text-black px-8 py-3 rounded font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start project
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="min-h-screen bg-black text-white py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={textVariants as any} className="space-y-6">
              <h2 className="text-7xl lg:text-9xl font-bold leading-none">
                EFFECTIVE
                <br />
                SOLUTIONS
              </h2>
              <div className="w-24 h-1 bg-yellow-400" />
            </motion.div>
            <motion.p variants={textVariants as any} className="text-lg text-gray-300 max-w-md">
              We make great selling sites, promote and support them
            </motion.p>
          </motion.div>
          <motion.div
            variants={slideInRight as any}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Placeholder for space image */}
            <div className="relative w-96 h-96 mx-auto">
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-6xl text-yellow-400 font-bold">IMG</div>
              </div>
              <motion.div
                className="absolute bottom-4 left-4 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs">←</span>
                </button>
                <button className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs">→</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;