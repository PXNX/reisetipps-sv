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

`bun run lint` and `bun fmt` are intentionally not package scripts, so the built-in Bun
commands are used. The stricter Prettier/ESLint pair remains available as `lint:strict`.

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
