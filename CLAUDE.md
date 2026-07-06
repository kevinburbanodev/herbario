# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-checks (`vue-tsc -b`) then builds for production; both steps must pass
- `npm run preview` — serve the production build locally

Type checking is the only automated correctness check — no test runner, no ESLint, no Prettier (matches every other project in this portfolio).

## Environment

`VITE_PERENUAL_API_KEY` (see `.env.example`) is read in `src/shared/config/env.ts` and injected into every Perenual request by an axios interceptor in `src/shared/lib/http.ts`. Unlike OpenF1 (see `openf1-dashboard`), Perenual requires a key for every endpoint — there's no working anonymous fallback, only the curated offline dataset (see below).

## Architecture: Clean Architecture + feature-first

Each feature under `src/features/<name>/` is split into three layers:

- **`domain/`** — framework-free TypeScript: entities, a repository interface, and pure logic (`plants/domain/plant-metrics.ts` for watering/sunlight level math, `plants/domain/care-guide.ts` for the composed-guide fallback, `garden/domain/garden-schedule.ts` for the watering countdown). Domain code never imports Vue, Pinia or axios.
- **`infrastructure/`** — concrete repository implementations that call Perenual via axios and map its wire format (snake_case, inconsistent field shapes) to the domain entity shape (camelCase). Also holds the curated fallback datasets (`plants/infrastructure/curated-plants.data.ts`, `pests/infrastructure/curated-diseases.data.ts`).
- **`presentation/`** — Pinia stores (not composables-with-local-refs — see the F1 dashboard's CLAUDE.md for why this portfolio's rate-limited-API projects use real Pinia stores instead of the space-explorer pattern) plus the components/views that consume them.

`garden/` is the one feature whose "API" is `localStorage`, not Perenual — its `infrastructure/local-storage-garden.repository.ts` implements the same `GardenRepository` interface shape any other persistence layer would, which is the point of the port/adapter split: swapping to a real backend later only touches that one file.

## Perenual API caveats

- **Every request needs `?key=...`** — there is no anonymous or demo-key tier like OpenF1/NASA. The free tier is capped at **100 requests/day per key**, visible in the `X-RateLimit-Remaining` response header. Budget for this during development: a single Catalog search + Detail view + Guide fetch is 3 requests; don't loop live requests while testing (e.g. don't script "fetch all 18 curated plants' live detail" — that alone is nearly a fifth of a day's quota).
- **CORS works fine** (`Access-Control-Allow-Origin: *`) — confirmed with a real key via curl before building anything. The API can be called directly from the browser; no proxy needed.
- **Comparison-style query filters do NOT apply here** — that was OpenF1's quirk (`date>=...` as a literal query key). Perenual's `species-list` filters are ordinary query params (`sunlight`, `watering`, `cycle`, `hardiness`, `indoor`, `edible`, `poisonous`, `q`), sent via axios's normal `params` option in `perenual-plant.repository.ts` — don't port OpenF1's hand-built query-string logic here, it isn't needed.
- **`watering_general_benchmark.value` sometimes comes back with literal embedded quote characters**, e.g. `{"value": "\"7-10\"", "unit": "days"}` — a data quirk on Perenual's side, confirmed live via curl against `/v2/species/details/3`. `wateringBenchmarkOf()` in `perenual-plant.repository.ts` strips leading/trailing `"` before display. If a watering benchmark ever renders with stray quote marks again, this is why — don't "fix" it by escaping quotes elsewhere.
- **`species-care-guide-list?species_id=` is a real, live endpoint** (confirmed via curl) that most of the mockup's design assumed didn't exist — the original Claude Design prototype only ever composed a fake care guide client-side from the species' own attributes. This app prefers the **real** live guide when Perenual has one for that species (most don't), falling back to the composed guide (`plants/domain/care-guide.ts`) only when the live endpoint returns nothing. This is a deliberate upgrade over the mockup, not a fidelity gap — see `care-guides/infrastructure/perenual-care-guides.repository.ts`.
- **The `championship_drivers`-style "does the real field match the mockup's assumption" mistake almost happened here too** — the original prototype's `careGuide()` fallback text pattern was verified as genuinely needed (most species really do have no live guide entry) rather than assumed.

## The curated-dataset ID collision bug (read before touching `curated-plants.data.ts`)

