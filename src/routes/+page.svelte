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
	import Icon from '$lib/components/ui/Icon.svelte';
	import FilterSheet from '$lib/components/sheets/FilterSheet.svelte';
	import LocationDetails from '$lib/components/places/LocationDetails.svelte';

	let selected = $state<Location | null>(null);
	let layer = $state<'standard' | 'topo' | 'transit'>('standard');
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

	const searchResults = $derived(query.trim() ? shownLocations.slice(0, 25) : []);

	/** Small badge on the filter button, so active filters are never a surprise. */
	const activeFilterCount = $derived(
		filters.categories.length + (filters.duration ? 1 : 0) + (origin ? 1 : 0)
	);

	// A quiet toast disappears on its own; the reader should never have to dismiss a hint.
	$effect(() => {
		if (!notice) return;
		const timer = setTimeout(() => (notice = null), 7000);
		return () => clearTimeout(timer);
	});

	function onselect(location: Location) {
		selected = location;
		focusId = location.id;
		resultSource = origin ? 'gps' : null;
		resultDistance = origin ? haversineDistanceKm(origin, location.coordinates) : null;
		query = '';
		trackEvent('map_place_opened', { place: location.id });
	}

	function close() {
		selected = null;
	}

	function toggleHideVisited() {
		hideVisited = !hideVisited;
		trackEvent('map_hide_visited', { hidden: hideVisited });
	}

	function setLayer(next: 'standard' | 'topo' | 'transit') {
		layer = next;
		trackEvent('map_layer_changed', { layer: next });
	}

	function openList() {
		listOpen = true;
		trackEvent('map_list_opened', { places: shownLocations.length });
	}

	function onSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchResults.length > 0) {
			onselect(searchResults[0]);
		} else if (event.key === 'Escape') {
			query = '';
		}
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
		query = '';
		trackEvent('nearby_recommendation', {
			place: pick.id,
			source,
			distance_km: Math.round(resultDistance ?? 0),
			categories: filters.categories.length,
			duration: filters.duration ?? 'any'
		});
	}
</script>

