"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Project {
  title: string;
  tagline: string;
  image: string;
  tech: string[];
}

const projects: Project[] = [
  {
    title: "Luxe Fashion Store",
    tagline: "E-commerce redesign that boosted conversions by 42%",
    image: "/portfolioo/projects/sdwoods.png",
    tech: ["Shopify", "Liquid", "JS"],
  },
  {
    title: "FinTech Dashboard",
    tagline: "Real-time analytics for 50k+ daily users",
    image: "/portfolioo/projects/Quantiva Screens-01.jpg",
    tech: ["React", "Node.js", "PostgreSQL"],
  },
  {
    title: "Dawg Team Platform",
    tagline: "Community hub connecting 10k+ members worldwide",
    image: "/portfolioo/projects/Dawg Team.jpg",
    tech: ["Next.js", "Tailwind", "GSAP"],
  },
  {
    title: "InteliMaint Systems",
    tagline: "Intelligent maintenance platform reducing downtime 60%",
    image: "/portfolioo/projects/Inteliimaint Screens-04.jpg",
    tech: ["React", "Three.js", "Framer"],
  },
  {
    title: "NeoBank Landing",
    tagline: "Conversion-optimized fintech landing page",
    image: "/portfolioo/projects/Quantiva Screens-01.jpg",
    tech: ["Next.js", "Tailwind", "GSAP"],
  },
  {
    title: "Organic Market",
    tagline: "Farm-to-table e-commerce with 3x revenue growth",
    image: "/portfolioo/projects/sdwoods.png",
    tech: ["WooCommerce", "Stripe"],
  },
  {
    title: "SaaS Analytics",
    tagline: "Data visualization suite for enterprise clients",
    image: "/portfolioo/projects/Dawg Team.jpg",
    tech: ["React", "D3.js", "PostgreSQL"],
  },
  {
    title: "Restaurant Chain",
    tagline: "Multi-location ordering system with 98% uptime",
    image: "/portfolioo/projects/Inteliimaint Screens-04.jpg",
    tech: ["WordPress", "ACF", "GSAP"],
  },
];

