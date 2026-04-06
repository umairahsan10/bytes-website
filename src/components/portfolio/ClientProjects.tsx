"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Neuron Field Background ─── */
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
    const COUNT = 60;

    const resize = () => {
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (neurons.length === 0) {
        neurons = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.5, opacity: 0.12 + Math.random() * 0.2,
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
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / LINK_DIST) * 0.1})`;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] pointer-events-none" style={{ opacity: 0.7 }} />;
}

/* ─── Project Data ─── */
interface Project {
  id: number;
  name: string;
  impact: string;
  tags: string[];
  accent: string;
  image: string;
  caseStudy: {
    client: string;
    challenge: string;
    solution: string;
    result: string;
  };
}

const projects: Project[] = [
  {
    id: 1,
    name: "Quantiva",
    impact: "AI-driven trading platform with live analytics",
    tags: ["Web", "AI", "FinTech"],
    accent: "#915EFF",
    image: "/portfolioo/projects/Quantiva Screens-01.jpg",
    caseStudy: {
      client: "Quantiva",
      challenge:
        "Traders lacked real-time insights and struggled to act on fast-moving market data.",
      solution:
        "Developed an AI-driven trading platform with live analytics, sentiment tracking, and automation tools.",
      result: "Faster Decisions",
    },
  },
  {
    id: 2,
    name: "Intelaimant",
    impact: "AI-powered diagnostics reducing resolution time",
    tags: ["AI", "Diagnostics", "Cloud"],
    accent: "#00D4FF",
    image: "/portfolioo/projects/Inteliimaint Screens-04.jpg",
    caseStudy: {
      client: "Intelaimant",
      challenge:
        "Fragmented technical data slowed down diagnostics and increased downtime.",
      solution:
        "Built an AI-powered assistant for real-time diagnostics, knowledge retrieval, and guided troubleshooting.",
      result: "Reduced Downtime",
    },
  },
  {
    id: 3,
    name: "Dawg Team",
    impact: "Custom e-commerce store with 3× higher engagement",
    tags: ["E-Commerce", "Web", "Design"],
    accent: "#FF6B35",
    image: "/portfolioo/projects/Dawg Team.jpg",
    caseStudy: {
      client: "Dawg Team",
      challenge:
        "An outdated website with poor UX was losing potential customers and hurting brand credibility.",
      solution:
        "Designed and built a custom e-commerce storefront with modern UI, fast checkout, and mobile-first experience.",
      result: "3× Engagement",
    },
  },
  {
    id: 4,
    name: "SD Woods",
    impact: "Premium woodcraft store with seamless shopping",
    tags: ["E-Commerce", "Web", "Shopify"],
    accent: "#EC4899",
    image: "/portfolioo/projects/sdwoods.png",
    caseStudy: {
      client: "SD Woods",
      challenge:
        "No online presence meant missed sales and inability to showcase their premium woodcraft products.",
      solution:
        "Built a custom e-commerce platform with rich product galleries, smooth navigation, and integrated payment processing.",
      result: "2× Conversions",
    },
  },
  {
    id: 5,
    name: "Nexus Alliance",
    impact: "Federal waste management platform with nationwide reach",
    tags: ["Web", "Government", "B2B"],
    accent: "#2196F3",
    image: "/portfolio/bytes-test-2.webp",
    caseStudy: {
      client: "Nexus Alliance Inc.",
      challenge:
        "A legacy web presence failed to convey their federal expertise and couldn't generate qualified leads from government agencies.",
      solution:
        "Designed a professional corporate website highlighting federal contracting capabilities, service areas, and compliance certifications.",
      result: "4× Lead Growth",
    },
  },
  {
    id: 6,
    name: "Synergistic",
    impact: "Business networking platform driving team collaboration",
    tags: ["Web", "SaaS", "Networking"],
    accent: "#1E88E5",
    image: "/portfolio/bytes-test-3.webp",
    caseStudy: {
      client: "Synergistic",
      challenge:
        "The company had no digital presence to showcase their business networking services and connect potential partners.",
      solution:
        "Built a modern, interactive website with a clean design emphasizing connections and results through dynamic visuals and clear CTAs.",
      result: "60% More Signups",
    },
  },
  {
    id: 7,
    name: "Vertical Worx",
    impact: "Aviation services site with 2× more quote requests",
    tags: ["Web", "Aviation", "Design"],
    accent: "#FF5722",
    image: "/portfolio/bytes-test-5.webp",
    caseStudy: {
      client: "Vertical Worx",
      challenge:
        "A veteran-operated helicopter service company in Hawaii needed a professional online presence to attract commercial and government clients.",
      solution:
        "Created a high-impact website with bold visuals, service breakdowns, certifications display, and an integrated quote request system.",
      result: "2× Quote Requests",
    },
  },
  {
    id: 8,
    name: "Lampados Financial",
    impact: "Financial advisory platform with seamless client onboarding",
    tags: ["Web", "FinTech", "CRM"],
    accent: "#FFC107",
    image: "/portfolio/bytes-test-6.webp",
    caseStudy: {
      client: "Lampados Financial Group",
      challenge:
        "A financial advisory firm needed a digital platform to educate clients, offer services, and streamline the onboarding process.",
      solution:
        "Developed a content-rich financial services website with client login portal, pricing tiers, blog integration, and appointment booking.",
      result: "3× Client Retention",
    },
  },
];

// Triple for seamless infinite loop
const loopedProjects = [...projects, ...projects, ...projects];

/* ─── Fullscreen Case Study ─── */

function CaseStudyOverlay({
  project,
  projectIndex,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  project: Project;
  projectIndex: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      className="fixed inset-0 z-[200]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-[#050816]/90 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Prev button — left edge */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/10 bg-black/40 backdrop-blur-md hover:border-white/30 hover:bg-white/10 transition-all duration-300"
        aria-label="Previous project"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next button — right edge */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/10 bg-black/40 backdrop-blur-md hover:border-white/30 hover:bg-white/10 transition-all duration-300"
        aria-label="Next project"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Full-viewport layout — no scroll */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-14 md:px-20 py-4 md:py-6 lg:py-10">
        <motion.div
          key={project.id}
          className="relative w-full h-full max-w-[1400px] max-h-[900px] flex flex-col lg:flex-row gap-4 lg:gap-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar: counter + close — fixed top-right of viewport */}
          <div className="fixed top-4 right-4 md:top-6 md:right-8 z-50 flex items-center gap-3">
            <span className="font-mono text-xs text-white/30">
              {String(projectIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-white/40 hover:text-white transition-colors font-mono text-sm flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:border-white/30"
            >
              <span>Close</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image — fills available space, contained */}
          <div className="flex-1 min-h-0 min-w-0 lg:flex-[1.4] relative rounded-2xl overflow-hidden"
            style={{
              background: `
                radial-gradient(ellipse at 25% 20%, ${project.accent}15, transparent 55%),
                linear-gradient(135deg, rgba(5,8,22,0.95), rgba(10,12,30,0.9))
              `,
            }}
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-contain"
              loading="lazy"
              draggable={false}
            />
            {/* Subtle neon border */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: `inset 0 0 60px -20px ${project.accent}30, 0 0 80px -20px ${project.accent}20`,
              }}
            />
          </div>

          {/* Case Study Details — right side on desktop, bottom on mobile */}
          <motion.div
            key={project.id}
            className="lg:flex-[0.6] flex flex-col justify-center min-h-0 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3 lg:mb-5">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: project.accent }}
              />
              <span className="font-mono text-sm text-white/40">
                {project.caseStudy.client}
              </span>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-5">
              {project.name}
            </h2>

            <div className="flex gap-2 flex-wrap mb-4 lg:mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] px-2 py-[3px] rounded-full"
                  style={{
                    background: `${project.accent}15`,
                    color: `${project.accent}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:gap-5">
              <div>
                <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">
                  Challenge
                </p>
                <p className="text-muted text-sm leading-relaxed">
                  {project.caseStudy.challenge}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">
                  Solution
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  {project.caseStudy.solution}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-white/30 uppercase tracking-wider mb-1">
                  Result
                </p>
                <p
                  className="font-heading text-2xl lg:text-3xl font-bold"
                  style={{ color: project.accent }}
                >
                  {project.caseStudy.result}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */

