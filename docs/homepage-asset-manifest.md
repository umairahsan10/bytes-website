# Bytes Homepage — Asset Manifest

Companion to `docs/homepage-revamp-plan.md`. Governs every visual asset for the revamp. Rule: no stock 3D, no reference-site assets, no invented product data.

## 1. Existing assets to REUSE

| Asset | Path | Use in revamp | Action needed |
|---|---|---|---|
| Bytes logo | `public/assets/bytes-logo.png` | Nav, footer, JSON-LD | Request/derive SVG version; PNG fallback kept |
| Staging previews ×4 | `public/portfolio/bytes-test-{2,3,5,6}.webp` | Project Rail cards | Optionally re-capture fresh (below) |
| Client logos ×19 | `public/assets/brands/brand1–19.*` | Client Network | Normalize display size; monochrome default via CSS `filter: grayscale(1) brightness()`; accurate alt text per company |
| Blog covers | Sanity CDN + `public/assets/Blogs/` | Field Notes cards | None (existing hybrid pipeline) |
| Product-page UI | `/products/byte-bots`, `/products/byte-suites` existing visuals | Source material for product panels | Audit in Phase 4; reuse real UI imagery where it exists |

## 2. Assets RETIRED from the homepage (files stay on disk until cleanup commit; other routes may still use some)
- `assets/hero images/hero-1/2/4.png` (+ webp) — replaced by procedural Byte City + poster
- `assets/card-front.webp`, `card-front.jpg` (2.1MB) — flip cards removed
- `assets/numbers/cube.png`, `numbers_bg.png`, `numbers14pro_bg.png` — Numbers section redesigned
- `assets/portfolio_bg.png` — Project Rail has its own environment
- `assets/bytes-bot/bot_bg.webp`, `botm_bg.webp` — Product Systems redesigned
- `assets/hero.jpg` (nav menu layered image) — new menu design

## 3. Assets to CREATE (all original)

| Asset | Format | Spec | Producer |
|---|---|---|---|
| **Bytes signature** | Inline SVG path | Original hand-drawn "Bytes" cursive, single continuous path, rounded caps, ~viewBox 600×220; stroke `--bytes-signal`; duplicate blurred path for bloom | Hand-authored path during Phase 3 (drawn from scratch, NOT traced from any reference, NOT a handwriting font) |
| **Byte City poster** | AVIF + WebP, 1920w/1280w/768w | Still render of the WebGL city (self-captured from our own scene once built); used for mobile, reduced-motion, no-WebGL, and pre-canvas paint | Playwright capture of our own scene |
| **Byte City geometry** | Code (R3F primitives) | 8 capability structures + core, instanced boxes/extrudes, ≤15k tris total, no external models | Code |
| **Bytes Core (2D incarnation)** | SVG + CSS-3D | Rounded geometric core with 6 capability states (gradient + clip morphs) for Capability Story + Final CTA | Code/SVG |
| **Capability chapter assets ×6** | SVG | AI capsule, software block system, web portal frame, mobile device pair, growth signal, integration bridge — clay/frosted-polymer look via layered SVG gradients | Hand-authored SVG |
| **Product panels** | HTML/CSS mockups | Byte Bots conversation cards + Byte Suites dashboard modules; content = generic labels (Inbox, Workflows, Leads) — NO fake metrics presented as factual | Code |
| **Process line** | SVG path | Continuous line, 5 nodes, wireframe annotations, final node = Bytes mark | Hand-authored SVG |
| **Grain tile** | PNG/WebP ≤10KB, 256×256 tile | 4% opacity overlay | Generated once |
| **Grid/blueprint overlay** | CSS gradient or tiny SVG | 1px hairlines | Code |
| **OG / social image** | PNG/WebP 1200×630 | New brand frame + wordmark | Export from poster |
| **Favicon** | ICO/PNG 32/180/512 | Replace current **2MB** favicon.png | Export from logo |

## 4. Assets to CAPTURE (Bytes-owned only)
- Fresh full-width screenshots of `https://bytes-test-2.com`, `bytes-test-3.com`, `bytes-test-5.com`, `bytes-test-6.com` via Playwright (1440w, webp ≤150KB each) — only if reachable at build time; otherwise keep existing webps.
- NO captures from reference websites will be shipped (research only).

## 5. Missing / needs business input
- Logo SVG source file (else vectorize carefully from PNG)
- Real Byte Bots / Byte Suites product screenshots, if marketing has better than the product pages
- Any approved real-client project imagery beyond staging domains

## 6. Optimization ledger (done alongside, not blocking)
- `public/favicon.png` 2MB → proper favicon set (immediate win, zero risk)
- Homepage no longer references: About-Video.mp4 (23MB — was never on home), robotF.gif (16MB, product page), binary_loop.gif (11MB) — flagged for the owning routes; out of scope here but recorded
- All new images: explicit width/height, `sizes`, lazy below fold, priority only for hero poster
