'use client';

import gsap from 'gsap';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { MonoLabel } from '../ui';

/**
 * BytesSignature — the brand moment after the hero.
 *
 * An original hand-authored cursive "Bytes" as one continuous stroke:
 * looped capital B, y with a descender loop, tall pointed t, looped e,
 * closed s, then a long swash that sweeps back left and crosses the t.
 * Not traced from any reference — designed coordinate by coordinate.
 *
 * Draw-on: stroke-dashoffset over 1.1s (0.9s mobile), play-once at top 70%.
 * Bloom: a duplicated path underneath, strokeWidth 14, blurred via a small
 * SVG gaussian applied to that element only. Reduced motion: fully drawn
 * from the start, label visible (that is the server-rendered default).
 */

const SIGNATURE_D = [
  // B — lead-in, looped ascender, downstroke, double bowl
  'M 62 170',
  'C 76 160 92 128 99 92',
  'C 104 66 106 46 96 45',
  'C 85 44 80 74 77 104',
  'C 75 126 72 150 70 168',
  'C 86 158 112 138 126 118',
  'C 138 100 132 84 116 88',
  'C 104 91 96 102 95 110',
  'C 110 108 134 116 140 132',
  'C 145 146 132 162 112 166',
  'C 124 168 146 160 158 150',
  // y — double arch cup with a descender loop
  'C 174 140 190 122 196 112',
  'C 192 128 188 142 192 152',
  'C 196 160 206 156 212 146',
  'C 218 134 221 120 222 112',
  'C 221 132 219 152 223 170',
  'C 226 186 223 202 210 204',
  'C 199 205 197 191 205 179',
  'C 216 163 236 148 256 142',
  // t — tall pointed ascender, back down, base curl
  'C 268 136 280 112 286 84',
  'C 290 68 292 56 291 54',
  'C 288 74 284 106 282 130',
  'C 281 143 284 152 292 150',
  'C 300 148 308 142 314 136',
  // e — rising loop
  'C 324 128 336 116 340 108',
  'C 344 100 336 94 328 100',
  'C 318 108 314 124 320 136',
  'C 326 147 340 145 350 137',
  // s — peak, curl, bottom bulge, closing loop
  'C 360 129 370 118 374 110',
  'C 376 104 374 102 370 106',
  'C 362 114 356 126 358 136',
  'C 360 146 372 150 380 144',
  'C 386 139 384 133 376 131',
  // flourish — sweeps right, rises, then crosses back over the t
  'C 390 138 410 148 430 150',
  'C 466 154 514 148 546 130',
  'C 560 122 564 110 552 104',
  'C 512 92 396 96 316 100',
  'C 288 101 262 100 244 97',
].join(' ');

export function BytesSignature() {
  const setup: MotionSetup = ({ root, reduced }) => {
    if (reduced) return; // pre-drawn signature + visible label stay as-is

    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-signature-path]'));
    const label = root.querySelector('[data-signature-label]');
    if (paths.length === 0 || !label) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;

    for (const path of paths) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    }
    gsap.set(label, { autoAlpha: 0, y: 16 });

    gsap
      .timeline({
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      })
      .to(paths, {
        strokeDashoffset: 0,
        duration: mobile ? 0.9 : 1.1,
        ease: 'power2.inOut',
      })
      .to(label, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.1');
  };

  return (
    <MotionBoundary
      as="section"
      data-nav-theme="dark"
      aria-label="Bytes — engineered with intent"
      className="relative flex min-h-[90svh] flex-col items-center justify-center gap-10 overflow-hidden bg-bytes-ink px-6"
      setup={setup}
    >
      <svg
        viewBox="0 0 600 220"
        className="w-[min(78vw,560px)]"
        fill="none"
        role="img"
        aria-label="Bytes, written as a hand-drawn signature"
      >
        <defs>
          <filter id="bytes-signature-bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {/* bloom duplicate — the blur filter touches only this small element */}
        <path
          data-signature-path
          d={SIGNATURE_D}
          stroke="#4C92FF"
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.35}
          filter="url(#bytes-signature-bloom)"
        />
        <path
          data-signature-path
          d={SIGNATURE_D}
          stroke="#4C92FF"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div data-signature-label>
        <MonoLabel>ENGINEERED WITH INTENT</MonoLabel>
      </div>
    </MotionBoundary>
  );
}
