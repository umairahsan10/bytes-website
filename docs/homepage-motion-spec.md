# Bytes Homepage — Motion Specification

Global rules first, then a per-section animation map. Companion to `docs/homepage-revamp-plan.md`.

## Global motion system

**Foundations (Phase 1, prerequisite for everything):**
```ts
// SmoothScrollProvider — the missing Lenis ↔ ScrollTrigger sync
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```
- One `MotionProvider` owns `gsap.registerPlugin(ScrollTrigger)` and a shared `gsap.matchMedia()` with breakpoints: `(min-width: 1200px)` desktop, `(768px–1199px)` tablet, `(max-width: 767px)` mobile, `(prefers-reduced-motion: reduce)` reduced.
- Every section wraps its timelines in `gsap.context()` scoped to its root ref; `context.revert()` on unmount (`MotionBoundary` primitive).
- `ScrollTrigger.refresh()` after: fonts ready (`document.fonts.ready`), hero poster/canvas swap, and loader completion (already exists in PageLoader — will be preserved).
- Desktop pinned timelines are created **inside** the desktop matchMedia scope only — never created-then-hidden on mobile.
- Tier timing: hover 0.2–0.45s / small reveal 0.6–0.9s / major reveal 0.8–1.2s. Eases: `power2.out` (reveals), `power3.inOut` (scene moves), `expo.out` (micro). No bounce/elastic.
- Transform + opacity only; `will-change` set on tween start, cleared on complete. No animated width/height/top/left/filter/box-shadow.

**Motion tiers**
- Tier 1 (cinematic, scroll-scrubbed, pinned): Hero Byte City, Capability Story, Project Rail.
- Tier 2 (supporting scroll scenes): Product Systems, Industry Stage, Process Network, Field Notes stack, Footer loop.
- Tier 3 (micro): buttons, links, nav, hover media, metadata, form focus.

**Reduced motion (single source of truth, context-provided):** all pinning/scrub/parallax/magnetic/marquee/camera off; content revealed complete with ≤0.3s opacity fades on IntersectionObserver; signature shown pre-drawn; marquee replaced by static wrapped grid; polygon field static.

---

## Per-section map

### 01 SystemLoader
| | |
|---|---|
| Trigger | First visit per session (sessionStorage), page load |
| Start → End | Ink overlay + BYTES stroke-draw (0.7s) + 3 mono boot lines → curtain wipe up (0.5s, power3.inOut) |
| Scroll | Locked during loader (≤1.2s total, hard cap 2.5s on real load events) |
| Mobile | Same, shorter (0.9s) |
| Reduced motion | Static wordmark, 0.3s fade, no lock beyond load |
| Perf risk | Low. Pure SVG/CSS. Replaces current 4s+ loader; subsequent route changes get a 200ms top progress hairline instead of full overlay |

### 02 PremiumNavigation
| | |
|---|---|
| Trigger | Scroll position + section theme (data-theme attr on sections observed via ScrollTrigger) |
| Start → End | Transparent, full height → surface `--bytes-glass` + blur(12px), −8px height compress, 0.35s |
| Mega menu | Open 0.25s (opacity + y −8→0, stagger 0.03 columns); Escape/click-outside close 0.2s; focus trapped |
| Progress | 1px bottom hairline scaleX = page progress (scrub, no smoothing cost) |
| Mobile | Full-screen sheet, clip-path circle-from-button 0.45s; body + Lenis locked (`lenis.stop()`); accordion submenus 0.3s height via grid-template-rows trick (not height anim) |
| Reduced motion | Instant open/close states, opacity 0.2s |
| Perf risk | Low. Blur limited to nav bar only |

### 03 Hero — Byte City (Tier 1)
| | |
|---|---|
| Trigger | Pin hero wrapper, `+=250%` scroll, scrub 0.8 |
| Start | Wide establishing isometric view; copy visible; polygon field idle |
| Stages (scrub progress) | 0–0.15 hold wide → 0.15–0.35 camera dollies in, first data path draws → 0.35–0.6 capability structures illuminate sequentially (8 emissive pulses) → 0.6–0.75 central Core activates (scale+emissive) → 0.75–0.9 camera rises through gate, copy fades −40px → 0.9–1 scene darkens to `--bytes-ink` |
| Camera | Driven by a single progress uniform; positions lerped along a CatmullRom path in useFrame (no React state per frame) |
| Pointer | ±1.5° parallax on camera target (lerp 0.05); nearest polygon nodes displace ≤12px. Pointer-fine devices only |
| Desktop | Full WebGL scene, DPR ≤ min(devicePixelRatio, 2), quality tier by `navigator.hardwareConcurrency` + first-100-frame FPS probe → drops particle count/DPR |
| Tablet | Same scene, DPR 1.25, no fog, half node count, pin `+=180%` |
| Mobile | **No WebGL.** AVIF/WebP poster (self-rendered city still) + 2-layer CSS parallax (translateY on scroll, ≤6%); pin `+=120%` or no pin on short viewports; copy always static/readable |
| Reduced motion | Poster + fully-lit city state; copy static; no pin |
| Fallbacks | No WebGL/context lost → poster path (same as mobile). Copy is semantic HTML outside canvas; one H1 |
| Perf risk | **Highest of page.** Mitigations: instancedMesh for buildings, one directional + ambient light, no shadow maps, no postprocessing (glow = emissive + additive sprite), frameloop='demand'→'always' only while pinned, dispose on unmount, poster shown until canvas first frame (no CLS) |

