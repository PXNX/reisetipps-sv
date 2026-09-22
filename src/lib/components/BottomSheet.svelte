<script lang="ts">
	import { fly } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		children: Snippet;
	}
	let { open, onclose, children }: Props = $props();

	let dragStartY = 0;
	let dragOffset = $state(0);
	let dragging = $state(false);

	function onPointerDown(event: PointerEvent) {
		dragging = true;
		dragStartY = event.clientY;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}
	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		dragOffset = Math.max(0, event.clientY - dragStartY);
	}
	function onPointerUp() {
		if (!dragging) return;
		dragging = false;
		const shouldClose = dragOffset > 120;
		dragOffset = 0;
		if (shouldClose) onclose();
	}

	function onKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<button
		class="fixed inset-0 z-40 cursor-default bg-black/50"
		onclick={onclose}
		aria-label={m.close()}
		transition:fly={{ duration: 180, opacity: 0 }}
	></button>
	<div
		class="fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col overflow-hidden rounded-t-2xl bg-base-200 shadow-xl"
		style={dragging ? `transform: translateY(${dragOffset}px)` : ''}
		transition:fly={{ y: 400, duration: 220 }}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="sticky top-0 z-10 flex shrink-0 touch-none justify-center bg-inherit py-2"
			role="presentation"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			<div class="h-1.5 w-12 rounded-full bg-base-content/30"></div>
			<button
				class="btn absolute top-1 right-2 btn-circle btn-ghost btn-sm"
				onclick={onclose}
				aria-label={m.close()}
			>
				✕
			</button>
		</div>
		<div
			class="min-h-0 overflow-y-auto overscroll-contain px-5"
			style="padding-bottom: max(2rem, env(safe-area-inset-bottom))"
		>
			{@render children()}
		</div>
	</div>
{/if}
