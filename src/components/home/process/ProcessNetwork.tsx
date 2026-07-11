'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '@/data/home';
import { MotionBoundary, type MotionSetup } from '../MotionBoundary';
import { SectionHeading } from '../ui';
import { BREAKPOINTS } from '../hooks';

gsap.registerPlugin(ScrollTrigger);

/* ── Desktop network geometry (viewBox 1200×2000) ────────────── */
const NODES = [
  { x: 300, y: 220 },
  { x: 900, y: 640 },
  { x: 300, y: 1060 },
  { x: 900, y: 1480 },
  { x: 600, y: 1780 },
] as const;

const LINE_D =
  'M 600 60 C 420 100, 300 140, 300 220 C 300 420, 900 440, 900 640 ' +
  'C 900 840, 300 860, 300 1060 C 300 1260, 900 1280, 900 1480 C 900 1620, 740 1700, 600 1780';

/** Approximate progress along LINE_D at which each node is reached. */
const NODE_THRESHOLDS = [0.09, 0.33, 0.57, 0.81, 0.97] as const;

/** HTML copy blocks alternate left/right of the line. */
const STEP_POSITIONS = [
  'left-[30%] top-[11%]',
  'right-[30%] top-[32%] text-right',
  'left-[30%] top-[53%]',
  'right-[30%] top-[74%] text-right',
  'left-[54%] top-[89%]',
] as const;

function StepCopy({ index, name, copy }: { index: string; name: string; copy: string }) {
  return (
    <>
      <span className="font-bytes-mono text-xs tracking-[0.22em] text-bytes-blue">{index}</span>
      <h3 className="mt-1.5 font-bytes-display text-lg font-semibold tracking-[-0.01em] text-bytes-midnight xl:text-xl">
        {name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-bytes-navy/70">{copy}</p>
    </>
  );
}

/* ── Motion setup ────────────────────────────────────────────── */
const setupProcess: MotionSetup = ({ root, mm, reduced }) => {
  if (reduced) {
    // Line stays fully drawn (default DOM state); steps opacity-reveal on IO.
    const steps = gsap.utils.toArray<HTMLElement>('[data-pn-step], [data-pn-mstep]', root);
    steps.forEach((step) => {
      gsap.set(step, { opacity: 0 });
      ScrollTrigger.create({
        trigger: step,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.to(step, { opacity: 1, duration: 0.3, ease: 'power2.out' }),
      });
    });
    return;
  }

  /* Desktop: scrubbed dash draw + threshold-fired node timelines. */
  mm.add(BREAKPOINTS.desktop, () => {
    const stage = root.querySelector<HTMLElement>('[data-pn-desktop]');
    if (!stage) return;
    const line = stage.querySelector<SVGPathElement>('[data-pn-line]');
    const dots = gsap.utils.toArray<SVGGElement>('[data-pn-dot]', stage);
    const annots = gsap.utils.toArray<SVGGElement>('[data-pn-annot]', stage);
    const connectors = gsap.utils.toArray<SVGLineElement>('[data-pn-connector]', stage);
    const mark = stage.querySelector<SVGGElement>('[data-pn-mark]');
    const steps = gsap.utils.toArray<HTMLElement>('[data-pn-step]', stage);
    if (!line || dots.length !== NODES.length) return;

    gsap.set(line, { strokeDasharray: 100, strokeDashoffset: 100 });
    gsap.set(dots, { scale: 0, transformOrigin: '50% 50%', opacity: 1 });
    gsap.set(annots, { opacity: 0 });
    gsap.set(connectors, { opacity: 0 });
    gsap.set(steps, { opacity: 0, y: 20 });
    if (mark) gsap.set(mark, { opacity: 0 });

    const nodeTimelines = dots.map((dot, i) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });
      const connector = connectors[i - 1];
      if (connector) tl.to(connector, { opacity: 0.35, duration: 0.4 }, '<');
      const annot = annots[i];
      if (annot) tl.to(annot, { opacity: 1, duration: 0.4 }, '<0.05');
      const step = steps[i];
      if (step) tl.to(step, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<0.05');
      // Node 05 resolves into the Bytes mark.
      if (i === NODES.length - 1 && mark) {
        tl.to(mark, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '>-0.1');
        tl.to(dot, { opacity: 0, duration: 0.3 }, '<');
      }
      return tl;
    });

    const fired = NODES.map(() => false);

    gsap.to(line, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.8,
        onUpdate: (self) => {
          NODE_THRESHOLDS.forEach((threshold, i) => {
            if (self.progress >= threshold && !fired[i]) {
              fired[i] = true;
              nodeTimelines[i]?.play();
            } else if (self.progress < threshold && fired[i]) {
              fired[i] = false;
              nodeTimelines[i]?.reverse();
            }
          });
        },
      },
    });
  });

  /* Tablet / mobile: simpler vertical line, same dash technique. */
  mm.add('(max-width: 1199px)', () => {
    const stage = root.querySelector<HTMLElement>('[data-pn-mobile]');
    if (!stage) return;
    const line = stage.querySelector<SVGPathElement>('[data-pn-mline]');
    const steps = gsap.utils.toArray<HTMLElement>('[data-pn-mstep]', stage);

    if (line) {
      gsap.set(line, { strokeDasharray: 100, strokeDashoffset: 100 });
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: 0.8,
        },
      });
    }

    steps.forEach((step) => {
      const dot = step.querySelector<HTMLElement>('[data-pn-mdot]');
      const copy = step.querySelector<HTMLElement>('[data-pn-mcopy]');
      if (!dot || !copy) return;
      gsap.set(dot, { scale: 0 });
      gsap.set(copy, { opacity: 0, y: 20 });
      const tl = gsap
        .timeline({ paused: true })
        .to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' })
        .to(copy, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<0.05');
      ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    });
  });
};

