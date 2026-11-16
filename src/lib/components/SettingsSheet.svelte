<script lang="ts">
	/**
	 * Secondary controls live in one calm place instead of cluttering the header:
	 * text size, language and the privacy page. Every option is a large, labelled
	 * button with a visible state — no icon-only surprises.
	 */
	import { page } from '$app/state';
	import { localizeHref, locales } from '$lib/paraglide/runtime';
	import { currentLocale } from '$lib/i18n';
	import { textSize } from '$lib/stores/textSize.svelte';
	import { installHint } from '$lib/stores/installHint.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();
</script>

<BottomSheet {open} {onclose}>
	<div class="space-y-6 pt-1">
		<h2 class="text-xl font-bold">{m.settings_title()}</h2>

		<section class="space-y-2">
			<h3 class="text-base font-semibold">{m.settings_text_size()}</h3>
			<p class="text-sm text-base-content/80">{m.settings_text_hint()}</p>
			<div class="grid grid-cols-2 gap-3 pt-1">
				<button
					type="button"
					class="btn btn-lg flex-col gap-0 {textSize.value === 'normal'
						? 'btn-primary'
						: 'btn-outline'}"
					aria-pressed={textSize.value === 'normal'}
					onclick={() => textSize.set('normal')}
				>
					<span class="text-xl leading-none" aria-hidden="true">A</span>
					<span class="text-sm">{m.settings_text_normal()}</span>
				</button>
				<button
					type="button"
					class="btn btn-lg flex-col gap-0 {textSize.value === 'large'
						? 'btn-primary'
						: 'btn-outline'}"
					aria-pressed={textSize.value === 'large'}
					onclick={() => textSize.set('large')}
				>
					<span class="text-3xl leading-none" aria-hidden="true">A</span>
					<span class="text-sm">{m.settings_text_large()}</span>
				</button>
			</div>
		</section>

		<section class="space-y-2">
			<h3 class="text-lg font-semibold">{m.settings_language()}</h3>
			<div class="join w-full">
				{#each locales as locale (locale)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
					<a
						href={localizeHref(page.url.pathname, { locale })}
						class="btn join-item flex-1 {currentLocale() === locale ? 'btn-primary' : 'btn-outline'}"
						aria-current={currentLocale() === locale}
					>
						{locale === 'de' ? 'Deutsch' : 'English'}
					</a>
				{/each}
			</div>
		</section>

		<section class="border-t border-base-300 pt-4">
			<button
				type="button"
				class="btn btn-outline w-full gap-2"
				onclick={() => {
					onclose();
					installHint.show();
				}}
			>
				<span aria-hidden="true">📲</span>
				{m.settings_install()}
			</button>
		</section>

		<section class="space-y-2 border-t border-base-300 pt-4 text-sm text-base-content/80">
			<p>{m.settings_about()}</p>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
			<a href={localizeHref('/datenschutz')} class="link link-primary text-base">
				{m.privacy_link()}
			</a>
		</section>
	</div>
</BottomSheet>
