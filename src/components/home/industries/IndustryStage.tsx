'use client';

import { useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { industries } from '@/data/home';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { CtaLink, GrainOverlay, MonoLabel, SectionHeading } from '../ui';
import { BREAKPOINTS } from '../hooks';

gsap.registerPlugin(ScrollTrigger);

const TOTAL = industries.length;
const COUNTER_TOTAL = String(TOTAL).padStart(2, '0');

/* Keyword field — every unique keyword, split across the two flanks. */
const allKeywords = Array.from(new Set(industries.flatMap((i) => i.keywords)));
const leftKeywords = allKeywords.filter((_, i) => i % 2 === 0);
const rightKeywords = allKeywords.filter((_, i) => i % 2 === 1);

/* ── Authored abstract SVG panels (one per industry) ─────────── */

function FinancePanel() {
  // Secure grid + vault arcs
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" fill="none" stroke="currentColor">
      <g opacity="0.14" strokeWidth="1">
        {[50, 100, 150, 200, 250, 300, 350].map((x) => (
          <line key={`v${x}`} x1={x} y1="20" x2={x} y2="280" />
        ))}
        {[60, 120, 180, 240].map((y) => (
          <line key={`h${y}`} x1="24" y1={y} x2="376" y2={y} />
        ))}
      </g>
      <g strokeWidth="1.5">
        <circle cx="200" cy="150" r="34" opacity="0.9" />
        <circle cx="200" cy="150" r="58" opacity="0.5" strokeDasharray="10 14" />
        <circle cx="200" cy="150" r="84" opacity="0.3" strokeDasharray="4 18" />
        <line x1="200" y1="116" x2="200" y2="96" opacity="0.6" />
        <line x1="200" y1="184" x2="200" y2="204" opacity="0.6" />
        <line x1="166" y1="150" x2="146" y2="150" opacity="0.6" />
        <line x1="234" y1="150" x2="254" y2="150" opacity="0.6" />
      </g>
      <circle cx="200" cy="150" r="6" fill="currentColor" stroke="none" />
      <rect x="188" y="138" width="24" height="24" opacity="0.7" strokeWidth="1.5" transform="rotate(45 200 150)" />
    </svg>
  );
}

function HealthPanel() {
  // Pulse line + cross grid
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" fill="none" stroke="currentColor">
      <g opacity="0.3" strokeWidth="1.5">
        {[
          [70, 70],
          [330, 64],
          [96, 232],
          [304, 240],
          [200, 46],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <line x1={x - 7} y1={y} x2={x + 7} y2={y} />
            <line x1={x} y1={y - 7} x2={x} y2={y + 7} />
          </g>
        ))}
      </g>
      <g opacity="0.14" strokeWidth="1">
        <line x1="24" y1="110" x2="376" y2="110" />
        <line x1="24" y1="190" x2="376" y2="190" />
      </g>
      <path
        d="M 24 150 H 120 L 142 108 L 168 196 L 190 128 L 206 150 H 268 L 284 134 L 300 150 H 376"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="168" cy="196" r="4" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