export default function ClientProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackBgRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef(0);
  const baseSpeed = 0.5;

  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Continuous dual-conveyor animation
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

    const itemWidth = 540;
    const totalWidth = itemWidth * projects.length;

    const animate = () => {
      const speed = baseSpeed + scrollSpeedRef.current;
      posMain -= speed;
      if (posMain <= -totalWidth) posMain += totalWidth;

      track.style.transform = `translateX(${posMain}px)`;

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
          ".projects-heading",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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

  // Lock body scroll when expanded
  useEffect(() => {
    if (expandedProjectIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedProjectIndex]);

  const getItemStyle = useCallback(
    (index: number) => {
      const isHovered = hoveredIdx === index;
      return {
        transform: isHovered ? "translateY(-12px) scale(1.05)" : undefined,
        filter: isHovered ? "blur(0px) brightness(1.1)" : undefined,
        transition:
          "transform 0.4s cubic-bezier(.4,0,.2,1), filter 0.4s ease",
      };
    },
    [hoveredIdx]
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-[100px] md:py-[140px] overflow-x-clip overflow-y-visible"
      style={{ background: "#050816" }}
    >
      <NeuronField />

      {/* Heading */}
      <div className="projects-heading text-center mb-16 md:mb-24 relative z-10 px-6">
        <span className="font-mono text-sm text-cyan block mb-3 text-[#00D4FF]">Projects</span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Our Work
        </h2>
        <p className="text-muted text-base md:text-lg lg:text-xl font-light">
          Built to Perform. Designed to Scale.
        </p>
      </div>

      {/* Main conveyor track */}
      <div
        className="relative overflow-visible z-[3]"
        style={{ height: "420px", perspective: "1000px" }}
      >

        <div
          ref={trackRef}
          className="flex gap-6 absolute left-0 top-0 items-center"
          style={{
            willChange: "transform",
            height: "100%",
          }}
        >
          {loopedProjects.map((project, i) => (
            <div
              key={`main-${i}`}
              className="flex-shrink-0 relative cursor-pointer group"
              style={{
                width: "520px",
                height: "300px",
                transformStyle: "preserve-3d",
                ...getItemStyle(i),
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setExpandedProjectIndex(i % projects.length)}
            >
              <div
                className="relative w-full h-full rounded-xl overflow-hidden"
                style={{
                  transition: "border 0.4s ease",
                }}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                  style={{
                    filter:
                      hoveredIdx === i ? "brightness(1)" : "brightness(0.7)",
                  }}
                  loading="lazy"
                />

                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,8,22,0.95) 0%, rgba(5,8,22,0.4) 40%, transparent 100%)",
                    opacity: hoveredIdx === i ? 1 : 0.7,
                  }}
                />



                {/* Hover content */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500"
                  style={{
                    transform:
                      hoveredIdx === i ? "translateY(0)" : "translateY(10px)",
                    opacity: hoveredIdx === i ? 1 : 0,
                  }}
                >
                  <h3 className="font-heading text-xl font-bold text-white mb-1">
                    {project.name}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed mb-3">
                    {project.impact}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${project.accent}4d`,
                          color: project.accent,
                          background: `${project.accent}14`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Always-visible title */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300"
                  style={{ opacity: hoveredIdx === i ? 0 : 0.9 }}
                >
                  <h3 className="font-heading text-lg font-semibold text-white/80">
                    {project.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="text-center mt-10 opacity-40 relative z-[3]">
        <p className="font-mono text-xs text-muted tracking-widest uppercase">
          Scroll to accelerate · Hover to explore · Click to expand
        </p>
      </div>

      {/* Expanded case study */}
      <AnimatePresence>
        {expandedProjectIndex !== null && (
          <CaseStudyOverlay
            project={projects[expandedProjectIndex]}
            projectIndex={expandedProjectIndex}
            total={projects.length}
            onClose={() => setExpandedProjectIndex(null)}
            onPrev={() =>
              setExpandedProjectIndex(
                (expandedProjectIndex - 1 + projects.length) % projects.length
              )
            }
            onNext={() =>
              setExpandedProjectIndex(
                (expandedProjectIndex + 1) % projects.length
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}