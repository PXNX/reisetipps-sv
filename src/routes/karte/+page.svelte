<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { locations, type Location } from '$lib/data/locations';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	let selected = $state<Location | null>(null);

	const focusId = page.url.searchParams.get('focus');
	if (focusId) {
		selected = locations.find((l) => l.id === focusId) ?? null;
	}

	function onselect(location: Location) {
		selected = location;
	}

	function close() {
		selected = null;
	}
</script>

<div class="relative isolate h-[calc(100dvh-8.5rem)] w-full">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-10 bg-base-200/90 px-4 py-2 text-center text-sm"
	>
		{m.map_hint()}
	</div>
	{#await import('$lib/components/LeafletMap.svelte')}
		<div class="flex h-full items-center justify-center">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:then { default: LeafletMap }}
		<LeafletMap {locations} {focusId} {onselect} />
	{/await}
</div>

<BottomSheet open={selected !== null} onclose={close}>
	{#if selected}
		<LocationDetails location={selected} />
	{/if}
</BottomSheet>
