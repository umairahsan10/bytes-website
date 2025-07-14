"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '@/sections/Navbar';
import FAQ from '@/components/FAQ-Marketing';
import LottieAnimation from '@/components/LottieAnimation';

// Enhanced helper component for staggered word reveal with smoother animations
const AnimatedParagraph = ({ text, className = "" }) => {
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
  };
  const item = {
    hidden: {
      y: "100%",
      opacity: 0,
      rotateX: -90
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3, once: true }}
      style={{ overflow: "hidden", display: "inline-block" }}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={item}
          style={{
            display: "inline-block",
            marginRight: "0.25rem",
            transformOrigin: "bottom"
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

const MarketingPage = () => {
  const [seoNumbersAnimated, setSeoNumbersAnimated] = useState(false);
  const [smmNumbersAnimated, setSmmNumbersAnimated] = useState(false);
  const [ppcAnimationData, setPpcAnimationData] = useState(null);
  const [reelsAnimationData, setReelsAnimationData] = useState(null);
  const [campaignAnimationData, setCampaignAnimationData] = useState(null);
  const [planAnimationData, setPlanAnimationData] = useState(null);

  const seoStatsRef = useRef([]);
  const smmStatsRef = useRef([]);

  const seoStats = [
    { target: 850, label: "% Average ROAS" },
    { target: 65, label: "% CPA Reduction" },
    { target: 120, label: "Active Campaigns" }
  ];

  const smmStats = [
    { target: 2, label: "Million Followers" },
    { target: 500, label: "% Engagement Rate" },
    { target: 75, label: "Campaigns Launched" }
  ];

  const animateNumbers = useCallback((statsRefs, targets, setAnimated) => {
    statsRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const target = targets[index];
      const duration = 2500;
      const start = performance.now();

      ref.textContent = 0;

      const updateNumber = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        // Smoother easing function
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOut * target);

        ref.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          ref.textContent = target;
        }
      };

      requestAnimationFrame(updateNumber);
    });

    setAnimated && setAnimated(true);
  }, []);

  // Observe SMM stats visibility
  useEffect(() => {
    if (smmNumbersAnimated) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        animateNumbers(smmStatsRef, smmStats.map(s => s.target), setSmmNumbersAnimated);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    smmStatsRef.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [animateNumbers, smmStats, smmNumbersAnimated]);

  // Observe PPC stats visibility
  useEffect(() => {
    if (seoNumbersAnimated) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        animateNumbers(seoStatsRef, seoStats.map(s => s.target), setSeoNumbersAnimated);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    seoStatsRef.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [animateNumbers, seoStats, seoNumbersAnimated]);



  // Enhanced animation variants
  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideInLeft = {
    hidden: {
      opacity: 0,
      x: -100,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideInRight = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  useEffect(() => {
    fetch('/assets/Marketing/animations/ppc.json')
      .then(res => res.json())
      .then(setPpcAnimationData)
      .catch(() => {});
  }, []);

  // Load Reels animation for Custom Posts section
  useEffect(() => {
    fetch('/assets/Marketing/animations/reels.json')
      .then(res => res.json())
      .then(setReelsAnimationData)
      .catch(() => {});
  }, []);

  // Load Campaign Leaders animation
  useEffect(() => {
    fetch('/assets/Marketing/animations/campaign.json')
      .then(res => res.json())
      .then(setCampaignAnimationData)
      .catch(() => {});
  }, []);

  // Load Strategic Planning animation
  useEffect(() => {
    fetch('/assets/Marketing/animations/plan.json')
      .then(res => res.json())
      .then(setPlanAnimationData)
      .catch(() => {});
  }, []);

  return (
    <div className="font-sans bg-[#010a14] overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Marketing Hero Section - Enhanced Responsive */}
      <motion.section
        className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between bg-gradient-to-r from-black via-[#010a14] to-black px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 min-h-screen pt-20 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Right-side fade overlay */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 md:w-32 lg:w-40 xl:w-56 bg-gradient-to-l from-[#010a14] to-transparent" />

        {/* Text Content */}
        <motion.div
          className="relative z-10 text-center lg:text-left w-full lg:w-1/2 xl:w-2/5 order-2 lg:order-1 mt-8 lg:mt-0"
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 leading-tight"
            initial={{ opacity: 0, y: 100, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-600 bg-clip-text text-transparent block">
              DIGITAL<br />MARKETING
            </span>
          </motion.h1>

          <AnimatedParagraph
            text="At Bytes Platform, we specialize in social media marketing services that are designed to help businesses grow. By combining cutting-edge strategies we ensure that our marketing efforts drive results."
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white leading-relaxed max-w-2xl mx-auto lg:mx-0"
          />
        </motion.div>

        {/* Image Content */}
        <motion.div
          className="relative w-full lg:w-1/2 xl:w-3/5 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] flex items-center justify-center overflow-visible order-1 lg:order-2"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-full h-full">
            <Image
              src="/assets/Marketing/market(2).png"
              alt="Marketing Illustration"
              fill
              className="object-contain object-center"
              priority
            />
            {/* Fade overlay */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#010a14] to-transparent z-10" />
          </div>
        </motion.div>
      </motion.section>

      {/* Section 2: SMM - Enhanced Responsive */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-[#010a14] text-white py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Image */}
          <motion.div
            variants={slideInLeft}
            className="w-full lg:w-2/5 max-w-sm lg:max-w-md aspect-square rounded-full overflow-hidden relative z-10 shadow-2xl"
          >
            <div className="absolute -top-2 -right-2 left-2 bottom-2 sm:-top-4 sm:-right-4 sm:left-4 sm:bottom-4 border-2 sm:border-4 border-purple-400 -z-10 rounded-full"></div>
            <img
              src="/assets/Marketing/smm.png"
              alt="Social Media Marketing"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={slideInRight}
            className="flex-1 w-full text-center lg:text-left"
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-800 via-white to-blue-800 bg-clip-text text-transparent leading-tight mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3
              }}
            >
              Social Media<br />Marketing
            </motion.h2>

            <motion.div
              className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed space-y-3 sm:space-y-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.5
              }}
            >
              <p>
              In the ever-evolving digital landscape, effective social media marketing is more than just about posting attractive content. It’s about building a connection with your audience and establishing a strong brand. Our team focuses on creating highly engaging content that resonates with your target audience. From eye-catching visuals to thought-provoking posts, we aim to create content that attracts attention and builds lasting impact.  
              </p>
              

              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center text-center list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg md:items-start md:text-left md:list-outside md:ml-6"
              >
                {[
                  'Custom Posts Tailored to Your Brand',
                  'High-Impact Reels & Short-Form Videos',
                  'Strategic Planning by Industry Experts'
                ].map((text, idx) => (
                  <motion.li
                    key={idx}
                    variants={fadeInUp}
                    className="leading-relaxed"
                  >
                    {text}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6"
            >
              {smmStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center lg:text-left flex-1 min-w-[100px] sm:min-w-[120px]"
                >
                  <span
                    ref={el => smmStatsRef.current[index] = el}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold block bg-gradient-to-r from-blue-800 via-white to-blue-800 bg-clip-text text-transparent"
                  >
                    0
                  </span>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* SMM Sub-Section: Custom Posts & Reels - Enhanced Responsive */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-white text-[#010a14] py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          {/* Content */}
          <motion.div
            variants={slideInLeft}
            className="flex-1 w-full max-w-2xl text-center md:text-left order-2 md:order-1"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Custom Posts & Reels
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#010a14] leading-relaxed mb-6">
            Our team specializes in creating viral content and building brand loyalty through social media campaigns. We work with businesses of all sizes to produce tailored posts, engaging stories, and high-conversion videos designed for every platform's algorithm.
            </p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg md:items-start md:text-left md:list-outside md:ml-6"
            >
              {[
                'Platform-Native Formats',
                'Brand-Aligned Motion Graphics & Edits',
                'Optimized Caption Frameworks'
              ].map((item, idx) => (
                <motion.li
                  key={item}
                  variants={fadeInUp}
                  className="leading-relaxed"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          {/* Animation - Full Container Coverage */}
          <motion.div
            variants={slideInRight}
            className="relative flex-1 order-1 md:order-2 max-w-md w-full aspect-square flex items-center justify-center"
          >
            {reelsAnimationData && (
              <LottieAnimation
                animationData={reelsAnimationData}
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* SMM Sub-Section: Strategic Planning - Enhanced Responsive */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-[#010a14] text-white py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-16">
          {/* Content */}
          <motion.div
            variants={slideInRight}
            className="flex-1 w-full max-w-2xl text-center md:text-left order-2 md:order-2"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 via-white to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Strategic Social Media Management Planning
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6">
              Our senior strategists map every campaign to audience insights and market trends. With a focus on scalability, we create roadmaps that evolve alongside your business.
            </p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg md:items-start md:text-left md:list-outside md:ml-6"
            >
              {[
                '360° Social Audits & Competitive Analysis',
                'Quarterly Content Calendars with Agile Pivots',
                'Real-Time Reporting and Optimization Loops'
              ].map((text, idx) => (
                <motion.li
                  key={text}
                  variants={fadeInUp}
                  className="leading-relaxed"
                >
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Strategic Planning Animation */}
          <motion.div
            variants={slideInLeft}
            className="relative flex-1 order-1 md:order-1 w-full max-w-md aspect-square flex items-center justify-center"
          >
            {planAnimationData && (
              <LottieAnimation
                animationData={planAnimationData}
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* PPC Main Section - Enhanced Responsive */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-white text-[#010a14] py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
          {/* Image (PPC Analytics Animation) */}
          <motion.div
            variants={slideInRight}
            className="relative w-full lg:w-2/5 max-w-sm lg:max-w-md aspect-square order-1 lg:order-2 flex items-center justify-center"
          >
            {ppcAnimationData && (
              <LottieAnimation
                animationData={ppcAnimationData}
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            variants={slideInLeft}
            className="flex-1 w-full text-center lg:text-left order-2 lg:order-1"
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent leading-tight mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3
              }}
            >
              Pay-Per-Click (PPC) Advertising
            </motion.h2>

            <motion.div
              className="text-sm sm:text-base md:text-lg text-[#010a14] leading-relaxed space-y-3 sm:space-y-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.5
              }}
            >
              <p>
                Our PPC services go beyond just running ads—we build smart, scalable campaigns designed to deliver measurable ROI. From Google and Bing to LinkedIn and YouTube, our team ensures every click delivers results.
              </p>
            </motion.div>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg md:items-start md:text-left md:list-outside md:ml-6 mb-6 sm:mb-8"
            >
              {[
                'Smart Targeting ensures your ads reach the right audience.',
                'Engaging ad content designed to maximize conversions.',
                'Full-Funnel Tracking (GA4, GTM, Pixel).'
                
              ].map((text, idx) => (
                <motion.li
                  key={text}
                  variants={fadeInUp}
                  className="leading-relaxed"
                >
                  {text}
                </motion.li>
              ))}
            </motion.ul>

            {/* PPC Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6"
            >
              {seoStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center lg:text-left flex-1 min-w-[100px] sm:min-w-[120px]"
                >
                  <span
                    ref={el => seoStatsRef.current[index] = el}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold block bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent"
                  >
                    0
                  </span>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* PPC Sub-Section: Professional Management - Enhanced Responsive */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-[#0d0d20] text-white py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          {/* Content */}
          <motion.div
            variants={slideInLeft}
            className="flex-1 w-full max-w-2xl text-center md:text-left order-2 md:order-1"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 via-white to-blue-800 bg-clip-text text-transparent mb-4 sm:mb-6">
              Professional PPC Management for Sustainable Growth
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6">
              With a certified team of PPC experts, we fine-tune bids, keywords, and ad copy in real-time, ensuring you get the most out of every marketing dollar.
            </p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg md:items-start md:text-left md:list-outside md:ml-6"
            >
              {[
                'Certified Google & Microsoft Ads Team',
                'Advanced Bid & Budget Automation',
                '24/7 Ad & Keyword Optimization'
              ].map((text, idx) => (
                <motion.li
                  key={text}
                  variants={fadeInUp}
                  className="leading-relaxed"
                >
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={slideInRight}
            className="flex-1 order-1 md:order-2 w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl"
          >
            <img src="/assets/Marketing/PPC_Management.png" alt="Professional PPC" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </motion.section>

      {/* PPC Sub-Section: Campaign Leaders - Enhanced Responsive */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-white text-[#010a14] py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-16">
          {/* Content */}
          <motion.div
            variants={slideInRight}
            className="flex-1 w-full max-w-2xl text-center md:text-left order-2 md:order-2"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Scalable Growth Across Multiple Platforms
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#010a14] leading-relaxed mb-6">
              Whether you're just starting or scaling your business, we ensure your message reaches the right audience across multiple platforms. Our campaigns are designed to grow with you, driving consistent results across Facebook, Instagram, Google, and LinkedIn.
            </p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg md:items-start md:text-left md:list-outside md:ml-6"
            >
              {[
                'Growth Roadmaps & Stakeholder Workshops',
                'Cross-Channel Creative Leadership',
                'Quarterly OKR & ROAS Alignment'                
              ].map((text, idx) => (
                <motion.li
                  key={text}
                  variants={fadeInUp}
                  className="leading-relaxed"
                >
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Campaign Animation */}
          <motion.div
            variants={slideInLeft}
            className="relative flex-1 order-1 md:order-1 w-full max-w-md aspect-square flex items-center justify-center"
          >
            {campaignAnimationData && (
              <LottieAnimation
                animationData={campaignAnimationData}
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section className="w-full flex flex-col items-center justify-center py-0">
        <FAQ />
      </section>
    </div>
  );
};

export default MarketingPage;