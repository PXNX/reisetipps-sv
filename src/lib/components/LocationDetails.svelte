<script lang="ts">
	import { googleMapsUrl, hikingMapUrl, type Location } from '$lib/data/locations';
	import { localize } from '$lib/i18n';
	import { categoryIcons, categoryLabel } from '$lib/categories';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { placeholderImage } from '$lib/placeholderImage';
	import * as m from '$lib/paraglide/messages.js';

	let { location }: { location: Location } = $props();

	const visited = $derived(locationMarks.isVisited(location.id));
	const wishlisted = $derived(locationMarks.isWishlisted(location.id));
	const imageSrc = $derived(location.image?.url ?? placeholderImage(location.categories));
	const imageAlt = $derived(
		location.image ? localize(location.image.alt) : localize(location.name)
	);
</script>

<div class="space-y-4">
	<figure class="-mx-1 overflow-hidden rounded-box">
		<img src={imageSrc} alt={imageAlt} loading="lazy" class="h-40 w-full object-cover sm:h-52" />
		{#if location.image}
			<figcaption class="mt-1 text-right text-[11px] text-base-content/50">
				{m.image_credit()}: {location.image.attribution}
			</figcaption>
		{/if}
	</figure>

	<div>
		<div class="flex items-start justify-between gap-2">
			<h2 class="text-2xl font-semibold">{localize(location.name)}</h2>
		</div>
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each location.categories as category (category)}
				<span class="badge gap-1 badge-outline badge-primary">
					<span aria-hidden="true">{categoryIcons[category]}</span>
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

	<div class="flex flex-wrap gap-2">
		<!-- eslint-disable svelte/no-navigation-without-resolve -- these are external URLs, not SvelteKit routes -->
		<a
			href={googleMapsUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn gap-1 btn-outline btn-sm"
		>
			🧭 {m.open_in_google_maps()}
		</a>
		<a
			href={hikingMapUrl(location)}
			target="_blank"
			rel="noreferrer"
			class="btn gap-1 btn-outline btn-sm"
		>
			🥾 {m.open_hiking_map()}
		</a>
		{#if location.url}
			<a href={location.url} target="_blank" rel="noreferrer" class="btn gap-1 btn-outline btn-sm">
				🔗 {location.url.replace(/^https?:\/\//, '')}
			</a>
		{/if}
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</div>

	<div class="flex gap-2">
		<button
			class="btn flex-1 btn-sm {visited ? 'btn-success' : 'btn-outline'}"
			onclick={() => locationMarks.toggleVisited(location.id)}
		>
			{visited ? `✓ ${m.visited_badge()}` : m.mark_visited()}
		</button>
		<button
			class="btn flex-1 btn-sm {wishlisted ? 'btn-secondary' : 'btn-outline'}"
			onclick={() => locationMarks.toggleWishlist(location.id)}
		>
			{wishlisted ? `★ ${m.wishlist_badge()}` : `☆ ${m.mark_wishlist()}`}
		</button>
	</div>
</div>
