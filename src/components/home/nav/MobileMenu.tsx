'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navItems, legalLinks } from '@/data/home';

const SHEET_ID = 'bytes-mobile-menu';

const FOCUSABLE = 'a[href], button:not([disabled])';

/** LenisProvider stores the instance on window; typed locally (global augmentation is unreliable here). */
type LenisLike = { stop: () => void; start: () => void };
const getLenis = (): LenisLike | undefined => (window as Window & { lenis?: LenisLike }).lenis;

/**
 * Full-screen mobile navigation sheet (§02 PremiumNavigation, <1200px).
 * Locks body scroll + Lenis while open, traps focus, closes on Escape.
 * Child groups expand via the grid-template-rows 0fr→1fr trick (no height
 * animation); collapsed panels are `inert` so hidden links are unreachable.
 */
export function MobileMenu({
  open,
  onClose,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  reduced: boolean;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [expanded, setExpanded] = useState<string | null>(null);

  // Reset accordions whenever the sheet closes.
  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  // Body scroll + Lenis lock.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    getLenis()?.stop();
    return () => {
      body.style.overflow = prevOverflow;
      getLenis()?.start();
    };
  }, [open]);

  // Focus trap + Escape. Focus returns to the opener on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusables = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && sheet.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      previous?.focus();
    };
  }, [open]);

  const linkFocus =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={sheetRef}
          id={SHEET_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: reduced ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.25 } }}
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-bytes-ink min-[1200px]:hidden"
        >
          {/* Sheet header */}
          <div className="flex items-center justify-between px-5 pb-4 pt-5">
            <span className="font-bytes-mono text-[11px] uppercase tracking-[0.22em] text-bytes-steel/70">
              BYTES // MENU
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-bytes-line text-bytes-ice transition-colors duration-200 hover:border-bytes-signal/60 hover:text-white motion-reduce:transition-none ${linkFocus}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Primary links */}
          <nav aria-label="Mobile" className="flex-1 px-5">
            <ul className="divide-y divide-bytes-line/50 border-t border-bytes-line/50">
              {navItems.map((item) => {
                const hasChildren = !!item.children?.length;
                if (!hasChildren) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`block py-4 font-bytes-display text-3xl font-semibold tracking-[-0.02em] text-bytes-ice transition-colors duration-200 hover:text-white motion-reduce:transition-none ${linkFocus}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const isExpanded = expanded === item.label;
                const panelId = `${SHEET_ID}-panel-${item.label.toLowerCase()}`;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpanded(isExpanded ? null : item.label)}
                      className={`flex w-full items-center justify-between py-4 text-left font-bytes-display text-3xl font-semibold tracking-[-0.02em] transition-colors duration-200 motion-reduce:transition-none ${
                        isExpanded ? 'text-white' : 'text-bytes-ice hover:text-white'
                      } ${linkFocus}`}
                    >
                      {item.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                        className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                          isExpanded ? 'rotate-45' : ''
                        }`}
                      >
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>

                    {/* grid-template-rows 0fr→1fr accordion (no height animation) */}
                    <div
                      id={panelId}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden" inert={!isExpanded}>
                        <ul className="pb-4 pl-1">
                          {item.children?.map((child, i) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className={`flex items-baseline gap-3 py-2.5 text-lg text-bytes-steel transition-colors duration-200 hover:text-white motion-reduce:transition-none ${linkFocus}`}
                              >
                                <span
                                  aria-hidden="true"
                                  className="font-bytes-mono text-[10px] tracking-[0.2em] text-bytes-signal/80"
                                >
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pt-8">
              <Link
                href="/contact"
                onClick={onClose}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-bytes-blue px-7 py-4 font-bytes-display text-sm font-semibold text-white transition-colors duration-300 hover:bg-bytes-signal motion-reduce:transition-none ${linkFocus}`}
              >
                Book a Free Consultation
              </Link>
            </div>
          </nav>

          {/* Legal footer */}
          <div className="mt-10 border-t border-bytes-line/50 px-5 pb-8 pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((legal) => (
                <li key={legal.href}>
                  <Link
                    href={legal.href}
                    onClick={onClose}
                    className={`font-bytes-mono text-[11px] uppercase tracking-[0.18em] text-bytes-steel/60 transition-colors duration-200 hover:text-bytes-steel motion-reduce:transition-none ${linkFocus}`}
                  >
                    {legal.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
