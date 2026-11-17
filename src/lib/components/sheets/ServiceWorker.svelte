<script lang="ts">
	/**
	 * Registers the app's service worker (built by vite-plugin-pwa as /sw.js) and offers updates in
	 * place. Nothing here runs on the server: the hook is only reached in the browser, and it is
	 * what actually registers the worker — without it the app is not installable. In `prompt` mode
	 * the hook reports a waiting build through `needRefresh`, so the new version is only swapped in
	 * when the reader taps the button instead of the page reloading under them.
	 */
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { trackEvent } from '$lib/telemetry';
	import BottomSheet from './BottomSheet.svelte';
	import Icon from '../ui/Icon.svelte';

	const { needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true });

	let open = $state(false);
	let updating = $state(false);

	$effect(() => {
		if ($needRefresh) open = true;
	});

	// Regular update checks: once an hour and whenever the app comes back into view.
	onMount(() => {
		if (!browser) return;
		const check = () =>
			navigator.serviceWorker
				.getRegistration()
				.then((r) => r?.update())
				.catch(() => {});
		const interval = window.setInterval(check, 60 * 60 * 1000);
		const onFocus = () => {
			if (document.visibilityState === 'visible') check();
		};
		document.addEventListener('visibilitychange', onFocus);
		window.addEventListener('focus', onFocus);
		return () => {
			window.clearInterval(interval);
			document.removeEventListener('visibilitychange', onFocus);
			window.removeEventListener('focus', onFocus);
		};
	});

	async function update() {
		trackEvent('app_update_requested', {});
		updating = true;
		try {
			await updateServiceWorker();
		} catch {
			// The worker did not take over; a plain reload is the last resort.
			if (browser) location.reload();
		} finally {
			updating = false;
		}
	}
</script>

<!-- Not dismissible: an outdated build stays in place until the reader taps the button. -->
<BottomSheet {open} dismissible={false} title={m.update_app_title()}>
	<div class="flex flex-col items-center gap-5 pt-1 text-center">
		<span class="grid h-14 w-14 place-items-center rounded-full bg-primary/12 text-primary">
			<Icon name="refresh" size={26} />
		</span>
		<p class="leading-relaxed text-base-content/80">{m.update_app_body()}</p>
		<button class="btn w-full gap-2 btn-lg btn-primary" onclick={update} disabled={updating}>
			{#if updating}
				<span class="loading loading-sm loading-spinner"></span>
			{:else}
				<Icon name="refresh" size={20} />
			{/if}
			{updating ? m.updating() : m.update_app_action()}
		</button>
	</div>
</BottomSheet>
