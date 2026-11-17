<script lang="ts">
	/** All recommendation choices, kept in a sheet so the map itself stays calm. */
	import * as m from '$lib/paraglide/messages.js';
	import Icon from '../ui/Icon.svelte';
	import { allCategories, allDurations, categoryLabel, durationLabel } from '$lib/categories';
	import type { Category, Duration } from '$lib/data/types';
	import { categoryIcons } from '$lib/icons';
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
	<div class="space-y-6">
		<p class="text-sm leading-relaxed text-base-content/70">{m.filter_hint()}</p>

		<section>
			<h3 class="mb-2.5 text-sm font-bold tracking-wide text-base-content/80 uppercase">
				{m.filter_categories_label()}
			</h3>
			<div class="grid grid-cols-2 gap-2">
				{#each allCategories as category (category)}
					{@const selected = filters.categories.includes(category)}
					<button
						type="button"
						class="option"
						aria-pressed={selected}
						onclick={() => toggleCategory(category)}
					>
						<Icon name={categoryIcons[category]} size={19} class="shrink-0" />
						<span class="min-w-0 flex-1 truncate leading-tight">{categoryLabel(category)}</span>
						{#if selected}
							<Icon name="check" size={17} class="pop-in shrink-0" />
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2.5 text-sm font-bold tracking-wide text-base-content/80 uppercase">
				{m.filter_duration_label()}
			</h3>
			<div class="grid grid-cols-3 gap-2">
				{#each allDurations as duration (duration)}
					<button
						type="button"
						class="option option-center px-2 text-center text-sm"
						aria-pressed={filters.duration === duration}
						onclick={() => setDuration(duration)}
					>
						<span class="leading-tight">{durationLabel(duration)}</span>
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2.5 text-sm font-bold tracking-wide text-base-content/80 uppercase">
				{m.filter_location_label()}
			</h3>
			{#if origin}
				<div class="surface space-y-3 p-3.5">
					<p class="flex items-center gap-2 text-sm">
						<span class="icon-tile h-8 w-8 rounded-lg"><Icon name="location" size={17} /></span>
						<span class="font-semibold">{m.location_set()}</span>
						<span class="ml-auto text-xs text-base-content/55 tabular-nums">
							{origin[0].toFixed(2)}, {origin[1].toFixed(2)}
						</span>
					</p>
					<button class="btn w-full gap-2 btn-soft" onclick={onclearLocation}>
						<Icon name="close" size={18} />
						{m.clear_location()}
					</button>
				</div>
			{:else}
				<button class="btn w-full gap-2 btn-soft" onclick={onuseLocation} disabled={locating}>
					{#if locating}
						<span class="loading loading-sm loading-spinner"></span>
					{:else}
						<Icon name="location-filled" size={18} />
					{/if}
					{locating ? m.locating() : m.use_my_location()}
				</button>
				<p class="mt-2 text-sm leading-snug text-base-content/60">{m.location_optional_hint()}</p>
				{#if locationError}
					<p class="mt-2 flex items-center gap-1.5 text-sm text-error">
						<Icon name="info" size={16} />
						{m.location_error()}
					</p>
				{/if}
			{/if}
		</section>

		<div class="space-y-2 border-t border-white/8 pt-5">
			<button class="btn w-full gap-2 btn-lg btn-primary" onclick={onclose}>
				<Icon name="check" size={20} />
				{m.filter_apply()}
			</button>
			{#if filters.active || origin}
				<button class="btn w-full btn-ghost" onclick={clear}>{m.reset_filters()}</button>
			{/if}
		</div>
	</div>
</BottomSheet>

<style>
	.option {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.9rem;
		padding: 0.5rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 0.9rem;
		background: var(--surface);
		font-size: 0.95rem;
		font-weight: 600;
		text-align: left;
		transition:
			background-color 180ms ease-out,
			border-color 180ms ease-out,
			color 180ms ease-out,
			transform 160ms var(--ease-out-soft);
	}

	.option:hover {
		background: var(--surface-hover);
		border-color: var(--line-strong);
	}

	.option:active {
		transform: scale(0.97);
	}

	.option[aria-pressed='true'] {
		border-color: color-mix(in oklab, var(--color-primary) 45%, transparent);
		background: color-mix(in oklab, var(--color-primary) 14%, transparent);
		color: var(--color-primary);
	}

	.option-center {
		justify-content: center;
	}
</style>
