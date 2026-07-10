# Bytes Platform — Homepage Revamp Master Plan

**Concept: BYTES // DIGITAL INFRASTRUCTURE IN MOTION**
Status: PLANNING — no production code has been modified. Awaiting `APPROVED — START IMPLEMENTATION`.

Companion documents:
- `docs/homepage-reference-matrix.md` — reference-site research (live browser inspection)
- `docs/homepage-motion-spec.md` — per-section animation map
- `docs/homepage-asset-manifest.md` — asset reuse / recreate / create plan

---

## A. Repository Audit

### Stack
| Item | Finding |
|---|---|
| Framework | Next.js **16.1.6**, App Router, `src/` layout |
| React | **19.1** |
| Language | TypeScript (strict, but `ignoreBuildErrors: true` — type errors never block builds) |
| Styling | **Tailwind v4** (`@tailwindcss/postcss`) with a leftover **v3-style `tailwind.config.ts`** still present; `globals.css` uses v4 syntax |
| Animation libs (already installed) | **GSAP 3.13 + @gsap/react**, **Lenis 1.3.4**, **Framer Motion 12**, **@react-three/fiber 9 + drei + postprocessing**, **three 0.177**, **tsparticles**, lottie-react, maath |
| State | Jotai (installed; light use) |
| CMS | Sanity (`@sanity/client`, project `y08r07g3`) — **blogs only**; hybrid model: Sanity posts merged with a 138KB static `getBlogs.ts` |
| Fonts | next/font: Inter (`--font-sans`), Calistoga (`--font-serif`); plus **render-blocking remote @imports** in globals.css (Poppins, Bebas Neue, League Spartan, Discrdive-3D, Goldrops); portfolio route has local Geist |
| Images | next/image; remotePatterns for Sanity + Unsplash; AVIF/WebP; SVGR for svg imports |
| Analytics | GTM `GTM-MNW4L2XD` (afterInteractive + noscript) |
| Email | **EmailJS client-side** (CDN script injected in root layout, `service_9hdv3nu` / `template_3k5amts`) — no API route |
| API routes | Only `/api/revalidate` (Sanity webhook → revalidates `/blogs`, `/blogs/[...slug]`, `/`) |
| SEO | Homepage metadata in root `layout.tsx`; JSON-LD (Organization/LocalBusiness + FAQPage) in `page.tsx`; next-sitemap with hardcoded blog/product paths in config |
| Package manager | Both lockfiles committed; **npm is authoritative** in this working tree (package-lock.json + node_modules regenerated together) |
| Tests | **None** (no jest/vitest/cypress/playwright in repo). Playwright 1.61 available on the machine (Python) — used for audit/QA |
| Build | `next build` with 6GB heap, `cpus: 1`, workerThreads off; `postbuild` next-sitemap |

### Key files
- Homepage: `src/app/page.tsx` (client component; lazy-loads all sections below hero)
- Global layout: `src/app/layout.tsx` (fonts, metadata, GTM, EmailJS, LenisProvider, PageLoader, ConditionalFooter)
- Sections: `src/sections/` — Hero, ByteBot, serviceHead, CardsSection/Card, LineAnimationSection, numbers, Projects, brands, Contact, Navbar, Footer, LoadingPage
- Infra components: `src/components/` — LenisProvider, PageLoader, ScrollToTop, ConditionalFooter, GTM, OptimizedImage, FlowerBytesAnimation (R3F "bytes" wordmark), TextAnimation, TextFlip

