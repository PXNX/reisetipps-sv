<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { trackEvent } from '$lib/telemetry';
	import Icon from '../ui/Icon.svelte';

	interface Slide {
		src: string;
		alt: string;
		attribution?: string;
	}

	interface Props {
		src: string;
		alt: string;
		/** Credit line for the photo, shown under the enlarged image. */
		attribution?: string;
		/**
		 * Further photos to swipe between in the lightbox (up to three in
		 * total). The thumbnail always shows `src`.
		 */
		gallery?: Slide[];
		/** Classes applied to the thumbnail image, e.g. height and object-fit. */
		class?: string;
	}

	let { src, alt, attribution, gallery = [], class: className = '' }: Props = $props();

	const slides: Slide[] = $derived(gallery.length ? gallery : [{ src, alt, attribution }]);

	let open = $state(false);
	let index = $state(0);

	function show(next: number) {
		index = (next + slides.length) % slides.length;
	}

	function openGallery() {
		open = true;
		trackEvent('gallery_opened', { photos: slides.length });
	}

	function close() {
		open = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') close();
		else if (event.key === 'ArrowLeft') show(index - 1);
		else if (event.key === 'ArrowRight') show(index + 1);
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

	// Horizontal swipe between the slides.
	let touchX = $state(0);

	function onTouchStart(event: TouchEvent) {
		touchX = event.touches[0].clientX;
	}

	function onTouchEnd(event: TouchEvent) {
		const delta = event.changedTouches[0].clientX - touchX;
		if (Math.abs(delta) < 40) return;
		show(index + (delta < 0 ? 1 : -1));
	}
</script>

<svelte:window onkeydown={onKeydown} />

<button
	type="button"
	class="relative block w-full cursor-zoom-in"
	onclick={openGallery}
	aria-label={alt}
>
	<img {src} {alt} loading="lazy" class="w-full rounded-box object-cover {className}" />
	{#if slides.length > 1}
		<span
			class="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<rect x="9" y="9" width="11" height="11" rx="2" />
				<path d="M16 5H7a2 2 0 0 0-2 2v9" />
			</svg>
			{m.gallery_count({ count: slides.length })}
		</span>
	{/if}
</button>

{#if open}
	<div
		class="fixed inset-0 z-50"
		role="dialog"
		aria-modal="true"
		aria-label={alt}
		tabindex="-1"
		ontouchstart={onTouchStart}
		ontouchend={onTouchEnd}
	>
		<button
			type="button"
			class="absolute inset-0 cursor-zoom-out bg-black/85"
			onclick={close}
			aria-label={m.close()}
		></button>
		<div class="relative flex h-full flex-col items-center justify-center p-4">
			<!-- Flex column keeps the credit underneath the image even when the
			     credit line is longer than the photo is wide. -->
			<figure class="flex max-w-4xl flex-col items-center">
				{#key index}
					<img
						src={slides[index].src}
						alt={slides[index].alt}
						class="gallery-fade max-h-[65dvh] w-auto max-w-full rounded-box object-contain shadow-2xl"
					/>
				{/key}
				{#if slides[index].attribution}
					<figcaption class="mt-2 text-center text-sm text-white/80">
						{m.image_credit()}: {slides[index].attribution}
					</figcaption>
				{/if}
			</figure>
			{#if slides.length > 1}
				<p class="sr-only">{m.gallery_swipe_hint()}</p>
				<div class="absolute bottom-4 flex items-center gap-2">
					<button
						type="button"
						class="btn gap-1 text-white"
						onclick={() => show(index - 1)}
						aria-label={m.gallery_previous()}
					>
						<Icon name="chevron-left" />
						{m.gallery_previous()}
					</button>
					<span class="px-1 text-base text-white tabular-nums">
						{m.gallery_counter({ index: index + 1, total: slides.length })}
					</span>
					<button
						type="button"
						class="btn gap-1 text-white"
						onclick={() => show(index + 1)}
						aria-label={m.gallery_next()}
					>
						{m.gallery_next()}
						<Icon name="chevron-right" />
					</button>
				</div>
			{/if}
			<button
				type="button"
				class="btn absolute top-3 right-3 gap-2 text-white"
				onclick={close}
				aria-label={m.close()}
			>
				<Icon name="close" />
				{m.close()}
			</button>
		</div>
	</div>
{/if}

<style>
	/* Brief fade so slide changes feel responsive when swiping. */
	.gallery-fade {
		animation: gallery-fade 0.18s ease-out;
	}

	@keyframes gallery-fade {
		from {
			opacity: 0.3;
		}
		to {
			opacity: 1;
		}
	}
</style>
