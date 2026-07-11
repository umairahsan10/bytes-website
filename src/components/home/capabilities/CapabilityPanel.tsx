'use client';

import type { ReactNode } from 'react';
import type { Capability } from '@/data/home';

/**
 * Per-chapter minimal UI panel — an authored HTML/CSS mockup card
 * (window chrome, skeleton rows, one accent element per capability).
 * Generic labels only; no fake metrics or numbers presented as data.
 */

type PanelSpec = { label: string; accent: ReactNode };

const skeleton = 'rounded-full bg-bytes-navy/10';

const PANELS: Record<Capability['core'], PanelSpec> = {
  ai: {
    label: 'Workflows',
    accent: (
      <div className="flex h-full w-full flex-col justify-center gap-2">
        <div className="ml-auto flex h-8 w-16 items-center justify-center gap-1 rounded-xl rounded-br-sm bg-bytes-blue/90">
          <span className="h-1 w-1 rounded-full bg-white/90" />
          <span className="h-1 w-1 rounded-full bg-white/70" />
          <span className="h-1 w-1 rounded-full bg-white/50" />
        </div>
        <div className="mr-auto h-8 w-20 rounded-xl rounded-bl-sm border border-bytes-blue/30 bg-bytes-blue/10" />
      </div>
    ),
  },
  software: {
    label: 'Modules',
    accent: (
      <div className="grid h-full w-full grid-cols-2 content-center gap-1.5">
        <div className="h-7 rounded-md bg-bytes-blue/80" />
        <div className="h-7 rounded-md border border-bytes-navy/15 bg-bytes-navy/5" />
        <div className="h-7 rounded-md border border-bytes-navy/15 bg-bytes-navy/5" />
        <div className="h-7 rounded-md border border-bytes-blue/30 bg-bytes-blue/10" />
      </div>
    ),
  },
  web: {
    label: 'Pages',
    accent: (
      <div className="flex h-full w-full flex-col justify-center">
        <div className="overflow-hidden rounded-lg border border-bytes-navy/15">
          <div className="flex items-center gap-1 border-b border-bytes-navy/10 bg-bytes-navy/5 px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-bytes-navy/20" />
            <span className="ml-1 h-1.5 w-10 rounded-full bg-bytes-navy/15" />
          </div>
          <div className="space-y-1.5 p-2">
            <div className="h-2 w-3/4 rounded-full bg-bytes-blue/50" />
            <div className="h-2 w-1/2 rounded-full bg-bytes-navy/10" />
          </div>
        </div>
      </div>
    ),
  },
  mobile: {
    label: 'Screens',
    accent: (
      <div className="flex h-full w-full items-center justify-center gap-2">
        <div className="flex h-16 w-9 flex-col justify-between rounded-lg border border-bytes-blue/40 bg-bytes-blue/10 p-1.5">
          <div className="h-1.5 w-full rounded-full bg-bytes-blue/40" />
          <div className="mx-auto h-1 w-4 rounded-full bg-bytes-navy/20" />
        </div>
        <div className="flex h-14 w-8 flex-col justify-between rounded-lg border border-bytes-navy/15 bg-bytes-navy/5 p-1.5">
          <div className="h-1.5 w-full rounded-full bg-bytes-navy/15" />
          <div className="mx-auto h-1 w-3 rounded-full bg-bytes-navy/15" />
        </div>
      </div>
    ),
  },
  growth: {
    label: 'Leads',
    accent: (
      <div className="flex h-full w-full items-end justify-center gap-1.5 pb-1">
        {[28, 40, 34, 52, 64].map((h, i) => (
          <div
            key={i}
            className={`w-3 rounded-t-sm ${i === 4 ? 'bg-bytes-blue' : 'bg-bytes-blue/30'}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  infra: {
    label: 'Deploy',
    accent: (
      <div className="flex h-full w-full items-center justify-center">
        <svg viewBox="0 0 96 40" className="h-10 w-24" aria-hidden="true">
          <line x1="12" y1="20" x2="48" y2="20" stroke="#2F6BFF" strokeOpacity="0.4" strokeWidth="2" />
          <line x1="48" y1="20" x2="84" y2="20" stroke="#2F6BFF" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="3 4" />
          <circle cx="12" cy="20" r="5" fill="#2F6BFF" />
          <circle cx="48" cy="20" r="5" fill="none" stroke="#2F6BFF" strokeWidth="2" />
          <circle cx="84" cy="20" r="5" fill="none" stroke="#2F6BFF" strokeOpacity="0.4" strokeWidth="2" />
        </svg>
      </div>
    ),
  },
};

export function CapabilityPanel({ capability }: { capability: Capability }) {
  const spec = PANELS[capability.core];
  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full flex-col rounded-2xl border border-bytes-navy/10 bg-white/80 p-4"
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-bytes-navy/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-bytes-navy/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-bytes-navy/20" />
        <span className="ml-auto font-bytes-mono text-[10px] uppercase tracking-[0.2em] text-bytes-navy/50">
          {spec.label}
        </span>
      </div>

      {/* body: skeleton rows + accent */}
      <div className="mt-3 grid flex-1 grid-cols-[1fr_auto] gap-4">
        <div className="flex flex-col justify-center gap-2.5">
          <div className={`h-2 w-4/5 ${skeleton}`} />
          <div className={`h-2 w-3/5 ${skeleton}`} />
          <div className={`h-2 w-2/3 ${skeleton}`} />
        </div>
        <div className="w-24">{spec.accent}</div>
      </div>

      {/* mono caption */}
      <div className="mt-3 font-bytes-mono text-[10px] tracking-[0.22em] text-bytes-navy/40">
        PANEL // {capability.index}
      </div>
    </div>
  );
}
