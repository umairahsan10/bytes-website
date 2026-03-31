"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

const taglines = [
  "Web Apps · SaaS · CRM Systems",
  "SEO Growth · Performance Optimization",
  "UI/UX Design · Brand Identity",
  "Full Stack Development · Cloud",
  "E-Commerce · Custom Portals",
];

function AutoTyper() {
  const [displayed, setDisplayed] = useState("");
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const tick = useCallback(() => {
    const current = taglines[taglineIdx];
    if (!isDeleting) {
      const next = current.slice(0, displayed.length + 1);
      setDisplayed(next);
      if (next === current) {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
      timeoutRef.current = setTimeout(tick, 70);
    } else {
      const next = current.slice(0, displayed.length - 1);
      setDisplayed(next);
      if (next === "") {
        setIsDeleting(false);
        setTaglineIdx((prev) => (prev + 1) % taglines.length);
        timeoutRef.current = setTimeout(tick, 400);
        return;
      }
      timeoutRef.current = setTimeout(tick, 35);
    }
  }, [displayed, taglineIdx, isDeleting]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, 100);
    return () => clearTimeout(timeoutRef.current);
  }, [tick]);

  return (
    <span className="font-mono text-sm md:text-base text-cyan inline-block min-h-[1.5em]">
      {displayed}
      <span className="inline-block w-[2px] h-[1.1em] bg-cyan ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    import("gsap").then(({ default: gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      document.querySelectorAll(".hero-word").forEach((word, i) => {
        tl.fromTo(
          word,
          { opacity: 0, y: 80, rotateX: 50, scale: 0.9 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.8 },
          0.15 + i * 0.12
        );
      });

      tl.fromTo(
        ".hero-typer",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        ">-0.1"
      );
      tl.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        ">-0.2"
      );
      tl.fromTo(
        ".hero-3d",
        { opacity: 0, scale: 0.6, x: 60 },
        { opacity: 1, scale: 1, x: 0, duration: 1.4, ease: "power2.out" },
        0.3
      );
    });
  }, []);

  const headlineWords = ["Full", "Stack", "Digital", "Power", "House"];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      id="hero"
    >
      {/* Particles */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <ParticleField />
      </div>

      <div className="relative z-10 max-w-content mx-auto w-full px-6 md:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          {/* Headline */}
          <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-4 tracking-tight">
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className={`hero-word opacity-0 inline-block mr-4 ${
                  word === "Digital" || word === "Power"
                    ? "gradient-text"
                    : "text-white"
                }`}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Auto-typing tagline */}
          <div className="hero-typer opacity-0 mb-10">
            <AutoTyper />
          </div>

          {/* Buttons */}
          <div className="hero-buttons opacity-0 flex flex-wrap gap-5">
            <a
              href="#projects"
              className="group relative px-8 py-4 bg-accent text-white rounded-xl font-heading font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(145,94,255,0.4)] hover:scale-105"
            >
              <span className="relative z-10">Our Projects</span>
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-heading font-semibold text-lg backdrop-blur-sm hover:border-accent hover:text-accent transition-all duration-300 hover:scale-105"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>

        {/* Right — 3D */}
        <div className="hero-3d opacity-0 h-[400px] lg:h-[520px] hidden md:block relative">
          <HeroCanvas />
        </div>
      </div>
    </section>
  );
}
