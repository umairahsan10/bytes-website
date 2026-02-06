"use client";

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/sections/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

// Dynamic imports for heavy components
const FAQ = dynamic(() => import("@/components/FAQ-ByteBots"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
});
const LottieAnimation = dynamic(() => import('@/components/LottieAnimation'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
});

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Extend Window interface for VANTA
declare global {
  interface Window {
    VANTA: any;
  }
}

const ByteBotLanding: React.FC = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const horizontalSectionsRef = useRef<HTMLDivElement>(null);
  // Root wrapper reference for background-colour animation
  const pageRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);
  const [integrationAnimationData, setIntegrationAnimationData] = React.useState<any>(null);
  const [conversionAnimationData, setConversionAnimationData] = React.useState<any>(null);
  const [vantaScriptsLoaded, setVantaScriptsLoaded] = React.useState(false);

  // Defer Vanta scripts loading until after initial render
  useEffect(() => {
    let threeLoaded = false;
    let vantaLoaded = false;

    const checkAndSetLoaded = () => {
      if (threeLoaded && vantaLoaded) setVantaScriptsLoaded(true);
    };

    // Defer loading by 1 second to prioritize main content
    const timeoutId = setTimeout(() => {
      // Load three.js
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      threeScript.async = true;
      threeScript.onload = () => {
        threeLoaded = true;
        // Load Vanta after three.js
        const vantaScript = document.createElement('script');
        vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js';
        vantaScript.async = true;
        vantaScript.onload = () => {
          vantaLoaded = true;
          checkAndSetLoaded();
        };
        document.head.appendChild(vantaScript);
      };
      document.head.appendChild(threeScript);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Vanta initialization (runs only after scripts loaded and ref ready)
  useEffect(() => {
    if (vantaScriptsLoaded && typeof window !== 'undefined' && window.VANTA && heroRef.current) {
      const isMobile = window.innerWidth < 640;
      vantaRef.current = window.VANTA.HALO({
        el: heroRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: isMobile ? 100 : 200.00,
        minWidth: isMobile ? 100 : 200.00,
        color: 0xffffff,
        backgroundColor: 0x000000,
        amplitudeFactor: isMobile ? 1.2 : 2.00,
        size: isMobile ? 1.0 : 1.50,
        mouseEase: true
      });
    }
    return () => {
      if (vantaRef.current && vantaRef.current.destroy) {
        vantaRef.current.destroy();
      }
    };
  }, [vantaScriptsLoaded]);

  useEffect(() => {
    // Lazy load animation data only when user scrolls near them
    let hasLoaded = false;
    
    const loadAnimationData = async () => {
      if (hasLoaded) return;
      hasLoaded = true;
      
      try {
        // Load both animations in parallel
        const [integrationData, conversionData] = await Promise.all([
          fetch('/assets/newimages/Animation - 1752082488879.json').then(r => r.json()),
          fetch('/assets/newimages/Animation - 1752084319586.json').then(r => r.json())
        ]);
        
        setIntegrationAnimationData(integrationData);
        setConversionAnimationData(conversionData);
      } catch (error) {
        console.error('Failed to load animation data:', error);
      }
    };

    // Load animation data on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loadAnimationData());
    } else {
      setTimeout(loadAnimationData, 2000);
    }

    // Initialize animations
    const initAnimations = () => {
      // Batch DOM reads/writes for better performance
      ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
      
      // Hero text animations (only within hero section)
      gsap.set('.hero-content .bubble-text', { opacity: 0, y: 50 });

      gsap.to('.hero-content .bubble-text', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.5
      });

      // ---------------------------
      // Section reveal & background-colour change
      // ---------------------------
      const sections = gsap.utils.toArray(".content-section") as HTMLElement[];
      const colors = ['#ffffff', '#010A14', '#ffffff', '#010A14'];

      sections.forEach((section, index) => {
        const bubbleTexts = section.querySelectorAll('.bubble-text');
        const sectionImage = section.querySelector('.section-image');

        gsap.set(bubbleTexts, { opacity: 0, y: 30 });
        if (sectionImage) gsap.set(sectionImage, { opacity: 0, y: 20 });

        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          fastScrollEnd: true,
          onEnter: () => {
            // Add will-change hint for smooth animations
            bubbleTexts.forEach((el: Element) => (el as HTMLElement).style.willChange = 'opacity, transform');
            gsap.to(bubbleTexts, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: "back.out(1.7)",
              onComplete: () => {
                bubbleTexts.forEach((el: Element) => (el as HTMLElement).style.willChange = 'auto');
              }
            });

            if (sectionImage) {
              gsap.to(sectionImage, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
              });
            }

            if (pageRef.current) {
              gsap.to(pageRef.current, {
                backgroundColor: colors[index],
                duration: 0.5,
                overwrite: 'auto'
              });
            }
          },
          onEnterBack: () => {
            if (pageRef.current) {
              gsap.to(pageRef.current, {
                backgroundColor: colors[index],
                duration: 0.5,
                overwrite: 'auto'
              });
            }
          }
        });
      });
    };

    initAnimations();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleRippleEffect = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    button.appendChild(ripple);

    setTimeout(() => {
      if (button.contains(ripple)) {
        button.removeChild(ripple);
      }
    }, 600);
  }, []);

  return (
    <>
      {/* Preconnect to external resources */}
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      
      <div ref={pageRef} className="font-inter overflow-x-hidden bg-white">
        <Header />

      <style jsx>{`
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .section-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .horizontal-sections {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .content-section {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 0; /* or more */
        }
        
        .action-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(0, 212, 255, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .action-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 212, 255, 0.15);
          border-color: rgba(0, 212, 255, 0.3);
        }
        
        .action-card:hover .action-icon {
          transform: scale(1.2) rotate(5deg);
        }
        
        .action-icon {
          transition: transform 0.3s ease;
        }
        
        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .shape {
          position: absolute;
          opacity: 0.1;
          animation: float 20s infinite linear;
        }
        
        .shape:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .shape:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: -5s;
        }
        
        .shape:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: -10s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
          }
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #00d4ff, #5b73ff, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .tech-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        /* Cloudy effect for plug and play image */
        .cloudy-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cloudy-bg {
          position: absolute;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 70%, rgba(91, 115, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 50% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 20% 80%, rgba(91, 115, 255, 0.08) 0%, transparent 40%);
          border-radius: 50%;
          animation: cloudy-float 8s ease-in-out infinite;
          z-index: 1;
        }
        
        .cloudy-bg::before {
          content: '';
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle at 40% 60%, rgba(0, 212, 255, 0.05) 0%, transparent 60%),
                      radial-gradient(circle at 80% 30%, rgba(91, 115, 255, 0.05) 0%, transparent 60%);
          border-radius: 50%;
          animation: cloudy-rotate 12s linear infinite;
        }
        
        .cloudy-bg::after {
          content: '';
          position: absolute;
          top: -5%;
          left: -5%;
          width: 110%;
          height: 110%;
          background: radial-gradient(circle at 60% 40%, rgba(0, 212, 255, 0.03) 0%, transparent 70%),
                      radial-gradient(circle at 10% 90%, rgba(91, 115, 255, 0.03) 0%, transparent 70%);
          border-radius: 50%;
          animation: cloudy-pulse 6s ease-in-out infinite;
        }
        
        .cloudy-image {
          position: relative;
          z-index: 2;
          animation: image-float 4s ease-in-out infinite;
        }
        
        @keyframes cloudy-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-15px) scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes cloudy-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes cloudy-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes image-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .animate-rotate-3d {
          animation: rotate3d 6s linear infinite;
          transform-style: preserve-3d;
        }
        
        @keyframes rotate3d {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
        
        /* Particle effects */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #00d4ff, #5b73ff);
          border-radius: 50%;
          animation: float-particle 4s ease-in-out infinite;
        }
        
        .particle-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }
        
        .particle-2 {
          top: 60%;
          right: 30%;
          animation-delay: 0.8s;
        }
        
        .particle-3 {
          bottom: 30%;
          left: 40%;
          animation-delay: 1.6s;
        }
        
        .particle-4 {
          top: 40%;
          right: 20%;
          animation-delay: 2.4s;
        }
        
        .particle-5 {
          bottom: 20%;
          right: 40%;
          animation-delay: 3.2s;
        }
        
        .particle-6 {
          top: 15%;
          left: 60%;
          animation-delay: 0.4s;
        }
        
        .particle-7 {
          top: 70%;
          left: 15%;
          animation-delay: 1.2s;
        }
        
        .particle-8 {
          bottom: 15%;
          left: 70%;
          animation-delay: 2.0s;
        }
        
        .particle-9 {
          top: 25%;
          right: 15%;
          animation-delay: 2.8s;
        }
        
        .particle-10 {
          bottom: 60%;
          right: 60%;
          animation-delay: 0.6s;
        }
        
        .particle-11 {
          top: 80%;
          right: 50%;
          animation-delay: 1.4s;
        }
        
        .particle-12 {
          bottom: 40%;
          left: 25%;
          animation-delay: 2.2s;
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }
        
        /* Learn text as shooting star in 360 orbit */
        .shooting-star-orbit {
          position: relative;
          width: 300px;
          height: 300px;
          z-index: 10;
        }
        
        .shooting-star {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          animation: shooting-star-orbit 8s linear infinite;
        }
        
        .learn-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: #00d4ff;
          text-shadow: 0 0 15px #00d4ff, 0 0 30px #00d4ff, 0 0 45px #00d4ff;
          white-space: nowrap;
          position: relative;
          z-index: 2;
          transform: translate(-50%, -50%);
        }
        
        .star-trail {
          position: absolute;
          top: 50%;
          left: -30px;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00d4ff, #5b73ff);
          transform: translateY(-50%);
          border-radius: 1px;
          box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff;
          z-index: 1;
        }
        
        .star-trail::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -8px;
          width: 15px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00d4ff);
          transform: translateY(-50%);
          border-radius: 0.5px;
          box-shadow: 0 0 5px #00d4ff;
        }
        
        @keyframes shooting-star-orbit {
          0% {
            transform: rotate(0deg) translateX(120px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(120px) rotate(-360deg);
          }
        }
        
        /* Chatbot animations */
        .chatbot-container {
          position: relative;
          width: 600px;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -50px;
        }
        

        
        .chatbot-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: relative;
          z-index: 2;
          animation: chatbot-float 4s ease-in-out infinite;
        }
        
        .chatbot-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 3;
        }
        
        .particle-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: linear-gradient(45deg, #00d4ff, #5b73ff);
          border-radius: 50%;
          animation: particle-float 5s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
        }
        
        .dot-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }
        
        .dot-2 {
          top: 60%;
          right: 25%;
          animation-delay: 1s;
        }
        
        .dot-3 {
          bottom: 30%;
          left: 30%;
          animation-delay: 2s;
        }
        
        .dot-4 {
          top: 40%;
          right: 15%;
          animation-delay: 3s;
        }
        
        .dot-5 {
          bottom: 20%;
          right: 40%;
          animation-delay: 4s;
        }
        

        
        @keyframes chatbot-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }
        
        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 1;
          }
        }
        
        /* Robot with laser effects */
        .robot-container {
          position: relative;
          width: 500px;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          margin-top: -100px;
        }
        
        .robot-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: relative;
          z-index: 2;
          animation: robot-pulse 3s ease-in-out infinite;
        }
        
        .laser-beam {
          position: absolute;
          width: 4px;
          height: 200px;
          background: linear-gradient(to bottom, #ff0000, #ff6b6b, transparent);
          border-radius: 2px;
          z-index: 1;
          animation: laser-shoot 2s ease-in-out infinite;
          box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
        }
        
        .laser-left {
          top: 25%;
          left: 35%;
          transform: rotate(-45deg);
          animation-delay: 0s;
        }
        
        .laser-right {
          top: 25%;
          right: 15%;
          transform: rotate(45deg);
          animation-delay: 0s;
        }
        
        .laser-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: laser-glow-pulse 2s ease-in-out infinite;
          z-index: 0;
        }
        
        @keyframes robot-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes laser-shoot {
          0%, 100% {
            opacity: 0.3;
            height: 150px;
          }
          50% {
            opacity: 1;
            height: 250px;
          }
        }
        
        @keyframes laser-glow-pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        
        @media (max-width: 768px) {
          /* Keep horizontal scrolling on mobile */
          .horizontal-sections {
            flex-direction: column; /* now vertical */
            width: 100%;
          }
          .content-section {
            width: 100vw;
            min-height: 100vh;
            padding: 60px 0;
          }
          
          .mobile-full-width {
            width: 100% !important;
            margin-bottom: 30px;
          }
          
          .action-card {
            margin-bottom: 1rem;
          }
          
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .content-section h2 {
            font-size: 2.5rem !important;
            line-height: 1.2;
            margin-bottom: 1.5rem !important;
          }
          .content-section p {
            font-size: 1.1rem !important;
            margin-bottom: 2rem !important;
          }
          .content-section ul {
            margin-bottom: 2rem !important;
          }
          .content-section li {
            margin-bottom: 1rem !important;
          }
          .section-image {
            height: 60vw !important;
            margin-top: 1rem !important;
          }
          .robot-container {
            transform: scale(1.1) translateX(-30px) !important;
            margin-top: -50px !important;
          }
          .chatbot-container {
            width: 400px !important;
            height: 400px !important;
            margin-top: -30px !important;
          }
        }
        
        @media (max-width: 640px) {
          .hero-content h1 {
            font-size: 3rem !important;
            line-height: 1.1;
          }
          
          .hero-content p {
            font-size: 1.2rem !important;
            margin-bottom: 2rem;
          }
          
          .bot-container canvas {
            width: 240px !important;
            height: 240px !important;
          }
          
          .action-card {
            min-height: 350px !important;
          }
          
          .action-card h3 {
            font-size: 1.125rem !important;
          }
          
          .action-card p {
            font-size: 0.875rem !important;
          }
          
          .content-section {
            padding: 180px 0 !important; /* or more for mobile */
            min-height: 100vh !important;
          }
          
          .content-section h2 {
            font-size: 2rem !important;
            margin-bottom: 1rem !important;
          }
          
          .content-section p {
            font-size: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .content-section ul {
            margin-bottom: 1.5rem !important;
          }
          
          .content-section li {
            font-size: 0.95rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .section-image {
            height: 50vw !important;
            margin-top: 0.5rem !important;
          }
          
          .robot-container {
            transform: scale(0.9) translateX(-20px) !important;
            margin-top: -30px !important;
          }
          
          .chatbot-container {
            width: 300px !important;
            height: 300px !important;
            margin-top: -20px !important;
          }
          
          .mobile-full-width {
            margin-bottom: 20px !important;
          }
          
        }
        
      `}</style>

      {/* ---------------- Hero Section ---------------- */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center text-center pt-20">
        {/* overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* centered content */}
        <div className="relative z-10 px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            <span className="bubble-text gradient-text">Byte Bots</span>
          </h1>
          <p className="text-2xl md:text-4xl text-cyan-500/90 mb-4 font-light bubble-text">The Future of Conversation with the Power of AI</p>
          <p className="text-lg md:text-2xl text-cyan-300 mb-8 font-medium bubble-text">Powered by Real Business Artificial Intelligence</p>

          <Link
            href="/contact"
            data-cta="true"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            Book a Free&nbsp;Byte-Bots&nbsp;Consultation
          </Link>
        </div>
      </section>

      {/* Horizontal Scrolling Sections */}
      <div className="section-container relative overflow-hidden">
        <div className="horizontal-sections" ref={horizontalSectionsRef}>

          {/* Section 1: Plug & Play Integrations */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 md:gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 lg:pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span>Plug</span>{' '}
                    <span>&</span>{' '}
                    <span>Play</span>{' '}
                    <span className="gradient-text">Integrations</span>
                  </h2>

                  <p className="text-xl text-gray-600 mb-8">
                    Seamlessly fits into your existing tools.
                  </p>

                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.5 2a.5.5 0 00-.5.5v3a.5.5 0 001 0V3.707l1.146 1.147a.5.5 0 00.708-.708L13.5 2.793V2.5a.5.5 0 00-.5-.5zM7.5 18a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v2.293l-1.146-1.147a.5.5 0 00-.708.708L6.5 17.207v.293a.5.5 0 00.5.5zM2.5 7.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H3.707l1.147 1.146a.5.5 0 01-.708.708L2.793 8.5H2.5a.5.5 0 01-.5-.5zM17.5 12.5a.5.5 0 01-.5.5h-3a.5.5 0 010-1h2.293l-1.147-1.146a.5.5 0 01.708-.708L17.207 11.5h.293a.5.5 0 01.5.5z" />
                        </svg>
                      </div>
                      Website widget (API, iframe or overlay)
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      CRM & ERP connectors (Salesforce, HubSpot, NetSuite…)
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      </div>
                      Chat channels (Slack, Teams, WhatsApp)
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Custom webhooks & REST endpoints
                    </li>
                  </ul>
                </div>

                <div className="w-full lg:w-1/2 mobile-full-width flex justify-center items-center">
                  <div className="section-image h-[440px] flex items-center justify-center -mt-8">
                    <LottieAnimation
                      animationData={integrationAnimationData}
                      loop={true}
                      autoplay={true}
                      style={{ width: '140%', height: '140%' }}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Conversion Engine */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 md:gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 lg:pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span className="bubble-text gradient-text">Conversion</span>{' '}
                    <span className="bubble-text text-white">Engine</span>
                  </h2>

                  <p className="text-xl text-white mb-8 bubble-text">
                    Every interaction drives outcomes.
                  </p>

                  <ul className="space-y-4 text-lg text-white">
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Built-in lead qualification flows
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Dynamic CTAs & auto-form fills
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      Automated follow-ups (email & WhatsApp)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      A/B tested conversation paths
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-orange-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      Programmed with Real Sales Training
                    </li>
                  </ul>
                </div>

                <div className="w-full lg:w-1/2 mobile-full-width flex justify-center items-center">

                  <div className="section-image h-[440px] flex items-center justify-center -mt-8">
                    <LottieAnimation
                      animationData={conversionAnimationData}
                      loop={true}
                      autoplay={true}
                      style={{ width: '90%', height: '90%' }}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Data-Driven Intelligence */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 md:gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 lg:pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span className="bubble-text">Data-Driven</span>{' '}
                    <span className="bubble-text gradient-text">Intelligence</span>
                  </h2>

                  <p className="text-xl text-gray-600 mb-8 bubble-text">
                    From chat logs to actionable insights.
                  </p>

                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                      Real-time dashboards & alerts
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-red-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      SKU & region under/over-performance flags
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Predictive sales & trend forecasts
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      On-demand executive summaries
                    </li>
                  </ul>
                </div>

                <div className="w-full lg:w-1/2 mobile-full-width flex justify-center items-center">
                  <div className="chatbot-container">
                    <Image
                      src="/assets/newimages/chatbot.webp"
                      alt="Data Intelligence Dashboard"
                      className="chatbot-image"
                      width={600}
                      height={600}
                      sizes="(max-width: 480px) 300px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
                      quality={85}
                      priority={true}
                      placeholder="blur"
                      blurDataURL="data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoIAAgAAkA4JaQAA3AA/vuUAAA="
                    />
                    <div className="chatbot-particles">
                      <div className="particle-dot dot-1"></div>
                      <div className="particle-dot dot-2"></div>
                      <div className="particle-dot dot-3"></div>
                      <div className="particle-dot dot-4"></div>
                      <div className="particle-dot dot-5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Continuous Learning & Compliance */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 md:gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 lg:pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span className="bubble-text text-white">Continuous Learning & </span>{' '}
                    <span className="bubble-text gradient-text">Compliance</span>
                  </h2>

                  <p className="text-xl text-white mb-8 bubble-text">
                    Smarter over time—secure by design.
                  </p>

                  <ul className="space-y-4 text-lg text-white">
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-pink-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 10-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Contextual memory & evolving vocabulary
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      Adaptive tone per audience segment
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      In-region hosting & GDPR/PECR compliant
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-gray-600 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Admin portal for prompts, overrides & training
                    </li>
                  </ul>
                </div>

                <div className="w-full lg:w-1/2 mobile-full-width flex justify-center items-center perspective-1000">
                  <div className="relative mt-12">  {/* Added mt-12 for margin-top */}
                    {/* Glow effect behind the image */}
                    <div className="absolute inset-0 w-96 h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

                    {/* Main rotating container */}
                    <div className="relative w-80 h-80 animate-rotate-3d">
                      {/* Inner glow ring */}
                      <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 border-2 border-cyan-400/30 animate-pulse"></div>

                      {/* Image with enhanced styling */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src="/assets/newimages/snake.webp"
                          alt="AI Learning System"
                          className="w-65 h-65 object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                          width={320}
                          height={320}
                          sizes="(max-width: 480px) 200px, (max-width: 768px) 260px, 320px"
                          quality={80}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoIAAgAAkA4JaQAA3AA/vuUAAA="
                        />
                      </div>

                      {/* Floating particles effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                        <div className="particle particle-4"></div>
                        <div className="particle particle-5"></div>
                        <div className="particle particle-6"></div>
                        <div className="particle particle-7"></div>
                        <div className="particle particle-8"></div>
                        <div className="particle particle-9"></div>
                        <div className="particle particle-10"></div>
                        <div className="particle particle-11"></div>
                        <div className="particle particle-12"></div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Simple Call-to-Action Section */}
      <section id="cta" className="relative h-[50vh] bg-white/40 flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/bots/cta_bot.webp"
          alt="Call to Action Background"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
          quality={75}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoIAAgAAkA4JaQAA3AA/vuUAAA="
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-2xl px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to transform your conversations?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8">Book a free Byte-Bots Consultation and see how AI can power your business.</p>
          <Link
            href="/contact"
            data-cta="true"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            Book Your Consultation Now
          </Link>
        </div>
      </section>
      </div>
    </>
  );
};

export default ByteBotLanding;