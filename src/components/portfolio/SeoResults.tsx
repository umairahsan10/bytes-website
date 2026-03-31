"use client";
import { useEffect, useRef, useState } from "react";

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-4xl md:text-6xl font-bold gradient-text">
        {count}
        {suffix}
      </p>
      <p className="font-body text-muted text-sm mt-2">{label}</p>
    </div>
  );
}

function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize"
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchStart={() => (isDragging.current = true)}
      onTouchEnd={() => (isDragging.current = false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After (full width behind) */}
      <div className="w-full p-8 md:p-12 bg-gradient-to-br from-accent/10 to-cyan/5 min-h-[250px]">
        <p className="font-mono text-xs text-cyan/60 mb-4">AFTER</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Organic Traffic</span>
            <span className="font-mono text-sm text-green-400">12,847/mo</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-cyan rounded-full" style={{ width: "85%" }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Keywords Page 1</span>
            <span className="font-mono text-sm text-green-400">47</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-cyan rounded-full" style={{ width: "78%" }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Monthly Revenue</span>
            <span className="font-mono text-sm text-green-400">$84,200</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-cyan rounded-full" style={{ width: "90%" }} />
          </div>
        </div>
      </div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 p-8 md:p-12 bg-gradient-to-br from-red-900/20 to-gray-900/40"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <p className="font-mono text-xs text-red-400/60 mb-4">BEFORE</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Organic Traffic</span>
            <span className="font-mono text-sm text-red-400">1,203/mo</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500/40 rounded-full" style={{ width: "12%" }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Keywords Page 1</span>
            <span className="font-mono text-sm text-red-400">3</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500/40 rounded-full" style={{ width: "5%" }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Monthly Revenue</span>
            <span className="font-mono text-sm text-red-400">$9,800</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500/40 rounded-full" style={{ width: "10%" }} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function SeoResults() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Chart draw animation
        if (chartRef.current) {
          const length = chartRef.current.getTotalLength();
          chartRef.current.style.strokeDasharray = `${length}`;
          chartRef.current.style.strokeDashoffset = `${length}`;

          gsap.to(chartRef.current, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ".seo-chart",
              start: "top 75%",
            },
          });
        }

        // Data points
        gsap.fromTo(
          ".chart-dot",
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ".seo-chart",
              start: "top 75%",
            },
            delay: 2,
          }
        );
      });
    });
  }, []);

  const chartPoints = [
    { x: 0, y: 180 },
    { x: 100, y: 160 },
    { x: 200, y: 150 },
    { x: 300, y: 120 },
    { x: 400, y: 80 },
    { x: 500, y: 50 },
    { x: 600, y: 30 },
  ];

  const pathD = chartPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Jan"];

  return (
    <section
      ref={sectionRef}
      id="seo"
      className="relative min-h-screen py-[120px]"
      style={{ background: "#0a0f2e" }}
    >
      <div className="max-w-content mx-auto px-6 md:px-20">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-sm text-accent block mb-3">
            SEO Impact
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
            Rankings Earned. Traffic Grown.
            <br />
            Revenue Generated.
          </h2>
        </div>

        {/* Chart */}
        <div className="seo-chart mb-20 p-6 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <p className="font-mono text-xs text-muted mb-4">
            Organic Traffic Growth — Client Case Study
          </p>
          <svg
            viewBox="-20 0 660 220"
            className="w-full h-auto chart-glow"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0, 50, 100, 150].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="600"
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Path */}
            <path
              ref={chartRef}
              d={pathD}
              fill="none"
              stroke="#915EFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data dots */}
            {chartPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#915EFF"
                className="chart-dot"
                style={{ opacity: 0 }}
              />
            ))}

            {/* Month labels */}
            {months.map((m, i) => (
              <text
                key={i}
                x={i * 100}
                y="208"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <StatCounter value={312} suffix="%" label="Traffic Increase" />
          <StatCounter value={47} suffix="" label="Keywords Ranked #1" />
          <StatCounter value={8} suffix="×" label="ROI Achieved" />
        </div>

        {/* Before/After */}
        <div>
          <h3 className="font-heading text-2xl font-semibold text-center mb-8">
            Drag to Compare
          </h3>
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
}
