<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Icon from '$lib/components/ui/Icon.svelte';

	const sections = [
		{ heading: m.privacy_data_heading, body: m.privacy_data_body },
		{ heading: m.privacy_geolocation_heading, body: m.privacy_geolocation_body },
		{ heading: m.privacy_storage_heading, body: m.privacy_storage_body },
		{ heading: m.privacy_analytics_heading, body: m.privacy_analytics_body },
		{ heading: m.privacy_external_heading, body: m.privacy_external_body },
		{ heading: m.privacy_no_tracking_heading, body: m.privacy_no_tracking_body },
		{ heading: m.privacy_contact_heading, body: m.privacy_contact_body }
	];
</script>

<svelte:head>
	<title>{m.privacy_title()} · {m.app_name()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto w-full max-w-2xl px-4 pt-6 pb-12">
	<header class="rise-in flex items-start gap-3">
		<span class="icon-tile h-12 w-12 rounded-2xl"><Icon name="shield" size={24} /></span>
		<div>
			<h1 class="text-2xl leading-tight font-bold">{m.privacy_title()}</h1>
			<p class="mt-1 text-base leading-relaxed text-base-content/75">{m.privacy_intro()}</p>
		</div>
	</header>

	<div class="mt-7 space-y-3">
		{#each sections as section, index (section.heading)}
			<section
				class="surface rise-in p-4"
				style="animation-delay: {Math.min(index, 7) * 40}ms"
			>
				<h2 class="text-sm font-bold tracking-wide text-primary uppercase">
					{section.heading()}
				</h2>
				<p class="mt-1.5 text-base leading-relaxed text-base-content/80">{section.body()}</p>
			</section>
		{/each}
	</div>
</div>
