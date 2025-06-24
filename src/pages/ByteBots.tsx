"use client";

import { useEffect, useRef } from "react";

// Spline canvas loader component
const SPLINE_URL = "https://prod.spline.design/9PHyBBLVfpx0pW9E/scene.splinecode";

const BotCanvas = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let app: any;
    (async () => {
      const { Application } = await import("@splinetool/runtime");
      if (canvasRef.current) {
        app = new Application(canvasRef.current);
        try {
          await app.load(SPLINE_URL);
          // Hide watermark per canvas
          const badge = document.querySelector('a[aria-label="Built with Spline"]') as HTMLElement | null;
          if (badge) badge.style.display = "none";
        } catch (err) {
          console.warn("Spline runtime warning:", err);
        }
      }
    })();

    return () => {
      try {
        app?.dispose?.();
      } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ borderRadius: '12px' }}
    />
  );
};

export default function ByteBotsPage() {
  const botRef = useRef<HTMLDivElement>(null);
  const heroTargetRef = useRef<HTMLDivElement>(null);
  const chatTargetRef = useRef<HTMLDivElement>(null);
  const contentTargetRef = useRef<HTMLDivElement>(null);
  const dataTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      // Load GSAP from CDN
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      document.head.appendChild(gsapScript);

      const scrollTriggerScript = document.createElement('script');
      scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      document.head.appendChild(scrollTriggerScript);

      return new Promise((resolve) => {
        scrollTriggerScript.onload = resolve;
      });
    };

    loadGSAP().then(() => {
      // @ts-ignore
      const { gsap } = window;
      // @ts-ignore
      gsap.registerPlugin(window.ScrollTrigger);

      if (!botRef.current) return;

      const bot = botRef.current;
      const targets = [heroTargetRef.current, chatTargetRef.current, contentTargetRef.current, dataTargetRef.current];

      // Set initial position to hero
      if (heroTargetRef.current) {
        const heroRect = heroTargetRef.current.getBoundingClientRect();
        const heroTop = heroRect.top + window.scrollY;
        gsap.set(bot, {
          position: 'absolute',
          left: heroRect.left,
          top: heroTop,
          width: heroRect.width,
          height: heroRect.height,
          zIndex: 1000
        });
      }

      // Create timeline for smooth transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Smooth scrubbing
          onUpdate: (self) => {
            const progress = self.progress;
            const totalSections = targets.length;
            const sectionProgress = progress * (totalSections - 1);
            const currentSection = Math.floor(sectionProgress);
            const nextSection = Math.min(currentSection + 1, totalSections - 1);
            const sectionBlend = sectionProgress - currentSection;

            if (targets[currentSection] && targets[nextSection]) {
              const currentRect = targets[currentSection].getBoundingClientRect();
              const nextRect = targets[nextSection].getBoundingClientRect();
              
              const currentTop = currentRect.top + window.scrollY;
              const nextTop = nextRect.top + window.scrollY;
              
              const interpolatedLeft = currentRect.left + (nextRect.left - currentRect.left) * sectionBlend;
              const interpolatedTop = currentTop + (nextTop - currentTop) * sectionBlend;
              const interpolatedWidth = currentRect.width + (nextRect.width - currentRect.width) * sectionBlend;
              const interpolatedHeight = currentRect.height + (nextRect.height - currentRect.height) * sectionBlend;

              gsap.set(bot, {
                left: interpolatedLeft,
                top: interpolatedTop,
                width: interpolatedWidth,
                height: interpolatedHeight
              });
            }
          }
        }
      });

      // Individual section triggers for extra smooth positioning
      targets.forEach((target, index) => {
        if (!target) return;
        
        // @ts-ignore
        window.ScrollTrigger.create({
          trigger: target.closest('section'),
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            const rect = target.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            gsap.to(bot, {
              duration: 0.8,
              ease: "power2.out",
              left: rect.left,
              top: top,
              width: rect.width,
              height: rect.height
            });
          }
        });
      });

      return () => {
        // @ts-ignore
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    });
  }, []);

  return (
    <main className="font-sans relative">
      {/* Floating Bot */}
      <div
        ref={botRef}
        className="fixed z-[1000] pointer-events-none"
        style={{ 
          willChange: 'transform, width, height',
          contain: 'layout style paint'
        }}
      >
        <BotCanvas />
      </div>

      {/* Hero Section */}
      <section className="relative bg-black text-white flex flex-col items-center justify-center py-24 px-4 overflow-hidden min-h-screen">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
            Byte&nbsp;Bot
          </span>
        </h1>
        <div 
          ref={heroTargetRef}
          className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-0"
        >
          {/* Invisible placeholder for positioning */}
        </div>
      </section>

      {/* Chatbot Feature Section */}
      <section className="bg-white text-gray-900 py-20 md:py-24 px-4 min-h-screen flex items-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          {/* Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Chat Support</h2>
            <p className="text-lg leading-relaxed">
              Byte&nbsp;Bot listens, understands, and responds to your customers in real-time. Harness natural-language processing to
              deliver accurate answers, route complex queries, and delight users 24/7 without human fatigue.
            </p>
          </div>
          {/* Bot Target */}
          <div className="flex-1 flex justify-center">
            <div 
              ref={chatTargetRef}
              className="w-full max-w-md h-[350px] md:h-[450px] opacity-0"
            >
              {/* Invisible placeholder for positioning */}
            </div>
          </div>
        </div>
      </section>

      {/* Content Generation Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 py-20 md:py-24 px-4 min-h-screen flex items-center">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl">
          {/* Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Instant Content Creation</h2>
            <p className="text-lg leading-relaxed">
              Transform ideas into blogs, emails, social captions, and more at lightning speed. Byte&nbsp;Bot crafts on-brand, SEO-friendly
              copy so your team can focus on strategy instead of drafting.
            </p>
          </div>
          {/* Bot Target */}
          <div className="flex-1 flex justify-center">
            <div 
              ref={contentTargetRef}
              className="w-full max-w-md h-[350px] md:h-[450px] opacity-0"
            >
              {/* Invisible placeholder for positioning */}
            </div>
          </div>
        </div>
      </section>

      {/* Data Insights Section */}
      <section className="bg-white text-gray-900 py-20 md:py-24 px-4 min-h-screen flex items-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          {/* Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Actionable Data Insights</h2>
            <p className="text-lg leading-relaxed">
              Leverage Byte&nbsp;Bot's analytics engine to uncover hidden patterns across conversations and content. Receive dashboards and
              alerts that turn raw data into decisions, boosting growth and customer satisfaction.
            </p>
          </div>
          {/* Bot Target */}
          <div className="flex-1 flex justify-center">
            <div 
              ref={dataTargetRef}
              className="w-full max-w-md h-[350px] md:h-[450px] opacity-0"
            >
              {/* Invisible placeholder for positioning */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}