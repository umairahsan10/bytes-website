'use client';

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Header } from '@/sections/Navbar';
import { useRouter } from 'next/navigation';
import FAQ from '@/components/FAQ-SEO';


// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// SEO Graph Animation Component
const SEOGraphAnimation: React.FC = () => {
  const graphRef = useRef<SVGSVGElement>(null);
  //const lineRef = useRef<SVGPathElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current || !graphContainerRef.current) return;

    // Animate graph bars first
    const bars = graphRef.current.querySelectorAll('.graph-bar');
    gsap.fromTo(bars,
      {
        scaleY: 0,
        opacity: 0
      },
      {
        scaleY: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5
      }
    );





  }, []);

  return (
    <div ref={graphContainerRef} className="absolute inset-0 flex items-center justify-center opacity-20">
      <svg
        ref={graphRef}
        width="100%"
        height="400"
        viewBox="0 0 800 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          </pattern>
          {/* Gradient for the line */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#1d4ed8" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Graph bars (competition) */}
        <rect className="graph-bar" x="50" y="300" width="40" height="80" fill="#f3f4f6" opacity="0.8" />
        <rect className="graph-bar" x="120" y="280" width="40" height="100" fill="#f3f4f6" opacity="0.8" />
        <rect className="graph-bar" x="190" y="320" width="40" height="60" fill="#f3f4f6" opacity="0.8" />
        <rect className="graph-bar" x="260" y="290" width="40" height="90" fill="#f3f4f6" opacity="0.8" />
        <rect className="graph-bar" x="330" y="310" width="40" height="70" fill="#f3f4f6" opacity="0.8" />
        <rect className="graph-bar" x="400" y="270" width="40" height="110" fill="#f3f4f6" opacity="0.8" />
        <rect className="graph-bar" x="470" y="300" width="40" height="80" fill="#f3f4f6" opacity="0.8" />


      </svg>
    </div>
  );
};



