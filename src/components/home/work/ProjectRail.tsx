'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, stagingDisclaimer, type Project } from '@/data/home';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { CtaLink, GrainOverlay, MonoLabel, SectionHeading } from '../ui';
import { BREAKPOINTS, usePointerFine, useReducedMotionPref } from '../hooks';

gsap.registerPlugin(ScrollTrigger);

/* ── Project card (browser-frame treatment) ──────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const host = project.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <article
      data-rail-card
      className="group w-[85vw] shrink-0 snap-start md:w-[60vw] min-[1200px]:w-[560px]"
    >
      {/* Inner wrapper carries the CSS hover tilt so it never fights the
          GSAP entrance transform on the outer element. */}
      <div className="rounded-2xl border border-bytes-line bg-bytes-graphite p-4 transition-transform duration-300 ease-out md:p-5 min-[1200px]:group-hover:rotate-[1.5deg]">
        {/* Browser frame — hover lifts the media ≤16px */}
        <div className="overflow-hidden rounded-xl border border-bytes-line bg-bytes-ink transition-transform duration-300 ease-out min-[1200px]:group-hover:-translate-y-2">
          {/* Chrome bar */}
          <div className="flex items-center gap-3 border-b border-bytes-line px-4 py-2.5">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-bytes-steel/25" />
              <span className="h-2 w-2 rounded-full bg-bytes-steel/25" />
              <span className="h-2 w-2 rounded-full bg-bytes-signal/50" />
            </span>
            <span className="truncate font-bytes-mono text-[11px] tracking-[0.08em] text-bytes-steel/60">
              {host}
            </span>
          </div>
          {/* Preview */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.image}
              alt={`${project.title} — live staging build preview`}
              fill
              sizes="(min-width: 1200px) 560px, (min-width: 768px) 60vw, 85vw"
              className="object-cover object-top"
            />
          </div>
        </div>
        {/* Meta */}
        <div className="mt-5 flex flex-col gap-2 px-1 pb-1">
          <MonoLabel tone="signal">{project.meta}</MonoLabel>
          <h3 className="font-bytes-display text-xl font-semibold tracking-[-0.01em] text-bytes-ice md:text-2xl">
            {project.title}
          </h3>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-2 font-bytes-mono text-xs tracking-[0.18em] text-bytes-signal transition-colors duration-300 hover:text-bytes-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
            aria-label={`Visit ${project.title} live site (opens in a new tab)`}
          >
            VISIT LIVE SITE <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span className="sr-only">Card {index + 1} of {projects.length}</span>
      </div>
    </article>
  );
}

/* ── End-cap card → /portfolio ───────────────────────────────── */
function PortfolioEndCap() {
  return (
    <article
      data-rail-card
      className="group flex w-[85vw] shrink-0 snap-start md:w-[60vw] min-[1200px]:w-[420px]"
    >
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-2xl border border-bytes-line bg-bytes-navy/40 p-8 transition-transform duration-300 ease-out md:p-10 min-[1200px]:group-hover:rotate-[-1.5deg]">
        <MonoLabel tone="signal">PORTFOLIO // FULL INDEX</MonoLabel>
        <p className="font-bytes-display text-2xl font-semibold leading-tight tracking-[-0.01em] text-bytes-ice md:text-3xl">
          Every build, one archive.
        </p>
        <CtaLink href="/portfolio" variant="ghost">
          View full portfolio
        </CtaLink>
      </div>
    </article>
  );
}

/* ── Motion setup ────────────────────────────────────────────── */
const setupRail: MotionSetup = ({ root, mm, reduced }) => {
  if (reduced) return; // native horizontal scroll, no hijack, no entrance rotation

  mm.add(BREAKPOINTS.desktop, () => {
    const stage = root.querySelector<HTMLElement>('[data-rail-stage]');
    const viewport = root.querySelector<HTMLElement>('[data-rail-viewport]');
    const track = root.querySelector<HTMLElement>('[data-rail-track]');
    if (!stage || !viewport || !track) return;

    // Take over from the native scroll region only when the pinned
    // timeline actually exists (no-JS / mobile keep overflow-x-auto).
    gsap.set(viewport, { overflowX: 'hidden' });

    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const railTween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Alternating offsets ±40px / rotation ±2° settling to 0 as each
    // card enters, linked to the horizontal container animation.
    const cards = gsap.utils.toArray<HTMLElement>('[data-rail-card]', root);
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: i % 2 === 0 ? -40 : 40, rotation: i % 2 === 0 ? -2 : 2 },
        {
          y: 0,
          rotation: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: railTween,
            start: 'left 95%',
            end: 'left 55%',
            scrub: true,
          },
        }
      );
    });
  });
};

