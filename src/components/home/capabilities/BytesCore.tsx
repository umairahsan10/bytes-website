'use client';

import { useId, type CSSProperties } from 'react';
import type { Capability } from '@/data/home';

export type CoreState = Capability['core'];

const CORE_STATES: CoreState[] = ['ai', 'software', 'web', 'mobile', 'growth', 'infra'];

/** power3.inOut-like cubic bezier for the morph crossfade */
const MORPH_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

/** Slight base-core attitude per state so the whole object feels like it re-orients. */
const BASE_POSE: Record<CoreState, string> = {
  ai: 'rotate(0deg) scale(1)',
  software: 'rotate(-6deg) scale(0.98)',
  web: 'rotate(4deg) scale(1.02)',
  mobile: 'rotate(-3deg) scale(0.97)',
  growth: 'rotate(6deg) scale(1)',
  infra: 'rotate(-8deg) scale(1.01)',
};

function groupStyle(active: boolean): CSSProperties {
  return {
    opacity: active ? 1 : 0,
    transform: active ? 'rotate(0deg) scale(1)' : 'rotate(-10deg) scale(0.85)',
    transformBox: 'view-box',
    transformOrigin: '50% 50%',
    transition: `opacity 0.6s ${MORPH_EASE}, transform 0.6s ${MORPH_EASE}`,
  };
}

/**
 * The Bytes Core — authored SVG object with six visual states.
 * State change = crossfade/transform between layered accent groups
 * (CSS transitions on opacity/transform only; one small blur on the highlight).
 */