/* ── Section ─────────────────────────────────────────────────── */
export function ProcessNetwork() {
  return (
    <MotionBoundary
      as="section"
      data-nav-theme="light"
      aria-labelledby="process-heading"
      className="relative bg-bytes-ice"
      setup={setupProcess}
    >
      <div className="mx-auto max-w-[90rem] px-6 py-24 md:px-10 md:py-28">
        <SectionHeading
          id="process-heading"
          eyebrow="SYS.05 // PROCESS"
          lines={['From ambition', 'to operating system.']}
          theme="light"
        />

        {/* ── Desktop: tall network SVG + HTML step overlay ── */}
        <div data-pn-desktop className="relative mx-auto mt-20 hidden aspect-[3/5] w-full max-w-6xl min-[1200px]:block">
          <svg
            viewBox="0 0 1200 2000"
            className="absolute inset-0 h-full w-full"
            fill="none"
            aria-hidden="true"
          >
            {/* Ghost route (always visible) */}
            <path d={LINE_D} stroke="var(--color-bytes-navy)" strokeOpacity="0.08" strokeWidth="2" />

            {/* Fine polygon connectors between completed nodes */}
            {NODES.slice(1).map((node, i) => (
              <line
                key={`c${i}`}
                data-pn-connector
                x1={NODES[i]!.x}
                y1={NODES[i]!.y}
                x2={node.x}
                y2={node.y}
                stroke="var(--color-bytes-blue)"
                strokeWidth="1"
                strokeDasharray="3 7"
              />
            ))}

            {/* Scroll-drawn line */}
            <path
              data-pn-line
              d={LINE_D}
              pathLength={100}
              stroke="var(--color-bytes-blue)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Wireframe annotations */}
            {NODES.map((node, i) => (
              <g key={`a${i}`} data-pn-annot stroke="var(--color-bytes-navy)" strokeOpacity="0.4" strokeWidth="1">
                <circle cx={node.x} cy={node.y} r="30" strokeDasharray="4 8" fill="none" />
                <line x1={node.x} y1={node.y - 40} x2={node.x} y2={node.y - 30} />
                <line x1={node.x} y1={node.y + 30} x2={node.x} y2={node.y + 40} />
                <line x1={node.x - 40} y1={node.y} x2={node.x - 30} y2={node.y} />
                <line x1={node.x + 30} y1={node.y} x2={node.x + 40} y2={node.y} />
                <text
                  x={node.x}
                  y={node.y - 52}
                  textAnchor="middle"
                  stroke="none"
                  fill="var(--color-bytes-navy)"
                  fillOpacity="0.5"
                  fontSize="13"
                  letterSpacing="3"
                  className="font-bytes-mono"
                >
                  {`N.${processSteps[i]?.index ?? ''}`}
                </text>
              </g>
            ))}

            {/* Node dots */}
            {NODES.map((node, i) => (
              <g key={`d${i}`} data-pn-dot>
                <circle cx={node.x} cy={node.y} r="15" fill="var(--color-bytes-ice)" stroke="var(--color-bytes-blue)" strokeWidth="2" />
                <circle cx={node.x} cy={node.y} r="6" fill="var(--color-bytes-blue)" />
              </g>
            ))}

            {/* Node 05 resolves into the Bytes mark */}
            <g data-pn-mark>
              <circle
                cx={NODES[4]!.x}
                cy={NODES[4]!.y}
                r="36"
                fill="none"
                stroke="var(--color-bytes-blue)"
                strokeWidth="1"
                strokeDasharray="5 9"
              />
              <circle cx={NODES[4]!.x} cy={NODES[4]!.y} r="27" fill="var(--color-bytes-midnight)" />
              <text
                x={NODES[4]!.x}
                y={NODES[4]!.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--color-bytes-ice)"
                fontSize="26"
                fontWeight="600"
                className="font-bytes-display"
              >
                B
              </text>
            </g>
          </svg>

          {/* Step copy — HTML overlay, alternating left/right of the line */}
          {processSteps.map((step, i) => (
            <div
              key={step.index}
              data-pn-step
              className={`absolute w-[300px] -translate-y-1/2 xl:w-[340px] ${STEP_POSITIONS[i] ?? ''}`}
            >
              <StepCopy index={step.index} name={step.name} copy={step.copy} />
            </div>
          ))}
        </div>

        {/* ── Tablet / mobile: vertical line variant, steps stacked ── */}
        <div data-pn-mobile className="relative mt-14 min-[1200px]:hidden">
          <svg
            viewBox="0 0 32 100"
            preserveAspectRatio="none"
            className="absolute bottom-20 left-0 top-1 w-8"
            fill="none"
            aria-hidden="true"
          >
            <path d="M 16 0 V 100" stroke="var(--color-bytes-navy)" strokeOpacity="0.1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path
              data-pn-mline
              d="M 16 0 V 100"
              pathLength={100}
              stroke="var(--color-bytes-blue)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="space-y-14">
            {processSteps.map((step, i) => {
              const isLast = i === processSteps.length - 1;
              return (
                <li key={step.index} data-pn-mstep className="grid grid-cols-[32px_1fr] gap-x-4">
                  <span data-pn-mdot className="mt-1 justify-self-center" aria-hidden="true">
                    {isLast ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bytes-midnight font-bytes-display text-sm font-semibold text-bytes-ice">
                        B
                      </span>
                    ) : (
                      <span className="block h-4 w-4 rounded-full border-2 border-bytes-blue bg-bytes-ice">
                        <span className="m-[3px] block h-1.5 w-1.5 rounded-full bg-bytes-blue" />
                      </span>
                    )}
                  </span>
                  <div data-pn-mcopy>
                    <StepCopy index={step.index} name={step.name} copy={step.copy} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </MotionBoundary>
  );
}
