<script lang="ts">
	import { Map as LMap, TileLayer, Marker, DivIcon, ControlZoom, Polyline } from 'sveaflet';
	import type { Map } from 'leaflet';
	import { browser } from '$app/environment';
	import type { Location } from '$lib/data/types';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { fluentImg, locationIconName } from '$lib/icons';
	import { mapTiles as tiles, type MapLayer as Layer } from '$lib/mapTiles';
	import { haversineDistanceKm } from '$lib/geo';
	import { tour } from '$lib/stores/tour.svelte';

	const reducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function pinClass(location: Location): string {
		let className = `map-pin map-pin-${location.categories[0] ?? 'nature'}`;
		if (locationMarks.isVisited(location.id)) className += ' map-pin-visited';
		else if (locationMarks.isWishlisted(location.id)) className += ' map-pin-wishlist';
		if (location.id === highlightId) className += ' map-pin-highlight';
		if (origin && haversineDistanceKm(origin, location.coordinates) < 12) {
			className += ' map-pin-near';
		}
		return className;
	}

	interface Props {
		locations: Location[];
		focusId?: string | null;
		highlightId?: string | null;
		onselect: (location: Location) => void;
		oncenterchange?: (center: [number, number]) => void;
		layer?: Layer;
		origin?: [number, number] | null;
	}
	let {
		locations,
		focusId = null,
		highlightId = null,
		onselect,
		oncenterchange,
		layer = 'standard',
		origin = null
	}: Props = $props();

	let map = $state<Map | undefined>();
	/** The reader's plan becomes a quiet dotted line across the lake. */
	const tourStops = $derived(tour.plan.map((stop) => stop.coordinates));

	const HOME: [number, number] = [47.66, 9.35];
	const HOME_ZOOM = 10;
	let mapOptions = $derived({
		center: HOME,
		zoom: HOME_ZOOM,
		zoomControl: false,
		attributionControl: false,
		// A lighter, longer glide after a flick so panning feels quick rather than heavy.
		inertiaDeceleration: 2200,
		easeLinearity: 0.3,
		// Faster mouse-wheel and trackpad zoom.
		wheelPxPerZoomLevel: 90,
		wheelDebounceTime: 20
	});

	// Focus changes come from search, the list and the wishlist. Fly there gently instead of
	// jumping, and keep enough of the map visible above the sheet once it opens.
	$effect(() => {
		const id = focusId;
		if (!map || !id) return;
		const target = locations.find((location) => location.id === id);
		if (!target) return;
		if (reducedMotion) map.panTo(target.coordinates);
		else map.flyTo(target.coordinates, Math.max(map.getZoom(), 13), { duration: 0.9 });
	});

	function reportMove(event: { target: Map }) {
		const center = event.target.getCenter();
		oncenterchange?.([center.lat, center.lng]);
	}
</script>

