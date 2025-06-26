"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    };

    const particlesCleanup = initParticles();
    initAnimations();

    // Load Spline bot in hero
    let splineApp: any = null;
    (async () => {
      if (!heroCanvasRef.current) return;
      try {
        const { Application } = await import('@splinetool/runtime');
        splineApp = new Application(heroCanvasRef.current);
        await splineApp.load(SPLINE_URL);
        const badge = document.querySelector('a[aria-label="Built with Spline"]') as HTMLElement | null;
        if (badge) badge.style.display = 'none';
      } catch (err) {
        console.warn('Spline load error', err);
      }
    })();

    // Cleanup function
    return () => {
      if (particlesCleanup) particlesCleanup();
      if (splineApp) splineApp.dispose?.();
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
        }
      `}</style>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
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
      <div className="section-container bg-white relative overflow-hidden">
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
                        <span className="text-white text-xs">🔌</span>
                      </div>
                      Website widget (API, iframe or overlay)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">🔗</span>
                      </div>
                      CRM & ERP connectors (Salesforce, HubSpot, NetSuite…)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">💬</span>
                      </div>
                      Chat channels (Slack, Teams, WhatsApp)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">⚡</span>
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
          <div className="content-section bg-gray-50">
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
                        <span className="text-white text-xs">💰</span>
                      </div>
                      Built-in lead qualification flows
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">🎯</span>
                      </div>
                      Dynamic CTAs & auto-form fills
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">📧</span>
                      </div>
                      Automated follow-ups (email & WhatsApp)
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">🛣️</span>
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
                        <span className="text-white text-xs">📊</span>
                      </div>
                      Real-time dashboards & alerts
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-red-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">🚩</span>
                      </div>
                      SKU & region under/over-performance flags
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-purple-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">🔮</span>
                      </div>
                      Predictive sales & trend forecasts
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">📄</span>
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
          <div className="content-section bg-gray-50">
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
                        <span className="text-white text-xs">🧠</span>
                      </div>
                      Contextual memory & evolving vocabulary
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">👥</span>
                      </div>
                      Adaptive tone per audience segment
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-green-500 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">🛡️</span>
                      </div>
                      In-region hosting & GDPR/PECR compliant
                    </li>
                    <li className="flex items-center bubble-text">
                      <div className="w-6 h-6 bg-gray-600 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-white text-xs">⚙️</span>
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
      <section ref={ctaRef} id="cta" className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            <span className="bubble-text">Ready</span>{' '}
            <span className="bubble-text">to</span>{' '}
            <span className="bubble-text">transform</span>{' '}
            <span className="bubble-text">your</span>{' '}
            <span className="bubble-text gradient-text">business</span>{' '}
            <span className="bubble-text gradient-text">conversations?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="action-card p-8 rounded-2xl text-center">
              <div className="action-icon text-5xl mb-6">📞</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book a Demo</h3>
              <p className="text-gray-600 mb-6">See Byte Bot in action with a personalized demonstration</p>
              <button
                className="cta-button px-8 py-3 text-lg font-semibold text-white rounded-full"
                onClick={handleRippleEffect}
              >
                Book a Demo
              </button>
            </div>

            <div className="action-card p-8 rounded-2xl text-center">
              <div className="action-icon text-5xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Request a Proposal</h3>
              <p className="text-gray-600 mb-6">Get a tailored plan and pricing for your organisation</p>
              <button
                className="cta-button px-8 py-3 text-lg font-semibold text-white rounded-full"
                onClick={handleRippleEffect}
              >
                Request Proposal
              </button>
            </div>

            <div className="action-card p-8 rounded-2xl text-center">
              <div className="action-icon text-5xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Free Trial</h3>
              <p className="text-gray-600 mb-6">Experience Byte Bot with full features for 14 days</p>
              <button
                className="cta-button px-8 py-3 text-lg font-semibold text-white rounded-full"
                onClick={handleRippleEffect}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ByteBotLanding;