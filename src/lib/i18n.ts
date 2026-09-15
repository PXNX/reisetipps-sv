import { page } from '$app/state';
import { getLocale, type Locale } from '$lib/paraglide/runtime';
import type { LocalizedText } from './data/locations';

/** Reads the active locale, tracking `page.url` so callers re-run on navigation. */
export function currentLocale(): Locale {
	page.url;
	return getLocale();
}

export function localize(text: LocalizedText): string {
	return text[currentLocale() as 'de' | 'en'] ?? text.de;
}
