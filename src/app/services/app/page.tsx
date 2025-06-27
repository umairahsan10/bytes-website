'use client';
import Image from "next/image";   // put this at the top with the other imports

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Header } from '@/sections/Navbar';

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
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

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
  
  // Feature cards state
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  
  const { scrollYProgress: phoneScrollProgress } = useScroll({
    target: phoneContainerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 };
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

  // Enhanced scroll mapping with smooth transitions
  useEffect(() => {
    const unsubscribe = phoneScrollProgress.onChange((progress) => {
      // Smooth transition between screens based on scroll progress
      let newScreen;
      if (progress <= 0.2) {
        newScreen = 0;        // First 20% = Screen 1 (Seamless Onboarding)
      } else if (progress <= 0.4) {
        newScreen = 1;        // 20-40% = Screen 2 (Powerful Dashboard)
      } else if (progress <= 0.6) {
        newScreen = 2;        // 40-60% = Screen 3 (Smart Messaging)
      } else if (progress <= 0.8) {
        newScreen = 3;        // 60-80% = Screen 4 (User Profiles)
      } else {
        newScreen = 3;        // 80-100% = Stay on Screen 4
      }
      
      if (newScreen !== currentScreen) {
        setCurrentScreen(newScreen);
      }
    });
    return () => unsubscribe();
  }, [phoneScrollProgress, currentScreen]);

  // Create smooth image movement transforms for vertical sliding
  const mockupTranslateY = useTransform(phoneScrollProgress, [0, 1], [0, -300]);
  const mockupScale = useTransform(phoneScrollProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <>
      <Header className="app-header" />
      
      {/* Simple Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y, opacity }}
        className="relative h-screen flex items-center justify-start bg-[#E1E1E1] px-4 md:px-8 lg:px-16"
      >
        <Image
          src="/assets/app-hero.png"
          alt="Team brainstorming on mobile-app UI"
          fill
          className="object-cover opacity-100 absolute inset-0"
        />

        <div className="relative z-10 text-left w-full md:w-3/5 lg:w-1/2">
          <motion.h1 
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-6 md:mb-8"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
              MOBILE
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
              APPS
            </span>
          </motion.h1>
          
          <AnimatedParagraph
            text="When innovation meets functionality, Bytes Platform delivers cutting-edge mobile applications that transform ideas into powerful digital experiences, building on years of development expertise."
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed max-w-2xl"
          />
        </div>
      </motion.section>

      {/* Scrolling Phone Mockup Section */}
      <div ref={phoneContainerRef} className="relative min-h-[400vh] bg-white py-16 md:py-20 lg:py-24">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left - Mobile Phone */}
            <div className="flex-1 flex items-center justify-center order-2 lg:order-1 mb-8 lg:mb-0">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative w-[240px] sm:w-[280px] md:w-[300px] h-[488px] sm:h-[569px] md:h-[610px] mx-auto">
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

                  {/* Screen content with fade transitions */}
                  <div className="absolute top-[26px] sm:top-[30px] md:top-[32px] left-[26px] sm:left-[30px] md:left-[33px] w-[188px] sm:w-[218px] md:w-[234px] h-[406px] sm:h-[472px] md:h-[507px] rounded-[36px] sm:rounded-[40px] md:rounded-[45px] overflow-hidden bg-gray-50">
                    {/* Current screen image with fade transition */}
                    <motion.div
                      key={currentScreen}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <Image
                        src={appScreens[currentScreen]?.image || ''}
                        alt={appScreens[currentScreen]?.title || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 188px, (max-width: 768px) 218px, 234px"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Vertical Timeline with Moving Number Icons */}
            <div className="hidden lg:flex relative flex-col items-center justify-center px-8 xl:px-12 order-2">
              {/* Vertical timeline line */}
              <div className="relative w-px h-[60vh] bg-gray-200">
                <motion.div
                  className="w-full bg-purple-600 origin-top"
                  style={{
                    scaleY: phoneScrollProgress,
                    transformOrigin: 'top'
                  }}
                />
              </div>
              
              {/* Moving number icons */}
              <div className="absolute inset-0 flex flex-col justify-around items-center py-12 lg:py-16">
                {appScreens.map((screen, index) => (
                  <motion.div
                    key={screen.id}
                    className="relative"
                    initial={{ scale: 0, y: 50 }}
                    animate={{ 
                      scale: index <= currentScreen ? 1 : 0,
                      y: index <= currentScreen ? 0 : 50
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                  >
                    {/* Number circle */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      index === currentScreen
                        ? 'border-purple-600 bg-purple-600 text-white shadow-lg scale-125'
                        : index < currentScreen
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      <span className="text-lg font-semibold">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Connecting line to content */}
              <div className="absolute right-0 top-1/2 w-8 lg:w-12 h-px bg-gray-300"></div>
            </div>

            {/* Right side - Text Sections that Slide Upward */}
            <div className="flex-1 lg:pl-4 xl:pl-8 order-1 lg:order-3 mb-8 lg:mb-0">
              <div className="space-y-16">
                {appScreens.map((screen, index) => (
                  <motion.div
                    key={screen.id}
                    className={`text-section ${index === currentScreen ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ 
                      opacity: index <= currentScreen ? 1 : 0.3,
                      y: index <= currentScreen ? 0 : 50
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.3,
                      ease: "easeOut"
                    }}
                  >
                    {/* Section Number */}
                    <div className="mb-6">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        index === currentScreen
                          ? 'border-purple-600 bg-purple-600 text-white shadow-lg'
                          : index < currentScreen
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                      }`}>
                        <span className="text-lg font-semibold">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Section Title */}
                    <motion.h2 
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 transition-all duration-300 ${
                        index === currentScreen ? 'text-purple-600' : 'text-gray-400'
                      }`}
                    >
                      {screen.title}
                    </motion.h2>
                    
                    {/* Section Description */}
                    <motion.p 
                      className={`text-base sm:text-lg text-gray-600 leading-relaxed mb-6 transition-all duration-300 ${
                        index === currentScreen ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {screen.description}
                    </motion.p>
                    
                    {/* Features list */}
                    <motion.div 
                      className={`space-y-3 transition-all duration-300 ${
                        index === currentScreen ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      {screen.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ 
                            opacity: index === currentScreen ? 1 : 0.5,
                            x: index === currentScreen ? 0 : 20
                          }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index === currentScreen ? 0.5 + featureIndex * 0.1 : 0
                          }}
                        >
                          {/* Bullet point */}
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                            index === currentScreen ? 'bg-purple-600' : 'bg-gray-400'
                          }`}></div>
                          <span className={`text-sm sm:text-base font-medium transition-all duration-300 ${
                            index === currentScreen ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Action Button - only show for current section */}
                    {index === currentScreen && (
                      <motion.button
                        className="mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Scroll to explore</div>
            <div className="w-1 h-6 sm:h-8 bg-gray-300 rounded-full mx-auto relative">
              <motion.div
                className="w-1 h-2 sm:h-3 bg-gray-800 rounded-full absolute top-0"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Original content wrapped in container */}
      <div ref={containerRef} className="bg-white text-gray-900">
              <div>
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y, opacity }}
          className="relative h-screen flex items-center justify-start bg-[#E1E1E1] pl-3 md:pl-15"
      >
          {/* Decorative overlay removed for flat color */}
        
        {/* Background Image Placeholder */}
          {/* <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-purple-100/50 to-purple-200/50 flex items-center justify-center">
            <span className="text-gray-500 text-xl">Hero Background Image</span>
          </div>
          </div> */}

          <Image
            src="/assets/app-hero.png"
            alt="Team brainstorming on mobile-app UI"
            fill
            className="object-cover opacity-100 absolute inset-0"
          />

          <div className="relative z-10 text-left px-0 w-full md:w-2/5">
          <motion.h1 
            ref={titleRef}
            className="text-8xl md:text-9xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
              <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
            MOBILE
              </span>
            <br />
              <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
              APPS
            </span>
          </motion.h1>
          
            <AnimatedParagraph
              text="When innovation meets functionality, Bytes Platform delivers cutting-edge mobile applications that transform ideas into powerful digital experiences, building on years of development expertise."
              className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed"
            />
        </div>
      </motion.section>

        {/* App Development Science Section */}
          <section className="py-32 px-6 bg-[#D6C3DF] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={containerVariants}
              className="text-center mb-20"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-section"
              >
                MOBILE APP
                <br />
                  <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  DEVELOPMENT
                </span>
              </motion.h2>
            </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="animate-section">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-600">How do we build mobile apps?</h3>
                    <AnimatedParagraph
                      text="Bytes Platform crafts native and cross-platform mobile applications using cutting-edge technologies like React Native, Flutter, and Swift/Kotlin. From concept to deployment, we create apps that deliver exceptional user experiences across iOS and Android platforms, ensuring seamless performance and intuitive design."
                      className="text-gray-600 text-base sm:text-lg leading-relaxed"
                    />
                </motion.div>

              {/* App Development Process Image */}
              <motion.div 
                variants={itemVariants}
                  className="relative rounded-2xl w-full aspect-[3/2] overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                  <Image
                    src="/assets/app-img-1.png"
                    alt="Mobile app development workflow"
                    fill
                    className="object-cover absolute inset-0"
                  />
                </motion.div>
            </motion.div>

            {/* Right Content - App Launch Visual */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="relative"
              >
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-0 w-64 sm:w-80 md:w-96 aspect-[2/3] flex items-center justify-center border border-purple-300/30 overflow-hidden">
                    <Image
                      src="/assets/app-img-2.png"
                      alt="Mobile app launch illustration"
                      width={1024}
                      height={1536}
                      className="object-contain w-full h-full"
                    />
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: [0.42, 0, 0.58, 1] as const
                  }}
                    className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-purple-300/30 rounded-full border border-purple-300/40"
                />
                
                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.42, 0, 0.58, 1] as const,
                    delay: 1
                  }}
                    className="absolute -bottom-6 -left-6 w-8 h-8 sm:w-12 sm:h-12 bg-purple-200/40 rounded-full border border-purple-300/40"
                />
              </motion.div>
            </div>
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

          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className={`feature-card group relative bg-white rounded-2xl p-8 border transition-all duration-500 shadow-sm cursor-pointer ${
                  selectedFeature === index 
                    ? 'border-purple-400 shadow-xl scale-105' 
                    : 'border-purple-100 hover:border-purple-300'
                }`}
                whileHover={{ 
                  scale: selectedFeature === index ? 1.05 : 1.02,
                  rotateY: selectedFeature === index ? 0 : 3,
                  z: 50
                }}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl transition-opacity duration-500 ${
                  selectedFeature === index ? 'opacity-15' : 'opacity-0 group-hover:opacity-10'
                }`} />
                
                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 flex items-center justify-center`}>
                    <div className="w-8 h-8 bg-white/20 rounded-lg" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-4 transition-all duration-300 ${
                    selectedFeature === index 
                      ? 'text-transparent bg-gradient-to-r bg-clip-text from-purple-600 to-purple-800'
                      : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-purple-800'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  {/* Basic description */}
                  <div className={selectedFeature === index ? 'hidden' : 'block'}>
                    <AnimatedParagraph
                      text={feature.description}
                      className="text-gray-600 leading-relaxed"
                    />
                    <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                      <span>Click to learn more</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Detailed description when expanded */}
                  <div className={selectedFeature === index ? 'block' : 'hidden'}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {feature.detailedDescription}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {feature.features.map((feat, featIndex) => (
                            <div key={featIndex} className="flex items-center text-sm text-gray-600">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-2 flex-shrink-0`} />
                              {feat}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center text-purple-600 text-sm font-medium">
                        <span>Click to collapse</span>
                        <svg className="w-4 h-4 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
        <section className="py-32 px-6 bg-[#D6C3DF]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20 animate-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Technology
              <br />
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                STACK
              </span>
            </h2>
              <AnimatedParagraph
                text="We leverage the latest technologies and frameworks to build robust, scalable, and high-performance mobile applications."
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { name: "React Native", category: "Cross-Platform", icon: "/assets/react-native-icon.png" },
                { name: "Flutter", category: "Cross-Platform", icon: "/assets/flutter-icon.png" },
                { name: "Swift/SwiftUI", category: "iOS Native", icon: "/assets/swift-icon.png" },
                { name: "Kotlin/Java", category: "Android Native", icon: "/assets/kotlin-icon.png" },
                { name: "Node.js", category: "Backend", icon: "/assets/nodejs-icon.png" },
                { name: "Firebase", category: "Backend", icon: "/assets/firebase-icon.png" },
                { name: "MongoDB", category: "Database", icon: "/assets/mongodb-icon.png" },
                { name: "AWS/Azure", category: "Cloud", icon: "/assets/aws-icon.png" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                  className="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                  <div className="w-12 h-12 rounded-lg mb-4 mx-auto overflow-hidden flex items-center justify-center bg-white shadow">
                    <Image
                      src={tech.icon}
                      alt={`${tech.name} icon`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-400 text-center">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="relative py-32 px-6 bg-[#E1E1E1] overflow-hidden">
          {/* Background image */}
          <Image
            src="/assets/app-img-3.png"
            alt="Mobile app showcase"
            fill
            className="object-cover absolute inset-0"
            priority
          />
          {/* Optional white overlay for readability */}
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
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </section>
    </div>
    </div>
  </>
  );
};

export default AppDevelopmentPage;