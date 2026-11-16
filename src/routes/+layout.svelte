<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { deLocalizeUrl, localizeHref } from '$lib/paraglide/runtime';
	import { initTelemetry } from '$lib/telemetry';
	import * as m from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GreetingSheet from '$lib/components/GreetingSheet.svelte';
	import InstallHint from '$lib/components/InstallHint.svelte';
	import ServiceWorker from '$lib/components/ServiceWorker.svelte';
	import SettingsSheet from '$lib/components/SettingsSheet.svelte';
	import TourPlanner from '$lib/components/TourPlanner.svelte';
	import WishlistSheet from '$lib/components/WishlistSheet.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';

	let { children } = $props();

	onMount(initTelemetry);

	let wishlistOpen = $state(false);
	let settingsOpen = $state(false);

	function openWishlist() {
		wishlistOpen = true;
		trackEvent('wishlist_sheet_opened', { count: locationMarks.wishlist.size });
	}

	const tabs = [
		{ href: '/', label: () => m.nav_recommend(), icon: '🧭' },
		{ href: '/karte', label: () => m.nav_map(), icon: '🗺️' }
	] as const;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col bg-base-100 text-base-content">
	<header class="flex items-center justify-between gap-3 border-b border-base-300/60 px-4 py-2">
		<span class="text-xl leading-tight font-bold tracking-tight">{m.app_name()}</span>
		<div class="flex items-center gap-1">
			<button
				type="button"
				class="relative flex min-w-16 flex-col items-center rounded-field px-2 py-1 text-sm font-medium hover:bg-base-200"
				onclick={openWishlist}
				aria-label={m.nav_wishlist()}
			>
				<span class="text-2xl leading-none" aria-hidden="true">★</span>
				<span>{m.nav_wishlist()}</span>
				{#if locationMarks.wishlist.size > 0}
					<span
						class="absolute -top-0.5 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-secondary-content"
					>
						{locationMarks.wishlist.size}
					</span>
				{/if}
			</button>
			<button
				type="button"
				class="flex min-w-16 flex-col items-center rounded-field px-2 py-1 text-sm font-medium hover:bg-base-200"
				onclick={() => (settingsOpen = true)}
				aria-label={m.settings_open()}
			>
				<span class="text-2xl leading-none" aria-hidden="true">⚙</span>
				<span>{m.settings_open()}</span>
			</button>
		</div>
	</header>

	<main class="flex-1 pb-28">
		{@render children()}
	</main>

	<GreetingSheet />
	<InstallHint />
	<ServiceWorker />
	<TourPlanner />
	<WishlistSheet open={wishlistOpen} onclose={() => (wishlistOpen = false)} />
	<SettingsSheet open={settingsOpen} onclose={() => (settingsOpen = false)} />

	<nav
		class="fixed inset-x-0 bottom-0 z-30 flex border-t border-base-300/60 bg-base-100/95 backdrop-blur"
		style="padding-bottom: env(safe-area-inset-bottom)"
	>
		{#each tabs as tab (tab.href)}
			{@const active = deLocalizeUrl(page.url).pathname === tab.href}
			<a
				href={localizeHref(tab.href)}
				class="flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-sm font-medium {active
					? 'bg-primary/10 text-primary'
					: 'text-base-content/80'}"
				aria-current={active ? 'page' : undefined}
			>
				<span class="text-2xl leading-none" aria-hidden="true">{tab.icon}</span>
				{tab.label()}
			</a>
		{/each}
	</nav>
</div>
