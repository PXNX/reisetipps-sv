<script lang="ts">
	/**
	 * The small pause between asking for a recommendation and seeing it: a postcard settles into
	 * place, then the details sheet takes over. Tapping anywhere skips straight to the details.
	 */
	import * as m from '$lib/paraglide/messages.js';
	import { localize } from '$lib/i18n';
	import { categoryLabel } from '$lib/categories';
	import { mediumPhoto, thumbnail } from '$lib/photos';
	import Icon from '../ui/Icon.svelte';
	import type { Location } from '$lib/data/types';

	interface Props {
		location: Location;
		distanceKm?: number | null;
		oncontinue: () => void;
	}

	let { location, distanceKm = null, oncontinue }: Props = $props();

	const photo = $derived(location.image ? mediumPhoto(location.image.url) : thumbnail(location));
</script>

<div class="fixed inset-0 z-[1200] flex items-center justify-center px-5">
	<button
		type="button"
		class="absolute inset-0 cursor-default bg-[#04101c]/80"
		aria-label={m.reveal_continue()}
		onclick={oncontinue}
	></button>

	<div
		class="reveal-card glass-panel rise-in relative w-full max-w-sm overflow-hidden rounded-[1.6rem] p-2"
	>
		<button type="button" class="block w-full text-left" onclick={oncontinue}>
			<img
				src={photo}
				alt={localize(location.name)}
				class="h-52 w-full rounded-[1.15rem] object-cover sm:h-60"
			/>
			<div class="px-3 pt-4 pb-3">
				<p class="flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary uppercase">
					<Icon name="sparkle" class="twinkle" size={15} />
					{m.reveal_label()}
				</p>
				<h2 class="mt-1.5 text-2xl leading-tight font-bold">{localize(location.name)}</h2>
				<p class="mt-1 text-sm text-base-content/70">
					{location.nearestStation} · {categoryLabel(
						location.categories[0] ?? 'nature'
					)}{distanceKm !== null ? ` · ${m.nearby_distance({ km: distanceKm.toFixed(1) })}` : ''}
				</p>
				<span class="btn mt-4 flex w-full gap-2 btn-primary">
					{m.reveal_continue()}
					<Icon name="arrow-right" size={18} />
				</span>
			</div>
		</button>
	</div>
</div>

<style>
	.reveal-card {
		box-shadow: var(--shadow-sheet);
		animation: reveal-in 420ms var(--ease-spring) both;
	}

	@keyframes reveal-in {
		from {
			opacity: 0;
			transform: translateY(18px) scale(0.95) rotate(-1.5deg);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
