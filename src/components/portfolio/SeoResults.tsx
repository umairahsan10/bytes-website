"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ─── design tokens ─── */
const BG = "#050816";
const CYAN = "#00C8FF";
const GREEN = "#00E589";
const MUTED = "#5A6B8A";
const NEON_PURPLE = "#915EFF";
const BLUE = "#1D6CF6";

/* ══════════════════════════════════════════════════
   CASE STUDY DATA — swap images & stats per project
   ══════════════════════════════════════════════════ */
interface CaseStudy {
  title: string;
  url: string;
  beforeImg: string;
  afterImg: string;
  stats: { label: string; value: number; prefix?: string; suffix?: string }[];
  badges: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Safe Travel Charters",
    url: "safetravelcharters.com",
    beforeImg: "/portfolioo/seo/seo-1-before.png",
    afterImg: "/portfolioo/seo/seo-1-after.png",
    stats: [
      { label: "Total Clicks", value: 207, prefix: "", suffix: "" },
      { label: "Impressions", value: 122000, prefix: "", suffix: "" },
      { label: "CTR", value: 0.2, prefix: "", suffix: "%" },
      { label: "Avg Position", value: 61.4, prefix: "", suffix: "" },
    ],
    badges: ["+207 Clicks", "122K Impressions", "28-Day Growth"],
  },
  {
    title: "Nexus Alliance Inc.",
    url: "nexusallianceinc.com",
    beforeImg: "/portfolioo/seo/seo-2-before.png",
    afterImg: "/portfolioo/seo/seo-2-after.png",
    stats: [
      { label: "Total Clicks", value: 1030, prefix: "", suffix: "" },
      { label: "Impressions", value: 37000, prefix: "", suffix: "" },
      { label: "CTR", value: 2.8, prefix: "", suffix: "%" },
      { label: "Avg Position", value: 65.8, prefix: "", suffix: "" },
    ],
    badges: ["1.03K Clicks", "37K Impressions", "2.8% CTR"],
  },
  {
    title: "Team Smith Logistics",
    url: "teamsmithlogistics.com",
    beforeImg: "/portfolioo/seo/seo-3-before.png",
    afterImg: "/portfolioo/seo/seo-3-after.png",
    stats: [
      { label: "Total Clicks", value: 146, prefix: "", suffix: "" },
      { label: "Impressions", value: 50900, prefix: "", suffix: "" },
      { label: "CTR", value: 0.3, prefix: "", suffix: "%" },
      { label: "Avg Position", value: 52, prefix: "", suffix: "" },
    ],
    badges: ["146 Clicks", "50.9K Impressions", "Position 52"],
  },
  {
    title: "This Week in Public Health",
    url: "thisweekinpublichealth.com",
    beforeImg: "/portfolioo/seo/seo-4-before.png",
    afterImg: "/portfolioo/seo/seo-4-after.png",
    stats: [
      { label: "Total Clicks", value: 836, prefix: "", suffix: "" },
      { label: "Impressions", value: 96200, prefix: "", suffix: "" },
      { label: "CTR", value: 0.9, prefix: "", suffix: "%" },
      { label: "Avg Position", value: 25.6, prefix: "", suffix: "" },
    ],
    badges: ["836 Clicks", "96.2K Impressions", "Position 25.6"],
  },
  {
    title: "Dawg Team Products",
    url: "dawgteamproducts.com",
    beforeImg: "/portfolioo/seo/seo-5-before.png",
    afterImg: "/portfolioo/seo/seo-5-after.png",
    stats: [
      { label: "Total Clicks", value: 15600, prefix: "", suffix: "" },
      { label: "Impressions", value: 1000000, prefix: "", suffix: "" },
      { label: "CTR", value: 1.6, prefix: "", suffix: "%" },
      { label: "Avg Position", value: 18.7, prefix: "", suffix: "" },
    ],
    badges: ["15.6K Clicks", "1M Impressions", "1.6% CTR"],
  },
];

/* ─── NeuronField (starfield + connecting lines — matches Products bg) ─── */
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
    const COUNT = 50;

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
          opacity: 0.1 + Math.random() * 0.2,
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

