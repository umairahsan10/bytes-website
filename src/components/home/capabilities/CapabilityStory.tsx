'use client';

import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { capabilities } from '@/data/home';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { SectionHeading, MonoLabel, CtaLink } from '../ui';
import { BytesCore } from './BytesCore';
import { CapabilityPanel } from './CapabilityPanel';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = capabilities.length; // 6
const DESKTOP_MOTION = '(min-width: 1200px) and (prefers-reduced-motion: no-preference)';
const STACK_MOTION = '(max-width: 1199px) and (prefers-reduced-motion: no-preference)';

/**
 * SYS.01 // CAPABILITY — pinned six-chapter narrative on desktop
 * (+=500%, scrub 0.6), vertical reveal cards on mobile/tablet/reduced-motion.
 * All six chapters' text is always in the DOM; the desktop timeline only
 * moves opacity/transform. The active chapter index (which drives the
 * BytesCore state and the progress-rail highlight) is derived from
 * ScrollTrigger progress in onUpdate.
 */
export function CapabilityStory() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const setup = useCallback<MotionSetup>(({ root, mm }) => {
    /* ── Desktop: pinned narrative ─────────────────────────────── */
    mm.add(DESKTOP_MOTION, () => {
      const stage = root.querySelector<HTMLElement>('[data-cap-stage]');
      if (!stage) return;

      const texts = gsap.utils.toArray<HTMLElement>('[data-cap-text]', stage);
      const panels = gsap.utils.toArray<HTMLElement>('[data-cap-panel]', stage);
      const bar = stage.querySelector<HTMLElement>('[data-cap-bar]');

      gsap.set(texts.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(panels.slice(1), { autoAlpha: 0, scale: 0.96 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(CHAPTERS - 1, Math.floor(self.progress * CHAPTERS));
            if (activeRef.current !== i) {
              activeRef.current = i;
              setActive(i);
            }
          },
        },
      });

      // Progress bar spans the full timeline (also pads total duration to CHAPTERS units).
      if (bar) tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: CHAPTERS, ease: 'none' }, 0);

      // One transition per chapter boundary at integer positions 1..5.
      for (let i = 1; i < CHAPTERS; i++) {
        tl.to(texts[i - 1], { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in' }, i)
          .to(panels[i - 1], { autoAlpha: 0, scale: 0.96, duration: 0.35, ease: 'power2.in' }, i)
          .fromTo(
            texts[i],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            i + 0.3
          )
          .fromTo(
            panels[i],
            { autoAlpha: 0, scale: 0.96 },
            { autoAlpha: 1, scale: 1, duration: 0.5 },
            i + 0.3
          );
      }
    });

    /* ── Mobile/tablet: simple per-card reveals, no pin, no scrub ── */
    mm.add(STACK_MOTION, () => {
      gsap.utils.toArray<HTMLElement>('[data-cap-card]', root).forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          }
        );
      });
    });
  }, []);

  return (
    <MotionBoundary
      as="section"
      id="capability"
      data-nav-theme="light"
      aria-labelledby="capability-heading"
      className="relative bg-bytes-ice text-bytes-midnight"
      setup={setup}
    >
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-10 md:px-10 md:pt-32">
        <SectionHeading
          id="capability-heading"
          eyebrow="SYS.01 // CAPABILITY"
          lines={['One partner.', 'Every digital layer.']}
          theme="light"
        />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-bytes-navy/70 md:text-lg">
          From the first signal to launch and scale, Bytes connects strategy, design,
          engineering, AI and growth into one operating system.
        </p>
      </div>

      {/* ── Desktop pinned narrative (≥1200px, motion-safe only) ── */}
      <div className="hidden min-[1200px]:motion-safe:block">
        <div data-cap-stage className="relative h-screen">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_1.05fr] items-center gap-14 px-10">
            {/* Progress rail */}
            <div className="flex h-[58vh] items-center gap-5" aria-hidden="true">
              <div className="relative h-full w-px bg-bytes-navy/10">
                <div
                  data-cap-bar
                  className="absolute inset-0 origin-top bg-bytes-blue"
                  style={{ transform: 'scaleY(0)' }}
                />
              </div>
              <ol className="flex h-full list-none flex-col justify-between p-0">
                {capabilities.map((c, i) => (
                  <li key={c.id}>
                    <span
                      className={`font-bytes-mono text-xs tracking-[0.2em] transition-colors duration-300 ${
                        i === active ? 'text-bytes-blue' : 'text-bytes-navy/35'
                      }`}
                    >
                      {c.index}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Chapter text (all chapters mounted; timeline moves opacity/transform) */}
            <div className="relative h-[58vh]">
              {capabilities.map((c) => (
                <article
                  key={c.id}
                  data-cap-text
                  className="absolute inset-0 flex flex-col justify-center [will-change:transform,opacity]"
                >
                  <MonoLabel tone="ink">{c.index} / 06</MonoLabel>
                  <h3 className="mt-4 font-bytes-display text-3xl font-semibold tracking-[-0.02em] text-bytes-midnight xl:text-4xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-bytes-navy/70">{c.copy}</p>
                  <div className="mt-8">
                    <CtaLink href={c.href} variant="ghost-light">
                      {c.linkLabel}
                      <span aria-hidden="true">→</span>
                    </CtaLink>
                  </div>
                </article>
              ))}
            </div>

            {/* Core + UI panel */}
            <div className="flex h-full flex-col items-center justify-center gap-10">
              <BytesCore state={capabilities[active].core} className="h-[280px] w-[280px]" />
              <div className="relative h-[200px] w-[320px]">
                {capabilities.map((c) => (
                  <div
                    key={c.id}
                    data-cap-panel
                    className="absolute inset-0 [will-change:transform,opacity]"
                  >
                    <CapabilityPanel capability={c} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet / reduced-motion: stacked chapter cards ── */}
      <div className="min-[1200px]:motion-safe:hidden">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-24 md:px-10">
          {capabilities.map((c) => (
            <article
              key={c.id}
              data-cap-card
              className="rounded-2xl border border-bytes-navy/10 bg-white/60 p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <MonoLabel tone="ink">{c.index} / 06</MonoLabel>
                  <h3 className="mt-3 font-bytes-display text-xl font-semibold tracking-[-0.02em] text-bytes-midnight md:text-2xl">
                    {c.title}
                  </h3>
                </div>
                <BytesCore state={c.core} className="h-14 w-14 shrink-0" />
              </div>
              <p className="mt-3 leading-relaxed text-bytes-navy/70">{c.copy}</p>
              <div className="mt-6">
                <CtaLink href={c.href} variant="ghost-light">
                  {c.linkLabel}
                  <span aria-hidden="true">→</span>
                </CtaLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MotionBoundary>
  );
}
