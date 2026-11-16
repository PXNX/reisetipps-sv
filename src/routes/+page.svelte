<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { locations } from '$lib/data/locations';
	import type { Location } from '$lib/data/types';
	import { categoryLabel } from '$lib/categories';
	import { localize } from '$lib/i18n';
	import { findMatches } from '$lib/recommend';
	import { haversineDistanceKm } from '$lib/geo';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { filters } from '$lib/stores/filters.svelte';
	import { trackEvent } from '$lib/telemetry';
	import { placeholderImage } from '$lib/placeholderImage';
	import BottomSheet from '$lib/components/sheets/BottomSheet.svelte';
	import FilterSheet from '$lib/components/sheets/FilterSheet.svelte';
	import LocationDetails from '$lib/components/places/LocationDetails.svelte';

	let selected = $state<Location | null>(null);
	let focusId = $state<string | null>(null);
	let query = $state('');
	let hideVisited = $state(false);
	let origin = $state<[number, number] | null>(null);
	let mapCenter = $state<[number, number]>([47.66, 9.35]);
	let locating = $state(false);
	let locationError = $state(false);
	let filterOpen = $state(false);
	let listOpen = $state(false);
	let notice = $state<'fallback' | 'no-matches' | null>(null);
	let shown = $state<string[]>([]);
	let resultDistance = $state<number | null>(null);
	let resultSource = $state<'gps' | 'map' | null>(null);

	// A link from the wishlist can open a place even when we are already on this page.
	$effect(() => {
		const id = page.url.searchParams.get('focus');
		if (id) {
			selected = locations.find((l) => l.id === id) ?? null;
			focusId = id;
		}
	});

	/** Places on the map: filters, search and visited state applied, nearest first when located. */
	const shownLocations = $derived.by(() => {
		const needle = query.trim().toLocaleLowerCase();
		const cats = filters.categories;
		const dur = filters.duration;
		const list = locations.filter((location) => {
			if (hideVisited && locationMarks.isVisited(location.id)) return false;
			if (cats.length > 0 && !location.categories.some((c) => cats.includes(c))) return false;
			if (dur && !location.duration.includes(dur)) return false;
			if (!needle) return true;
			const haystack = [
				location.name.de,
				location.name.en,
				location.nearestStation,
				...location.categories.map((category) => categoryLabel(category))
			]
				.join(' ')
				.toLocaleLowerCase();
			return haystack.includes(needle);
		});
		const from = origin;
		if (!from) return list;
		return [...list].sort(
			(a, b) => haversineDistanceKm(from, a.coordinates) - haversineDistanceKm(from, b.coordinates)
		);
	});

	function onselect(location: Location) {
		selected = location;
		focusId = location.id;
		resultSource = origin ? 'gps' : null;
		resultDistance = origin ? haversineDistanceKm(origin, location.coordinates) : null;
		trackEvent('map_place_opened', { place: location.id });
	}

	function close() {
		selected = null;
	}

	function toggleHideVisited() {
		hideVisited = !hideVisited;
		trackEvent('map_hide_visited', { hidden: hideVisited });
	}

	function openList() {
		listOpen = true;
		trackEvent('map_list_opened', { places: shownLocations.length });
	}

	function useMyLocation() {
		if (!navigator.geolocation) {
			locationError = true;
			return;
		}
		locating = true;
		locationError = false;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				origin = [position.coords.latitude, position.coords.longitude];
				locating = false;
				trackEvent('filter_location', { used: true });
			},
			() => {
				locating = false;
				locationError = true;
			},
			{ enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 }
		);
	}

	function clearLocation() {
		origin = null;
		locationError = false;
		trackEvent('filter_location', { used: false });
	}

	function getRoughLocation(): Promise<[number, number] | null> {
		return new Promise((resolve) => {
			if (!navigator.geolocation) return resolve(null);
			navigator.geolocation.getCurrentPosition(
				(position) => resolve([position.coords.latitude, position.coords.longitude]),
				() => resolve(null),
				{ enableHighAccuracy: false, timeout: 8_000, maximumAge: 5 * 60_000 }
			);
		});
	}

	/** Rank matching places by distance from the reader (or the map centre) and offer the closest. */
	async function recommendNearby() {
		locating = true;
		notice = null;
		let center: [number, number];
		let source: 'gps' | 'map';

		if (origin) {
			center = origin;
			source = 'gps';
		} else {
			const position = await getRoughLocation();
			if (position) {
				origin = position;
				center = position;
				source = 'gps';
				trackEvent('filter_location', { used: true });
			} else {
				center = mapCenter;
				source = 'map';
				notice = 'fallback';
			}
		}
		locating = false;

		const matches = findMatches({
			categories: filters.categories,
			duration: filters.duration,
			origin: center
		});
		const unseen = matches.filter((location) => !shown.includes(location.id));
		const pool = unseen.length > 0 ? unseen : matches;
		if (pool.length === 0) {
			notice = 'no-matches';
			return;
		}

		const closest = pool.slice(0, Math.min(3, pool.length));
		const pick = closest[Math.floor(Math.random() * closest.length)];
		shown = [...shown, pick.id];
		resultDistance = haversineDistanceKm(center, pick.coordinates);
		resultSource = source;
		selected = pick;
		focusId = pick.id;
		trackEvent('nearby_recommendation', {
			place: pick.id,
			source,
			distance_km: Math.round(resultDistance ?? 0),
			categories: filters.categories.length,
			duration: filters.duration ?? 'any'
		});
	}
