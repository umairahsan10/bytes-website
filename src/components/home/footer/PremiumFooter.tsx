'use client';

import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionBoundary } from '../MotionBoundary';
import { MonoLabel, Hairline } from '../ui';
import { BREAKPOINTS } from '../hooks';
import { contact, legalLinks, navItems } from '@/data/home';

gsap.registerPlugin(ScrollTrigger);

type FooterLink = { label: string; href: string; external?: boolean };

const serviceLinks: FooterLink[] =
  navItems.find((item) => item.label === 'Services')?.children?.map(({ label, href }) => ({ label, href })) ?? [];

const quickLinks: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Industries', href: '/industries' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const productLinks: FooterLink[] = [
  { label: 'Byte Bots', href: '/products/byte-bots' },
  { label: 'Byte Suites', href: '/products/byte-suites' },
  { label: 'Blogs', href: '/blogs' },
];

const linkClass =
  'text-sm text-bytes-steel transition-colors duration-200 hover:text-bytes-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal';

/** One simple isometric wireframe building (front face + top). */
function Building({
  x,
  w,
  h,
  collapseX,
}: {
  x: number;
  w: number;
  h: number;
  collapseX: number;
}) {
  const baseY = 220;
  const top = baseY - h;
  const depth = Math.min(14, w * 0.4);
  return (
    <g data-footer-building data-collapse-x={collapseX} className="stroke-bytes-line" fill="none" strokeWidth="1">
      {/* front face */}
      <rect x={x} y={top} width={w} height={h} />
      {/* top face */}
      <path d={`M${x} ${top} L${x + depth} ${top - depth} L${x + w + depth} ${top - depth} L${x + w} ${top} Z`} />
      {/* side face */}
      <path d={`M${x + w} ${top} L${x + w + depth} ${top - depth} L${x + w + depth} ${baseY - depth} L${x + w} ${baseY}`} />
      {/* window hairlines */}
      <line x1={x + 6} y1={top + h * 0.3} x2={x + w - 6} y2={top + h * 0.3} />
      <line x1={x + 6} y1={top + h * 0.6} x2={x + w - 6} y2={top + h * 0.6} />
    </g>
  );
}

/** Wireframe city reprise: skyline collapses toward the center Bytes mark. */
function WireframeCity() {
  return (
    <svg
      viewBox="0 0 1200 240"
      className="mx-auto block w-full max-w-5xl"
      aria-hidden="true"
      focusable="false"
    >
      {/* left cluster */}
      <Building x={60} w={70} h={90} collapseX={340} />
      <Building x={160} w={54} h={130} collapseX={280} />
      <Building x={244} w={80} h={70} collapseX={210} />
      <Building x={356} w={60} h={110} collapseX={140} />
      {/* right cluster */}
      <Building x={760} w={60} h={120} collapseX={-140} />
      <Building x={852} w={82} h={80} collapseX={-210} />
      <Building x={966} w={56} h={140} collapseX={-280} />
      <Building x={1054} w={72} h={95} collapseX={-340} />
      {/* baseline */}
      <line x1={40} y1={220} x2={1160} y2={220} className="stroke-bytes-line" strokeWidth="1" />
      {/* center Bytes mark */}
      <g data-footer-logo>
        <rect
          x={560}
          y={140}
          width={80}
          height={80}
          className="stroke-bytes-signal/60"
          fill="none"
          strokeWidth="1.25"
        />
        <path
          d="M560 140 L576 124 L656 124 L640 140 M656 124 L656 204 L640 220"
          className="stroke-bytes-signal/60"
          fill="none"
          strokeWidth="1.25"
        />
        <text
          x={600}
          y={186}
          textAnchor="middle"
          className="fill-bytes-ice font-bytes-mono"
          fontSize="16"
          letterSpacing="4"
        >
          BYTES
        </text>
      </g>
    </svg>
  );
}

