<script lang="ts">
	/**
	 * Offers the "add to home screen" install as a bottom sheet. Android/Chrome fires
	 * `beforeinstallprompt` — captured here so the browser's own bar never interrupts; iOS Safari
	 * has no such event, so it gets the manual Share-sheet steps instead. An explicit dismissal is
	 * remembered, but the sheet can always be opened again from Settings.
	 */
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { trackEvent } from '$lib/telemetry';
	import { installHint } from '$lib/stores/installHint.svelte';
	import BottomSheet from './BottomSheet.svelte';
	import Icon from '../ui/Icon.svelte';

	interface BeforeInstallPromptEvent extends Event {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	const DISMISSED_KEY = 'install-hint-dismissed';

	let deferredPrompt: BeforeInstallPromptEvent | null = $state(null);
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

		const offer = (platform: 'ios' | 'chromium') => {
			// Let the greeting sheet close first so the two never stack.
			setTimeout(() => {
				if (browser && !localStorage.getItem(DISMISSED_KEY)) {
					installHint.show();
					trackEvent('install_offered', { platform });
				}
			}, 1800);
		};

		if (isIos) {
			offer('ios');
			return;
		}

		const onPrompt = (event: Event) => {
			event.preventDefault();
			deferredPrompt = event as BeforeInstallPromptEvent;
			offer('chromium');
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
			trackEvent('install_prompt_answer', { accepted: choice.outcome === 'accepted' });
			if (choice.outcome === 'accepted') installHint.hide();
		} catch {
			// The browser refused the prompt; the sheet stays up so the reader can dismiss it.
		}
	}

	function dismiss() {
		installHint.hide();
		if (browser) localStorage.setItem(DISMISSED_KEY, '1');
	}
</script>

<BottomSheet open={installHint.open} onclose={dismiss} title={m.install_sheet_title()}>
	<div class="flex flex-col gap-4 pt-2">
		<Icon name="download" class="self-center text-primary" size={40} />
		<p class="leading-relaxed text-base-content/80">
			{isIos ? m.install_hint_ios() : m.install_hint_body()}
		</p>
		{#if !isIos}
			<button class="btn w-full btn-lg btn-primary" onclick={install} disabled={!deferredPrompt}>
				{m.install_action()}
			</button>
		{/if}
		<button class="btn w-full btn-ghost" onclick={dismiss}>{m.update_app_later()}</button>
	</div>
</BottomSheet>