The Claude Design mockup's fallback dataset (`data.js`) used made-up sequential IDs (`155`, `721`, `3`, `200`, …) for its 18 curated houseplants, purely as placeholder identifiers — the mockup's author apparently never tested it against a real, working Perenual key, because those numbers collide with **real, unrelated Perenual species**. With a genuinely live key (this project has one), `getDetail(155)` doesn't fail and fall back to the curated "Monstera Deliciosa" — it succeeds and returns real species #155, which is **"Bowhall Red Maple"**. This surfaced as a visible bug during development: the Guides sidebar listed "Monstera Deliciosa" but clicking it opened an article for a maple tree.

The fix in `plants/infrastructure/curated-plants.data.ts`: every curated plant's `id` was replaced with either **(a)** the real Perenual ID for that exact species (looked up live via `species-list?q=<name>`, e.g. Monstera deliciosa → `5257`, Golden Pothos → `2773`), so a live fetch by that ID returns the *correct*, matching plant — or **(b)** for the two species Perenual doesn't carry at all (Chinese Money Plant, Calathea Orbifolia), a safe, out-of-range fake ID (`900001`, `900002`) picked specifically because real Perenual IDs top out in the low thousands, guaranteeing a live fetch 404s/empties and cleanly falls through to the curated data instead of accidentally matching something else.

**Never add a curated plant with an arbitrary/made-up ID again without either verifying it against a live `species-list?q=` lookup or using a deliberately out-of-range placeholder (900000+).** This dataset backs three call sites that all assume `id` round-trips correctly through a live `getDetail(id)` call: Home's featured grid, the Guides sidebar, and Catalog's fallback-search results — a colliding ID breaks all three simultaneously in a way that's easy to miss (the sidebar label and the fetched detail just silently disagree).

## Design system

This UI was implemented from a Claude Design handoff (`Herbario.dc.html`) — treat `src/style.css` as the source of truth for tokens.

- **Colors**: `paper`/`card` (backgrounds), `ink` (primary text), `forest`/`forest-dark`/`moss`/`sage` (green accent scale, darkest → lightest), `clay` (warning/toxic/pest accent), `gold` (sample-data dot), `line` (borders) — declared in `src/style.css` under `@theme` (Tailwind v4 CSS-first config, no `tailwind.config.js`).
- **Fonts**: `font-display` (DM Serif Display — big headings) / `font-serif` (Newsreader — body text, italicized for scientific names) / `font-mono` (Space Mono — kickers, labels, badges), loaded via a Google Fonts `<link>` in `index.html`.
- **Scroll-reveal**: `v-reveal` (`src/shared/directives/reveal.ts`), a global custom directive registered in `main.ts`, reproduces the mockup's `data-reveal` + IntersectionObserver fade-up — apply it to any element that should animate in on scroll rather than duplicating the observer logic per component.
- **Parallax hero blobs**: `useParallax()` (`src/shared/lib/parallax.ts`) nudges every `[data-parallax-depth]` element opposite the cursor, scaled by its own depth attribute — used only in `HomeView.vue`.
- **Grain texture**: `.grain-overlay` in `style.css`, mounted once in `App.vue`, a fixed `pointer-events: none` radial-dot background with a slow drift animation, matching the mockup's paper-grain texture.

## Internationalization

`src/shared/i18n/translations.ts` (a `Dictionary` interface + `es`/`en` dictionaries) and `src/shared/i18n/language.ts` (`useLanguage()` — a module-level singleton `ref`, not Pinia, matching `space-explorer`'s i18n pattern) provide the ES/EN toggle in `AppNav`, defaulting to Spanish (this app's primary audience) and persisted to `localStorage`. Covers all UI chrome, tag labels, and the composed care-guide fallback text (which is genuinely bilingual, not just English like the mockup's fixed English sentences). **What stays English-only:** live Perenual API content (descriptions, care guide sections, pest descriptions/treatments) — Perenual has no language parameter, same caveat as OpenF1/NASA in this portfolio's other projects.

## Routing

Six routes, statically imported in `src/router/index.ts`: `/` (home), `/catalog`, `/plants/:id` (detail), `/guides`, `/pests`, `/garden`. `App.vue` wraps `<RouterView>` in a `<Transition name="fade" mode="out-in">` — every route view has a single root element (a requirement for that transition mode; see `space-explorer/CLAUDE.md` for the blank-page failure mode if this is ever violated). Routes are **not** rate-limit-sensitive to cross-navigation the way `openf1-dashboard`'s tabs are (each screen's data is independent, not a shared session), so plain Pinia stores per feature (rather than a cross-feature composition root in `App.vue`) are sufficient here — there's no `App.vue`-level orchestration like the F1 dashboard's session/driver wiring.
