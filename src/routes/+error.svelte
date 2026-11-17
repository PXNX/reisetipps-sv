<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { trackEvent } from '$lib/telemetry';
	import Icon from '$lib/components/ui/Icon.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const status = $derived(page.status);
	const isMissing = $derived(status === 404);

	/** The raw SvelteKit message only helps when it says more than the status itself. */
	const debugMessage = $derived(
		dev && page.error?.message && !/^(Not Found|\d{3})/.test(page.error.message)
			? page.error.message
			: null
	);

	$effect(() => {
		if (browser) trackEvent('error_page_shown', { status });
	});
</script>

<svelte:head>
	<title>{isMissing ? m.error_404_title() : m.error_generic_title()} · {m.app_name()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-5 py-10">
	<div class="rise-in w-full max-w-md text-center">
		<div class="relative mx-auto mb-6 grid h-20 w-20 place-items-center">
			<span class="absolute inset-0 rounded-full bg-primary/15 blur-2xl" aria-hidden="true"></span>
			<span class="relative grid h-20 w-20 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary">
				<Icon name="compass" size={38} />
			</span>
		</div>
		<p class="text-xs font-bold tracking-[0.18em] text-primary/80 uppercase">
			{m.error_code({ status })}
		</p>
		<h1 class="mt-2 text-2xl leading-tight font-bold sm:text-3xl">
			{isMissing ? m.error_404_title() : m.error_generic_title()}
		</h1>
		<p class="mt-3 text-base leading-relaxed text-base-content/75">
			{isMissing ? m.error_404_body() : m.error_generic_body()}
		</p>
		{#if debugMessage}
			<p class="surface mt-5 p-3 text-left text-sm text-base-content/70">{debugMessage}</p>
		{/if}
		<div class="mt-7 grid gap-2.5">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
			<a
				class="btn gap-2 btn-lg btn-primary"
				href={localizeHref('/')}
				onclick={() => trackEvent('error_home_clicked', { status })}
			>
				<Icon name="map" size={20} />
				{m.error_home()}
			</a>
			<button class="btn gap-2 btn-lg btn-ghost" onclick={() => window.location.reload()}>
				<Icon name="refresh" size={18} />
				{m.error_reload()}
			</button>
		</div>
	</div>
</div>
