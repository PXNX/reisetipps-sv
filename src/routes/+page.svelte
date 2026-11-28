<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages.js';
	import { locations } from '$lib/data/locations';
	import type { Location } from '$lib/data/types';
	import { categoryLabel } from '$lib/categories';
	import { currentLocale, localize } from '$lib/i18n';
	import { findMatches } from '$lib/recommend';
	import { matchesQuery } from '$lib/search';
	import { haversineDistanceKm } from '$lib/geo';
	import { parseShareState, shareOrCopy, sharePath } from '$lib/share';
	import { tour } from '$lib/stores/tour.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { filters } from '$lib/stores/filters.svelte';
	import { trackEvent } from '$lib/telemetry';
	import { thumbnail } from '$lib/photos';
	import BottomSheet from '$lib/components/sheets/BottomSheet.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import FilterSheet from '$lib/components/sheets/FilterSheet.svelte';
	import LocationDetails from '$lib/components/places/LocationDetails.svelte';
	import type { MapLayer } from '$lib/mapTiles';

	let selected = $state<Location | null>(null);
	let layer = $state<MapLayer>('standard');
	let layersOpen = $state(false);
	let layerMenu = $state<HTMLElement | null>(null);

	const layerOptions: { id: MapLayer; icon: string; label: () => string }[] = [
		{ id: 'standard', icon: 'map', label: m.layer_standard },
		{ id: 'topo', icon: 'terrain', label: m.layer_topo },
		{ id: 'transit', icon: 'transit', label: m.layer_transit }
	];
	const currentLayer = $derived(layerOptions.find((option) => option.id === layer)!);
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
	let linkCopied = $state(false);

	// A shared link restores its filters, tour and open place once. After that the reader's own
	// choices win, so navigating inside the app never overwrites them again.
	let restoredFromLink = false;
	$effect(() => {
		if (restoredFromLink || !browser) return;
		restoredFromLink = true;
		const state = parseShareState(page.url.searchParams);
		if (state.categories?.length) filters.categories = state.categories;
		if (state.duration) filters.duration = state.duration;
		if (state.query) query = state.query;
		if (state.tour) tour.setStops(state.tour);
		if (state.mode) tour.setMode(state.mode);
		const id = state.focus;
		if (id) {
			selected = locations.find((location) => location.id === id) ?? null;
			focusId = id;
		}
	});

	/** Copies a link that opens this exact view, including the current filters and search. */
	async function shareView() {
		const path = sharePath({
			categories: filters.categories,
			duration: filters.duration,
			query
		});
		const url = new URL(path, page.url.origin).href;
		const result = await shareOrCopy(url, m.app_name(), m.share_hint());
		linkCopied = result !== 'failed';
		trackEvent('view_shared', { result, places: shownLocations.length });
		setTimeout(() => (linkCopied = false), 2600);
	}

	/** Places on the map: filters, search and visited state applied, nearest first when located. */
	const shownLocations = $derived.by(() => {
		const cats = filters.categories;
		const dur = filters.duration;
		const locale = currentLocale();
		const list = locations.filter((location) => {
			if (hideVisited && locationMarks.isVisited(location.id)) return false;
			if (cats.length > 0 && !location.categories.some((c) => cats.includes(c))) return false;
			if (dur && !location.duration.includes(dur)) return false;
			return matchesQuery(location, query, locale);
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

	function setLayer(next: MapLayer) {
		layer = next;
		layersOpen = false;
		trackEvent('map_layer_changed', { layer: next });
	}

	/** The layer menu closes on any tap outside it, e.g. when the reader starts panning. */
	function onWindowPointerDown(event: PointerEvent) {
		if (layersOpen && layerMenu && !layerMenu.contains(event.target as Node)) layersOpen = false;
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
<svelte:window onpointerdown={onWindowPointerDown} />

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

	<!-- Search shares the top row with the wishlist and settings buttons from the layout, which
	     sit in the top-right corner (2 × 2.75rem plus gaps), so the map below stays uncovered. -->
	<div
		class="pointer-events-none absolute top-[max(0.5rem,env(safe-area-inset-top))] right-[7.25rem] left-3 z-[1000] sm:right-auto sm:left-4 sm:w-[26rem]"
	>
		<div
			class="glass-panel pointer-events-auto flex h-11 items-center gap-1 rounded-full pr-1 pl-3.5 transition-shadow duration-200 focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_22%,transparent)]"
		>
			<Icon name="search" class="shrink-0 text-base-content/55" />
			<input
				type="search"
				class="field-bare h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-base outline-none placeholder:text-base-content/45"
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
									src={thumbnail(location)}
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

	<!-- Layer switcher. Phones and tablets get one small button with a menu under the top-right
	     buttons; wide screens have room for the labelled control in the top row. -->
	{#if !query.trim()}
		<div
			bind:this={layerMenu}
			class="absolute top-[calc(max(0.5rem,env(safe-area-inset-top))+3.25rem)] right-3 z-[1000] flex flex-col items-end gap-2 lg:hidden"
		>
			<button
				type="button"
				class="icon-btn text-base-content/85 shadow-[var(--shadow-float)]"
				aria-label="{m.map_layers()}: {currentLayer.label()}"
				title={m.map_layers()}
				aria-expanded={layersOpen}
				onclick={() => (layersOpen = !layersOpen)}
			>
				<Icon name={currentLayer.icon} size={21} />
			</button>
			{#if layersOpen}
				<div
					class="glass-panel pop-in flex origin-top-right flex-col gap-0.5 rounded-2xl p-1.5"
					role="group"
					aria-label={m.map_layers()}
				>
					{#each layerOptions as option (option.id)}
						<button
							type="button"
							class="seg-btn justify-start rounded-xl"
							aria-pressed={layer === option.id}
							onclick={() => setLayer(option.id)}
						>
							<Icon name={option.icon} />
							{option.label()}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- The wrapper carries the breakpoint: .seg sets its own display, which would win over `hidden`. -->
		<div
			class="absolute top-[max(0.5rem,env(safe-area-inset-top))] right-[7.25rem] z-[1000] hidden lg:block"
		>
			<div class="seg" role="group" aria-label={m.map_layers()}>
				{#each layerOptions as option (option.id)}
					<button
						type="button"
						class="seg-btn"
						aria-pressed={layer === option.id}
						onclick={() => setLayer(option.id)}
					>
						<Icon name={option.icon} />
						{option.label()}
					</button>
				{/each}
			</div>
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
					<button class="btn btn-soft btn-sm" onclick={() => (filterOpen = true)}>
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
			<div class="ml-auto flex items-center gap-2">
				<button
					type="button"
					class="btn gap-2 btn-sm {linkCopied ? 'btn-soft' : 'btn-ghost'}"
					onclick={shareView}
					aria-live="polite"
				>
					<Icon name={linkCopied ? 'check' : 'arrow-right'} size={18} />
					{linkCopied ? m.share_copied() : m.share_view()}
				</button>
				<button
					type="button"
					class="btn gap-2 btn-sm {hideVisited ? 'btn-soft' : 'btn-ghost'}"
					aria-pressed={hideVisited}
					onclick={toggleHideVisited}
				>
					<Icon name={hideVisited ? 'eye-off' : 'eye'} size={18} />
					{hideVisited ? m.map_show_visited() : m.map_hide_visited()}
				</button>
			</div>
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
							src={thumbnail(location)}
							alt=""
							class="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
							loading="lazy"
						/>
						<span class="min-w-0 flex-1">
							<span class="flex items-center gap-1.5">
								<span class="truncate font-semibold">{localize(location.name)}</span>
								{#if wishlisted}<Icon
										name="star-filled"
										class="shrink-0 text-secondary"
										size={14}
									/>{/if}
								{#if visited}<Icon
										name="check-circle"
										class="shrink-0 text-success"
										size={14}
									/>{/if}
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
