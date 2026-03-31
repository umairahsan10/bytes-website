"use client";
import { useEffect, useRef } from "react";

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
      style={{
        background:
          "linear-gradient(135deg, #050816 0%, #0f0a2e 50%, #050816 100%)",
        animation: "gradient-shift 8s ease-in-out infinite",
      }}
    >
      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-accent/[0.15] blur-[200px]" />
      </div>

      <div className="cta-content relative z-10 text-center px-6 max-w-3xl">
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
