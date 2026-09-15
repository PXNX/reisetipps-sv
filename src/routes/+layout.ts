import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { baseLocale, getLocale, localizeHref } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const prerender = true;

const LOCALE_CHOICE_KEY = 'locale-choice-made';

function prefersGerman(): boolean {
	const primaryLanguage = navigator.languages?.[0] ?? navigator.language;
	return primaryLanguage?.toLowerCase().startsWith('de') ?? false;
}

export const load: LayoutLoad = ({ url }) => {
	if (!browser) return;
	if (localStorage.getItem(LOCALE_CHOICE_KEY)) return;
	localStorage.setItem(LOCALE_CHOICE_KEY, '1');

	// Only the unprefixed path is ambiguous (it's the base locale by default).
	// An explicit /en/... link was a deliberate choice and is never overridden.
	if (getLocale() !== baseLocale) return;

	if (!prefersGerman()) {
		throw redirect(307, localizeHref(url.pathname + url.search, { locale: 'en' }));
	}
};
