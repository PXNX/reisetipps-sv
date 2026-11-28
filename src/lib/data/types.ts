export type Category =
	| 'nature'
	| 'culture'
	| 'culinary'
	| 'history'
	| 'technology'
	| 'viewpoint'
	| 'cheese'
	| 'butcher'
	| 'ruins'
	| 'drinks'
	| 'sweets';

export type Duration = 'short' | 'medium' | 'long';

export interface LocalizedText {
	de: string;
	en: string;
}

export interface LocationImage {
	url: string;
	alt: LocalizedText;
	attribution: string;
}

export interface Location {
	id: string;
	/** [lat, lng] */
	coordinates: [number, number];
	categories: Category[];
	duration: Duration[];
	nearestStation: string;
	name: LocalizedText;
	teaser: LocalizedText;
	description: LocalizedText;
	tip: LocalizedText;
	openingHours?: LocalizedText;
	url?: string;
	image?: LocationImage;
	/**
	 * Up to three photos for the swipeable gallery. The first entry should be
	 * the same as `image`, which stays the fallback cover photo.
	 */
	images?: LocationImage[];
	/** Emoji that overrides the category icon for this location, e.g. 🎥 for cinema events. */
	icon?: string;
}

export function googleMapsUrl(location: Location): string {
	const [lat, lng] = location.coordinates;
	return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Walking directions to a place, starting at the reader's position when we know it. */
export function directionsUrl(location: Location, origin?: [number, number] | null): string {
	const [lat, lng] = location.coordinates;
	const params = new URLSearchParams({
		api: '1',
		destination: `${lat},${lng}`,
		travelmode: 'walking'
	});
	if (origin) params.set('origin', `${origin[0]},${origin[1]}`);
	return `https://www.google.com/maps/dir/?${params}`;
}

export function hikingMapUrl(location: Location): string {
	const [lat, lng] = location.coordinates;
	return `https://www.opentopomap.org/#marker=15/${lat}/${lng}`;
}

export function cyclingMapUrl(location: Location): string {
	const [lat, lng] = location.coordinates;
	return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}&layers=Y`;
}

export const stations = [
	'Lindau-Insel',
	'Lindau-Reutin',
	'Bregenz',
	'Friedrichshafen Stadt',
	'Friedrichshafen Hafen',
	'Friedrichshafen Flughafen',
	'Wasserburg (Bodensee)',
	'Langenargen',
	'Überlingen',
	'Radolfzell',
	'Konstanz',
	'Singen (Hohentwiel)',
	'Riehen',
	'Kaiseraugst',
	'Markdorf',
	'Hergatz',
	'Uhldingen-Mühlhofen',
	'Sigmaringen',
	'Aulendorf',
	'Oberstdorf'
] as const;

export type Station = (typeof stations)[number];
