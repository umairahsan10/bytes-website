'use client';

import { useCallback, useRef, type ReactNode, type PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/data/home';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { MonoLabel, CtaLink, GrainOverlay } from '../ui';
import { usePointerFine, useReducedMotionPref } from '../hooks';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MOTION = '(min-width: 1200px) and (prefers-reduced-motion: no-preference)';
const STACK_MOTION = '(max-width: 1199px) and (prefers-reduced-motion: no-preference)';

/* ── Card content (generic conversational snippets / module titles only) ── */

type Message = { from: string; text: string };

const MESSAGES: Message[] = [
  { from: 'BYTE BOT', text: 'How can I help?' },
  { from: 'VISITOR', text: 'What are your hours?' },
  { from: 'BYTE BOT', text: "Here's what I found." },
  { from: 'VISITOR', text: 'Can I book a consultation?' },
  { from: 'BYTE BOT', text: 'Booking confirmed.' },
  { from: 'BYTE BOT', text: 'Anything else I can do?' },
];

const MODULES = ['Inbox', 'Workflows', 'Customers', 'Data', 'Reports', 'Settings'];

/** Final 2×3 dashboard grid slots (percent of the visual container). */
const GRID: { left: string; top: string }[] = [
  { left: '1%', top: '2%' },
  { left: '53%', top: '2%' },
  { left: '1%', top: '36%' },
  { left: '53%', top: '36%' },
  { left: '1%', top: '70%' },
  { left: '53%', top: '70%' },
];

/**
 * State-A scatter, expressed as transform offsets from each card's grid slot —
 * FLIP-style: layout IS the grid; GSAP animates x/y/rotation back to 0.
 */
const SCATTER: { x: number; y: number; r: number }[] = [
  { x: -30, y: 22, r: -4 },
  { x: 36, y: -16, r: 3 },
  { x: -52, y: -6, r: 2 },
  { x: 46, y: 30, r: -2 },
  { x: -18, y: -34, r: 3 },
  { x: 28, y: 12, r: -3 },
];

/* ── Small presentational pieces ─────────────────────────────────── */

function MessageFace({ message }: { message: Message }) {
  return (
    <div
      data-prod-face-msg
      className="absolute inset-0 flex flex-col justify-between p-3.5 [will-change:opacity]"
    >
      <span className="font-bytes-mono text-[9px] uppercase tracking-[0.22em] text-bytes-cyan/70">
        {message.from}
      </span>
      <p className="font-bytes-display text-sm leading-snug text-bytes-ice/90">{message.text}</p>
      <div className="flex items-center gap-1" aria-hidden="true">
        <span className="h-1 w-1 rounded-full bg-bytes-signal/80" />
        <span className="h-1 w-1 rounded-full bg-bytes-signal/50" />
        <span className="h-1 w-1 rounded-full bg-bytes-signal/30" />
      </div>
    </div>
  );
}

function ModuleFace({ title }: { title: string }) {
  return (
    <div
      data-prod-face-mod
      className="absolute inset-0 flex flex-col justify-between p-3.5 [will-change:opacity]"
    >
      <div className="flex items-center justify-between">
        <span className="font-bytes-display text-sm font-semibold text-bytes-ice">{title}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-bytes-signal" aria-hidden="true" />
      </div>
      <div className="space-y-2" aria-hidden="true">
        <div className="h-1.5 w-4/5 rounded-full bg-bytes-ice/10" />
        <div className="h-1.5 w-3/5 rounded-full bg-bytes-ice/10" />
      </div>
      <span className="font-bytes-mono text-[9px] uppercase tracking-[0.22em] text-bytes-steel/50">
        Suite module
      </span>
    </div>
  );
}

/** Hover tilt (pointer-fine, motion-safe): ≤3° rotation, ≤12px translate. */
function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotionPref();
  const enabled = pointerFine && !reduced;

  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (!el || !enabled) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const ry = clamp(px * 6, 3);
    const rx = clamp(-py * 6, 3);
    const tx = clamp(px * 24, 12);
    const ty = clamp(py * 24, 12);
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      className={`relative h-full w-full rounded-xl border border-bytes-line bg-bytes-graphite/95 ${className}`}
      style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      onPointerMove={enabled ? onMove : undefined}
      onPointerLeave={enabled ? onLeave : undefined}
    >
      {children}
    </div>
  );
}

