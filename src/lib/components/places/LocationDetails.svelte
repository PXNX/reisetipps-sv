<script lang="ts">
	import { cyclingMapUrl, googleMapsUrl, hikingMapUrl, type Location } from '$lib/data/types';
	import { localize } from '$lib/i18n';
	import { categoryLabel } from '$lib/categories';
	import { locationIconName, categoryIcons } from '$lib/icons';
	import Icon from '../ui/Icon.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { tour } from '$lib/stores/tour.svelte';
	import { placeholderImage } from '$lib/placeholderImage';
	import { mediumPhoto } from '$lib/photos';
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

	const imageSrc = $derived(
		location.image ? mediumPhoto(location.image.url) : placeholderImage(location.categories)
	);
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

<div class="space-y-5">
	<figure class="rise-in">
		<ZoomableImage
			src={imageSrc}
			alt={imageAlt}
			attribution={location.image?.attribution}
			gallery={photos}
			class="h-52 sm:h-64"
		/>
	</figure>

	<div class="flex flex-wrap gap-1.5">
		{#each location.categories as category, i (category)}
			<span class="chip">
				<Icon
					name={i === 0 && location.icon ? locationIconName(location) : categoryIcons[category]}
					size={17}
				/>
				{categoryLabel(category)}
			</span>
		{/each}
	</div>

	<p class="text-base leading-relaxed text-base-content/90">{localize(location.description)}</p>

	<div class="tip">
		<div class="flex items-center gap-2 text-secondary">
			<Icon name="bulb" size={18} />
			<span class="text-xs font-bold tracking-wide uppercase">{m.personal_tip()}</span>
		</div>
		<p class="mt-1.5 text-base leading-relaxed">{localize(location.tip)}</p>
	</div>

	<dl class="surface divide-y divide-white/8 overflow-hidden">
		<div class="flex flex-wrap items-baseline justify-between gap-1 px-4 py-3">
			<dt class="text-sm text-base-content/65">{m.nearest_station()}</dt>
			<dd class="text-base font-semibold">{location.nearestStation}</dd>
		</div>
		{#if location.openingHours}
			<div class="flex flex-wrap items-baseline justify-between gap-1 px-4 py-3">
				<dt class="text-sm text-base-content/65">{m.opening_hours()}</dt>
				<dd class="text-base font-semibold">{localize(location.openingHours)}</dd>
			</div>
		{/if}
	</dl>

	<!-- eslint-disable svelte/no-navigation-without-resolve -- these are external URLs, not SvelteKit routes -->
	<div class="space-y-2">
		<a
			href={googleMapsUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="row-link"
			onclick={() => openLink('maps')}
		>
			<span class="icon-tile"><Icon name="map" size={20} /></span>
			<span class="min-w-0 flex-1">
				<span class="block font-semibold">{m.link_maps()}</span>
				<span class="block text-sm text-base-content/60">{m.link_maps_desc()}</span>
			</span>
			<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
		</a>
		<a
			href={hikingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="row-link"
			onclick={() => openLink('hiking')}
		>
			<span class="icon-tile"><Icon name="walk" size={20} /></span>
			<span class="min-w-0 flex-1">
				<span class="block font-semibold">{m.link_hiking()}</span>
				<span class="block text-sm text-base-content/60">{m.link_hiking_desc()}</span>
			</span>
			<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
		</a>
		<a
			href={cyclingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="row-link"
			onclick={() => openLink('cycling')}
		>
			<span class="icon-tile"><Icon name="bike" size={20} /></span>
			<span class="min-w-0 flex-1">
				<span class="block font-semibold">{m.link_cycling()}</span>
				<span class="block text-sm text-base-content/60">{m.link_cycling_desc()}</span>
			</span>
			<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
		</a>

		{#if location.url}
			<a
				href={location.url}
				target="_blank"
				rel="noreferrer"
				class="row-link"
				onclick={() => openLink('website')}
			>
				<span class="icon-tile"><Icon name="globe" size={20} /></span>
				<span class="min-w-0 flex-1 font-semibold">{m.more_info()}</span>
				<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
			</a>
		{/if}
	</div>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->

	<div class="space-y-3 border-t border-white/8 pt-5">
		<button
			class="btn w-full gap-2 btn-lg {inTour ? 'btn-soft' : 'btn-primary'}"
			class:tour-added={inTour}
			onclick={toggleTour}
			aria-pressed={inTour}
		>
			<Icon name={inTour ? 'check' : 'add'} size={20} />
			{inTour ? m.tour_in() : m.tour_add()}
		</button>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			<button
				class="toggle-mark toggle-visited btn gap-2"
				class:is-on={visited}
				onclick={toggleVisited}
				aria-pressed={visited}
			>
				<Icon name={visited ? 'check-circle' : 'check'} size={18} />
				{visited ? m.unmark_visited() : m.mark_visited()}
			</button>
			<button
				class="toggle-mark toggle-wishlist wishlist-toggle btn gap-2"
				class:is-on={wishlisted}
				onclick={toggleWishlist}
				aria-pressed={wishlisted}
			>
				<Icon name={wishlisted ? 'star-filled' : 'star'} size={18} />
				{wishlisted ? m.unmark_wishlist() : m.mark_wishlist()}
			</button>
		</div>
	</div>
</div>

<style>
	.tip {
		border: 1px solid color-mix(in oklab, var(--color-secondary) 24%, transparent);
		border-left: 3px solid var(--color-secondary);
		border-radius: var(--radius-field);
		background: color-mix(in oklab, var(--color-secondary) 8%, transparent);
		padding: 0.9rem 1rem;
	}

	.btn.btn-soft.tour-added {
		--btn-bg: color-mix(in oklab, var(--color-primary) 14%, transparent);
		--btn-border: color-mix(in oklab, var(--color-primary) 32%, transparent);
		color: var(--color-primary);
	}

	/* The two bookmark toggles stay quiet until they are actually on. */
	.btn.toggle-mark {
		--btn-bg: var(--surface);
		--btn-border: var(--line);
		min-height: 3rem;
	}

	.btn.toggle-mark:hover {
		--btn-bg: var(--surface-hover);
	}

	.btn.toggle-mark.is-on.toggle-visited {
		--btn-bg: color-mix(in oklab, var(--color-success) 14%, transparent);
		--btn-border: color-mix(in oklab, var(--color-success) 38%, transparent);
		color: var(--color-success);
	}

	.btn.toggle-mark.is-on.toggle-wishlist {
		--btn-bg: color-mix(in oklab, var(--color-secondary) 14%, transparent);
		--btn-border: color-mix(in oklab, var(--color-secondary) 38%, transparent);
		color: var(--color-secondary);
	}
</style>
