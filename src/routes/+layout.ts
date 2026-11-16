import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { baseLocale, getLocale, localizeHref } from '$lib/paraglide/runtime';
import { LOCALE_CHOICE_KEY } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const prerender = true;

function prefersGerman(): boolean {
	const primaryLanguage = navigator.languages?.[0] ?? navigator.language;
	return primaryLanguage?.toLowerCase().startsWith('de') ?? false;
}

export const load: LayoutLoad = ({ url }) => {
	if (!browser) return;
	// Follow the device language until the reader explicitly picks one in Settings.
	if (localStorage.getItem(LOCALE_CHOICE_KEY)) return;

	// Only the unprefixed path is ambiguous (it's the base locale by default).
	// An explicit /en/... link was a deliberate choice and is never overridden.
	if (getLocale() !== baseLocale) return;

	if (!prefersGerman()) {
		throw redirect(307, localizeHref(url.pathname + url.search, { locale: 'en' }));
	}
};
