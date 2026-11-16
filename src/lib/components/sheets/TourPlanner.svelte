<script lang="ts">
	/**
	 * The tour planner: a floating button once stops exist, opening a sheet where the reader
	 * orders the stops, picks walking or cycling and hands the route to Google Maps. Stops are added
	 * from the details view of any place.
	 */
	import * as m from '$lib/paraglide/messages.js';
	import { localize } from '$lib/i18n';
	import { tour, tourRouteUrl } from '$lib/stores/tour.svelte';
	import { trackEvent } from '$lib/telemetry';
	import BottomSheet from './BottomSheet.svelte';

	let open = $state(false);

	const plan = $derived(tour.plan);
	const routeUrl = $derived(tourRouteUrl(plan, tour.mode));

	function openPlanner() {
		open = true;
		trackEvent('tour_opened', { stops: tour.count, mode: tour.mode });
	}
</script>

{#if tour.count > 0}
	<button
		type="button"
		class="btn fixed right-4 z-30 gap-2 rounded-full shadow-lg btn-lg btn-primary"
		style="bottom: calc(1rem + env(safe-area-inset-bottom))"
		onclick={openPlanner}
		aria-label={`${m.tour_title()} (${tour.count})`}
	>
		<span aria-hidden="true">{tour.mode === 'bike' ? '🚲' : '🚶'}</span>
		<span>{m.tour_title()} ({tour.count})</span>
	</button>
{/if}

<BottomSheet {open} onclose={() => (open = false)} title={m.tour_title()}>
	<div class="space-y-4 pt-1">
		<p class="text-sm text-base-content/80">{m.tour_stops_count({ count: tour.count })}</p>

		<div class="join w-full">
			<button
				class="btn join-item flex-1 {tour.mode === 'walk' ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={tour.mode === 'walk'}
				onclick={() => tour.setMode('walk')}
			>
				<span aria-hidden="true">🚶</span>
				{m.tour_mode_walk()}
			</button>
			<button
				class="btn join-item flex-1 {tour.mode === 'bike' ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={tour.mode === 'bike'}
				onclick={() => tour.setMode('bike')}
			>
				<span aria-hidden="true">🚲</span>
				{m.tour_mode_bike()}
			</button>
		</div>

		{#if plan.length === 0}
			<p>{m.tour_empty()}</p>
		{:else}
			<ol class="space-y-2">
				{#each plan as stop, index (stop.id)}
					<li class="flex items-center gap-2 rounded-field bg-base-300/60 px-2 py-2">
						<span class="badge shrink-0 badge-neutral">{index + 1}</span>
						<span class="min-w-0 flex-1 truncate text-base font-medium">{localize(stop.name)}</span>
						<button
							class="btn btn-ghost px-2"
							onclick={() => tour.move(stop.id, -1)}
							disabled={index === 0}
							aria-label={m.tour_move_up()}
						>
							↑
						</button>
						<button
							class="btn btn-ghost px-2"
							onclick={() => tour.move(stop.id, 1)}
							disabled={index === plan.length - 1}
							aria-label={m.tour_move_down()}
						>
							↓
						</button>
						<button
							class="btn gap-1 btn-ghost px-2 text-sm"
							onclick={() => tour.remove(stop.id)}
							aria-label={m.tour_remove()}
						>
							<span aria-hidden="true">✕</span>
						</button>
					</li>
				{/each}
			</ol>

			<!-- eslint-disable svelte/no-navigation-without-resolve -- external Google Maps route -->
			<a
				href={routeUrl}
				target="_blank"
				rel="noreferrer"
				class="btn w-full btn-lg btn-primary"
				onclick={() => trackEvent('tour_route_opened', { stops: tour.count, mode: tour.mode })}
			>
				<span aria-hidden="true">🧭</span>
				{m.tour_open()}
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
			<p class="text-center text-sm text-base-content/80">{m.tour_open_hint()}</p>
			<button class="btn w-full btn-ghost" onclick={() => tour.clear()}>
				{m.tour_clear()}
			</button>
		{/if}
	</div>
</BottomSheet>