const SEOPage: React.FC = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const stackAreaRef = useRef<HTMLDivElement>(null);
  const tilesSectionRef = useRef<HTMLDivElement>(null);
  const tilesInnerRef = useRef<HTMLDivElement>(null);

  const heroControls = useAnimation();
  const aboutControls = useAnimation();

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible");
    }
  }, [heroControls, heroInView]);

  useEffect(() => {
    if (aboutInView) {
      aboutControls.start("visible");
    }
  }, [aboutControls, aboutInView]);

  useEffect(() => {
    // GSAP animations for text reveals
    const tl = gsap.timeline();

    tl.from(".hero-title", {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      delay: 0.5
    })
      .from(".hero-subtitle", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power2.out"
      }, "-=0.5");



    return () => {
      tl.kill();
    };
  }, []);

  /* ------- stacked cards scroll logic with ScrollTrigger pin ------- */
  useEffect(() => {
    const stackArea = stackAreaRef.current;
    if (!stackArea) return;

    const cards = Array.from(
      stackArea.querySelectorAll<HTMLDivElement>(".card")
    );

    const rotateCards = () => {
      let angle = 0;
      cards.forEach((card, index) => {
        if (card.classList.contains("away")) {
          card.style.transform = `translateY(-150vh) rotate(-48deg)`;
        } else {
          card.style.transform = `rotate(${angle}deg)`;
          angle -= 10;
          card.style.zIndex = `${cards.length - index}`;
        }
      });
    };

    rotateCards();

    // Pin the stack section until all cards are "away"
    const trigger = ScrollTrigger.create({
      trigger: stackArea,
      start: "top top",
      end: () => `+=${cards.length * window.innerHeight}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const awayCount = Math.floor(self.progress * cards.length);

        cards.forEach((card, i) => {
          if (i < awayCount) {
            card.classList.add("away");
          } else {
            card.classList.remove("away");
          }
        });

        rotateCards();
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  /* ------- Horizontal tiles scroll section --------*/
  useEffect(() => {
    const section = tilesSectionRef.current;
    const inner = tilesInnerRef.current;
    if (!section || !inner) return;

    const totalTiles = inner.children.length;

    gsap.to(inner, {
      xPercent: -(totalTiles - 1) * 100,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalTiles * window.innerHeight}`,
        scrub: true,
        pin: true,
        snap: 1 / (totalTiles - 1),
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const wordContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const wordVariant = {
    hidden: { opacity: 0, y: `0.25em` },
    visible: { opacity: 1, y: 0 }
  };

  const charContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const charVariant = {
    hidden: { opacity: 0, y: `0.5em` },
    visible: { opacity: 1, y: 0 }
  };

  interface AWProps {
    text: string;
    className?: string;
    immediate?: boolean; // if true, animates on mount
    amount?: number; // viewport amount
  }

  const AnimatedWords: React.FC<AWProps> = ({ text, className = "", immediate = false, amount = 0.5 }) => {
    const words = text.split(" ");
    const commonProps = {
      variants: wordContainer,
      initial: "hidden",
    } as const;

    return immediate ? (
      <motion.span {...commonProps} animate="visible" className={className + " inline-block"}>
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariant} className="inline-block mr-1">
            {word}
          </motion.span>
        ))}
      </motion.span>
    ) : (
      <motion.span
        {...commonProps}
        whileInView="visible"
        viewport={{ once: false, amount }}
        className={className + " inline-block"}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariant} className="inline-block mr-1">
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  const services = [
    {
      title: "Industry-Specific Keyword Research",
      description:
        "Local SEO to dominate your city or region, and National & global SEO strategies to scale your reach.",
      features: [
        "Competitor & SERP analysis",
        "High-value, long-tail terms",
        "Search-volume & intent mapping",
      ],
    },
    {
      title: "Technical SEO Audits & Performance Cleanup",
      description:
        "Eliminate crawl errors, boost Core Web Vitals and unlock site speed for higher rankings.",
      features: [
        "Site speed optimisation",
        "Mobile responsiveness",
        "Structured data & schema",
      ],
    },
    {
      title: "On-Page SEO & Off-Page SEO Strategies",
      description:
        "Conversion-optimized meta titles and descriptions that drive clicks",
      features: [
        "Content planning & optimisation",
        "Authority-building backlinks",
        "Local & global targeting",
      ],
    },
  ];

  const tiles = [
    {
      title: "Tailored Keyword Plans",
      subtitle: "That Bring Buying Intent",
      description: [
        "Industry-specific keyword research and analysis",
        "Competitor and SERP analysis for market insights",
        "High-converting long-tail keyword identification",
        "Buyer intent mapping and targeting strategies",
        "Data-driven approach to keyword selection"
      ]
    },
    {
      title: "SEO-Optimised Content",
      subtitle: "That Ranks & Converts",
      description: [
        "Content strategy aligned with search intent",
        "Blog posts and product page optimization",
        "Natural keyword integration and user engagement",
        "Answer-focused content for user queries",
        "Conversion-optimized copywriting techniques"
      ]
    },
    {
      title: "Technical Site Audits",
      subtitle: "And Full Optimisation",
      description: [
        "Comprehensive technical SEO analysis",
        "Core Web Vitals optimization and improvement",
        "Mobile-first responsive design fixes",
        "Crawl error identification and resolution",
        "Site speed and performance optimization"
      ]
    },
    {
      title: "Weekly Reporting ⭐",
      subtitle: "With Real Growth Metrics",
      description: [
        "Detailed keyword ranking tracking",
        "Organic traffic growth analysis",
        "Conversion rate and ROI measurement",
        "Competitive performance monitoring",
        "Actionable insights and recommendations"
      ]
    },
    {
      title: "Ongoing SEO Management",
      subtitle: "Content Support & Backlink Building",
      description: [
        "Continuous SEO strategy optimization",
        "Regular content updates and maintenance",
        "Algorithm change adaptation",
        "Performance monitoring and adjustments",
        "Long-term ranking improvement focus"
      ]
    },
    {
      title: "Local SEO Optimization",
      subtitle: "For Geographic Targeting",
      description: [
        "Google My Business optimization and management",
        "Local keyword research and targeting",
        "Citation building and consistency management",
        "Local review management and reputation building",
        "Location-based content and landing pages"
      ]
    },
  ];

  const cardColors: string[] = [];

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-25 overflow-hidden">
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 border border-[#010a14]/10 rotate-45"
            animate={{
              y: [0, -30, 0],
              rotate: [45, 50, 45],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-40 right-20 w-24 h-24 border border-[#010a14]/15 rounded-full"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-16 h-16 border border-[#010a14]/8 rotate-12"
            animate={{
              x: [0, 15, 0],
              rotate: [12, 15, 12],
              opacity: [0.08, 0.12, 0.08]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Additional floating elements */}
          <motion.div
            className="absolute top-1/4 right-1/6 w-8 h-8 border border-[#010a14]/12 rounded-full"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.15, 0.08]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/6 w-12 h-12 border border-[#010a14]/10 rotate-30"
            animate={{
              y: [0, 25, 0],
              rotate: [30, 35, 30],
              opacity: [0.06, 0.12, 0.06]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(1, 10, 20, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(1, 10, 20, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-[#010a14]/5 to-transparent"
            animate={{
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* 4:3 Landscape Bar Graph Container */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
          <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
            {/* Bars Container */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-full">
              <div className="flex items-end space-x-0.5 sm:space-x-1 md:space-x-1.5 lg:space-x-2 xl:space-x-3 w-full h-full px-1 sm:px-2 md:px-3 lg:px-4">
                {/* Bar 1 - Shortest */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "20%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/20 via-[#010a14]/15 to-[#010a14]/5" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/30 to-transparent"
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>

                {/* Bar 2 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "28%" }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/25 via-[#010a14]/20 to-[#010a14]/10" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/35 to-transparent"
                    animate={{
                      y: [0, -25, 0],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </motion.div>

                {/* Bar 3 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "34%" }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/30 via-[#010a14]/25 to-[#010a14]/15" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/40 to-transparent"
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </motion.div>

                {/* Bar 4 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "32%" }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/35 via-[#010a14]/30 to-[#010a14]/20" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/45 to-transparent"
                    animate={{
                      y: [0, -35, 0],
                      opacity: [0.6, 0.9, 0.6]
                    }}
                    transition={{
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                </motion.div>

                {/* Bar 5 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "30%" }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/40 via-[#010a14]/35 to-[#010a14]/25" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/50 to-transparent"
                    animate={{
                      y: [0, -40, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </motion.div>

                {/* Bar 6 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "33%" }}
                  transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/45 via-[#010a14]/40 to-[#010a14]/30" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/55 to-transparent"
                    animate={{
                      y: [0, -35, 0],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                </motion.div>

                {/* Bar 7 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "38%" }}
                  transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/50 via-[#010a14]/45 to-[#010a14]/35" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/60 to-transparent"
                    animate={{
                      y: [0, -45, 0],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.4
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </motion.div>

                {/* Bar 8 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "45%" }}
                  transition={{ duration: 1.5, delay: 1.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/55 via-[#010a14]/50 to-[#010a14]/40" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/65 to-transparent"
                    animate={{
                      y: [0, -40, 0],
                      opacity: [1, 1, 1]
                    }}
                    transition={{
                      duration: 4.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.6
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                </motion.div>

                {/* Bar 9 */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "52%" }}
                  transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/60 via-[#010a14]/55 to-[#010a14]/45" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/70 to-transparent"
                    animate={{
                      y: [0, -50, 0],
                      opacity: [1, 1, 1]
                    }}
                    transition={{
                      duration: 4.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.8
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </motion.div>

                {/* Bar 10 - Tallest */}
                <motion.div
                  className="relative flex-1 rounded-t-sm sm:rounded-t-md md:rounded-t-lg overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "55%" }}
                  transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010a14]/65 via-[#010a14]/60 to-[#010a14]/50" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#010a14]/75 to-transparent"
                    animate={{
                      y: [0, -55, 0],
                      opacity: [1, 1, 1]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/65 to-transparent" />
                </motion.div>
              </div>

              {/* Animated Line and Moving Arrowhead Overlay */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 900 400"
                className="w-full h-full absolute inset-0 pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Path for the animated line (flows above bars) */}
                <motion.path
                  id="hero-curve"
                  d="M 50 380 Q 150 260 300 300 Q 450 340 600 240 Q 750 140 850 140"
                  stroke="#010a14"
                  strokeWidth="7"
                  strokeOpacity={0.3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 2.2, ease: 'easeInOut' }}
                />
                {/* Animated arrowhead at the start, moving along the path */}
                <motion.circle
                  r="16"
                  fill="#010a14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  style={{ originX: '50%', originY: '50%' }}
                >
                  <animateMotion
                    dur="1.5s"
                    begin="2.2s"
                    fill="freeze"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                    repeatCount="1"
                    path="M 50 380 Q 150 260 300 300 Q 450 340 600 240 Q 750 140 850 140"
                  />
                </motion.circle>
                {/* Glowing points at bar tops */}
                {[
                  { x: 50, y: 380 },    // Start
                  { x: 140, y: 310 },  // Q1
                  { x: 230, y: 291 },   // Q2
                  { x: 318, y: 304 },  // Q3
                  { x: 404, y: 312 },  // Q4
                  { x: 495, y: 292 },   // Q5
                  { x: 581, y: 252 },   // Q6
                  { x: 670, y: 197 },   // Q7
                  { x: 760, y: 157 },   // Q8
                  { x: 850, y: 140 }     // End
                ].map((pt, i) => (
                  <motion.circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill="#010a14"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    transition={{ delay: 2.2 + i * 0.18 }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>



        {/* Floating Data Points */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Data point 1 */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#010a14]/40 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          {/* Data point 2 */}
          <motion.div
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#010a14]/50 rounded-full"
            animate={{
              y: [0, -15, 0],
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          {/* Data point 3 */}
          <motion.div
            className="absolute top-1/2 left-1/3 w-1 h-1 bg-[#010a14]/60 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.4, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
            }}
          />
        </div>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d="M 20% 60% Q 40% 40% 60% 30% T 80% 20%"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, delay: 2.5 }}
          />
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#010a14" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#010a14" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#010a14" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-black">
          {/* Stunning SEO Icon */}
          <motion.div
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative inline-block">
              {/* Main Icon Container */}
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-[#010a14] to-[#1a365d] rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* SEO Text */}
                <span className="text-2xl font-bold text-white z-10 tracking-wider">SEO</span>

                {/* Animated Background Elements */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Corner Accents */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full" />
              </motion.div>

              {/* Floating Particles */}
              <motion.div
                className="absolute -top-2 -right-2 w-2 h-2 bg-[#010a14] rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#010a14] rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            className="hero-title text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight pb-2 text-[#010a14] relative"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Search Engine Optimization
          </motion.h1>

          <div className="relative mb-6">
            {/* Light background for subtitle */}
            <div className="absolute inset-0 bg-white/15 backdrop-blur-[0.05px] rounded-xl -m-1 -p-1" />
            <AnimatedWords text="If You're Not Ranking, You're Bleeding Revenue." immediate amount={0.1} className="hero-subtitle text-xl md:text-2xl text-[#010a14] max-w-3xl mx-auto leading-relaxed font-light tracking-wide relative z-10" />
          </div>

          <div className="relative mb-8">
            {/* Light background for description */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.05px] rounded-xl -m-1 -p-1" />
            <AnimatedWords text="At Bytes Platform, we don’t just improve your SEO rankings — we drive laser-targeted organic traffic that converts into real business growth." immediate amount={0.1} className="text-lg md:text-xl text-[#010a14] max-w-4xl mx-auto leading-relaxed font-medium tracking-wide relative z-10" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#010a14] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#010a14] rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stacked Cards Section (duplicate copy with scroll lock) */}
      <section ref={stackAreaRef} className="stack-area flex flex-col lg:flex-row relative w-full bg-[#010a14] text-white">
        {/* Left copy */}
        <div className="left flex flex-col items-center justify-center lg:sticky top-0 lg:h-screen w-full lg:basis-1/2 p-6">
          <motion.h2
            className="title text-5xl font-bold leading-tight text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <AnimatedWords text="We  Help  You" className="block bg-gradient-to-r from-blue-500 via-blue-25 to-white text-transparent bg-clip-text" />
            <br />
            <AnimatedWords text="Rank  for  What Matters" className="block bg-gradient-to-r from-blue-500 via-blue-25 to-white text-transparent bg-clip-text" />
          </motion.h2>
          <motion.div
            className="sub-title text-base mt-6 max-w-sm text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <AnimatedWords text="Every day, potential customers search Google for what you offer — but if you're not on Page 1 of search results, you're missing out on qualified leads, sales, and opportunities.If you're invisible online, you're losing clicks, customers, and cash to your competitors." className="inline text-blue-200" />
          </motion.div>
        </div>
        
        {/* Right stacked cards */}
        <div className="right w-full lg:basis-1/2 lg:h-screen lg:sticky top-0">
          <div className="sp-cards flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
            {services.slice(0, 4).map((service, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  background: 'linear-gradient(135deg, #010a14 0%, #1a365d 50%, #010a14 100%)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <div className="sub text-xl font-semibold mb-3 text-blue-200">
                  {service.title}
                </div>
                <div className="content text-3xl font-bold leading-tight text-blue-100 flex-1 flex items-center">
                  {service.description}
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inline styles to replicate original demo */}
        <style jsx global>{`
          .stack-area {
            height: 100vh;
          }
          .stack-area .left .title {
            width: 420px;
          }
          .stack-area .left .sub-title {
            width: 420px;
          }
          .stack-area .card {
            width: 350px;
            height: 350px;
            border-radius: 25px;
            margin-bottom: 10px;
            position: absolute;
            top: calc(50% - 175px);
            left: calc(50% - 175px);
            transition: 0.5s ease-in-out;
            box-sizing: border-box;
            padding: 35px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          
          /* Responsive card sizing for wider screens when cards are away (at bottom) */
          @media (min-width: 1440px) {
            .stack-area .card.away {
              width: 300px;
              height: 300px;
              top: calc(50% - 150px);
              left: calc(50% - 150px);
              padding: 30px;
            }
          }
          
          @media (min-width: 1920px) {
            .stack-area .card.away {
              width: 280px;
              height: 280px;
              top: calc(50% - 140px);
              left: calc(50% - 140px);
              padding: 25px;
            }
          }
          
          @media (min-width: 2560px) {
            .stack-area .card.away {
              width: 250px;
              height: 250px;
              top: calc(50% - 125px);
              left: calc(50% - 125px);
              padding: 20px;
            }
          }
          .stack-area .card .content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            text-align: left;
          }
          
          /* Responsive text scaling for wider screens when cards are away */
          @media (min-width: 1440px) {
            .stack-area .card.away .sub {
              font-size: 18px !important;
            }
            .stack-area .card.away .content {
              font-size: 26px !important;
            }
          }
          
          @media (min-width: 1920px) {
            .stack-area .card.away .sub {
              font-size: 16px !important;
            }
            .stack-area .card.away .content {
              font-size: 24px !important;
            }
          }
          
          @media (min-width: 2560px) {
            .stack-area .card.away .sub {
              font-size: 14px !important;
            }
            .stack-area .card.away .content {
              font-size: 22px !important;
            }
          }
          .stack-area .away {
            transform-origin: bottom left;
          }
          
          /* Responsive styles for sp-cards div */
          .sp-cards {
            width: 100%;
            height: 100%;
          }
          
          @media (max-width: 1023px) {
            .sp-cards {
              transform: scale(0.6);
              margin-top: 80px;
            }
          }
          
          @media (max-width: 767px) {
            .sp-cards {
              transform: scale(0.8);
              margin-top: 200px;
            }
          }
          
          @media (max-width: 480px) {
            .sp-cards {
              transform: scale(0.9);
              margin-top: 130px;
            }
          }
          
          @media (max-width: 375px) {
            .sp-cards {
              transform: scale(0.6);
              margin-top: 120px;
              padding-bottom: -200px;
              margin-bottom: -300px;
            }
          }
          
          @media (max-width: 320px) {
            .sp-cards {
              transform: scale(0.5);
            }
          }
          @media (max-width: 1023px) {
            .stack-area .card {
              width: 350px;
              height: 350px;
              top: calc(60% - 175px);
              left: calc(50% - 175px);
              padding: 35px;
            }
            .stack-area .card.away {
              width: 300px;
              height: 300px;
              top: calc(60% - 150px);
              left: calc(50% - 150px);
              padding: 30px;
            }
            .stack-area .card.away .sub {
              font-size: 18px !important;
            }
            .stack-area .card.away .content {
              font-size: 26px !important;
            }
          }
          @media (max-width: 767px) {
            .stack-area .card {
              width: 350px;
              height: 350px;
              top: calc(65% - 175px);
              left: calc(50% - 175px);
              padding: 35px;
            }
            .stack-area .card.away {
              width: 280px;
              height: 280px;
              top: calc(65% - 140px);
              left: calc(50% - 140px);
              padding: 25px;
            }
            .stack-area .card.away .sub {
              font-size: 16px !important;
            }
            .stack-area .card.away .content {
              font-size: 24px !important;
            }
          }
          @media (max-width: 480px) {
            .stack-area .card {
              width: 350px;
              height: 350px;
              top: calc(70% - 175px);
              left: calc(50% - 175px);
              padding: 35px;
            }
            .stack-area .card.away {
              width: 250px;
              height: 250px;
              top: calc(70% - 125px);
              left: calc(50% - 125px);
              padding: 20px;
            }
            .stack-area .card.away .sub {
              font-size: 14px !important;
            }
            .stack-area .card.away .content {
              font-size: 22px !important;
            }
          }
        `}</style>
      </section>

      {/* Services Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#010a14] mb-6">
              Our <span className="bg-gradient-to-r from-[#010a14] via-[#1a365d] to-[#010a14] bg-clip-text text-transparent">SEO Services</span>
            </h2>
            <p className="text-xl text-[#1a365d] max-w-3xl mx-auto">
              Comprehensive search engine optimization strategies designed to boost your rankings and drive sustainable growth
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiles.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-blue-200 via-blue-25 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-blue-200"
              >
                {/* Service Icon */}
                {/* <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-[#010a14] to-[#1a365d] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div> */}

                {/* Service Content */}
                <div className="p-8 pt-16">
                  {/* Title */}
                  <motion.h3
                    className="text-2xl font-bold text-[#010a14] mb-3 group-hover:text-[#1a365d] transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {service.title}
                  </motion.h3>

                  {/* Subtitle */}
                  <motion.p
                    className="text-[#1a365d] font-semibold mb-6 text-lg bg-gradient-to-r from-[#010a14] to-[#1a365d] bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {service.subtitle}
                  </motion.p>

                  {/* Features List */}
                  <motion.ul
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {service.description.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + featureIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start text-[#2d3748]"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-[#010a14] to-[#1a365d] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#010a14]/0 to-[#1a365d]/0 group-hover:from-[#010a14]/5 group-hover:to-[#1a365d]/10 transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              data-cta="true"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-[#010a14] to-[#1a365d] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your SEO Journey
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-[#010a14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={aboutControls}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-left px-2">
                <span className="bg-gradient-to-r from-blue-200 via-blue-25 to-white bg-clip-text text-transparent">Your Competitors Are Stealing Your Customers</span>
              </h2>
              <AnimatedWords text="Your competitors are showing up first — not because they’re better, but because they’re optimized for search engines. If your website isn’t ranking for custom, high-converting keywords, you’re handing over your leads and sales to them. We help you take back your market share." className="text-lg sm:text-xl leading-relaxed px-2 text-blue-200" />
              <AnimatedWords text="Stop being invisible. Start ranking and turning visitors into customers." className="text-base sm:text-lg leading-relaxed px-2 text-blue-100" />
              <motion.button
                data-cta="true"
                className="bg-gradient-to-r from-blue-200 via-blue-25 to-white text-[#010a14] px-10 py-4 rounded-xl font-semibold tracking-wide transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
              >
                Book Your Free SEO Audit
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              {/* Floating container for the image */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/assets/seo-img-1.webp"
                    alt="SEO Strategy"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-blue-200/30 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 border border-blue-25/20 rotate-45" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full flex flex-col items-center justify-center py-0">
        <FAQ />
      </section>

      {/* CTA Section */}
      <section
        className="relative py-20 text-black bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/assets/seo-handshake.webp')" }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[#0a1c37] via-[#11254b] to-[#17326b] bg-clip-text text-transparent drop-shadow-md">
                Let Google Bring You Business — On Autopilot.
              </span>
            </h2>
            <p className="text-xl font-semibold text-[#ffffff] sm:text-lg text-white mb-5 max-w-3xl mx-auto px-4">
            Stop chasing customers. With SEO done right, your ideal clients will find you — every hour of every day. We make your website your best salesperson, working 24/7.
            </p>
            <div className="flex justify-center">
              <motion.button
                data-cta="true"
                className="bg-gradient-to-r from-[#010a14] to-[#1a365d] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
              >
                START YOUR PROJECT
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SEOPage;