<svelte:head><title>{m.app_name()}</title></svelte:head>

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
				{layer}
				oncenterchange={(center) => (mapCenter = center)}
			/>
		{/await}
	</div>

	<!-- Search floats over the map; results replace the map until a place is picked. -->
	<div
		class="pointer-events-none absolute inset-x-3 top-[3.9rem] z-[1000] sm:inset-x-auto sm:left-4 sm:w-[26rem]"
	>
		<div
			class="glass-panel pointer-events-auto flex items-center gap-1 rounded-full py-1 pr-1.5 pl-3.5 transition-shadow duration-200 focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_22%,transparent)]"
		>
			<Icon name="search" class="shrink-0 text-base-content/55" />
			<input
				type="search"
				class="field-bare h-11 min-w-0 flex-1 border-0 bg-transparent px-2 text-base outline-none placeholder:text-base-content/45"
				bind:value={query}
				onkeydown={onSearchKeydown}
				placeholder={m.map_search_placeholder()}
				aria-label={m.map_search_placeholder()}
				autocomplete="off"
			/>
			{#if query}
				<button
					type="button"
					class="icon-btn h-9 w-9 border-0 bg-transparent"
					onclick={() => (query = '')}
					aria-label={m.map_clear_search()}
					title={m.map_clear_search()}
				>
					<Icon name="close" size={18} />
				</button>
			{/if}
		</div>

		{#if query.trim()}
			<div
				class="glass-panel pointer-events-auto mt-2 overflow-hidden rounded-[1.15rem] p-1.5"
				role="listbox"
				aria-label={m.map_search_placeholder()}
			>
				<p class="px-2.5 py-1.5 text-xs font-semibold tracking-wide text-base-content/55 uppercase">
					{m.map_count({ count: shownLocations.length })}
				</p>
				<div class="scroll-slim max-h-[48dvh] overflow-y-auto">
					{#if searchResults.length === 0}
						<p class="px-3 py-6 text-center text-base-content/70">{m.map_no_results()}</p>
					{:else}
						{#each searchResults as location, index (location.id)}
							<button
								type="button"
								class="rise-in flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/6 focus-visible:bg-white/6"
								style="animation-delay: {Math.min(index, 8) * 22}ms"
								role="option"
								aria-selected="false"
								onclick={() => onselect(location)}
							>
								<img
									src={location.image?.url ?? placeholderImage(location.categories)}
									alt=""
									class="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
									loading="lazy"
								/>
								<span class="min-w-0 flex-1">
									<span class="block truncate font-semibold">{localize(location.name)}</span>
									<span class="block truncate text-sm text-base-content/65">
										{location.nearestStation} · {categoryLabel(location.categories[0] ?? 'nature')}
									</span>
								</span>
								<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
							</button>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Layer switcher: a calm segmented control, tucked under the search on phones. -->
	{#if !query.trim()}
		<div
			class="seg absolute top-[7.6rem] right-3 z-[1000] sm:top-[3.9rem] sm:right-4"
			role="group"
			aria-label={m.map_layers()}
		>
			<button
				type="button"
				class="seg-btn"
				aria-pressed={layer === 'standard'}
				onclick={() => setLayer('standard')}
			>
				<Icon name="map" />
				<span class="hidden md:inline">{m.layer_standard()}</span>
			</button>
			<button
				type="button"
				class="seg-btn"
				aria-pressed={layer === 'topo'}
				onclick={() => setLayer('topo')}
			>
				<Icon name="terrain" />
				<span class="hidden md:inline">{m.layer_topo()}</span>
			</button>
			<button
				type="button"
				class="seg-btn"
				aria-pressed={layer === 'transit'}
				onclick={() => setLayer('transit')}
			>
				<Icon name="transit" />
				<span class="hidden md:inline">{m.layer_transit()}</span>
			</button>
		</div>
	{/if}

	{#if notice}
		<div
			class="glass-panel rise-in absolute inset-x-3 bottom-[5.75rem] z-[1000] flex items-start gap-3 rounded-2xl p-3.5 sm:inset-x-auto sm:left-4 sm:max-w-sm"
			role="status"
		>
			<Icon name="info" class="mt-0.5 shrink-0 text-primary" />
			<div class="min-w-0 flex-1 space-y-2">
				<p class="text-sm leading-snug">
					{notice === 'fallback' ? m.nearby_fallback() : m.no_matches_body()}
				</p>
				{#if notice === 'no-matches'}
					<button class="btn btn-sm btn-soft" onclick={() => (filterOpen = true)}>
						{m.reset_filters()}
					</button>
				{/if}
			</div>
			<button
				type="button"
				class="icon-btn h-8 w-8 shrink-0 border-0 bg-transparent text-base-content/60"
				onclick={() => (notice = null)}
				aria-label={m.close()}
			>
				<Icon name="close" size={16} />
			</button>
		</div>
	{/if}

	<!-- Thumb bar. The side buttons keep their size; only the recommendation grows. -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] px-3"
		style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))"
	>
		<div class="pointer-events-auto mx-auto flex max-w-2xl items-center gap-2">
			<button
				type="button"
				class="glass-panel flex h-13 shrink-0 items-center gap-2 rounded-full px-3.5 font-semibold sm:px-4"
				onclick={openList}
				aria-label={m.map_view_list()}
				title={m.map_view_list()}
			>
				<Icon name="list" size={20} />
				<span class="hidden sm:inline">{m.map_view_list()}</span>
			</button>
			<button
				type="button"
				class="btn min-w-0 flex-1 gap-2 border-0 btn-primary"
				style="height: 3.25rem"
				onclick={recommendNearby}
				disabled={locating}
			>
				{#if locating}
					<span class="loading loading-sm loading-spinner"></span>
				{:else}
					<Icon name="location-filled" size={20} />
				{/if}
				<span class="truncate">{locating ? m.locating() : m.nearby_short()}</span>
			</button>
			<button
				type="button"
				class="glass-panel relative flex h-13 shrink-0 items-center gap-2 rounded-full px-3.5 font-semibold sm:px-4"
				onclick={() => {
					filterOpen = true;
					trackEvent('filter_sheet_opened', {});
				}}
				aria-label={m.filter_title()}
				title={m.filter_title()}
			>
				<Icon name="filter" size={20} />
				<span class="hidden sm:inline">{m.filter_title()}</span>
				{#if activeFilterCount > 0}
					<span
						class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-secondary-content shadow"
					>
						{activeFilterCount}
					</span>
				{/if}
			</button>
		</div>
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

<BottomSheet open={listOpen} onclose={() => (listOpen = false)} title={m.map_title()}>
	<div class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<p class="text-sm text-base-content/70">{m.map_count({ count: shownLocations.length })}</p>
			<button
				type="button"
				class="btn btn-sm gap-2 {hideVisited ? 'btn-soft' : 'btn-ghost'}"
				aria-pressed={hideVisited}
				onclick={toggleHideVisited}
			>
				<Icon name={hideVisited ? 'eye-off' : 'eye'} size={18} />
				{hideVisited ? m.map_show_visited() : m.map_hide_visited()}
			</button>
		</div>

		{#if shownLocations.length === 0}
			<div class="flex flex-col items-center gap-3 py-10 text-center text-base-content/70">
				<Icon name="compass" size={36} />
				<p>{m.map_no_results()}</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each shownLocations as location, index (location.id)}
					{@const visited = locationMarks.isVisited(location.id)}
					{@const wishlisted = locationMarks.isWishlisted(location.id)}
					<button
						type="button"
						class="rise-in row-link"
						style="animation-delay: {Math.min(index, 8) * 22}ms"
						onclick={() => {
							listOpen = false;
							onselect(location);
						}}
					>
						<img
							src={location.image?.url ?? placeholderImage(location.categories)}
							alt=""
							class="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
							loading="lazy"
						/>
						<span class="min-w-0 flex-1">
							<span class="flex items-center gap-1.5">
								<span class="truncate font-semibold">{localize(location.name)}</span>
								{#if wishlisted}<Icon name="star-filled" class="shrink-0 text-secondary" size={14} />{/if}
								{#if visited}<Icon name="check-circle" class="shrink-0 text-success" size={14} />{/if}
							</span>
							<span class="block truncate text-sm text-base-content/65">
								{location.nearestStation}{origin
									? ` · ${Math.round(haversineDistanceKm(origin, location.coordinates))} km`
									: ''}
							</span>
						</span>
						<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</BottomSheet>

<BottomSheet
	open={selected !== null}
	onclose={close}
	title={selected ? localize(selected.name) : ''}
	subtitle={selected?.nearestStation}
>
	{#if selected}
		<div class="space-y-5">
			{#if resultSource}
				<div class="flex flex-wrap items-center gap-2">
					<span class="chip chip-primary">
						<Icon name="sparkle" class="twinkle" size={15} />
						{resultSource === 'gps' ? m.nearby_from_gps() : m.nearby_from_map()}
					</span>
					{#if resultDistance !== null}
						<span class="chip">{m.nearby_distance({ km: resultDistance.toFixed(1) })}</span>
					{/if}
				</div>
			{/if}
			<LocationDetails location={selected} />
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn gap-2 btn-soft" onclick={recommendNearby} disabled={locating}>
					<Icon name="refresh" size={18} />
					{m.nearby_another()}
				</button>
				<button class="btn gap-2 btn-ghost" onclick={close}>
					<Icon name="map" size={18} />
					{m.show_on_map()}
				</button>
			</div>
		</div>
	{/if}
</BottomSheet>
