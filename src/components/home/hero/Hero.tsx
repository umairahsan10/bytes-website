'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { hero } from '@/data/home';
import { CtaLink, MonoLabel } from '../ui';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { BREAKPOINTS, useMediaQuery, usePointerFine, useReducedMotionPref } from '../hooks';
import { ByteCityPoster } from './ByteCityPoster';
import { PolygonNetwork } from './PolygonNetwork';

/**
 * The WebGL scene is only ever imported on capable desktops — the dynamic
 * factory does not run unless <ByteCityScene> is actually rendered, so
 * tablet/mobile/reduced/no-WebGL visitors never download three.js.
 */
const ByteCityScene = dynamic(() => import('./ByteCityScene'), {
  ssr: false,
  loading: () => <ByteCityPoster />,
});

/** Pin + 3D choreography only on fine-pointer desktops that allow motion. */
const DESKTOP_3D_QUERY =
  '(min-width: 1200px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
/** Tablet gets a light 2-layer CSS parallax instead of the canvas. */
const TABLET_PARALLAX_QUERY =
  '(min-width: 768px) and (max-width: 1199px) and (prefers-reduced-motion: no-preference)';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function Hero() {
  /**
   * Scroll progress (0→1) shared with the R3F scene through a mutable ref —
   * written by the pinned ScrollTrigger timeline, read in useFrame.
   * Never React state: no re-renders per frame.
   */
  const progress = useRef(0);

  const [webgl, setWebgl] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotionPref();

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  const showScene = isDesktop && pointerFine && !reduced && webgl && !contextLost;

  const setup = useCallback<MotionSetup>(({ root, mm, reduced: reducedMotion }) => {
    if (reducedMotion) return;

    /* ── Desktop: pin +=250%, scrub 0.8, drive scene progress ── */
    mm.add(DESKTOP_3D_QUERY, () => {
      if (!supportsWebGL()) return; // no scene mounted → no pin either

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // tl.progress() is the scrub-smoothed value → buttery camera motion
        onUpdate: () => {
          progress.current = tl.progress();
        },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=250%',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Copy exits early (0.3–0.45) so the camera journey plays on a clean
      // stage instead of colliding with the headline.
      tl.to('[data-hero-fadeout]', { opacity: 0, y: -40, duration: 0.15 }, 0.3);
      // Stage 0.9–1: scene darkens to ink via the overlay div.
      tl.to('[data-hero-fade]', { opacity: 1, duration: 0.1 }, 0.9);
      // Timeline duration is exactly 1 → positions map 1:1 to scroll progress.
    });

    /* ── Tablet: simple 2-layer parallax, no pin, no canvas ── */
    mm.add(TABLET_PARALLAX_QUERY, () => {
      const scrollTrigger = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      } as const;
      gsap.to('[data-hero-layer-back]', { yPercent: 12, ease: 'none', scrollTrigger });
      gsap.to('[data-hero-layer-mid]', { yPercent: 6, ease: 'none', scrollTrigger: { ...scrollTrigger } });
    });
  }, []);

  return (
    <MotionBoundary
      as="section"
      data-nav-theme="dark"
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden bg-bytes-ink"
      setup={setup}
    >
      {/* ── Background layer: gradient + city (canvas or poster) ── */}
      <div data-hero-layer-back aria-hidden="true" className="absolute inset-0 z-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-b from-bytes-ink via-bytes-midnight to-bytes-ink" />
        {showScene ? (
          <div className="absolute inset-0">
            <ByteCityScene progressRef={progress} onContextLost={() => setContextLost(true)} />
          </div>
        ) : (
          <ByteCityPoster />
        )}
      </div>

      {/* ── Mid layer: pointer-responsive polygon field ── */}
      <div data-hero-layer-mid aria-hidden="true" className="absolute inset-0 z-[2] will-change-transform">
        <PolygonNetwork />
      </div>

      {/* ── Fade-to-ink overlay, driven 0.9→1 of the pinned timeline ── */}
      <div data-hero-fade aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] bg-bytes-ink opacity-0" />

      {/* ── Semantic copy layer ── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-32 pt-28 md:px-10 lg:px-12">
        <div data-hero-fadeout className="max-w-3xl will-change-transform">
          <div className="mb-5 flex items-center gap-3">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-bytes-signal/60" />
            <MonoLabel tone="signal">{hero.eyebrow}</MonoLabel>
          </div>
          <h1
            id="hero-heading"
            className="font-bytes-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-bytes-ice"
          >
            {hero.h1.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-bytes-steel md:text-lg">{hero.body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CtaLink href={hero.primaryCta.href} magnetic>
              {hero.primaryCta.label}
            </CtaLink>
            <CtaLink href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </CtaLink>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-8">
        <div data-hero-fadeout className="flex flex-col items-center gap-3 will-change-transform">
          <MonoLabel className="tracking-[0.28em]">{hero.scrollLabel}</MonoLabel>
          <span aria-hidden="true" className="bytes-hero-scroll-line block h-6 w-px origin-top bg-bytes-signal/70" />
        </div>
      </div>

      <style>{`
        @keyframes bytes-hero-line {
          0%   { transform: scaleY(0); transform-origin: top; }
          45%  { transform: scaleY(1); transform-origin: top; }
          55%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .bytes-hero-scroll-line { animation: bytes-hero-line 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        }
      `}</style>
    </MotionBoundary>
  );
}
