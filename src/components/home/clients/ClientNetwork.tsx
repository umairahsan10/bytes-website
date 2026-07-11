'use client';

import Image from 'next/image';
import { SectionHeading } from '../ui';
import { useMediaQuery, useReducedMotionPref, BREAKPOINTS } from '../hooks';
import { clients, type ClientBrand } from '@/data/home';

/**
 * SYS.07 // CLIENT NETWORK — Trusted across industries.
 * CSS-only marquee lanes (transform keyframes, no JS animation).
 * The animated lanes are entirely aria-hidden; a single visually-hidden
 * semantic <ul> carries the real client list for assistive tech.
 * Reduced motion: static wrapped semantic grid instead of lanes.
 */

const MARQUEE_CSS = `
@keyframes bytes-client-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.bytes-client-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: bytes-client-marquee var(--lane-duration, 60s) linear infinite;
}
.bytes-client-track[data-direction='reverse'] {
  animation-direction: reverse;
}
.bytes-client-lane:hover .bytes-client-track {
  animation-play-state: paused;
}
.bytes-client-lane {
  contain: content;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.bytes-client-logo {
  filter: grayscale(1) brightness(1.5) contrast(0.9);
  opacity: 0.65;
  transition: filter 0.3s ease, opacity 0.3s ease;
}
.bytes-client-logo:hover,
.bytes-client-logo:focus-visible {
  filter: none;
  opacity: 1;
}
`;

function LogoLink({
  brand,
  focusable,
}: {
  brand: ClientBrand;
  focusable: boolean;
}) {
  return (
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={focusable ? 0 : -1}
      className="bytes-client-logo mx-8 inline-flex shrink-0 items-center md:mx-12"
    >
      <Image
        src={brand.logo}
        alt={focusable ? `${brand.name} logo` : ''}
        width={140}
        height={40}
        style={{ height: 40, width: 'auto' }}
        sizes="140px"
      />
    </a>
  );
}

function MarqueeLane({
  direction,
  durationSeconds,
}: {
  direction: 'normal' | 'reverse';
  durationSeconds: number;
}) {
  return (
    <div className="bytes-client-lane overflow-hidden py-5" aria-hidden="true">
      <div
        className="bytes-client-track"
        data-direction={direction}
        style={{ ['--lane-duration' as string]: `${durationSeconds}s` }}
      >
        {/* Two identical copies for a seamless -50% transform loop */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {clients.map((brand) => (
              <LogoLink key={`${copy}-${brand.name}`} brand={brand} focusable={false} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientNetwork() {
  const reduced = useReducedMotionPref();
  const mobile = useMediaQuery(BREAKPOINTS.mobile);

  return (
    <section
      className="relative overflow-hidden bg-bytes-ink"
      data-nav-theme="dark"
      aria-labelledby="client-network-heading"
    >
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-24 md:pt-32">
        <SectionHeading
          id="client-network-heading"
          eyebrow="SYS.07 // CLIENT NETWORK"
          lines={['Trusted across', 'industries.']}
          theme="dark"
        />
      </div>

      {/* Semantic client list for assistive tech — the animated lanes are
          purely decorative duplicates. In reduced-motion mode the visible grid
          itself is the semantic list, so this copy is omitted to avoid
          duplicate links. */}
      {!reduced && (
        <ul className="sr-only" aria-label="Bytes Platform clients">
          {clients.map((brand) => (
            <li key={brand.name}>
              <a href={brand.url} target="_blank" rel="noopener noreferrer">
                {brand.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-14 pb-24 md:pb-32">
        {reduced ? (
          /* Reduced motion: static wrapped semantic grid, links reachable */
          <ul
            className="mx-auto flex max-w-7xl list-none flex-wrap items-center justify-center gap-x-4 gap-y-8 px-6 md:px-10"
            aria-label="Bytes Platform clients"
          >
            {clients.map((brand) => (
              <li key={brand.name}>
                <LogoLink brand={brand} focusable={true} />
              </li>
            ))}
          </ul>
        ) : mobile ? (
          /* Mobile: single slower lane */
          <MarqueeLane direction="normal" durationSeconds={90} />
        ) : (
          /* Desktop: two lanes, opposite directions */
          <>
            <MarqueeLane direction="normal" durationSeconds={60} />
            <MarqueeLane direction="reverse" durationSeconds={75} />
          </>
        )}
      </div>
    </section>
  );
}
