/**
 * Search that understands how people actually talk about a day out: they type "Käse", "cheese",
 * "Aussicht" or make a small typo. Everything is normalised once per place, so typing stays quick.
 */
import { categoryLabel, durationLabel } from '$lib/categories';
import type { Location } from '$lib/data/types';
import { localize } from '$lib/i18n';

type Locale = 'de' | 'en';

/** Lowercase, strip accents and punctuation, and treat ß like ss. */
export function normalizeText(value: string): string {
	return value
		.toLocaleLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

/** Groups of everyday words that should lead to the same places. */
const synonymGroups = [
	['kase', 'kaseladele', 'cheese', 'kaese'],
	['wein', 'weingut', 'weine', 'wine', 'winzer'],
	['metzgerei', 'butcher', 'fleisch', 'wurst', 'metzger'],
	['aussicht', 'ausblick', 'view', 'viewpoint', 'blick', 'panorama'],
	['museum', 'kultur', 'culture', 'ausstellung', 'galerie'],
	['schloss', 'castle', 'burg', 'ruine', 'ruins', 'palace'],
	['see', 'lake', 'ufer', 'strand', 'shore'],
	['wandern', 'hike', 'hiking', 'wanderung', 'trail'],
	['radeln', 'bike', 'cycling', 'fahrrad', 'bicycle'],
	['kaffee', 'coffee', 'cafe', 'café', 'backerei', 'bakery'],
	['eis', 'ice', 'icecream', 'eisdiele'],
	['bier', 'beer', 'brauerei', 'brewery'],
	['natur', 'nature', 'wald', 'forest', 'park'],
	['geschichte', 'history', 'historisch', 'denkmal'],
	['technik', 'technology', 'technologie'],
	['kinder', 'family', 'familie', 'kids'],
	['regen', 'rain', 'regenstag'],
	['bahn', 'train', 'zug', 'bahnhof', 'station']
];

const canonicalByTerm = new Map<string, string>();
for (const group of synonymGroups) {
	for (const term of group) canonicalByTerm.set(term, group[0]);
}
const expansionByTerm = new Map<string, string[]>();
for (const group of synonymGroups) {
	for (const term of group) expansionByTerm.set(term, group);
}

function editDistance(a: string, b: string): number {
	if (a === b) return 0;
	if (Math.abs(a.length - b.length) > 2) return 3;
	let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
	for (let i = 1; i <= a.length; i++) {
		const current = [i];
		for (let j = 1; j <= b.length; j++) {
			current[j] = Math.min(
				current[j - 1] + 1,
				previous[j] + 1,
				previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
			);
		}
		previous = current;
	}
	return previous[b.length];
}

/** Short words must match exactly; longer ones may have one or two letters wrong. */
function closeEnough(a: string, b: string): boolean {
	if (a === b) return true;
	if (a.length >= 3 && b.startsWith(a)) return true;
	const allowed = a.length >= 6 ? 2 : a.length >= 4 ? 1 : 0;
	return allowed > 0 && editDistance(a, b) <= allowed;
}

const haystackCache = new Map<string, string>();
const tokenCache = new Map<string, string[]>();

function haystackFor(location: Location, locale: Locale): string {
	const key = `${locale}:${location.id}`;
	let cached = haystackCache.get(key);
	if (cached === undefined) {
		cached = normalizeText(
			[
				location.name.de,
				location.name.en,
				location.teaser.de,
				location.teaser.en,
				location.description.de,
				location.description.en,
				location.tip.de,
				location.tip.en,
				location.nearestStation,
				...location.categories.flatMap((category) => [category, categoryLabel(category)]),
				...location.duration.map((duration) => durationLabel(duration))
			].join(' ')
		);
		haystackCache.set(key, cached);
	}
	return cached;
}

function tokensFor(haystack: string): string[] {
	let cached = tokenCache.get(haystack);
	if (cached === undefined) {
		cached = haystack.split(' ').filter(Boolean);
		tokenCache.set(haystack, cached);
	}
	return cached;
}

function expandedTerms(token: string): string[] {
	const canonical = canonicalByTerm.get(token);
	return canonical ? (expansionByTerm.get(canonical) ?? [token]) : [token];
}

/** True when the query matches the place directly, through a synonym, or with a small typo. */
export function matchesQuery(location: Location, query: string, locale: Locale): boolean {
	const needle = normalizeText(query);
	if (!needle) return true;
	const haystack = haystackFor(location, locale);
	if (haystack.includes(needle)) return true;

	const tokens = tokensFor(haystack);
	return needle
		.split(' ')
		.filter(Boolean)
		.every((part) => {
			for (const term of expandedTerms(part)) {
				if (tokens.some((token) => closeEnough(term, token))) return true;
			}
			return false;
		});
}
