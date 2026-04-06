"use client";
import { useEffect, useRef } from "react";

interface Neuron { x: number; y: number; vx: number; vy: number; r: number; opacity: number }

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
    const COUNT = 60;

    const resize = () => {
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (neurons.length === 0) {
        neurons = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1 + Math.random() * 1.5,
          opacity: 0.12 + Math.random() * 0.2,
        }));
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of neurons) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / LINK_DIST) * 0.08})`;
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

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] pointer-events-none" style={{ opacity: 0.7 }} />
  );
}

export default function FinalCTA() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Magnetic button effect
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
      } else {
        btn.style.transform = "translate(0,0)";
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          ".cta-content > *",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
          }
        );
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#050816" }}
    >
      <NeuronField />

      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
        <div className="w-[800px] h-[800px] rounded-full bg-accent/[0.15] blur-[200px]" />
      </div>

      <div className="cta-content relative z-[2] text-center px-6 max-w-3xl">
        <span className="font-mono text-sm text-cyan block mb-4">
          Ready to Build?
        </span>

        <h2
          className="glitch font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight mb-6"
          data-text="Let's Build Something Powerful Together"
        >
          Let&apos;s Build Something Powerful Together
        </h2>

        <p className="text-muted text-lg mb-10">
          Tell us what you need. We&apos;ll handle the rest.
        </p>

        {/* CTA Button */}
        <a
          ref={buttonRef}
          href="#"
          className="relative inline-flex items-center justify-center px-12 py-[18px] bg-accent text-white font-heading font-semibold text-lg rounded-xl hover:bg-cyan transition-colors duration-300 overflow-hidden group"
          style={{ transition: "transform 0.2s ease-out, background-color 0.3s" }}
        >
          {/* Shimmer */}
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </span>
          <span className="relative z-10">Book a Discovery Call</span>
        </a>

        <p className="mt-6">
          <a
            href="#"
            className="text-muted text-sm hover:text-white transition-colors duration-200"
          >
            Or send us a message →
          </a>
        </p>
      </div>
    </section>
  );
}
