<script lang="ts">
	import { Map as LMap, TileLayer, Marker, DivIcon, Tooltip } from 'sveaflet';
	import type { Map as LeafletMapInstance } from 'leaflet';
	import { browser } from '$app/environment';
	import type { Location } from '$lib/data/locations';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { categoryIcons } from '$lib/categories';

	function pinClass(location: Location): string {
		if (locationMarks.isVisited(location.id)) return 'map-pin map-pin-visited';
		if (locationMarks.isWishlisted(location.id)) return 'map-pin map-pin-wishlist';
		return 'map-pin';
	}

	interface Props {
		locations: Location[];
		focusId?: string | null;
		onselect: (location: Location) => void;
	}
	let { locations, focusId = null, onselect }: Props = $props();

	let map: LeafletMapInstance | undefined = $state();
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

	$effect(() => {
		if (!map || !focusId) return;
		const target = locations.find((l) => l.id === focusId);
		if (target) map.setView(target.coordinates, 13);
	});
</script>

<div class="h-full w-full touch-none">
	{#if browser}
		<LMap bind:instance={map} options={{ center: [47.66, 9.35], zoom: 10 }}>
			<TileLayer
				url={tileUrl}
				options={{ attribution: '&copy; OpenStreetMap contributors', maxZoom: 18 }}
			/>
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
	/* Large zoom buttons — the default Leaflet ones are far too small. */
	:global(.leaflet-control-zoom a) {
		width: 46px !important;
		height: 46px !important;
		line-height: 44px !important;
		font-size: 26px !important;
	}
	:global(.leaflet-control-attribution) {
		font-size: 12px;
	}
</style>
