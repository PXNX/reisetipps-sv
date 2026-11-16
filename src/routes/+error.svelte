<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { trackEvent } from '$lib/telemetry';
	import * as m from '$lib/paraglide/messages.js';

	const status = $derived(page.status);
	const isMissing = $derived(status === 404);

	$effect(() => {
		if (browser) trackEvent('error_page_shown', { status });
	});
</script>

<svelte:head>
	<title>{isMissing ? m.error_404_title() : m.error_generic_title()} · {m.app_name()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-dvh items-center justify-center bg-base-100 px-6 py-10 text-base-content">
	<div class="w-full max-w-md space-y-5 text-center">
		<div class="text-5xl" aria-hidden="true">🧭</div>
		<p class="text-sm font-semibold tracking-wide text-primary uppercase">
			{m.error_code({ status })}
		</p>
		<h1 class="text-3xl leading-tight font-bold">
			{isMissing ? m.error_404_title() : m.error_generic_title()}
		</h1>
		<p class="text-base leading-relaxed text-base-content/80">
			{isMissing ? m.error_404_body() : m.error_generic_body()}
		</p>
		{#if dev && page.error?.message}
			<p class="rounded-field bg-base-300 p-3 text-left text-sm">{page.error.message}</p>
		{/if}
		<div class="grid gap-3 pt-2">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
			<a
				class="btn btn-primary btn-lg"
				href={localizeHref('/')}
				onclick={() => trackEvent('error_home_clicked', { status })}
			>
				{m.error_home()}
			</a>
			<button class="btn btn-outline btn-lg" onclick={() => location.reload()}>
				{m.error_reload()}
			</button>
		</div>
	</div>
</div>
