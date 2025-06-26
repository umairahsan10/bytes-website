'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

interface AppScreen {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

const ScrollingPhoneMockup: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [currentScreen, setCurrentScreen] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth spring animation for screen transitions
  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 };
  const screenProgress = useSpring(scrollYProgress, springConfig);

  // App screens data
  const appScreens: AppScreen[] = [
    {
      id: "onboarding",
      title: "Seamless Onboarding",
      description: "Get users started with an intuitive onboarding experience that guides them through your app's key features.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop&crop=center",
      features: ["User-friendly setup", "Progressive disclosure", "Interactive tutorials"]
    },
    {
      id: "dashboard",
      title: "Powerful Dashboard",
      description: "Clean, data-driven dashboards that provide users with actionable insights at a glance.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=600&fit=crop&crop=center",
      features: ["Real-time analytics", "Customizable widgets", "Mobile-optimized charts"]
    },
    {
      id: "messaging",
      title: "Smart Messaging",
      description: "Built-in communication features that keep your users connected and engaged.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=600&fit=crop&crop=center",
      features: ["Real-time chat", "Push notifications", "Media sharing"]
    },
    {
      id: "profile",
      title: "User Profiles",
      description: "Personalized user experiences with comprehensive profile management and customization options.",
      image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?w=300&h=600&fit=crop&crop=center",
      features: ["Profile customization", "Privacy controls", "Social integration"]
    }
  ];

  // Transform scroll progress to screen index
  const screenIndex = useTransform(
    screenProgress,
    [0, 1],
    [0, appScreens.length - 1]
  );

  // Update current screen based on scroll
  useEffect(() => {
    const unsubscribe = screenIndex.onChange((latest) => {
      setCurrentScreen(Math.round(latest));
    });
    return () => unsubscribe();
  }, [screenIndex]);

  // Phone tilt animation
  const phoneRotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <div ref={containerRef} className="relative min-h-[400vh] bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Sticky phone container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Content */}
          <motion.div 
            className="text-white space-y-8 lg:pr-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {appScreens[currentScreen]?.title}
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {appScreens[currentScreen]?.description}
              </p>
              
              {/* Features list */}
              <div className="space-y-4">
                {appScreens[currentScreen]?.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress indicators */}
            <div className="flex space-x-2">
              {appScreens.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentScreen 
                      ? 'w-8 bg-blue-400' 
                      : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right side - Phone mockup */}
          <div className="relative flex items-center justify-center">
            <motion.div
              ref={phoneRef}
              className="relative"
              style={{
                rotateY: phoneRotateY,
                scale: phoneScale,
                transformStyle: 'preserve-3d'
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Phone frame using the provided SVG */}
              <div className="relative w-[300px] h-[600px] mx-auto">
                {/* iPhone SVG container */}
                <div className="absolute inset-0 z-20">
                  <svg
                    width="300"
                    height="600"
                    viewBox="0 0 300 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M50 30C50 13.4315 63.4315 0 80 0H220C236.569 0 250 13.4315 250 30V570C250 586.569 236.569 600 220 600H80C63.4315 600 50 586.569 50 570V30Z"
                      fill="#1a1a1a"
                      stroke="#333"
                      strokeWidth="2"
                    />
                    {/* Screen area */}
                    <rect
                      x="65"
                      y="50"
                      width="170"
                      height="360"
                      rx="25"
                      fill="#000"
                    />
                    {/* Home indicator */}
                    <rect
                      x="135"
                      y="520"
                      width="30"
                      height="4"
                      rx="2"
                      fill="#666"
                    />
                    {/* Camera notch */}
                    <rect
                      x="125"
                      y="25"
                      width="50"
                      height="12"
                      rx="6"
                      fill="#333"
                    />
                  </svg>
                </div>

                {/* Screen content */}
                <div className="absolute top-[50px] left-[65px] w-[170px] h-[360px] rounded-[25px] overflow-hidden bg-white">
                  <motion.div
                    key={currentScreen}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={appScreens[currentScreen]?.image || ''}
                      alt={appScreens[currentScreen]?.title || ''}
                      fill
                      className="object-cover"
                      sizes="170px"
                    />
                    
                    {/* Screen overlay with app UI elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                          <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            {appScreens[currentScreen]?.title}
                          </h3>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 rounded-full ${
                                  i <= currentScreen + 1 ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${20 + Math.random() * 30}px` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating elements around phone */}
                <motion.div
                  className="absolute -right-8 top-20 w-16 h-16 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-400/30"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute -left-6 bottom-32 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30"
                  animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-sm mb-2">Scroll to explore</div>
          <div className="w-1 h-8 bg-white/40 rounded-full mx-auto relative">
            <motion.div
              className="w-1 h-3 bg-white rounded-full absolute top-0"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollingPhoneMockup; 