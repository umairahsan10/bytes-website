"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

const MarketingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [seoVisible, setSeoVisible] = useState(false);
  const [smmVisible, setSmmVisible] = useState(false);
  const [seoNumbersAnimated, setSeoNumbersAnimated] = useState(false);
  const [smmNumbersAnimated, setSmmNumbersAnimated] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Page loading overlay state
  const [isPageLoading, setIsPageLoading] = useState(true);

  const seoStatsRef = useRef([]);
  const smmStatsRef = useRef([]);
  const isScrolling = useRef(false);

  const photoItems = [
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", alt: "Marketing Analytics", position: "top-left" },
    { src: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop", alt: "SEO Strategy", position: "top-center" },
    { src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop", alt: "Social Media", position: "top-right" },
    { src: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop", alt: "Content Marketing", position: "bottom-left" },
    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", alt: "Data Analysis", position: "bottom-center" },
    { src: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=300&fit=crop", alt: "Digital Marketing", position: "bottom-right" }
  ];

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
      const duration = 2000;
      const start = performance.now();

      const updateNumber = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
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

    setAnimated(true);
  }, []);

  const getTransform = useCallback((position, scrollProgress) => {
    let translateX = 0;
    let translateY = 0;
    let rotate = 0;
    let scale = 1;

    const intensity = 800;

    switch (position) {
      case 'top-left':
        translateX = -scrollProgress * intensity;
        translateY = -scrollProgress * (intensity * 0.6);
        rotate = -scrollProgress * 90;
        scale = 1 - scrollProgress * 0.4;
        break;
      case 'top-center':
        translateY = -scrollProgress * intensity;
        rotate = scrollProgress * 180;
        scale = 1 - scrollProgress * 0.3;
        break;
      case 'top-right':
        translateX = scrollProgress * intensity;
        translateY = -scrollProgress * (intensity * 0.6);
        rotate = scrollProgress * 90;
        scale = 1 - scrollProgress * 0.4;
        break;
      case 'bottom-left':
        translateX = -scrollProgress * intensity;
        translateY = scrollProgress * (intensity * 0.6);
        rotate = scrollProgress * 135;
        scale = 1 - scrollProgress * 0.4;
        break;
      case 'bottom-center':
        translateY = scrollProgress * intensity;
        rotate = -scrollProgress * 180;
        scale = 1 - scrollProgress * 0.3;
        break;
      case 'bottom-right':
        translateX = scrollProgress * intensity;
        translateY = scrollProgress * (intensity * 0.6);
        rotate = -scrollProgress * 135;
        scale = 1 - scrollProgress * 0.4;
        break;
      default:
        break;
    }

    return { translateX, translateY, rotate, scale };
  }, []);

  const updateScrollState = useCallback((currentScrollY) => {
    const windowHeight = window.innerHeight;

    setScrollY(currentScrollY);
    setShowScrollIndicator(currentScrollY <= 100);

    // Show SMM section (second section)
    if (currentScrollY > windowHeight * 0.1) {
      setSmmVisible(true);
      if (!smmNumbersAnimated) {
        setTimeout(() => {
          animateNumbers(smmStatsRef, smmStats.map(s => s.target), setSmmNumbersAnimated);
        }, 300);
      }
    }

    // Show PPC section (third section)
    if (currentScrollY > windowHeight * 1.05) {
      setSeoVisible(true);
      if (!seoNumbersAnimated) {
        setTimeout(() => {
          animateNumbers(seoStatsRef, seoStats.map(s => s.target), setSeoNumbersAnimated);
        }, 300);
      }
    }
  }, [animateNumbers, seoNumbersAnimated, smmNumbersAnimated, smmStats, seoStats]);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => updateScrollState(window.scrollY));
  }, [updateScrollState]);

  useEffect(() => {
    // Force initial scroll state calculation
    updateScrollState(window.scrollY || 0);

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Force a recheck after component mount
    const timeout = setTimeout(() => {
      updateScrollState(window.scrollY || 0);
    }, 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [handleScroll, updateScrollState]);

  // Ensure page starts at top on initial load/refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  const scrollProgress = typeof window !== 'undefined' ? Math.min(scrollY / (window.innerHeight || 1), 1) : 0;
  const titleScale = 1 + scrollProgress * 2;
  const titleOpacity = Math.max(1 - scrollProgress * 1.5, 0);

  return (
    <div className="font-sans bg-gray-100 overflow-x-hidden" style={{ scrollBehavior: 'auto' }}>
      {/* Section 1: Gallery */}
      <section className="h-screen relative flex items-center justify-center">
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="relative w-4/5 h-3/5 grid grid-cols-3 grid-rows-3 gap-8 items-center justify-items-center md:w-11/12 md:gap-4 md:grid-cols-3 md:grid-rows-3">
            {photoItems.map((item, index) => {
              const transform = getTransform(item.position, scrollProgress);
              const opacity = Math.max(1 - scrollProgress * 1.1, 0);

              return (
                <div
                  key={index}
                  className="w-100 h-90 md:w-80 md:h-60 rounded-lg overflow-hidden shadow-lg transform-gpu"
                  style={{
                    transform: `translate3d(${transform.translateX}px, ${transform.translateY}px, 0) rotate(${transform.rotate}deg) scale(${transform.scale})`,
                    opacity: opacity,
                    willChange: 'transform, opacity',
                    transition: 'none' // Remove any CSS transitions that might interfere
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              );
            })}
            {/* Empty middle row to create breathing space around the heading */}
            <div className="row-start-2 col-span-3" />
          </div>

          <h1
            className="absolute text-[20vw] md:text-7xl font-bold text-gray-800 tracking-widest text-center z-10 top-1/2 left-1/2 p-10 md:p-6 bg-white/45 backdrop-blur-sm border border-white/20 rounded-2xl transform-gpu"
            style={{
              transform: `translate3d(-50%, -50%, 0) scale(${titleScale})`,
              opacity: titleOpacity,
              willChange: 'transform, opacity',
              transition: 'none' // Remove any CSS transitions that might interfere
            }}
          >
            MARKETING
          </h1>
        </div>
      </section>

      {/* Section 2: SMM - Image Left, Text Right */}
      <section className={`min-h-screen relative flex items-center justify-between px-16 md:px-8 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-1000 ease-out flex-col lg:flex-row lg:text-left md:py-10 lg:justify-between ${smmVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className={`w-full lg:w-2/5 md:w-4/5 max-w-lg aspect-square rounded-full overflow-hidden relative z-10 shadow-2xl transition-all duration-1200 ease-out ${smmVisible ? 'translate-x-0 scale-100 opacity-100 rotate-0' : '-translate-x-32 scale-90 opacity-0 -rotate-6'}`}>
          <div className="absolute -top-4 -right-4 left-4 bottom-4 border-4 border-purple-400 -z-10 rounded-full"></div>
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=500&fit=crop"
            alt="Social Media Expert"
            className="w-full h-full object-cover"
          />
        </div>

        <div className={`flex-1 w-full lg:pl-16 md:pl-0 md:mt-10 transition-all duration-1000 delay-200 ease-out ${smmVisible ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}>
          <h2 className={`text-9xl md:text-7xl font-bold text-purple-600 leading-tight mb-10 transition-all duration-1200 delay-300 ease-out ${smmVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Social Media<br />Marketing
          </h2>
          <div className={`text-2xl md:text-xl text-gray-600 leading-relaxed space-y-6 mb-12 transition-all duration-1000 delay-500 ease-out ${smmVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}> 
            <p>
              If you're not marketing like it's 2025, you're already behind. Modern marketing isn't just about posting attractive visuals or boosting random ads. It's about strategy, data, creativity and flawless execution — all working in sync.
            </p>
            <p>
              Creating viral content and building engaged communities across all major social platforms. Expert in influencer partnerships, paid social campaigns, and brand storytelling that converts followers into customers while fostering lasting brand loyalty.
            </p>
          </div>
          <div className={`flex gap-16 md:gap-8 mt-10 justify-start transition-all duration-1000 delay-700 ease-out ${smmVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {smmStats.map((stat, index) => (
              <div key={index} className="text-left">
                <span
                  ref={el => smmStatsRef.current[index] = el}
                  className="text-6xl md:text-5xl font-bold text-purple-600 block"
                >
                  0
                </span>
                <div className="text-lg text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: SEO - Image Left, Text Right */}
      <section className={`min-h-screen relative flex items-center justify-between px-16 md:px-8 bg-gradient-to-bl from-gray-100 to-gray-200 transition-all duration-1000 ease-out flex-col lg:flex-row-reverse lg:text-left md:py-10 lg:justify-between ${seoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className={`w-full lg:w-2/5 md:w-4/5 max-w-lg aspect-square rounded-full overflow-hidden relative z-10 shadow-2xl transition-all duration-1200 ease-out ${seoVisible ? 'translate-x-0 opacity-100 scale-100 rotate-0' : 'translate-x-32 opacity-0 scale-90 rotate-6'}`}> 
          <div className="absolute -top-4 -left-4 right-4 bottom-4 border-4 border-purple-400 -z-10 rounded-full"></div>
          <img
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=500&fit=crop"
            alt="PPC Analytics"
            className="w-full h-full object-cover"
          />
        </div>

        <div className={`flex-1 w-full lg:pr-16 md:pl-0 md:mt-10 transition-all duration-1000 delay-200 ease-out ${seoVisible ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'}`}>
          <h2 className={`text-9xl md:text-7xl font-bold text-purple-600 leading-tight mb-10 transition-all duration-1200 delay-300 ease-out ${seoVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Pay&nbsp;Per<br />Click&nbsp;(PPC)
          </h2>
          <div className={`text-2xl md:text-xl text-gray-600 leading-relaxed space-y-6 mb-12 transition-all duration-1000 delay-500 ease-out ${seoVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <p>
              We don't just run ads — we build data-backed campaigns that drive measurable ROI. From Google and Bing to LinkedIn and YouTube, our specialists optimise every click for maximum conversions.
            </p>

            <ul className="list-disc ml-6 space-y-2 text-xl md:text-lg">
              {[
                'Smart Targeting',
                'High-Converting Copy & Creatives',
                'Full-Funnel Tracking (GA4, GTM, Pixel)',
                'Scalable Growth Across Top Ad Platforms'
              ].map((text, idx) => (
                <li
                  key={idx}
                  className={`${seoVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-700 ease-out`}
                >
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className={`flex gap-16 md:gap-8 mt-10 justify-start transition-all duration-1000 delay-700 ease-out ${seoVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {seoStats.map((stat, index) => (
              <div key={index} className="text-left">
                <span
                  ref={el => seoStatsRef.current[index] = el}
                  className="text-6xl md:text-5xl font-bold text-purple-600 block"
                >
                  0
                </span>
                <span className="text-gray-600 text-lg uppercase tracking-wider block mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs transition-opacity duration-500 animate-bounce ${showScrollIndicator ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <span className="mb-2">Scroll to explore</span>
          <div className="w-1 h-8 border border-gray-400 rounded-full relative">
            <div className="w-1 h-2 bg-gray-600 rounded-full absolute top-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;