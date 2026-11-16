<script lang="ts">
	import { cyclingMapUrl, googleMapsUrl, hikingMapUrl, type Location } from '$lib/data/types';
	import { localize } from '$lib/i18n';
	import { categoryLabel } from '$lib/categories';
	import { locationIconName, categoryIcons } from '$lib/icons';
	import Icon from '../ui/Icon.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { tour } from '$lib/stores/tour.svelte';
	import { placeholderImage } from '$lib/placeholderImage';
	import { trackEvent } from '$lib/telemetry';
	import ZoomableImage from './ZoomableImage.svelte';
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

	function toggleTour() {
		tour.toggle(location.id);
		trackEvent('tour_toggle', { action: inTour ? 'remove' : 'add', place: location.id });
	}

	function openLink(kind: 'maps' | 'hiking' | 'cycling' | 'website') {
		trackEvent('place_link_opened', { kind, place: location.id });
	}

	const imageSrc = $derived(location.image?.url ?? placeholderImage(location.categories));
	const imageAlt = $derived(
		location.image ? localize(location.image.alt) : localize(location.name)
	);
	/** Photos for the swipeable gallery, up to three. */
	const photos = $derived(
		(location.images ?? (location.image ? [location.image] : [])).map((photo) => ({
			src: photo.url,
			alt: localize(photo.alt),
			attribution: photo.attribution
		}))
	);
</script>

<div class="rise-in space-y-5">
	<figure>
		<ZoomableImage
			src={imageSrc}
			alt={imageAlt}
			attribution={location.image?.attribution}
			gallery={photos}
			class="h-48 sm:h-60"
		/>
	</figure>

	<div>
		<h2 class="text-2xl leading-tight font-bold">{localize(location.name)}</h2>
		<div class="mt-3 flex flex-wrap gap-2">
			{#each location.categories as category, i (category)}
				<span class="badge gap-1 badge-outline badge-lg badge-primary">
					<Icon
						name={i === 0 && location.icon ? locationIconName(location) : categoryIcons[category]}
						class="text-lg"
					/>
					{categoryLabel(category)}
				</span>
			{/each}
			{#if visited}
				<span class="badge gap-1 badge-lg badge-success"
					><Icon name="check" /> {m.visited_badge()}</span
				>
			{/if}
			{#if wishlisted}
				<span class="badge gap-1 badge-lg badge-secondary"
					><Icon name="star-filled" /> {m.wishlist_badge()}</span
				>
			{/if}
		</div>
	</div>

	<p class="text-base leading-relaxed">{localize(location.description)}</p>

	<div class="rounded-box border-l-4 border-secondary bg-base-300/80 p-4">
		<p class="text-sm font-bold tracking-wide text-secondary uppercase">{m.personal_tip()}</p>
		<p class="mt-1 text-base leading-relaxed">{localize(location.tip)}</p>
	</div>

	<dl class="divide-y divide-base-300 rounded-box border border-base-300">
		<div class="flex flex-wrap items-baseline justify-between gap-1 px-4 py-3">
			<dt class="text-base text-base-content/75">{m.nearest_station()}</dt>
			<dd class="text-lg font-semibold">{location.nearestStation}</dd>
		</div>
		{#if location.openingHours}
			<div class="flex flex-wrap items-baseline justify-between gap-1 px-4 py-3">
				<dt class="text-base text-base-content/75">{m.opening_hours()}</dt>
				<dd class="text-lg font-semibold">{localize(location.openingHours)}</dd>
			</div>
		{/if}
	</dl>

	<!-- eslint-disable svelte/no-navigation-without-resolve -- these are external URLs, not SvelteKit routes -->
	<div class="space-y-3">
		<a
			href={googleMapsUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn w-full justify-start gap-3 btn-outline btn-lg"
			onclick={() => openLink('maps')}
		>
			<Icon name="map" class="w-6" size={24} />
			<span class="flex flex-col items-start leading-tight">
				<span>{m.link_maps()}</span>
				<span class="text-sm font-normal">{m.link_maps_desc()}</span>
			</span>
		</a>
		<a
			href={hikingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn w-full justify-start gap-3 btn-outline btn-lg"
			onclick={() => openLink('hiking')}
		>
			<Icon name="walk" class="w-6" size={24} />
			<span class="flex flex-col items-start leading-tight">
				<span>{m.link_hiking()}</span>
				<span class="text-sm font-normal">{m.link_hiking_desc()}</span>
			</span>
		</a>
		<a
			href={cyclingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn w-full justify-start gap-3 btn-outline btn-lg"
			onclick={() => openLink('cycling')}
		>
			<Icon name="bike" class="w-6" size={24} />
			<span class="flex flex-col items-start leading-tight">
				<span>{m.link_cycling()}</span>
				<span class="text-sm font-normal">{m.link_cycling_desc()}</span>
			</span>
		</a>
	</div>

	{#if location.url}
		<a
			href={location.url}
			target="_blank"
			rel="noreferrer"
			class="inline-block link text-base font-semibold link-primary"
			onclick={() => openLink('website')}
		>
			{m.more_info()} →
		</a>
	{/if}
	<!-- eslint-enable svelte/no-navigation-without-resolve -->

	<div class="space-y-3 border-t border-base-300 pt-4">
		<button class="btn w-full btn-lg btn-primary" onclick={toggleTour} aria-pressed={inTour}>
			{inTour ? m.tour_in() : m.tour_add()}
		</button>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<button
				class="btn btn-lg {visited ? 'btn-success' : 'btn-outline'}"
				onclick={toggleVisited}
				aria-pressed={visited}
			>
				{visited ? m.unmark_visited() : m.mark_visited()}
			</button>
			<button
				class="btn btn-lg {wishlisted ? 'btn-secondary' : 'btn-outline'}"
				onclick={toggleWishlist}
				aria-pressed={wishlisted}
			>
				{wishlisted ? m.unmark_wishlist() : m.mark_wishlist()}
			</button>
		</div>
	</div>
</div>
