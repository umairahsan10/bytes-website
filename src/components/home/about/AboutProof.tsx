'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionBoundary } from '../MotionBoundary';
import { SectionHeading, MonoLabel, CtaLink, Hairline } from '../ui';
import { about, metrics } from '@/data/home';

gsap.registerPlugin(ScrollTrigger);

/**
 * SYS.06 // WHY BYTES — About + Proof.
 * Deliberately the calmest section: IntersectionObserver-style reveals only
 * (no pin, no scrub). Metric values are server-rendered as final numbers so
 * they are visible without JS; on view they count up from ~60% over 0.8s once.
 */
export function AboutProof() {
  return (
    <MotionBoundary
      as="section"
      className="relative bg-bytes-ice"
      data-nav-theme="light"
      aria-labelledby="about-proof-heading"
      setup={({ root, reduced }) => {
        if (reduced) return;

        // Three-line statement: line reveals 0.7s, stagger 0.06 (played once).
        const lines = root.querySelectorAll<HTMLElement>('[data-about-line]');
        if (lines.length) {
          gsap.set(lines, { yPercent: 110, opacity: 0, willChange: 'transform, opacity' });
          gsap.to(lines, {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.06,
            scrollTrigger: { trigger: lines[0], start: 'top 80%', once: true },
            onComplete: () => {
              gsap.set(lines, { clearProps: 'will-change' });
            },
          });
        }

        // Soft fade for the heading block + copy.
        const fades = root.querySelectorAll<HTMLElement>('[data-about-fade]');
        fades.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            }
          );
        });

        // Metric counters: final value is already in the HTML; count from ~60%
        // of value to value over 0.8s, once. Reduced motion never reaches here.
        root.querySelectorAll<HTMLElement>('[data-metric-value]').forEach((el) => {
          const value = Number(el.dataset.metricValue ?? '0');
          if (!Number.isFinite(value) || value <= 0) return;
          const state = { v: Math.round(value * 0.6) };
          gsap.to(state, {
            v: value,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
            onComplete: () => {
              el.textContent = String(value);
            },
          });
        });
      }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Heading + copy */}
          <div className="lg:col-span-5" data-about-fade>
            <SectionHeading
              id="about-proof-heading"
              eyebrow="SYS.06 // WHY BYTES"
              lines={about.heading}
              theme="light"
            />
            <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-bytes-navy/80">
              {about.copy}
            </p>
            <div className="mt-8">
              <CtaLink href={about.cta.href} variant="ghost-light">
                {about.cta.label}
                <span aria-hidden="true">→</span>
              </CtaLink>
            </div>
          </div>

          {/* Three-line statement pull-quote */}
          <div className="lg:col-span-7 lg:pl-8 flex items-center">
            <p className="font-bytes-display font-semibold tracking-[-0.02em] leading-[1.05] text-bytes-midnight text-[clamp(2.5rem,6vw,4.75rem)]">
              {about.statement.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span data-about-line className="block">
                    {line}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-20 md:mt-28">
          <Hairline className="bg-bytes-navy/10" />
          <dl className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-3 sm:gap-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col">
                <dt className="order-2 mt-3">
                  <MonoLabel tone="ink">{metric.label}</MonoLabel>
                </dt>
                <dd className="order-1 font-bytes-display font-semibold tracking-[-0.02em] text-bytes-midnight text-[clamp(2.75rem,5vw,4.25rem)] leading-none">
                  {/* Final value rendered server-side so it shows without JS */}
                  <span data-metric-value={metric.value}>{metric.value}</span>
                  <span className="text-bytes-blue">{metric.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </MotionBoundary>
  );
}
