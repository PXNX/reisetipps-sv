<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface BeforeInstallPromptEvent extends Event {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	const DISMISSED_KEY = 'install-hint-dismissed';

	let deferredPrompt: BeforeInstallPromptEvent | null = $state(null);
	let show = $state(false);
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
			show = true;
			return;
		}

		const onPrompt = (event: Event) => {
			event.preventDefault();
			deferredPrompt = event as BeforeInstallPromptEvent;
			show = true;
		};
		window.addEventListener('beforeinstallprompt', onPrompt);
		return () => window.removeEventListener('beforeinstallprompt', onPrompt);
	});

	async function install() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		await deferredPrompt.userChoice;
		deferredPrompt = null;
		show = false;
	}

	function dismiss() {
		show = false;
		if (browser) localStorage.setItem(DISMISSED_KEY, '1');
	}
</script>

{#if show}
	<div
		class="fixed inset-x-4 z-20 flex items-center gap-2 rounded-field bg-base-300 px-3 py-2 text-xs shadow-lg"
		style="bottom: calc(4.75rem + env(safe-area-inset-bottom))"
	>
		<span aria-hidden="true">📲</span>
		<span class="flex-1">{isIos ? m.install_hint_ios() : m.install_hint_body()}</span>
		{#if !isIos}
			<button class="btn btn-primary btn-xs" onclick={install}>{m.install_action()}</button>
		{/if}
		<button class="btn btn-circle btn-ghost btn-xs" onclick={dismiss} aria-label={m.close()}>
			✕
		</button>
	</div>
{/if}
