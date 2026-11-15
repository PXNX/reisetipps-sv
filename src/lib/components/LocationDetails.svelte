<script lang="ts">
	import { cyclingMapUrl, googleMapsUrl, hikingMapUrl, type Location } from '$lib/data/locations';
	import { localize } from '$lib/i18n';
	import { categoryIcons, categoryLabel } from '$lib/categories';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { tour } from '$lib/stores/tour.svelte';
	import { placeholderImage } from '$lib/placeholderImage';
	import { trackEvent } from '$lib/telemetry';
	import ZoomableImage from '$lib/components/ZoomableImage.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { location }: { location: Location } = $props();

	const visited = $derived(locationMarks.isVisited(location.id));
	const wishlisted = $derived(locationMarks.isWishlisted(location.id));
	const inTour = $derived(tour.has(location.id));

	function toggleVisited() {
		locationMarks.toggleVisited(location.id);
		trackEvent('visited_toggle', { action: visited ? 'remove' : 'add', place: location.id });
	}

	function toggleWishlist() {
		locationMarks.toggleWishlist(location.id);
		trackEvent('wishlist_toggle', { action: wishlisted ? 'remove' : 'add', place: location.id });
	}

	const imageSrc = $derived(location.image?.url ?? placeholderImage(location.categories));
	const imageAlt = $derived(
		location.image ? localize(location.image.alt) : localize(location.name)
	);
</script>

<div class="space-y-4">
	<figure class="-mx-1">
		<ZoomableImage
			src={imageSrc}
			alt={imageAlt}
			attribution={location.image?.attribution}
			class="h-40 sm:h-52"
		/>
	</figure>

	<div>
		<div class="flex items-start justify-between gap-2">
			<h2 class="text-2xl font-semibold">{localize(location.name)}</h2>
		</div>
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each location.categories as category, i (category)}
				<span class="badge gap-1 badge-outline badge-primary">
					<span aria-hidden="true"
						>{i === 0 && location.icon ? location.icon : categoryIcons[category]}</span
					>
					{categoryLabel(category)}
				</span>
			{/each}
			{#if visited}
				<span class="badge gap-1 badge-success">✓ {m.visited_badge()}</span>
			{/if}
			{#if wishlisted}
				<span class="badge gap-1 badge-secondary">★ {m.wishlist_badge()}</span>
			{/if}
		</div>
	</div>

	<p class="leading-relaxed text-base-content/90">{localize(location.description)}</p>

	<div class="rounded-box bg-base-300/60 p-3">
		<p class="text-xs font-semibold tracking-wide text-secondary uppercase">{m.personal_tip()}</p>
		<p class="mt-1 text-sm">{localize(location.tip)}</p>
	</div>

	<dl class="grid grid-cols-2 gap-3 text-sm">
		<div>
			<dt class="text-base-content/60">{m.nearest_station()}</dt>
			<dd>{location.nearestStation}</dd>
		</div>
		{#if location.openingHours}
			<div>
				<dt class="text-base-content/60">{m.opening_hours()}</dt>
				<dd>{localize(location.openingHours)}</dd>
			</div>
		{/if}
	</dl>

	<!-- eslint-disable svelte/no-navigation-without-resolve -- these are external URLs, not SvelteKit routes -->
	<div class="grid grid-cols-3 gap-2">
		<a
			href={googleMapsUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn h-auto flex-col gap-1 btn-outline py-2"
		>
			<span class="text-lg" aria-hidden="true">🧭</span>
			<span class="text-xs">{m.link_maps()}</span>
		</a>
		<a
			href={hikingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn h-auto flex-col gap-1 btn-outline py-2"
		>
			<span class="text-lg" aria-hidden="true">🥾</span>
			<span class="text-xs">{m.link_hiking()}</span>
		</a>
		<a
			href={cyclingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn h-auto flex-col gap-1 btn-outline py-2"
		>
			<span class="text-lg" aria-hidden="true">🚴</span>
			<span class="text-xs">{m.link_cycling()}</span>
		</a>
	</div>

	{#if location.url}
		<a href={location.url} target="_blank" rel="noreferrer" class="link text-sm link-primary">
			{m.more_info()} →
		</a>
	{/if}
	<!-- eslint-enable svelte/no-navigation-without-resolve -->

	<div class="flex gap-2">
		<button
			class="btn flex-1 btn-sm {inTour ? 'btn-primary' : 'btn-outline'}"
			onclick={() => tour.toggle(location.id)}
		>
			{inTour ? `✓ ${m.tour_in()}` : `➕ ${m.tour_add()}`}
		</button>
	</div>

	<div class="flex gap-2">
		<button
			class="btn flex-1 btn-sm {visited ? 'btn-success' : 'btn-outline'}"
			onclick={toggleVisited}
		>
			{visited ? `✓ ${m.visited_badge()}` : m.mark_visited()}
		</button>
		<button
			class="btn flex-1 btn-sm {wishlisted ? 'btn-secondary' : 'btn-outline'}"
			onclick={toggleWishlist}
		>
			{#key wishlisted}
				<span class="wish-twinkle"
					>{wishlisted ? `★ ${m.wishlist_badge()}` : `☆ ${m.mark_wishlist()}`}</span
				>
			{/key}
		</button>
	</div>
</div>

<style>
	/* The star twirls every time the wish list state flips. */
	.wish-twinkle {
		display: inline-block;
		animation: wish-twinkle 0.4s ease-out;
	}

	@keyframes wish-twinkle {
		0% {
			transform: scale(0.6) rotate(-14deg);
			opacity: 0.4;
		}
		60% {
			transform: scale(1.18) rotate(5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}
</style>