// Triple the items for seamless infinite loop
const loopedProjects = [...projects, ...projects, ...projects];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackBgRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const animRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef(0);
  const baseSpeed = 0.5;
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Continuous conveyor animation with GSAP
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let posMain = 0;
    let posBg = 0;
    const track = trackRef.current;
    const trackBg = trackBgRef.current;
    if (!track) return;

    const itemWidth = 420; // card width + gap approx
    const totalWidth = itemWidth * projects.length;

    const animate = () => {
      const speed = baseSpeed + scrollSpeedRef.current;
      posMain -= speed;
      if (posMain <= -totalWidth) posMain += totalWidth;

      if (track) {
        track.style.transform = `translateX(${posMain}px)`;
      }
      if (trackBg) {
        posBg -= speed * 0.4;
        if (posBg <= -totalWidth) posBg += totalWidth;
        trackBg.style.transform = `translateX(${posBg}px)`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Scroll speed influence
  useEffect(() => {
    let lastScroll = window.scrollY;
    let decayTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScroll);
      scrollSpeedRef.current = Math.min(delta * 0.08, 4);
      lastScroll = window.scrollY;

      clearTimeout(decayTimer);
      decayTimer = setTimeout(() => {
        const decay = () => {
          scrollSpeedRef.current *= 0.92;
          if (scrollSpeedRef.current > 0.01) {
            requestAnimationFrame(decay);
          } else {
            scrollSpeedRef.current = 0;
          }
        };
        decay();
      }, 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Heading entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          ".portfolio-heading",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      });
    });
  }, []);

  const getItemStyle = useCallback(
    (index: number) => {
      const isHovered = hoveredIdx === index;
      return {
        transform: isHovered
          ? "translateY(-12px) scale(1.05)"
          : undefined,
        filter: isHovered ? "blur(0px) brightness(1.1)" : undefined,
        transition: "transform 0.4s cubic-bezier(.4,0,.2,1), filter 0.4s ease, box-shadow 0.4s ease",

      };
    },
    [hoveredIdx]
  );

  const handleProjectClick = (project: Project) => {
    setExpandedProject(project);
  };

  const closeExpanded = () => {
    setExpandedProject(null);
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative py-[120px] overflow-x-clip overflow-y-visible"
      style={{ perspective: "1200px" }}
    >


      {/* Header */}
      <div className="portfolio-heading text-center mb-16 relative z-10">
        <span className="font-mono text-sm text-cyan block mb-3 text-[#00D4FF]">
          Portfolio
        </span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
          Work That Speaks for Itself
        </h2>
      </div>


      {/* Main conveyor track */}
      <div
        className="relative overflow-visible"
        style={{ height: "380px", perspective: "1000px" }}
      >


        <div
          ref={trackRef}
          className="flex gap-8 absolute left-0 top-0 items-center"
          style={{
            willChange: "transform",
            height: "100%",
            paddingLeft: "5vw",
          }}
        >
          {loopedProjects.map((project, i) => (
            <div
              key={`main-${i}`}
              className="conveyor-item flex-shrink-0 relative cursor-pointer group"
              style={{
                width: "520px",
                height: "300px",
                transformStyle: "preserve-3d",
                ...getItemStyle(i),
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleProjectClick(project)}
            >
              {/* Card container */}
              <div
                className="relative w-full h-full rounded-xl overflow-hidden"
                style={{
                  transition: "border 0.4s ease",
                }}
              >
                {/* Project image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                  style={{
                    filter: hoveredIdx === i ? "brightness(1)" : "brightness(0.7)",
                  }}
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,8,22,0.95) 0%, rgba(5,8,22,0.4) 40%, transparent 100%)",
                    opacity: hoveredIdx === i ? 1 : 0.7,
                  }}
                />



                {/* Text content */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500"
                  style={{
                    transform: hoveredIdx === i ? "translateY(0)" : "translateY(10px)",
                    opacity: hoveredIdx === i ? 1 : 0,
                  }}
                >
                  <h3 className="font-heading text-xl font-bold text-white mb-1">
                    {project.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {project.tagline}
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: "rgba(145,94,255,0.3)",
                          color: "#915EFF",
                          background: "rgba(145,94,255,0.08)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Always-visible title (fades on hover) */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300"
                  style={{
                    opacity: hoveredIdx === i ? 0 : 0.9,
                  }}
                >
                  <h3 className="font-heading text-lg font-semibold text-white/80">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="text-center mt-10 opacity-40">
        <p className="font-mono text-xs text-muted tracking-widest uppercase">
          Scroll to accelerate · Hover to explore · Click to expand
        </p>
      </div>

      {/* Expanded project overlay */}
      {expandedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          style={{ background: "rgba(5,8,22,0.92)", backdropFilter: "blur(8px)" }}
          onClick={closeExpanded}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(145,94,255,0.3)",
              boxShadow: "0 0 60px rgba(145,94,255,0.2), 0 0 120px rgba(0,212,255,0.08)",
              animation: "expandIn 0.5s cubic-bezier(.4,0,.2,1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeExpanded}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-white/10"
              style={{
                background: "rgba(5,8,22,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>

            {/* Expanded image */}
            <div className="relative w-full" style={{ height: "60vh" }}>
              <img
                src={expandedProject.image}
                alt={expandedProject.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,8,22,1) 0%, rgba(5,8,22,0.3) 50%, transparent 100%)",
                }}
              />
            </div>

            {/* Expanded content */}
            <div
              className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,8,22,0.98) 60%, transparent 100%)",
              }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                {expandedProject.title}
              </h2>
              <p className="font-body text-lg text-muted mb-6 max-w-2xl">
                {expandedProject.tagline}
              </p>
              <div className="flex gap-3 flex-wrap">
                {expandedProject.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-3 py-1.5 rounded-full"
                    style={{
                      border: "1px solid rgba(0,212,255,0.3)",
                      color: "#00D4FF",
                      background: "rgba(0,212,255,0.08)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe for expand animation */}
      <style jsx>{`
        @keyframes expandIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
