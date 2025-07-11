import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// Module-level flag to track if the count-up animation already completed.
let hasAnimatedNumbers = false;

export const NumbersSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isIphonePro, setIsIphonePro] = useState(false);

  useEffect(() => {
    // Detect iPhone 14 Pro/15 Pro/16 Pro and similar devices
    const ua = window.navigator.userAgent;
    // iPhone 14 Pro/15 Pro/16 Pro all have 'iPhone' and 'OS 16' or later, and a high devicePixelRatio
    const isIphone = /iPhone/.test(ua);
    const isModernIOS = /OS 1[6-9]_/.test(ua) || /OS 2[0-9]_/.test(ua); // iOS 16+
    const isProScreen = window.devicePixelRatio >= 3 && window.screen.height >= 780;
    if (isIphone && isModernIOS && isProScreen) {
      setIsIphonePro(true);
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on how much of the section is visible
      // Start scaling when section enters viewport, finish when fully visible
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    {
      target: 2,
      suffix: "+",
      label: "Years of Continual Excellence",
      color: "text-fuchsia-500",
    },
    {
      target: 300,
      suffix: "+",
      label: "Successful Projects Deployed",
      color: "text-lime-300",
    },
    {
      target: 90,
      suffix: "+",
      label: "Employees",
      color: "text-lime-300",
    },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const CountUp = ({ target, suffix }: { target: number; suffix?: string }) => {
    const [count, setCount] = useState(() => (hasAnimatedNumbers ? target : 0));

    useEffect(() => {
      // If animation has already been completed earlier, just ensure final value is shown
      if (hasAnimatedNumbers) {
        setCount(target);
        return;
      }

      const duration = 2000; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentVal = Math.floor(progress * target);
        setCount(currentVal);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Mark as done so it never animates again during this page lifetime
          hasAnimatedNumbers = true;
        }
      };

      requestAnimationFrame(animate);
    }, [target]);

    return (
      <span>
        {formatNumber(count)}
        {suffix}
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="numbers"
      className={`relative w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col numbers-bg-mobile md:numbers-bg-desktop${isIphonePro ? ' iphone-pro-fix' : ''}`}
    >
      {/* Overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative container mx-auto px-4 flex flex-col lg:flex-row items-center gap-10 lg:justify-between min-h-[80vh] lg:min-h-0 justify-center text-center lg:text-left">
        {/* Headline & CTA */}
        <div className="w-full max-w-lg text-white flex flex-col items-center lg:items-start text-center lg:text-left px-2">
          <h2 className="break-words text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold leading-snug sm:leading-tight">
            Advancing Success{' '}
            <br className="hidden sm:block" />
            With Technology For{' '}
            <br className="hidden sm:block" /> 
            Every Customer
          </h2>

          <a
            href="/contact"
            className="inline-flex items-center mt-6 md:mt-10 px-10 py-3 text-white font-semibold rounded-full shadow-lg bg-[#0476B5] hover:bg-[#03269a] hover:scale-105 transition-all duration-300 mx-auto lg:mx-0"
          >
            Get in Touch &raquo;
          </a>
        </div>

        {/* Enhanced 3D Cube with Orbit */}
        <div 
          className="relative flex-shrink-0 w-64 md:w-96 lg:w-[28rem] h-64 md:h-96 lg:h-[28rem] flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${0.3 + (scrollProgress * 0.7)})`,
            opacity: scrollProgress * 0.8 + 0.2
          }}
        >
          {/* Oval Orbit Ring */}
          <div 
            className="absolute inset-0 border-2 border-white/40 animate-spin-slow orbit-oval"
            style={{
              transform: `rotateX(60deg) rotateY(0deg) scale(${0.3 + (scrollProgress * 0.7)})`,
              opacity: scrollProgress * 0.6 + 0.4
            }}
          >
            <div className="absolute orbital-particle">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg shadow-white/50"></div>
            </div>
          </div>

          {/* Secondary Orbit Ring */}
          <div 
            className="absolute inset-4 rounded-full border border-purple-400/20 animate-spin-reverse"
            style={{
              transform: `scale(${0.3 + (scrollProgress * 0.7)})`,
              opacity: scrollProgress * 0.5 + 0.3
            }}
          >
            <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* 3D Cube Container */}
          <div 
            className="relative transform-gpu perspective-1000"
            style={{
              transform: `scale(${0.3 + (scrollProgress * 0.7)})`,
              opacity: scrollProgress * 0.7 + 0.3
            }}
          >
            <div className="cube-container animate-float">
              <Image
                src="/assets/numbers/cube.png"
                alt="Decorative Cube"
                width={500}
                height={500}
                priority
                className="w-full h-auto drop-shadow-2xl transform-gpu"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) drop-shadow(0 0 20px rgba(236,72,153,0.2))',
                  transform: 'rotateX(5deg) rotateY(-5deg) rotateZ(1deg)',
                }}
              />
            </div>
          </div>

          {/* Floating Particles */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `scale(${0.3 + (scrollProgress * 0.7)})`,
              opacity: scrollProgress * 0.8 + 0.2
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-ping`}
                style={{
                  top: `${20 + (i * 15)}%`,
                  left: `${15 + (i * 12)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + (i * 0.3)}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative container mx-auto px-2 py-6 md:py-8 grid grid-cols-3 gap-4 md:gap-0 text-center">
        {stats.map(({ target, suffix, label, color }, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center ${
              idx !== stats.length - 1 ? "md:border-r md:border-gray-600/40" : ""
            } px-4 md:px-8`}
          >
            <span className={`text-3xl sm:text-4xl lg:text-6xl font-extrabold ${color}`}>
              <CountUp target={target} suffix={suffix} />
            </span>
            <span className="mt-2 text-sm sm:text-base text-gray-200 max-w-[10rem] md:max-w-none">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateX(5deg) rotateY(-5deg) rotateZ(1deg); }
          50% { transform: translateY(-10px) rotateX(8deg) rotateY(-8deg) rotateZ(2deg); }
        }
        
        @keyframes orbit-3d {
          0% { 
            transform: rotateY(0deg) translateX(200px) rotateY(0deg) translateZ(0px);
            opacity: 1;
          }
          25% { 
            transform: rotateY(90deg) translateX(200px) rotateY(-90deg) translateZ(100px);
            opacity: 0.7;
          }
          50% { 
            transform: rotateY(180deg) translateX(200px) rotateY(-180deg) translateZ(0px);
            opacity: 1;
          }
          75% { 
            transform: rotateY(270deg) translateX(200px) rotateY(-270deg) translateZ(-100px);
            opacity: 0.4;
          }
          100% { 
            transform: rotateY(360deg) translateX(200px) rotateY(-360deg) translateZ(0px);
            opacity: 1;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .orbit-oval {
          border-radius: 50%;
          transform: rotateX(60deg) rotateY(0deg);
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
          animation: none;
        }
        
        .orbital-particle {
          animation: orbit-3d 8s linear infinite;
          transform-style: preserve-3d;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .cube-container {
          transform-style: preserve-3d;
        }
        .numbers-bg-mobile {
          background-image: url('/assets/numbers/numbers14pro_bg.png');
        }
        .numbers-bg-desktop {
          background-image: url('/assets/numbers/numbers_bg.png');
        }
        .iphone-pro-fix {
          padding-bottom: env(safe-area-inset-bottom);
          min-height: 100vh;
          background-size: cover;
          background-position: center;
        }
      `}</style>
    </section>
  );
};