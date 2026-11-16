import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		Icons({ compiler: 'svelte', autoInstall: false }),
		sveltekit({
			// Absolute URLs: the service worker then registers at /sw.js with scope / from every
			// page, instead of a path relative to the current URL.
			paths: { relative: false },
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			strategy: ['url', 'baseLocale']
		}),

		SvelteKitPWA({
			registerType: 'prompt',
			manifest: {
				id: '/',
				name: 'Bodensee Guide',
				short_name: 'Bodensee',
				description: 'Persönliche Empfehlungen rund um den Bodensee – für unterwegs, auch offline.',
				lang: 'de',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#0b1f33',
				background_color: '#0b1f33',
				icons: [
					{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{
						src: '/icons/maskable-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
				runtimeCaching: [
					{
						// Map tiles change rarely. A generous, bounded cache keeps panning fast and
						// lets the map work offline once an area has been visited.
						urlPattern: /^https:\/\/[a-z]\.tile\.openstreetmap\.org\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'map-tiles-standard',
							expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 90 },
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						urlPattern: /^https:\/\/[a-z]\.tile\.opentopomap\.org\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'map-tiles-terrain',
							expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 90 },
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						urlPattern: /^https:\/\/tileserver\.memomaps\.de\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'map-tiles-transit',
							expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 90 },
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'location-photos',
							expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 90 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			},
			devOptions: { enabled: false }
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
