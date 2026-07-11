'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { NavItem } from '@/data/home';

/**
 * Mega-menu panel for a nav item with children (§02 PremiumNavigation).
 * Absolutely positioned under the command bar; opens 0.25s opacity + y(-8→0).
 * The `pt-4` on the outer wrapper keeps the hover area continuous between the
 * trigger and the panel (padding, not margin, so mouseleave never fires in the gap).
 */
export function DesktopMegaMenu({
  item,
  open,
  menuId,
  triggerId,
  reduced,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  menuId: string;
  triggerId: string;
  reduced: boolean;
  onNavigate: () => void;
}) {
  const children = item.children ?? [];

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute left-1/2 top-full w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 pt-4">
          <motion.div
            id={menuId}
            aria-labelledby={triggerId}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: reduced ? 0.2 : 0.25, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.2 } }}
            className="rounded-2xl border border-bytes-line bg-bytes-midnight/95 p-2.5 shadow-[0_24px_60px_rgba(2,5,12,0.5)] backdrop-blur-md"
          >
            <p className="px-3.5 pb-2 pt-1.5 font-bytes-mono text-[10px] uppercase tracking-[0.22em] text-bytes-steel/50">
              {item.label} // INDEX
            </p>
            <ul>
              {children.map((child, i) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={onNavigate}
                    className="group flex items-start gap-4 rounded-xl px-3.5 py-3 transition-colors duration-200 hover:bg-bytes-navy/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bytes-signal motion-reduce:transition-none"
                  >
                    <span
                      aria-hidden="true"
                      className="pt-0.5 font-bytes-mono text-[10px] tracking-[0.2em] text-bytes-signal/80"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-bytes-display text-sm font-medium text-bytes-ice transition-colors duration-200 group-hover:text-white motion-reduce:transition-none">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="text-xs leading-relaxed text-bytes-steel/70">
                          {child.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