### Technical constraints & existing weaknesses
1. **Lenis is NOT synced to GSAP ScrollTrigger** — no `lenis.on('scroll', ScrollTrigger.update)`, no ticker integration. Current pinned sections work by luck/native scroll. Must be fixed in foundations before any new scroll choreography.
2. **Global loader on every route change** with an effective ~4s+ floor (3s SVG animation + 1s minimum display; 15s fallback). Must be redesigned into a fast, one-time system boot.
3. **Heavy media**: `public/assets` = 194MB. Worst offenders: `Videos/About-Video.mp4` 23MB, `bytes-bot/robotF.gif` 16MB, `newimages/binary_loop.gif` 11MB, `favicon.png` 2MB. (Homepage itself loads multi-MB PNG hero images.)
4. **Fragmented animation approaches**: hand-rolled rAF scroll listeners (Hero, ByteBot, numbers), GSAP (cards, line section, navbar), framer-motion (serviceHead), R3F (FlowerBytes) — no shared motion system, duplicated `window.innerWidth <= 768` checks everywhere, no central reduced-motion handling (only portfolio + 2 sections respect it).
5. **Tailwind v4/v3 config split**; tokens reference undefined font vars (`--font-heading/body/mono/syne`).
6. Homepage is fully client-rendered (`'use client'` at page level) — no server component boundary; all copy still crawlable but hydration cost is high.
7. FAQPage JSON-LD without visible matching FAQ content (Google compliance gap, flagged in code comments).
8. `/services` index and `/technologies` inherit the homepage title/description (SEO gap).
9. Render-blocking font @imports in globals.css.
10. Both lockfiles committed (npm vs pnpm drift hazard).
11. Dead code: ByteBot `CycleText`, commented-out BookSection, empty card titles.

---

## B. Current Content Inventory

Render order today: Navbar → Hero → ByteBots → "Our Services" → 4 flip cards → About (R3F wordmark + word-fade) → Numbers → Staging Room carousel → Past Clients marquee → Contact → Footer (global).

### RETAIN (verbatim facts — must not silently disappear)
| Item | Value | Source |
|---|---|---|
| Positioning | "Full Stack Digital Power House" | Hero.tsx |
| Cycling capabilities | CRM, AI, websites, SEO, apps, marketing, chatbots | TextFlip |
| Products | Byte Bots (`/products/byte-bots`), Byte Suites (`/products/byte-suites`) | ByteBot.tsx, Navbar, Footer |
| Services | Web (`/services/web`), SEO (`/services/seo`), App (`/services/app`), Marketing (`/services/marketing`), Advanced Services (`/services/advanced-services`) | CardsSection |
| Metrics | **2+** Years of Continual Excellence · **300+** Successful Projects Deployed · **90+** Employees | numbers.tsx |
| Staging projects | bytes-test-2/3/5/6.com + preview webps; carousel disclaimer about domain churn | Projects.tsx |
| Client logos | 19 logos (brand1–brand19) with outbound links (aayobami, efatabglobal, cadplusllc, 5dccs, fairpathconsultants, oxypam, jobcosupply, gebionline, ecswealth, lampadosfinancial, feverdots, ontophomeservices, keltektool, paradisecopters, safetravelcharters, bytes-test-2, regal-arms, exfoleez, thelabco) | brands.tsx |
| Contact | Bytes Platform LLC, 2809 Joshua Street, Denton, Texas, US · info@bytesplatform.com · 833-323-0371 (Toll Free) | Contact.tsx / Footer.tsx / JSON-LD ✓ consistent |
| Socials | Facebook `share/1Kc3xtzhqa`, Instagram `bytesplatform`, LinkedIn `company/bytebloom-solutionss` | Contact/Footer/JSON-LD |
| Form | name / email (regex) / phone (US 10-digit regex) / message → EmailJS; Send/Sending states; success/error messages | Contact.tsx |
| Nav routes | Home, About, Services (5), Products (2), Industries, Insights→(Careers, Blogs), Contact + legal (privacy/terms/refund) | Navbar.tsx |
| About copy facts | custom websites, apps, SEO, marketing, chatbots, ERP/CRM; strategy→launch; end-to-end | TextAnimation.tsx |
| JSON-LD | Organization/LocalBusiness + FAQPage (7 Q&As) | page.tsx |
| Footer credit | "Developed by Bytes Platform Inc." | Footer.tsx |