### 04 Bytes Signature
| | |
|---|---|
| Trigger | ScrollTrigger at section top 70%, play once (not scrubbed — natural draw feels handwritten) |
| Start → End | stroke-dashoffset 100%→0 over 1.1s power2.inOut; bloom = duplicated path, wider stroke, blur pre-baked in SVG gaussian on the duplicate only (small element, cheap); trailing fade via second dash tween; then "ENGINEERED WITH INTENT" mono label fades up 0.6s |
| Mobile | Same, 0.9s |
| Reduced motion | Signature rendered complete, label visible |
| Perf risk | Low. Single small SVG; blur filter on ~300×120px element only |

### 05 Capability Story (Tier 1)
| | |
|---|---|
| Trigger | Desktop: pin `+=500%` (6 chapters ≈ 83% each), scrub 0.6 |
| Start | Chapter 01 active; BytesCore (CSS-3D/SVG) in right column; progress rail 01/06 |
| Per-chapter | Text block: out y −24/opacity (0.35) → in y 24→0 (0.5); Core morphs (clip-path/rotation/gradient state per capability, 0.6 power3.inOut); UI panel swaps (scale 0.96→1 + fade); background geometry line-set crossfades; index + progress rail update |
| End | Chapter 06 → Core condenses to a dot that slides toward Product Systems |
| Tablet | Pin `+=350%`, simplified Core states |
| Mobile | **No pin.** Vertical chapter cards (number, title, copy, mini-asset, link), 0.5s reveal each; Core appears once as static header art |
| Reduced motion | All six chapters stacked visible, opacity reveals |
| Perf risk | Medium. Text swaps are transform/opacity; Core morph uses CSS transforms + gradient crossfade (two layered elements), no SVG filter morphing |

### 06 Product Systems (Tier 2)
| | |
|---|---|
| Trigger | Pin `+=200%` desktop, scrub 0.6 |
| Start → End | State A Byte Bots: conversation network (SVG nodes + message cards float in, waveform line animates via dash) → scroll crossfade 0.5 center-pivot → State B Byte Suites: same cards re-grid into dashboard modules (FLIP-style transform to precomputed grid positions) |
| Hover | Panels tilt ≤3°, translate ≤12px |
| Mobile | Two stacked sub-sections (Bots then Suites), swipeable panel row, no pin |
| Reduced motion | Both states shown stacked |
| Perf risk | Low-medium. ~12 absolutely-positioned cards, transforms only |

### 07 Project Rail (Tier 1)
| | |
|---|---|
| Trigger | Desktop: pin, horizontal `x: -(trackWidth - vw)`, scrub 0.8, `invalidateOnRefresh` |
| Cards | Enter with alternating y offsets ±40px and rotation ±2° settling to 0 (per-card ScrollTrigger `containerAnimation`); metadata column fixed left; cursor-follow "VISIT →" label (pointer-fine only, lerp 0.12); hover: media translate ≤16px, tilt ≤4° |
| Mobile | **Native `overflow-x` + scroll-snap-x mandatory**; no hijack; cards 85vw; links directly tappable |
| Reduced motion | Static horizontal scroll region (native), no entrance rotation |
| Perf risk | Medium. Pinned horizontal is well-trodden GSAP; images sized/lazy; no parallax inside cards on tablet |

### 08 Industry Stage (Tier 2)
| | |
|---|---|
| Trigger | Desktop: sticky center media (position: sticky, no pin), industries advance via ScrollTriggers on invisible step blocks |
| Per-step | Media crossfade + scale 1.04→1 (0.6); keyword field: 8–10 words shift opacity 0.08→0.35, active keywords 0.7 (transform-free, opacity only); copy swap y 16 (0.45); index counter increments |
| Mobile | Stacked: image + short copy per industry, no sticky, no keyword cloud |
| Reduced motion | Stacked list with fades |
| Perf risk | Low. position:sticky (no pin spacer), opacity-only keyword animation |

