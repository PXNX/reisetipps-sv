# Bodensee Guide (reisetipps.sv)

A small, offline-capable travel guide for the Lake Constance region. Built with SvelteKit,
Tailwind/daisyUI and Paraglide; the web app is a static site.

## Develop

Everything uses [Bun](https://bun.sh):

```sh
bun install
bun run dev
```

Other useful commands:

```sh
bun run check        # Svelte + TypeScript diagnostics
bun lint             # Bun's built-in lint for JS/TS
bun fmt              # Bun's built-in formatter (uses the Prettier config)
bun run lint:strict  # Prettier + ESLint, including .svelte files
bun run test         # Vitest unit tests
bun run i18n:compile # Regenerate messages after editing messages/*.json
```

`bun run lint` is intentionally not a package script, so `bun lint` and `bun fmt` use Bun's
built-in tools. The stricter Prettier/ESLint pair remains available as `lint:strict`.

## Project layout

```
src/
├── routes/                 # SvelteKit routes: map screen, privacy, redirects, error pages
│   ├── +page.svelte        # the single full-screen map view
│   ├── +layout.svelte      # floating header, shared sheets
│   ├── +error.svelte       # localised, themed error view
│   └── layout.css          # theme, type scale, motion and focus styles
├── lib/
│   ├── components/
│   │   ├── map/            # Leaflet map and layer switcher
│   │   ├── places/         # place card and zoomable photo gallery
│   │   └── sheets/         # bottom sheets (filters, lists, tour, settings, install, updates)
│   ├── data/
│   │   ├── locations.ts    # the place entries only
│   │   └── types.ts        # shared types, stations and map links
│   ├── stores/             # localStorage-backed wishlist, tour, filters, text size
│   ├── assets/             # logo and favicon source SVGs
│   └── paraglide/          # generated i18n output (do not edit)
├── error.html              # standalone fallback for the static adapter
└── app.html                # document shell and meta tags

messages/                   # German and English source strings
project.inlang/             # inlang / Paraglide configuration
static/images/locations/    # photos grouped by category: <category>/<place-id>-<n>.jpg
docs/                       # design, accessibility and content research notes
```

Add a photo by dropping it into `static/images/locations/<category>/<place-id>-<n>.jpg` and
referencing that path from `src/lib/data/locations.ts`, including alt text and attribution in the
entry.

## Deploy

Deployment is handled by Vercel and needs no manual step:

1. Push to `main` — Vercel builds and publishes the site automatically.
2. `vercel.json` pins the SvelteKit framework, the Bun install (`bun install --frozen-lockfile`),
   `bun run build` and the static output directory `build`. Pretty URLs are on and trailing
   slashes are off, so localized paths stay clean.
3. Web Analytics is cookieless; enable it for the project in Vercel. No environment variables are
   needed for the app itself.

Local check before pushing:

```sh
bun run check && bun run test && bun run build
```