/** Faint pre-drawn Bytes signature-style flourish. */
function SignatureFlourish() {
  return (
    <svg
      viewBox="0 0 160 48"
      className="h-8 w-auto opacity-30"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 34 C 26 8, 40 6, 38 20 C 36 34, 20 40, 30 40 C 44 40, 52 18, 64 18 C 74 18, 68 38, 80 34 C 92 30, 96 16, 108 20 C 118 23, 118 36, 130 28 C 140 21, 148 24, 152 22"
        fill="none"
        className="stroke-bytes-signal"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <MonoLabel>{title}</MonoLabel>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * SYS.11 // FOOTER LOOP — the wireframe city reprise collapses toward the
 * Bytes mark on scroll (desktop, motion-safe), then standard footer content.
 */
export function PremiumFooter() {
  const returnToTop = () => {
    const lenis = (window as unknown as {
      lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void };
    }).lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Move focus to the top of the document for keyboard/AT users.
    const target = document.getElementById('main') ?? document.body;
    target.setAttribute('tabindex', '-1');
    (target as HTMLElement).focus({ preventScroll: true });
  };

  return (
    <MotionBoundary
      as="div"
      className="bg-bytes-ink"
      setup={({ root, mm, reduced }) => {
        if (reduced) return;
        mm.add(BREAKPOINTS.desktop, () => {
          const buildings = gsap.utils.toArray<SVGGElement>('[data-footer-building]', root);
          const logo = root.querySelector<SVGGElement>('[data-footer-logo]');
          const city = root.querySelector<HTMLElement>('[data-footer-city]');
          if (!buildings.length || !city) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: city,
              start: 'top bottom',
              end: 'bottom 40%',
              scrub: 0.6,
            },
          });
          buildings.forEach((b, i) => {
            const collapseX = Number(b.dataset.collapseX ?? '0');
            tl.to(
              b,
              {
                x: collapseX,
                scale: 0.7,
                opacity: 0.12,
                transformOrigin: '50% 100%',
                ease: 'power2.inOut',
              },
              i * 0.05
            );
          });
          if (logo) {
            tl.fromTo(
              logo,
              { opacity: 0.5, scale: 0.94, transformOrigin: '50% 100%' },
              { opacity: 1, scale: 1, ease: 'power2.out' },
              0.1
            );
          }
        });
      }}
    >
      <footer className="relative overflow-hidden" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Bytes Platform footer
        </h2>

        {/* Wireframe city reprise */}
        <div data-footer-city className="px-6 pt-20 md:px-10 md:pt-28">
          <WireframeCity />
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Hairline className="mt-12" />

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-4 md:py-20">
            <LinkColumn title="Quick Links" links={quickLinks} />
            <LinkColumn title="Products" links={productLinks} />
            <LinkColumn title="Services" links={serviceLinks} />
            <div>
              <MonoLabel>Contacts</MonoLabel>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={contact.phoneHref} className={linkClass}>
                    {contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className={linkClass}>
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {contact.addressLines.join(', ')}
                  </a>
                </li>
              </ul>
              <ul className="mt-8 flex items-center gap-4">
                {contact.socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Bytes Platform on ${social.name}`}
                      className="font-bytes-mono text-xs tracking-[0.18em] uppercase text-bytes-steel transition-colors duration-200 hover:text-bytes-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Hairline />

          {/* Return to top + metadata */}
          <div className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
            <p className="font-bytes-mono text-[11px] tracking-[0.22em] uppercase text-bytes-steel/50">
              BYTES PLATFORM // DENTON, TX // 33.2148°N 97.1331°W
            </p>
            <button
              type="button"
              onClick={returnToTop}
              className="inline-flex items-center gap-2 rounded-full border border-bytes-line px-5 py-2.5 font-bytes-mono text-[11px] tracking-[0.22em] uppercase text-bytes-steel transition-colors duration-300 hover:border-bytes-signal/60 hover:text-bytes-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
            >
              Return to System <span aria-hidden="true">↑</span>
            </button>
          </div>

          <Hairline />

          {/* Legal row */}
          <div className="flex flex-col items-start justify-between gap-6 py-8 md:flex-row md:items-center">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${linkClass} text-xs`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <SignatureFlourish />
              <p className="text-xs text-bytes-steel/60">Developed by Bytes Platform Inc.</p>
            </div>
          </div>
        </div>
      </footer>
    </MotionBoundary>
  );
}
