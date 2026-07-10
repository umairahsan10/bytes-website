'use client';

import Link from 'next/link';
import { useRef, type ReactNode, type CSSProperties } from 'react';
import { usePointerFine, useReducedMotionPref } from './hooks';

/* ── Mono metadata label ─────────────────────────────────────── */
export function MonoLabel({
  children,
  className = '',
  tone = 'steel',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'steel' | 'signal' | 'ink';
}) {
  const tones = {
    steel: 'text-bytes-steel/70',
    signal: 'text-bytes-signal',
    ink: 'text-bytes-navy/60',
  } as const;
  return (
    <span
      className={`font-bytes-mono text-[11px] md:text-xs tracking-[0.22em] uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Section heading: eyebrow + display type ─────────────────── */
export function SectionHeading({
  eyebrow,
  lines,
  theme = 'dark',
  align = 'left',
  id,
}: {
  eyebrow?: string;
  lines: string[];
  theme?: 'dark' | 'light';
  align?: 'left' | 'center';
  id?: string;
}) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <div className="mb-4 flex items-center gap-3" style={align === 'center' ? { justifyContent: 'center' } : undefined}>
          <span className="inline-block h-px w-8 bg-bytes-signal/60" aria-hidden="true" />
          <MonoLabel tone={theme === 'dark' ? 'signal' : 'ink'}>{eyebrow}</MonoLabel>
        </div>
      )}
      <h2
        id={id}
        className={`font-bytes-display font-semibold tracking-[-0.02em] leading-[1.04] text-[clamp(2rem,5vw,3.75rem)] ${
          theme === 'dark' ? 'text-bytes-ice' : 'text-bytes-midnight'
        }`}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

/* ── CTA buttons ─────────────────────────────────────────────── */
export function CtaLink({
  href,
  children,
  variant = 'primary',
  className = '',
  magnetic = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'ghost-light';
  className?: string;
  magnetic?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotionPref();
  const enableMagnet = magnetic && pointerFine && !reduced;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold font-bytes-display transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal';
  const variants = {
    primary: 'bg-bytes-blue text-white hover:bg-bytes-signal',
    ghost: 'border border-bytes-line text-bytes-ice hover:border-bytes-signal/60 hover:text-white',
    'ghost-light': 'border border-bytes-navy/25 text-bytes-midnight hover:border-bytes-blue hover:text-bytes-blue',
  } as const;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !enableMagnet) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    // clamp ≤14px so the target never escapes the cursor
    const cl = (v: number) => Math.max(-14, Math.min(14, v * 0.22));
    el.style.transform = `translate(${cl(dx)}px, ${cl(dy)}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0px, 0px)';
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      style={{ transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), background-color 0.3s, border-color 0.3s, color 0.3s' }}
      onPointerMove={enableMagnet ? onMove : undefined}
      onPointerLeave={enableMagnet ? onLeave : undefined}
    >
      {children}
    </Link>
  );
}

/* ── Grain overlay (single tiled SVG, ~4% opacity) ───────────── */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='128' height='128' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export function GrainOverlay({ opacity = 0.05 }: { opacity?: number }) {
  const style: CSSProperties = {
    backgroundImage: GRAIN_URI,
    backgroundRepeat: 'repeat',
    opacity,
  };
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" style={style} />;
}

/* ── Hairline divider ────────────────────────────────────────── */
export function Hairline({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full bg-bytes-line ${className}`} />;
}
