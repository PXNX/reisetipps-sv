<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { allCategories, allDurations, categoryIcons, categoryLabel, durationLabel } from '$lib/categories';
	import { stations, type Category, type Duration, type Location } from '$lib/data/locations';
	import { pickRecommendation, type RecommendFilters } from '$lib/recommend';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	let selectedCategories = $state<Category[]>([]);
	let selectedDuration = $state<Duration | null>(null);
	let selectedStation = $state<string | null>(null);
	let result = $state<Location | null>(null);
	let shown = $state<string[]>([]);
	let noMatches = $state(false);

	function toggleCategory(category: Category) {
		selectedCategories = selectedCategories.includes(category)
			? selectedCategories.filter((c) => c !== category)
			: [...selectedCategories, category];
		result = null;
		shown = [];
		noMatches = false;
	}

	function setDuration(duration: Duration) {
		selectedDuration = selectedDuration === duration ? null : duration;
		result = null;
		shown = [];
		noMatches = false;
	}

	function setStation(value: string) {
		selectedStation = value === '' ? null : value;
		result = null;
		shown = [];
		noMatches = false;
	}

	function recommend() {
		const filters: RecommendFilters = {
			categories: selectedCategories,
			duration: selectedDuration,
			station: selectedStation
		};
		const pick = pickRecommendation(filters, shown);
		result = pick;
		noMatches = pick === null;
		if (pick) shown = [...shown, pick.id];
	}

	function resetFilters() {
		selectedCategories = [];
		selectedDuration = null;
		selectedStation = null;
		result = null;
		shown = [];
		noMatches = false;
	}
</script>

<div class="mx-auto max-w-xl space-y-6 px-4 pt-6">
	<div>
		<p class="text-base-content/70">{m.tagline()}</p>
	</div>

	<section class="space-y-4">
		<div>
			<h2 class="mb-2 text-sm font-semibold">{m.filter_categories_label()}</h2>
			<div class="flex flex-wrap gap-2">
				{#each allCategories as category (category)}
					<button
						class="btn btn-sm {selectedCategories.includes(category) ? 'btn-primary' : 'btn-outline'}"
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
			<h2 class="mb-2 text-sm font-semibold">{m.filter_station_label()}</h2>
			<select
				class="select select-bordered w-full"
				value={selectedStation ?? ''}
				onchange={(e) => setStation(e.currentTarget.value)}
			>
				<option value="">{m.station_any()}</option>
				{#each stations as station (station)}
					<option value={station}>{station}</option>
				{/each}
			</select>
		</div>
	</section>

	{#if result}
		<section class="card bg-base-200 shadow-md">
			<div class="card-body">
				<LocationDetails location={result} />
			</div>
		</section>
		<div class="flex gap-2 pb-4">
			<button class="btn btn-primary flex-1" onclick={recommend}>{m.try_again()}</button>
			<a
				class="btn btn-outline flex-1"
				href={`${localizeHref('/map')}?focus=${result.id}`}
			>
				{m.show_on_map()}
			</a>
		</div>
	{:else if noMatches}
		<section class="card bg-base-200 shadow-md">
			<div class="card-body items-center text-center">
				<h2 class="text-lg font-semibold">{m.no_matches_title()}</h2>
				<p class="text-base-content/70">{m.no_matches_body()}</p>
				<button class="btn btn-outline mt-2" onclick={resetFilters}>{m.reset_filters()}</button>
			</div>
		</section>
	{:else}
		<button class="btn btn-primary btn-lg w-full" onclick={recommend}>{m.get_recommendation()}</button>
	{/if}
</div>
