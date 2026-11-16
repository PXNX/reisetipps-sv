<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { locations, type Location } from '$lib/data/locations';
	import { categoryLabel } from '$lib/categories';
	import { localize } from '$lib/i18n';
	import { findMatches } from '$lib/recommend';
	import { haversineDistanceKm } from '$lib/geo';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { filters } from '$lib/stores/filters.svelte';
	import { trackEvent } from '$lib/telemetry';
	import { placeholderImage } from '$lib/placeholderImage';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import FilterSheet from '$lib/components/FilterSheet.svelte';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	type View = 'map' | 'list';

	let selected = $state<Location | null>(null);
	let view = $state<View>('map');
	let query = $state('');
	let hideVisited = $state(false);
	let focusId = $state<string | null>(null);
	let origin = $state<[number, number] | null>(null);
	let mapCenter = $state<[number, number]>([47.66, 9.35]);
	let locating = $state(false);
	let locationError = $state(false);
	let filterOpen = $state(false);
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

	/** What the map and the list show: filters, search and visited state applied. */
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

	function setView(next: View) {
		view = next;
		trackEvent('map_view_changed', { view: next });
	}

	function toggleHideVisited() {
		hideVisited = !hideVisited;
		trackEvent('map_hide_visited', { hidden: hideVisited });
	}

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

	/**
	 * The primary action: rank the matching places by distance from the reader (or from the
	 * current map centre if location is unavailable) and offer one of the three closest.
	 */
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

		const matches = findMatches(
			{ categories: filters.categories, duration: filters.duration, origin: center },
		);
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

<div class="flex h-[calc(100dvh-5.5rem)] min-h-[30rem] flex-col gap-2 px-3 pt-3 pb-3">
	<div class="flex gap-2">
		<button
			class="btn btn-primary btn-lg flex-1 gap-2"
			onclick={recommendNearby}
			disabled={locating}
		>
			<span aria-hidden="true">📍</span>
			{locating ? m.locating() : m.recommend_nearby()}
		</button>
		<button
			class="btn btn-outline btn-lg gap-2"
			onclick={() => {
				filterOpen = true;
				trackEvent('filter_sheet_opened', {});
			}}
			aria-label={m.filter_title()}
		>
			<span aria-hidden="true">🎚</span>
			{m.filter_title()}
		</button>
	</div>

	<div class="flex gap-2">
		<input
			type="search"
			class="input min-w-0 flex-1"
			bind:value={query}
			placeholder={m.map_search_placeholder()}
			aria-label={m.map_search_placeholder()}
		/>
		<div class="join shrink-0" role="group" aria-label={m.map_title()}>
			<button
				type="button"
				class="btn join-item {view === 'map' ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={view === 'map'}
				onclick={() => setView('map')}
			>
				{m.map_view_map()}
			</button>
			<button
				type="button"
				class="btn join-item {view === 'list' ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={view === 'list'}
				onclick={() => setView('list')}
			>
				{m.map_view_list()}
			</button>
		</div>
	</div>

	<div class="flex items-center justify-between gap-2">
		<span class="text-sm text-base-content/80">
			{m.map_count({ count: shownLocations.length })}
		</span>
		<div class="flex gap-2">
			{#if filters.active}
				<button class="btn btn-outline gap-1 text-sm" onclick={() => (filterOpen = true)}>
					✓ {m.filter_title()}
				</button>
			{/if}
			<button
				type="button"
				class="btn text-sm {hideVisited ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={hideVisited}
				onclick={toggleHideVisited}
			>
				{hideVisited ? m.map_show_visited() : m.map_hide_visited()}
			</button>
		</div>
	</div>

	{#if notice}
		<div class="rounded-field bg-base-300 p-3 text-sm" role="status">
			<p>{notice === 'fallback' ? m.nearby_fallback() : m.no_matches_body()}</p>
			{#if notice === 'no-matches'}
				<button class="btn btn-outline mt-2" onclick={() => (filterOpen = true)}>
					{m.reset_filters()}
				</button>
			{/if}
		</div>
	{/if}

	{#if view === 'map'}
		<div class="relative isolate min-h-0 flex-1 overflow-hidden rounded-box bg-base-200">
			<div
				class="pointer-events-none absolute inset-x-0 top-0 z-[1000] bg-base-200/95 px-4 py-2 text-center text-sm"
			>
				{m.map_hint()}
			</div>
			{#await import('$lib/components/LeafletMap.svelte')}
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
						class="h-14 w-14 shrink-0 rounded-field object-cover"
						loading="lazy"
					/>
					<span class="min-w-0 flex-1">
						<span class="block text-base leading-tight font-semibold">{localize(location.name)}</span>
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

<FilterSheet
	open={filterOpen}
	onclose={() => (filterOpen = false)}
	{origin}
	{locating}
	{locationError}
	onuseLocation={useMyLocation}
	onclearLocation={clearLocation}
/>

<BottomSheet open={selected !== null} onclose={close}>
	{#if selected}
		<div class="space-y-4 pt-1">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<p class="text-sm font-semibold text-primary">
					{resultSource === 'gps' ? m.nearby_from_gps() : m.nearby_from_map()}
				</p>
				{#if resultDistance !== null}
					<span class="badge badge-outline">{m.nearby_distance({ km: resultDistance.toFixed(1) })}</span>
				{/if}
			</div>
			<LocationDetails location={selected} />
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn btn-primary btn-lg" onclick={recommendNearby} disabled={locating}>
					{m.nearby_another()}
				</button>
				<button class="btn btn-outline btn-lg" onclick={close}>{m.show_on_map()}</button>
			</div>
		</div>
	{/if}
</BottomSheet>
