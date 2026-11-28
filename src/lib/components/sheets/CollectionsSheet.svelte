<script lang="ts">
	/** Hand-picked mini collections: a gentler way in than a long list of every place. */
	import * as m from '$lib/paraglide/messages.js';
	import { collections } from '$lib/collections';
	import { localize } from '$lib/i18n';
	import { trackEvent } from '$lib/telemetry';
	import Icon from '../ui/Icon.svelte';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		onselect: (id: string) => void;
	}

	let { open, onclose, onselect }: Props = $props();

	function select(id: string) {
		trackEvent('collection_opened', { collection: id });
		onselect(id);
	}
</script>

<BottomSheet {open} {onclose} title={m.collections_title()}>
	<div class="space-y-4">
		<p class="text-sm leading-relaxed text-base-content/70">{m.collections_hint()}</p>
		<ul class="space-y-2">
			{#each collections as collection, index (collection.id)}
				<li>
					<button
						type="button"
						class="rise-in row-link"
						style="animation-delay: {Math.min(index, 6) * 45}ms"
						onclick={() => select(collection.id)}
					>
						<span class="icon-tile h-11 w-11"><Icon name={collection.icon} size={22} /></span>
						<span class="min-w-0 flex-1">
							<span class="block truncate font-semibold">{localize(collection.title)}</span>
							<span class="block truncate text-sm text-base-content/65">
								{localize(collection.subtitle)} · {collection.placeIds.length}
							</span>
						</span>
						<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
					</button>
				</li>
			{/each}
		</ul>
	</div>
</BottomSheet>
