'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type MotionSetup = (ctx: {
  root: HTMLElement;
  mm: gsap.MatchMedia;
  reduced: boolean;
}) => void;

/**
 * Scopes GSAP work to a section root and guarantees cleanup.
 * All homepage sections create their timelines through this wrapper so no
 * ScrollTrigger instance can leak on unmount, and desktop pinned timelines
 * are only ever created inside the matching matchMedia scope.
 */
export function MotionBoundary({
  className,
  children,
  setup,
  as: Tag = 'div',
  ...rest
}: {
  className?: string;
  children: ReactNode;
  setup?: MotionSetup;
  as?: 'div' | 'section';
} & Record<string, unknown>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || !setup) return;
      const mm = gsap.matchMedia(rootRef);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setup({ root: rootRef.current, mm, reduced });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <Tag ref={rootRef as never} className={className} {...rest}>
      {children}
    </Tag>
  );
}
