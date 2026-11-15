<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { locations, type Location } from '$lib/data/locations';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	let selected = $state<Location | null>(null);
	let hideVisited = $state(false);

	// Reactive so that arriving at /karte?focus=… from the wishlist menu opens the place,
	// even when the reader is already on the map.
	$effect(() => {
		const focusId = page.url.searchParams.get('focus');
		if (focusId) {
			selected = locations.find((l) => l.id === focusId) ?? null;
		}
	});

	/** The pins to show — without the places already visited, when the toggle is on. */
	const shownLocations = $derived(
		hideVisited ? locations.filter((l) => !locationMarks.isVisited(l.id)) : locations
	);

	function onselect(location: Location) {
		selected = location;
		trackEvent('map_place_opened', { place: location.id });
	}

	function toggleHideVisited() {
		hideVisited = !hideVisited;
		trackEvent('map_hide_visited', { hidden: hideVisited });
	}

	function close() {
		selected = null;
	}
</script>

<div class="relative isolate h-[calc(100dvh-8.5rem)] w-full">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-base-200/90 px-4 py-2 text-center text-sm"
	>
		<span class="flex-1">{m.map_hint()}</span>
		<button
			type="button"
			class="btn pointer-events-auto btn-xs {hideVisited ? 'btn-primary' : 'btn-outline'}"
			onclick={toggleHideVisited}
		>
			{hideVisited ? m.map_show_visited() : m.map_hide_visited()}
		</button>
	</div>
	{#await import('$lib/components/LeafletMap.svelte')}
		<div class="flex h-full items-center justify-center">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:then { default: LeafletMap }}
		<LeafletMap
			locations={shownLocations}
			focusId={page.url.searchParams.get('focus')}
			{onselect}
		/>
	{/await}
</div>

<BottomSheet open={selected !== null} onclose={close}>
	{#if selected}
		<LocationDetails location={selected} />
	{/if}
</BottomSheet>