/* ─── useInView ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── easeOutQuart ─── */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

/* ─── CountUp ─── */
function CountUp({
  value,
  prefix = "",
  suffix = "",
  start,
  duration = 2000,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  start: boolean;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;
    const isDecimal = value % 1 !== 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const current = easeOutQuart(p) * value;
      setDisplay(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, value, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ══════════════════════════════════════════════════
   BEFORE / AFTER SIDE-BY-SIDE
   ══════════════════════════════════════════════════ */
function BeforeAfterImages({
  beforeImg,
  afterImg,
  title,
}: {
  beforeImg: string;
  afterImg: string;
  title: string;
}) {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
      {/* BEFORE */}
      <div className="group">
        <span className="inline-block mb-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(230,57,70,0.25)", border: "1px solid rgba(230,57,70,0.4)", color: "#E63946" }}>
          Before SEO
        </span>
        <div className="rounded-xl overflow-hidden bg-white/[0.02] h-full">
          <Image
            src={beforeImg}
            alt={`${title} — Before SEO`}
            width={1200}
            height={900}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </div>

      {/* arrow between on desktop */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center"
        style={{ background: "rgba(5,8,22,0.9)", border: `2px solid ${CYAN}`, boxShadow: `0 0 18px ${CYAN}40` }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 8H12M12 8L9 5M12 8L9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* AFTER */}
      <div className="group">
        <span className="inline-block mb-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
          style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40`, color: GREEN }}>
          After SEO
        </span>
        <div className="rounded-xl overflow-hidden bg-white/[0.02] h-full">
          <Image
            src={afterImg}
            alt={`${title} — After SEO`}
            width={1200}
            height={900}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════ */
export default function SeoResults() {
  const { ref: sectionRef, visible } = useInView(0.1);
  const [active, setActive] = useState(0);
  const study = CASE_STUDIES[active];

  const goTo = useCallback((idx: number) => setActive(idx), []);
  const goPrev = useCallback(() => setActive((p) => (p - 1 + CASE_STUDIES.length) % CASE_STUDIES.length), []);
  const goNext = useCallback(() => setActive((p) => (p + 1) % CASE_STUDIES.length), []);

  return (
    <section id="seo" className="relative py-20 md:py-24 overflow-hidden" style={{ background: BG }}>
      {/* Neuron starfield — same as Products section */}
      <NeuronField />

      {/* Ambient glows — matching Products */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(145,94,255,0.03)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] rounded-full blur-[100px]" style={{ background: "rgba(0,212,255,0.025)" }} />
      </div>

      <style>{`
        .seo-glow-text{background:linear-gradient(90deg,${NEON_PURPLE},${CYAN});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:seo-pulse 3s ease-in-out infinite}
        @keyframes seo-pulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.4) drop-shadow(0 0 12px ${NEON_PURPLE}60)}}
        .seo-stat-glow{text-shadow:0 0 18px ${CYAN}40}
        .seo-card{transition:border-color .3s,box-shadow .3s}.seo-card:hover{border-color:${CYAN}20!important;box-shadow:0 0 30px ${CYAN}08,0 4px 24px rgba(0,0,0,.3)}
        .seo-badge{transition:box-shadow .3s}.seo-badge:hover{box-shadow:0 0 10px ${CYAN}30}
        .seo-cta-btn{transition:box-shadow .3s,transform .3s}.seo-cta-btn:hover{box-shadow:0 0 25px ${NEON_PURPLE}60;transform:translateY(-2px)}
        .seo-nav-dot{transition:all .3s}.seo-nav-dot:hover{box-shadow:0 0 8px ${CYAN}50}
        .seo-arrow{transition:all .25s}.seo-arrow:hover{background:rgba(255,255,255,.1)!important;border-color:${CYAN}40!important}
      `}</style>

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        {/* ── HEADER ── */}
        <div className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-3"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all .5s ease" }}>
            <span style={{ width: 24, height: 1, background: BLUE }} className="block" />
            <span className="text-[11px] uppercase tracking-[.18em] font-medium" style={{ color: BLUE }}>Real Results</span>
            <span style={{ width: 24, height: 1, background: BLUE }} className="block" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-3"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all .7s ease .1s" }}>
            <span className="seo-glow-text">SEO Case Studies</span>{" "}
            <span className="text-white">— </span>
            <span style={{ color: CYAN }}>Real Data</span>
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: MUTED, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all .6s ease .2s" }}>
            Real Google Search Console screenshots — before and after, side by side.
          </p>
        </div>

        {/* ── CAROUSEL CARD ── */}
        <div
          className="seo-card relative rounded-2xl overflow-hidden mx-auto"
          style={{
            maxWidth: 1400,
            background: "rgba(10,20,40,0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity .7s ease .2s, transform .7s ease .2s, border-color .3s, box-shadow .3s",
          }}
        >
          {/* top glow line */}
          <div className="absolute top-0 left-0 w-full h-[1px]"
            style={{ background: `linear-gradient(90deg,transparent,${CYAN}50 30%,${NEON_PURPLE}50 70%,transparent)` }} />

          {/* ── top bar: title + nav arrows ── */}
          <div className="flex items-center justify-between p-4 md:p-5">
            <div style={{ animation: "fadeSlideIn .4s ease" }} key={active + "-header"}>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-heading text-sm sm:text-base font-bold text-white">{study.title}</h3>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: GREEN }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: GREEN }} />
                  </span>
                  <span className="text-[9px] font-medium" style={{ color: GREEN }}>Verified</span>
                </span>
              </div>
              <p className="text-[10px] font-mono" style={{ color: MUTED }}>{study.url}</p>
            </div>

            {/* arrows */}
            <div className="flex items-center gap-2">
              <button onClick={goPrev} aria-label="Previous"
                className="seo-arrow w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={goNext} aria-label="Next"
                className="seo-arrow w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

          {/* ── before / after images ── */}
          <div className="relative px-4 md:px-6" key={active + "-images"} style={{ animation: "fadeSlideIn .5s ease" }}>
            <BeforeAfterImages beforeImg={study.beforeImg} afterImg={study.afterImg} title={study.title} />
          </div>

          {/* ── stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 pt-5 pb-3 md:px-6 md:pt-6 md:pb-4"
            key={active + "-stats"} style={{ animation: "fadeSlideIn .5s ease .1s", animationFillMode: "both" }}>
            {study.stats.map((stat, i) => (
              <div key={stat.label} className="text-center px-2 py-1.5"
                style={{ animation: `fadeSlideIn .4s ease ${0.15 + i * 0.08}s`, animationFillMode: "both" }}>
                <p className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold seo-stat-glow" style={{ color: CYAN }}>
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} start={visible} key={active + stat.label} />
                </p>
                <p className="text-[10px] sm:text-xs mt-1" style={{ color: MUTED }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── badges + dots ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 pb-5 md:px-6 md:pb-6"
            key={active + "-badges"} style={{ animation: "fadeSlideIn .4s ease .2s", animationFillMode: "both" }}>
            <div className="flex flex-wrap gap-1.5">
              {study.badges.map((b) => (
                <span key={b} className="seo-badge px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold"
                  style={{ background: `linear-gradient(135deg,${NEON_PURPLE}15,${CYAN}15)`, border: `1px solid ${CYAN}20`, color: CYAN }}>
                  {b}
                </span>
              ))}
            </div>

            {/* dot indicators */}
            <div className="flex items-center gap-2">
              {CASE_STUDIES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Case study ${i + 1}`}
                  className="seo-nav-dot rounded-full"
                  style={{
                    width: active === i ? 24 : 8,
                    height: 8,
                    background: active === i ? `linear-gradient(90deg,${NEON_PURPLE},${CYAN})` : "rgba(255,255,255,0.12)",
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center mt-10 md:mt-12"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "all .6s ease .4s" }}>
          <p className="text-xs sm:text-sm text-white/50 mb-4">Ready to see your own results?</p>
          <a href="#contact" className="seo-cta-btn inline-block px-7 py-2.5 rounded-full text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg,${NEON_PURPLE},${BLUE})`, border: `1px solid ${NEON_PURPLE}50` }}>
            Get in Touch
          </a>
        </div>
      </div>

      {/* fade-slide keyframe */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}