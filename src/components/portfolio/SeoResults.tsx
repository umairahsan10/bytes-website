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

/* ─── DATA ─── */
const CASE_STUDIES = [
  {
    title: "Safe Travel Charters",
    url: "safetravelcharters.com",
    beforeImg: "/portfolioo/seo/seo-1-before.png",
    afterImg: "/portfolioo/seo/seo-1-after.png",
    stats: [
      { label: "Total Clicks", value: 207 },
      { label: "Impressions", value: 122000 },
      { label: "CTR", value: 0.2, suffix: "%" },
      { label: "Avg Position", value: 61.4 },
    ],
    badges: ["+207 Clicks", "122K Impressions", "28-Day Growth"],
  },
  {
    title: "Nexus Alliance Inc.",
    url: "nexusallianceinc.com",
    beforeImg: "/portfolioo/seo/seo-2-before.png",
    afterImg: "/portfolioo/seo/seo-2-after.png",
    stats: [
      { label: "Total Clicks", value: 1030 },
      { label: "Impressions", value: 37000 },
      { label: "CTR", value: 2.8, suffix: "%" },
      { label: "Avg Position", value: 65.8 },
    ],
    badges: ["1.03K Clicks", "37K Impressions", "2.8% CTR"],
  },
  {
    title: "Team Smith Logistics",
    url: "teamsmithlogistics.com",
    beforeImg: "/portfolioo/seo/seo-3-before.png",
    afterImg: "/portfolioo/seo/seo-3-after.png",
    stats: [
      { label: "Total Clicks", value: 146 },
      { label: "Impressions", value: 50900 },
      { label: "CTR", value: 0.3, suffix: "%" },
      { label: "Avg Position", value: 52 },
    ],
    badges: ["146 Clicks", "50.9K Impressions", "Position 52"],
  },
  {
    title: "This Week in Public Health",
    url: "thisweekinpublichealth.com",
    beforeImg: "/portfolioo/seo/seo-4-before.png",
    afterImg: "/portfolioo/seo/seo-4-after.png",
    stats: [
      { label: "Total Clicks", value: 836 },
      { label: "Impressions", value: 96200 },
      { label: "CTR", value: 0.9, suffix: "%" },
      { label: "Avg Position", value: 25.6 },
    ],
    badges: ["836 Clicks", "96.2K Impressions", "Position 25.6"],
  },
  {
    title: "Dawg Team Products",
    url: "dawgteamproducts.com",
    beforeImg: "/portfolioo/seo/seo-5-before.png",
    afterImg: "/portfolioo/seo/seo-5-after.png",
    stats: [
      { label: "Total Clicks", value: 15600 },
      { label: "Impressions", value: 1000000 },
      { label: "CTR", value: 1.6, suffix: "%" },
      { label: "Avg Position", value: 18.7 },
    ],
    badges: ["15.6K Clicks", "1M Impressions", "1.6% CTR"],
  },
];

/* ─── OPTIMIZED CANVAS ─── */
function NeuronField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    let timeout: any;
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => (isScrolling.current = false), 120);
    };
    window.addEventListener("scroll", onScroll);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raf: number;
    const draw = () => {
      if (!isScrolling.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" />;
}

/* ─── COUNTUP SAFE ─── */
function CountUp({ value, suffix = "" }: any) {
  return <span>{value.toLocaleString()}{suffix}</span>;
}

/* ─── MAIN ─── */
export default function SeoResults() {
  const [active, setActive] = useState(0);
  const study = CASE_STUDIES[active];

  const goPrev = () => setActive((p) => (p - 1 + CASE_STUDIES.length) % CASE_STUDIES.length);
  const goNext = () => setActive((p) => (p + 1) % CASE_STUDIES.length);

  return (
    <section className="relative py-20" style={{ background: BG }}>
      <NeuronField />

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-10 relative z-10">
          <span className="font-mono text-sm text-[#00D4FF] block mb-3">
            SEO Results
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            SEO Case Studies
          </h2>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(10,20,40,0.75)",
            border: "1px solid rgba(255,255,255,0.06)",
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            contain: "layout paint",
          }}
        >

          {/* TOP */}
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-white font-bold">{study.title}</h3>
              <p className="text-xs text-gray-400">{study.url}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={goPrev}>◀</button>
              <button onClick={goNext}>▶</button>
            </div>
          </div>

          {/* IMAGES */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="group">
              <span className="inline-block mb-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(230,57,70,0.25)", border: "1px solid rgba(230,57,70,0.4)", color: "#E63946" }}>
                Before SEO
              </span>
              <div className="rounded-xl overflow-hidden bg-white/[0.02]">
                <Image src={study.beforeImg} alt={`${study.title} — Before SEO`} width={800} height={600} loading="eager" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            </div>
            <div className="group">
              <span className="inline-block mb-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(0,229,137,0.2)", border: "1px solid rgba(0,229,137,0.4)", color: "#00E589" }}>
                After SEO
              </span>
              <div className="rounded-xl overflow-hidden bg-white/[0.02]">
                <Image src={study.afterImg} alt={`${study.title} — After SEO`} width={800} height={600} loading="eager" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {study.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-cyan-400 text-2xl font-bold">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap gap-2 mt-6">
            {study.badges.map((b) => (
              <span key={b} className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                {b}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}