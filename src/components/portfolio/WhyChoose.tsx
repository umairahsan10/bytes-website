"use client";
import { useEffect, useRef } from "react";

const differentiators = [
  {
    number: "01",
    title: "Custom Solutions Over Templates",
    description:
      "Every system is built from scratch, tailored to your exact business needs. No shortcuts.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Data-Driven at Every Step",
    description:
      "Decisions backed by analytics, user behavior data, and measurable outcomes — not guesswork.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "End-to-End Ownership",
    description:
      "From strategy to deployment to maintenance — we own the entire stack, so you can focus on growth.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Long-Term Partnership Model",
    description:
      "We don't disappear after launch. Ongoing support, iteration, and scaling are built into our model.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Transparent Communication",
    description:
      "Real-time updates, clear timelines, and honest conversations. No black boxes.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const techStack = [
  "React",
  "Next.js",
  "Node.js",
  "WordPress",
  "Shopify",
  "Webflow",
  "PostgreSQL",
  "Stripe",
  "AWS",
  "Figma",
];

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>(".why-block").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          ".why-block",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative min-h-screen py-[120px]"
    >
      <div className="max-w-content mx-auto px-6 md:px-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-cyan block mb-3">
            Why Us
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
            Built Different. Delivered Different.
          </h2>
        </div>

        {/* Differentiator blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {differentiators.map((d) => (
            <div
              key={d.number}
              className="why-block relative p-6 md:p-8 rounded-2xl bg-white/[0.02] border-l-2 border-accent overflow-hidden"
              style={{ opacity: 0, transform: "translateY(40px)" }}
            >
              {/* Large faint number */}
              <span className="absolute top-2 right-4 font-heading text-8xl font-bold text-white/[0.04] select-none">
                {d.number}
              </span>

              <div className="relative z-10">
                <div className="text-white mb-4">{d.icon}</div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {d.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {d.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Marquee */}
        <div className="overflow-hidden relative group">
          <div className="flex animate-marquee-left group-hover:[animation-play-state:paused]">
            {[...techStack, ...techStack].map((tech, i) => (
              <span
                key={i}
                className="flex-shrink-0 px-6 py-3 mx-3 rounded-full border border-white/10 text-muted font-mono text-sm whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