export function BytesCore({
  state,
  className = '',
}: {
  state: CoreState;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const coreGrad = `bp-core-grad-${uid}`;
  const innerGrad = `bp-core-inner-${uid}`;
  const iceGrad = `bp-core-ice-${uid}`;
  const softBlur = `bp-core-blur-${uid}`;

  return (
    <svg
      viewBox="0 0 280 280"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id={coreGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0C1D36" />
          <stop offset="55%" stopColor="#12305E" />
          <stop offset="100%" stopColor="#2F6BFF" />
        </linearGradient>
        <linearGradient id={innerGrad} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#2F6BFF" />
          <stop offset="100%" stopColor="#0C1D36" />
        </linearGradient>
        <linearGradient id={iceGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2F7FC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F2F7FC" stopOpacity="0" />
        </linearGradient>
        <filter id={softBlur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ── Base core: layered rounded polygons, clay/frosted material ── */}
      <g
        style={{
          transform: BASE_POSE[state],
          transformBox: 'view-box',
          transformOrigin: '50% 50%',
          transition: `transform 0.6s ${MORPH_EASE}`,
        }}
      >
        {/* outer superellipse */}
        <path
          d="M140 34 C 216 34 246 64 246 140 C 246 216 216 246 140 246 C 64 246 34 216 34 140 C 34 64 64 34 140 34 Z"
          fill={`url(#${coreGrad})`}
        />
        {/* mid facet — rotated rounded square for depth */}
        <rect
          x="66"
          y="66"
          width="148"
          height="148"
          rx="42"
          fill={`url(#${innerGrad})`}
          opacity="0.85"
          style={{
            transform: 'rotate(45deg)',
            transformBox: 'fill-box',
            transformOrigin: '50% 50%',
          }}
        />
        {/* inner nucleus */}
        <circle cx="140" cy="140" r="52" fill={`url(#${innerGrad})`} opacity="0.9" />
        <circle cx="140" cy="140" r="52" fill="none" stroke="#72DAFF" strokeOpacity="0.35" />
        {/* frosted highlight (single small blur) */}
        <ellipse
          cx="112"
          cy="98"
          rx="46"
          ry="26"
          fill={`url(#${iceGrad})`}
          opacity="0.5"
          filter={`url(#${softBlur})`}
        />
        {/* hairline equator */}
        <ellipse
          cx="140"
          cy="140"
          rx="104"
          ry="38"
          fill="none"
          stroke="rgba(111,167,255,0.28)"
          strokeDasharray="2 5"
        />
      </g>

      {/* ── State accents (all mounted, crossfaded) ─────────────────── */}
      {CORE_STATES.map((s) => (
        <g key={s} style={groupStyle(s === state)}>
          {s === 'ai' && (
            <g>
              <circle cx="140" cy="140" r="116" fill="none" stroke="#4C92FF" strokeOpacity="0.45" strokeDasharray="3 7" />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const x = 140 + Math.cos(a) * 116;
                const y = 140 + Math.sin(a) * 116;
                return (
                  <g key={i}>
                    <line x1={140 + Math.cos(a) * 92} y1={140 + Math.sin(a) * 92} x2={x} y2={y} stroke="#4C92FF" strokeOpacity="0.35" />
                    <circle cx={x} cy={y} r={i % 2 === 0 ? 5 : 3} fill={i % 2 === 0 ? '#2F6BFF' : '#72DAFF'} />
                  </g>
                );
              })}
            </g>
          )}
          {s === 'software' && (
            <g>
              {[0, 1, 2].map((i) => (
                <rect
                  key={i}
                  x={188 - i * 10}
                  y={62 + i * 26}
                  width="64"
                  height="18"
                  rx="6"
                  fill={i === 1 ? '#2F6BFF' : 'none'}
                  fillOpacity={i === 1 ? 0.9 : 0}
                  stroke={i === 1 ? 'none' : '#4C92FF'}
                  strokeOpacity="0.7"
                />
              ))}
              {[0, 1, 2].map((i) => (
                <rect key={`l${i}`} x={26 + i * 8} y={172 + i * 22} width="46" height="14" rx="5" fill="#0C1D36" fillOpacity={0.12 + i * 0.1} stroke="#2F6BFF" strokeOpacity="0.4" />
              ))}
            </g>
          )}
          {s === 'web' && (
            <g>
              <path d="M 36 96 A 116 116 0 0 1 140 24" fill="none" stroke="#4C92FF" strokeOpacity="0.6" strokeWidth="2" />
              <path d="M 244 184 A 116 116 0 0 1 140 256" fill="none" stroke="#72DAFF" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 6" />
              {/* browser chrome hint */}
              <rect x="176" y="44" width="76" height="52" rx="10" fill="none" stroke="#2F6BFF" strokeOpacity="0.7" />
              <line x1="176" y1="60" x2="252" y2="60" stroke="#2F6BFF" strokeOpacity="0.7" />
              <circle cx="186" cy="52" r="2.4" fill="#72DAFF" />
              <circle cx="194" cy="52" r="2.4" fill="#4C92FF" />
              <circle cx="202" cy="52" r="2.4" fill="#2F6BFF" />
            </g>
          )}
          {s === 'mobile' && (
            <g>
              <rect x="196" y="76" width="44" height="86" rx="14" fill="none" stroke="#4C92FF" strokeOpacity="0.75" />
              <line x1="208" y1="150" x2="228" y2="150" stroke="#72DAFF" strokeOpacity="0.7" />
              <rect x="40" y="128" width="40" height="78" rx="13" fill="#0C1D36" fillOpacity="0.1" stroke="#2F6BFF" strokeOpacity="0.6" />
              <line x1="51" y1="194" x2="69" y2="194" stroke="#2F6BFF" strokeOpacity="0.6" />
            </g>
          )}
          {s === 'growth' && (
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={i}
                  x={182 + i * 15}
                  y={210 - i * 22}
                  width="9"
                  height={22 + i * 22}
                  rx="4"
                  fill={i === 4 ? '#2F6BFF' : '#4C92FF'}
                  fillOpacity={0.35 + i * 0.15}
                />
              ))}
              <polyline points="182,196 208,168 224,178 250,120" fill="none" stroke="#72DAFF" strokeOpacity="0.8" strokeWidth="2" />
              <circle cx="250" cy="120" r="4" fill="#72DAFF" />
            </g>
          )}
          {s === 'infra' && (
            <g>
              <polyline points="24,206 76,158 140,196 204,150 256,190" fill="none" stroke="#4C92FF" strokeOpacity="0.6" strokeWidth="1.5" />
              <polyline points="24,238 76,238 140,238 204,238 256,238" fill="none" stroke="#2F6BFF" strokeOpacity="0.4" />
              {[24, 76, 140, 204, 256].map((x, i) => (
                <g key={i}>
                  <line x1={x} y1={[206, 158, 196, 150, 190][i]} x2={x} y2="238" stroke="#2F6BFF" strokeOpacity="0.35" />
                  <circle cx={x} cy={[206, 158, 196, 150, 190][i]} r="4" fill="#2F6BFF" />
                </g>
              ))}
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
