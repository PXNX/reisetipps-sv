<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { trackEvent } from '$lib/telemetry';
	import * as m from '$lib/paraglide/messages.js';
	import BottomSheet from './BottomSheet.svelte';
	import Icon from '../ui/Icon.svelte';
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
<BottomSheet {open} onclose={close} title={m.greeting_heading()}>
	<div class="flex flex-col gap-5 pt-1">
		<div class="relative mx-auto grid place-items-center">
			<span class="absolute h-24 w-40 rounded-full bg-primary/20 blur-3xl" aria-hidden="true"
			></span>
			<img
				src={bodenseeLogo}
				alt=""
				class="float-soft relative h-20 w-auto drop-shadow-[0_0_18px_rgba(127,211,234,0.35)]"
			/>
		</div>

		<p class="leading-relaxed whitespace-pre-line text-base-content/90">{m.greeting_body()}</p>

		<button class="btn w-full gap-2 btn-lg btn-primary" onclick={close}>
			{m.greeting_close()}
			<Icon name="arrow-right" size={20} />
		</button>

		<div class="flex justify-center border-t border-white/8 pt-4">
			<a href={localizeHref('/datenschutz')} class="link text-sm link-primary">
				{m.privacy_link()}
			</a>
		</div>
	</div>
</BottomSheet>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
