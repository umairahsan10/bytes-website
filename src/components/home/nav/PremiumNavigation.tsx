'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navItems } from '@/data/home';
import { CtaLink } from '@/components/home/ui';
import { useMediaQuery, usePointerFine, useReducedMotionPref, BREAKPOINTS } from '@/components/home/hooks';
import { DesktopMegaMenu } from './DesktopMegaMenu';
import { MobileMenu } from './MobileMenu';

export type NavTheme = 'dark' | 'light';

/** Vertical probe line (px from viewport top) used to decide the section theme. */
const THEME_PROBE_Y = 48;
const SCROLL_THRESHOLD = 24;
const HOVER_CLOSE_DELAY_MS = 120;

/**
 * Fixed top command bar (§02 PremiumNavigation).
 * - Transparent at top; after scrollY > 24 gains glass surface + compressed padding.
 * - 1px bottom hairline: scaleX = document scroll progress (scroll listener + rAF).
 * - Theme-aware: IntersectionObserver over [data-nav-theme] sections; a section
 *   with data-nav-theme="light" under the bar flips links to dark text.
 * - Items with children open a mega menu on hover AND click/Enter; Escape closes
 *   and returns focus to the trigger; click outside closes.
 */
export function PremiumNavigation() {
  const pathname = usePathname();
  const reduced = useReducedMotionPref();
  const pointerFine = usePointerFine();
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);

  const [scrolled, setScrolled] = useState(false);
  const [sectionTheme, setSectionTheme] = useState<NavTheme>('dark');
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const closeTimer = useRef<number | null>(null);

  /* ── Scroll state + progress hairline (rAF-throttled) ─────────── */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Section theme via IntersectionObserver on [data-nav-theme] ─ */
  useEffect(() => {
    const observed = new Set<Element>();
    let io: IntersectionObserver | null = null;

    const applyTheme = () => {
      let next: NavTheme = 'dark';
      for (const el of observed) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= THEME_PROBE_Y && rect.bottom > THEME_PROBE_Y) {
          next = (el as HTMLElement).dataset.navTheme === 'light' ? 'light' : 'dark';
          break;
        }
      }
      setSectionTheme(next);
    };

    // 1px observation band at the probe line so IO fires exactly when the
    // section under the bar changes.
    const buildObserver = () => {
      io?.disconnect();
      io = new IntersectionObserver(applyTheme, {
        rootMargin: `-${THEME_PROBE_Y}px 0px ${THEME_PROBE_Y + 1 - window.innerHeight}px 0px`,
      });
      observed.forEach((el) => io?.observe(el));
    };

    const collect = () => {
      document.querySelectorAll('[data-nav-theme]').forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io?.observe(el);
        }
      });
      applyTheme();
    };

    buildObserver();
    collect();

    // Sections mount lazily — pick up late arrivals.
    const mo = new MutationObserver(collect);
    mo.observe(document.body, { childList: true, subtree: true });

    const onResize = () => {
      buildObserver();
      applyTheme();
    };
    window.addEventListener('resize', onResize);

    return () => {
      io?.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* ── Mega menu open/close helpers ──────────────────────────────── */
  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (label: string) => {
      cancelClose();
      setOpenId(label);
    },
    [cancelClose]
  );

  const closeMenu = useCallback(() => {
    cancelClose();
    setOpenId(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setOpenId(null);
    }, HOVER_CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // Click outside closes the mega menu.
  useEffect(() => {
    if (openId === null) return;
    const onPointerDown = (e: PointerEvent) => {
      const header = headerRef.current;
      if (header && e.target instanceof Node && !header.contains(e.target)) setOpenId(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openId]);

  // Close the mobile sheet if the viewport grows into the desktop range.
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /* ── Theme-driven classes ──────────────────────────────────────── */
  // The glass surface is dark, so while scrolled the bar always reads dark.
  const theme: NavTheme = scrolled ? 'dark' : sectionTheme;
  const light = theme === 'light';

  const focusRing =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal';
  const linkBase = `inline-flex items-center gap-1.5 px-1 py-2 font-bytes-display text-sm font-medium tracking-wide transition-colors duration-200 motion-reduce:transition-none ${focusRing}`;
  const linkTone = light
    ? 'text-bytes-midnight/80 hover:text-bytes-midnight'
    : 'text-bytes-ice/80 hover:text-white';
  const linkActive = light ? 'text-bytes-midnight' : 'text-white';

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-[350ms] motion-reduce:transition-none ${
          scrolled
            ? 'border-b border-bytes-line bg-bytes-glass backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-5 transition-[padding] duration-[350ms] motion-reduce:transition-none md:px-8 ${
            scrolled ? 'py-2.5' : 'py-4'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Bytes Platform — home"
            className={`shrink-0 rounded-sm ${focusRing}`}
          >
            <Image
              src="/assets/bytes-logo.png"
              alt="Bytes Platform"
              width={765}
              height={370}
              priority
              className={`h-9 w-auto md:h-10 ${light ? '[filter:invert(1)_hue-rotate(180deg)]' : ''}`}
            />
          </Link>

          {/* Center links — desktop only (≥1200px) */}
          <nav aria-label="Primary" className="hidden min-[1200px]:block">
            <ul className="flex list-none items-center gap-2 p-0">
              {navItems.map((item) => {
                const hasChildren = !!item.children?.length;
                if (!hasChildren) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        className={`${linkBase} ${pathname === item.href ? linkActive : linkTone}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const isOpen = openId === item.label;
                const slug = item.label.toLowerCase();
                const triggerId = `nav-trigger-${slug}`;
                const menuId = `nav-menu-${slug}`;
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={pointerFine ? () => openMenu(item.label) : undefined}
                    onMouseLeave={pointerFine ? scheduleClose : undefined}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape' && isOpen) {
                        e.stopPropagation();
                        closeMenu();
                        triggerRefs.current.get(item.label)?.focus();
                      }
                    }}
                    onBlur={(e) => {
                      // Focus left this item (trigger + panel) → close.
                      if (
                        isOpen &&
                        e.relatedTarget instanceof Node &&
                        !e.currentTarget.contains(e.relatedTarget)
                      ) {
                        closeMenu();
                      }
                    }}
                  >
                    <button
                      ref={(el) => {
                        triggerRefs.current.set(item.label, el);
                      }}
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={menuId}
                      onClick={() => (isOpen ? closeMenu() : openMenu(item.label))}
                      className={`${linkBase} ${isOpen ? linkActive : linkTone}`}
                    >
                      {item.label}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                        className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <path
                          d="M1.5 3.5L5 7l3.5-3.5"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <DesktopMegaMenu
                      item={item}
                      open={isOpen}
                      menuId={menuId}
                      triggerId={triggerId}
                      reduced={reduced}
                      onNavigate={closeMenu}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-3">
            <CtaLink
              href="/contact"
              variant="primary"
              className="hidden !px-6 !py-2.5 min-[1200px]:inline-flex"
            >
              Book a Free Consultation
            </CtaLink>

            {/* Hamburger — below 1200px */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              onClick={() => setMobileOpen(true)}
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[7px] rounded-full border transition-colors duration-200 motion-reduce:transition-none min-[1200px]:hidden ${
                light
                  ? 'border-bytes-navy/25 text-bytes-midnight hover:border-bytes-blue'
                  : 'border-bytes-line text-bytes-ice hover:border-bytes-signal/60'
              } ${focusRing}`}
            >
              <span aria-hidden="true" className="block h-px w-5 bg-current" />
              <span aria-hidden="true" className="block h-px w-5 bg-current" />
            </button>
          </div>
        </div>

        {/* 1px document scroll progress hairline */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 block h-px origin-left bg-bytes-signal"
          style={{ transform: 'scaleX(0)' }}
        />
      </header>

      <MobileMenu open={mobileOpen} onClose={closeMobile} reduced={reduced} />
    </>
  );
}
