<script lang="ts">
	import type { Location } from '$lib/data/locations';
	import { localize } from '$lib/i18n';
	import { categoryIcons, categoryLabel } from '$lib/categories';
	import * as m from '$lib/paraglide/messages.js';

	let { location }: { location: Location } = $props();
</script>

<div class="space-y-4">
	<div>
		<h2 class="text-2xl font-semibold">{localize(location.name)}</h2>
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each location.categories as category (category)}
				<span class="badge badge-outline badge-primary gap-1">
					<span aria-hidden="true">{categoryIcons[category]}</span>
					{categoryLabel(category)}
				</span>
			{/each}
		</div>
	</div>

	<p class="text-base-content/90 leading-relaxed">{localize(location.description)}</p>

	<div class="rounded-box bg-base-300/60 p-3">
		<p class="text-secondary text-xs font-semibold tracking-wide uppercase">{m.personal_tip()}</p>
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

	{#if location.url}
		<a href={location.url} target="_blank" rel="noreferrer" class="link link-primary text-sm break-all">
			{location.url.replace(/^https?:\/\//, '')}
		</a>
	{/if}
</div>
