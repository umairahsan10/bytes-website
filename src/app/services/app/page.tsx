'use client';
import Image from "next/image";   // put this at the top with the other imports

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Header } from '@/sections/Navbar';
import { useRouter } from 'next/navigation';

// Helper component for word-by-word reveal
const AnimatedParagraph = ({ text, className = "" }: { text: string; className?: string }) => {
  const wordContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const wordItem = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%", opacity: 1,
      transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const }
    }
  };

  return (
    <motion.p
      className={className}
      variants={wordContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
      style={{ overflow: "hidden", display: "inline-block" }}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={wordItem}
          style={{ display: "inline-block", marginRight: "0.25rem" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

const AppDevelopmentPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topHeroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

  // Scroll-based transforms for the first (top) hero
  const { scrollYProgress: topHeroScroll } = useScroll({ target: topHeroRef, offset: ["start start", "end start"] });
  const topY = useTransform(topHeroScroll, [0, 1], ['0%', '50%']);
  const topOpacity = useTransform(topHeroScroll, [0, 0.3], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  // Scrolling phone mockup data
  const [currentScreen, setCurrentScreen] = useState(0);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const [scrollThreshold, setScrollThreshold] = useState(0);
  const [hasCompletedAllScreens, setHasCompletedAllScreens] = useState(false);

  // Feature cards state
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const { scrollYProgress: phoneScrollProgress } = useScroll({
    target: phoneContainerRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 80, damping: 25, restDelta: 0.001 };
  const screenProgress = useSpring(phoneScrollProgress, springConfig);

  const appScreens = [
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

  // Enhanced scroll tracking with threshold + extended 4th screen time
  useEffect(() => {
    const unsubscribe = phoneScrollProgress.onChange((progress) => {
      // Mark section complete after reaching 0.7
      if (progress >= 0.7 && !hasCompletedAllScreens) {
        setHasCompletedAllScreens(true);
      }

      setScrollThreshold(progress);

      let newScreen;
      if (progress < 0.2) {
        newScreen = 0;        // first screen
      } else if (progress < 0.35) {
        newScreen = 1;        // second screen
      } else if (progress < 0.5) {
        newScreen = 2;        // third screen
      } else {
        newScreen = 3;        // fourth screen
      }

      if (newScreen !== currentScreen) {
        setCurrentScreen(newScreen);
      }
    });
    return () => unsubscribe();
  }, [phoneScrollProgress, currentScreen, hasCompletedAllScreens]);

  // Create smooth image movement transforms for vertical sliding
  const mockupTranslateY = useTransform(phoneScrollProgress, [0, 1], [0, -300]);
  const mockupScale = useTransform(phoneScrollProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <>
      <Header className="app-header" />

      {/* Simple Hero Section */}
      <motion.section
        ref={topHeroRef}
        style={{ y: topY, opacity: topOpacity }}
        className="relative flex flex-col md:flex-row items-center md:justify-between bg-[#2a3270] px-4 md:px-8 lg:px-16 py-20 md:py-0 md:h-screen"
      >
        {/* Left side - Text content */}
        <div className="relative z-10 text-left w-full md:w-3/10 lg:w-3/10 order-2 md:order-1 mt-8 md:mt-0">
          <motion.h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 md:mb-8"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
              MOBILE APPS
            </span>
          </motion.h1>

          <AnimatedParagraph
            text="Transform your ideas into powerful mobile experiences with cutting-edge development expertise."
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed max-w-2xl"
          />
        </div>

        {/* Right side - Hero image */}
        <div className="relative w-full md:w-7/10 lg:w-7/10 h-64 sm:h-80 md:h-full flex items-center justify-center overflow-hidden order-1 md:order-2">
          <motion.div
            className="relative w-full h-full max-w-2xl"
            whileInView={{
              y: [-10, 10, -10],
              rotate: [0, 2, 0]
            }}
            transition={{
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 }
            }}
            viewport={{ once: false }}
          >
            <Image
              src="/assets/app-hero-img.png"
              alt="Team brainstorming on mobile-app UI"
              fill
              className="object-contain opacity-100 scale-150 -translate-x-20"
              style={{
                maskImage: 'linear-gradient(to left, transparent 0%, black 30%)',
                WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 30%)'
              }}
            />
          </motion.div>

          {/* Floating elements around the hero image */}
          <motion.div
            className="absolute top-20 right-20 w-16 h-16 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30"
            whileInView={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6,
              ease: "easeInOut"
            }}
            viewport={{ once: false }}
          />

          <motion.div
            className="absolute bottom-32 left-16 w-12 h-12 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-400/30"
            whileInView={{
              y: [0, 25, 0],
              rotate: [0, -90, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              delay: 1
            }}
            viewport={{ once: false }}
          />

          <motion.div
            className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-400/30"
            whileInView={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              delay: 2
            }}
            viewport={{ once: false }}
          />
        </div>
      </motion.section>

      {/* Scrolling Phone Mockup Section */}
      <div
        ref={phoneContainerRef}
        className="relative bg-white py-16 md:py-20 lg:py-24"
        style={{
          minHeight: '400vh',
          scrollBehavior: 'smooth',
        }}
      >
        <div className="sticky top-0 h-screen flex items-start md:items-center justify-center overflow-hidden pt-16 md:pt-0">
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-start md:items-center">

            {/* Left side - Phone mockup */}
            <div className="col-span-1 row-start-1 flex items-center justify-center">
              <motion.div
                className="relative"
                style={{
                  y: useTransform(
                    screenProgress,
                    [0, 0.7, 1],
                    [0, 0, -100]
                  )
                }}
              >
                {/* Static phone frame */}
                <div className="relative w-[200px] sm:w-[240px] md:w-[260px] h-[406px] sm:h-[488px] md:h-[530px] mx-auto">
                  {/* iPhone 14 frame */}
                  <div className="absolute inset-0 z-20">
                    <Image
                      src="/assets/iPhone14-space-black.svg"
                      alt="iPhone 14 Space Black"
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Screen content with step-by-step sliding */}
                  <div className="absolute top-[22px] sm:top-[26px] md:top-[28px] left-[22px] sm:left-[26px] md:left-[28px] w-[156px] sm:w-[188px] md:w-[204px] h-[338px] sm:h-[406px] md:h-[442px] rounded-[30px] sm:rounded-[34px] md:rounded-[38px] overflow-hidden bg-gray-50">
                    <motion.div
                      className="relative w-full h-full"
                      style={{
                        y: useTransform(
                          screenProgress,
                          [0.1, 0.2, 0.2, 0.35, 0.35, 0.5, 0.5, 0.7, 0.7, 1],
                          [0, 0, -442, -442, -884, -884, -1326, -1326, -1326, -1326]
                        )
                      }}
                    >
                      {appScreens.map((screen, index) => (
                        <div
                          key={screen.id}
                          className="absolute top-0 left-0 w-full h-full"
                          style={{ top: `${index * 442}px` }}
                        >
                          <Image
                            src={screen.image}
                            alt={screen.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 156px, (max-width: 768px) 188px, 204px"
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
                                      className={`h-1 rounded-full ${i <= index + 1 ? 'bg-purple-500' : 'bg-gray-300'
                                        }`}
                                      style={{ width: `${12 + Math.random() * 18}px` }}
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
                    className="absolute -right-4 top-12 w-10 h-10 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30"
                    whileInView={{
                      y: [0, -12, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 6,
                      ease: "easeInOut"
                    }}
                    viewport={{ once: false }}
                  />

                  <motion.div
                    className="absolute -left-3 bottom-20 w-8 h-8 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30"
                    whileInView={{
                      y: [0, 10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    viewport={{ once: false }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Center - Timeline with circles */}
            <div className="col-span-1 row-start-1 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {/* Vertical timeline line with circles on it */}
                <div className="relative w-px h-64 md:h-[60vh] bg-gray-300">
                  {/* Progress line */}
                  <motion.div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-600 to-purple-800 origin-top"
                    style={{
                      scaleY: useTransform(
                        screenProgress,
                        [0.1, 0.7],
                        [0, 1]
                      ),
                      transformOrigin: 'top'
                    }}
                  />

                  {/* Circles positioned on the line - step-by-step */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      y: useTransform(
                        screenProgress,
                        [0.1, 0.2, 0.2, 0.35, 0.35, 0.5, 0.5, 0.7, 0.7, 1],
                        [0, 0, -60, -60, -120, -120, -180, -180, -180, -180]
                      )
                    }}
                  >
                    {appScreens.map((screen, index) => (
                      <motion.div
                        key={screen.id}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12"
                        style={{ top: `${index * 120}px` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: index === currentScreen ? 1 : 0,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                      >
                        {/* Circle */}
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${index === currentScreen
                            ? 'border-purple-600 bg-purple-600 text-white shadow-lg scale-125'
                            : index < currentScreen
                              ? 'border-purple-600 bg-purple-600 text-white'
                              : 'border-gray-300 bg-white text-gray-400'
                          }`}>
                          <span className="text-lg font-semibold">{String(index + 1).padStart(2, '0')}</span>
                        </div>

                        {/* Active circle glow effect */}
                        {index === currentScreen && (
                          <motion.div
                            className="absolute inset-0 w-12 h-12 rounded-full bg-purple-600/30"
                            whileInView={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              ease: "easeInOut"
                            }}
                            viewport={{ once: false }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="col-span-2 md:col-span-1 row-start-2 md:row-start-1 text-gray-900 space-y-8 mt-2 md:mt-0">
              {/* Vertical sliding text container */}
              <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                <motion.div
                  className="relative w-full h-full"
                  style={{
                    y: useTransform(
                      screenProgress,
                      [0.1, 0.2, 0.2, 0.35, 0.35, 0.5, 0.5, 0.7, 0.7, 1],
                      [0, 0, -400, -400, -800, -800, -1200, -1200, -1200, -1200]
                    )
                  }}
                >
                  {appScreens.map((screen, index) => (
                    <motion.div
                      key={screen.id}
                      className="absolute top-0 left-0 w-full h-full flex flex-col justify-center"
                      style={{ top: `${index * 400}px` }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        {screen.title}
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
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
                              opacity: 1,
                              x: index === currentScreen ? 0 : -20
                            }}
                            transition={{
                              duration: 0.5,
                              delay: featureIndex * 0.1,
                              ease: "easeOut"
                            }}
                          >
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-center"
            whileInView={{ y: [0, 8, 0] }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            <div className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Scroll to explore</div>
            <div className="w-1 h-6 sm:h-8 bg-gray-300 rounded-full mx-auto relative">
              <motion.div
                className="w-1 h-2 sm:h-3 bg-gray-800 rounded-full absolute top-0"
                whileInView={{ y: [0, 16, 0] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: false }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Original content wrapped in container */}
      <div ref={containerRef} className="bg-white text-gray-900">
        {/* Value Proposition & Offerings Section */}
        {/* NOTE: Replace placeholder numbers / credentials with your company-specific facts where applicable. */}
        <section className="pt-[0.5rem] pb-[1.5rem] md:pt-[0.75rem] md:pb-[2rem] px-6 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-4 md:gap-6 items-center">
            {/* Copy Block */}
            <motion.div
              className="space-y-4 order-2 lg:order-1"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight">
                The Future <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Is&nbsp;Mobile</span>
              </h2>
              <AnimatedParagraph
                text="Mobile apps aren't a luxury anymore — they're the frontline of customer experience. From start-ups to enterprises, every brand is racing to become an icon on the home screen."
                className="text-sm md:text-base text-gray-700 leading-relaxed"
              />
              <AnimatedParagraph
                text="At Bytes Platform, we don't just code apps — we engineer mobile products that engage, retain, and scale."
                className="text-sm md:text-base text-gray-700 leading-relaxed"
              />

              <ul className="space-y-1">
                {[
                  "Apple App Store Listed Developer", // <-- replace / verify real credentials
                  "Google Play Certified Publisher",   // <-- replace / verify real credentials
                  "Pixel-perfect UI/UX prototypes in Figma",
                  "End-to-end ownership — frontend, backend & cloud",
                  "Post-launch support & version management"
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <div className="w-2 h-2 mt-2 mr-4 rounded-full bg-purple-600"></div>
                    <span className="text-sm md:text-base text-gray-800">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-semibold text-sm md:text-base mt-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
              >
                Book a Free App Consultation
              </motion.button>
            </motion.div>

            {/* Illustrative Image */}
            <motion.div 
              className="order-1 lg:order-2 relative aspect-[4/5] w-full max-w-md mx-auto"
              animate={{ 
                y: [-10, 10, -10],
                rotateY: [-2, 2, -2]
              }}
              transition={{
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotateY: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Image
                src="/assets/newimages/mobileapp.png"
                alt="Mobile app hero mockup"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-32 px-6 bg-[#E1E1E1] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-20 animate-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              Development Services
            </motion.h2>

            <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Background overlay for selected card */}
              {selectedFeature !== null && (
                <motion.div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {[
                {
                  title: "Native iOS Development",
                  description: "Swift and SwiftUI applications optimized for Apple's ecosystem with seamless integration and performance.",
                  detailedDescription: "Build powerful iOS applications using Swift and SwiftUI that take full advantage of Apple's ecosystem. Our native development approach ensures optimal performance, seamless integration with iOS features like Face ID, Touch ID, and Apple Pay, and adherence to Apple's Human Interface Guidelines. We leverage Core Data for local storage, integrate with CloudKit for synchronization, and implement advanced features like ARKit for augmented reality experiences.",
                  gradient: "from-blue-500 to-cyan-500",
                  features: ["Swift & SwiftUI", "Core Data Integration", "CloudKit Sync", "ARKit Support", "Apple Pay Integration", "TestFlight Beta Testing"]
                },
                {
                  title: "Native Android Development",
                  description: "Kotlin and Java applications leveraging Android's full capabilities for optimal user experience.",
                  detailedDescription: "Create robust Android applications using Kotlin and Java that harness the full power of the Android platform. Our development process includes Material Design implementation, integration with Google services, efficient memory management, and optimization for various screen sizes and Android versions. We implement advanced features like background processing, push notifications, and seamless integration with Google Play Services.",
                  gradient: "from-green-500 to-emerald-500",
                  features: ["Kotlin & Java", "Material Design", "Google Play Services", "Room Database", "WorkManager", "Firebase Integration"]
                },
                {
                  title: "Cross-Platform Solutions",
                  description: "React Native and Flutter apps that run efficiently on both iOS and Android with shared codebase.",
                  detailedDescription: "Develop cost-effective cross-platform applications using React Native and Flutter that deliver native-like performance on both iOS and Android. Our approach maximizes code reuse while maintaining platform-specific optimizations. We implement custom native modules when needed, ensure consistent UI/UX across platforms, and provide comprehensive testing on both operating systems.",
                  gradient: "from-purple-500 to-pink-500",
                  features: ["React Native", "Flutter", "Shared Codebase", "Platform Optimization", "Custom Native Modules", "Cross-Platform Testing"]
                },
                {
                  title: "UI/UX Design",
                  description: "Intuitive and engaging mobile interfaces designed with user-centered approach and modern aesthetics.",
                  detailedDescription: "Design beautiful and functional mobile interfaces that prioritize user experience and accessibility. Our design process includes user research, wireframing, prototyping, and usability testing. We create design systems that ensure consistency across your app, implement smooth animations and transitions, and optimize for various screen sizes and accessibility requirements.",
                  gradient: "from-orange-500 to-red-500",
                  features: ["User Research", "Wireframing & Prototyping", "Design Systems", "Accessibility", "Animation Design", "Usability Testing"]
                },
                {
                  title: "Backend Integration",
                  description: "Robust API development and third-party service integration for seamless data synchronization.",
                  detailedDescription: "Build and integrate powerful backend systems that support your mobile application's functionality. Our backend development includes RESTful API design, GraphQL implementation, real-time data synchronization, secure authentication systems, and integration with third-party services. We ensure scalable architecture, efficient caching strategies, and comprehensive error handling.",
                  gradient: "from-indigo-500 to-blue-500",
                  features: ["RESTful APIs", "GraphQL", "Real-time Sync", "Authentication", "Third-party Integration", "Scalable Architecture"]
                },
                {
                  title: "App Store Deployment",
                  description: "Complete deployment process including store optimization, testing, and post-launch support.",
                  detailedDescription: "Navigate the complete app store deployment process with our expert guidance. We handle app store optimization (ASO), create compelling store listings with screenshots and descriptions, manage the submission process for both Apple App Store and Google Play Store, implement analytics tracking, and provide ongoing support for updates and maintenance.",
                  gradient: "from-teal-500 to-green-500",
                  features: ["App Store Optimization", "Store Listings", "Submission Management", "Analytics Integration", "Update Management", "Post-launch Support"]
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`feature-card group relative bg-white rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer ${selectedFeature === index
                      ? 'border-purple-400 shadow-2xl z-50'
                      : selectedFeature !== null
                        ? 'border-purple-100 opacity-30'
                        : 'border-purple-100 hover:border-purple-300'
                    }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1] as const
                  }}
                  whileHover={{
                    scale: selectedFeature === index ? 1.02 : (selectedFeature !== null ? 1 : 1.02),
                    z: selectedFeature === index ? 50 : (selectedFeature !== null ? 1 : 10)
                  }}
                  style={{
                    transformOrigin: 'center center'
                  }}
                  onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl transition-opacity duration-300 ${selectedFeature === index ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
                    }`} />

                  <div className="relative z-10 p-8">
                    <div
                      className={`bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 flex items-center justify-center ${selectedFeature === index ? 'w-20 h-20' : 'w-16 h-16'
                        } transition-all duration-300`}
                    >
                      <div
                        className={`bg-white/20 rounded-lg ${selectedFeature === index ? 'w-10 h-10' : 'w-8 h-8'
                          } transition-all duration-300`}
                      />
                    </div>

                    <h3
                      className={`font-semibold`}
                    >
                      {feature.title}
                    </h3>
                    {/* Feature description placeholder */}
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack Section (restored) */}
        <section className="py-32 px-6 bg-[#D6C3DF] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20 animate-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-5xl md:text-6xl font-bold mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Technology <motion.span
                  className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  STACK
                </motion.span>
              </motion.h2>
              <AnimatedParagraph
                text="We leverage the latest technologies and frameworks to build robust, scalable, and high-performance mobile applications."
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "React Native", category: "Cross-Platform", icon: "/assets/react-native-icon.png", color: "from-blue-500 to-cyan-500" },
                { name: "Flutter", category: "Cross-Platform", icon: "/assets/flutter-icon.png", color: "from-blue-600 to-blue-800" },
                { name: "Swift/SwiftUI", category: "iOS Native", icon: "/assets/swift-icon.png", color: "from-orange-500 to-red-500" },
                { name: "Kotlin/Java", category: "Android Native", icon: "/assets/kotlin-icon.png", color: "from-purple-600 to-purple-800" },
                { name: "Node.js", category: "Backend", icon: "/assets/nodejs-icon.png", color: "from-green-500 to-green-700" },
                { name: "Firebase", category: "Backend", icon: "/assets/firebase-icon.png", color: "from-orange-400 to-yellow-500" },
                { name: "MongoDB", category: "Database", icon: "/assets/mongodb-icon.png", color: "from-green-600 to-green-800" },
                { name: "AWS/Azure", category: "Cloud", icon: "/assets/aws-icon.png", color: "from-orange-600 to-red-600" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="relative bg-purple-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-500 group overflow-hidden"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1] as const
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -10,
                    rotateY: 5,
                    z: 50
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Icon container */}
                  <motion.div
                    className="w-16 h-16 rounded-xl mb-6 mx-auto overflow-hidden flex items-center justify-center bg-white shadow-lg relative"
                    whileHover={{
                      scale: 1.1,
                      rotate: 360
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-20 rounded-xl`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div className="relative z-10" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <Image src={tech.icon} alt={`${tech.name} icon`} width={48} height={48} className="object-contain" />
                    </motion.div>
                  </motion.div>
                  <motion.h3 className="text-lg font-semibold text-center mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-purple-800 group-hover:bg-clip-text transition-all duration-300" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                    {tech.name}
                  </motion.h3>
                  <p className="text-sm text-gray-400 text-center group-hover:text-gray-600 transition-colors duration-300">{tech.category}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="relative py-32 px-6 bg-[#E1E1E1] overflow-hidden">
          {/* Decorative background image */}
          <Image
            src="/assets/app-img-3.png"
            alt="Mobile app showcase"
            fill
            className="object-cover absolute inset-0"
            priority
          />
          {/* Semi-transparent overlay to improve text readability */}
          <div className="absolute inset-0 bg-white/40" />

          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center animate-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Build Your
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Next App?
              </span>
            </h2>

            <AnimatedParagraph
              text="Transform your ideas into powerful mobile experiences. Let's discuss your project and bring your vision to life."
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            />

            <motion.button
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-12 py-4 rounded-full text-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/contact')}
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default AppDevelopmentPage;