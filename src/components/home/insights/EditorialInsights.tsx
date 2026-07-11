'use client';

import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionBoundary } from '../MotionBoundary';
import { SectionHeading, MonoLabel, GrainOverlay } from '../ui';
import { BREAKPOINTS } from '../hooks';

gsap.registerPlugin(ScrollTrigger);

/** Shape the homepage passes down after fetching from the hybrid blog source. */
export type Post = {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  image?: string;
  category?: string;
};

const STICKY_TOP_BASE = 96;
const STICKY_TOP_STEP = 28;

function readingEstimate(excerpt?: string): string | null {
  if (!excerpt) return null;
  const words = excerpt.trim().split(/\s+/).length;
  // Rough estimate from preview length — full articles run longer.
  const minutes = Math.max(2, Math.round(words / 40));
  return `${minutes} MIN READ`;
}

function postHref(slug: string): string {
  return `/blogs/${slug.replace(/^\//, '')}`;
}

function FieldNoteCard({ post, index }: { post: Post; index: number }) {
  const est = readingEstimate(post.excerpt);
  return (
    <article
      data-note-card
      data-note-index={index}
      className="motion-safe:min-[1200px]:sticky relative"
      style={{ top: `${STICKY_TOP_BASE + index * STICKY_TOP_STEP}px` }}
    >
      <Link
        href={postHref(post.slug)}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal rounded-2xl"
      >
        <div
          data-note-paper
          className="relative overflow-hidden rounded-2xl bg-bytes-ice text-bytes-midnight shadow-[0_24px_60px_rgba(2,5,12,0.45)]"
        >
          <GrainOverlay opacity={0.04} />
          {/* Dim layer — animated opacity only (no filter animation) */}
          <div
            data-note-dim
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] bg-bytes-ink opacity-0"
          />
          <div className="relative z-[1] grid gap-6 p-7 md:grid-cols-[1fr_auto] md:gap-10 md:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                {post.category && (
                  <span
                    className="inline-block -rotate-2 border border-bytes-navy/30 px-2.5 py-1 font-bytes-mono text-[10px] tracking-[0.2em] uppercase text-bytes-navy/70 transition-transform duration-300 group-hover:-rotate-2"
                  >
                    {post.category}
                  </span>
                )}
                <MonoLabel tone="ink">
                  {[post.date, est].filter(Boolean).join(' // ')}
                </MonoLabel>
              </div>
              <h3 className="mt-5 font-bytes-display text-2xl font-semibold tracking-[-0.01em] leading-snug md:text-3xl">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bytes-navy/75 md:text-base line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-6 inline-flex items-center gap-2 font-bytes-mono text-xs tracking-[0.18em] uppercase text-bytes-blue">
                Read note <span aria-hidden="true">→</span>
              </span>
            </div>
            {post.image && (
              <div className="relative hidden h-36 w-52 shrink-0 overflow-hidden rounded-lg md:block">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          {/* Blue hairline on hover */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-[2] h-px origin-left scale-x-0 bg-bytes-blue transition-transform duration-300 group-hover:scale-x-100"
          />
        </div>
      </Link>
    </article>
  );
}

/**
 * SYS.08 // FIELD NOTES — editorial cards from real hybrid blog data.
 * Desktop: sticky stacking with scale/dim on overlap (scrub 0.5) and a
 * ±1.5° baseline rotation settling to 0. Mobile/reduced: plain vertical cards.
 */
export function EditorialInsights({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <MotionBoundary
      as="section"
      className="relative bg-gradient-to-b from-bytes-midnight to-bytes-ink"
      data-nav-theme="dark"
      aria-labelledby="field-notes-heading"
      setup={({ root, mm, reduced }) => {
        if (reduced) return;

        mm.add(BREAKPOINTS.desktop, () => {
          const cards = gsap.utils.toArray<HTMLElement>('[data-note-card]', root);

          cards.forEach((card, i) => {
            const paper = card.querySelector<HTMLElement>('[data-note-paper]');
            const dim = card.querySelector<HTMLElement>('[data-note-dim]');
            if (!paper) return;

            // Baseline rotation ±1.5° settling to 0 as the card arrives.
            gsap.fromTo(
              paper,
              { rotation: i % 2 === 0 ? 1.5 : -1.5 },
              {
                rotation: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 95%',
                  end: `top ${STICKY_TOP_BASE + i * STICKY_TOP_STEP + 120}px`,
                  scrub: 0.5,
                },
              }
            );

            // As the NEXT card overlaps, scale this one down and dim it.
            const next = cards[i + 1];
            if (!next) return;
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: `top ${STICKY_TOP_BASE + (i + 1) * STICKY_TOP_STEP}px`,
                scrub: 0.5,
              },
            });
            tl.to(paper, { scale: 0.96, transformOrigin: 'center top', ease: 'none' }, 0);
            if (dim) tl.to(dim, { opacity: 0.35, ease: 'none' }, 0);
          });
        });
      }}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-2xl">
          <SectionHeading
            id="field-notes-heading"
            eyebrow="SYS.08 // FIELD NOTES"
            lines={['Bytes Field Notes']}
            theme="dark"
          />
          <p className="mt-6 text-base leading-relaxed text-bytes-steel md:text-lg">
            Practical thinking on AI, software, automation, product design and digital growth.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-8 md:gap-10">
          {posts.map((post, i) => (
            <FieldNoteCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        <div className="mt-16 text-right">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 font-bytes-mono text-sm tracking-[0.18em] uppercase text-bytes-signal transition-colors duration-300 hover:text-bytes-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
          >
            All Field Notes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </MotionBoundary>
  );
}
