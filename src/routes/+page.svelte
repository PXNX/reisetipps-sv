<script lang="ts">
	import { tick } from 'svelte';
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
	import { pickRecommendation } from '$lib/recommend';
	import { trackEvent } from '$lib/telemetry';
	import { filters } from '$lib/stores/filters.svelte';
	import LocationDetails from '$lib/components/LocationDetails.svelte';

	let origin = $state<[number, number] | null>(null);
	let locating = $state(false);
	let locationError = $state(false);
	let result = $state<Location | null>(null);
	let shown = $state<string[]>([]);
	let noMatches = $state(false);
	let resultEl = $state<HTMLElement | null>(null);

	function resetResult() {
		result = null;
		shown = [];
		noMatches = false;
	}

	function toggleCategory(category: Category) {
		filters.toggleCategory(category);
		resetResult();
		trackEvent('filter_category', {
			category,
			selected: filters.categories.includes(category)
		});
	}

	function setDuration(duration: Duration) {
		filters.setDuration(duration);
		resetResult();
		trackEvent('filter_duration', { duration: filters.duration ?? 'any' });
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
				resetResult();
				trackEvent('filter_location', { used: true });
			},
			() => {
				locating = false;
				locationError = true;
			},
			// Rough, network-based location is enough to rank nearby spots — no need for a precise GPS fix.
			{ enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 }
		);
	}

	function clearLocation() {
		origin = null;
		locationError = false;
		resetResult();
		trackEvent('filter_location', { used: false });
	}

	async function scrollToResult() {
		await tick();
		if (!resultEl) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		resultEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
	}

	function recommend(trigger: 'surprise' | 'filters' | 'again' = 'filters') {
		const pick = pickRecommendation(
			{ categories: filters.categories, duration: filters.duration, origin },
			shown
		);
		result = pick;
		noMatches = pick === null;
		if (pick) shown = [...shown, pick.id];
		trackEvent('recommendation_shown', {
			trigger,
			categories: filters.categories.length,
			duration: filters.duration ?? 'any',
			nearby: origin !== null,
			place: pick?.id ?? null
		});
		void scrollToResult();
	}

	/** The one-tap path: clear any choices and let the app pick purely at random. */
	function surprise() {
		filters.reset();
		resetResult();
		recommend('surprise');
	}

	function resetFilters() {
		filters.reset();
		clearLocation();
	}
</script>

<div class="mx-auto max-w-2xl space-y-6 px-4 pt-6 pb-8">
	<section class="rounded-box bg-gradient-to-br from-base-200 to-base-300 p-5 shadow-md">
		<p class="text-sm font-semibold tracking-wide text-primary uppercase">{m.home_eyebrow()}</p>
		<h1 class="mt-1 text-3xl leading-tight font-bold">{m.home_heading()}</h1>
		<p class="mt-2">{m.home_intro()}</p>
		<div class="mt-5 grid gap-3">
			<button class="btn btn-primary btn-lg w-full" onclick={surprise}>
				{m.home_surprise()}
			</button>
			<a class="btn btn-outline btn-lg w-full" href={localizeHref('/karte')}>
				{m.home_all_places()}
			</a>
		</div>
	</section>

	{#if result || noMatches}
		<section bind:this={resultEl} class="scroll-mt-4 space-y-3">
			<h2 class="text-xl font-bold">{m.home_result_heading()}</h2>
			{#if result}
				<section class="card bg-base-200 shadow-md">
					<div class="card-body p-4 sm:p-5">
						<LocationDetails location={result} />
					</div>
				</section>
				<div class="grid gap-3 sm:grid-cols-2">
					<button class="btn btn-primary btn-lg" onclick={() => recommend('again')}>
						{m.try_again()}
					</button>
					<a
						class="btn btn-outline btn-lg"
						href={`${localizeHref('/karte')}?focus=${result.id}`}
					>
						{m.show_on_map()}
					</a>
				</div>
			{:else}
				<section class="card bg-base-200 p-5 text-center shadow-md">
					<h3 class="text-xl font-semibold">{m.no_matches_title()}</h3>
					<p class="mt-2">{m.no_matches_body()}</p>
					<button class="btn btn-outline btn-lg mt-4" onclick={resetFilters}>
						{m.reset_filters()}
					</button>
				</section>
			{/if}
		</section>
	{/if}

	<section class="card space-y-6 bg-base-200/60 p-4 sm:p-5">
		<div>
			<h2 class="text-2xl font-bold">{m.home_choose_heading()}</h2>
			<p class="mt-1 text-base text-base-content/80">{m.home_choose_hint()}</p>
		</div>

		<div>
			<h3 class="mb-2 text-lg font-semibold">{m.filter_categories_label()}</h3>
			<div class="grid grid-cols-2 gap-3">
				{#each allCategories as category (category)}
					{@const selected = filters.categories.includes(category)}
					<button
						type="button"
						class="btn btn-lg justify-start gap-2 text-left {selected
							? 'btn-primary'
							: 'btn-outline'}"
						aria-pressed={selected}
						onclick={() => toggleCategory(category)}
					>
						<span class="text-xl leading-none" aria-hidden="true"
							>{selected ? '✓' : categoryIcons[category]}</span
						>
						<span class="leading-tight">{categoryLabel(category)}</span>
					</button>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="mb-2 text-lg font-semibold">{m.filter_duration_label()}</h3>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
				{#each allDurations as duration (duration)}
					<button
						type="button"
						class="btn btn-lg {filters.duration === duration ? 'btn-primary' : 'btn-outline'}"
						aria-pressed={filters.duration === duration}
						onclick={() => setDuration(duration)}
					>
						{durationLabel(duration)}
					</button>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="mb-2 text-lg font-semibold">{m.filter_location_label()}</h3>
			{#if origin}
				<div class="rounded-field bg-base-300/70 p-3">
					<p class="text-base">
						<span aria-hidden="true">📍</span> {m.location_set()}: {origin[0].toFixed(2)}, {origin[1].toFixed(2)}
					</p>
					<button class="btn btn-outline mt-3 w-full" onclick={clearLocation}>
						{m.clear_location()}
					</button>
				</div>
			{:else}
				<button class="btn btn-outline btn-lg w-full gap-2" onclick={useMyLocation} disabled={locating}>
					<span aria-hidden="true">📍</span>
					{locating ? m.locating() : m.use_my_location()}
				</button>
				<p class="mt-2 text-base text-base-content/80">{m.location_optional_hint()}</p>
				{#if locationError}
					<p class="mt-1 text-base text-error">{m.location_error()}</p>
				{/if}
			{/if}
		</div>

		<div class="space-y-3 border-t border-base-300 pt-4">
			<button class="btn btn-primary btn-lg w-full" onclick={() => recommend('filters')}>
				{m.home_filter_cta()}
			</button>
			{#if filters.active}
				<button class="btn btn-ghost w-full" onclick={resetFilters}>
					{m.reset_filters()}
				</button>
			{/if}
		</div>
	</section>
</div>
