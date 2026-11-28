<script lang="ts">
	/**
	 * The tour planner: a floating button once stops exist, opening a sheet where the reader
	 * orders the stops, picks walking or cycling and hands the route to Google Maps. Stops are added
	 * from the details view of any place.
	 */
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { localize } from '$lib/i18n';
	import { tour, tourRouteUrl } from '$lib/stores/tour.svelte';
	import { filters } from '$lib/stores/filters.svelte';
	import { shareOrCopy, sharePath } from '$lib/share';
	import { trackEvent } from '$lib/telemetry';
	import BottomSheet from './BottomSheet.svelte';
	import Icon from '../ui/Icon.svelte';

	let open = $state(false);
	let linkCopied = $state(false);

	const plan = $derived(tour.plan);
	const routeUrl = $derived(tourRouteUrl(plan, tour.mode));

	function openPlanner() {
		open = true;
		trackEvent('tour_opened', { stops: tour.count, mode: tour.mode });
	}

	/** A link restores these stops and the active filters in the recipient's app. */
	async function sharePlan() {
		const path = sharePath({
			tour: plan.map((stop) => stop.id),
			mode: tour.mode,
			categories: filters.categories,
			duration: filters.duration
		});
		const url = new URL(path, page.url.origin).href;
		const result = await shareOrCopy(url, m.app_name(), m.share_hint());
		linkCopied = result !== 'failed';
		trackEvent('tour_shared', { result, stops: tour.count });
		setTimeout(() => (linkCopied = false), 2600);
	}
</script>

{#if tour.count > 0}
	<button
		type="button"
		class="pop-in btn fixed right-3 z-[1000] gap-2 rounded-full pr-4 pl-3 shadow-xl btn-primary"
		style="bottom: calc(5.25rem + env(safe-area-inset-bottom))"
		onclick={openPlanner}
		aria-label={`${m.tour_title()} (${tour.count})`}
	>
		<Icon name={tour.mode === 'bike' ? 'bike' : 'walk'} size={20} />
		<span>{m.tour_title()}</span>
		<span
			class="grid h-6 min-w-6 place-items-center rounded-full bg-primary-content/15 px-1 text-sm font-bold tabular-nums"
		>
			{tour.count}
		</span>
	</button>
{/if}

<BottomSheet {open} onclose={() => (open = false)} title={m.tour_title()}>
	<div class="space-y-5">
		<p class="text-sm text-base-content/70">{m.tour_stops_count({ count: tour.count })}</p>

		<div class="seg w-full">
			<button
				class="seg-btn h-10 flex-1"
				aria-pressed={tour.mode === 'walk'}
				onclick={() => tour.setMode('walk')}
			>
				<Icon name="walk" size={18} />
				{m.tour_mode_walk()}
			</button>
			<button
				class="seg-btn h-10 flex-1"
				aria-pressed={tour.mode === 'bike'}
				onclick={() => tour.setMode('bike')}
			>
				<Icon name="bike" size={18} />
				{m.tour_mode_bike()}
			</button>
		</div>

		{#if plan.length === 0}
			<div class="flex flex-col items-center gap-3 py-8 text-center text-base-content/70">
				<Icon name="walk" size={36} />
				<p>{m.tour_empty()}</p>
			</div>
		{:else}
			<ol class="space-y-2">
				{#each plan as stop, index (stop.id)}
					<li class="surface flex items-center gap-2 px-2 py-2">
						<span
							class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary tabular-nums"
						>
							{index + 1}
						</span>
						<span class="min-w-0 flex-1 truncate font-medium">{localize(stop.name)}</span>
						<button
							class="icon-btn h-9 w-9 border-0 bg-transparent disabled:opacity-30"
							onclick={() => tour.move(stop.id, -1)}
							disabled={index === 0}
							aria-label={m.tour_move_up()}
						>
							<Icon name="chevron-up" size={18} />
						</button>
						<button
							class="icon-btn h-9 w-9 border-0 bg-transparent disabled:opacity-30"
							onclick={() => tour.move(stop.id, 1)}
							disabled={index === plan.length - 1}
							aria-label={m.tour_move_down()}
						>
							<Icon name="chevron-down" size={18} />
						</button>
						<button
							class="icon-btn h-9 w-9 border-0 bg-transparent text-base-content/50 hover:text-error"
							onclick={() => tour.remove(stop.id)}
							aria-label={m.tour_remove()}
						>
							<Icon name="close" size={18} />
						</button>
					</li>
				{/each}
			</ol>

			<!-- eslint-disable svelte/no-navigation-without-resolve -- external Google Maps route -->
			<a
				href={routeUrl}
				target="_blank"
				rel="noreferrer"
				class="btn w-full gap-2 btn-lg btn-primary"
				onclick={() => trackEvent('tour_route_opened', { stops: tour.count, mode: tour.mode })}
			>
				<Icon name="navigation" size={20} />
				{m.tour_open()}
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
			<p class="text-center text-sm text-base-content/60">{m.tour_open_hint()}</p>
			<button class="btn w-full gap-2 btn-soft" onclick={sharePlan} aria-live="polite">
				<Icon name={linkCopied ? 'check' : 'arrow-right'} size={19} />
				{linkCopied ? m.share_copied() : m.share_plan()}
			</button>
			<button class="btn w-full gap-2 btn-ghost" onclick={() => tour.clear()}>
				<Icon name="remove" size={18} />
				{m.tour_clear()}
			</button>
		{/if}
	</div>
</BottomSheet>
