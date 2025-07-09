'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/sections/Navbar';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';

const IndustriesPage = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [animationData, setAnimationData] = useState(null);
  const [healthAnimationData, setHealthAnimationData] = useState(null);
  const [retailAnimationData, setRetailAnimationData] = useState(null);
  const [federalAnimationData, setFederalAnimationData] = useState(null);

  // Animated sections refs
  const heroRef = useRef<HTMLDivElement | null>(null);
  const fintechRef = useRef<HTMLDivElement | null>(null);
  const healthcareRef = useRef<HTMLDivElement | null>(null);
  const ecommerceRef = useRef<HTMLDivElement | null>(null);
  const educationRef = useRef<HTMLDivElement | null>(null);

  // Animation controls - removing once: true to allow re-triggering on reverse scroll
  const heroInView = useInView(heroRef, { amount: 0.3, once: true });
  const fintechInView = useInView(fintechRef, { amount: 0.3, once: true });
  const healthcareInView = useInView(healthcareRef, { amount: 0.3, once: true });
  const ecommerceInView = useInView(ecommerceRef, { amount: 0.3, once: true });
  const educationInView = useInView(educationRef, { amount: 0.3, once: true });

  // Separate state flags for animation triggers per section
  const [heroTriggered, setHeroTriggered] = useState(false);
  const [fintechTriggered, setFintechTriggered] = useState(false);
  const [healthcareTriggered, setHealthcareTriggered] = useState(false);
  const [ecommerceTriggered, setEcommerceTriggered] = useState(false);
  const [educationTriggered, setEducationTriggered] = useState(false);

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

  // Load animation data
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        // Load finance animation
        const financeData = await fetch('/assets/newimages/Animation - 1751914349014.json');
        const financeJsonData = await financeData.json();
        setAnimationData(financeJsonData);

        // Load health animation
        const healthData = await fetch('/assets/newimages/Animation - 1751915546890.json');
        const healthJsonData = await healthData.json();
        setHealthAnimationData(healthJsonData);

        // Load retail animation
        const retailData = await fetch('/assets/newimages/Animation - 1751922478340.json');
        const retailJsonData = await retailData.json();
        setRetailAnimationData(retailJsonData);

        // Load federal government animation
        const federalData = await fetch('/assets/newimages/Animation - 1751923093110.json');
        const federalJsonData = await federalData.json();
        setFederalAnimationData(federalJsonData);
      } catch (error) {
        console.error('Error loading animations:', error);
      }
    };
    loadAnimations();
  }, []);

  // Update individual animation flags when their section comes into view
  useEffect(() => {
    if (heroInView) setHeroTriggered(true);
  }, [heroInView]);

  useEffect(() => {
    if (fintechInView) setFintechTriggered(true);
  }, [fintechInView]);

  useEffect(() => {
    if (healthcareInView) setHealthcareTriggered(true);
  }, [healthcareInView]);

  useEffect(() => {
    if (ecommerceInView) setEcommerceTriggered(true);
  }, [ecommerceInView]);

  useEffect(() => {
    if (educationInView) setEducationTriggered(true);
  }, [educationInView]);

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
  // Animate heading only the first time its section scrolls into view
  const AnimatedHeader = ({ children, className, triggered, variants = headerVariants, ...props }: any) => (
    <motion.h1
      className={className}
      variants={variants}
      initial={false}
      animate={triggered ? "visible" : "hidden"}
      {...props}
    >
      {children}
    </motion.h1>
  );

  // Bullet list that animates exactly once when its parent section becomes visible
  const AnimatedBulletPoints = ({ points, className = "", bulletColor = "bg-yellow-400", triggered }: any) => (
    <motion.div
      className={`space-y-3 ${className}`}
      initial={false}
      animate={triggered ? "visible" : "hidden"}
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
            variants={{ hidden: { scale: 0, rotate: 0 }, visible: { scale: 1, rotate: 360 } }}
            transition={{
              delay: index * 0.2 + 0.5,
              duration: 0.6,
              type: "spring",
              stiffness: 150,
              damping: 12
            }}
          />
          <motion.span
            className="text-sm sm:text-base lg:text-lg"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
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
        initial={false}
        animate={heroTriggered ? "visible" : "hidden"}
        variants={staggerContainer}
        viewport={{ once: true }}
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
      <section ref={heroRef} className="min-h-screen flex items-center px-6 pt-12 md:pt-20 relative z-10">
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
            initial={false}
            animate={heroTriggered ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <HeroAnimatedText text="Industries We Serve" />
              <motion.div
                className="h-1 bg-[#010a14]"
                initial={{ width: 0 }}
                animate={heroTriggered ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p
              variants={paragraphVariants as any}
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white max-w-2xl md:max-w-3xl lg:max-w-4xl"
            >
              We deliver cutting-edge solutions across diverse industries, transforming businesses with innovative technology.
            </motion.p>

            <motion.div variants={paragraphVariants as any} className="flex items-center">
              <motion.button
                data-cta="true"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={heroTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                onClick={() => router.push('/contact')}
                className="text-base sm:text-lg font-semibold text-gray-900 bg-gradient-to-r from-emerald-300 to-sky-400 px-8 py-4 rounded-full shadow-lg hover:shadow-2xl focus:outline-none cursor-pointer transition-transform duration-300"
              >
                Explore our expertise
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={scaleIn as any}
            initial={false}
            animate={heroTriggered ? 'visible' : 'hidden'}
            className="relative mt-8 md:-mt-12 lg:-mt-16 md:-ml-8"
          >
            {/* Placeholder for industries image */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[500px] lg:h-[500px] mx-auto bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full flex items-center justify-center">
              <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#010a14] rounded-full flex items-center justify-center shadow-lg">
                <motion.div
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={heroTriggered ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
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
                className="text-gray-900 text-base sm:text-lg md:text-2xl font-bold"
                initial={{ opacity: 0, scale: 0 }}
                animate={heroTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                15+
              </motion.div>
              <motion.div
                className="text-[10px] sm:text-xs text-gray-900"
                initial={{ opacity: 0 }}
                animate={heroTriggered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                Industries served
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Federal Government Contractors Section */}
      <section ref={educationRef} className="min-h-screen flex items-center bg-white text-[#010a14] px-4 md:px-6 pt-24 md:pt-0 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial={false}
            animate={educationTriggered ? 'visible' : 'hidden'}
            className="space-y-6 order-1 lg:order-2"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                triggered={educationTriggered}
              >
                FEDERAL GOVERNMENT
                <br />
                CONTRACTORS
              </AnimatedHeader>
              <motion.div
                className="h-1 bg-gradient-to-r from-emerald-300 to-sky-400"
                initial={{ width: 0 }}
                animate={educationTriggered ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p
              variants={paragraphVariants as any}
              initial={false}
              animate={educationTriggered ? "visible" : "hidden"}
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
              bulletColor="bg-gradient-to-r from-emerald-300 to-sky-400"
              triggered={educationTriggered}
            />
          </motion.div>

          <motion.div
            variants={slideInRight as any}
            initial={false}
            animate={educationTriggered ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Federal Government Lottie animation */}
            <div className="relative w-96 h-96 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={educationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
                className="w-full h-full"
              >
                {federalAnimationData && (
                  <Lottie
                    animationData={federalAnimationData}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Retail Solutions Section */}
      <section ref={ecommerceRef} className="min-h-screen flex items-center bg-[#010a14] text-white px-6 pt-24 md:pt-0 relative scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInLeft as any}
            initial={false}
            animate={ecommerceTriggered ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-2"
          >
            {/* Retail Lottie animation */}
            <div className="relative w-96 h-96 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={ecommerceTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
                className="w-full h-full"
              >
                {retailAnimationData && (
                  <Lottie
                    animationData={retailAnimationData}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer as any}
            initial={false}
            animate={ecommerceTriggered ? 'visible' : 'hidden'}
            className="space-y-8 order-1 lg:order-1"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-4xl lg:text-6xl font-bold leading-none"
                triggered={ecommerceTriggered}
              >
                RETAIL
                <br />
                SOLUTIONS
              </AnimatedHeader>
              <motion.div
                className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                initial={{ width: 0 }}
                animate={ecommerceTriggered ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p
              variants={paragraphVariants as any}
              initial={false}
              animate={ecommerceTriggered ? "visible" : "hidden"}
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
              bulletColor="bg-gradient-to-r from-cyan-500 to-blue-600"
              triggered={ecommerceTriggered}
            />

            <motion.button
              data-cta="true"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={ecommerceTriggered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200 }}
              onClick={() => router.push('/contact')}
            >
              Start project
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Banking & Financial Sector Section */}
      <section ref={fintechRef} className="min-h-screen flex items-center bg-white text-[#010a14] px-6 pt-24 md:pt-0 relative scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInLeft as any}
            initial={false}
            animate={fintechTriggered ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >
            {/* Banking Lottie animation */}
            <div className="relative w-96 h-96 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={fintechTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
                className="w-full h-full"
              >
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer as any}
            initial={false}
            animate={fintechTriggered ? 'visible' : 'hidden'}
            className="space-y-8 order-1 lg:order-2"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-4xl lg:text-6xl font-bold leading-none"
                triggered={fintechTriggered}
              >
                BANKING &amp;
                <br />
                FINANCIAL SECTOR
              </AnimatedHeader>
              <motion.div
                className="h-1 bg-gradient-to-r from-emerald-300 to-sky-400"
                initial={{ width: 0 }}
                animate={fintechTriggered ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p
              variants={paragraphVariants as any}
              initial={false}
              animate={fintechTriggered ? "visible" : "hidden"}
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
              bulletColor="bg-gradient-to-r from-emerald-300 to-sky-400"
              triggered={fintechTriggered}
            />
          </motion.div>
        </div>
      </section>

      {/* Health Sector Section */}
      <section ref={healthcareRef} className="pt-24 md:pt-28 pb-12 bg-[#010a14] text-white px-6 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer as any}
            initial={false}
            animate={healthcareTriggered ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div variants={staggerContainer as any} className="space-y-6">
              <AnimatedHeader
                className="text-4xl lg:text-6xl font-bold leading-none"
                triggered={healthcareTriggered}
              >
                HEALTH SECTOR
              </AnimatedHeader>
              <motion.div
                className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={healthcareTriggered ? { width: "100%" } : { width: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p
              variants={paragraphVariants as any}
              initial={false}
              animate={healthcareTriggered ? "visible" : "hidden"}
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
                bulletColor="bg-gradient-to-r from-purple-500 to-pink-500"
                triggered={healthcareTriggered}
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={slideInRight as any}
            initial={false}
            animate={healthcareTriggered ? 'visible' : 'hidden'}
            className="relative order-2 lg:order-1"
          >

            {/* Healthcare Lottie animation */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={healthcareTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                className="w-full h-full"
              >
                {healthAnimationData && (
                  <Lottie
                    animationData={healthAnimationData}
                    loop={true}
                    autoplay={true}
                    className="w-full h-full"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-70 pointer-events-none"
          style={{ backgroundImage: "url('/assets/WebDev/buildwithus.png')" }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to revolutionize&nbsp;<span className="text-white">your sector?</span>
          </h2>
          <Link
            href="/contact"
            data-cta="true"
            className="inline-block px-10 py-4 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get&nbsp;In&nbsp;Touch
          </Link>
        </div>
      </section>

      {/* Footer is provided globally via RootLayout */}
    </div>

  );
};

export default IndustriesPage;