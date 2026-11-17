<script lang="ts">
	import {
		Map as LMap,
		TileLayer,
		Marker,
		DivIcon,
		Tooltip,
		ControlZoom,
		ControlAttribution
	} from 'sveaflet';
	import type { Map } from 'leaflet';
	import { browser } from '$app/environment';
	import type { Location } from '$lib/data/types';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { fluentSvg, locationIconName } from '$lib/icons';

	type Layer = 'standard' | 'topo' | 'transit';

	const tiles: Record<Layer, { url: string; attribution: string; maxZoom: number }> = {
		standard: {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution: '&copy; OpenStreetMap contributors',
			maxZoom: 18
		},
		topo: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			attribution: '&copy; OpenTopoMap (CC BY-SA) &copy; OpenStreetMap contributors',
			maxZoom: 17
		},
		transit: {
			url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
			attribution: '&copy; OpenStreetMap contributors, &copy; memomaps.de',
			maxZoom: 18
		}
	};

	const reducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function pinClass(location: Location): string {
		let className = `map-pin map-pin-${location.categories[0] ?? 'nature'}`;
		if (locationMarks.isVisited(location.id)) className += ' map-pin-visited';
		else if (locationMarks.isWishlisted(location.id)) className += ' map-pin-wishlist';
		if (location.id === highlightId) className += ' map-pin-highlight';
		return className;
	}

	interface Props {
		locations: Location[];
		focusId?: string | null;
		highlightId?: string | null;
		onselect: (location: Location) => void;
		oncenterchange?: (center: [number, number]) => void;
		layer?: Layer;
	}
	let {
		locations,
		focusId = null,
		highlightId = null,
		onselect,
		oncenterchange,
		layer = 'standard'
	}: Props = $props();

	let map = $state<Map | undefined>();

	const HOME: [number, number] = [47.66, 9.35];
	const HOME_ZOOM = 10;
	let mapOptions = $derived({
		center: HOME,
		zoom: HOME_ZOOM,
		zoomControl: false,
		attributionControl: false
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
			<ControlZoom options={{ position: 'topleft' }} />
			<ControlAttribution options={{ position: 'bottomright', prefix: false }} />
			{#key layer}
				<TileLayer
					url={tiles[layer].url}
					options={{ attribution: tiles[layer].attribution, maxZoom: tiles[layer].maxZoom }}
				/>
			{/key}
			{#each locations as location, index (location.id)}
				<Marker
					latLng={location.coordinates}
					options={{
						title: localize(location.name),
						keyboard: true,
						riseOnHover: true
					}}
					onclick={() => onselect(location)}
				>
					<DivIcon
						options={{
							className: pinClass(location),
							iconSize: [30, 36],
							iconAnchor: [15, 34]
						}}
						style="--pin-delay: {Math.min(index, 18) * 22}ms"
					>
						{@html fluentSvg(locationIconName(location), 16)}
					</DivIcon>
					<Tooltip options={{ direction: 'top', offset: [0, -34], className: 'map-pin-tip' }}
						>{localize(location.name)}</Tooltip
					>
				</Marker>
			{/each}
		</LMap>
	{/if}
</div>

<style>
	:global(.leaflet-container) {
		touch-action: none;
		background: #0c253d;
		font:
			inherit;
	}

	/* Barely-there desaturation so the bright OSM colours sit under the dark UI
	   instead of competing with the pins. */
	:global(.leaflet-tile-pane) {
		filter: saturate(0.8) brightness(0.97) contrast(1.02);
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
		animation: pin-drop 420ms cubic-bezier(0.34, 1.4, 0.5, 1) both;
		animation-delay: var(--pin-delay, 0ms);
		transition: box-shadow 180ms ease-out;
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

	:global(.map-pin > div svg) {
		width: 16px;
		height: 16px;
		position: relative;
		z-index: 1;
	}

	:global(.map-pin:hover > div) {
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

	:global(.map-pin-visited > div) {
		--pin-color: #8c9aa8;
		opacity: 0.68;
		filter: saturate(0.35);
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

	:global(.map-pin-highlight) {
		z-index: 1000 !important;
	}

	:global(.map-pin-highlight > div) {
		--pin-color: #7fd3ea;
		animation: pin-pulse 2s ease-in-out infinite;
	}

	:global(.map-pin-tip) {
		border: 1px solid rgb(255 255 255 / 0.12) !important;
		border-radius: 0.6rem !important;
		background: #0b1f33 !important;
		color: #f3f8fb !important;
		box-shadow: 0 12px 26px -14px rgb(0 0 0 / 0.9) !important;
		font-size: 0.8rem !important;
		font-weight: 600;
		padding: 0.3rem 0.55rem !important;
	}

	/* ------------------------------------------------------ map furniture ---- */

	:global(.leaflet-top.leaflet-left) {
		top: 9.25rem;
		left: 0.5rem;
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

	:global(.leaflet-bottom.leaflet-right) {
		bottom: 5.5rem;
		right: 0.25rem;
	}

	:global(.leaflet-control-attribution) {
		border-radius: 0.4rem 0 0 0.4rem !important;
		background: rgb(11 31 51 / 0.66) !important;
		color: rgb(207 221 230 / 0.85) !important;
		font-size: 10px !important;
		line-height: 1.4 !important;
		padding: 2px 6px !important;
	}

	:global(.leaflet-control-attribution a) {
		color: #7fd3ea !important;
	}

	@keyframes pin-drop {
		from {
			opacity: 0;
			transform: translateY(-6px) scale(0.6);
		}
		to {
			opacity: 1;
			transform: none;
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
