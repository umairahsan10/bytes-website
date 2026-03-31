"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════
   NEURON FIELD CANVAS — connected particles background
   ═══════════════════════════════════════════════════════ */
interface Neuron { x: number; y: number; vx: number; vy: number; r: number; opacity: number; }

function NeuronField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let neurons: Neuron[] = [];
    const LINK_DIST = 140;
    const COUNT = 70;

    const resize = () => {
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (neurons.length === 0) {
        neurons = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: 1 + Math.random() * 1.5, opacity: 0.15 + Math.random() * 0.25,
        }));
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of neurons) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / LINK_DIST) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of neurons) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${n.opacity})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] pointer-events-none" style={{ opacity: 0.8 }} />;
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const tagline = "Innovating the Future Together";

  const startTyping = useCallback(() => {
    if (hasTyped) return;
    setHasTyped(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(tagline.slice(0, i));
      if (i >= tagline.length) {
        clearInterval(interval);
        setTimeout(() => setTypingDone(true), 600);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [hasTyped, tagline]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startTyping();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startTyping]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          ".about-visual",
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );

        gsap.fromTo(
          ".about-content > *",
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );


      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex items-center py-[120px] overflow-hidden"
      style={{ background: "#050816" }}
    >
      <NeuronField />

      <div className="relative z-10 max-w-content mx-auto w-full px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content — Left */}
        <div className="about-content">
          <span className="font-mono text-sm text-accent block mb-3">
            About Us
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {typedText}
            {!typingDone && (
              <span className="inline-block w-[3px] h-[1em] bg-accent ml-1 align-middle animate-blink" />
            )}
          </h2>
          {/* <p className="text-muted leading-relaxed mb-4">
            We&apos;re a passionate team of innovators, designers, and developers
            dedicated to crafting exceptional digital experiences that drive
            meaningful change.
          </p> */}
          <p className="text-muted leading-relaxed mb-6">
            Bytes Platform delivers custom websites, apps, SEO, marketing,
            chatbots, and tailored ERP/CRM solutions that fuel growth. We combine
            innovative design, seamless development, and transparent reporting
            with top-notch security and optimization. From strategy to launch, we
            provide end-to-end digital solutions built to scale — helping your
            brand dominate online with measurable results and zero compromises.
          </p>
        </div>

        {/* Visual — Cube with Orbital Rings — Right */}
        <div className="about-visual relative flex items-center justify-center order-first lg:order-last">
          {/* Subtle glow behind the cube */}
          <div className="absolute w-72 h-72 rounded-full bg-accent/20 blur-[100px] z-0" />
          <div className="absolute w-48 h-48 rounded-full bg-cyan/15 blur-[80px] translate-x-10 -translate-y-8 z-0" />
          
          {/* Cube + Ring wrapper — ring is sized relative to the cube */}
          <div className="relative z-10 w-64 md:w-80 lg:w-96">
            
            {/* Orbit ring — wraps snugly around the cube */}
            <div 
              className="absolute orbit-ring-wrapper"
              style={{
                top: '50%',
                left: '50%',
                width: '130%',
                height: '130%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="w-full h-full border border-white/30 rounded-full animate-about-spin-slow"
                style={{ transform: 'rotateX(65deg)' }}
              >
                <div className="absolute orbital-particle">
                  <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/70" />
                </div>
              </div>
            </div>

            {/* Second ring — slightly tighter, different tilt */}
            <div 
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: '120%',
                height: '120%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="w-full h-full border border-white/15 rounded-full animate-about-spin-reverse"
                style={{ transform: 'rotateX(70deg) rotateZ(20deg)' }}
              >
                <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Cube image */}
            <div className="relative transform-gpu about-perspective">
              <div className="cube-container animate-about-float">
                <Image
                  src="/portfolioo/numbers/cube.png"
                  alt="Decorative Cube"
                  width={500}
                  height={500}
                  priority
                  className="w-full h-auto transform-gpu"
                  style={{
                    filter: 'brightness(1.35) saturate(1.4) contrast(1.1)',
                  }}
                />
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-accent rounded-full animate-ping"
                  style={{
                    top: `${10 + i * 25}%`,
                    left: `${5 + i * 28}%`,
                    animationDelay: `${i * 0.6}s`,
                    animationDuration: `${2 + i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes about-spin-slow {
          from { transform: rotateX(60deg) rotateY(0deg) rotate(0deg); }
          to { transform: rotateX(60deg) rotateY(0deg) rotate(360deg); }
        }
        
        @keyframes about-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes about-float {
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
        
        .animate-about-spin-slow {
          animation: about-spin-slow 20s linear infinite;
        }
        
        .animate-about-spin-reverse {
          animation: about-spin-reverse 15s linear infinite;
        }
        
        .animate-about-float {
          animation: about-float 4s ease-in-out infinite;
        }
        
        .orbit-oval {
          border-radius: 50%;
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
        }
        
        .orbital-particle {
          animation: orbit-3d 8s linear infinite;
          transform-style: preserve-3d;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
        }
        
        .about-perspective {
          perspective: 1000px;
        }
        
        .cube-container {
          transform-style: preserve-3d;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }
      `}</style>
    </section>
  );
}