</script>

<div class="relative h-dvh w-full overflow-hidden bg-base-200">
	<div class="absolute inset-0">
		{#await import('$lib/components/map/LeafletMap.svelte')}
			<div class="flex h-full items-center justify-center">
				<span class="loading loading-lg loading-spinner text-primary"></span>
			</div>
		{:then { default: LeafletMap }}
			<LeafletMap
				locations={shownLocations}
				{focusId}
				highlightId={selected?.id ?? null}
				{onselect}
				oncenterchange={(center) => (mapCenter = center)}
			/>
		{/await}
	</div>

	<!-- Search floats over the map; results replace the map until a place is picked. -->
	<div class="pointer-events-none absolute inset-x-3 top-20 z-[1000]">
		<div
			class="pointer-events-auto flex items-center gap-1 rounded-field bg-base-100/95 p-1 shadow-lg backdrop-blur"
		>
			<span class="pl-2 text-lg" aria-hidden="true">🔍</span>
			<input
				type="search"
				class="input min-w-0 flex-1 input-ghost"
				bind:value={query}
				placeholder={m.map_search_placeholder()}
				aria-label={m.map_search_placeholder()}
			/>
			{#if query}
				<button class="btn gap-1 btn-ghost text-sm" onclick={() => (query = '')}>
					<span aria-hidden="true">✕</span>
					{m.map_clear_search()}
				</button>
			{/if}
		</div>

		{#if query.trim()}
			<div
				class="pointer-events-auto mt-2 max-h-[45dvh] space-y-1 overflow-y-auto rounded-box bg-base-100/98 p-2 shadow-xl"
			>
				{#each shownLocations.slice(0, 25) as location, index (location.id)}
					<button
						type="button"
						class="rise-in flex w-full items-center gap-3 rounded-field p-2 text-left hover:bg-base-200"
						style="animation-delay: {Math.min(index, 8) * 25}ms"
						onclick={() => {
							onselect(location);
							query = '';
						}}
					>
						<img
							src={location.image?.url ?? placeholderImage(location.categories)}
							alt=""
							class="h-12 w-12 shrink-0 rounded-field object-cover"
							loading="lazy"
						/>
						<span class="min-w-0 flex-1">
							<span class="block truncate font-semibold">{localize(location.name)}</span>
							<span class="block truncate text-sm text-base-content/80">
								{location.nearestStation} · {categoryLabel(location.categories[0] ?? 'nature')}
							</span>
						</span>
					</button>
				{:else}
					<p class="p-4 text-center">{m.map_no_results()}</p>
				{/each}
			</div>
		{/if}
	</div>

	{#if notice}
		<div
			class="absolute inset-x-3 top-[8.5rem] z-[1000] rounded-field bg-base-300/95 p-3 text-sm shadow-lg"
			role="status"
		>
			<p>{notice === 'fallback' ? m.nearby_fallback() : m.no_matches_body()}</p>
			{#if notice === 'no-matches'}
				<button class="btn mt-2 btn-outline" onclick={() => (filterOpen = true)}>
					{m.reset_filters()}
				</button>
			{/if}
		</div>
	{/if}

	<div
		class="absolute inset-x-3 bottom-3 z-[1000] flex items-end gap-2"
		style="padding-bottom: env(safe-area-inset-bottom)"
	>
		<button
			class="btn gap-1 btn-outline shadow-lg"
			onclick={openList}
			aria-label={m.map_view_list()}
		>
			<span aria-hidden="true">☰</span>
			<span class="hidden sm:inline">{m.map_view_list()}</span>
		</button>
		<button
			class="btn flex-1 gap-2 shadow-lg btn-lg btn-primary"
			onclick={recommendNearby}
			disabled={locating}
		>
			<span aria-hidden="true">📍</span>
			{locating ? m.locating() : m.nearby_short()}
		</button>
		<button
			class="btn gap-1 btn-outline shadow-lg"
			onclick={() => {
				filterOpen = true;
				trackEvent('filter_sheet_opened', {});
			}}
			aria-label={m.filter_title()}
		>
			<span aria-hidden="true">🎚</span>
			<span class="hidden sm:inline">{m.filter_title()}</span>
		</button>
	</div>
</div>

<FilterSheet
	open={filterOpen}
	onclose={() => (filterOpen = false)}
	{origin}
	{locating}
	{locationError}
	onuseLocation={useMyLocation}
	onclearLocation={clearLocation}
/>

<BottomSheet open={listOpen} onclose={() => (listOpen = false)}>
	<div class="space-y-3 pt-1">
		<div class="flex items-center justify-between gap-2">
			<h2 class="text-xl font-bold">{m.map_title()}</h2>
			<span class="text-sm text-base-content/80"
				>{m.map_count({ count: shownLocations.length })}</span
			>
		</div>
		<button
			class="btn {hideVisited ? 'btn-primary' : 'btn-outline'} w-full"
			aria-pressed={hideVisited}
			onclick={toggleHideVisited}
		>
			{hideVisited ? m.map_show_visited() : m.map_hide_visited()}
		</button>
		{#if shownLocations.length === 0}
			<p class="py-4 text-center">{m.map_no_results()}</p>
		{:else}
			<div class="space-y-2">
				{#each shownLocations as location, index (location.id)}
					<button
						type="button"
						class="rise-in flex w-full items-center gap-3 rounded-field bg-base-300/60 p-2 text-left"
						style="animation-delay: {Math.min(index, 8) * 25}ms"
						onclick={() => {
							listOpen = false;
							onselect(location);
						}}
					>
						<img
							src={location.image?.url ?? placeholderImage(location.categories)}
							alt=""
							class="h-12 w-12 shrink-0 rounded-field object-cover"
							loading="lazy"
						/>
						<span class="min-w-0 flex-1">
							<span class="block truncate font-semibold">{localize(location.name)}</span>
							<span class="block truncate text-sm text-base-content/80">
								{location.nearestStation}{origin
									? ` · ${Math.round(haversineDistanceKm(origin, location.coordinates))} km`
									: ''}
							</span>
						</span>
						<span class="text-2xl text-primary" aria-hidden="true">›</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</BottomSheet>

<BottomSheet open={selected !== null} onclose={close}>
	{#if selected}
		<div class="space-y-4 pt-1">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<p class="text-sm font-semibold text-primary">
					{resultSource === 'gps' ? m.nearby_from_gps() : m.nearby_from_map()}
				</p>
				{#if resultDistance !== null}
					<span class="badge badge-outline"
						>{m.nearby_distance({ km: resultDistance.toFixed(1) })}</span
					>
				{/if}
			</div>
			<LocationDetails location={selected} />
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn btn-lg btn-primary" onclick={recommendNearby} disabled={locating}>
					{m.nearby_another()}
				</button>
				<button class="btn btn-outline btn-lg" onclick={close}>{m.show_on_map()}</button>
			</div>
		</div>
	{/if}
</BottomSheet>
