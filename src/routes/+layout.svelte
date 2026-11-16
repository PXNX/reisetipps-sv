<script lang="ts">
	import { page } from '$app/state';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GreetingSheet from '$lib/components/sheets/GreetingSheet.svelte';
	import InstallHint from '$lib/components/sheets/InstallHint.svelte';
	import ServiceWorker from '$lib/components/sheets/ServiceWorker.svelte';
	import SettingsSheet from '$lib/components/sheets/SettingsSheet.svelte';
	import TourPlanner from '$lib/components/sheets/TourPlanner.svelte';
	import WishlistSheet from '$lib/components/sheets/WishlistSheet.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';

	let { children } = $props();

	/** On the map the header floats above the full-screen canvas instead of taking a row. */
	const onMap = $derived(deLocalizeUrl(page.url).pathname === '/');

	let wishlistOpen = $state(false);
	let settingsOpen = $state(false);

	function openWishlist() {
		wishlistOpen = true;
		trackEvent('wishlist_sheet_opened', { count: locationMarks.wishlist.size });
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col bg-base-100 text-base-content">
	<!-- No title row: on the map these two controls simply float over the canvas. -->
	<header
		class="flex items-center justify-end gap-1 px-3 py-2 {onMap
			? 'absolute inset-x-0 top-0 z-[900]'
			: 'border-b border-base-300/60'}"
	>
		<button
			type="button"
			class="btn relative gap-1 bg-base-100/85 btn-ghost text-sm backdrop-blur"
			onclick={openWishlist}
			aria-label={m.nav_wishlist()}
		>
			<span class="text-xl leading-none" aria-hidden="true">★</span>
			<span class="hidden sm:inline">{m.nav_wishlist()}</span>
			{#if locationMarks.wishlist.size > 0}
				<span
					class="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-secondary-content"
				>
					{locationMarks.wishlist.size}
				</span>
			{/if}
		</button>
		<button
			type="button"
			class="btn gap-1 bg-base-100/85 btn-ghost text-sm backdrop-blur"
			onclick={() => {
				settingsOpen = true;
				trackEvent('settings_opened', {});
			}}
			aria-label={m.settings_open()}
		>
			<span class="text-xl leading-none" aria-hidden="true">⚙</span>
			<span class="hidden sm:inline">{m.settings_open()}</span>
		</button>
	</header>

	<main class="flex-1 {onMap ? '' : 'pb-4'}">
		{@render children()}
	</main>

	<GreetingSheet />
	<InstallHint />
	<ServiceWorker />
	<TourPlanner />
	<WishlistSheet open={wishlistOpen} onclose={() => (wishlistOpen = false)} />
	<SettingsSheet open={settingsOpen} onclose={() => (settingsOpen = false)} />
</div>
