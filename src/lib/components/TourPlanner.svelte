<script lang="ts">
	/**
	 * The tour planner: a small floating button once stops exist, opening a sheet where the reader
	 * orders the stops, picks walking or cycling and hands the route to Google Maps. Stops are added
	 * from the details view of any place.
	 */
	import * as m from '$lib/paraglide/messages.js';
	import { localize } from '$lib/i18n';
	import { tour, tourRouteUrl } from '$lib/stores/tour.svelte';
	import BottomSheet from './BottomSheet.svelte';

	let open = $state(false);

	const plan = $derived(tour.plan);
	const routeUrl = $derived(tourRouteUrl(plan, tour.mode));
</script>

{#if tour.count > 0}
	<button
		type="button"
		class="btn fixed right-4 z-30 gap-2 rounded-full shadow-lg btn-primary"
		style="bottom: calc(4.75rem + env(safe-area-inset-bottom))"
		onclick={() => (open = true)}
		aria-label={m.tour_title()}
	>
		<span aria-hidden="true">{tour.mode === 'bike' ? '🚲' : '🚶'}</span>
		<span>{tour.count}</span>
	</button>
{/if}

<BottomSheet {open} onclose={() => (open = false)}>
	<div class="space-y-4 pt-1">
		<div class="flex items-baseline justify-between gap-2">
			<h2 class="text-xl font-semibold">{m.tour_title()}</h2>
			<span class="text-sm text-base-content/60">{m.tour_stops_count({ count: tour.count })}</span>
		</div>

		<div class="join w-full">
			<button
				class="btn join-item flex-1 {tour.mode === 'walk' ? 'btn-primary' : 'btn-outline'}"
				onclick={() => tour.setMode('walk')}
			>
				<span aria-hidden="true">🚶</span>
				{m.tour_mode_walk()}
			</button>
			<button
				class="btn join-item flex-1 {tour.mode === 'bike' ? 'btn-primary' : 'btn-outline'}"
				onclick={() => tour.setMode('bike')}
			>
				<span aria-hidden="true">🚲</span>
				{m.tour_mode_bike()}
			</button>
		</div>

		{#if plan.length === 0}
			<p class="text-sm text-base-content/70">{m.tour_empty()}</p>
		{:else}
			<ol class="space-y-2">
				{#each plan as stop, index (stop.id)}
					<li class="flex items-center gap-1 rounded-field bg-base-300/60 px-2 py-1.5">
						<span class="w-5 shrink-0 text-center text-xs font-semibold text-base-content/50">
							{index + 1}
						</span>
						<span class="min-w-0 flex-1 truncate text-sm">{localize(stop.name)}</span>
						<button
							class="btn btn-circle btn-ghost btn-xs"
							onclick={() => tour.move(stop.id, -1)}
							disabled={index === 0}
							aria-label={m.tour_move_up()}
						>
							↑
						</button>
						<button
							class="btn btn-circle btn-ghost btn-xs"
							onclick={() => tour.move(stop.id, 1)}
							disabled={index === plan.length - 1}
							aria-label={m.tour_move_down()}
						>
							↓
						</button>
						<button
							class="btn btn-circle btn-ghost btn-xs"
							onclick={() => tour.remove(stop.id)}
							aria-label={m.tour_remove()}
						>
							✕
						</button>
					</li>
				{/each}
			</ol>

			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external Google Maps route -->
			<a href={routeUrl} target="_blank" rel="noreferrer" class="btn w-full btn-primary">
				<span aria-hidden="true">🧭</span>
				{m.tour_open()}
			</a>
			<p class="text-center text-xs text-base-content/50">{m.tour_open_hint()}</p>
			<button class="btn w-full btn-ghost btn-sm" onclick={() => tour.clear()}>
				{m.tour_clear()}
			</button>
		{/if}
	</div>
</BottomSheet>