/* ── Section ─────────────────────────────────────────────────── */
export function ProjectRail() {
  const pointerFine = usePointerFine();
  const reduced = useReducedMotionPref();
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [railHover, setRailHover] = useState(false);

  const cursorEnabled = pointerFine && !reduced;

  // Cursor-follow "VISIT →" label — lerp 0.12, pointer-fine only.
  useEffect(() => {
    if (!cursorEnabled || !railHover) return;
    let raf = 0;
    const tick = () => {
      const pos = posRef.current;
      const target = targetRef.current;
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      const el = cursorRef.current;
      if (el) el.style.transform = `translate3d(${pos.x + 18}px, ${pos.y + 14}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cursorEnabled, railHover]);

  return (
    <MotionBoundary
      as="section"
      id="work"
      data-nav-theme="dark"
      aria-labelledby="work-heading"
      className="relative bg-bytes-ink"
      setup={setupRail}
    >
      <GrainOverlay />

      <div
        data-rail-stage
        className="relative z-[2] flex flex-col justify-center gap-10 py-24 md:gap-14 md:py-28 min-[1200px]:h-screen min-[1200px]:py-0"
      >
        {/* Header */}
        <div className="mx-auto w-full max-w-[90rem] px-6 md:px-10">
          <SectionHeading
            id="work-heading"
            eyebrow="SYS.03 // WORK IN MOTION"
            lines={['Work in motion.', 'Built in the open.']}
            theme="dark"
          />
          <div className="mt-6 max-w-2xl space-y-4">
            <p className="text-base leading-relaxed text-bytes-steel md:text-lg">
              Our portfolio is not a wall of static mockups. Explore selected live builds and
              active projects as they move from concept to launch.
            </p>
            <p className="max-w-xl font-bytes-mono text-[11px] leading-relaxed tracking-[0.04em] text-bytes-steel/55">
              {stagingDisclaimer}
            </p>
          </div>
        </div>

        {/* Rail — native overflow + snap by default; the desktop pinned
            timeline takes over inside the matchMedia scope only. */}
        <div
          data-rail-viewport
          className="w-full snap-x snap-mandatory overflow-x-auto scroll-pl-6 md:scroll-pl-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerEnter={
            cursorEnabled
              ? (e) => {
                  posRef.current = { x: e.clientX, y: e.clientY };
                  targetRef.current = { x: e.clientX, y: e.clientY };
                  setRailHover(true);
                }
              : undefined
          }
          onPointerMove={
            cursorEnabled
              ? (e) => {
                  targetRef.current = { x: e.clientX, y: e.clientY };
                }
              : undefined
          }
          onPointerLeave={cursorEnabled ? () => setRailHover(false) : undefined}
        >
          <div
            data-rail-track
            className="flex w-max items-stretch gap-5 px-6 md:gap-8 md:px-10 min-[1200px]:px-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))]"
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.url} project={project} index={i} />
            ))}
            <PortfolioEndCap />
          </div>
        </div>
      </div>

      {/* Cursor-follow label */}
      {cursorEnabled && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className={`pointer-events-none fixed left-0 top-0 z-50 rounded-full border border-bytes-line bg-bytes-glass px-3 py-1.5 font-bytes-mono text-[10px] tracking-[0.22em] text-bytes-cyan backdrop-blur-sm transition-opacity duration-200 ${
            railHover ? 'opacity-100' : 'opacity-0'
          }`}
        >
          VISIT →
        </div>
      )}
    </MotionBoundary>
  );
}
