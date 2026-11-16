<script lang="ts">
	import { Spring } from 'svelte/motion';
	import * as m from '$lib/paraglide/messages.js';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose?: () => void;
		children: Snippet;
		/** Shown in the sheet header, so every sheet has a clear subject. */
		title?: string;
		/** A pending update must be answered — it cannot be swiped or clicked away. */
		dismissible?: boolean;
	}

	let { open, onclose = () => {}, children, title = '', dismissible = true }: Props = $props();

	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/** progress: 0 = open, 1 = closed. Spring gives a small, playful settle on open. */
	const progress = new Spring(1, { stiffness: 0.12, damping: 0.55 });

	let rendered = $state(false);
	let sheet = $state<HTMLDivElement | null>(null);
	let dragStartY: number | null = null;
	let dragVelocity = 0;
	let lastDragY = 0;
	let lastDragT = 0;

	$effect(() => {
		if (open) {
			rendered = true;
			if (reduceMotion) {
				progress.set(0, { instant: true });
				return;
			}
			progress.stiffness = 0.12;
			progress.damping = 0.5;
			if (progress.current > 0.9) progress.set(1, { instant: true });
			progress.set(0);
		} else if (rendered) {
			if (reduceMotion) {
				progress.set(1, { instant: true });
				rendered = false;
				return;
			}
			progress.stiffness = 0.25;
			progress.damping = 0.8;
			progress.set(1);
			setTimeout(() => {
				if (!open) rendered = false;
			}, 450);
		}
	});

	function sheetHeight() {
		return sheet?.offsetHeight ?? 400;
	}

	function onPointerDown(event: PointerEvent) {
		if (!dismissible) return;
		dragStartY = event.clientY;
		lastDragY = event.clientY;
		lastDragT = performance.now();
		dragVelocity = 0;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(event: PointerEvent) {
		if (dragStartY === null) return;
		const dy = event.clientY - dragStartY;
		const target = Math.min(1.15, Math.max(0, dy / sheetHeight()));
		progress.set(target, { instant: true });
		const now = performance.now();
		const dt = Math.max(1, now - lastDragT);
		dragVelocity = (event.clientY - lastDragY) / dt;
		lastDragY = event.clientY;
		lastDragT = now;
	}

	function onPointerUp() {
		if (dragStartY === null) return;
		dragStartY = null;
		if (progress.current > 0.4 || dragVelocity > 0.4) {
			onclose();
		} else {
			progress.stiffness = 0.12;
			progress.damping = 0.5;
			progress.set(0);
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (open && dismissible && event.key === 'Escape') onclose();
	}

	const translate = $derived.by(() => Math.max(0, Math.min(1, progress.current)) * 100);
	const backdropOpacity = $derived.by(() => 1 - Math.min(1, progress.current));
</script>

<svelte:window onkeydown={onKeydown} />

{#if rendered}
	{#if dismissible}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default bg-black/60"
			style="opacity: {backdropOpacity}"
			onclick={onclose}
			aria-label={m.close()}
			tabindex="-1"
		></button>
	{:else}
		<div
			class="fixed inset-0 z-40 bg-black/60"
			style="opacity: {backdropOpacity}"
			aria-hidden="true"
		></div>
	{/if}

	<div
		bind:this={sheet}
		class="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl bg-base-200 shadow-2xl"
		style="transform: translateY({translate}%)"
		role="dialog"
		aria-modal="true"
		aria-label={title || undefined}
	>
		<div class="shrink-0 bg-base-200 px-4 pt-2 pb-2 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
			{#if dismissible}
				<div
					class="flex touch-none justify-center py-1"
					role="presentation"
					onpointerdown={onPointerDown}
					onpointermove={onPointerMove}
					onpointerup={onPointerUp}
					onpointercancel={onPointerUp}
				>
					<div class="h-1.5 w-12 rounded-full bg-base-content/35"></div>
				</div>
			{/if}
			<div class="flex min-h-11 items-center justify-between gap-3 pt-1">
				{#if title}
					<h2 class="text-xl font-bold">{title}</h2>
				{:else}
					<span></span>
				{/if}
				{#if dismissible}
					<button
						type="button"
						class="btn gap-1.5 bg-base-300/70 btn-ghost px-3 text-sm"
						onclick={onclose}
						aria-label={m.close()}
					>
						<span class="text-lg leading-none" aria-hidden="true">✕</span>
						{m.close()}
					</button>
				{/if}
			</div>
		</div>
		<div
			class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 sm:px-5"
			style="padding-bottom: max(1.5rem, env(safe-area-inset-bottom))"
		>
			{@render children()}
		</div>
	</div>
{/if}
