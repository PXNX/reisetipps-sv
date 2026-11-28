<script lang="ts">
	/** A quiet collection of visited places. No streaks, no pressure — just a little proof. */
	import * as m from '$lib/paraglide/messages.js';
	import { locations } from '$lib/data/locations';
	import { localize } from '$lib/i18n';
	import { categoryIcons } from '$lib/icons';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import Icon from '../ui/Icon.svelte';
	import EmptyState from '../ui/EmptyState.svelte';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const byId = new Map(locations.map((location) => [location.id, location]));
	const stamps = $derived(
		[...locationMarks.visited].flatMap((id) => {
			const place = byId.get(id);
			return place ? [place] : [];
		})
	);
	const percent = $derived(Math.round((stamps.length / locations.length) * 100));
</script>

<BottomSheet {open} {onclose} title={m.passport_title()}>
	<div class="space-y-5">
		<div class="surface p-4">
			<div class="flex items-center gap-3">
				<span class="icon-tile h-11 w-11"><Icon name="check-circle" size={22} /></span>
				<div class="min-w-0 flex-1">
					<p class="font-semibold">
						{m.passport_progress({ count: stamps.length, total: locations.length })}
					</p>
					<p class="text-sm text-base-content/65">{m.passport_hint()}</p>
				</div>
			</div>
			<div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
				<div
					class="h-full rounded-full bg-primary transition-[width] duration-500"
					style="width: {percent}%"
				></div>
			</div>
		</div>

		{#if stamps.length === 0}
			<EmptyState icon="check-circle" title={m.passport_title()} body={m.passport_empty()} />
		{:else}
			<ul class="grid grid-cols-3 gap-2 sm:grid-cols-4">
				{#each stamps as place, index (place.id)}
					<li
						class="rise-in surface flex flex-col items-center gap-1.5 p-2.5 text-center"
						style="animation-delay: {Math.min(index, 12) * 35}ms"
					>
						<span class="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success">
							<Icon name={categoryIcons[place.categories[0] ?? 'nature']} size={20} />
						</span>
						<span class="line-clamp-2 text-xs leading-tight">{localize(place.name)}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</BottomSheet>