/** Animated dash waveform (CSS keyframes, disabled under reduced motion). */
function Waveform({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 24" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M0 12 Q 10 2 20 12 T 40 12 T 60 12 T 80 12 T 100 12 T 120 12 T 140 12 T 160 12 T 180 12 T 200 12 T 220 12 T 240 12 T 260 12 T 280 12 T 300 12 T 320 12"
        fill="none"
        stroke="#4C92FF"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="bp-dash"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function TextBlock({
  product,
  dataAttr,
}: {
  product: (typeof products)['byteBots'];
  dataAttr: Record<string, string>;
}) {
  return (
    <div
      {...dataAttr}
      className="absolute inset-0 flex flex-col justify-center [will-change:transform,opacity]"
    >
      <MonoLabel tone="signal">{product.name.toUpperCase()}</MonoLabel>
      <h3 className="mt-4 font-bytes-display text-3xl font-semibold tracking-[-0.02em] text-bytes-ice xl:text-4xl">
        {product.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>
      <p className="mt-5 max-w-md leading-relaxed text-bytes-steel">{product.copy}</p>
      <div className="mt-8">
        <CtaLink href={product.href} variant="ghost">
          {product.cta}
          <span aria-hidden="true">→</span>
        </CtaLink>
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */

/**
 * SYS.02 // PRODUCTS — two-state pinned scene on desktop (+=200%, scrub 0.6):
 * State A (Byte Bots conversation network) crossfades around 0.5 into
 * State B (Byte Suites dashboard grid); the same six cards FLIP from their
 * scatter transforms back to the underlying 2×3 grid layout.
 * Mobile/tablet/reduced-motion: two stacked static sub-sections.
 */
export function ProductSystems() {
  const setup = useCallback<MotionSetup>(({ root, mm }) => {
    /* ── Desktop: pinned two-state scene ───────────────────────── */
    mm.add(DESKTOP_MOTION, () => {
      const stage = root.querySelector<HTMLElement>('[data-prod-stage]');
      if (!stage) return;

      const textA = stage.querySelector<HTMLElement>('[data-prod-text-a]');
      const textB = stage.querySelector<HTMLElement>('[data-prod-text-b]');
      const net = stage.querySelector<HTMLElement>('[data-prod-net]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-prod-card]', stage);
      const msgFaces = gsap.utils.toArray<HTMLElement>('[data-prod-face-msg]', stage);
      const modFaces = gsap.utils.toArray<HTMLElement>('[data-prod-face-mod]', stage);

      gsap.set(textB, { autoAlpha: 0, y: 24 });
      gsap.set(modFaces, { autoAlpha: 0 });
      cards.forEach((card, i) => {
        const s = SCATTER[i % SCATTER.length];
        gsap.set(card, { x: s.x, y: s.y, rotation: s.r });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // 0 → 0.85: hold State A (Byte Bots).
      tl.to({}, { duration: 0.85 }, 0)
        // Crossfade around the midpoint.
        .to(net, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 0.82)
        .to(textA, { autoAlpha: 0, y: -24, duration: 0.25, ease: 'power2.in' }, 0.85)
        .to(msgFaces, { autoAlpha: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in' }, 0.85)
        // FLIP-style re-grid: transforms return to the underlying grid layout.
        .to(cards, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.04 }, 0.9)
        .fromTo(textB, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 1.1)
        .to(modFaces, { autoAlpha: 1, duration: 0.35, stagger: 0.04 }, 1.15)
        // 1.55 → 2: hold State B (Byte Suites).
        .to({}, { duration: 0.45 }, 1.55);
    });

    /* ── Mobile/tablet: simple reveals, no pin ─────────────────── */
    mm.add(STACK_MOTION, () => {
      gsap.utils.toArray<HTMLElement>('[data-prod-reveal]', root).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
      });
    });
  }, []);

  return (
    <MotionBoundary
      as="section"
      id="products"
      data-nav-theme="dark"
      aria-labelledby="products-heading"
      className="relative overflow-hidden bg-bytes-midnight text-bytes-ice"
      setup={setup}
    >
      <GrainOverlay />
      <style>{`
        @keyframes bpDashFlow { to { stroke-dashoffset: -48; } }
        @keyframes bpCardFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .bp-dash { animation: bpDashFlow 3.2s linear infinite; }
        .bp-float { animation: bpCardFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bp-dash, .bp-float { animation: none; }
        }
      `}</style>

      {/* Header */}
      <div className="relative z-[2] mx-auto max-w-7xl px-6 pt-24 pb-6 md:px-10 md:pt-32">
        <div className="flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-bytes-signal/60" aria-hidden="true" />
          <MonoLabel tone="signal">SYS.02 // PRODUCTS</MonoLabel>
        </div>
        <h2 id="products-heading" className="sr-only">
          Bytes Platform products
        </h2>
      </div>

      {/* ── Desktop pinned two-state scene (≥1200px, motion-safe) ── */}
      <div className="relative z-[2] hidden min-[1200px]:motion-safe:block">
        <div data-prod-stage className="relative h-screen">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-2 items-center gap-16 px-10">
            {/* Text blocks — both always in the DOM, opacity swap only */}
            <div className="relative h-[56vh]">
              <TextBlock product={products.byteBots} dataAttr={{ 'data-prod-text-a': '' }} />
              <TextBlock product={products.byteSuites} dataAttr={{ 'data-prod-text-b': '' }} />
            </div>

            {/* Visual: conversation network → dashboard grid */}
            <div className="relative mx-auto aspect-[7/6] w-full max-w-[560px]">
              {/* SVG network + waveform behind the cards (State A) */}
              <div data-prod-net className="absolute inset-0" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
                  <polyline
                    points="19,20 82,12 84,56 15,49 20,77 81,86"
                    fill="none"
                    stroke="rgba(114,218,255,0.22)"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line x1="19" y1="20" x2="15" y2="49" stroke="rgba(76,146,255,0.2)" vectorEffect="non-scaling-stroke" />
                  <line x1="84" y1="56" x2="20" y2="77" stroke="rgba(76,146,255,0.16)" vectorEffect="non-scaling-stroke" />
                  {[
                    [19, 20],
                    [82, 12],
                    [15, 49],
                    [84, 56],
                    [20, 77],
                    [81, 86],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="1" fill="#4C92FF" fillOpacity="0.6" />
                  ))}
                  <path
                    d="M2 96 Q 8 90 14 96 T 26 96 T 38 96 T 50 96 T 62 96 T 74 96 T 86 96 T 98 96"
                    fill="none"
                    stroke="#4C92FF"
                    strokeOpacity="0.5"
                    strokeDasharray="5 5"
                    className="bp-dash"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Six cards: layout = final grid; scatter = transform offsets */}
              {MESSAGES.map((m, i) => (
                <div
                  key={m.text}
                  data-prod-card
                  className="absolute [will-change:transform]"
                  style={{ ...GRID[i], width: '46%', height: '27%' }}
                >
                  <div className="bp-float h-full w-full" style={{ animationDelay: `${i * 0.7}s` }}>
                    <TiltCard>
                      <MessageFace message={m} />
                      <ModuleFace title={MODULES[i]} />
                    </TiltCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet / reduced-motion: stacked sub-sections ── */}
      <div className="relative z-[2] min-[1200px]:motion-safe:hidden">
        <div className="mx-auto flex max-w-3xl flex-col gap-20 px-6 pb-24 md:px-10">
          {/* Byte Bots */}
          <div data-prod-reveal>
            <MonoLabel tone="signal">{products.byteBots.name.toUpperCase()}</MonoLabel>
            <h3 className="mt-4 font-bytes-display text-2xl font-semibold tracking-[-0.02em] text-bytes-ice md:text-3xl">
              {products.byteBots.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-4 leading-relaxed text-bytes-steel">{products.byteBots.copy}</p>
            <div className="mt-6">
              <CtaLink href={products.byteBots.href} variant="ghost">
                {products.byteBots.cta}
                <span aria-hidden="true">→</span>
              </CtaLink>
            </div>
            {/* Static conversation visual */}
            <div className="mt-10 flex flex-col gap-3" aria-hidden="true">
              {MESSAGES.slice(0, 4).map((m, i) => (
                <div
                  key={m.text}
                  className={`w-[80%] rounded-xl border border-bytes-line bg-bytes-graphite/95 p-3.5 ${
                    i % 2 === 0 ? 'self-start' : 'self-end'
                  }`}
                >
                  <span className="font-bytes-mono text-[9px] uppercase tracking-[0.22em] text-bytes-cyan/70">
                    {m.from}
                  </span>
                  <p className="mt-1.5 font-bytes-display text-sm leading-snug text-bytes-ice/90">
                    {m.text}
                  </p>
                </div>
              ))}
              <Waveform className="mt-2 h-6 w-full" />
            </div>
          </div>

          {/* Byte Suites */}
          <div data-prod-reveal>
            <MonoLabel tone="signal">{products.byteSuites.name.toUpperCase()}</MonoLabel>
            <h3 className="mt-4 font-bytes-display text-2xl font-semibold tracking-[-0.02em] text-bytes-ice md:text-3xl">
              {products.byteSuites.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-4 leading-relaxed text-bytes-steel">{products.byteSuites.copy}</p>
            <div className="mt-6">
              <CtaLink href={products.byteSuites.href} variant="ghost">
                {products.byteSuites.cta}
                <span aria-hidden="true">→</span>
              </CtaLink>
            </div>
            {/* Static dashboard grid */}
            <div className="mt-10 grid grid-cols-2 gap-3" aria-hidden="true">
              {MODULES.map((title) => (
                <div
                  key={title}
                  className="rounded-xl border border-bytes-line bg-bytes-graphite/95 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bytes-display text-sm font-semibold text-bytes-ice">
                      {title}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-bytes-signal" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-4/5 rounded-full bg-bytes-ice/10" />
                    <div className="h-1.5 w-3/5 rounded-full bg-bytes-ice/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionBoundary>
  );
}
