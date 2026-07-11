'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SESSION_KEY = 'bytes-system-booted';
const HARD_CAP_MS = 2500;
/** Dash length large enough to cover the longest glyph outline at 72px. */
const STROKE_LEN = 340;

const BOOT_LINES = [
  'SYS // INITIALIZING',
  'LOADING DESIGN SYSTEM',
  'ENTERING ECOSYSTEM',
] as const;

type BootStatus = 'idle' | 'booting' | 'done';

/** LenisProvider stores the instance on window; typed locally (global augmentation is unreliable here). */
type LenisLike = { stop: () => void; start: () => void };
const getLenis = (): LenisLike | undefined => (window as Window & { lenis?: LenisLike }).lenis;

/**
 * One-time-per-session boot overlay (§01 SystemLoader).
 * BYTES wordmark stroke-draw (~0.7s) + 3 mono boot lines, then the whole
 * overlay wipes up (0.5s power3.inOut) and unmounts. Total ≤1.2s, hard cap
 * 2.5s. Locks body scroll (and Lenis) while visible. Reduced motion: static
 * wordmark, 0.3s opacity fade only. Renders nothing on repeat visits.
 */
export function SystemLoader() {
  const [status, setStatus] = useState<BootStatus>('idle');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Decide on the client only (sessionStorage is unavailable during SSR).
  useEffect(() => {
    let booted = false;
    try {
      booted = window.sessionStorage.getItem(SESSION_KEY) === '1';
      if (!booted) window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Storage unavailable (private mode / blocked) — boot once anyway.
    }
    setStatus(booted ? 'done' : 'booting');
  }, []);

  useEffect(() => {
    if (status !== 'booting') return;
    const root = overlayRef.current;
    if (!root) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    getLenis()?.stop();

    const finish = () => setStatus('done');
    // Hard cap: never hold the page hostage.
    const cap = window.setTimeout(finish, HARD_CAP_MS);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        // Static wordmark, opacity fade only.
        gsap.set('[data-loader-wordmark]', { strokeDashoffset: 0, fillOpacity: 1 });
        gsap.set('[data-loader-line]', { opacity: 1 });
        gsap.to(root, {
          opacity: 0,
          duration: 0.3,
          delay: 0.3,
          ease: 'power1.out',
          onComplete: finish,
        });
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });
      tl.to('[data-loader-wordmark]', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, 0)
        .to('[data-loader-wordmark]', { fillOpacity: 1, duration: 0.35, ease: 'power1.out' }, 0.4)
        .to('[data-loader-line]', { opacity: 1, duration: 0.25, stagger: 0.16, ease: 'power2.out' }, 0.12)
        // Curtain wipe up — transform only.
        .to(root, { yPercent: -100, duration: 0.5, ease: 'power3.inOut' }, 0.7);
      if (isMobile) tl.timeScale(4 / 3); // ~0.9s total on mobile
    }, root);

    return () => {
      window.clearTimeout(cap);
      ctx.revert();
      body.style.overflow = prevOverflow;
      getLenis()?.start();
    };
  }, [status]);

  if (status !== 'booting') return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bytes-ink will-change-transform"
    >
      <svg
        viewBox="0 0 480 120"
        className="w-[min(70vw,26rem)]"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <text
          data-loader-wordmark=""
          x="240"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bytes-display"
          fontSize="72"
          fontWeight="600"
          letterSpacing="0.18em"
          fill="#F2F7FC"
          fillOpacity="0"
          stroke="#4C92FF"
          strokeWidth="1.25"
          strokeDasharray={STROKE_LEN}
          strokeDashoffset={STROKE_LEN}
        >
          BYTES
        </text>
      </svg>

      <div className="mt-10 flex flex-col items-center gap-2.5">
        {BOOT_LINES.map((line) => (
          <span
            key={line}
            data-loader-line=""
            className="font-bytes-mono text-[11px] uppercase tracking-[0.22em] text-bytes-steel/70 opacity-0"
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
