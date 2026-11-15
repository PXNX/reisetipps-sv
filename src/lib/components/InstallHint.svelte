<script lang="ts">
	/**
	 * Offers the "add to home screen" install as a bottom sheet. Android/Chrome fires
	 * `beforeinstallprompt` — captured here so the browser's own bar never interrupts; iOS Safari
	 * has no such event, so it gets the manual Share-sheet steps instead. An explicit dismissal is
	 * remembered so the sheet does not come back on the next visit.
	 */
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import BottomSheet from './BottomSheet.svelte';

	interface BeforeInstallPromptEvent extends Event {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	const DISMISSED_KEY = 'install-hint-dismissed';

	let deferredPrompt: BeforeInstallPromptEvent | null = $state(null);
	let open = $state(false);
	let isIos = $state(false);

	function isStandalone(): boolean {
		const nav = navigator as Navigator & { standalone?: boolean };
		return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
	}

	onMount(() => {
		if (!browser) return;
		if (localStorage.getItem(DISMISSED_KEY)) return;
		if (isStandalone()) return;

		isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

		if (isIos) {
			open = true;
			return;
		}

		const onPrompt = (event: Event) => {
			event.preventDefault();
			deferredPrompt = event as BeforeInstallPromptEvent;
			open = true;
		};
		window.addEventListener('beforeinstallprompt', onPrompt);
		return () => window.removeEventListener('beforeinstallprompt', onPrompt);
	});

	async function install() {
		const prompt = deferredPrompt;
		if (!prompt) return;
		deferredPrompt = null;
		try {
			await prompt.prompt();
			const choice = await prompt.userChoice;
			if (choice.outcome === 'accepted') open = false;
		} catch {
			// The browser refused the prompt; the sheet stays up so the reader can dismiss it.
		}
	}

	function dismiss() {
		open = false;
		if (browser) localStorage.setItem(DISMISSED_KEY, '1');
	}
</script>

<BottomSheet {open} onclose={dismiss}>
	<div class="flex flex-col items-center gap-4 pt-2 text-center">
		<span class="text-4xl" aria-hidden="true">📲</span>
		<div>
			<h2 class="text-xl font-semibold">{m.install_sheet_title()}</h2>
			<p class="mt-2 text-sm leading-relaxed text-base-content/80">
				{isIos ? m.install_hint_ios() : m.install_hint_body()}
			</p>
		</div>
		{#if !isIos}
			<button class="btn w-full btn-primary" onclick={install} disabled={!deferredPrompt}>
				{m.install_action()}
			</button>
		{/if}
		<button class="btn w-full btn-ghost" onclick={dismiss}>{m.update_app_later()}</button>
	</div>
</BottomSheet>
