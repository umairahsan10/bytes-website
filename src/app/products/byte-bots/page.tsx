"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/sections/Navbar';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ByteBotLanding: React.FC = () => {
  const SPLINE_URL = "https://prod.spline.design/9PHyBBLVfpx0pW9E/scene.splinecode";
  const heroRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const horizontalSectionsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize particles effect
    const initParticles = () => {
      if (!particlesRef.current) return;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      particlesRef.current.appendChild(canvas);
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
      }> = [];
      
      // Create particles
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
          ctx.fill();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 * (1 - distance / 150)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });
        
        requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (particlesRef.current?.contains(canvas)) {
          particlesRef.current.removeChild(canvas);
        }
      };
    };

    // Initialize animations
    const initAnimations = () => {
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

      // Horizontal scrolling sections
      const sections = gsap.utils.toArray(".content-section") as HTMLElement[];
      const horizontalContainer = horizontalSectionsRef.current;
      
      if (sections.length > 0 && horizontalContainer) {
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".section-container",
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + (horizontalContainer.offsetWidth - window.innerWidth)
          }
        });

        // Section content animations
        sections.forEach((section) => {
          const bubbleTexts = section.querySelectorAll('.bubble-text');
          const sectionImage = section.querySelector('.section-image');
          
          gsap.set(bubbleTexts, { opacity: 0, y: 30 });
          if (sectionImage) gsap.set(sectionImage, { opacity: 0, x: 100, scale: 0.9 });
          
          ScrollTrigger.create({
            trigger: section,
            start: "left center",
            end: "right center",
            onEnter: () => {
              gsap.to(bubbleTexts, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "back.out(1.7)"
              });
              
              if (sectionImage) {
                gsap.to(sectionImage, {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.8,
                  ease: "power2.out"
                });
              }
            }
          });
        });
      }

      // Add scroll anchors for CTA section images
      const ctaImages = gsap.utils.toArray(".action-card img") as HTMLElement[];
      
      ctaImages.forEach((img, index) => {
        gsap.set(img, { opacity: 0, y: 50, scale: 0.95 });
        
        ScrollTrigger.create({
          trigger: img.closest('.action-card'),
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(img, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power2.out"
            });
          },
          onLeave: () => {
            gsap.to(img, {
              opacity: 0.8,
              scale: 0.98,
              duration: 0.3
            });
          },
          onEnterBack: () => {
            gsap.to(img, {
              opacity: 1,
              scale: 1,
              duration: 0.3
            });
          }
        });
      });

      // Add parallax effect to hero canvas
      if (heroCanvasRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(heroCanvasRef.current, {
              y: progress * 100,
              rotation: progress * 5,
              duration: 0.3,
              ease: "none"
            });
          }
        });
      }
    };

    const particlesCleanup = initParticles();
    initAnimations();

    // Load Spline bot in hero
    let splineApp: any = null;
    let isComponentMounted = true;
    
    (async () => {
      if (!heroCanvasRef.current || !isComponentMounted) return;
      try {
        const { Application } = await import('@splinetool/runtime');
        
        // Override console.error temporarily to suppress Spline runtime errors
        const originalError = console.error;
        console.error = (...args) => {
          const message = args.join(' ');
          if (message.includes('Missing property') || message.includes('buildTimeline')) {
            // Suppress Spline runtime errors that don't affect functionality
            return;
          }
          originalError(...args);
        };
        
        splineApp = new Application(heroCanvasRef.current);
        await splineApp.load(SPLINE_URL);
        
        // Restore original console.error
        console.error = originalError;
        
        // Hide Spline watermark
        setTimeout(() => {
          const badge = document.querySelector('a[aria-label="Built with Spline"]') as HTMLElement | null;
          if (badge) badge.style.display = 'none';
        }, 100);
      } catch (err) {
        // Only log actual loading errors, not animation property warnings
        if (err instanceof Error && !err.message.includes('Missing property')) {
          console.warn('Spline load error', err);
        }
      }
    })();

    // Cleanup function
    return () => {
      isComponentMounted = false;
      if (particlesCleanup) particlesCleanup();
      if (splineApp) {
        try {
          splineApp.dispose?.();
        } catch {
          // Ignore disposal errors
        }
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleRippleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
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
  };

  return (
    <div className="font-inter overflow-x-hidden bg-black">
      <Header />
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .particles-container {
          background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .glowing-bot {
          filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.3));
          transition: all 0.3s ease;
        }
        
        .glowing-bot:hover {
          filter: drop-shadow(0 0 50px rgba(0, 255, 255, 0.5));
          transform: scale(1.05);
        }
        
        .cta-button {
          background: linear-gradient(45deg, #00d4ff, #5b73ff);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.3);
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .cta-button:hover::before {
          left: 100%;
        }
        
        .section-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .horizontal-sections {
          display: flex;
          width: 400vw;
        }
        
        .content-section {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
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
        
        @media (max-width: 768px) {
          .horizontal-sections {
            flex-direction: column;
            width: 100vw;
            height: auto;
          }
          
          .content-section {
            width: 100vw;
            min-height: auto;
            flex-direction: column;
            padding: 40px 20px;
          }
          
          .mobile-full-width {
            width: 100% !important;
            margin-bottom: 40px;
          }
          
          .action-card {
            margin-bottom: 1rem;
          }
          
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
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
          
          .cta-button {
            font-size: 0.875rem !important;
            height: 2.75rem !important;
            max-width: 180px !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <div ref={particlesRef} className="particles-container absolute inset-0 z-1"></div>
        <div className="tech-grid"></div>
        
        <div className="hero-content container mx-auto px-6 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              <span className="bubble-text gradient-text">Byte</span>{' '}
              <span className="bubble-text">Bot</span>
            </h1>
            
            <p className="text-2xl md:text-4xl text-gray-300 mb-8 font-light">
              <span className="bubble-text">The</span>{' '}
              <span className="bubble-text">Future</span>{' '}
              <span className="bubble-text">of</span>{' '}
              <span className="bubble-text">Conversation</span>
            </p>
            
            <p className="text-xl md:text-2xl text-cyan-400 mb-12 font-medium">
              <span className="bubble-text">Powered</span>{' '}
              <span className="bubble-text">by</span>{' '}
              <span className="bubble-text">Real</span>{' '}
              <span className="bubble-text">Business</span>{' '}
              <span className="bubble-text">Intelligence</span>
            </p>
            
            <div className="bot-container mb-12">
              <canvas
                ref={heroCanvasRef}
                className="glowing-bot w-96 h-96 mx-auto"
              />
            </div>
          </div>
        </div>
        
        <div className="floating-shapes">
          <div className="shape w-20 h-20 bg-cyan-400 rounded-full"></div>
          <div className="shape w-16 h-16 bg-blue-500 rounded-lg"></div>
          <div className="shape w-12 h-12 bg-purple-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
        </div>
      </section>

      {/* Horizontal Scrolling Sections */}
      <div className="section-container relative overflow-hidden">
        <div className="horizontal-sections" ref={horizontalSectionsRef}>
          
          {/* Section 1: Plug & Play Integrations */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="w-1/2 pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span className="bubble-text">Plug</span>{' '}
                    <span className="bubble-text">&</span>{' '}
                    <span className="bubble-text">Play</span>{' '}
                    <span className="bubble-text gradient-text">Integrations</span>
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-8 bubble-text">
                    Seamlessly fits into your existing tools.
                  </p>
                  
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.5 2a.5.5 0 00-.5.5v3a.5.5 0 001 0V3.707l1.146 1.147a.5.5 0 00.708-.708L13.5 2.793V2.5a.5.5 0 00-.5-.5zM7.5 18a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v2.293l-1.146-1.147a.5.5 0 00-.708.708L6.5 17.207v.293a.5.5 0 00.5.5zM2.5 7.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H3.707l1.147 1.146a.5.5 0 01-.708.708L2.793 8.5H2.5a.5.5 0 01-.5-.5zM17.5 12.5a.5.5 0 01-.5.5h-3a.5.5 0 010-1h2.293l-1.147-1.146a.5.5 0 01.708-.708L17.207 11.5h.293a.5.5 0 01.5.5z"/>
                        </svg>
                      </div>
                      Website widget (API, iframe or overlay)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      CRM & ERP connectors (Salesforce, HubSpot, NetSuite…)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                        </svg>
                      </div>
                      Chat channels (Slack, Teams, WhatsApp)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Custom webhooks & REST endpoints
                    </li>
                  </ul>
                </div>
                
                <div className="w-1/2 mobile-full-width">
                  <img 
                    src="/bots/alex-knight-2EJCSULRwC8-unsplash.jpg" 
                    alt="Integration Dashboard" 
                    className="section-image w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 2: Conversion Engine */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="w-1/2 pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span className="bubble-text gradient-text">Conversion</span>{' '}
                    <span className="bubble-text">Engine</span>
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-8 bubble-text">
                    Every interaction drives outcomes.
                  </p>
                  
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Built-in lead qualification flows
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Dynamic CTAs & auto-form fills
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                        </svg>
                      </div>
                      Automated follow-ups (email & WhatsApp)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      A/B tested conversation paths
                    </li>
                  </ul>
                </div>
                
                <div className="w-1/2 mobile-full-width">
                  <img 
                    src="/bots/mohamed-nohassi-2iUrK025cec-unsplash.jpg" 
                    alt="Conversion Analytics" 
                    className="section-image w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 3: Data-Driven Intelligence */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="w-1/2 pr-12 mobile-full-width">
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
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                        </svg>
                      </div>
                      Real-time dashboards & alerts
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-red-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      SKU & region under/over-performance flags
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Predictive sales & trend forecasts
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      On-demand executive summaries
                    </li>
                  </ul>
                </div>
                
                <div className="w-1/2 mobile-full-width">
                  <img 
                    src="/bots/mohamed-nohassi-9Ge8ngH6JeQ-unsplash.jpg" 
                    alt="Data Intelligence Dashboard" 
                    className="section-image w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 4: Continuous Learning & Compliance */}
          <div className="content-section">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="w-1/2 pr-12 mobile-full-width">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    <span className="bubble-text">Continuous</span>{' '}
                    <span className="bubble-text">Learning</span>{' '}
                    <span className="bubble-text">&</span>{' '}
                    <span className="bubble-text gradient-text">Compliance</span>
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-8 bubble-text">
                    Smarter over time—secure by design.
                  </p>
                  
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-pink-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Contextual memory & evolving vocabulary
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                        </svg>
                      </div>
                      Adaptive tone per audience segment
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      In-region hosting & GDPR/PECR compliant
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-gray-600 rounded-full mr-4 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Admin portal for prompts, overrides & training
                    </li>
                  </ul>
                </div>
                
                <div className="w-1/2 mobile-full-width">
                  <img 
                    src="/bots/yuyang-liu-dp9Jrww_BRs-unsplash.jpg" 
                    alt="AI Learning System" 
                    className="section-image w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <section ref={ctaRef} id="cta" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            <span className="bubble-text">Ready</span>{' '}
            <span className="bubble-text">to</span>{' '}
            <span className="bubble-text">transform</span>{' '}
            <span className="bubble-text">your</span>{' '}
            <span className="bubble-text gradient-text">business</span>{' '}
            <span className="bubble-text gradient-text">conversations?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            <div className="action-card rounded-2xl overflow-hidden flex flex-col h-full min-h-[400px]">
              <div className="h-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop&crop=center" 
                  alt="Book a Demo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex-grow text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Book a Demo</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-6">See Byte Bot in action with a personalized demonstration</p>
                </div>
                <button
                  className="cta-button w-full max-w-[200px] mx-auto h-12 text-sm md:text-lg font-semibold text-white rounded-full flex items-center justify-center"
                  onClick={handleRippleEffect}
                >
                  Book a Demo
                </button>
              </div>
            </div>

            <div className="action-card rounded-2xl overflow-hidden flex flex-col h-full min-h-[400px]">
              <div className="h-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop&crop=center" 
                  alt="Request Proposal" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex-grow text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Request a Proposal</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-6">Get a tailored plan and pricing for your organisation</p>
                </div>
                <button
                  className="cta-button w-full max-w-[200px] mx-auto h-12 text-sm md:text-lg font-semibold text-white rounded-full flex items-center justify-center"
                  onClick={handleRippleEffect}
                >
                  Request Proposal
                </button>
              </div>
            </div>

            <div className="action-card rounded-2xl overflow-hidden flex flex-col h-full min-h-[400px]">
              <div className="h-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?w=400&h=200&fit=crop&crop=center" 
                  alt="Start Free Trial" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex-grow text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Start Your Free Trial</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-6">Experience Byte Bot with full features for 14 days</p>
                </div>
                <button
                  className="cta-button w-full max-w-[200px] mx-auto h-12 text-sm md:text-lg font-semibold text-white rounded-full flex items-center justify-center"
                  onClick={handleRippleEffect}
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ByteBotLanding;