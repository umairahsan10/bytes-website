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

  // Calculate timeline circle positions
  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="relative min-h-[400vh] bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 items-center">
          
          {/* Left side - Text content */}
          <div className="col-span-1 text-white space-y-8">
            {/* Vertical sliding text container */}
            <div className="relative h-[60vh] overflow-hidden">
              {appScreens.map((screen, index) => (
                <motion.div
                  key={screen.id}
                  className="absolute inset-0 flex flex-col justify-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: index === currentScreen ? 1 : 0,
                    y: index === currentScreen ? 0 : 50,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {screen.title}
                  </h2>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    {screen.description}
                  </p>
                  
                  {/* Features list */}
                  <div className="space-y-4">
                    {screen.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: index === currentScreen ? 1 : 0, 
                          x: index === currentScreen ? 0 : -20 
                        }}
                        transition={{ 
                          duration: 0.5, 
                          delay: featureIndex * 0.1,
                          ease: "easeOut"
                        }}
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center - Timeline with circles */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* Vertical timeline line */}
              <div className="relative w-px h-[60vh] bg-gray-600">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-purple-400 origin-top"
                  style={{
                    scaleY: timelineProgress,
                    transformOrigin: 'top'
                  }}
                />
              </div>
              
              {/* Timeline circles */}
              <div className="absolute inset-0 flex flex-col justify-around items-center py-8">
                {appScreens.map((screen, index) => (
                  <motion.div
                    key={screen.id}
                    className="relative"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: index <= currentScreen ? 1 : 0,
                      opacity: index <= currentScreen ? 1 : 0
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                  >
                    {/* Circle */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      index === currentScreen
                        ? 'border-blue-400 bg-blue-400 text-white shadow-lg scale-125'
                        : index < currentScreen
                          ? 'border-purple-400 bg-purple-400 text-white'
                          : 'border-gray-600 bg-gray-800 text-gray-400'
                    }`}>
                      <span className="text-lg font-semibold">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    
                    {/* Active circle glow effect */}
                    {index === currentScreen && (
                      <motion.div
                        className="absolute inset-0 w-12 h-12 rounded-full bg-blue-400/30"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Phone mockup */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="relative">
              {/* Static phone frame */}
              <div className="relative w-[280px] h-[560px] mx-auto">
                {/* iPhone frame */}
                <div className="absolute inset-0 z-20">
                  <svg
                    width="280"
                    height="560"
                    viewBox="0 0 280 560"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M45 25C45 11.1929 56.1929 0 70 0H210C223.807 0 235 11.1929 235 25V535C235 548.807 223.807 560 210 560H70C56.1929 560 45 548.807 45 535V25Z"
                      fill="#1a1a1a"
                      stroke="#333"
                      strokeWidth="2"
                    />
                    {/* Screen area */}
                    <rect
                      x="60"
                      y="40"
                      width="160"
                      height="320"
                      rx="20"
                      fill="#000"
                    />
                    {/* Home indicator */}
                    <rect
                      x="125"
                      y="480"
                      width="30"
                      height="4"
                      rx="2"
                      fill="#666"
                    />
                    {/* Camera notch */}
                    <rect
                      x="115"
                      y="20"
                      width="50"
                      height="10"
                      rx="5"
                      fill="#333"
                    />
                  </svg>
                </div>

                {/* Screen content with vertical sliding */}
                <div className="absolute top-[40px] left-[60px] w-[160px] h-[320px] rounded-[20px] overflow-hidden bg-white">
                  <motion.div
                    className="relative w-full h-full"
                    style={{
                      y: useTransform(
                        scrollYProgress,
                        [0, 1],
                        [0, -(appScreens.length - 1) * 320]
                      )
                    }}
                  >
                    {appScreens.map((screen, index) => (
                      <div
                        key={screen.id}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ top: `${index * 320}px` }}
                      >
                        <Image
                          src={screen.image}
                          alt={screen.title}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                        
                        {/* Screen overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                              <h3 className="text-xs font-semibold text-gray-800 mb-1">
                                {screen.title}
                              </h3>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4].map((i) => (
                                  <div
                                    key={i}
                                    className={`h-1 rounded-full ${
                                      i <= index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                    style={{ width: `${15 + Math.random() * 20}px` }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Floating elements around phone */}
                <motion.div
                  className="absolute -right-6 top-16 w-12 h-12 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-400/30"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute -left-4 bottom-24 w-10 h-10 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30"
                  animate={{
                    y: [0, 12, 0],
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
            </div>
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