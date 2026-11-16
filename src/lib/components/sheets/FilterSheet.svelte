<script lang="ts">
	/** All recommendation choices, kept in a sheet so the map itself stays calm. */
	import * as m from '$lib/paraglide/messages.js';
	import {
		allCategories,
		allDurations,
		categoryIcons,
		categoryLabel,
		durationLabel
	} from '$lib/categories';
	import type { Category, Duration } from '$lib/data/types';
	import { filters } from '$lib/stores/filters.svelte';
	import { trackEvent } from '$lib/telemetry';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		origin: [number, number] | null;
		locating: boolean;
		locationError: boolean;
		onuseLocation: () => void;
		onclearLocation: () => void;
	}

	let { open, onclose, origin, locating, locationError, onuseLocation, onclearLocation }: Props =
		$props();

	function toggleCategory(category: Category) {
		filters.toggleCategory(category);
		trackEvent('filter_category', { category, selected: filters.categories.includes(category) });
	}

	function setDuration(duration: Duration) {
		filters.setDuration(duration);
		trackEvent('filter_duration', { duration: filters.duration ?? 'any' });
	}

	function clear() {
		filters.reset();
		onclearLocation();
		trackEvent('filters_reset', {});
	}
</script>

<BottomSheet {open} {onclose} title={m.filter_title()}>
	<div class="space-y-5 pt-1">
		<div>
			<p class="mt-1 text-sm text-base-content/80">{m.filter_hint()}</p>
		</div>

		<section>
			<h3 class="mb-2 font-semibold">{m.filter_categories_label()}</h3>
			<div class="grid grid-cols-2 gap-2">
				{#each allCategories as category (category)}
					{@const selected = filters.categories.includes(category)}
					<button
						type="button"
						class="btn justify-start gap-2 text-left {selected ? 'btn-primary' : 'btn-outline'}"
						aria-pressed={selected}
						onclick={() => toggleCategory(category)}
					>
						<span class="text-lg leading-none" aria-hidden="true"
							>{selected ? '✓' : categoryIcons[category]}</span
						>
						<span class="leading-tight">{categoryLabel(category)}</span>
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2 font-semibold">{m.filter_duration_label()}</h3>
			<div class="grid grid-cols-3 gap-2">
				{#each allDurations as duration (duration)}
					<button
						type="button"
						class="btn {filters.duration === duration ? 'btn-primary' : 'btn-outline'}"
						aria-pressed={filters.duration === duration}
						onclick={() => setDuration(duration)}
					>
						{durationLabel(duration)}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2 font-semibold">{m.filter_location_label()}</h3>
			{#if origin}
				<div class="rounded-field bg-base-300/70 p-3">
					<p class="text-sm">
						<span aria-hidden="true">📍</span>
						{m.location_set()}: {origin[0].toFixed(2)}, {origin[1].toFixed(2)}
					</p>
					<button class="btn mt-2 w-full btn-outline" onclick={onclearLocation}>
						{m.clear_location()}
					</button>
				</div>
			{:else}
				<button class="btn w-full gap-2 btn-outline" onclick={onuseLocation} disabled={locating}>
					<span aria-hidden="true">📍</span>
					{locating ? m.locating() : m.use_my_location()}
				</button>
				<p class="mt-1 text-sm text-base-content/80">{m.location_optional_hint()}</p>
				{#if locationError}
					<p class="mt-1 text-sm text-error">{m.location_error()}</p>
				{/if}
			{/if}
		</section>

		<div class="space-y-2 border-t border-base-300 pt-4">
			<button class="btn w-full btn-lg btn-primary" onclick={onclose}>
				{m.filter_apply()}
			</button>
			{#if filters.active || origin}
				<button class="btn w-full btn-ghost" onclick={clear}>{m.reset_filters()}</button>
			{/if}
		</div>
	</div>
</BottomSheet>
