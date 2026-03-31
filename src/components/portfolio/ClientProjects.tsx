"use client";
import { useEffect, useRef, useState } from "react";
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
];

/* ─── Project Visual ─── */

function ProjectVisual({
  project,
  isHovered,
}: {
  project: Project;
  isHovered: boolean;
}) {
  return (
    <div
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 25% 20%, ${project.accent}15, transparent 55%),
          radial-gradient(ellipse at 75% 80%, ${project.accent}0a, transparent 50%),
          linear-gradient(135deg, rgba(5,8,22,0.95), rgba(10,12,30,0.9))
        `,
      }}
    >
      {/* Project image */}
      <img
        src={project.image}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        draggable={false}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-all duration-500"
        style={{
          background: isHovered
            ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)",
        }}
      >
        <div
          className="transition-all duration-500 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
            {project.name}
          </h3>
          <p className="text-white/60 text-sm md:text-base mb-3 max-w-md">
            {project.impact}
          </p>
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-2 py-[3px] rounded-full text-white/50 bg-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Neon glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-700"
        style={{
          boxShadow: isHovered
            ? `0 0 60px -12px ${project.accent}80, inset 0 0 60px -12px ${project.accent}15`
            : "0 0 0px transparent",
        }}
      />
    </div>
  );
}

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
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);

  const [isPaused, setIsPaused] = useState(false);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const scrollToProject = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const scrollTrack = track.querySelector<HTMLElement>(".projects-scroll-track");
    if (!scrollTrack) return;
    scrollTrack.style.animationPlayState = "paused";
    setIsPaused(true);
    const transform = getComputedStyle(scrollTrack).transform;
    const matrix = new DOMMatrix(transform);
    const currentX = matrix.m41;
    // Get width of one project item + gap
    const item = itemsRef.current[0];
    if (!item) return;
    const itemWidth = item.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(scrollTrack).gap) || 48;
    const step = itemWidth + gap;
    const newX = direction === "next" ? currentX - step : currentX + step;
    scrollTrack.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    scrollTrack.style.transform = `translateX(${newX}px)`;
    setCurrentIndex((prev) =>
      direction === "next"
        ? (prev + 1) % projects.length
        : (prev - 1 + projects.length) % projects.length
    );
    setTimeout(() => {
      scrollTrack.style.transition = "";
    }, 700);
  };

  const allProjects = [...projects, ...projects];

  /* Manual drag scroll */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      const scrollTrack = track.querySelector<HTMLElement>(".projects-scroll-track");
      if (scrollTrack) {
        const transform = getComputedStyle(scrollTrack).transform;
        const matrix = new DOMMatrix(transform);
        scrollStartX.current = matrix.m41;
      }
      track.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStartX.current;
      const scrollTrack = track.querySelector<HTMLElement>(".projects-scroll-track");
      if (scrollTrack) {
        scrollTrack.style.animationPlayState = "paused";
        scrollTrack.style.transform = `translateX(${scrollStartX.current + dx}px)`;
      }
    };

    const onPointerUp = () => {
      isDragging.current = false;
      track.style.cursor = "grab";
    };

    track.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  /* Mouse parallax tracking */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* Depth & focus rAF loop */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let active = true;

    const update = () => {
      if (!active || !isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(update);
        return;
      }

      const centerX = window.innerWidth / 2;
      const halfViewport = window.innerWidth * 0.55;

      // Read phase: gather all rects first
      const rects = itemsRef.current.map((item) =>
        item ? item.getBoundingClientRect() : null
      );

      // Write phase: apply transforms
      rects.forEach((rect, i) => {
        const item = itemsRef.current[i];
        if (!rect || !item) return;

        const itemCenter = rect.left + rect.width / 2;
        const normalizedDist = (itemCenter - centerX) / halfViewport;
        const absD = Math.min(Math.abs(normalizedDist), 1.5);

        let scale = Math.max(0.85, 1.12 - absD * 0.25);
        const opacity = Math.max(0.55, 1 - absD * 0.35);
        const rotateY = Math.max(-12, Math.min(12, normalizedDist * -10));
        const translateY = absD * 10;

        // Hover boost
        if (hoveredRef.current === i) {
          scale = Math.min(scale * 1.05, 1.2);
        }

        item.style.transform = `scale(${scale}) rotateY(${rotateY}deg) translateY(${translateY}px)`;
        item.style.opacity = `${opacity}`;
        item.style.filter = "none";

        // Radial glow behind center item
        const glow = item.querySelector<HTMLElement>(".project-glow-ring");
        if (glow) {
          const glowOpacity = Math.max(0, 1 - absD * 3);
          glow.style.opacity = `${glowOpacity}`;
        }
      });

      // Parallax on wrapper
      if (trackRef.current) {
        const px = mouseRef.current.x * -12;
        const py = mouseRef.current.y * -6;
        trackRef.current.style.setProperty("--px", `${px}px`);
        trackRef.current.style.setProperty("--py", `${py}px`);
      }

      rafRef.current = requestAnimationFrame(update);
    };

    // Visibility observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    rafRef.current = requestAnimationFrame(update);

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  /* Lock body scroll when expanded */
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

  /* Heading entrance animation */
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

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-[100px] md:py-[140px] overflow-hidden"
      style={{ background: "#050816" }}
    >
      {/* Animated neuron field background */}
      <NeuronField />

      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-accent/[0.03] blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-cyan/[0.025] blur-[120px]" />
      </div>

      {/* Heading */}
      <div className="projects-heading text-center mb-16 md:mb-24 relative z-10 px-6">
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Our Work
        </h2>
        <p className="text-muted text-base md:text-lg lg:text-xl font-light">
        Built to Perform. Designed to Scale.
        </p>
      </div>

      {/* Perspective viewport */}
      <div
        className="relative"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Left arrow */}
        <button
          onClick={() => scrollToProject("prev")}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 group w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/10 bg-black/30 backdrop-blur-md hover:border-accent/50 hover:bg-accent/15 transition-all duration-300"
          aria-label="Previous project"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-accent transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scrollToProject("next")}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 group w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/10 bg-black/30 backdrop-blur-md hover:border-accent/50 hover:bg-accent/15 transition-all duration-300"
          aria-label="Next project"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-accent transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-mono text-xs text-white/30">
          {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </div>

        {/* Parallax wrapper */}
        <div
          ref={trackRef}
          className="projects-parallax-wrap"
          style={{ cursor: "grab" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredIndex(null);
            hoveredRef.current = null;
          }}
        >
          {/* Scroll track */}
          <div
            className="projects-scroll-track flex items-center"
            style={{
              animationPlayState:
                isPaused || expandedProjectIndex !== null ? "paused" : "running",
              gap: "clamp(32px, 4vw, 64px)",
              paddingLeft: "clamp(32px, 4vw, 64px)",
              paddingRight: "clamp(32px, 4vw, 64px)",
            }}
          >
            {allProjects.map((project, i) => (
              <div
                key={`${project.id}-${i}`}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className="project-float-item flex-shrink-0 relative cursor-pointer"
                style={{
                  width: "clamp(320px, 42vw, 620px)",
                  willChange: "transform, opacity, filter",
                  transformStyle: "preserve-3d",
                }}
                onClick={() => setExpandedProjectIndex(i % projects.length)}
                onMouseEnter={() => {
                  setHoveredIndex(i);
                  hoveredRef.current = i;
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  hoveredRef.current = null;
                }}
              >
                {/* Radial glow behind item */}
                <div
                  className="project-glow-ring absolute -inset-12 rounded-full pointer-events-none opacity-0"
                  style={{
                    background: `radial-gradient(ellipse at center, ${project.accent}12, transparent 70%)`,
                  }}
                />

                <ProjectVisual
                  project={project}
                  isHovered={hoveredIndex === i}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded case study */}
      <AnimatePresence>
        {expandedProjectIndex !== null && (
          <CaseStudyOverlay
            project={projects[expandedProjectIndex]}
            projectIndex={expandedProjectIndex}
            total={projects.length}
            onClose={() => setExpandedProjectIndex(null)}
            onPrev={() => setExpandedProjectIndex((expandedProjectIndex - 1 + projects.length) % projects.length)}
            onNext={() => setExpandedProjectIndex((expandedProjectIndex + 1) % projects.length)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
