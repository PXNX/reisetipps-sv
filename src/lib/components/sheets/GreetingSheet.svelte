<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { trackEvent } from '$lib/telemetry';
	import * as m from '$lib/paraglide/messages.js';
	import BottomSheet from './BottomSheet.svelte';
	import bodenseeLogo from '$lib/assets/bodensee-logo.svg';

	const SEEN_KEY = 'greeting-seen';
	let open = $state(false);

	onMount(() => {
		if (!browser) return;
		if (!localStorage.getItem(SEEN_KEY)) {
			open = true;
			localStorage.setItem(SEEN_KEY, '1');
		}
	});

	function close() {
		open = false;
		trackEvent('greeting_dismissed', {});
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<BottomSheet {open} onclose={close}>
	<div class="flex flex-col gap-4 pt-2">
		<img
			src={bodenseeLogo}
			alt=""
			class="h-20 w-auto self-center drop-shadow-[0_0_12px_rgba(127,211,234,0.35)]"
		/>

		<h2 class="text-2xl font-bold">{m.greeting_heading()}</h2>
		<p class="leading-relaxed whitespace-pre-line">{m.greeting_body()}</p>

		<button class="btn w-full btn-lg btn-primary" onclick={close}>{m.greeting_close()}</button>

		<a href={localizeHref('/datenschutz')} class="link self-center text-sm link-primary">
			{m.privacy_link()}
		</a>

		<p class="text-center text-sm text-base-content/70">{m.logo_credit()}</p>
	</div>
</BottomSheet>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
