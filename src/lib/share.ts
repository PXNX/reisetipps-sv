/**
 * Shareable links for a plan. Everything lives in the URL, so a tour or a set of filters can be
 * copied, sent in a message and opened later without an account or a database.
 */
import { allCategories, allDurations } from '$lib/categories';
import { locations } from '$lib/data/locations';
import type { Category, Duration } from '$lib/data/types';
import type { TourMode } from '$lib/stores/tour.svelte';

export interface ShareState {
	focus?: string | null;
	tour?: string[];
	mode?: TourMode;
	categories?: Category[];
	duration?: Duration | null;
	query?: string;
}

const knownIds = new Set(locations.map((location) => location.id));

function splitList(value: string | null): string[] {
	return value
		? value
				.split(',')
				.map((part) => part.trim())
				.filter(Boolean)
		: [];
}

/** Reads a link defensively: unknown ids and values are dropped, never trusted. */
export function parseShareState(params: URLSearchParams): ShareState {
	const focus = params.get('focus');
	const mode = params.get('mode');
	const duration = params.get('dur');
	const query = params.get('q')?.trim().slice(0, 80) ?? '';

	return {
		focus: focus && knownIds.has(focus) ? focus : null,
		tour: splitList(params.get('tour'))
			.filter((id) => knownIds.has(id))
			.slice(0, 12),
		mode: mode === 'bike' || mode === 'walk' ? mode : undefined,
		categories: splitList(params.get('cat')).filter((value): value is Category =>
			(allCategories as string[]).includes(value)
		),
		duration:
			duration && (allDurations as string[]).includes(duration)
				? (duration as Duration)
				: undefined,
		query: query || undefined
	};
}

/** Relative URL for the current state. The caller makes it absolute when copying. */
export function sharePath(state: ShareState): string {
	const params = new URLSearchParams();
	if (state.focus) params.set('focus', state.focus);
	if (state.tour && state.tour.length > 0) params.set('tour', state.tour.join(','));
	if (state.mode) params.set('mode', state.mode);
	if (state.categories && state.categories.length > 0) {
		params.set('cat', state.categories.join(','));
	}
	if (state.duration) params.set('dur', state.duration);
	if (state.query?.trim()) params.set('q', state.query.trim().slice(0, 80));
	const suffix = params.toString();
	return suffix ? `/?${suffix}` : '/';
}

/** Copies a link, using the Web Share sheet when the device offers one. */
export async function shareOrCopy(
	url: string,
	title: string,
	text: string
): Promise<'shared' | 'copied' | 'failed'> {
	if (typeof navigator !== 'undefined' && navigator.share) {
		try {
			await navigator.share({ title, text, url });
			return 'shared';
		} catch (error) {
			// A cancelled share sheet is not a failure worth reporting.
			if (error instanceof DOMException && error.name === 'AbortError') return 'shared';
		}
	}
	try {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return 'failed';
		await navigator.clipboard.writeText(url);
		return 'copied';
	} catch {
		return 'failed';
	}
}
