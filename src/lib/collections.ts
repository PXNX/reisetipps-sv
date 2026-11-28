/**
 * Small, hand-picked sets that answer "what shall we do today?" without another long list.
 * They are just ids, so they stay in step with the place entries they point at.
 */
import type { LocalizedText } from '$lib/data/types';

export interface Collection {
	id: string;
	title: LocalizedText;
	subtitle: LocalizedText;
	icon: string;
	placeIds: string[];
}

export const collections: Collection[] = [
	{
		id: 'kaese-und-wein',
		title: { de: 'Käse & Wein', en: 'Cheese & wine' },
		subtitle: {
			de: 'Klein, regional und zum Mitnehmen',
			en: 'Small, regional and good to take home'
		},
		icon: 'cheese',
		placeIds: [
			'sennerei-bremenried',
			'alma-kaeslaedele-hoerbranz',
			'weingut-kress-ueberlingen',
			'weingut-teresa-deufel',
			'winzerfest-nonnenhorn'
		]
	},
	{
		id: 'grosse-aussichten',
		title: { de: 'Große Aussichten', en: 'Big views' },
		subtitle: {
			de: 'Weit über den See hinaus',
			en: 'Far out across the lake'
		},
		icon: 'viewpoint',
		placeIds: [
			'pfaender',
			'weissensberger-halde',
			'streitelsfingen',
			'gerberschanze',
			'katharinenfelsen-ueberlingen'
		]
	},
	{
		id: 'mit-der-bahn',
		title: { de: 'Mit der Bahn', en: 'By train' },
		subtitle: {
			de: 'Vom Bahnhof bequem zu Fuß',
			en: 'An easy walk from the station'
		},
		icon: 'transit',
		placeIds: [
			'konstanz-altstadt',
			'meersburg-altstadt',
			'lindau-altstadt',
			'ueberlingen-altstadt',
			'reichenau',
			'zeppelin-museum'
		]
	},
	{
		id: 'alte-mauern',
		title: { de: 'Alte Mauern', en: 'Old walls' },
		subtitle: {
			de: 'Burgen, Klöster und Ruinen',
			en: 'Castles, monasteries and ruins'
		},
		icon: 'ruins',
		placeIds: [
			'hohentwiel',
			'altbodman',
			'burghalde-sipplingen',
			'kloster-salem',
			'schloss-sigmaringen',
			'festungsmuseum-heldsberg'
		]
	},
	{
		id: 'naschkatzen',
		title: { de: 'Naschkatzen', en: 'Sweet tooth' },
		subtitle: {
			de: 'Bäckereien, Cafés und Eis',
			en: 'Bakeries, cafés and ice cream'
		},
		icon: 'sweets',
		placeIds: [
			'kleines-cafe',
			'cafe-hoepker',
			'webers-backstube-friedrichshafen',
			'backhaus-mahl-ueberlingen',
			'fidelisbaeck-wangen'
		]
	}
];

export function getCollection(id: string | null): Collection | null {
	return collections.find((collection) => collection.id === id) ?? null;
}
