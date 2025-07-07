'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/sections/Navbar';
import { useRouter } from 'next/navigation';

const IndustriesPage = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animated sections refs
  const heroRef = useRef<HTMLDivElement | null>(null);
  const fintechRef = useRef<HTMLDivElement | null>(null);
  const healthcareRef = useRef<HTMLDivElement | null>(null);
  const ecommerceRef = useRef<HTMLDivElement | null>(null);
  const educationRef = useRef<HTMLDivElement | null>(null);

  // Animation controls - removing once: true to allow re-triggering on reverse scroll
  const heroInView = useInView(heroRef, { amount: 0.3 });
  const fintechInView = useInView(fintechRef, { amount: 0.3 });
  const healthcareInView = useInView(healthcareRef, { amount: 0.3 });
  const ecommerceInView = useInView(ecommerceRef, { amount: 0.3 });
  const educationInView = useInView(educationRef, { amount: 0.3 });

  // State to track if animations have been triggered
  const [animationsTriggered, setAnimationsTriggered] = useState({
    hero: false,
    fintech: false,
    healthcare: false,
    ecommerce: false,
    education: false
  });

  // Component to cycle words inside hero badge without re-rendering whole page
  const CycleWord: React.FC = () => {
    const words = ["FINANCE", "HEALTH", "RETAIL", "FEDERAL"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const id = setInterval(() => {
        setIndex((prev) => (prev + 1) % words.length);
      }, 2000);
      return () => clearInterval(id);
    }, []);

    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    );
  };

  // Update animation states when sections come into view
  useEffect(() => {
    if (heroInView) {
      setAnimationsTriggered(prev => ({ ...prev, hero: true }));
    } else {
      setAnimationsTriggered(prev => ({ ...prev, hero: false }));
    }
    if (fintechInView) {
      setAnimationsTriggered(prev => ({ ...prev, fintech: true }));
    } else {
      setAnimationsTriggered(prev => ({ ...prev, fintech: false }));
    }
    if (healthcareInView) {
      setAnimationsTriggered(prev => ({ ...prev, healthcare: true }));
    } else {
      setAnimationsTriggered(prev => ({ ...prev, healthcare: false }));
    }
    if (ecommerceInView) {
      setAnimationsTriggered(prev => ({ ...prev, ecommerce: true }));
    } else {
      setAnimationsTriggered(prev => ({ ...prev, ecommerce: false }));
    }
    if (educationInView) {
      setAnimationsTriggered(prev => ({ ...prev, education: true }));
    } else {
      setAnimationsTriggered(prev => ({ ...prev, education: false }));
    }
  }, [heroInView, fintechInView, healthcareInView, ecommerceInView, educationInView]);

  const StarField = () => {
    // Avoid rendering randomised stars on the server to prevent hydration mismatch
    const [stars, setStars] = useState<React.ReactElement[]>([]);

    useEffect(() => {
      const generated = Array.from({ length: 100 }, (_, i) => (
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
      setStars(generated);
    }, []);

    // Render nothing on the server / first client render
    if (stars.length === 0) return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars}
      </div>
    );
  };

  const GeometricShapes = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <StarField />
    </div>
  );

  // Enhanced Animation Variants
  const headerVariants: any = {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    },
  };

  const bulletPointVariants: any = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 120,
        damping: 20
      },
    }),
  };

  const paragraphVariants: any = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      },
    },
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const slideInLeft: any = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const slideInRight: any = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const scaleIn: any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Animated Text Components
  const AnimatedHeader = ({ children, className, variants = headerVariants, inView, ...props }: any) => (
    <motion.h1
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      {...props}
    >
      {children}
    </motion.h1>
  );

  const AnimatedBulletPoints = ({ points, className = "", inView, bulletColor = "bg-yellow-400" }: any) => (
    <motion.div
      className={`space-y-3 ${className}`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {points.map((point: string, index: number) => (
        <motion.div
          key={index}
          className="flex items-start gap-3"
          variants={bulletPointVariants}
          custom={index}
        >
          <motion.div
            className={`w-2 h-2 ${bulletColor} rounded-full mt-2 flex-shrink-0`}
            initial={{ scale: 0, rotate: 0 }}
            animate={inView ? { scale: 1, rotate: 360 } : { scale: 0, rotate: 0 }}
            transition={{ 
              delay: index * 0.2 + 0.5, 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          />
          <motion.span
            className="text-sm sm:text-base lg:text-lg"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
          >
            {point}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );

  const HeroAnimatedText = ({ text }: { text: string }) => {
    return (
      <motion.div
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none text-white font-bold tracking-wider uppercase"
        style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 700 }}
        initial="hidden"
        animate={animationsTriggered.hero ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div
          className="overflow-hidden"
          variants={{
            hidden: { y: 100, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
              }
            }
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: 100, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }
              }
            }}
          >
            {text}
          </motion.span>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-hidden relative flex flex-col">
      {/* Site-wide Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="order-0 min-h-screen flex items-center px-6 pt-12 md:pt-20 relative z-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/industry/hero.png"
            alt="Industry Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-[rgba(1,10,20,0.2)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={animationsTriggered.hero ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <HeroAnimatedText text="Industries We Serve" />
              <motion.div 
                className="h-1 bg-[#010a14]"
                initial={{ width: 0 }}
                animate={animationsTriggered.hero ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p 
              variants={paragraphVariants as any} 
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white max-w-2xl md:max-w-3xl lg:max-w-4xl"
            >
              We deliver cutting-edge solutions across diverse industries, transforming businesses with innovative technology.
            </motion.p>

            <motion.div variants={paragraphVariants as any} className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 bg-[#010a14] rounded-full flex items-center justify-center"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="text-white font-bold text-xl">▶</span>
              </motion.div>
              <motion.span 
                className="text-sm text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={animationsTriggered.hero ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                Explore our expertise
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={scaleIn as any}
            initial="hidden"
            animate={animationsTriggered.hero ? 'visible' : 'hidden'}
            className="relative mt-8 md:-mt-12 lg:-mt-16 md:-ml-8"
          >
            {/* Placeholder for industries image */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[500px] lg:h-[500px] mx-auto bg-white rounded-full flex items-center justify-center">
              <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#010a14] rounded-full flex items-center justify-center">
                <motion.div 
                  className="text-3xl sm:text-4xl md:text-6xl text-white font-bold flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={animationsTriggered.hero ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100 }}
                >
                  <CycleWord />
                </motion.div>
              </div>
            </div>

            <motion.div
              className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 bg-[rgba(255,255,255,0.8)] backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div 
                className="text-[#010a14] text-base sm:text-lg md:text-2xl font-bold"
                initial={{ opacity: 0, scale: 0 }}
                animate={animationsTriggered.hero ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                15+
              </motion.div>
              <motion.div 
                className="text-[10px] sm:text-xs text-[#010a14]"
                initial={{ opacity: 0 }}
                animate={animationsTriggered.hero ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                Industries served
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fintech Section */}
      <section ref={fintechRef} className="order-3 min-h-screen flex items-center bg-white text-[#010a14] px-6 pt-24 md:pt-0 relative scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInLeft as any}
            initial="hidden"
            animate={animationsTriggered.fintech ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Banking image */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] mx-auto">
              <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationsTriggered.fintech ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  className="w-full h-full"
                >
                  <img
                    src="/assets/money.jpg"
                    alt="Banking and Financial Services"
                    className="w-full h-full object-cover object-[60%_center] rounded-lg"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={animationsTriggered.fintech ? 'visible' : 'hidden'}
            className="space-y-8 order-1 lg:order-2"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-4xl lg:text-6xl font-bold leading-none"
                inView={animationsTriggered.fintech}
              >
                BANKING &amp;
                <br />
                FINANCIAL SECTOR
              </AnimatedHeader>
              <motion.div 
                className="h-1 bg-[#010a14]"
                initial={{ width: 0 }}
                animate={animationsTriggered.fintech ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p 
              variants={paragraphVariants as any} 
              initial="hidden"
              animate={animationsTriggered.fintech ? "visible" : "hidden"}
              className="text-lg text-[#010a14] max-w-md"
            >
              We specialize in secure, scalable digital solutions for modern banking and financial institutions.
            </motion.p>

            <AnimatedBulletPoints
              points={[
                "Empowering banks, fintechs, and investment firms with secure, scalable digital solutions",
                "Streamlining operations through intelligent automation and data-driven decision-making",
                "Enhancing customer engagement with seamless digital experiences",
                "Ensuring compliance and risk mitigation through robust security architectures"
              ]}
              className="text-[#010a14]"
              bulletColor="bg-[#010a14]"
              inView={animationsTriggered.fintech}
            />
          </motion.div>
        </div>
      </section>

      {/* Healthcare Section */}
      <section ref={healthcareRef} className="order-4 pt-24 md:pt-28 pb-12 bg-[#010a14] text-white px-6 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={animationsTriggered.healthcare ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-4xl lg:text-6xl font-bold leading-none"
                inView={animationsTriggered.healthcare}
              >
                HEALTH SECTOR
              </AnimatedHeader>
              <motion.div 
                className="h-1 bg-[#010a14]"
                initial={{ width: 0 }}
                animate={animationsTriggered.healthcare ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
            
            <motion.p 
              variants={paragraphVariants as any} 
              initial="hidden"
              animate={animationsTriggered.healthcare ? "visible" : "hidden"}
              className="text-lg text-white/90 max-w-lg"
            >
              We specialize in digital health solutions that enhance patient care and streamline medical operations.
            </motion.p>
            
            <motion.div variants={staggerContainer as any}>
              <AnimatedBulletPoints
                points={[
                  "Supporting patient-centric care through digital transformation",
                  "Developing HIPAA-compliant solutions for clinics, hospitals, and health systems",
                  "Improving health outcomes with data interoperability and AI-driven insights",
                  "Enhancing patient engagement via mobile apps and portals"
                ]}
                className="text-white/80"
                bulletColor="bg-white"
                inView={animationsTriggered.healthcare}
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={slideInRight as any}
            initial="hidden"
            animate={animationsTriggered.healthcare ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Placeholder for healthcare image */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] mx-auto">
              <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationsTriggered.healthcare ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  className="w-full h-full"
                >
                  <img
                    src="/assets/olga-guryanova-tMFeatBSS4s-unsplash.jpg"
                    alt="Healthcare"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* E-commerce Section */}
      <section ref={ecommerceRef} className="order-2 min-h-screen flex items-center bg-[#010a14] text-white px-6 pt-24 md:pt-0 relative scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInLeft as any}
            initial="hidden"
            animate={animationsTriggered.ecommerce ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-2"
          >
            {/* Placeholder for e-commerce mockup */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] mx-auto">
              <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationsTriggered.ecommerce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  className="w-full h-full"
                >
                  <img
                    src="/assets/pexels-pixabay-264502.jpg"
                    alt="Retail Solutions"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-[#010a14] text-white px-4 py-2 rounded-lg text-sm"
                animate={animationsTriggered.ecommerce ? { x: [0, 10, 0], transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } } : { x: 0 }}
              >
                <div className="text-white font-bold">SHOP</div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={animationsTriggered.ecommerce ? 'visible' : 'hidden'}
            className="space-y-8 order-1 lg:order-1"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-4xl lg:text-6xl font-bold leading-none"
                inView={animationsTriggered.ecommerce}
              >
                RETAIL
                <br />
                SOLUTIONS
              </AnimatedHeader>
              <motion.div 
                className="h-1 bg-[#010a14]"
                initial={{ width: 0 }}
                animate={animationsTriggered.ecommerce ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
            
            <motion.p 
              variants={paragraphVariants as any} 
              initial="hidden"
              animate={animationsTriggered.ecommerce ? "visible" : "hidden"}
              className="text-lg text-white/90 max-w-md"
            >
              We specialize in comprehensive retail solutions that boost sales and elevate the customer experience.
            </motion.p>
            
            <AnimatedBulletPoints
              points={[
                "Driving omnichannel retail strategies for better customer experiences",
                "Leveraging data analytics to optimize inventory and personalization",
                "Enhancing e-commerce platforms with fast, responsive interfaces",
                "Enabling supply chain visibility and operational efficiency"
              ]}
              className="text-white/80"
              bulletColor="bg-white"
              inView={animationsTriggered.ecommerce}
            />
            
            <motion.button
              className="bg-white text-[#010a14] px-8 py-3 rounded font-medium"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={animationsTriggered.ecommerce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200 }}
              onClick={() => router.push('/contact')}
            >
              Start project
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section ref={educationRef} className="order-1 min-h-screen flex items-center bg-white text-[#010a14] px-4 md:px-6 pt-24 md:pt-0 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial="hidden"
            animate={animationsTriggered.education ? 'visible' : 'hidden'}
            className="space-y-6 order-1 lg:order-2"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                inView={animationsTriggered.education}
              >
                FEDERAL GOVERNMENT
                <br />
                CONTRACTORS
              </AnimatedHeader>
              <motion.div 
                className="h-1 bg-[#010a14]"
                initial={{ width: 0 }}
                animate={animationsTriggered.education ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
            
            <motion.p 
              variants={paragraphVariants as any} 
              initial="hidden"
              animate={animationsTriggered.education ? "visible" : "hidden"}
              className="text-base md:text-lg text-[#010a14] max-w-2xl"
            >
              We specialize in delivering innovative digital solutions tailored specifically for federal and state government contractors.
            </motion.p>
            
            <AnimatedBulletPoints
              points={[
                "Delivering secure, compliant technology for federal and state agencies",
                "Supporting digital modernization initiatives across public services",
                "Improving efficiency with workflow automation and cloud infrastructure",
                "Partnering with government contractors to meet mission-critical needs"
              ]}
              className="text-[#010a14] text-sm md:text-base"
              bulletColor="bg-[#010a14]"
              inView={animationsTriggered.education}
            />
          </motion.div>
          
          <motion.div
            variants={slideInRight as any}
            initial="hidden"
            animate={animationsTriggered.education ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Placeholder for federal government image */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-[350px] md:h-[350px] mx-auto">
              <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationsTriggered.education ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src="/assets/federal-govt.webp"
                    alt="Federal Government"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer is provided globally via RootLayout */}
    </div>
  );
};

export default IndustriesPage;