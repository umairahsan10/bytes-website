"use client";

import { Header } from "@/sections/Navbar";
import ZoomParallax from "@/components/ZoomParallax";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ContactSection } from "@/sections/Contact";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, animate, useInView } from "framer-motion";

// Animated counter component
function Counter({ from = 0, to, duration = 2, className = "" }) {
  const count = useMotionValue(from);
  const nodeRef = useRef(null);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (nodeRef.current) nodeRef.current.textContent = Math.round(latest).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [to]);

  return <span ref={nodeRef} className={className}></span>;
}

function CountUp({ end, duration = 2, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated && isInView && ref.current) {
      setHasAnimated(true);
      let start = 0;
      const increment = end / (duration * 60);
      function step() {
        start += increment;
        if (start >= end) start = end;
        if (ref.current) {
          ref.current.textContent = `${Math.round(start).toLocaleString()}${suffix}`;
        }
        if (start < end) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }, [isInView]);

  return (
    <span ref={ref} className="inline-block">0{suffix}</span>
  );
}

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Custom animation variants
  const slideInLeft = {
    hidden: { opacity: 0, x: -100, rotateY: -15 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.5 }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100, rotateY: 15 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: { 
      opacity: 0, 
      x: 50,
      transition: { duration: 0.5 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: 30,
      transition: { duration: 0.4 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8, rotateZ: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateZ: 0,
      transition: { duration: 0.6, ease: "backOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const rotateIn = {
    hidden: { opacity: 0, rotateX: 90, y: 50 },
    visible: { 
      opacity: 1, 
      rotateX: 0, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      rotateX: -30,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <main className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
      <Header />
      
      {/* Parallax image gallery */}
      <motion.div style={{ scale, opacity }}>
        <ZoomParallax />
      </motion.div>

      {/* About Content Section */}
      <section id="about-us" className="relative">
        
        {/* Enhanced Floating Images with Parallax - Updated for white theme */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-20 -right-10 w-80 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl backdrop-blur-sm border border-purple-200/30"
            animate={{ 
              rotate: [12, 8, 12],
              y: [0, -20, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-purple-300 rounded-3xl opacity-20"></div>
          </motion.div>
          
          <motion.div 
            className="absolute top-[500px] -left-16 w-64 h-48 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-2xl backdrop-blur-sm border border-emerald-200/30"
            animate={{ 
              rotate: [-6, 2, -6],
              x: [0, 30, 0],
              scale: [1, 0.95, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-emerald-200 to-cyan-300 rounded-2xl opacity-25"></div>
          </motion.div>
          
          <motion.div 
            className="absolute top-[800px] right-4 w-72 h-56 bg-gradient-to-tl from-indigo-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-indigo-200/30"
            animate={{ 
              rotate: [-12, -6, -12],
              y: [0, 25, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          >
            <div className="w-full h-full bg-gradient-to-tl from-indigo-200 to-purple-300 rounded-2xl opacity-20"></div>
          </motion.div>
        </div>

        {/* Hero Section - Full Width - Updated for white theme */}
        <div className="w-full px-4 py-20">
          <motion.div 
            className="text-center space-y-8 max-w-6xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-100px" }}
          >
            <div className="inline-block">
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                About Bytes Platform
              </motion.h1>
              <motion.div 
                className="h-2 w-48 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 mx-auto mt-6 rounded-full"
                animate={{ 
                  scaleX: [0.5, 1.2, 0.5],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
            <motion.p 
              className="text-2xl md:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Your full-spectrum digital transformation partner, engineering tomorrow's most profitable brands with cutting-edge solutions that scale.
            </motion.p>
          </motion.div>
        </div>

        {/* Core Services - Asymmetric Layout */}
        <div className="w-full space-y-32 py-20">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-20"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-50px" }}
          >
            What We Engineer
          </motion.h2>
          
          {/* Digital Experiences - Left Aligned */}
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl">
              <motion.div 
                className="lg:w-2/5 lg:ml-16"
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="space-y-6 p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-3xl">
                  <h3 className="text-3xl font-bold text-cyan-400 mb-6">Digital Experiences</h3>
                  <motion.ul 
                    className="space-y-4 text-gray-600 text-lg"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                  >
                    <motion.li variants={fadeInUp}>• Custom Website Architecture & Development</motion.li>
                    <motion.li variants={fadeInUp}>• Native Mobile Applications (iOS & Android)</motion.li>
                    <motion.li variants={fadeInUp}>• Progressive Web Applications</motion.li>
                  </motion.ul>
                </div>
              </motion.div>
              <motion.div 
                className="lg:w-3/5 lg:mr-0"
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Image 
                    src="/textures/DSC01011.jpg" 
                    alt="Digital Experiences" 
                    width={1200} 
                    height={800} 
                    className="relative rounded-3xl object-cover w-full h-80 lg:h-96 shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enterprise Solutions - Right Aligned */}
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 max-w-7xl mx-auto">
              <motion.div 
                className="lg:w-2/5 lg:mr-16"
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="space-y-6 p-8 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl">
                  <h3 className="text-3xl font-bold text-purple-400 mb-6">Enterprise Solutions</h3>
                  <motion.ul 
                    className="space-y-4 text-gray-600 text-lg"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                  >
                    <motion.li variants={fadeInUp}>• CRM & ERP Ecosystem Integration</motion.li>
                    <motion.li variants={fadeInUp}>• SaaS & Micro-SaaS Platforms</motion.li>
                    <motion.li variants={fadeInUp}>• AI-Powered Automation Systems</motion.li>
                  </motion.ul>
                </div>
              </motion.div>
              <motion.div 
                className="lg:w-3/5"
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-l from-purple-400/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Image 
                    src="/textures/DSC00983.jpg" 
                    alt="Enterprise Solutions" 
                    width={1200} 
                    height={800} 
                    className="relative rounded-3xl object-cover w-full h-80 lg:h-96 shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Growth Acceleration - Diagonal Layout */}
          <div className="container mx-auto px-4">
            <div className="relative max-w-7xl mx-auto">
              <motion.div 
                className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false }}
              />
              <div className="flex flex-col lg:flex-row items-center gap-16 pt-12">
                <motion.div 
                  className="lg:w-1/2 transform lg:-skew-y-2"
                  variants={rotateIn}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-100px" }}
                >
                  <div className="space-y-6 p-8 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl skew-y-2">
                    <h3 className="text-3xl font-bold text-emerald-400 mb-6">Growth Acceleration</h3>
                    <motion.ul 
                      className="space-y-4 text-gray-600 text-lg"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                    >
                      <motion.li variants={fadeInUp}>• Advanced SEO & Technical Optimization</motion.li>
                      <motion.li variants={fadeInUp}>• Performance Marketing & PPC</motion.li>
                      <motion.li variants={fadeInUp}>• Conversion Rate Optimization</motion.li>
                    </motion.ul>
                  </div>
                </motion.div>
                <motion.div 
                  className="lg:w-1/2 transform lg:skew-y-2"
                  variants={slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-100px" }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 -skew-y-2"></div>
                    <Image 
                      src="/textures/DSC02031.jpg" 
                      alt="Growth Acceleration" 
                      width={1200} 
                      height={800} 
                      className="relative rounded-3xl object-cover w-full h-80 lg:h-96 shadow-2xl group-hover:scale-105 transition-transform duration-500 -skew-y-2" 
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Intelligence Layer - Centered with Side Elements */}
          <div className="container mx-auto px-4">
            <div className="relative max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-50px" }}
              >
                <div className="inline-block relative">
                  <h3 className="text-4xl font-bold text-pink-400 mb-6">Intelligence Layer</h3>
                  <div className="absolute -left-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent to-pink-400"></div>
                  <div className="absolute -right-20 top-1/2 w-16 h-px bg-gradient-to-l from-transparent to-pink-400"></div>
                </div>
              </motion.div>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  variants={slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-100px" }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tl from-pink-400/20 to-orange-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Image 
                      src="/textures/DSC02064.jpg" 
                      alt="Intelligence Layer" 
                      width={1200} 
                      height={800} 
                      className="relative rounded-3xl object-cover w-full h-80 lg:h-96 shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  variants={slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-100px" }}
                >
                  <div className="space-y-6 p-8 bg-gradient-to-br from-pink-500/10 to-orange-500/10 backdrop-blur-sm border border-pink-500/20 rounded-3xl">
                    <motion.ul 
                      className="space-y-4 text-gray-600 text-lg"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                    >
                      <motion.li variants={fadeInUp}>• Conversational AI & Chatbots</motion.li>
                      <motion.li variants={fadeInUp}>• Predictive Analytics Dashboards</motion.li>
                      <motion.li variants={fadeInUp}>• Social Media Automation</motion.li>
                    </motion.ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy - Split Screen */}
        <div className="w-full relative py-20 overflow-hidden bg-gradient-to-br from-cyan-900/30 via-purple-900/30 to-pink-900/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-stretch min-h-screen max-w-7xl mx-auto">
              <motion.div 
                className="lg:w-1/2 flex items-center justify-center p-16"
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="space-y-8 max-w-lg">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-purple-700 bg-clip-text text-transparent">
                    Our Philosophy
                  </h2>
                  <p className="text-xl text-gray-900 leading-relaxed">
                    We merge velocity with precision, creativity with strategy, and vision with execution. Our teams don't just build digital products — we architect experiences that drive exponential growth and redefine market standards.
                  </p>
                  <motion.div 
                    className="text-sm text-gray-500 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl p-6"
                    variants={scaleIn}
                  >
                    Based in Denton • Serving Global Markets • Rapid Deployment • Strategic Execution
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-8"
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <motion.div variants={fadeInUp}>
                  <Image 
                    src="/textures/DSC01040.jpg" 
                    alt="Philosophy Image 1" 
                    width={800} 
                    height={600} 
                    className="rounded-3xl object-cover w-full h-72 shadow-2xl hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>
                <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                  <Image 
                    src="/textures/DSC01103.jpg" 
                    alt="Philosophy Image 2" 
                    width={800} 
                    height={600} 
                    className="rounded-3xl object-cover w-full h-72 shadow-2xl hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* The Bytes Advantage - Masonry Grid */}
        <div className="w-full py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-16"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-50px" }}
            >
              The Bytes Advantage
            </motion.h2>
            
            <motion.div 
              className="grid lg:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
            >
              <motion.div 
                className="lg:row-span-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500"
                variants={rotateIn}
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">Real-Time Development Visibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every client receives live staging environments throughout development. Watch your vision materialize, provide instant feedback, and iterate in real-time. No surprises, no delays, no compromises.
                </p>
              </motion.div>
              
              <motion.div 
                className="lg:row-span-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500"
                variants={slideInRight}
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Hyper-Speed Delivery</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Our agile methodology and parallel processing workflows deliver production-ready solutions 3x faster than industry benchmarks — without sacrificing quality or cutting corners.
                </p>
                <div className="w-full h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl"></div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500"
                variants={fadeInUp}
              >
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">Bespoke Design Architecture</h3>
                <p className="text-gray-700 leading-relaxed">
                  Zero templates, zero shortcuts. Every interface is meticulously crafted to align with your brand DNA, user psychology, and conversion objectives. Authenticity meets performance.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 backdrop-blur-sm border border-pink-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500"
                variants={slideInLeft}
              >
                <h3 className="text-2xl font-bold text-pink-400 mb-4">Infinite Scalability</h3>
                <p className="text-gray-700 leading-relaxed">
                  From MVP to enterprise-grade platforms, our infrastructure scales seamlessly with your ambitions. Start lean, scale fast, dominate markets.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Technology Stack - Showcase */}
        <div className="w-full py-20 bg-gradient-to-br from-cyan-900/30 via-purple-900/30 to-pink-900/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                className="lg:w-1/2"
                variants={rotateIn}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <div className="relative group">
                  <div className="w-full h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-indigo-500/30 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <motion.div 
                          className="grid grid-cols-3 gap-4"
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="visible"
                        >
                          {[1,2,3,4,5,6].map((i) => (
                            <motion.div 
                              key={i}
                              className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center"
                              variants={scaleIn}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </motion.div>
                          ))}
                        </motion.div>
                        <p className="text-gray-900 font-medium text-lg">Modern Tech Stack</p>
                        <p className="text-sm text-gray-900 max-w-xs mx-auto">We harness the latest frameworks, languages, and cloud services to build resilient, future-proof applications tailored to your growth trajectory.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2 grid grid-cols-2 gap-6"
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, margin: "-100px" }}
              >
                <motion.div variants={fadeInUp}>
                  <Image 
                    src="/textures/DSC01461.jpg" 
                    alt="Tech 1" 
                    width={800} 
                    height={600} 
                    className="rounded-3xl object-cover w-full h-64 shadow-2xl hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>
                <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                  <Image 
                    src="/textures/DSC02069.jpg" 
                    alt="Tech 2" 
                    width={800} 
                    height={600} 
                    className="rounded-3xl object-cover w-full h-64 shadow-2xl hover:scale-105 transition-transform duration-500" 
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Integration Ecosystem - Floating Cards */}
        <div className="w-full py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-16"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-50px" }}
            >
              Integration Ecosystem
            </motion.h2>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
            >
              <div className="space-y-6">
                <motion.div 
                  className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:rotate-1"
                  variants={slideInLeft}
                  whileHover={{ y: -10 }}
                >
                  <h4 className="font-semibold text-cyan-400 mb-3 text-lg">Business Intelligence</h4>
                  <p className="text-gray-700">CRM systems, Analytics platforms, Sales tracking, Performance dashboards</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:-rotate-1"
                  variants={slideInLeft}
                  whileHover={{ y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-purple-400 mb-3 text-lg">AI & Automation</h4>
                  <p className="text-gray-700">Custom chatbots, Workflow automation, Predictive algorithms</p>
                </motion.div>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:rotate-1"
                  variants={slideInRight}
                  whileHover={{ y: -10 }}
                >
                  <h4 className="font-semibold text-emerald-400 mb-3 text-lg">Commerce & Payments</h4>
                  <p className="text-gray-700">Payment gateways, Booking systems, Subscription management</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:-rotate-1"
                  variants={slideInRight}
                  whileHover={{ y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-pink-400 mb-3 text-lg">Marketing Stack</h4>
                  <p className="text-gray-700">Email automation, Social integration, Campaign management</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Support & Growth - Full Width Banner */}
        <div className="w-full py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-white"></div>
            <motion.div 
              className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div 
              className="text-center space-y-8"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-100px" }}
            >
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-purple-700 bg-clip-text text-transparent">
                Beyond Launch
              </h2>
              <motion.p 
                className="text-2xl md:text-3xl text-gray-900 max-w-4xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Premium hosting, proactive maintenance, security monitoring, and continuous optimization. Your success is our ongoing mission.
              </motion.p>
              <motion.div 
                className="flex justify-center space-x-8 mt-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                {[
                  { label: '24/7 Support', icon: (
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" /></svg>) },
                  { label: 'Auto Updates', icon: (
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19l4-4M19 5l-4 4" /></svg>) },
                  { label: 'Performance Monitoring', icon: (
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M16 3v18M8 9h8M8 15h8" /></svg>) },
                  { label: 'Growth Analytics', icon: (
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l6-6 4 4 8-8" /></svg>) }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    className="text-center"
                    variants={scaleIn}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-3 mx-auto backdrop-blur-sm border border-white/20">
                      {item.icon}
                    </div>
                    <p className="text-gray-700 text-sm uppercase tracking-wider">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA - Explosive */}
        <div className="w-full py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/30 to-pink-900/30"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "400% 400%" }}
            />
          </div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <motion.div 
              className="text-center space-y-12"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-100px" }}
            >
              <motion.h2 
                className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-600 to-purple-700 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Ready to Build the Future?
              </motion.h2>
              
              <motion.p 
                className="text-2xl md:text-3xl text-gray-900 max-w-4xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Transform your vision into reality. Scale your impact. Dominate your market.
              </motion.p>
              
              <motion.div 
                className="flex justify-center"
                variants={scaleIn}
              >
                <motion.div 
                  className="w-64 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-full"
                  animate={{ 
                    scaleX: [0.5, 1.5, 0.5],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                {[
                  { number: 500, suffix:"+", label: "Projects Delivered" },
                  { number: 99.9, suffix:"%", label: "Uptime Guarantee" },
                  { number: 24, suffix:"/7", label: "Support Available" },
                  { number: 3, suffix:"x", label: "Faster Deployment" }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    variants={rotateIn}
                    whileHover={{ scale: 1.1, rotateY: 15 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-purple-700 bg-clip-text text-transparent mb-2">
                      <CountUp end={stat.number} duration={3} suffix={stat.suffix} />
                    </div>
                    <p className="text-gray-700 text-sm uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 