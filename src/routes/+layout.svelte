<script lang="ts">
	import { page } from '$app/state';
	import { deLocalizeUrl, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GreetingSheet from '$lib/components/sheets/GreetingSheet.svelte';
	import InstallHint from '$lib/components/sheets/InstallHint.svelte';
	import ServiceWorker from '$lib/components/sheets/ServiceWorker.svelte';
	import SettingsSheet from '$lib/components/sheets/SettingsSheet.svelte';
	import PassportSheet from '$lib/components/sheets/PassportSheet.svelte';
	import TourPlanner from '$lib/components/sheets/TourPlanner.svelte';
	import WishlistSheet from '$lib/components/sheets/WishlistSheet.svelte';
	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { trackEvent } from '$lib/telemetry';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { children } = $props();

	/** On the map the header floats above the full-screen canvas instead of taking a row. */
	const onMap = $derived(deLocalizeUrl(page.url).pathname === '/');

	let wishlistOpen = $state(false);
	let settingsOpen = $state(false);
	let passportOpen = $state(false);

	function openWishlist() {
		wishlistOpen = true;
		trackEvent('wishlist_sheet_opened', { count: locationMarks.wishlist.size });
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col bg-base-100 text-base-content">
	<header
		class="flex items-center gap-2 px-3 py-2 {onMap
			? 'pointer-events-none absolute inset-x-0 top-0 z-[900]'
			: 'sticky top-0 z-[900] border-b border-white/8 bg-base-100/85 backdrop-blur-md'}"
		style="padding-top: max(0.5rem, env(safe-area-inset-top))"
	>
		{#if onMap}
			<span class="sr-only">{m.app_name()}</span>
		{:else}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
			<a
				href={localizeHref('/')}
				class="btn -ml-1 h-11 gap-2 btn-ghost px-2.5 text-base-content/85"
				aria-label={m.nav_map()}
			>
				<Icon name="arrow-left" size={18} />
				<span>{m.nav_map()}</span>
			</a>
		{/if}

		<div class="pointer-events-auto ml-auto flex items-center gap-2">
			<button
				type="button"
				class="icon-btn relative text-secondary"
				onclick={openWishlist}
				aria-label="{m.nav_wishlist()}{locationMarks.wishlist.size > 0
					? ` (${locationMarks.wishlist.size})`
					: ''}"
				title={m.nav_wishlist()}
			>
				<Icon name={locationMarks.wishlist.size > 0 ? 'star-filled' : 'star'} size={21} />
				{#if locationMarks.wishlist.size > 0}
					{#key locationMarks.wishlist.size}
						<span
							class="wishlist-count absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-secondary-content shadow"
						>
							{locationMarks.wishlist.size}
						</span>
					{/key}
				{/if}
			</button>
			<button
				type="button"
				class="icon-btn text-base-content/85 hover:text-base-content"
				onclick={() => {
					settingsOpen = true;
					trackEvent('settings_opened', {});
				}}
				aria-label={m.settings_open()}
				title={m.settings_open()}
			>
				<Icon name="settings" size={21} />
			</button>
		</div>
	</header>

	<main class="flex-1 {onMap ? '' : 'pb-4'}">
		{@render children()}
	</main>

	<GreetingSheet />
	<InstallHint />
	<ServiceWorker />
	<TourPlanner />
	<WishlistSheet open={wishlistOpen} onclose={() => (wishlistOpen = false)} />
	<SettingsSheet
		open={settingsOpen}
		onclose={() => (settingsOpen = false)}
		onopenPassport={() => {
			settingsOpen = false;
			passportOpen = true;
			trackEvent('passport_opened', {});
		}}
	/>
	<PassportSheet open={passportOpen} onclose={() => (passportOpen = false)} />
</div>
