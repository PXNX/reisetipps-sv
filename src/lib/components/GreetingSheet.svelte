<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
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
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<BottomSheet {open} onclose={close}>
	<div class="flex flex-col items-center gap-4 pt-2 text-center">
		<img
			src={bodenseeLogo}
			alt=""
			class="h-20 w-auto drop-shadow-[0_0_12px_rgba(98,195,221,0.35)]"
		/>

		<div>
			<h2 class="text-2xl font-semibold">{m.greeting_heading()}</h2>
			<p class="mt-2 text-sm leading-relaxed whitespace-pre-line text-base-content/80">
				{m.greeting_body()}
			</p>
		</div>

		<button class="btn w-full btn-primary" onclick={close}>{m.greeting_close()}</button>

		<a
			href={localizeHref('/privacy')}
			class="text-xs text-base-content/50 underline-offset-2 hover:underline"
		>
			{m.privacy_link()}
		</a>

		<p class="text-[10px] text-base-content/30">{m.logo_credit()}</p>
	</div>
</BottomSheet>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
