# Herbario Vivo

A Vue 3 + TypeScript portfolio project — a bilingual (ES/EN) botanical reference for indoor plants, backed by the [Perenual](https://perenual.com/docs/api) plant API: a searchable catalog, per-species care guides, a pest & disease field guide, and a personal "My Garden" watering tracker. Visual design implemented from a Claude Design handoff.

## Features

- **Home** — an animated hero, a featured-specimens grid, and an "how it works" section linking to every module.
- **Catalog** — search 10,000+ species by name, filter by sunlight, watering, life cycle, USDA hardiness zone, indoor/edible/toxic.
- **Plant detail** — botanical profile (family, origin, description), care stats (watering/light/maintenance/growth meters), a full attributes grid, a hardiness-zone bar, and an accordion care guide — plus a "My Garden" toggle.
- **Guides** — a searchable directory of popular houseplants with a real, live care guide per species (watering, sunlight, soil, pruning), falling back to a composed guide when Perenual has none for that species.
- **Pests** — a searchable field guide to common houseplant pests and diseases, with host plants and treatment.
- **My Garden** — save plants locally and get a watering countdown (today / overdue / in N days) computed from each species' own watering benchmark.
- A "live data" / "sample data" badge on the Catalog and Pests screens, since Perenual's free tier is rate-limited and every list gracefully falls back to a curated offline dataset if the API is unreachable or exhausted for the day.

## Stack

Vue 3 (Composition API, `<script setup>`) + TypeScript + Tailwind CSS v4 + Vue Router + Pinia + Axios, organized as **Clean Architecture + feature-first**: each feature under `src/features/<name>/` has its own `domain/` (entities, repository interfaces, pure logic), `infrastructure/` (concrete Perenual API clients + the curated fallback dataset), and `presentation/` (Pinia stores, components, views) layers. See [CLAUDE.md](CLAUDE.md) for the full architectural rationale, including a real ID-collision bug found and fixed during development.

Data comes from the [Perenual API](https://perenual.com/docs/api) (species list/details, care guides, pest & disease list).

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_PERENUAL_API_KEY to your own key from https://perenual.com/docs/api
npm run dev
```

Perenual's free tier is limited to 100 requests/day per key — the app falls back to a curated offline dataset automatically once that's exhausted, so the UI never breaks, it just stops showing the "live data" badge.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then build for production
- `npm run preview` — serve the production build locally

## Project structure

```
src/
  app entry: main.ts, App.vue
  router/               # one route per screen
  shared/
    config/              # env (Perenual API key)
    lib/                  # axios instance, format/data-source helpers, parallax composable
    i18n/                  # ES/EN dictionaries + useLanguage() singleton
    directives/             # v-reveal (scroll fade-up)
    ui/                      # LoadingSkeleton, EmptyState, SourceBadge
    layout/                   # AppNav (scroll-aware), AppFooter
  features/
    plants/                     # catalog + detail: domain/infrastructure/presentation
    care-guides/                  # Guías tab: live care-guide fetch with composed fallback
    pests/                          # Plagas tab
    garden/                          # Mi Jardín (localStorage-backed)
    home/                              # landing page
```

See [CLAUDE.md](CLAUDE.md) for a deeper architectural walkthrough and Perenual-specific caveats.
