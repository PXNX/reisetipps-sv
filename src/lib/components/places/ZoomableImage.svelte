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
	let dialog = $state<HTMLDivElement | null>(null);

	// Keyboard and screen-reader focus belongs inside the overlay while it is open.
	$effect(() => {
		if (open) dialog?.focus();
	});

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

	/**
	 * The details view lives inside a sheet, and the sheet's transform would trap the fixed
	 * lightbox inside it. Moving the node to <body> keeps it a true full-screen overlay;
	 * Svelte keeps its scope class and event handlers, so nothing else changes.
	 */
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

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
	class="group relative block w-full cursor-zoom-in overflow-hidden rounded-[1.15rem] ring-1 ring-white/10"
	onclick={openGallery}
	aria-label={alt}
>
	<img
		{src}
		{alt}
		loading="lazy"
		class="w-full rounded-[1.15rem] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] {className}"
	/>
	<span
		class="pointer-events-none absolute inset-0 rounded-[1.15rem] bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90"
	></span>
	{#if slides.length > 1}
		<span
			class="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md"
		>
			<Icon name="film" size={14} />
			{m.gallery_count({ count: slides.length })}
		</span>
	{/if}
</button>

{#if open}
	<div
		use:portal
		bind:this={dialog}
		class="fixed inset-0 z-[1300] flex flex-col outline-none"
		role="dialog"
		aria-modal="true"
		aria-label={alt}
		tabindex="-1"
		ontouchstart={onTouchStart}
		ontouchend={onTouchEnd}
	>
		<button
			type="button"
			class="lightbox-backdrop absolute inset-0 cursor-zoom-out bg-[#04101c]/95"
			onclick={close}
			aria-label={m.close()}
		></button>

		<div class="relative flex min-h-0 flex-1 flex-col px-3 pt-3 pb-3 sm:px-6 sm:pt-5">
			<div class="flex items-center justify-between gap-3">
				{#if slides.length > 1}
					<span class="chip border-white/15 bg-black/35 text-white tabular-nums">
						{m.gallery_counter({ index: index + 1, total: slides.length })}
					</span>
				{:else}
					<span></span>
				{/if}
				<button
					type="button"
					class="icon-btn border-white/15 bg-black/40 text-white hover:bg-black/60"
					onclick={close}
					aria-label={m.close()}
				>
					<Icon name="close" size={22} />
				</button>
			</div>

			<div class="relative flex min-h-0 flex-1 items-center justify-center py-3">
				{#if slides.length > 1}
					<button
						type="button"
						class="icon-btn absolute left-0 z-10 border-white/15 bg-black/45 text-white hover:bg-black/65"
						onclick={() => show(index - 1)}
						aria-label={m.gallery_previous()}
					>
						<Icon name="chevron-left" size={22} />
					</button>
				{/if}
				{#key index}
					<img
						src={slides[index].src}
						alt={slides[index].alt}
						class="gallery-fade max-h-[68dvh] w-auto max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
					/>
				{/key}
				{#if slides.length > 1}
					<button
						type="button"
						class="icon-btn absolute right-0 z-10 border-white/15 bg-black/45 text-white hover:bg-black/65"
						onclick={() => show(index + 1)}
						aria-label={m.gallery_next()}
					>
						<Icon name="chevron-right" size={22} />
					</button>
				{/if}
			</div>

			<div class="flex flex-col items-center gap-2.5 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
				{#if slides.length > 1}
					<div class="flex items-center gap-1.5" role="tablist" aria-label={m.gallery_count({ count: slides.length })}>
						{#each slides as slide, i (slide.src)}
							<button
								type="button"
								class="h-2 rounded-full transition-all duration-200 {i === index
									? 'w-6 bg-primary'
									: 'w-2 bg-white/35 hover:bg-white/60'}"
								onclick={() => (index = i)}
								aria-label={m.gallery_counter({ index: i + 1, total: slides.length })}
								aria-selected={i === index}
								role="tab"
							></button>
						{/each}
					</div>
				{/if}
				{#if slides[index].attribution}
					<p class="max-w-lg text-center text-xs text-white/65">
						{m.image_credit()}: {slides[index].attribution}
					</p>
				{/if}
				<p class="sr-only">{m.gallery_swipe_hint()}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.lightbox-backdrop {
		animation: backdrop-in 200ms ease-out both;
	}

	/* Brief fade so slide changes feel responsive when swiping. */
	.gallery-fade {
		animation: gallery-fade 220ms var(--ease-out-soft) both;
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes gallery-fade {
		from {
			opacity: 0;
			transform: scale(0.985);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (width < 640px) {
		.gallery-fade {
			max-height: 58dvh;
		}
	}
</style>