<div class="relative h-full w-full touch-none">
	{#if browser}
		<LMap options={mapOptions} bind:instance={map} onmoveend={reportMove}>
			<!-- Touch screens pinch to zoom; the buttons only show for a mouse (see the CSS below).
			     Map credits live in Settings, so the map itself stays free of overlays. -->
			<ControlZoom options={{ position: 'bottomleft' }} />
			{#key layer}
				<TileLayer
					url={tiles[layer].url}
					options={{
						maxZoom: tiles[layer].maxZoom,
						crossOrigin: tiles[layer].cors ? 'anonymous' : undefined,
						// Load tiles while dragging (Leaflet waits for the finger to lift on phones by
						// default, which leaves grey gaps) and keep a wider ring of tiles around the
						// view, so panning back never reloads what was just on screen.
						updateWhenIdle: false,
						updateWhenZooming: false,
						keepBuffer: 4
					}}
				/>
			{/key}
			{#if tourStops.length > 1}
				<Polyline
					latLngs={tourStops}
					options={{
						color: '#7fd3ea',
						weight: 3,
						opacity: 0.8,
						dashArray: '2 9',
						lineCap: 'round',
						interactive: false
					}}
				/>
			{/if}
			{#each locations as location, index (location.id)}
				<Marker
					latLng={location.coordinates}
					options={{ keyboard: true, riseOnHover: true }}
					onclick={() => onselect(location)}
				>
					<!-- sveaflet reads the icon options once, so a changed state (selected, visited,
					     starred) rebuilds just that pin's icon. -->
					{#key pinClass(location)}
						<DivIcon
							options={{
								className: pinClass(location),
								iconSize: [30, 36],
								iconAnchor: [15, 34]
							}}
							style="--pin-delay: {Math.min(index, 24) * 12}ms"
						>
							{@html fluentImg(locationIconName(location), 16)}
							<!-- No hover tooltip; the name is still announced to screen readers. -->
							<span class="sr-only">{localize(location.name)}</span>
						</DivIcon>
					{/key}
				</Marker>
			{/each}
		</LMap>
	{/if}
</div>

<style>
	:global(.leaflet-container) {
		touch-action: none;
		background: #0c253d;
		font: inherit;
	}

	/* ------------------------------------------------------------- the pins -- */

	:global(.map-pin) {
		background: transparent;
		border: 0;
	}

	:global(.map-pin > div) {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 999px;
		color: #062330;
		background: #f4fafc;
		border: 2px solid var(--pin-color, #7fd3ea);
		box-shadow:
			0 3px 8px rgb(0 0 0 / 0.4),
			0 0 0 2px rgb(6 20 32 / 0.45);
		transform-origin: 50% 100%;
		animation: pin-drop 300ms cubic-bezier(0.34, 1.5, 0.5, 1) backwards;
		animation-delay: var(--pin-delay, 0ms);
		transition:
			transform 160ms cubic-bezier(0.34, 1.6, 0.5, 1),
			box-shadow 160ms ease-out;
	}

	/* The little tail that makes it read as a pin rather than a dot. */
	:global(.map-pin > div::after) {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -4px;
		width: 8px;
		height: 8px;
		border-right: 2px solid var(--pin-color, #7fd3ea);
		border-bottom: 2px solid var(--pin-color, #7fd3ea);
		border-bottom-right-radius: 2px;
		background: inherit;
		transform: translateX(-50%) rotate(45deg);
	}

	:global(.map-pin > div img) {
		width: 16px;
		height: 16px;
		position: relative;
		z-index: 1;
		pointer-events: none;
	}

	:global(.map-pin:hover > div),
	:global(.map-pin:focus-visible > div) {
		transform: translateY(-3px) scale(1.12);
		box-shadow:
			0 6px 14px rgb(0 0 0 / 0.45),
			0 0 0 4px color-mix(in oklab, var(--pin-color, #7fd3ea) 35%, transparent);
	}

	/* Category accents stay muted so 88 pins never shout at once. */
	:global(.map-pin-nature > div) {
		--pin-color: #8fd6a4;
	}
	:global(.map-pin-culture > div) {
		--pin-color: #e8b37a;
	}
	:global(.map-pin-culinary > div) {
		--pin-color: #f0a98a;
	}
	:global(.map-pin-history > div) {
		--pin-color: #cbb6ea;
	}
	:global(.map-pin-technology > div) {
		--pin-color: #a9c0d4;
	}
	:global(.map-pin-viewpoint > div) {
		--pin-color: #8fc7e8;
	}
	:global(.map-pin-cheese > div) {
		--pin-color: #f2d27c;
	}
	:global(.map-pin-butcher > div) {
		--pin-color: #e5a196;
	}
	:global(.map-pin-ruins > div) {
		--pin-color: #cfc0a0;
	}
	:global(.map-pin-drinks > div) {
		--pin-color: #c9a5dd;
	}
	:global(.map-pin-sweets > div) {
		--pin-color: #f3b3cd;
	}

	/* A place within roughly 12 km quietly breathes, so nearby options are easy to spot. */
	:global(.map-pin-near > div) {
		animation:
			pin-drop 300ms cubic-bezier(0.34, 1.5, 0.5, 1) backwards,
			pin-near 2.8s ease-in-out 400ms infinite;
	}

	:global(.map-pin-visited > div) {
		--pin-color: #8c9aa8;
		opacity: 0.68;
		filter: saturate(0.35);
	}

	:global(.map-pin-visited > div::before) {
		content: '✓';
		position: absolute;
		bottom: -5px;
		left: -5px;
		z-index: 2;
		width: 14px;
		height: 14px;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: #9ce6a8;
		color: #062330;
		font-size: 10px;
		font-weight: 700;
		line-height: 1;
	}

	:global(.map-pin-wishlist > div) {
		--pin-color: #ffc078;
	}

	:global(.map-pin-wishlist > div::before) {
		content: '★';
		position: absolute;
		top: -7px;
		right: -6px;
		z-index: 2;
		width: 14px;
		height: 14px;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: #ffc078;
		color: #2c1806;
		font-size: 9px;
		line-height: 1;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.4);
	}

	:global(.map-pin:active > div) {
		transform: translateY(0) scale(0.92);
		transition-duration: 80ms;
	}

	:global(.map-pin-highlight) {
		z-index: 1000 !important;
	}

	:global(.map-pin-highlight > div) {
		--pin-color: #7fd3ea;
		animation: pin-pulse 2s ease-in-out infinite;
	}

	/* ------------------------------------------------------ map furniture ---- */

	/* Zoom buttons sit above the thumb bar, and only where there is no pinch-zoom. */
	:global(.leaflet-bottom.leaflet-left) {
		bottom: 5.25rem;
		left: 0.75rem;
	}

	@media (pointer: coarse) {
		:global(.leaflet-control-zoom) {
			display: none;
		}
	}

	:global(.leaflet-control-zoom) {
		border: 1px solid rgb(255 255 255 / 0.1) !important;
		border-radius: 0.9rem !important;
		overflow: hidden;
		box-shadow: 0 12px 30px -18px rgb(0 0 0 / 0.9);
	}

	:global(.leaflet-control-zoom a) {
		width: 40px !important;
		height: 40px !important;
		line-height: 38px !important;
		font-size: 21px !important;
		background: rgb(11 31 51 / 0.9) !important;
		color: #e7f2f8 !important;
		border-bottom: 1px solid rgb(255 255 255 / 0.08) !important;
		transition: background-color 160ms ease-out;
	}

	:global(.leaflet-control-zoom a:last-child) {
		border-bottom: 0 !important;
	}

	:global(.leaflet-control-zoom a:hover) {
		background: rgb(22 57 90 / 0.95) !important;
		color: #7fd3ea !important;
	}

	@keyframes pin-drop {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.5);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes pin-near {
		0%,
		100% {
			box-shadow:
				0 3px 8px rgb(0 0 0 / 0.4),
				0 0 0 2px rgb(6 20 32 / 0.45);
		}
		50% {
			box-shadow:
				0 3px 8px rgb(0 0 0 / 0.4),
				0 0 0 6px color-mix(in oklab, var(--pin-color, #7fd3ea) 28%, transparent);
		}
	}

	@keyframes pin-pulse {
		0%,
		100% {
			box-shadow:
				0 4px 12px rgb(0 0 0 / 0.45),
				0 0 0 3px rgb(127 211 234 / 0.75);
		}
		50% {
			box-shadow:
				0 4px 12px rgb(0 0 0 / 0.45),
				0 0 0 10px rgb(127 211 234 / 0.12);
		}
	}
</style>
