<script lang="ts">
	import { Spring } from 'svelte/motion';
	import * as m from '$lib/paraglide/messages.js';
	import { untrack, type Snippet } from 'svelte';
	import Icon from '../ui/Icon.svelte';

	interface Props {
		open: boolean;
		onclose?: () => void;
		children: Snippet;
		/** Shown in the sheet header, so every sheet has a clear subject. */
		title?: string;
		/** A quiet second line under the title, e.g. the place's station. */
		subtitle?: string;
		/** A pending update must be answered — it cannot be swiped or clicked away. */
		dismissible?: boolean;
	}

	let {
		open,
		onclose = () => {},
		children,
		title = '',
		subtitle = '',
		dismissible = true
	}: Props = $props();

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
	let titleId = $derived(`sheet-title-${Math.random().toString(36).slice(2, 8)}`);

	// Only `open` drives this effect. Reading the spring inside it untracked keeps it from
	// re-running (and re-targeting the spring) on every animation frame.
	$effect(() => {
		const isOpen = open;
		untrack(() => animate(isOpen));
	});

	function animate(show: boolean) {
		if (show) {
			rendered = true;
			if (reduceMotion) {
				progress.set(0, { instant: true });
				return;
			}
			progress.stiffness = 0.2;
			progress.damping = 0.62;
			if (progress.current > 0.9) progress.set(1, { instant: true });
			progress.set(0);
		} else if (rendered) {
			if (reduceMotion) {
				progress.set(1, { instant: true });
				rendered = false;
				return;
			}
			progress.stiffness = 0.32;
			progress.damping = 0.9;
			progress.set(1);
			setTimeout(() => {
				if (!isOpenNow()) rendered = false;
			}, 320);
		}
	}

	function isOpenNow() {
		return untrack(() => open);
	}

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
			progress.stiffness = 0.2;
			progress.damping = 0.62;
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
			class="fixed inset-0 z-[1050] cursor-default bg-[#04101c]/70"
			style="opacity: {backdropOpacity}"
			onclick={onclose}
			aria-label={m.close()}
			tabindex="-1"
		></button>
	{:else}
		<div
			class="fixed inset-0 z-[1050] bg-[#04101c]/70"
			style="opacity: {backdropOpacity}"
			aria-hidden="true"
		></div>
	{/if}

	<div
		bind:this={sheet}
		class="sheet fixed inset-x-0 bottom-0 z-[1100] mx-auto flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.6rem] bg-base-200"
		style="transform: translateY({translate}%)"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? titleId : undefined}
		aria-label={title ? undefined : m.close()}
	>
		<div class="shrink-0 px-4 pt-2 pb-3 sm:px-5">
			{#if dismissible}
				<div
					class="flex touch-none justify-center py-1.5"
					role="presentation"
					onpointerdown={onPointerDown}
					onpointermove={onPointerMove}
					onpointerup={onPointerUp}
					onpointercancel={onPointerUp}
				>
					<div class="h-1.5 w-11 rounded-full bg-base-content/30"></div>
				</div>
			{/if}
			<div class="flex min-h-11 items-center gap-3 pt-0.5">
				<div class="min-w-0 flex-1">
					{#if title}
						<h2 id={titleId} class="truncate text-lg leading-tight font-bold">{title}</h2>
					{:else}
						<span class="sr-only">{m.close()}</span>
					{/if}
					{#if subtitle}
						<p class="truncate text-sm text-base-content/65">{subtitle}</p>
					{/if}
				</div>
				{#if dismissible}
					<button
						type="button"
						class="icon-btn -mr-1 text-base-content/80 hover:text-base-content"
						onclick={onclose}
						aria-label={m.close()}
					>
						<Icon name="close" size={22} />
					</button>
				{/if}
			</div>
		</div>
		<div class="sheet-divider h-px shrink-0"></div>
		<div
			class="scroll-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-6 sm:px-5"
			style="padding-bottom: max(1.5rem, env(safe-area-inset-bottom))"
		>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.sheet {
		box-shadow: var(--shadow-sheet);
		border: 1px solid color-mix(in oklab, #ffffff 10%, transparent);
		border-bottom: none;
	}

	.sheet-divider {
		background: linear-gradient(
			to right,
			transparent,
			color-mix(in oklab, #ffffff 12%, transparent),
			transparent
		);
	}

	@media (width >= 640px) {
		.sheet {
			bottom: 1.25rem;
			border-radius: 1.6rem;
			border-bottom: 1px solid color-mix(in oklab, #ffffff 10%, transparent);
		}
	}
</style>
