"use client";
import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════
   DATA — 5 premium capability pillars
   ═══════════════════════════════════════════════════════ */
const capabilities = [
  {
    title: "Product Engineering",
    description: "We build scalable digital products and systems.",
    tags: ["Web", "SaaS", "Backend", "APIs", "AI Systems"],
    color: "#915EFF",
    icon: (c: string) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Experience Design",
    description: "Design that drives engagement and clarity.",
    tags: ["UI/UX", "Branding", "User Flows", "Prototyping"],
    color: "#00D4FF",
    icon: (c: string) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: "Mobile & Platforms",
    description: "Native-grade apps across every screen.",
    tags: ["iOS", "Android", "Cross-platform", "Performance"],
    color: "#10b981",
    icon: (c: string) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "Growth & Intelligence",
    description: "Data-driven growth powered by smart systems.",
    tags: ["SEO", "Analytics", "AI", "Automation"],
    color: "#f59e0b",
    icon: (c: string) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Strategy & Innovation",
    description: "We align technology with long-term vision.",
    tags: ["Digital Strategy", "Architecture", "Scaling", "R&D"],
    color: "#ec4899",
    icon: (c: string) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";
const rand = (s: string) => s[Math.floor(Math.random() * s.length)];

/* ═══════════════════════════════════════════════════════
   SCRAMBLE TEXT HOOK
   ═══════════════════════════════════════════════════════ */
function useScrambleText(text: string, trigger: boolean) {
  const [display, setDisplay] = useState("");
  const settled = useRef(new Set<number>());

  useEffect(() => {
    if (!trigger) { setDisplay(""); settled.current.clear(); return; }
    settled.current.clear();
    let frame: number;
    const total = text.length;
    let tick = 0;
    const run = () => {
      tick++;
      const chars: string[] = [];
      for (let i = 0; i < total; i++) {
        if (text[i] === " ") { chars.push(" "); settled.current.add(i); continue; }
        if (settled.current.has(i)) { chars.push(text[i]); continue; }
        if (tick > (i + 1) * 2) { settled.current.add(i); chars.push(text[i]); continue; }
        chars.push(rand(CHARS));
      }
      setDisplay(chars.join(""));
      if (settled.current.size < total) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [text, trigger]);

  return display;
}

/* ═══════════════════════════════════════════════════════
   NEURON FIELD CANVAS
   ═══════════════════════════════════════════════════════ */
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
    const COUNT = 70;

    const resize = () => {
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (neurons.length === 0) {
        neurons = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: 1 + Math.random() * 1.5, opacity: 0.15 + Math.random() * 0.25,
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
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / LINK_DIST) * 0.12})`;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] pointer-events-none" style={{ opacity: 0.8 }} />;
}

/* ═══════════════════════════════════════════════════════
   CAPABILITY ITEM — floating, no borders, premium
   ═══════════════════════════════════════════════════════ */
function CapabilityItem({
  item,
  index,
  revealed,
}: {
  item: (typeof capabilities)[0];
  index: number;
  revealed: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const titleText = useScrambleText(item.title, revealed);

  const onEnter = () => {
    setHovered(true);
    setGlitching(true);
    setTimeout(() => setGlitching(false), 400);
  };

  return (
    <div
      className={`svc-item group relative px-10 py-14 cursor-pointer overflow-hidden ${revealed ? "svc-revealed" : "svc-hidden"}`}
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Scanline sweep */}
      {revealed && (
        <div className="absolute inset-0 pointer-events-none z-20 svc-scanline" style={{ animationDelay: `${index * 0.15}s` }} />
      )}

      {/* Glitch layers */}
      {glitching && (
        <>
          <div className="absolute inset-0 z-30 pointer-events-none svc-glitch-r" />
          <div className="absolute inset-0 z-30 pointer-events-none svc-glitch-b" />
        </>
      )}

      {/* Hover ambient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500 z-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${item.color}0a 0%, transparent 70%)`,
        }}
      />

      {/* Left accent line */}
      <div
        className="absolute left-0 top-[15%] bottom-[15%] w-[2px] origin-top transition-all duration-700"
        style={{
          background: `linear-gradient(180deg, transparent, ${item.color}60, transparent)`,
          transform: revealed ? "scaleY(1)" : "scaleY(0)",
          transitionDelay: `${index * 150 + 300}ms`,
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 mb-6"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0) scale(1)" : "translateY(20px) scale(0.5)",
          transition: `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 150 + 200}ms`,
          filter: hovered ? `drop-shadow(0 0 24px ${item.color}80)` : `drop-shadow(0 0 8px ${item.color}30)`,
        }}
      >
        {item.icon(item.color)}
        {hovered && <div className="absolute inset-0 rounded-full svc-ping" style={{ borderColor: item.color }} />}
      </div>

      {/* Title — big, confident */}
      <h3
        className="relative z-10 font-heading font-bold mb-3 transition-colors duration-300 leading-tight"
        style={{
          fontSize: "clamp(22px, 2.2vw, 28px)",
          color: hovered ? "#fff" : "rgba(255,255,255,0.85)",
          textShadow: hovered ? `0 0 30px ${item.color}40` : "none",
        }}
      >
        {titleText || "\u00A0"}
      </h3>

      {/* Description — one line, minimal */}
      <p
        className="relative z-10 text-[15px] leading-relaxed mb-6 transition-all duration-500"
        style={{
          color: hovered ? "#94a3b8" : "#475569",
          fontWeight: 300,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(10px)",
          transitionDelay: `${index * 150 + 400}ms`,
        }}
      >
        {item.description}
      </p>

      {/* Tags — floating pills */}
      <div
        className="relative z-10 flex flex-wrap gap-2 mb-6 transition-all duration-500"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(8px)",
          transitionDelay: `${index * 150 + 500}ms`,
        }}
      >
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-mono tracking-wide px-3 py-1 rounded-full transition-all duration-300"
            style={{
              color: hovered ? item.color : "rgba(255,255,255,0.25)",
              border: `1px solid ${hovered ? item.color + "30" : "rgba(255,255,255,0.06)"}`,
              background: hovered ? item.color + "08" : "transparent",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Explore link */}
      <span
        className="relative z-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-mono transition-all duration-300"
        style={{
          color: hovered ? item.color : "rgba(255,255,255,0.1)",
          opacity: revealed ? 1 : 0,
          transitionDelay: `${index * 150 + 600}ms`,
        }}
      >
        Explore
        <span className={`inline-block transition-transform duration-300 ${hovered ? "translate-x-2" : ""}`}>→</span>
        {hovered && <span className="svc-cursor-blink">_</span>}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════ */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  /* Auto-type tagline */
  const tagline = "Five disciplines. One studio. Zero compromises.";
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    setShowCursor(true);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(tagline.slice(0, i));
      if (i >= tagline.length) {
        clearInterval(iv);
        setTimeout(() => setShowCursor(false), 600);
      }
    }, 60);
    return () => clearInterval(iv);
  }, [revealed]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed) return;
    import("gsap").then(({ default: gsap }) => {
      gsap.fromTo(
        ".svc-pulse-ring",
        { scale: 0, opacity: 1 },
        { scale: 8, opacity: 0, duration: 1.8, ease: "power2.out" }
      );
    });
  }, [revealed]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen py-[120px] overflow-hidden"
      style={{ background: "#050816" }}
    >
      <NeuronField />

      {/* Pulse ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3]">
        <div className="svc-pulse-ring w-24 h-24 rounded-full border-2" style={{ borderColor: "#915EFF", opacity: 0 }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-20">

        {/* HEADER */}
        <div className="text-center mb-28">
          <div
            className="inline-flex items-center gap-3 mb-6 transition-all duration-700"
            style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(20px)" }}
          >
            <div className="w-10 h-[1px]" style={{ background: "#00D4FF" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "#00D4FF" }}>
              Capabilities
            </span>
            <div className="w-10 h-[1px]" style={{ background: "#00D4FF" }} />
          </div>

          <h2
            className="font-heading font-extrabold mb-6 leading-[1.1]"
            style={{
              fontSize: "clamp(32px, 5vw, 72px)",
              color: "#fff",
              textShadow: revealed ? "0 0 60px rgba(145,94,255,0.12)" : "none",
              transition: "text-shadow 1s",
            }}
          >
            {typed || "\u00A0"}
            {showCursor && <span className="svc-cursor-blink" style={{ color: "#915EFF" }}>|</span>}
          </h2>
        </div>

        {/* CAPABILITY GRID — 5 items, top row 3, bottom row 2 centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 relative z-10">
          {capabilities.slice(0, 3).map((item, i) => (
            <CapabilityItem key={item.title} item={item} index={i} revealed={revealed} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[853px] mx-auto gap-0 relative z-10">
          {capabilities.slice(3).map((item, i) => (
            <CapabilityItem key={item.title} item={item} index={i + 3} revealed={revealed} />
          ))}
        </div>

        {/* Bottom line */}
        <div
          className="mt-20 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-1000"
          style={{ color: "rgba(255,255,255,0.06)", opacity: revealed ? 1 : 0, transitionDelay: "2s" }}
        >
          <span className="w-12 h-[1px] bg-white/5" />
          sys.capabilities — 5 modules active
          <span className="w-12 h-[1px] bg-white/5" />
        </div>
      </div>

      {/* ── STYLES ── */}
      <style jsx>{`
        .svc-scanline {
          background: linear-gradient(180deg, transparent 0%, rgba(145,94,255,0.08) 45%, rgba(0,212,255,0.15) 50%, rgba(145,94,255,0.08) 55%, transparent 100%);
          background-size: 100% 300%;
          animation: svc-scan 1.2s ease-out forwards;
        }
        @keyframes svc-scan {
          0% { background-position: 0% 100%; opacity: 1; }
          80% { opacity: 1; }
          100% { background-position: 0% -100%; opacity: 0; }
        }
        .svc-hidden { opacity: 0; transform: translateY(50px) scale(0.95); filter: blur(6px); }
        .svc-revealed { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
        .svc-glitch-r { background: rgba(255,0,50,0.04); animation: gr 0.4s steps(2) forwards; }
        .svc-glitch-b { background: rgba(0,100,255,0.04); animation: gb 0.4s steps(3) forwards; }
        @keyframes gr { 0%{transform:translate(3px,-2px)} 25%{transform:translate(-4px,1px)} 50%{transform:translate(2px,3px)} 75%{transform:translate(-1px,-3px)} 100%{transform:translate(0,0);opacity:0} }
        @keyframes gb { 0%{transform:translate(-3px,2px)} 33%{transform:translate(4px,-1px)} 66%{transform:translate(-2px,-2px)} 100%{transform:translate(0,0);opacity:0} }
        .svc-ping { border: 1.5px solid; animation: sp 1s cubic-bezier(0,0,0.2,1) forwards; }
        @keyframes sp { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.5);opacity:0} }
        .svc-cursor-blink { animation: sb 0.6s step-end infinite; }
        @keyframes sb { 0%,100%{opacity:1} 50%{opacity:0} }
        .svc-nebula { animation: sn 8s ease-in-out infinite alternate; }
        @keyframes sn { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.3) translate(10px,-10px);opacity:0.8} }
      `}</style>
    </section>
  );
}
