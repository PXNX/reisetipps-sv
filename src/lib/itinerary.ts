/** A readable day plan from the reader's stops, ready to copy into a message or notes app. */
import { durationLabel } from '$lib/categories';
import type { Location } from '$lib/data/types';
import type { TourMode } from '$lib/stores/tour.svelte';

export function buildItinerary(
	stops: Location[],
	mode: TourMode,
	locale: 'de' | 'en',
	link = ''
): string {
	const heading = locale === 'de' ? 'Mein Tag am Bodensee' : 'My day at Lake Constance';
	const travel = locale === 'de' ? 'Unterwegs: zu Fuß' : 'Getting around: on foot';
	const bike = locale === 'de' ? 'Unterwegs: mit dem Rad' : 'Getting around: by bike';
	const lines = [
		heading,
		'',
		...stops.flatMap((stop, index) => {
			const name = stop.name[locale] ?? stop.name.de;
			const duration = stop.duration[0] ? durationLabel(stop.duration[0]) : '';
			return [
				`${index + 1}. ${name}`,
				`   ${stop.nearestStation}${duration ? ` · ${duration}` : ''}`
			];
		}),
		'',
		mode === 'bike' ? bike : travel
	];
	if (link) lines.push('', `Route: ${link}`);
	return lines.join('\n');
}
