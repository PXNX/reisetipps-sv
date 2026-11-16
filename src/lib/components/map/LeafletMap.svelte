<script lang="ts">
	import { Map as LMap, TileLayer, Marker, DivIcon, Tooltip } from 'sveaflet';
	import type { Map as LeafletMapInstance } from 'leaflet';
	import { browser } from '$app/environment';
	import type { Location } from '$lib/data/types';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { categoryIcons } from '$lib/categories';
	import { trackEvent } from '$lib/telemetry';
	import * as m from '$lib/paraglide/messages.js';

	type Layer = 'standard' | 'topo';

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
		}
	};

	function pinClass(location: Location): string {
		let className = 'map-pin';
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
	}
	let { locations, focusId = null, highlightId = null, onselect, oncenterchange }: Props = $props();

	let map: LeafletMapInstance | undefined = $state();
	let layer = $state<Layer>('standard');

	function setLayer(next: Layer) {
		layer = next;
		trackEvent('map_layer_changed', { layer: next });
	}

	$effect(() => {
		if (!map || !focusId) return;
		const target = locations.find((l) => l.id === focusId);
		if (target) map.setView(target.coordinates, 13);
	});

	$effect(() => {
		if (!map || !oncenterchange) return;
		const instance = map;
		const report = () => {
			const center = instance.getCenter();
			oncenterchange([center.lat, center.lng]);
		};
		instance.on('moveend', report);
		return () => instance.off('moveend', report);
	});
</script>

<div class="relative h-full w-full touch-none">
	{#if browser}
		<LMap bind:instance={map} options={{ center: [47.66, 9.35], zoom: 10 }}>
			{#key layer}
				<TileLayer
					url={tiles[layer].url}
					options={{ attribution: tiles[layer].attribution, maxZoom: tiles[layer].maxZoom }}
				/>
			{/key}
			{#each locations as location (location.id)}
				<Marker latLng={location.coordinates} onclick={() => onselect(location)}>
					<DivIcon
						options={{
							className: pinClass(location),
							iconSize: [38, 38],
							iconAnchor: [19, 19]
						}}
					>
						<span>{location.icon ?? categoryIcons[location.categories[0] ?? 'nature']}</span>
					</DivIcon>
					<Tooltip options={{ direction: 'top', offset: [0, -20] }}
						>{localize(location.name)}</Tooltip
					>
				</Marker>
			{/each}
		</LMap>
	{/if}

	<div
		class="absolute top-1/3 right-2 z-[1000] flex -translate-y-1/2 flex-col gap-1 rounded-field bg-base-200/95 p-1 shadow-md"
		role="group"
		aria-label={m.map_layers()}
	>
		<button
			type="button"
			class="btn btn-xs {layer === 'standard' ? 'btn-primary' : 'btn-ghost'}"
			aria-pressed={layer === 'standard'}
			onclick={() => setLayer('standard')}
		>
			{m.layer_standard()}
		</button>
		<button
			type="button"
			class="btn btn-xs {layer === 'topo' ? 'btn-primary' : 'btn-ghost'}"
			aria-pressed={layer === 'topo'}
			onclick={() => setLayer('topo')}
		>
			{m.layer_topo()}
		</button>
	</div>
</div>

<style>
	:global(.leaflet-container) {
		touch-action: none;
	}
	:global(.map-pin span) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 9999px;
		font-size: 22px;
		line-height: 1;
		background: #ffc078;
		border: 3px solid #0b1f33;
		box-shadow: 0 0 0 3px rgba(127, 211, 234, 0.7);
	}
	:global(.map-pin-visited span) {
		background: #9aa0aa;
		box-shadow: 0 0 0 3px rgba(154, 160, 170, 0.55);
	}
	:global(.map-pin-wishlist span) {
		background: #7fd3ea;
		box-shadow: 0 0 0 3px rgba(255, 192, 120, 0.8);
	}
	:global(.map-pin-highlight span) {
		animation: pin-pulse 1.8s ease-in-out infinite;
	}
	/* Leave room for the floating header and search pill. */
	:global(.leaflet-top.leaflet-left) {
		top: 9rem;
	}
	:global(.leaflet-control-zoom a) {
		width: 46px !important;
		height: 46px !important;
		line-height: 44px !important;
		font-size: 26px !important;
	}
	:global(.leaflet-control-attribution) {
		font-size: 12px;
	}

	@keyframes pin-pulse {
		0%,
		100% {
			box-shadow: 0 0 0 3px rgba(127, 211, 234, 0.8);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(127, 211, 234, 0.15);
		}
	}
</style>
