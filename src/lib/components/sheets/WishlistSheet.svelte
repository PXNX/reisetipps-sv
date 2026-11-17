<script lang="ts">
	/**
	 * The "da will ich hin" menu: every place the reader starred, in one sheet. Tapping an entry
	 * jumps to the map with the place opened; the cross takes it off the list again. Rows pop in
	 * one after another so opening the sheet feels like flipping through a scrapbook.
	 */
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { localize } from '$lib/i18n';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';
	import { locations } from '$lib/data/locations';
	import type { Location } from '$lib/data/types';
	import Icon from '../ui/Icon.svelte';
	import { placeholderImage } from '$lib/placeholderImage';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	/** The wishlisted places, in the order they were starred. */
	const entries = $derived(locations.filter((location) => locationMarks.wishlist.has(location.id)));

	function showOnMap(location: Location) {
		onclose();
		trackEvent('wishlist_place_opened', { place: location.id });
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal jump
		goto(localizeHref(`/?focus=${location.id}`));
	}

	function remove(location: Location) {
		locationMarks.toggleWishlist(location.id);
		trackEvent('wishlist_removed', { place: location.id });
	}
</script>

<BottomSheet {open} {onclose} title={m.wishlist_title()}>
	<div class="space-y-4">
		{#if entries.length === 0}
			<div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
				<span
					class="grid h-16 w-16 place-items-center rounded-full bg-secondary/12 text-secondary"
				>
					<Icon name="star" size={30} />
				</span>
				<p class="max-w-sm leading-relaxed text-base-content/70">{m.wishlist_empty()}</p>
				<button class="btn mt-1 gap-2 btn-soft" onclick={onclose}>
					<Icon name="map" size={18} />
					{m.nav_map()}
				</button>
			</div>
		{:else}
			<p class="text-sm text-base-content/65">
				{entries.length === 1
					? m.wishlist_count_one()
					: m.wishlist_count_other({ count: entries.length })}
			</p>

			<ul class="space-y-2">
				{#each entries as location, index (location.id)}
					<li
						class="wishlist-row flex items-center gap-1 rounded-xl border border-white/8 bg-white/4 pr-1.5 pl-2 py-2"
						style="animation-delay: {Math.min(index, 8) * 45}ms"
					>
						<button
							type="button"
							class="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-0.5 text-left"
							onclick={() => showOnMap(location)}
						>
							<img
								src={location.image?.url ?? placeholderImage(location.categories)}
								alt=""
								class="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
								loading="lazy"
							/>
							<span class="min-w-0 flex-1">
								<span class="block truncate font-semibold">{localize(location.name)}</span>
								<span class="block truncate text-sm text-base-content/60"
									>{location.nearestStation}</span
								>
							</span>
							<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
						</button>
						<button
							type="button"
							class="icon-btn h-9 w-9 shrink-0 border-0 bg-transparent text-base-content/50 hover:bg-white/8 hover:text-error"
							aria-label={m.wishlist_remove()}
							title={m.wishlist_remove()}
							onclick={() => remove(location)}
						>
							<Icon name="close" size={18} />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</BottomSheet>

<style>
	/* Rows slide up one after another when the sheet opens. */
	.wishlist-row {
		animation: row-in 0.32s var(--ease-out-soft) both;
	}

	@keyframes row-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
