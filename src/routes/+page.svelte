<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import {
		allCategories,
		allDurations,
		categoryIcons,
		categoryLabel,
		durationLabel
	} from '$lib/categories';
	import type { Category, Duration, Location } from '$lib/data/locations';
	import { pickRecommendation, type RecommendFilters } from '$lib/recommend';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	let selectedCategories = $state<Category[]>([]);
	let selectedDuration = $state<Duration | null>(null);
	let origin = $state<[number, number] | null>(null);
	let manualLat = $state('');
	let manualLng = $state('');
	let locating = $state(false);
	let locationError = $state(false);
	let result = $state<Location | null>(null);
	let shown = $state<string[]>([]);
	let noMatches = $state(false);

	function resetResult() {
		result = null;
		shown = [];
		noMatches = false;
	}

	function toggleCategory(category: Category) {
		selectedCategories = selectedCategories.includes(category)
			? selectedCategories.filter((c) => c !== category)
			: [...selectedCategories, category];
		resetResult();
	}

	function setDuration(duration: Duration) {
		selectedDuration = selectedDuration === duration ? null : duration;
		resetResult();
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
				manualLat = origin[0].toFixed(5);
				manualLng = origin[1].toFixed(5);
				locating = false;
				resetResult();
			},
			() => {
				locating = false;
				locationError = true;
			},
			{ timeout: 10_000 }
		);
	}

	function applyManualLocation() {
		const lat = Number(manualLat);
		const lng = Number(manualLng);
		if (Number.isFinite(lat) && Number.isFinite(lng) && manualLat !== '' && manualLng !== '') {
			origin = [lat, lng];
			locationError = false;
			resetResult();
		}
	}

	function clearLocation() {
		origin = null;
		manualLat = '';
		manualLng = '';
		locationError = false;
		resetResult();
	}

	function recommend() {
		const filters: RecommendFilters = {
			categories: selectedCategories,
			duration: selectedDuration,
			origin
		};
		const pick = pickRecommendation(filters, shown);
		result = pick;
		noMatches = pick === null;
		if (pick) shown = [...shown, pick.id];
	}

	function resetFilters() {
		selectedCategories = [];
		selectedDuration = null;
		clearLocation();
	}
</script>

<div class="mx-auto max-w-xl space-y-6 px-4 pt-6">
	<section class="space-y-4">
		<div>
			<h2 class="mb-2 text-sm font-semibold">{m.filter_categories_label()}</h2>
			<div class="flex flex-wrap gap-2">
				{#each allCategories as category (category)}
					<button
						class="btn btn-sm {selectedCategories.includes(category)
							? 'btn-primary'
							: 'btn-outline'}"
						onclick={() => toggleCategory(category)}
					>
						<span aria-hidden="true">{categoryIcons[category]}</span>
						{categoryLabel(category)}
					</button>
				{/each}
			</div>
		</div>

		<div>
			<h2 class="mb-2 text-sm font-semibold">{m.filter_duration_label()}</h2>
			<div class="flex flex-wrap gap-2">
				{#each allDurations as duration (duration)}
					<button
						class="btn btn-sm {selectedDuration === duration ? 'btn-primary' : 'btn-outline'}"
						onclick={() => setDuration(duration)}
					>
						{durationLabel(duration)}
					</button>
				{/each}
			</div>
		</div>

		<div>
			<h2 class="mb-2 text-sm font-semibold">{m.filter_location_label()}</h2>
			{#if origin}
				<div
					class="flex items-center justify-between gap-2 rounded-field bg-base-300/60 px-3 py-2 text-sm"
				>
					<span>📍 {m.location_set()}: {origin[0].toFixed(3)}, {origin[1].toFixed(3)}</span>
					<button
						class="btn btn-circle btn-ghost btn-xs"
						onclick={clearLocation}
						aria-label={m.clear_location()}
					>
						✕
					</button>
				</div>
			{:else}
				<button class="btn btn-outline btn-sm" onclick={useMyLocation} disabled={locating}>
					📍 {locating ? m.locating() : m.use_my_location()}
				</button>
				{#if locationError}
					<p class="mt-1 text-xs text-error">{m.location_error()}</p>
				{/if}
				<div class="mt-2 flex flex-wrap items-center gap-2">
					<span class="text-xs text-base-content/60">{m.location_manual_hint()}</span>
					<input
						type="number"
						step="any"
						placeholder={m.latitude()}
						class="input-bordered input w-28 input-sm"
						bind:value={manualLat}
						onchange={applyManualLocation}
					/>
					<input
						type="number"
						step="any"
						placeholder={m.longitude()}
						class="input-bordered input w-28 input-sm"
						bind:value={manualLng}
						onchange={applyManualLocation}
					/>
				</div>
			{/if}
		</div>
	</section>

	{#if result}
		<section class="card bg-base-200 shadow-md">
			<div class="card-body">
				<LocationDetails location={result} />
			</div>
		</section>
		<div class="flex gap-2 pb-4">
			<button class="btn flex-1 btn-primary" onclick={recommend}>{m.try_again()}</button>
			<a class="btn flex-1 btn-outline" href={`${localizeHref('/map')}?focus=${result.id}`}>
				{m.show_on_map()}
			</a>
		</div>
	{:else if noMatches}
		<section class="card bg-base-200 shadow-md">
			<div class="card-body items-center text-center">
				<h2 class="text-lg font-semibold">{m.no_matches_title()}</h2>
				<p class="text-base-content/70">{m.no_matches_body()}</p>
				<button class="btn mt-2 btn-outline" onclick={resetFilters}>{m.reset_filters()}</button>
			</div>
		</section>
	{:else}
		<button class="btn w-full btn-lg btn-primary" onclick={recommend}
			>{m.get_recommendation()}</button
		>
	{/if}
</div>
