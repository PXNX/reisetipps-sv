<script lang="ts">
	import { Map as LMap, TileLayer, Marker, DivIcon, Tooltip } from 'sveaflet';
	import type { Map as LeafletMapInstance } from 'leaflet';
	import { browser } from '$app/environment';
	import type { Location } from '$lib/data/locations';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';

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
					<DivIcon options={{ className: pinClass(location), iconSize: [16, 16] }}>
						<span></span>
					</DivIcon>
					<Tooltip options={{ direction: 'top', offset: [0, -10] }}
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
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: #f2a65a;
		border: 2px solid #0b1f33;
		box-shadow: 0 0 0 2px rgba(98, 195, 221, 0.6);
	}
	:global(.map-pin-visited span) {
		background: #8a8f98;
		box-shadow: 0 0 0 2px rgba(138, 143, 152, 0.5);
	}
	:global(.map-pin-wishlist span) {
		background: #62c3dd;
		box-shadow: 0 0 0 2px rgba(242, 166, 90, 0.7);
	}
</style>
