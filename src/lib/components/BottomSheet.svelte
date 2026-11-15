<script lang="ts">
	import { Spring } from 'svelte/motion';
	import * as m from '$lib/paraglide/messages.js';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose?: () => void;
		children: Snippet;
		/** Sheets that must be answered (a pending update) opt out of every way of closing. */
		dismissible?: boolean;
	}

	let { open, onclose = () => {}, children, dismissible = true }: Props = $props();

	/**
	 * Physics-driven sheet: `progress` runs 0 (fully open) → 1 (fully closed) and is owned by a
	 * spring, so opening overshoots slightly (the joyful bounce) and closing settles naturally.
	 * Dragging the handle writes straight into the spring; releasing it either flings it shut
	 * (distance or downward velocity) or springs it back open.
	 */
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
			progress.stiffness = 0.12;
			progress.damping = 0.5;
			// Fresh open: start from the closed position so the spring pops in.
			if (progress.current > 0.9) progress.set(1, { instant: true });
			progress.set(0);
		} else if (rendered) {
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
		dragVelocity = (event.clientY - lastDragY) / dt; // px per ms
		lastDragY = event.clientY;
		lastDragT = now;
	}

	function onPointerUp() {
		if (dragStartY === null) return;
		dragStartY = null;
		// Fling downwards or drag past 40%: let it go, otherwise spring back open.
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
			class="fixed inset-0 z-40 cursor-default bg-black/50"
			style="opacity: {backdropOpacity}"
			onclick={onclose}
			aria-label={m.close()}
			tabindex="-1"
		></button>
	{:else}
		<div
			class="fixed inset-0 z-40 bg-black/50"
			style="opacity: {backdropOpacity}"
			aria-hidden="true"
		></div>
	{/if}
	<div
		bind:this={sheet}
		class="fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col overflow-hidden rounded-t-2xl bg-base-200 shadow-xl"
		style="transform: translateY({translate}%)"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="sticky top-0 z-10 flex shrink-0 touch-none justify-center bg-inherit py-2"
			role="presentation"
			onpointerdown={dismissible ? onPointerDown : undefined}
			onpointermove={dismissible ? onPointerMove : undefined}
			onpointerup={dismissible ? onPointerUp : undefined}
			onpointercancel={dismissible ? onPointerUp : undefined}
		>
			{#if dismissible}
				<div class="h-1.5 w-12 rounded-full bg-base-content/30"></div>
				<button
					class="btn absolute top-1 right-2 btn-circle btn-ghost btn-sm"
					onclick={onclose}
					aria-label={m.close()}
				>
					✕
				</button>
			{:else}
				<div class="h-1.5"></div>
			{/if}
		</div>
		<div
			class="min-h-0 overflow-y-auto overscroll-contain px-5"
			style="padding-bottom: max(2rem, env(safe-area-inset-bottom))"
		>
			{@render children()}
		</div>
	</div>
{/if}
