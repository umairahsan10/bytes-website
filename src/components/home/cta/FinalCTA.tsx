'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionBoundary } from '../MotionBoundary';
import { SectionHeading, CtaLink } from '../ui';
import { usePointerFine, useReducedMotionPref } from '../hooks';
import { finalCta } from '@/data/home';

gsap.registerPlugin(ScrollTrigger);

const CAPSULE_CSS = `
@keyframes bytes-capsule-float {
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(-12px) rotate(-4deg); }
}
@media (prefers-reduced-motion: no-preference) {
  .bytes-capsule-float {
    animation: bytes-capsule-float 6s ease-in-out infinite;
  }
}
`;

/** Repeated background word row — decorative only. */
function BgRow({ index }: { index: number }) {
  const copies = Array.from({ length: 4 }, () => finalCta.bgWord);
  return (
    <div
      data-cta-row={index}
      className="whitespace-nowrap font-bytes-display font-bold leading-[0.95] tracking-[-0.02em] select-none text-white/[0.05]"
      style={{
        fontSize: '14vw',
        WebkitTextStroke: '1px rgba(76,146,255,0.15)',
        marginLeft: index % 2 === 0 ? '-8vw' : '-16vw',
      }}
    >
      {copies.join(' // ')}
    </div>
  );
}

/**
 * SYS.09 // FINAL CTA — BUILD WHAT'S NEXT.
 * Three cropped background type rows drift counter-directionally with scroll
 * (scrub; static under reduced motion). Foreground: heading, copy, magnetic
 * primary CTA and a floating CSS-3D capsule with pointer parallax ≤8px.
 */
export function FinalCTA() {
  const capsuleParallaxRef = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotionPref();
  const enableParallax = pointerFine && !reduced;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = capsuleParallaxRef.current;
    if (!el || !enableParallax) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    const clamp = (v: number) => Math.max(-8, Math.min(8, v * 16));
    el.style.transform = `translate3d(${clamp(nx)}px, ${clamp(ny)}px, 0)`;
  };
  const onPointerLeave = () => {
    const el = capsuleParallaxRef.current;
    if (el) el.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <MotionBoundary
      as="section"
      className="relative overflow-hidden bg-bytes-ink"
      data-nav-theme="dark"
      aria-labelledby="final-cta-heading"
      setup={({ root, reduced: prefersReduced }) => {
        if (prefersReduced) return;
        // Counter-directional x drift ±6%, scrubbed over the section.
        const rows = gsap.utils.toArray<HTMLElement>('[data-cta-row]', root);
        rows.forEach((row, i) => {
          gsap.to(row, {
            xPercent: i % 2 === 0 ? -6 : 6,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        });
        // Foreground reveal, once.
        const fg = root.querySelector<HTMLElement>('[data-cta-foreground]');
        if (fg) {
          gsap.fromTo(
            fg,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: fg, start: 'top 80%', once: true },
            }
          );
        }
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CAPSULE_CSS }} />

      {/* Background type field — cropped, decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[2vw] overflow-hidden"
      >
        <BgRow index={0} />
        <BgRow index={1} />
        <BgRow index={2} />
      </div>

      <div
        className="relative mx-auto flex min-h-[90vh] max-w-4xl flex-col items-center justify-center px-6 py-32 text-center md:px-10"
        onPointerMove={enableParallax ? onPointerMove : undefined}
        onPointerLeave={enableParallax ? onPointerLeave : undefined}
      >
        <div data-cta-foreground className="flex flex-col items-center">
          {/* Floating CSS-3D capsule object */}
          <div
            ref={capsuleParallaxRef}
            aria-hidden="true"
            className="mb-12"
            style={{ transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)', perspective: '600px' }}
          >
            <div
              className="bytes-capsule-float h-10 w-24 rounded-full"
              style={{
                background:
                  'linear-gradient(135deg, #2F6BFF 0%, #4C92FF 55%, #72DAFF 100%)',
                boxShadow:
                  'inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -4px 10px rgba(2,5,12,0.35), 0 18px 40px rgba(47,107,255,0.25)',
                transform: 'rotate(-8deg)',
              }}
            />
          </div>

          <SectionHeading
            id="final-cta-heading"
            lines={finalCta.heading}
            theme="dark"
            align="center"
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-bytes-steel md:text-lg">
            {finalCta.copy}
          </p>
          <div className="mt-10">
            <CtaLink href={finalCta.primaryCta.href} variant="primary" magnetic>
              {finalCta.primaryCta.label}
              <span aria-hidden="true">→</span>
            </CtaLink>
          </div>
        </div>
      </div>
    </MotionBoundary>
  );
}