function RetailPanel() {
  // Conversion funnel blocks
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" fill="none" stroke="currentColor">
      <g strokeWidth="1.5">
        <rect x="70" y="42" width="260" height="34" rx="4" opacity="0.9" />
        <rect x="106" y="98" width="188" height="34" rx="4" opacity="0.7" />
        <rect x="140" y="154" width="120" height="34" rx="4" opacity="0.55" />
        <rect x="168" y="210" width="64" height="34" rx="4" opacity="0.9" />
      </g>
      <g opacity="0.35" strokeWidth="1">
        <line x1="70" y1="76" x2="106" y2="98" />
        <line x1="330" y1="76" x2="294" y2="98" />
        <line x1="106" y1="132" x2="140" y2="154" />
        <line x1="294" y1="132" x2="260" y2="154" />
        <line x1="140" y1="188" x2="168" y2="210" />
        <line x1="260" y1="188" x2="232" y2="210" />
      </g>
      <line x1="200" y1="244" x2="200" y2="266" strokeWidth="1.5" opacity="0.7" />
      <path d="M 193 260 L 200 268 L 207 260" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FederalPanel() {
  // Shield lattice
  const clipId = useId();
  const shield = 'M 200 40 L 296 78 V 158 C 296 216 252 246 200 264 C 148 246 104 216 104 158 V 78 Z';
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" fill="none" stroke="currentColor">
      <defs>
        <clipPath id={clipId}>
          <path d={shield} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} opacity="0.28" strokeWidth="1">
        {[-160, -100, -40, 20, 80, 140, 200].map((o) => (
          <line key={`a${o}`} x1={o} y1="300" x2={o + 260} y2="20" />
        ))}
        {[40, 100, 160, 220, 280, 340, 400].map((o) => (
          <line key={`b${o}`} x1={o} y1="300" x2={o - 260} y2="20" />
        ))}
      </g>
      <path d={shield} strokeWidth="2" strokeLinejoin="round" />
      <path d={shield} strokeWidth="1" opacity="0.4" transform="translate(200 152) scale(0.82) translate(-200 -152)" />
      <circle cx="200" cy="150" r="5" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

const PANELS = {
  finance: FinancePanel,
  health: HealthPanel,
  retail: RetailPanel,
  federal: FederalPanel,
} as const;

function IndustryPanel({ id }: { id: string }) {
  const Panel = PANELS[id as keyof typeof PANELS] ?? FinancePanel;
  return (
    <div className="h-full w-full p-8 text-bytes-signal md:p-10">
      <Panel />
    </div>
  );
}

/* ── Motion setup (desktop only; stacked variants are static) ── */
const setupStage: MotionSetup = ({ root, mm, reduced }) => {
  if (reduced) return; // reduced motion uses the stacked variant via CSS

  mm.add(BREAKPOINTS.desktop, () => {
    const panels = gsap.utils.toArray<HTMLElement>('[data-ind-panel]', root);
    const copies = gsap.utils.toArray<HTMLElement>('[data-ind-copy]', root);
    const steps = gsap.utils.toArray<HTMLElement>('[data-ind-step]', root);
    const keywords = gsap.utils.toArray<HTMLElement>('[data-ind-keyword]', root);
    const counter = root.querySelector<HTMLElement>('[data-ind-counter]');
    if (!panels.length || !copies.length || !steps.length) return;

    let current = 0;

    const applyKeywords = (index: number) => {
      const active = new Set(industries[index]?.keywords ?? []);
      keywords.forEach((el) => {
        gsap.to(el, {
          opacity: active.has(el.dataset.indKeyword ?? '') ? 0.35 : 0.08,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    // Initial state: industry 01 active, everything else parked.
    panels.forEach((panel, i) => gsap.set(panel, { opacity: i === 0 ? 1 : 0, scale: 1 }));
    copies.forEach((copy, i) => gsap.set(copy, { opacity: i === 0 ? 1 : 0, y: 0 }));
    keywords.forEach((el) => {
      const active = industries[0]?.keywords.includes(el.dataset.indKeyword ?? '');
      gsap.set(el, { opacity: active ? 0.35 : 0.08 });
    });

    const activate = (next: number) => {
      if (next === current || !panels[next] || !copies[next]) return;
      const prev = current;
      current = next;

      // Media crossfade + settle scale 1.04 → 1
      gsap.to(panels[prev], { opacity: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
      gsap.fromTo(
        panels[next],
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
      );

      // Copy swap (y 16, 0.45)
      gsap.to(copies[prev], { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
      gsap.fromTo(
        copies[next],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.08, overwrite: 'auto' }
      );

      applyKeywords(next);
      if (counter) counter.textContent = String(next + 1).padStart(2, '0');
    };

    // Invisible step blocks drive the stage.
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) activate(i);
        },
      });
    });
  });
};

/* ── Section ─────────────────────────────────────────────────── */
export function IndustryStage() {
  return (
    <MotionBoundary
      as="section"
      data-nav-theme="dark"
      aria-labelledby="industries-heading"
      className="relative bg-bytes-midnight"
      setup={setupStage}
    >
      <GrainOverlay opacity={0.04} />

      <div className="relative z-[2] mx-auto max-w-[90rem] px-6 pb-16 pt-24 md:px-10 md:pt-28 min-[1200px]:pb-0">
        {/* Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="industries-heading"
            eyebrow="SYS.04 // INDUSTRIES"
            lines={['Built for complex businesses,', 'not one-size-fits-all briefs.']}
            theme="dark"
          />
          <CtaLink href="/industries" variant="ghost" className="shrink-0">
            Explore Industries
          </CtaLink>
        </div>

        {/* ── Desktop sticky stage (hidden on tablet/mobile/reduced) ── */}
        <div className="relative hidden motion-safe:min-[1200px]:block">
          <div className="sticky top-[20vh] h-[60vh]">
            <div className="grid h-full grid-cols-[1fr_minmax(0,560px)_1fr] items-center gap-12">
              {/* Left keyword flank */}
              <div className="flex flex-col items-end gap-6" aria-hidden="true">
                {leftKeywords.map((kw) => (
                  <span
                    key={kw}
                    data-ind-keyword={kw}
                    className="whitespace-nowrap text-right font-bytes-mono text-2xl tracking-[0.14em] text-bytes-ice opacity-10 xl:text-3xl"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Center media + copy */}
              <div className="flex h-full flex-col gap-8">
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-bytes-line bg-bytes-navy">
                  {industries.map((industry) => (
                    <div key={industry.id} data-ind-panel className="absolute inset-0">
                      <IndustryPanel id={industry.id} />
                    </div>
                  ))}
                </div>
                <div className="relative h-48">
                  {industries.map((industry, i) => (
                    <div key={industry.id} data-ind-copy className="absolute inset-0">
                      <MonoLabel tone="signal">
                        {String(i + 1).padStart(2, '0')} // {industry.keywords[0]}
                      </MonoLabel>
                      <h3 className="mt-2 font-bytes-display text-xl font-semibold tracking-[-0.01em] text-bytes-ice">
                        {industry.name}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-bytes-steel">
                        {industry.copy}
                      </p>
                    </div>
                  ))}
                  {/* Index counter */}
                  <div className="absolute bottom-0 right-0 font-bytes-mono text-xs tracking-[0.22em] text-bytes-steel/60">
                    <span data-ind-counter>01</span>/{COUNTER_TOTAL}
                  </div>
                </div>
              </div>

              {/* Right keyword flank */}
              <div className="flex flex-col items-start gap-6" aria-hidden="true">
                {rightKeywords.map((kw) => (
                  <span
                    key={kw}
                    data-ind-keyword={kw}
                    className="whitespace-nowrap font-bytes-mono text-2xl tracking-[0.14em] text-bytes-ice opacity-10 xl:text-3xl"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Invisible step blocks — one per industry, drive the stage */}
          <div>
            {industries.map((industry) => (
              <div key={industry.id} data-ind-step className="h-[80vh]" aria-hidden="true" />
            ))}
          </div>
        </div>

        {/* ── Stacked variant: tablet / mobile / reduced motion ── */}
        <div className="mt-14 space-y-14 motion-safe:min-[1200px]:hidden">
          {industries.map((industry, i) => (
            <div key={industry.id} className="max-w-2xl">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-bytes-line bg-bytes-navy sm:aspect-video">
                <IndustryPanel id={industry.id} />
              </div>
              <MonoLabel tone="signal" className="mt-6 block">
                {String(i + 1).padStart(2, '0')}/{COUNTER_TOTAL}
              </MonoLabel>
              <h3 className="mt-2 font-bytes-display text-xl font-semibold tracking-[-0.01em] text-bytes-ice md:text-2xl">
                {industry.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bytes-steel md:text-base">
                {industry.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MotionBoundary>
  );
}
