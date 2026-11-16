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
	import { categoryIcons } from '$lib/categories';
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
	<div class="space-y-3 pt-1">
		<p class="text-sm text-base-content/80">
			{entries.length === 1
				? m.wishlist_count_one()
				: m.wishlist_count_other({ count: entries.length })}
		</p>

		{#if entries.length === 0}
			<p class="py-4 text-center leading-relaxed text-base-content/80">
				{m.wishlist_empty()}
			</p>
		{:else}
			<ul class="space-y-2">
				{#each entries as location, index (location.id)}
					<li
						class="wishlist-row flex items-center gap-2 rounded-field bg-base-300/60 py-2 pr-1 pl-2"
						style="animation-delay: {index * 60}ms"
					>
						<img
							src={location.image?.url ?? placeholderImage(location.categories)}
							alt=""
							class="h-12 w-12 shrink-0 rounded-field object-cover"
							loading="lazy"
						/>
						<button
							type="button"
							class="min-w-0 flex-1 text-left"
							onclick={() => showOnMap(location)}
						>
							<span class="block truncate text-base font-semibold">{localize(location.name)}</span>
							<span class="block truncate text-sm text-base-content/80"
								>{categoryIcons[location.categories[0] ?? 'nature']} {location.nearestStation}</span
							>
						</button>
						<button
							type="button"
							class="btn gap-1 btn-ghost text-sm"
							aria-label={m.wishlist_remove()}
							onclick={() => remove(location)}
						>
							<span aria-hidden="true">✕</span>
							{m.wishlist_remove()}
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
		animation: row-in 0.3s ease-out both;
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