### 09 Process Network (Tier 2)
| | |
|---|---|
| Trigger | Scrub over section height (no pin); SVG path stroke-dashoffset draws with scroll |
| Per-node | When line reaches node: node dot scale 0→1 (0.3), wireframe annotations fade (0.4), step copy reveals y 20 (0.5); fine polygon connectors draw between completed nodes; node 05 resolves into Bytes mark (crossfade) |
| Mobile | Vertical line variant (same SVG technique, simpler path), steps stacked |
| Reduced motion | Full line rendered; steps opacity-reveal on scroll into view |
| Perf risk | Low. Single SVG, dash animation is GPU-cheap; no WebGL |

### 10 About + Proof
| | |
|---|---|
| Trigger | IntersectionObserver reveals (no pin, no scrub) — deliberately the calmest section |
| Metrics | Count 2+/300+/90+ over 0.8s, once, starting at ~60% of value (no zero-start delay); values server-rendered so visible without JS |
| Pull quote | SplitText-style line reveal 0.7s stagger 0.06 |
| Reduced motion | Final values static, fades only |
| Perf risk | Minimal |

### 11 Client Network
| | |
|---|---|
| Trigger | On visible: 2 marquee lanes (desktop) opposite directions, 60s/75s linear, CSS animation |
| Hover | Lane pauses (animation-play-state), logo monochrome→color 0.3s |
| A11y | Duplicate copies `aria-hidden`; semantic `<ul>` (visually-hidden or grid) carries the real list; reduced motion → static wrapped grid |
| Mobile | One slow lane or static grid |
| Perf risk | Low. CSS transform loop, `contain: content` |

### 12 Bytes Field Notes (Tier 2)
| | |
|---|---|
| Trigger | Desktop: cards stack on scroll — each card sticky at top offset, previous card scales 0.96 + darkens as next overlaps (scrub 0.5) |
| Card micro | Hover: blue hairline + stamp rotates −2°, 0.3s; rotation baseline ±1.5° per card settling to 0 on stack |
| Mobile | Simple vertical cards, no rotation, no stacking |
| Reduced motion | Plain list, fades |
| Perf risk | Low-medium. position:sticky stacking; paper texture = single tiled asset, no filters |

### 13 Final CTA
| | |
|---|---|
| Trigger | Background BUILD WHAT'S NEXT ×3 rows: scrub-driven counter-directional x drift ±6%; foreground content reveals 0.8s |
| Magnetic CTA | Pointer within 120px: button translates toward cursor, clamped ≤14px, lerp 0.15, returns on leave; border blue signal sweep (dash rotation 4s slow); keyboard focus = full ring, no movement; touch = none |
| Floating object | CSS-3D capsule, pointer parallax ≤8px, slow idle float 6s |
| Reduced motion | Static type, static button (sweep off) |
| Perf risk | Low. Three text rows transform-only; text rendered once (no filter) |

### 14 Contact
| | |
|---|---|
| Trigger | Reveal 0.6s on view; form fields: label float + 2px focus ring 0.2s; inline errors slide-down 0.25s + aria-live |
| Constraint | No animation blocks input; submit states (Send → Sending… → success/error) as today, restyled |
| Reduced motion | Fades only |
| Perf risk | Minimal |

### 15 Footer Loop
| | |
|---|---|
| Trigger | Scrub over footer top: wireframe city (SVG, reduced hero silhouette) draws, then collapses toward logo (scale/opacity per building group, stagger 0.05); faint signature redraws 0.8s once |
| RETURN TO SYSTEM | Button → `lenis.scrollTo(0, { duration: 1.4, easing: expo })`; focus moves to top skip-link target (a11y) |
| Mobile | Static wireframe, standard footer |
| Reduced motion | Static; RETURN TO SYSTEM = instant jump |
| Perf risk | Low. SVG, transforms only |

### Polygon / Data field (cross-cutting, hero + sparse reuse)
- Canvas 2D, 40–60 nodes, connect nearest ≤3 within 140px, line opacity ≤0.18; pointer displaces nodes ≤12px (lerp); scroll direction adds ±4px drift; occasional convergence pulse toward Core (every ~14s).
- Runs only while its section is on screen (IO-gated rAF); DPR capped 1.5; touch: no pointer response; reduced motion: static frame drawn once.
- Never rendered behind body copy at reading contrast.
