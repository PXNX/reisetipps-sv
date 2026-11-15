<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { deLocalizeUrl, localizeHref, locales } from '$lib/paraglide/runtime';
	import { currentLocale } from '$lib/i18n';
	import { initTelemetry } from '$lib/telemetry';
	import * as m from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GreetingSheet from '$lib/components/GreetingSheet.svelte';
	import InstallHint from '$lib/components/InstallHint.svelte';
	import ServiceWorker from '$lib/components/ServiceWorker.svelte';
	import TourPlanner from '$lib/components/TourPlanner.svelte';
	import WishlistSheet from '$lib/components/WishlistSheet.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';

	let { children } = $props();

	onMount(initTelemetry);

	let wishlistOpen = $state(false);

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
	<header class="flex items-center justify-between border-b border-base-300/60 px-4 py-3">
		<span class="text-lg font-semibold tracking-tight">{m.app_name()}</span>
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="wishlist-toggle btn relative btn-circle btn-ghost btn-sm"
				onclick={openWishlist}
				aria-label={m.nav_wishlist()}
			>
				<span class="text-lg" aria-hidden="true">★</span>
				{#if locationMarks.wishlist.size > 0}
					{#key locationMarks.wishlist.size}
						<span
							class="wishlist-count absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-content"
						>
							{locationMarks.wishlist.size}
						</span>
					{/key}
				{/if}
			</button>
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href={localizeHref('/datenschutz')}
				class="text-xs text-base-content/50 underline-offset-2 hover:underline"
			>
				{m.privacy_link()}
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
			<div class="join">
				{#each locales as locale (locale)}
					<a
						href={localizeHref(page.url.pathname, { locale })}
						class="btn join-item btn-xs {currentLocale() === locale ? 'btn-primary' : 'btn-ghost'}"
						aria-current={currentLocale() === locale}
					>
						{locale.toUpperCase()}
					</a>
				{/each}
			</div>
		</div>
	</header>

	<main class="flex-1 pb-20">
		{@render children()}
	</main>

	<GreetingSheet />
	<InstallHint />
	<ServiceWorker />
	<TourPlanner />
	<WishlistSheet open={wishlistOpen} onclose={() => (wishlistOpen = false)} />

	<nav
		class="fixed inset-x-0 bottom-0 z-30 flex border-t border-base-300/60 bg-base-100/95 backdrop-blur"
		style="padding-bottom: env(safe-area-inset-bottom)"
	>
		{#each tabs as tab (tab.href)}
			{@const active = deLocalizeUrl(page.url).pathname === tab.href}
			<a
				href={localizeHref(tab.href)}
				class="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs {active
					? 'text-primary'
					: 'text-base-content/60'}"
				aria-current={active ? 'page' : undefined}
			>
				<span class="text-xl" aria-hidden="true">{tab.icon}</span>
				{tab.label()}
			</a>
		{/each}
	</nav>
</div>
