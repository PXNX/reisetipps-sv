/**
 * Tiny guides for the situation the reader is actually in: grey sky, hot sun, or just the season.
 * They reuse the same ids and the same selection flow as the everyday collections.
 */
import type { LocalizedText } from '$lib/data/types';

export interface MiniGuide {
	id: string;
	title: LocalizedText;
	subtitle: LocalizedText;
	icon: string;
	placeIds: string[];
	months?: number[];
}

export const weatherGuides: MiniGuide[] = [
	{
		id: 'regen-tag',
		title: { de: 'Regen-Tag', en: 'Rainy day' },
		subtitle: { de: 'Drinnen, aber nicht langweilig', en: 'Indoors, never dull' },
		icon: 'culture',
		placeIds: [
			'zeppelin-museum',
			'dornier-museum',
			'kunsthaus-bregenz',
			'pfahlbauten',
			'meersburg-altstadt',
			'schloss-sigmaringen',
			'sennerei-bremenried'
		]
	},
	{
		id: 'sonnen-tag',
		title: { de: 'Sonnentag', en: 'Sunny day' },
		subtitle: { de: 'Raus an den See und hoch hinaus', en: 'Out to the lake and up high' },
		icon: 'viewpoint',
		placeIds: [
			'pfaender',
			'weissensberger-halde',
			'gerberschanze',
			'lindau-hafen',
			'birnau',
			'strandbad-eichwald'
		]
	},
	{
		id: 'schatten',
		title: { de: 'Schatten finden', en: 'Find some shade' },
		subtitle: { de: 'Wälder, Schluchten, kühle Ecken', en: 'Forests, gorges and cool corners' },
		icon: 'nature',
		placeIds: [
			'marienschlucht',
			'rappenlochschlucht',
			'kirchle-ebnit',
			'affenberg-salem',
			'rheindamm',
			'bisongehege-bodenwald'
		]
	}
];

export const seasonalGuides: MiniGuide[] = [
	{
		id: 'sommer',
		title: { de: 'Sommer am See', en: 'Summer by the lake' },
		subtitle: {
			de: 'Baden, Kino unter Sternen, lange Abende',
			en: 'Swimming, open-air cinema, long evenings'
		},
		icon: 'sparkle',
		months: [6, 7, 8],
		placeIds: [
			'open-air-kino-wasserburg',
			'open-air-kino-hagnau',
			'strandbad-eichwald',
			'freibad-aquamarin-wasserburg',
			'strandbad-degersee',
			'seehalde-birnau'
		]
	},
	{
		id: 'herbst',
		title: { de: 'Herbst am See', en: 'Autumn by the lake' },
		subtitle: { de: 'Wein, Wälder und weite Blicke', en: 'Wine, woods and wide views' },
		icon: 'drinks',
		months: [9, 10, 11],
		placeIds: [
			'winzerfest-nonnenhorn',
			'weingut-kress-ueberlingen',
			'weingut-teresa-deufel',
			'hohentwiel',
			'streitelsfingen',
			'altbodman'
		]
	},
	{
		id: 'winter',
		title: { de: 'Ruhiger Winter', en: 'A quieter winter' },
		subtitle: { de: 'Museen, Kaffee und klare Luft', en: 'Museums, coffee and clear air' },
		icon: 'culture',
		months: [12, 1, 2],
		placeIds: [
			'kunsthaus-bregenz',
			'zeppelin-museum',
			'dornier-museum',
			'cafe-hoepker',
			'webers-backstube-friedrichshafen',
			'meersburg-altstadt'
		]
	},
	{
		id: 'fruehling',
		title: { de: 'Frühling erwacht', en: 'Spring wakes up' },
		subtitle: { de: 'Blüten, Tiere und erste Ausflüge', en: 'Blossoms, animals and first outings' },
		icon: 'nature',
		months: [3, 4, 5],
		placeIds: [
			'mainau',
			'affenberg-salem',
			'obst-und-beerenhof-pfleghaar',
			'mettnau',
			'bisongehege-bodenwald',
			'kloster-salem'
		]
	}
];

/** One seasonal guide for the current month, using the region's time zone. */
export function seasonalGuideFor(date = new Date()): MiniGuide {
	const month = Number(
		new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', month: 'numeric' }).format(date)
	);
	return seasonalGuides.find((guide) => guide.months?.includes(month)) ?? seasonalGuides[0];
}
