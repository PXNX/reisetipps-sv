<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { locations, type Location } from '$lib/data/locations';
	import { categoryLabel } from '$lib/categories';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';
	import { placeholderImage } from '$lib/placeholderImage';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	type View = 'map' | 'list';

	let selected = $state<Location | null>(null);
	let hideVisited = $state(false);
	let view = $state<View>('map');
	let query = $state('');

	// Reactive so that arriving at /karte?focus=… from the wishlist menu opens the place,
	// even when the reader is already on the map.
	$effect(() => {
		const focusId = page.url.searchParams.get('focus');
		if (focusId) {
			selected = locations.find((l) => l.id === focusId) ?? null;
		}
	});

	/** The places to show — by name or station, without visited ones when asked. */
	const shownLocations = $derived.by(() => {
		const needle = query.trim().toLocaleLowerCase();
		return locations.filter((location) => {
			if (hideVisited && locationMarks.isVisited(location.id)) return false;
			if (!needle) return true;
			const haystack = [
				localize(location.name),
				location.nearestStation,
				...location.categories.map((category) => categoryLabel(category))
			]
				.join(' ')
				.toLocaleLowerCase();
			return haystack.includes(needle);
		});
	});

	function setView(next: View) {
		view = next;
		trackEvent('map_view_changed', { view: next });
	}

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

<div class="flex h-[calc(100dvh-9.5rem)] min-h-[32rem] flex-col gap-3 px-4 pt-3">
	<div class="join w-full" role="group" aria-label={m.map_title()}>
		<button
			type="button"
			class="btn join-item flex-1 {view === 'map' ? 'btn-primary' : 'btn-outline'}"
			aria-pressed={view === 'map'}
			onclick={() => setView('map')}
		>
			{m.map_view_map()}
		</button>
		<button
			type="button"
			class="btn join-item flex-1 {view === 'list' ? 'btn-primary' : 'btn-outline'}"
			aria-pressed={view === 'list'}
			onclick={() => setView('list')}
		>
			{m.map_view_list()}
		</button>
	</div>

	<input
		type="search"
		class="input w-full"
		bind:value={query}
		placeholder={m.map_search_placeholder()}
		aria-label={m.map_search_placeholder()}
	/>

	<div class="flex items-center justify-between gap-3">
		<span class="text-base text-base-content/80">{m.map_count({ count: shownLocations.length })}</span>
		<button
			type="button"
			class="btn {hideVisited ? 'btn-primary' : 'btn-outline'}"
			aria-pressed={hideVisited}
			onclick={toggleHideVisited}
		>
			{hideVisited ? m.map_show_visited() : m.map_hide_visited()}
		</button>
	</div>

	{#if view === 'map'}
		<div class="relative isolate min-h-0 flex-1 overflow-hidden rounded-box bg-base-200">
			<div
				class="pointer-events-none absolute inset-x-0 top-0 z-[1000] bg-base-200/95 px-4 py-2 text-center text-base"
			>
				{m.map_hint()}
			</div>
			{#await import('$lib/components/LeafletMap.svelte')}
				<div class="flex h-full items-center justify-center">
					<span class="loading loading-lg loading-spinner text-primary"></span>
				</div>
			{:then { default: LeafletMap }}
				<LeafletMap locations={shownLocations} focusId={page.url.searchParams.get('focus')} {onselect} />
			{/await}
		</div>
	{:else if shownLocations.length === 0}
		<div class="card bg-base-200 p-5 text-center">
			<p class="text-lg">{m.map_no_results()}</p>
			<button class="btn btn-outline mt-3" onclick={() => (query = '')}>
				{m.map_clear_search()}
			</button>
		</div>
	{:else}
		<div class="min-h-0 flex-1 space-y-2 overflow-y-auto pb-4">
			{#each shownLocations as location (location.id)}
				<button
					type="button"
					class="flex w-full items-center gap-3 rounded-box bg-base-200 p-3 text-left"
					onclick={() => onselect(location)}
				>
					<img
						src={location.image?.url ?? placeholderImage(location.categories)}
						alt=""
						class="h-16 w-16 shrink-0 rounded-field object-cover"
						loading="lazy"
					/>
					<span class="min-w-0 flex-1">
						<span class="block text-lg leading-tight font-semibold">{localize(location.name)}</span>
						<span class="block text-sm text-base-content/80">
							{location.nearestStation} · {categoryLabel(location.categories[0] ?? 'nature')}
						</span>
					</span>
					<span class="text-2xl text-primary" aria-hidden="true">›</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<BottomSheet open={selected !== null} onclose={close}>
	{#if selected}
		<LocationDetails location={selected} />
	{/if}
</BottomSheet>
