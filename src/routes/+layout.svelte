<script lang="ts">
	import { page } from '$app/state';
	import { deLocalizeUrl, localizeHref, locales } from '$lib/paraglide/runtime';
	import { currentLocale } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GreetingSheet from '$lib/components/GreetingSheet.svelte';

	let { children } = $props();

	const tabs = [
		{ href: '/', label: () => m.nav_recommend(), icon: '🧭' },
		{ href: '/map', label: () => m.nav_map(), icon: '🗺️' }
	] as const;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col bg-base-100 text-base-content">
	<header class="flex items-center justify-between border-b border-base-300/60 px-4 py-3">
		<span class="text-lg font-semibold tracking-tight">{m.app_name()}</span>
		<div class="flex items-center gap-3">
			<a
				href={localizeHref('/privacy')}
				class="text-xs text-base-content/50 underline-offset-2 hover:underline"
			>
				{m.privacy_link()}
			</a>
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