### REWRITE (same facts, premium tone — per brief §7–§20)
- Hero H1/subtitle → "We build digital systems that think, adapt and scale."
- ByteBots copy → "Human conversations. Automated at scale."
- "Our Services" + flip-card bullets → six-chapter Capability Story
- About paragraph → "Not another vendor. An embedded digital team."
- Numbers heading → quieter editorial framing
- Staging Room copy → "Work in motion. Built in the open." (keep the domain-churn honesty note)
- Brands heading → "TRUSTED ACROSS INDUSTRIES"
- Contact intro → tightened

### REGROUP
- Services flip-cards + ByteBots split → Capability Story (6 chapters) + a dedicated two-state Product Systems section (Bots ↔ Suites)
- Numbers merges into About/Proof section
- Industries gets its own homepage section (currently only a nav link → `/industries`; source industry list from that page's data)
- Blogs surface on the homepage for the first time (Bytes Field Notes; hybrid Sanity + static source already exists)
- FAQ: render a compact visible FAQ (footer-adjacent accordion) to make FAQPage JSON-LD compliant — or drop the JSON-LD; recommend rendering it

### VERIFY WITH BUSINESS (flagged, not invented)
- "90+ Employees" vs brief's "90+ Team Members" (label wording only; value confirmed in code)
- LinkedIn slug `bytebloom-solutionss` (legacy name — intentional?)
- Staging project display names ("Bytes Test Domain 2" → nicer labels; URLs unchanged)
- Whether any real client project screenshots may be shown beyond the 4 staging previews
- Byte Bots / Byte Suites UI screenshots availability for product panels
- Phone tel: href inconsistency (`tel:18333230371` vs `tel:8333230371`) — normalize to `tel:+18333230371`

---

## C. Reference Matrix
See `docs/homepage-reference-matrix.md` (live Playwright inspection at 1440×900 and 390×844 with staged scroll captures; any site that could not be loaded is explicitly flagged there).

---

## D. Moodboard Direction

**Brand concept.** One connected digital ecosystem: the visitor *enters* the Bytes system at the hero (Byte City), travels through its layers (capabilities → products → live work → industries → process), and exits through the footer where the city collapses back into the Bytes mark — a loop, not a scroll.

**Color system** (new tokens; audited against existing brand blues `#010a14` body, `#01084E` ByteBots navy, `#00ece2` cyan accent, `#020b72` gradient blue):

```css
--bytes-ink:      #02050C;  /* deepest environment */
--bytes-midnight: #071426;  /* primary dark surface (evolves current #010a14) */
--bytes-navy:     #0C1D36;  /* raised dark surface */
--bytes-graphite: #111A29;  /* card-on-dark */
--bytes-blue:     #2F6BFF;  /* primary accent (evolves #020b72) */
--bytes-signal:   #4C92FF;  /* active/hover accent */
--bytes-cyan:     #72DAFF;  /* supporting signal only (calms #00ece2) */
--bytes-ice:      #F2F7FC;  /* light architectural sections */
--bytes-steel:    #B9C7D8;  /* secondary text on dark */
--bytes-white:    #FFFFFF;
--bytes-line:     rgba(111,167,255,0.18);  /* hairlines */
--bytes-glass:    rgba(10,24,45,0.58);     /* rare glass surfaces */
```

Deprecated on the homepage: `#F6C324` yellow (TextFlip), `#FF6B35` cta orange, `#915EFF` purple accent, fuchsia/lime metric colors. Environment rhythm: dark (hero/city) → ice (capability/about) → dark (products/projects) → ice (process/insights paper) → dark (CTA/contact/footer), with electric-blue transition moments between.

**Typography.**
- Display: **Instrument Sans** (variable, Google/next-font, free) — engineered grotesk, tight leading, −2% tracking on display sizes. (Alternative if rejected: Geist, already licensed in repo for portfolio.)
- Body: Instrument Sans 400/450.
- Mono: **IBM Plex Mono** (or Geist Mono, already in repo) for section numbers, status labels, coordinates, metadata.
- Retire from homepage: Calistoga, Poppins, Bebas Neue, League Spartan, Discrdive-3D, Goldrops remote imports (kept only where inner routes still need them; remove the render-blocking @imports from the global stylesheet and scope them).
- Handwritten "Bytes" signature: **original hand-drawn SVG path** (single continuous stroke, rounded caps, drawn with stroke-dashoffset; electric blue + soft bloom via layered strokes, not filters). Not a handwriting font; not traced from any reference.

**Material language.** Clay / frosted polymer / ice glass / satin metal. Deep-navy architecture with ice-white tops; electric blue reserved for data (lines, signals, active states). Fine 1px hairlines, subtle film grain (single tiled PNG/SVG overlay at ~4% opacity, no animated noise), technical mono labels (`SYS.01 // CAPABILITY`, coordinates, build status).

**Lighting.** Soft studio key from upper-left in 3D scenes; emissive blue for data lines only; ambient fog (fog color = bg color) for depth; no bloom-heavy neon.

**Image treatment.** Project/product screenshots inside custom browser/device frames on dark; slight desaturation + blue-tinted shadow; grain overlay; no raw drop-shadowed rectangles.

**3D direction.** One R3F canvas for the hero Byte City built from primitives (instanced boxes/extrudes, no external models); the Bytes Core is a rounded icosahedron/superellipsoid that reappears in Capability Story and Final CTA as a lighter CSS/SVG incarnation — the WebGL version lives only in the hero canvas.

---

## E. Final Homepage Section Order

| # | Section | Purpose | Content | CTA | Transition out |
|---|---|---|---|---|---|
| 01 | **SystemLoader** | One-time boot (≤1.2s), sets tone | BYTES wordmark stroke + boot metadata lines | — | Curtain lifts into hero |
| 02 | **PremiumNavigation** | Command bar | Logo · Home/About/Services/Products/Industries/Insights (mega menus) · Book a Free Consultation | `/contact` | Persistent; theme-aware |
| 03 | **Hero — Byte City** | Identity | Eyebrow FULL-STACK DIGITAL POWERHOUSE · H1 "We build digital systems that think, adapt and scale." · body · scroll label | Book a Free Consultation → `/contact`; Explore Our Work → `#work` | Camera rises, scene darkens |
| 04 | **Bytes Signature** | Brand moment | Hand-drawn "Bytes" + ENGINEERED WITH INTENT | — | Signature line becomes the data line feeding §05 |
| 05 | **Capability Story** | Capability | "One partner. Every digital layer." + 6 chapters (AI & Automation / Custom Software & Platforms / Web / Mobile / Search, Marketing & Growth / Integrations & Infrastructure), each linking to its real service/product route | per-chapter "Explore →" | Core condenses, hands off to products |
| 06 | **Product Systems** | Products | Byte Bots ("Human conversations. Automated at scale.") ↔ Byte Suites ("Connected tools for modern operations.") two-state scene | Explore Byte Bots / Explore Byte Suites → real routes | Panels slide off laterally |
| 07 | **Project Rail — Work in Motion** | Proof | "Work in motion. Built in the open." + 4 real staging projects (real URLs) + full-portfolio link | Visit live site (per card); View Portfolio → `/portfolio` | Rail exits; bg shifts |
| 08 | **Industry Stage** | Relevance | "Built for complex businesses, not one-size-fits-all briefs." + industries from `/industries` data + keyword field | Explore Industries → `/industries` | Keywords dissolve into process line |
| 09 | **Process Network** | Method | "From ambition to operating system." + DECODE → ARCHITECT → PROTOTYPE → BUILD → LAUNCH & COMPOUND (SVG line) | — | Final node becomes Bytes mark |
| 10 | **About + Proof** | Trust | "Not another vendor. An embedded digital team." + rewritten about copy + 2+/300+/90+ metrics + Learn More → `/about` | Learn More About Us | Quiet fade |
| 11 | **Client Network** | Trust | TRUSTED ACROSS INDUSTRIES + 19 real logos, marquee lanes + semantic list | — | Lines converge |
| 12 | **Bytes Field Notes** | Thinking | Editorial cards from real hybrid blog data (latest 4–6) | Read → `/blogs/[slug]`; All Notes → `/blogs` | Paper → dark |
| 13 | **Final CTA** | Conversion | BUILD WHAT'S NEXT oversized bg + "Your next system starts with one conversation." | Book a Free Consultation → `/contact` (magnetic, clamped) | Slides into contact |
| 14 | **Contact** | Conversion | Redesigned form (same fields/EmailJS/validation/states) + address/phone/email/socials + compact visible FAQ (satisfies FAQPage JSON-LD) | Send | — |
| 15 | **Footer + Loop** | Loop | All current footer links/legal + wireframe city collapsing into logo + faint signature + RETURN TO SYSTEM (scroll-to-top) | RETURN TO SYSTEM | Loops to top |

Story: Identity → Capability → Products → Proof → Relevance → Process → Trust → Thinking → Conversion. ✓

---

## F. Animation Map
Full per-section spec (trigger/start/end/scroll/desktop/mobile/reduced-motion/perf-risk) in `docs/homepage-motion-spec.md`.

---

## G. Component Architecture

```
src/app/page.tsx  (SERVER component — metadata, JSON-LD, static copy shell)
└─ <HomeClient> boundary only where interaction begins

src/components/home/
  SiteShell.tsx            (client) — MotionProvider + ReducedMotionProvider + SmoothScrollProvider
  providers/
    MotionProvider.tsx     — single gsap.registerPlugin, gsap.matchMedia contexts, cleanup
    ReducedMotionProvider  — one useReducedMotion source of truth (context)
    SmoothScrollProvider   — Lenis + lenis.on('scroll', ScrollTrigger.update) + gsap ticker sync
  nav/
    PremiumNavigation.tsx / DesktopMegaMenu / MobileMenu / SectionProgress / ConsultationCTA
  loader/SystemLoader.tsx
  hero/
    Hero.tsx (semantic copy) / ByteCityScene.tsx (dynamic import, R3F) /
    ByteCityPoster.tsx (static fallback) / PolygonNetwork.tsx (canvas 2D) / HeroScrollIndicator
  signature/BytesSignature.tsx (SVG path, stroke-dash)
  capabilities/
    CapabilityStory.tsx / CapabilityChapter.tsx / BytesCore.tsx (CSS-3D/SVG core) /
    CapabilityUI.tsx (per-chapter panel) / CapabilityProgress.tsx
  products/ProductSystems.tsx / ByteBotsPanel / ByteSuitesPanel
  work/ProjectRail.tsx / ProjectCard / ProjectMedia / CursorLabel
  industries/IndustryStage.tsx / IndustryMedia / KeywordField / IndustryNavigation
  process/ProcessNetwork.tsx / ProcessPath (SVG) / ProcessNode
  about/AboutProof.tsx / Metrics.tsx
  clients/ClientNetwork.tsx
  insights/EditorialInsights.tsx / EditorialCard.tsx
  cta/FinalCTA.tsx
  contact/ContactSection.tsx (ports existing EmailJS logic 1:1) / HomeFAQ.tsx
  footer/PremiumFooter.tsx

src/components/ui/   (reusable primitives)
  SectionHeader, SplitTextReveal, KineticLabel, MagneticButton, GlowButton,
  HoverMedia, GlassPanel, SystemBadge, MonoMetadata, GrainOverlay, GridOverlay,
  PolygonField, DeviceFrame, BrowserFrame, Marquee (a11y-safe), ResponsiveMedia,
  MotionBoundary (per-section gsap.context + cleanup wrapper)

src/data/home.ts     — typed data: capabilities[], products[], projects[], industries[],
                       clients[], metrics[], processSteps[], nav[] (single source of truth,
                       populated ONLY from existing repo content)
src/hooks/useMediaQuery.ts, useReducedMotionPref.ts, usePointerFine.ts
```

Server/client split: `page.tsx` becomes a server component exporting homepage-specific `metadata` (moves it off the root layout) and fetching Field Notes posts server-side via the existing `hybridBlogs` source; each section receives data as props; only motion-bearing components are client. The old `src/sections/*` files remain untouched until cutover, then are removed in a final cleanup commit.

## H. Dependency Recommendation

**Zero new runtime dependencies required.**

| Package | Status | Use |
|---|---|---|
| gsap + @gsap/react | ✅ installed | All scroll choreography (ScrollTrigger is in gsap core dist) |
| lenis | ✅ installed | Smooth scroll — must add ScrollTrigger sync in foundations |
| @react-three/fiber / drei / postprocessing / three / maath | ✅ installed | Hero Byte City only (one canvas). Drei for instances/soft shadows; postprocessing likely **omitted** (bloom faked with emissive + sprite glow — cheaper) |
| framer-motion | ✅ installed | Mega-menu/mobile-menu state transitions only (never on GSAP-owned elements) |
| tsparticles | ✅ installed | **Not used** on new homepage (custom ~60-node canvas polygon field is lighter); left in place for portfolio route |
| lottie-react, jotai, lucide-react, FontAwesome | ✅ installed | Unchanged; homepage won't add new uses of lottie/FA |
| Fonts (Instrument Sans, IBM Plex Mono) | via next/font/google | No package; removes 5 remote CSS @imports |

Not adding: Spline (no asset exists), GSAP club plugins (licensing; SplitText hand-rolled ~30 lines), any particle/3D lib beyond what's installed.

## I. Asset Plan
Full manifest in `docs/homepage-asset-manifest.md`. Summary:
- **Reuse**: bytes-logo.png (re-export as SVG if source exists), 4 staging previews (`/portfolio/bytes-test-*.webp`), 19 brand logos (normalize to monochrome via CSS filter), blog cover images (Sanity/static).
- **Recreate**: hero (procedural Byte City replaces hero-1/2/4 moon/mountain PNGs), card-front.webp retired, numbers cube/backgrounds retired, portfolio_bg retired, bot backgrounds retired.
- **Create**: Bytes signature SVG, Byte City poster (self-captured render, AVIF/WebP), 6 capability SVG/CSS assets, product panel mockups (from real product-page UI or original clean mockups), grain tile, OG image 1200×630, favicon replacement (current is 2MB!).
- **Capture**: fresh Playwright screenshots of the 4 staging URLs for crisper cards (Bytes-owned; verify reachable first).

## J. Performance Plan
- Budgets: LCP ≤ 2.5s (hero H1 text or poster — copy is HTML, LCP not gated on canvas), INP ≤ 200ms, CLS ≤ 0.1; hero JS chunk (R3F+three) lazy, ~<300KB gz, loaded after first paint; total above-fold images <300KB.
- Load order: HTML/critical CSS → fonts (next/font, swap) → hero poster → interactive shell → dynamic-import ByteCityScene (poster crossfades) → below-fold sections lazy via dynamic import + `content-visibility: auto`.
- Canvas: DPR capped (2 desktop-high / 1.5 desktop-avg / 1 mobile), frameloop paused offscreen & after hero scope, instanced geometry, shared materials, no shadow maps, no postprocessing by default, context-loss handler, WebGL-unavailable → poster.
- Mobile: poster + CSS parallax instead of WebGL; no pinned capability sequence (cards/accordion); native overflow-x + scroll-snap project rail.
- Remove: EmailJS CDN script from `<head>` on every page → load on contact-section visibility; render-blocking font @imports; multi-MB hero PNGs.
- Testing: Lighthouse (before/after), Playwright viewport sweep, CPU-throttled trace of pinned sections, slow-network run.

## K. Accessibility Plan
- Landmarks (`header/main/section+aria-labelledby/footer`), one H1, logical H2/H3 order, skip-to-content link.
- Nav: full keyboard support (Tab/Escape/click-outside, focus trap in mobile menu, `aria-expanded`), focus-visible rings (2px `--bytes-signal`).
- Reduced motion (single provider, honored everywhere): no camera travel/pinning; complete states shown; fades only; marquees static (semantic list remains); signature pre-drawn; magnetic/parallax off. Not implemented as duration:0.01.
- Marquee: duplicate lanes `aria-hidden`, one semantic `<ul>` of clients for AT; pause on hover/focus.
- Canvas: `aria-hidden` decorative, all copy in HTML; fallback content inside `<canvas>`.
- Form: visible labels (no placeholder-only), inline errors with `aria-describedby` + `aria-invalid`, success state announced via `role="status"`.
- Contrast: body text ≥ 4.5:1 on both dark and ice surfaces (steel #B9C7D8 on midnight passes; verify every pairing at build time).

## L. Implementation Phases
1. **Foundation** — feature branch off main; design tokens (Tailwind v4 `@theme`), fonts, providers (Lenis↔ScrollTrigger sync, MotionProvider, reduced-motion), ui/ primitives, data/home.ts, keep old page intact; Lighthouse + screenshot baseline recorded.
2. **Nav + Loader** — PremiumNavigation (mega menu, mobile sheet, progress), SystemLoader (fast boot, ≤1.2s, session-once).
3. **Hero + Signature** — semantic copy, PolygonNetwork, ByteCityScene + poster fallback, scroll choreography, BytesSignature.
4. **Capability + Products** — CapabilityStory (6 chapters, sticky desktop / cards mobile), BytesCore, ProductSystems two-state scene.
5. **Work / Industries / Process** — ProjectRail (pinned horizontal desktop, native snap mobile), IndustryStage (data from `/industries`), ProcessNetwork SVG line.
6. **About / Clients / Insights / CTA / Contact / Footer** — AboutProof + metrics, ClientNetwork, EditorialInsights (server-fetched posts), FinalCTA, ContactSection port (EmailJS behavior 1:1) + visible FAQ, PremiumFooter loop; page cutover.
7. **Responsive + A11y + Perf + QA** — full viewport matrix, reduced-motion pass, keyboard pass, Lighthouse tuning, console/network/link checks, form test, final report + screenshots; remove dead sections.

Each phase = separate commits on branch `feat/homepage-revamp`; old homepage preserved until Phase 6 cutover.

## M. Risks & Open Questions

**Risks (managed, not blocking):**
- Lenis↔ScrollTrigger retrofit may affect existing inner pages that use ScrollTrigger (Navbar, cards on other routes) — mitigated by testing all routes in Phase 1.
- Root-layout metadata currently doubles as homepage metadata; moving homepage metadata to `page.tsx` must not break other routes that inherit root metadata (`/services` index, `/technologies`) — they'll get an explicit generic fallback.
- Staging-site screenshots depend on bytes-test-*.com being reachable at capture time; fallback = existing webp previews.
- R3F 9 + React 19 + Next 16 dynamic import of Canvas: verified pattern exists in repo (portfolio HeroCanvas), low risk.

**Open questions (genuinely blocking → answered by default if no reply):**
1. Homepage `<title>` change to "AI, Software & Digital Product Company | Bytes Platform" — approve? (Current: "Digital Marketing Agency | Bytes Platform"; this is a positioning/SEO decision.) *Default if unanswered: keep current title, ship the rest.*
2. May the metric label "Employees" be rendered as "Team Members"? *Default: keep "Employees".*
3. Staging project display names: rename "Bytes Test Domain 2" → e.g. "Staging Build 02 — E-commerce" only if business confirms scopes; otherwise keep current names. *Default: keep names, improve typography only.*
