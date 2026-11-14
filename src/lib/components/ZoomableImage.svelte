<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		src: string;
		alt: string;
		/** Credit line for the photo, shown under the enlarged image. */
		attribution?: string;
		/** Classes applied to the thumbnail image, e.g. height and object-fit. */
		class?: string;
	}

	let { src, alt, attribution, class: className = '' }: Props = $props();

	let open = $state(false);

	function close() {
		open = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close();
	}

	// Prevent background scrolling while the lightbox is open.
	$effect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

<svelte:window onkeydown={onKeydown} />

<button
	type="button"
	class="block w-full cursor-zoom-in"
	onclick={() => (open = true)}
	aria-label={alt}
>
	<img {src} {alt} loading="lazy" class="w-full rounded-box object-cover {className}" />
</button>

{#if open}
	<div class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={alt} tabindex="-1">
		<button
			type="button"
			class="absolute inset-0 cursor-zoom-out bg-black/80"
			onclick={close}
			aria-label={m.close()}
		></button>
		<div class="relative flex h-full flex-col items-center justify-center p-4">
			<!-- Flex column keeps the credit underneath the image even when the
			     credit line is longer than the photo is wide. -->
			<figure class="flex max-w-4xl flex-col items-center">
				<img
					{src}
					{alt}
					class="max-h-[70dvh] w-auto max-w-full rounded-box object-contain shadow-2xl"
				/>
				{#if attribution}
					<figcaption class="mt-2 text-center text-xs text-white/70">
						{m.image_credit()}: {attribution}
					</figcaption>
				{/if}
			</figure>
			<button
				type="button"
				class="btn absolute top-3 right-3 btn-circle btn-ghost text-white"
				onclick={close}
				aria-label={m.close()}
			>
				✕
			</button>
		</div>
	</div>
{/if}
