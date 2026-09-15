<script lang="ts">
	import { page } from '$app/state';
	import { deLocalizeUrl, localizeHref, locales } from '$lib/paraglide/runtime';
	import { currentLocale } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const tabs = [
		{ href: '/', label: () => m.nav_recommend(), icon: '🧭' },
		{ href: '/map', label: () => m.nav_map(), icon: '🗺️' }
	] as const;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="bg-base-100 text-base-content flex min-h-dvh flex-col">
	<header class="border-base-300/60 flex items-center justify-between border-b px-4 py-3">
		<span class="text-lg font-semibold tracking-tight">{m.app_name()}</span>
		<div class="join">
			{#each locales as locale (locale)}
				<a
					href={localizeHref(page.url.pathname, { locale })}
					class="join-item btn btn-xs {currentLocale() === locale ? 'btn-primary' : 'btn-ghost'}"
					aria-current={currentLocale() === locale}
				>
					{locale.toUpperCase()}
				</a>
			{/each}
		</div>
	</header>

	<main class="flex-1 pb-20">
		{@render children()}
	</main>

	<nav
		class="border-base-300/60 bg-base-100/95 fixed inset-x-0 bottom-0 z-30 flex border-t backdrop-blur"
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
