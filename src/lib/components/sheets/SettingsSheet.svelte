<script lang="ts">
	/**
	 * Secondary controls live in one calm place instead of cluttering the header:
	 * text size, language and the privacy page. Every option is a large, labelled
	 * button with a visible state — no icon-only surprises.
	 */
	import { page } from '$app/state';
	import { localizeHref, locales } from '$lib/paraglide/runtime';
	import { currentLocale, LOCALE_CHOICE_KEY } from '$lib/i18n';
	import { textSize } from '$lib/stores/textSize.svelte';
	import { installHint } from '$lib/stores/installHint.svelte';
	import { trackEvent } from '$lib/telemetry';
	import { mapTiles } from '$lib/mapTiles';
	import * as m from '$lib/paraglide/messages.js';
	import BottomSheet from './BottomSheet.svelte';
	import Icon from '../ui/Icon.svelte';

	import { locationMarks } from '$lib/stores/locationMarks.svelte';
	import { locations } from '$lib/data/locations';

	interface Props {
		open: boolean;
		onclose: () => void;
		onopenPassport: () => void;
		onopenSuggest: () => void;
	}

	let { open, onclose, onopenPassport, onopenSuggest }: Props = $props();

	/** Each tile source's credit once, in the order the layers appear on the map. */
	const mapCredits = [
		...new Set(Object.values(mapTiles).flatMap((tile) => tile.attribution.split(', ')))
	];
</script>

<BottomSheet {open} {onclose} title={m.settings_title()}>
	<div class="space-y-7">
		<section class="space-y-3">
			<div class="flex items-center gap-2.5">
				<span class="icon-tile"><Icon name="text" size={20} /></span>
				<div>
					<h3 class="text-base leading-tight font-semibold">{m.settings_text_size()}</h3>
					<p class="text-sm text-base-content/60">{m.settings_text_hint()}</p>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<button
					type="button"
					class="option flex-col gap-0.5 py-3"
					aria-pressed={textSize.value === 'normal'}
					onclick={() => {
						textSize.set('normal');
						trackEvent('text_size_changed', { size: 'normal' });
					}}
				>
					<span class="text-xl leading-none" aria-hidden="true">A</span>
					<span class="text-sm">{m.settings_text_normal()}</span>
				</button>
				<button
					type="button"
					class="option flex-col gap-0.5 py-3"
					aria-pressed={textSize.value === 'large'}
					onclick={() => {
						textSize.set('large');
						trackEvent('text_size_changed', { size: 'large' });
					}}
				>
					<span class="text-[1.6rem] leading-none" aria-hidden="true">A</span>
					<span class="text-sm">{m.settings_text_large()}</span>
				</button>
			</div>
		</section>

		<section class="space-y-3">
			<div class="flex items-center gap-2.5">
				<span class="icon-tile"><Icon name="language" size={20} /></span>
				<h3 class="text-base font-semibold">{m.settings_language()}</h3>
			</div>
			<div class="seg w-full">
				{#each locales as locale (locale)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
					<a
						href={localizeHref(page.url.pathname, { locale })}
						class="seg-btn h-10 flex-1"
						aria-current={currentLocale() === locale}
						onclick={() => {
							try {
								localStorage.setItem(LOCALE_CHOICE_KEY, '1');
							} catch {
								// Storage can be unavailable; the chosen locale still applies this visit.
							}
							trackEvent('language_changed', { locale });
						}}
					>
						{locale === 'de' ? 'Deutsch' : 'English'}
					</a>
				{/each}
			</div>
		</section>

		<section class="space-y-2 border-t border-white/8 pt-5">
			<button type="button" class="row-link" onclick={onopenPassport}>
				<span class="icon-tile"><Icon name="check-circle" size={20} /></span>
				<span class="min-w-0 flex-1">
					<span class="block font-semibold">{m.passport_title()}</span>
					<span class="block truncate text-sm text-base-content/60">
						{m.passport_progress({ count: locationMarks.visited.size, total: locations.length })}
					</span>
				</span>
				<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
			</button>

			<button type="button" class="row-link" onclick={onopenSuggest}>
				<span class="icon-tile"><Icon name="bulb" size={20} /></span>
				<span class="min-w-0 flex-1 font-semibold">{m.suggest_title()}</span>
				<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
			</button>

			<button
				type="button"
				class="row-link"
				onclick={() => {
					onclose();
					installHint.show();
					trackEvent('install_opened_from_settings', {});
				}}
			>
				<span class="icon-tile"><Icon name="download" size={20} /></span>
				<span class="min-w-0 flex-1 font-semibold">{m.settings_install()}</span>
				<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
			</button>

			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- localized internal link -->
			<a href={localizeHref('/datenschutz')} class="row-link">
				<span class="icon-tile bg-white/6 text-base-content/80"
					><Icon name="shield" size={20} /></span
				>
				<span class="min-w-0 flex-1">
					<span class="block font-semibold">{m.privacy_link()}</span>
					<span class="block truncate text-sm text-base-content/60">{m.settings_about()}</span>
				</span>
				<Icon name="chevron-right" class="shrink-0 text-base-content/35" />
			</a>
		</section>

		<!-- Credits for the map tiles and artwork live here, so the map itself stays uncluttered. -->
		<section class="space-y-2 text-sm text-base-content/60">
			<h3 class="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
				{m.settings_credits()}
			</h3>
			<p>{m.settings_credits_map()}: {mapCredits.join(', ')}</p>
			<p>{m.logo_credit()}</p>
		</section>
	</div>
</BottomSheet>

<style>
	.option {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 3rem;
		padding: 0.5rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 0.9rem;
		background: var(--surface);
		text-align: center;
		transition:
			background-color 180ms ease-out,
			border-color 180ms ease-out,
			color 180ms ease-out,
			transform 160ms var(--ease-out-soft);
	}

	.option:hover {
		background: var(--surface-hover);
	}

	.option:active {
		transform: scale(0.97);
	}

	.option[aria-pressed='true'] {
		border-color: color-mix(in oklab, var(--color-primary) 45%, transparent);
		background: color-mix(in oklab, var(--color-primary) 14%, transparent);
		color: var(--color-primary);
	}
</style>
