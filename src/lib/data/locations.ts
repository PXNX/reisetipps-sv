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
	/** Emoji that overrides the category icon for this location, e.g. 🎥 for cinema events. */
	icon?: string;
}

export function googleMapsUrl(location: Location): string {
	const [lat, lng] = location.coordinates;
	return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
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

export const locations: Location[] = [
	{
		id: 'mainau',
		coordinates: [47.7062, 9.1916],
		categories: ['nature', 'culture'],
		duration: ['medium', 'long'],
		nearestStation: 'Konstanz',
		name: { de: 'Insel Mainau', en: 'Mainau Island' },
		teaser: {
			de: 'Blumeninsel mit Palmen, Schmetterlingshaus und Seeblick.',
			en: 'A flower island with palm gardens, a butterfly house and lake views.'
		},
		description: {
			de: 'Die Blumeninsel im Bodensee ist ganzjährig bepflanzt – von Frühlingsblühern bis zu herbstlichen Dahlien. Barockschloss, Arboretum und ein tropisches Schmetterlingshaus lassen sich in ein bis drei Stunden erkunden.',
			en: 'This flower island stays in bloom year-round, from spring bulbs to autumn dahlias. The baroque palace, arboretum and a tropical butterfly house can be explored in one to three hours.'
		},
		tip: {
			de: 'Mit dem Schiff ab Konstanz anreisen – das ist entspannter als das Auto und man sieht die Insel schon von Weitem.',
			en: 'Arrive by boat from Konstanz — more relaxed than driving, and you see the island from the water first.'
		},
		openingHours: {
			de: 'ganzjährig täglich geöffnet, saisonale Einlasszeiten (z. B. November 9:00–16:00)',
			en: 'open daily all year, seasonal admission hours (e.g. November 9am–4pm)'
		},
		url: 'https://www.mainau.de',
		image: {
			url: '/images/locations/mainau.jpg',
			alt: {
				de: 'Blick über die Blumeninsel Mainau mit Parkanlage und See',
				en: 'View over Mainau flower island with gardens and the lake'
			},
			attribution: '© Rizzo, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'konstanz-altstadt',
		coordinates: [47.6605, 9.1775],
		categories: ['culture', 'history'],
		duration: ['short', 'medium'],
		nearestStation: 'Konstanz',
		name: { de: 'Konstanzer Altstadt & Konzilgebäude', en: 'Konstanz Old Town & Konzil Hall' },
		teaser: {
			de: 'Gotische Gassen, Münster und das Gebäude, in dem einst ein Papst gewählt wurde.',
			en: 'Gothic lanes, a cathedral, and the hall where a pope was once elected.'
		},
		description: {
			de: 'Direkt am Bahnhof beginnt die Altstadt: Münster, Konzilgebäude am Hafen und die Rheinbrücke mit Blick auf den Hafenkran "Imperia". Gut zu Fuß erschließbar, auch bei kurzem Zwischenstopp.',
			en: 'The old town starts right at the station: the cathedral, the harbourside Konzil hall, and the Rhine bridge with a view of the "Imperia" harbour statue. Easy to explore on foot, even on a short layover.'
		},
		tip: {
			de: 'Vom Bahnhof aus sind es nur fünf Minuten bis zum Hafen — perfekt, wenn die Zeit zwischen zwei Zügen knapp ist.',
			en: 'It is just a five-minute walk from the station to the harbour — ideal if you only have time between two trains.'
		},
		url: 'https://www.konstanz-tourismus.de',
		image: {
			url: '/images/locations/konstanz-altstadt.jpg',
			alt: {
				de: 'Der Hafen von Konstanz mit Schiffen und Hafeneinfahrt',
				en: 'Constance harbour with boats at the entrance'
			},
			attribution: '© Sebastian Wallroth, CC BY 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'sealife-konstanz',
		coordinates: [47.6570, 9.1801],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Konstanz',
		name: { de: 'Sea Life Konstanz', en: 'Sea Life Konstanz' },
		teaser: {
			de: 'Aquarium direkt am Hafen, vom heimischen Bodensee bis zum Ozean.',
			en: 'An aquarium right at the harbour, from local lake fish to ocean life.'
		},
		description: {
			de: 'Kompaktes Aquarium mit Bodensee-Fischen, Haien und einem begehbaren Tunnel. Gut für einen regnerischen Nachmittag oder als Programm mit Kindern.',
			en: 'A compact aquarium featuring native Lake Constance fish, sharks, and a walk-through tunnel. A good option on a rainy afternoon or with children in tow.'
		},
		tip: {
			de: 'Tickets vorher online kaufen, spart an Wochenenden Wartezeit am Einlass. Im Preis ist auch das Bodensee-Naturmuseum nebenan.',
			en: 'Buy tickets online in advance — it saves queueing at the entrance on weekends. Admission also includes the Lake Constance Nature Museum next door.'
		},
		openingHours: {
			de: 'täglich 10:00–17:00, letzter Einlass 16:00 (saisonal abweichend)',
			en: 'daily 10am–5pm, last admission 4pm (seasonal variations)'
		},
		url: 'https://www.visitsealife.com/konstanz',
		image: {
			url: '/images/locations/sealife-konstanz.jpg',
			alt: {
				de: 'Das Sea Life Konstanz am Hafen',
				en: 'The Sea Life Konstanz aquarium at the harbour'
			},
			attribution: '© Leonhard Lenz, CC0, via Wikimedia Commons'
		}
	},
	{
		id: 'reichenau',
		coordinates: [47.6990, 9.0618],
		categories: ['history', 'culture'],
		duration: ['medium', 'long'],
		nearestStation: 'Konstanz',
		name: { de: 'Klosterinsel Reichenau', en: 'Reichenau Monastic Island' },
		teaser: {
			de: 'UNESCO-Welterbe: drei mittelalterliche Kirchen auf einer Gemüseinsel.',
			en: 'UNESCO World Heritage: three medieval churches on a market-garden island.'
		},
		description: {
			de: 'Eines der bedeutendsten Klosterzentren des frühen Mittelalters. Münster St. Maria und Markus, karolingische Wandmalereien in St. Georg, dazwischen Gemüsefelder bis ans Ufer.',
			en: 'One of the most important monastic centres of the early Middle Ages. The Münster of St Mary and Mark, Carolingian wall paintings in St George, framed by vegetable fields running down to the shore.'
		},
		tip: {
			de: 'Mit dem Fahrrad von Konstanz aus ist die Insel in gut 30 Minuten erreichbar, auch als kurzer Abstecher.',
			en: 'By bike from Konstanz the island is about 30 minutes away — a good short detour.'
		},
		url: 'https://www.reichenau-tourismus.de',
		image: {
			url: '/images/locations/reichenau.jpg',
			alt: {
				de: 'Die romanische Kirche St. Georg auf der Insel Reichenau',
				en: 'The Romanesque St George church on Reichenau Island'
			},
			attribution: '© JoachimKohler-HB, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'mettnau',
		coordinates: [47.7299, 8.9956],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Radolfzell',
		name: { de: 'Mettnau-Halbinsel', en: 'Mettnau Peninsula' },
		teaser: {
			de: 'Naturschutzgebiet mit Schilfgürtel, Vogelbeobachtung und Uferpfaden.',
			en: 'A nature reserve with reed beds, birdwatching spots and shoreline paths.'
		},
		description: {
			de: 'Ruhige Halbinsel bei Radolfzell mit Rundweg durch Schilf und Streuobstwiesen. Beliebt bei Vogelbeobachtern, im Herbst ziehen hier tausende Wasservögel durch.',
			en: 'A quiet peninsula near Radolfzell with a loop trail through reeds and orchard meadows. Popular with birdwatchers — thousands of waterbirds pass through in autumn.'
		},
		tip: {
			de: 'Direkt vom Bahnhof Radolfzell in 15 Minuten zu Fuß erreichbar, kein Umsteigen nötig.',
			en: 'A 15-minute walk straight from Radolfzell station — no need to change transport.'
		},
		image: {
			url: '/images/locations/mettnau.jpg',
			alt: {
				de: 'Luftbild der Mettnau-Halbinsel über dem Zeller See',
				en: 'Aerial view of the Mettnau peninsula over Lake Zell'
			},
			attribution: '© Hansueli Krapf, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'pfahlbauten',
		coordinates: [47.7262, 9.2282],
		categories: ['history', 'culture'],
		duration: ['medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Pfahlbaumuseum Unteruhldingen', en: 'Pile Dwelling Museum, Unteruhldingen' },
		teaser: {
			de: 'Rekonstruierte Pfahlbausiedlungen aus der Stein- und Bronzezeit.',
			en: 'Reconstructed Stone and Bronze Age pile-dwelling settlements.'
		},
		description: {
			de: 'Begehbare Nachbauten prähistorischer Pfahlbauten direkt am Wasser, UNESCO-Welterbe. Mit Führungen und Mitmach-Stationen auch für Kinder gut geeignet.',
			en: 'Walkable reconstructions of prehistoric pile dwellings right on the water, a UNESCO World Heritage site. Guided tours and hands-on stations make it a good fit for children too.'
		},
		tip: {
			de: 'Am besten per Schiff von Überlingen oder Meersburg anreisen; mit dem Auto vorher einen Parkplatz einplanen, rund um den Strand ist in der Hochsaison schnell alles voll.',
			en: 'Best reached by boat from Überlingen or Meersburg; by car, plan ahead for parking — the shoreline fills up fast in high season.'
		},
		openingHours: {
			de: 'saisonal: Mai–Sep tägl. 9:30–18:00, Okt 10:00–17:30, Nov Sa/So 10:00–16:30; letzter Einlass 30 Min. vorher',
			en: 'seasonal: May–Sep daily 9:30am–6pm, Oct 10am–5:30pm, Nov Sat/Sun 10am–4:30pm; last admission 30 min before'
		},
		url: 'https://www.pfahlbauten.de',
		image: {
			url: '/images/locations/pfahlbauten.jpg',
			alt: {
				de: 'Nachgebaute Pfahlhäuser des Pfahlbaumuseums Unteruhldingen am See',
				en: 'Reconstructed pile dwellings of the Unteruhldingen museum at the lake'
			},
			attribution: '© Andreas F. Borchert, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'affenberg-salem',
		coordinates: [47.7585, 9.2485],
		categories: ['nature'],
		duration: ['medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Affenberg Salem', en: 'Affenberg Salem' },
		teaser: {
			de: 'Freilaufende Berberaffen in einem 20 Hektar großen Waldgehege.',
			en: 'Free-roaming Barbary macaques in a 20-hectare forest enclosure.'
		},
		description: {
			de: 'Rund 200 Berberaffen leben hier frei in einem 20 Hektar großen Wald, Besucher gehen auf ausgewiesenen Pfaden mittendurch. Dazu gibt es die größte frei fliegende Storchenkolonie Süddeutschlands, Damwild und einen 250 Meter langen Baumwipfelpfad. Ein Rundgang dauert etwa 45 bis 90 Minuten.',
			en: 'About 200 Barbary macaques roam freely in a 20-hectare forest, with visitors walking marked paths right through the enclosure. Add southern Germany’s largest free-flying stork colony, fallow deer and a 250-metre treetop path. The loop takes roughly 45 to 90 minutes.'
		},
		tip: {
			de: 'Mit der Buslinie 110 ab Überlingen bis "Affenberg Salem" fahren — oder den Besuch mit dem Kloster Salem kombinieren.',
			en: 'Bus line 110 runs from Überlingen straight to "Affenberg Salem" — or combine the visit with nearby Salem Abbey.'
		},
		openingHours: { de: 'saisonal, März bis Mitte November', en: 'seasonal, March to mid-November' },
		url: 'https://www.affenberg-salem.de',
		image: {
			url: '/images/locations/affenberg-salem.jpg',
			alt: {
				de: 'Ein Berberaffe im Wald des Affenbergs Salem',
				en: 'A Barbary macaque in the forest of Affenberg Salem'
			},
			attribution: '© H. Zell, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'kloster-salem',
		coordinates: [47.7767, 9.2783],
		categories: ['history', 'culture'],
		duration: ['medium', 'long'],
		nearestStation: 'Überlingen',
		name: { de: 'Kloster und Schloss Salem', en: 'Salem Abbey and Palace' },
		teaser: {
			de: 'Ehemalige Reichsabtei, heute Schloss mit Ausstellungen und Weingut.',
			en: 'A former imperial abbey, now a palace with exhibitions and its own winery.'
		},
		description: {
			de: 'Eines der bedeutendsten Klosterensembles Süddeutschlands. Barocke Basilika, Firmensitz einer alten Weinkellerei und wechselnde Ausstellungen im Schloss.',
			en: 'One of the most significant monastic ensembles in southern Germany. A baroque basilica, a historic winery, and rotating exhibitions inside the palace.'
		},
		tip: {
			de: 'Das hauseigene Weingut hat eine kleine Vinothek — eine gute Gelegenheit für eine Verkostung nach der Führung.',
			en: 'The estate winery runs a small tasting room — a good way to round off the visit.'
		},
		image: {
			url: '/images/locations/kloster-salem.jpg',
			alt: {
				de: 'Schloss Salem mit dem Münster der ehemaligen Reichsabtei',
				en: 'Salem Palace with the minster of the former imperial abbey'
			},
			attribution: '© Janobi, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'birnau',
		coordinates: [47.7462, 9.2193],
		categories: ['history', 'culture'],
		duration: ['short'],
		nearestStation: 'Überlingen',
		name: { de: 'Wallfahrtskirche Birnau', en: 'Birnau Pilgrimage Church' },
		teaser: {
			de: 'Barockjuwel hoch über dem See, umgeben von Weinbergen.',
			en: 'A baroque gem high above the lake, surrounded by vineyards.'
		},
		description: {
			de: 'Verspielte Rokoko-Innenausstattung mit dem berühmten "Honigschlecker"-Putto. Der Weg von der Uferpromenade hinauf führt direkt durch die Reben.',
			en: 'A playful rococo interior featuring the famous "honey-licking" cherub. The path up from the lakeside promenade runs straight through the vineyards.'
		},
		tip: {
			de: 'Zehn Minuten hinaufgehen und oben oder unten bei einem der Weingüter eine Rast einlegen — oder nach dem Besuch hinunter zum Restaurant Seehalde am Seeufer.',
			en: 'Walk ten minutes up and rest at one of the vineyard estates at the top or bottom — or head down to the lakeside Seehalde restaurant afterwards.'
		},
		image: {
			url: '/images/locations/birnau.jpg',
			alt: {
				de: 'Die Wallfahrtskirche Birnau über dem Bodensee',
				en: 'The Birnau pilgrimage church above Lake Constance'
			},
			attribution: '© Ursula Jaeger, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'meersburg-altstadt',
		coordinates: [47.6938, 9.2707],
		categories: ['culture', 'history', 'culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Konstanz',
		name: { de: 'Meersburg Altstadt & Burg', en: 'Meersburg Old Town & Castle' },
		teaser: {
			de: 'Fachwerkgassen, die älteste bewohnte Burg Deutschlands, Weinstuben.',
			en: 'Half-timbered lanes, Germany’s oldest inhabited castle, and wine taverns.'
		},
		description: {
			de: 'Steile, autofreie Altstadtgassen führen zur Burg Meersburg hinauf, der ältesten noch bewohnten Burg Deutschlands. Unten am Ufer reihen sich Weinstuben mit Blick auf die Alpen bei klarer Sicht.',
			en: 'Steep, car-free lanes lead up to Meersburg Castle, the oldest inhabited castle in Germany. Down by the shore, wine taverns line the waterfront with Alpine views on a clear day.'
		},
		tip: {
			de: 'Meersburg hat keinen eigenen Bahnhof — mit der Autofähre ab Konstanz-Staad anreisen, das ist Teil des Erlebnisses.',
			en: 'Meersburg has no train station of its own — take the car ferry from Konstanz-Staad, which is part of the experience.'
		},
		image: {
			url: '/images/locations/meersburg-altstadt.jpg',
			alt: {
				de: 'Die Burg Meersburg hoch über dem Bodensee',
				en: 'Meersburg Castle high above Lake Constance'
			},
			attribution: '© H. Zell, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'ueberlingen-altstadt',
		coordinates: [47.7664, 9.1605],
		categories: ['culture', 'history'],
		duration: ['short', 'medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Überlingen Altstadt & Seepromenade', en: 'Überlingen Old Town & Lake Promenade' },
		teaser: {
			de: 'Münster, Rathaus und eine der längsten Seepromenaden am Bodensee.',
			en: 'A cathedral, historic town hall, and one of the longest lakeside promenades.'
		},
		description: {
			de: 'Kompakte Altstadt direkt am Bahnhof, mit gotischem Münster und geschnitztem Ratssaal. Die Promenade lädt zu einem langen Spaziergang mit Seeblick ein. Auch das Hexenhäusle im Stadtgarten, der Gallerturm der Stadtbefestigung und Schloss Rauenstein mit seinem Park lohnen einen Abstecher.',
			en: 'A compact old town right by the station, with a Gothic minster and a carved council chamber. The promenade invites a long lakeside walk. The Hexenhäusle in the municipal garden, the Gallerturm of the town fortifications and Schloss Rauenstein palace with its park are also worth a detour.'
		},
		tip: {
			de: 'Am späten Nachmittag an der Promenade entlang zur Therme spazieren — schöner Blick bei Sonnenuntergang. Für einen längeren Zwischenstopp: ostwärts zur Gletschermühle bei Goldbach weitergehen, dann hinauf zu den Churfirsten und der Burgruine auf der Burghalde und hinab nach Sipplingen ans Seeufer.',
			en: 'Walk the promenade toward the thermal baths in the late afternoon — the sunset views are worth it. For a longer stop: head east to the Gletschermühle by Goldbach, then up to the Churfirsten peaks and the castle ruin on the Burghalde, and down to the lakeshore at Sipplingen.'
		},
		image: {
			url: '/images/locations/ueberlingen-altstadt.jpg',
			alt: {
				de: 'Die Überlinger Altstadt mit Münster vom Garten des Stadtmuseums aus gesehen',
				en: 'Überlingen old town with the minster, seen from the town museum garden'
			},
			attribution: '© Roman Eisele, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'zeppelin-museum',
		coordinates: [47.6508, 9.4832],
		categories: ['technology', 'history'],
		duration: ['medium'],
		nearestStation: 'Friedrichshafen Hafen',
		name: { de: 'Zeppelin Museum Friedrichshafen', en: 'Zeppelin Museum Friedrichshafen' },
		teaser: {
			de: 'Begehbare Nachbildung eines Luftschiff-Passagierabteils und Technikgeschichte.',
			en: 'A walk-through replica airship cabin and the history of the Zeppelin era.'
		},
		description: {
			de: 'Direkt im ehemaligen Hafenbahnhof, größte Zeppelin-Sammlung der Welt. Der rekonstruierte Teil des Luftschiffs "Hindenburg" ist das Highlight.',
			en: 'Housed in the former harbour station building, this is the world’s largest Zeppelin collection. The reconstructed section of the airship "Hindenburg" is the highlight.'
		},
		tip: {
			de: 'Das Museum liegt in Gehweite zum Bahnhof Friedrichshafen Hafen — ideal bei kurzer Wartezeit auf die Fähre.',
			en: 'The museum is a short walk from Friedrichshafen Hafen station — perfect while waiting for a ferry connection.'
		},
		openingHours: {
			de: 'ab 1. November Di–So 10:00–17:00 (saisonal abweichend)',
			en: 'from 1 November Tue–Sun 10am–5pm (seasonal variations)'
		},
		url: 'https://www.zeppelin-museum.de',
		image: {
			url: '/images/locations/zeppelin-museum.jpg',
			alt: {
				de: 'Ausstellungshalle des Zeppelin Museums mit historischem Fahrzeug',
				en: 'Exhibition hall of the Zeppelin Museum with a historic vehicle'
			},
			attribution: '© Daderot, CC0, via Wikimedia Commons'
		}
	},
	{
		id: 'lindau-altstadt',
		coordinates: [47.5466, 9.6832],
		categories: ['culture', 'history'],
		duration: ['short', 'medium'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Lindau Altstadt & Hafen', en: 'Lindau Old Town & Harbour' },
		teaser: {
			de: 'Bayerischer Löwe, Leuchtturm und ein Hafen wie aus dem Bilderbuch.',
			en: 'The Bavarian lion, a lighthouse, and a postcard-perfect harbour.'
		},
		description: {
			de: 'Die Insel Lindau ist zu Fuß in einer Stunde umrundet. Der Hafeneingang mit Löwe und Leuchtturm ist eines der bekanntesten Bodensee-Motive. Weitere Highlights: die Gerberschanze mit ihrer alten Linde, das Zitronengässle, der barocke Cavazzen am Marktplatz und der Pulverturm am Westende der Insel; am Ufer liegt der Märchenpark.',
			en: 'The island town of Lindau can be circled on foot in about an hour. The harbour entrance with its lion and lighthouse is one of the most photographed views on the lake. Further highlights are the Gerberschanze viewpoint with its old lime tree, the Zitronengässle lane, the baroque Cavazzen house on the market square and the Pulverturm at the island’s western end; on the shore lies the Märchenpark.'
		},
		tip: {
			de: 'Direkt vom Bahnhof aus links halten, in fünf Minuten steht man am Hafen.',
			en: 'Keep left straight out of the station — five minutes and you’re at the harbour.'
		},
		image: {
			url: '/images/locations/lindau-altstadt.jpg',
			alt: {
				de: 'Der Lindauer Hafen mit Leuchtturm und Bavaria',
				en: 'The Lindau harbour with lighthouse and Bavaria statue'
			},
			attribution: '© Dietmar Rabich, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'pfaender',
		coordinates: [47.5074, 9.7802],
		categories: ['viewpoint'],
		duration: ['medium'],
		nearestStation: 'Bregenz',
		name: { de: 'Pfänder Seilbahn', en: 'Pfänder Cable Car' },
		teaser: {
			de: 'Panoramablick über den Bodensee und bis zu den Alpen.',
			en: 'A panoramic view across the lake and toward the Alps.'
		},
		description: {
			de: 'Die Seilbahn bringt in wenigen Minuten von Bregenz auf den Hausberg. Oben: Wandergehege mit Alpensteinböcken und ein Rundweg mit Bodensee-Panorama.',
			en: 'The cable car climbs from Bregenz to the local mountain in just a few minutes. At the top: an enclosure with alpine ibex and a loop trail with sweeping lake views.'
		},
		tip: {
			de: 'Bei Föhnlage (klare Sicht nach Südwind) lohnt sich der Aufstieg besonders — dann sieht man bis in die Schweizer Alpen.',
			en: 'The view is best after a föhn wind clears the air — on those days you can see deep into the Swiss Alps.'
		},
		openingHours: {
			de: 'täglich 8:00–19:00, Fahrt zur vollen und halben Stunde',
			en: 'daily 8am–7pm, departures on the hour and half hour'
		},
		url: 'https://www.pfaenderbahn.at',
		image: {
			url: '/images/locations/pfaender.jpg',
			alt: {
				de: 'Eine Gondel der Pfänderbahn über Bregenz',
				en: 'A cable car gondola of the Pfänderbahn above Bregenz'
			},
			attribution: '© A.Savin, FAL, via Wikimedia Commons'
		}
	},
	{
		id: 'kunsthaus-bregenz',
		coordinates: [47.5050, 9.7473],
		categories: ['culture'],
		duration: ['short', 'medium'],
		nearestStation: 'Bregenz',
		name: { de: 'Kunsthaus Bregenz', en: 'Kunsthaus Bregenz' },
		teaser: {
			de: 'Minimalistischer Betonbau von Peter Zumthor mit wechselnden Ausstellungen.',
			en: "Peter Zumthor's minimalist concrete building with rotating exhibitions."
		},
		description: {
			de: 'International renommiertes Museum für zeitgenössische Kunst direkt am See. Die Architektur allein ist einen Besuch wert, auch ohne Interesse an der aktuellen Ausstellung.',
			en: 'An internationally renowned museum for contemporary art right on the lake. The architecture alone is worth the stop, even without an interest in the current show.'
		},
		tip: {
			de: 'Fünf Minuten vom Bahnhof Bregenz entfernt, gut als Zwischenstopp zwischen zwei Zügen geeignet.',
			en: 'Five minutes from Bregenz station — a good stop between two trains.'
		},
		openingHours: { de: 'Di–So 10:00–18:00, Do bis 20:00', en: 'Tue–Sun 10am–6pm, Thu until 8pm' },
		url: 'https://www.kunsthaus-bregenz.at',
		image: {
			url: '/images/locations/kunsthaus-bregenz.jpg',
			alt: {
				de: 'Die gestapelte Betonfassade des Kunsthauses Bregenz',
				en: 'The stacked concrete façade of the Kunsthaus Bregenz'
			},
			attribution: '© A.Savin, FAL, via Wikimedia Commons'
		}
	},
	{
		id: 'sennerei-bremenried',
		coordinates: [47.58, 9.9012],
		categories: ['cheese', 'culinary'],
		duration: ['short'],
		nearestStation: 'Lindau-Reutin',
		name: { de: 'Sennerei Bremenried', en: 'Sennerei Bremenried (Alpine Dairy)' },
		teaser: {
			de: 'Traditionelle Genossenschaftssennerei im Allgäu, Verkauf direkt ab Hof.',
			en: 'A traditional cooperative alpine dairy in the Allgäu, selling straight from the source.'
		},
		description: {
			de: 'Seit über 125 Jahren wird hier naturbelassene Heumilch zu Käse und frischer Butter verarbeitet — eine der letzten Original-Sennereien im Allgäu. Im Laden gibt es unter anderem würzigen Bergkäse, kräftigen Räßkäse, Emmentaler und den typisch allgäuerischen Weißlacker.',
			en: 'For more than 125 years raw hay milk has been turned into cheese and fresh butter here — one of the last original dairies of its kind in the Allgäu. The shop carries, among others, tangy Bergkäse, strong Räßkäse, Emmentaler, and the typically Allgäu Weißlacker.'
		},
		tip: {
			de: 'Liegt einen Zug weiter als der See selbst: mit der Allgäubahn ab Lindau-Reutin Richtung Hergatz bis Weiler-Simmerberg, von dort ein kurzer Spaziergang zum Käseladen. Den Weißlacker nur probieren, wenn kräftiger Geschmack kein Problem ist.',
			en: 'A little further inland than the lake itself: take the Allgäu line from Lindau-Reutin toward Hergatz to Weiler-Simmerberg, then it is a short walk to the cheese shop. Only try the Weißlacker if you do not mind a strong flavor.'
		},
		openingHours: {
			de: 'Mo–Do & Sa 7:00–12:00 & 16:00–18:30, Fr 7:00–18:30, So 7:00–11:30 & 16:00–18:30',
			en: 'Mon–Thu & Sat 7am–noon & 4–6:30pm, Fri 7am–6:30pm, Sun 7–11:30am & 4–6:30pm'
		},
		url: 'https://www.kaese-bestellung.de',
		image: {
			url: '/images/locations/sennerei-bremenried.jpg',
			alt: {
				de: 'Das Empfangsgebäude der Sennerei Bremenried mit Käseladen',
				en: 'The reception building of the Bremenried dairy with its cheese shop'
			},
			attribution: '© Domi1907, CC BY-SA 4.0, via Wikimedia Commons'
		}
	},
	{
		id: 'kirchle-ebnit',
		coordinates: [47.3700348, 9.7777044],
		categories: ['nature'],
		duration: ['long'],
		nearestStation: 'Bregenz',
		name: { de: 'Naturdenkmal Kirchle, Ebnit', en: 'Kirchle Natural Monument, Ebnit' },
		teaser: {
			de: 'Eine trockene Gletscherschlucht hoch über dem Ebniter Tal, geformt wie ein Kirchengewölbe.',
			en: 'A dry glacial gorge high above the Ebnit valley, shaped like a church nave.'
		},
		description: {
			de: 'Schmelzwasser der letzten Eiszeit hat hier eine bis zu 20 Meter tiefe, 65 Meter lange und bis zu 13 Meter breite Klamm ausgewaschen, deren sich nach oben verengende Felswände an ein Kirchengewölbe erinnern. Der Zustieg führt steil von der Bushaltestelle Schmitte/Alploch hinauf.',
			en: 'Meltwater from the last ice age carved this gorge — up to 20 metres deep, 65 metres long and 13 metres wide — with narrowing rock walls that resemble a church nave. The approach climbs steeply from the Schmitte/Alploch bus stop.'
		},
		tip: {
			de: 'Ein Ausflug für einen ganzen Zwischenstopp: mit dem Zug bis Bregenz, dann mit dem Bus bis Schmitte/Alploch und steil zu Fuß hinauf. Feste Schuhe mitbringen, am Einstieg gibt es keinen Parkplatz.',
			en: 'A trip for a longer layover: train to Bregenz, then bus to Schmitte/Alploch, and a steep walk up from there. Wear sturdy shoes — there is no parking at the trailhead.'
		},
		url: 'https://www.rappenloch.at/startseite/sehenswertes/kirchle/',
		image: {
			url: '/images/locations/kirchle-ebnit.jpg',
			alt: {
				de: 'Die trockene Klamm des Kirchle über dem Ebniter Tal',
				en: 'The dry gorge of the Kirchle above the Ebnit valley'
			},
			attribution: '© Asurnipal, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'open-air-kino-wasserburg',
		// nudged ~100 m northwest off the Freibad Aquamarin pin so both markers stay clickable
		coordinates: [47.5669, 9.6400],
		categories: ['culture'],
		duration: ['medium'],
		nearestStation: 'Wasserburg (Bodensee)',
		name: { de: 'Open Air Kino Wasserburg', en: 'Wasserburg Open Air Cinema' },
		teaser: {
			de: 'Sommerkino unter freiem Himmel im Freibad Aquarin.',
			en: 'Open-air summer cinema at the Aquarin lido.'
		},
		description: {
			de: 'An rund zehn Abenden im August wird im Freibad Aquarin unter offenem Himmel gefilmt — Großleinwand, Einlass ab etwa 20:30 Uhr und ein Kiosk vor Ort. Kein Dauerbetrieb, sondern ein saisonales Ereignis für einen Sommerabend.',
			en: 'On around ten evenings in August, films are shown under the open sky at the Aquarin lido — big screen, doors from about 8:30pm, and a kiosk on site. Not a permanent venue, but a seasonal summer-evening event.'
		},
		tip: {
			de: 'Tickets vorher online sichern, an warmen Abenden ist es schnell voll. Bei Starkregen oder Sturm fällt die Vorstellung aus — ab 19:30 Uhr gilt die Info-Hotline +49 8382 9853-60.',
			en: 'Book tickets online in advance — it fills up fast on warm evenings. Shows are cancelled in heavy rain or storm; from 7:30pm the info hotline +49 8382 9853-60 has the latest word.'
		},
		icon: '🎥',
		openingHours: {
			de: 'saisonal: rund zehn Abende im August, Einlass ca. 20:30 Uhr, Beginn ca. 21:00 Uhr',
			en: 'seasonal: around ten evenings in August, doors about 8:30pm, start about 9pm'
		},
		url: 'https://www.wasserburg-bodensee.de/highlights-in-wasserburg/open-air-kino/'
	},
	{
		id: 'open-air-kino-lindau',
		// nudged ~100 m northwest off the Strandbad Eichwald pin so both markers stay clickable
		coordinates: [47.5494, 9.7166],
		categories: ['culture'],
		duration: ['medium'],
		nearestStation: 'Lindau-Reutin',
		name: {
			de: 'Open Air Kino im Strandbad Eichwald',
			en: 'Open Air Cinema at Strandbad Eichwald'
		},
		teaser: {
			de: 'Kinoabende am See, veranstaltet vom Parktheater Lindau.',
			en: 'Cinema evenings by the lake, put on by the Parktheater Lindau.'
		},
		description: {
			de: 'Im Sommer verwandelt sich das Strandbad Eichwald in ein Open-Air-Kino — in Kooperation mit dem Parktheater Lindau. Ein saisonales Event an ausgewählten Abenden, kein dauerhaft bespielter Spielort.',
			en: 'Each summer the Eichwald lido turns into an open-air cinema, in cooperation with the Parktheater Lindau. A seasonal event on selected evenings, not a year-round venue.'
		},
		tip: {
			de: 'Wetterabhängig: bei Sturm oder Dauerregen fallen die Vorstellungen aus. Programm und Tickets gibt es online über Kinoheld.',
			en: 'Weather dependent: shows are called off in storms or prolonged rain. Programme and tickets are available online via Kinoheld.'
		},
		icon: '🎥',
		openingHours: {
			de: 'saisonal: ausgewählte Abende von Ende Juli bis Anfang August, wetterabhängig',
			en: 'seasonal: selected evenings from late July to early August, weather permitting'
		},
		url: 'https://www.kinoheld.de/kino/lindau/open-air-lindau-bodensee/info'
	},
	{
		id: 'lindenhofpark-bad-schachen',
		coordinates: [47.5573, 9.6604],
		categories: ['nature', 'culture'],
		duration: ['short', 'medium'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Lindenhofpark Bad Schachen', en: 'Lindenhofpark, Bad Schachen' },
		teaser: {
			de: 'Landschaftspark mit Villa, Burgruine und Friedensräumen am Ostufer.',
			en: 'A landscape park with a villa, castle ruins and peace rooms on the eastern shore.'
		},
		description: {
			de: 'Rund 7,5 Hektar Park im Osten Lindaus, seit 1956 in städtischem Besitz und ganzjährig kostenfrei geöffnet. Zur Ausstattung gehören die Villa Lindenhof, die Burgruine Degelstein und die Friedensräume; die Wege sind rollstuhlgerecht.',
			en: 'About 7.5 hectares of park in eastern Lindau, owned by the city since 1956 and open all year for free. It includes Villa Lindenhof, the Degelstein castle ruins and the peace rooms, with wheelchair-friendly paths.'
		},
		tip: {
			de: 'Parken gibt es am Westeingang zur Badestelle; vom Bahnhof Lindau-Insel führt ein Spaziergang am Ufer entlang in den Park.',
			en: 'Parking is at the western entrance by the lido; from Lindau-Insel station it is a scenic stroll along the shore into the park.'
		},
		openingHours: {
			de: 'täglich ganzjährig geöffnet, Eintritt frei',
			en: 'open daily all year, free admission'
		},
		image: {
			url: '/images/locations/lindenhofpark-bad-schachen.jpg',
			alt: {
				de: 'Im Lindenhofpark in Bad Schachen mit altem Baumbestand',
				en: 'In the Lindenhofpark at Bad Schachen with its old trees'
			},
			attribution: '© Daderot, public domain, via Wikimedia Commons'
		},
		url: 'https://www.gartendenkmal-lindenhofpark.de/page/lindenhofpark.html'
	},
	{
		id: 'fesslerhof-eichenberg',
		coordinates: [47.5447, 9.7968],
		categories: ['butcher', 'culinary'],
		duration: ['short'],
		nearestStation: 'Bregenz',
		name: { de: 'Bergmetzgerei Fesslerhof', en: 'Fesslerhof Farm Butchery' },
		teaser: {
			de: 'Bergmetzgerei mit Hofladen und Jausenstation — Wurst aus eigener Produktion mit Seeblick.',
			en: 'A farm butchery with shop and snack station — sausages made on site, with a lake view.'
		},
		description: {
			de: 'Seit 1997 steht der Fesslerhof für bodenständige Qualität: Alle Fleisch- und Wurstwaren stammen aus eigener Produktion, seit 2017 kommt das Rindfleisch von der eigenen Mastzucht, dazu arbeitet der Hof mit Bauern aus der Region Eichenberg zusammen. Im Hofladen gibt es die Wurst direkt, oben an der Jausenstation wartet eine Brettljause mit Blick über den Bodensee.',
			en: 'Since 1997 the Fesslerhof has stood for straightforward quality: all meat and sausages come from its own production, since 2017 the beef is from its own cattle breeding, and the farm works with growers from the Eichenberg region. The farm shop sells the sausages directly; up at the snack station a Brettljause awaits with a view over Lake Constance.'
		},
		tip: {
			de: 'Der SB-Automat ist rund um die Uhr gefüllt, falls die Jausenstation geschlossen hat. Die Jausenstation ist von Mai bis Oktober täglich außer montags und donnerstags geöffnet — der Anstieg von Bregenz oder Lochau aus lohnt sich allein für den Ausblick.',
			en: 'The vending machine is stocked around the clock if the snack station is closed. The snack station runs May to October, closed Mondays and Thursdays — the climb from Bregenz or Lochau is worth it for the view alone.'
		},
		openingHours: {
			de: 'Metzgerei Di/Mi/Fr 9:00–17:00, Sa 9:00–14:00; Jausenstation Mai–Okt tägl. 10:00–18:00, außer Mo & Do; SB-Automat 24h',
			en: 'Butchery Tue/Wed/Fri 9am–5pm, Sat 9am–2pm; snack station May–Oct daily 10am–6pm, except Mon & Thu; vending machine 24/7'
		},
		url: 'https://fesslerhof.com'
	},
	{
		id: 'alma-kaeslaedele-hoerbranz',
		coordinates: [47.5442, 9.7495],
		categories: ['cheese', 'culinary'],
		duration: ['short'],
		nearestStation: 'Bregenz',
		name: { de: 'Alma Käslädele Hörbranz', en: 'Alma Käslädele, Hörbranz' },
		teaser: {
			de: 'Käseladen von Alma und Rupp mit Vorarlberger Bergkäse direkt vom Senner — und dem Jersey Blue.',
			en: 'A cheese shop by Alma and Rupp with Vorarlberg mountain cheese straight from the alpine dairy — including the Jersey Blue.'
		},
		description: {
			de: 'Im Alma-Direktverkauf in der Krüzastraße in Hörbranz gibt es Käsespezialitäten der Bregenzerwälder Senner: den international ausgezeichneten Vorarlberger Bergkäse g.U., Alma Alp- und Schnittkäse, der cremige Rahmkäse aus dem Hörbranzer Schmelzkäsewerk und weitere regionale Sorten — dazu hausgemachte Aufstriche.',
			en: 'The Alma direct-sales shop on Krüzastraße in Hörbranz carries cheese specialties from the Bregenzerwald alpine dairies: the award-winning Vorarlberg Bergkäse g.U., Alma alpine and semi-hard cheeses, the creamy Rahm-Käse from the Hörbranz cheese-melting works and more regional varieties, plus homemade spreads.'
		},
		tip: {
			de: 'Die Öffnungszeiten sind überschaubar — vorher kurz prüfen oder anrufen. Von Bregenz oder Lindau aus ist das Lädele mit der Bahn in wenigen Minuten erreicht.',
			en: 'Opening hours are slim — check or call ahead. From Bregenz or Lindau the shop is a few minutes away by train.'
		},
		openingHours: {
			de: 'Di–Fr 9:00–18:00, Sa 9:00–16:00, So + Mo geschlossen',
			en: 'Tue–Fri 9am–6pm, Sat 9am–4pm, closed Sun + Mon'
		},
		url: 'https://www.alma.at'
	},
	{
		id: 'gletschermuehle-goldbach',
		coordinates: [47.7795, 9.1306],
		categories: ['viewpoint'],
		duration: ['short'],
		nearestStation: 'Überlingen',
		name: { de: 'Gletschermühle Goldbach', en: 'Gletschermühle, Goldbach' },
		teaser: {
			de: 'Versteckte Sandsteinhöhle mit riesigen Gletschertöpfen im Spetzgarter Tobel.',
			en: 'Hidden sandstone cave with huge glacial potholes in the Spetzgarter Tobel gorge.'
		},
		description: {
			de: 'Im Spetzgarter Tobel bei Goldbach westlich von Überlingen haben Regen und Wind weiches Molassegestein ausgewaschen — dabei entstanden Gletschermühlen von bis zu 20 Metern Durchmesser. Das Geotop liegt als Naturdenkmal im Naturschutzgebiet Katharinenfelsen direkt an der B 31.',
			en: 'In the Spetzgarter Tobel gorge by Goldbach, west of Überlingen, rain and wind have carved the soft molasse rock into glacial potholes up to 20 metres across. The geotope is a natural monument inside the Katharinenfelsen nature reserve, right by the B31.'
		},
		tip: {
			de: 'Der Einstieg liegt versteckt im Tobel — feste Schuhe mitnehmen und an der B 31 orientieren; gut mit einem Spaziergang durch den Spetzgarter Tobel zu kombinieren.',
			en: 'The entrance is hidden in the gorge — bring sturdy shoes and orient yourself from the B31; combines well with a walk through the Spetzgarter Tobel.'
		},
		url: 'https://lgrbwissen.lgrb-bw.de/geotourismus/glazialformen/alpenvorland/gletschermuehle-ueberlingen'
	},
	{
		id: 'burghalde-sipplingen',
		coordinates: [47.7958, 9.1118],
		categories: ['viewpoint', 'ruins'],
		duration: ['short', 'medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Burghalde (Burgrest Hüneberg)', en: 'Burghalde (Hüneberg Castle Ruins)' },
		teaser: {
			de: 'Burgrest der Haldenburg auf dem 528 Meter hohen Sandsteinrücken des Hünebergs über Sipplingen.',
			en: 'Remains of the Haldenburg castle on the 528-metre sandstone ridge of the Hüneberg above Sipplingen.'
		},
		description: {
			de: 'Östlich von Sipplingen stand auf dem Hüneberg vermutlich seit dem 12. Jahrhundert eine Höhenburg, die auch Haldenburg genannt wird. Heute zeugen noch Mauerreste vom Burgstall; der bewaldete Rücken liegt hoch über dem Steilufer des Bodensees.',
			en: 'East of Sipplingen, a hilltop castle known as Haldenburg probably stood on the Hüneberg from the 12th century. Today only wall remains mark the site; the wooded ridge sits high above the steep shore of Lake Constance.'
		},
		tip: {
			de: 'Der Aufstieg startet in Sipplingen und führt über den bewaldeten Rücken zum Burgstall — gut mit den nahen Sieben Churfirsten zu kombinieren.',
			en: 'The ascent starts in Sipplingen and leads over the wooded ridge to the castle site — easy to combine with the nearby Seven Churfirsten rocks.'
		},
		url: 'https://de.wikipedia.org/wiki/Burgrest_H%C3%BCneberg'
	},
	{
		id: 'katharinenfelsen-ueberlingen',
		coordinates: [47.7815, 9.1277],
		categories: ['viewpoint'],
		duration: ['short'],
		nearestStation: 'Überlingen',
		name: { de: 'Katharinenfelsen', en: 'Katharinenfelsen' },
		teaser: {
			de: 'Bis zu 100 Meter steil abfallende Molasse-Felswand mit Gletschertopf hoch über dem Überlinger See.',
			en: 'Molasse rock wall falling up to 100 metres steep, with a glacial pothole high above Lake Überlingen.'
		},
		description: {
			de: 'Nordwestlich von Überlingen bei Hödingen schützt das Naturschutzgebiet Katharinenfelsen seit 1989 eine bis zu 100 Meter hohe, steil abfallende Felswand aus Oberer Meeresmolasse sowie Felsformationen mit Gletschertopf. Von den Wegen am Abhang reicht der Blick über Sipplingen und den Bodensee.',
			en: 'Northwest of Überlingen near Hödingen, the Katharinenfelsen nature reserve has protected an up-to-100-metre steep rock wall of Upper Marine Molasse and formations with a glacial pothole since 1989. From the paths along the slope, the view reaches across Sipplingen and Lake Constance.'
		},
		tip: {
			de: 'Das Schutzgebiet liegt direkt westlich von Überlingen an der B 31 — auf den Wegen bleiben, der Hang ist steil.',
			en: 'The reserve lies just west of Überlingen by the B31 — stay on the paths, the slope is steep.'
		},
		image: {
			url: '/images/locations/katharinenfelsen-ueberlingen.jpg',
			alt: {
				de: 'Blick vom Katharinenfelsen über den Überlinger See bei Goldbach',
				en: 'View from the Katharinenfelsen rock over Lake Überlingen near Goldbach'
			},
			attribution: '© Frank Vincentz, CC BY-SA 3.0, via Wikimedia Commons'
		},
		url: 'https://de.wikipedia.org/wiki/Katharinenfelsen'
	},
	{
		id: 'sieben-churfirsten-sipplingen',
		coordinates: [47.7926, 9.1176],
		categories: ['culture'],
		duration: ['short'],
		nearestStation: 'Überlingen',
		name: { de: 'Sieben Churfirsten', en: 'Seven Churfirsten' },
		teaser: {
			de: 'Sieben pfeilerartige Sandsteinfelsen am Rotweilerberg — sie ähneln den Mützen der Kurfürsten.',
			en: 'Seven pillar-like sandstone rocks on the Rotweilerberg — they resemble the hats of the prince-electors.'
		},
		description: {
			de: 'Am Rotweilerberg im Naturschutzgebiet Sipplinger Dreieck stehen pfeilerartige, fünf bis sieben Meter hohe Sandsteinfelsen, die in der Nacheiszeit durch Erosion von Regen und Wind entstanden sind. Der Name geht auf die Kurfürsten zurück, deren Mützen den Felsen ähneln sollen; die härteren Gesteinskappen haben den darunterliegenden Sandstein vor der Abtragung geschützt.',
			en: 'On the Rotweilerberg in the Sipplinger Dreieck nature reserve stand pillar-like sandstone rocks, five to seven metres high, formed by rain and wind erosion after the last ice age. The name recalls the prince-electors, whose hats the rocks are said to resemble; the harder rock caps protected the sandstone beneath from erosion.'
		},
		tip: {
			de: 'Die Felsen liegen oberhalb von Süßenmühle am Ortsrand von Sipplingen — ideal mit einem Abstecher zum nahen Burgrest auf der Burghalde zu kombinieren.',
			en: 'The rocks lie above Süßenmühle at the edge of Sipplingen — ideal combined with a visit to the nearby castle ruins on the Burghalde.'
		},
		image: {
			url: '/images/locations/sieben-churfirsten-sipplingen.jpg',
			alt: {
				de: 'Die Felstürme der Sieben Churfirsten oberhalb von Sipplingen',
				en: 'The Sieben Churfirsten rock towers above Sipplingen'
			},
			attribution: '© Jan Czeczotka, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.freizeit-bodensee.com/die-sieben-churfirsten-bei-sipplingen.html'
	},
	{
		id: 'streitelsfingen',
		coordinates: [47.5667, 9.7185],
		categories: ['viewpoint'],
		duration: ['short'],
		nearestStation: 'Lindau-Reutin',
		name: { de: 'Streitelsfingen', en: 'Streitelsfingen' },
		teaser: {
			de: 'Obsthänge über Reutin mit Panoramablick über den Bodensee bis in die Alpen.',
			en: 'Orchard slopes above Reutin with a panoramic view across Lake Constance to the Alps.'
		},
		description: {
			de: 'Streitelsfingen liegt erhöht nordwestlich von Lindau. Von den Obstbaumhängen reicht der Blick über das obere Wannental, Reutin und den Bodensee bis zu den Alpen Österreichs, Liechtensteins und der Schweiz. Unten im Ort steht das Monfort-Schlössle, erstmals 1260 urkundlich erwähnt; im Sommer lockt die Lindauer Dahlienschau.',
			en: 'Streitelsfingen sits high above the northwestern edge of Lindau. From the orchard slopes the view runs over the upper Wannental valley, Reutin and Lake Constance to the Alps of Austria, Liechtenstein and Switzerland. Down in the village stands the Monfort-Schlössle, first documented in 1260; in summer the Lindau dahlia show draws visitors.'
		},
		tip: {
			de: 'Vom Bahnhof Lindau-Reutin aus führt der Weg hinauf durch die Obstwiesen — der Rückblick auf Lindau mit Hafen und Leuchtturm lohnt sich. Gut zu kombinieren mit der Dahlienschau oder dem Monfort-Schlössle.',
			en: 'From Lindau-Reutin station the path climbs through the orchards — the look back at Lindau with its harbour and lighthouse is worth it. Combines well with the dahlia show or the Monfort-Schlössle.'
		}
	},
	{
		id: 'weissensberger-halde',
		coordinates: [47.5775, 9.7262],
		categories: ['viewpoint'],
		duration: ['short', 'medium'],
		nearestStation: 'Lindau-Reutin',
		name: { de: 'Weißensberger Halde', en: 'Weißensberger Halde' },
		teaser: {
			de: 'Aussichtspunkt über Weißensberg mit Marienkapelle und Blick auf Bodensee, Bregenzerwald und Schweizer Alpen.',
			en: 'A viewpoint above Weißensberg with its Marienkapelle and views over Lake Constance, the Bregenz Forest and the Swiss Alps.'
		},
		description: {
			de: 'Die markante Halde ragt auf gut 530 Metern über die Gemeinde Weißensberg. Oben stehen die 1870 von Prinz Luitpold von Bayern erbaute Marienkapelle, Bänke und eine Tafel zum Bergpanorama. Bei wolkenfreiem Blick reicht die Sicht über den Bodensee bis zum Säntis und nach Konstanz; der Jakobusweg führt vorbei, und im August spielt der örtliche Musikverein zum Open-Air-Konzert auf.',
			en: 'The striking hill rises more than 530 metres above the municipality of Weißensberg. At the top stand the Marienkapelle built in 1870 by Prince Luitpold of Bavaria, benches and a board explaining the mountain panorama. On cloudless days the view reaches across Lake Constance to the Säntis and all the way to Constance; the Jakobusweg pilgrimage route passes by, and each August the local brass band plays an open-air concert.'
		},
		tip: {
			de: 'Am schönsten ist die Auffahrt über die kurvigen, verkehrsarmen Straßen von Egghalden oder über Streitelsfingen („Hühnerpass"). Mit dem Rad ist die Halde von Lindau-Reutin aus gut zu erreichen, unten an der Kapelle laden Bänke zum Verweilen ein.',
			en: 'The prettiest approaches are the winding, quiet roads from Egghalden or via Streitelsfingen (the “Hühnerpass”). By bike the hill is an easy ride from Lindau-Reutin station, and benches by the chapel invite you to linger.'
		}
	},
	{
		id: 'organic-distillery-friedrichshafen',
		coordinates: [47.6768, 9.4202],
		categories: ['drinks', 'culinary'],
		duration: ['short'],
		icon: '🍷',
		nearestStation: 'Friedrichshafen Hafen',
		name: { de: 'Organic Distillery Friedrichshafen', en: 'Organic Distillery Friedrichshafen' },
		teaser: {
			de: 'Kleine Bio-Brennerei auf dem Hof in Friedrichshafen-Fischbach/Spaltenstein — Gin und pflanzliche Essenzen.',
			en: 'A small organic distillery on a farm in Friedrichshafen-Fischbach/Spaltenstein — gin and botanical essences.'
		},
		description: {
			de: 'Christine Brugger verbindet auf dem biologisch-dynamischen Hof ihrer Eltern Sensorik-Wissenschaft mit Brennerei-Handwerk. Seit 2014 entstehen hier die beiden Bio-Gins Ginn und Ginnie sowie organische Essenzen und Schlüsselaromen — etwa Zitronenverbena, Mandarine, Minze oder Silberwermut — für Köche, Barkeeper und Genießer. Die genaue Rezeptur des Gins mit 22 Zutaten bleibt streng geheim.',
			en: 'On her parents’ organic-biodynamic farm, Christine Brugger combines sensory science with the craft of distillation. Since 2014 the two organic gins Ginn and Ginnie have been produced here, alongside organic essences and key aromas such as lemon verbena, mandarin, mint or southernwood — for chefs, bartenders and gourmets. The gin’s exact recipe with 22 ingredients remains a closely guarded secret.'
		},
		tip: {
			de: 'Es gibt keinen Hofladen — Besuche nur nach Voranmeldung. Die Produkte sind in über 50 Geschäften rund um den Bodensee und online erhältlich; vom Bahnhof Friedrichshafen Hafen sind es wenige Kilometer mit dem Rad. Besonders beliebt: die Bio-Gins Ginn und Ginnie.',
			en: 'There is no farm shop — visits by appointment only. The products are stocked in more than 50 shops around Lake Constance and online; from Friedrichshafen Hafen station it is a few kilometres by bike. The organic gins Ginn and Ginnie are the standouts.'
		},
		url: 'https://www.organic-distillery.com'
	},
	{
		id: 'obst-und-beerenhof-pfleghaar',
		coordinates: [47.6852, 9.3484],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Markdorf',
		name: { de: 'Obst- und Beerenhof Pfleghaar', en: 'Pfleghaar Fruit & Berry Farm' },
		teaser: {
			de: 'Obst- und Beerenhof auf der Reute über Markdorf — Hofcafé, Hofladen, Regiomat und Rundfahrt mit dem Beerenzügle.',
			en: 'A fruit and berry farm on the Reute hills above Markdorf — café, farm shop, vending machine and a ride on the “Beerenzügle”.'
		},
		description: {
			de: 'Seit 2010 lädt das Hofcafé des Obst- und Beerenhofs Pfleghaar mit 60 Sitzplätzen zum Bleiben ein: Apfel-, Zwetschgen-, Pfirsich-, Johannisbeer-, Heidelbeer- und natürlich Erdbeerkuchen je nach Jahreszeit, dazu Kaffeespezialitäten. Der Hofladen verkauft Obst und Gemüse direkt vom Erzeuger, und am Regiomat in der Hofeinfahrt gibt es rund um die Uhr regionale Produkte, von Marmelade und Obstbränden bis zu Eiern und Nudeln. Die Erdbeeren wachsen hier von Mai bis Dezember in luftiger Höhe auf Röhrengerüsten, im Spätsummer locken die Kürbisfelder, und mit dem Beerenzügle geht es durch die Gärten — ohne Chemie, dafür mit Nützlingen.',
			en: 'Since 2010 the farm café of the Pfleghaar fruit and berry farm has invited guests to stay a while with its 60 seats: apple, plum, peach, currant, blueberry and, of course, strawberry cake depending on the season, plus coffee specialties. The farm shop sells fruit and vegetables straight from the grower, and a Regiomat vending machine by the entrance stocks regional products around the clock, from jams and fruit spirits to eggs and noodles. The strawberries grow up here in the fresh air from May to December on elevated tube frames, the pumpkin fields draw visitors in late summer, and a ride on the “Beerenzügle” takes you through the gardens — no chemicals, beneficial insects instead.'
		},
		tip: {
			de: 'Das Hofcafé hat sonntags und feiertags Ruhetag — der Obstladen öffnet sonntags vormittags, der Regiomat ist immer da. Rundfahrten mit dem Beerenzügle gibt es nach Absprache bei mindestens 25 Erwachsenen, also lieber vorher anmelden.',
			en: 'The farm café rests on Sundays and public holidays — the fruit shop opens Sunday mornings and the Regiomat is always there. Tours with the Beerenzügle run by arrangement with at least 25 adults, so book ahead.'
		},
		openingHours: {
			de: 'Mai–Okt Mo–Sa 9:00–18:00 (So Ruhetag, Obstladen So 9:00–12:00), Nov–Apr Mo–Sa 9:00–18:00 (So Ruhetag)',
			en: 'May–Oct Mon–Sat 9am–6pm (Sun closed, farm shop Sun 9am–noon), Nov–Apr Mon–Sat 9am–6pm (Sun closed)'
		},
		url: 'https://www.beerenzuegle.de'
	},
	{
		id: 'landbaeckerei-baader-markdorf',
		coordinates: [47.717, 9.3888],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '🥐',
		nearestStation: 'Markdorf',
		name: { de: 'Landbäckerei Baader im Bahnhof Markdorf', en: 'Landbäckerei Baader at Markdorf Station' },
		teaser: {
			de: 'Traditionsreiche Landbäckerei im renovierten Bahnhofsgebäude — Frühstück, Brezeln und Bäcker-Snacks direkt am Gleis.',
			en: 'A traditional country bakery in the renovated station building — breakfast, pretzels and baker’s snacks right by the platform.'
		},
		description: {
			de: 'Im Juni 2021 hat die Landbäckerei Baader aus Frickingen im renovierten Bahnhofsgebäude von Markdorf ihr neuestes Fachgeschäft eröffnet — altehrwürdiger Bahnhof trifft traditionsreichen Handwerksbäcker. Das Angebot reicht vom Frühstück über warme und kalte Bäcker-Snacks bis zur schnellen Butterbrezel auf die Hand und einem guten Brot fürs Vesper. Gebacken wird aus dem Linzgau Korn der hauseigenen Gläsernen Backstube, regional und naturnah angebaut, mit Transparent vom Acker bis zur Ladentheke.',
			en: 'In June 2021 the Landbäckerei Baader from Frickingen opened its newest shop in Markdorf’s lovingly renovated station building — a venerable station meets time-honoured craft. The offer ranges from breakfast over warm and cold baker’s snacks to a warm pretzel to take away and good bread for your picnic. Everything is baked from Linzgau Korn grain from the bakery’s own glass-walled bakehouse, grown regionally and close to nature, with transparency from the field to the counter.'
		},
		tip: {
			de: 'Ideal für den frühen Zug: unter der Woche öffnet die Filiale bereits um 6 Uhr. Wer tiefer einsteigen möchte, kombiniert den Besuch mit der Linie nach Frickingen zur Gläsernen Backstube.',
			en: 'Perfect for an early train: on weekdays the shop opens at 6am. For a deeper look, combine the visit with the line to Frickingen and the glass-walled bakehouse.'
		},
		openingHours: {
			de: 'Mo–Fr 6:00–18:00, Sa 6:30–14:00, So 7:00–17:00',
			en: 'Mon–Fri 6am–6pm, Sat 6:30am–2pm, Sun 7am–5pm'
		},
		image: {
			url: '/images/locations/landbaeckerei-baader-markdorf.jpg',
			alt: {
				de: 'Das Bahnhofsgebäude von Markdorf mit der Landbäckerei Baader',
				en: 'The Markdorf station building housing the Landbäckerei Baader'
			},
			attribution: '© Klaus Jesper, CC BY 4.0, via Wikimedia Commons'
		},
		url: 'https://www.baaderbeck.de/fachgeschaefte/bahnhof-markdorf'
	},
	{
		id: 'rheindamm',
		coordinates: [47.494, 9.666],
		categories: ['nature', 'culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Bregenz',
		name: { de: 'Rheindamm im Rheindelta', en: 'Rheindamm Rhine Delta' },
		teaser: {
			de: 'Grillplatz am Rheindamm im Naturschutzgebiet Rheindelta mit Seeblick und Sandinsel.',
			en: 'Grill spot on the Rheindamm in the Rhine Delta nature reserve, with lake views and a sand island.'
		},
		description: {
			de: 'Am Fuß des Rheindamms liegt das Naturschutzgebiet Rheindelta: Schilfgürtel, Wattflächen und die Sandinsel direkt an der Mündung des Rheins in den Bodensee. Picknicktische laden zum Verweilen ein — ideal für ein gemütliches Grillvergnügen mit Blick über den See und die Alpen.',
			en: 'At the foot of the Rheindamm lies the Rhine Delta nature reserve: reed beds, tidal flats and the sand island right where the Rhine flows into Lake Constance. Picnic tables invite you to linger — perfect for a relaxed BBQ with views over the lake and the Alps.'
		},
		tip: {
			de: 'Grill mitbringen und an den ausgewiesenen Picknickplätzen am Damm genießen; Teile des Naturschutzgebiets sind gesperrt. Mit dem Rad über den Rheindamm von Hard oder Fußach aus besonders schön.',
			en: 'Bring your own grill and enjoy it at the marked picnic spots by the dam; parts of the nature reserve are off-limits. Especially lovely by bike along the Rheindamm from Hard or Fußach.'
		},
		image: {
			url: '/images/locations/rheindamm.jpg',
			alt: {
				de: 'Blick über das Naturschutzgebiet Rheindelta am Bodensee',
				en: 'View over the Rheindelta nature reserve on Lake Constance'
			},
			attribution: '© JoachimKohler-HB, CC BY-SA 4.0, via Wikimedia Commons'
		},
	},
	{
		id: 'kleines-cafe',
		coordinates: [47.5463, 9.6883],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '🍦',
		nearestStation: 'Lindau-Insel',
		name: { de: 'Kleines Café', en: 'Kleines Café' },
		teaser: {
			de: 'Kleines Eiscafé in der Fischergasse auf der Lindauer Insel.',
			en: 'A tiny ice cream café on Fischergasse, on Lindau island.'
		},
		description: {
			de: 'Das kleine Café auf der Insel Lindau serviert Bio-Eis mit veganen und vegetarischen Sorten, dazu Sitzplätze im Freien. Täglich von 10 bis 21 Uhr geöffnet, auch zum Mitnehmen.',
			en: 'This tiny café on Lindau island serves organic ice cream with vegan and vegetarian flavors, plus outdoor seating. Open daily 10am–9pm, also for takeaway.'
		},
		tip: {
			de: 'Direkt auf der Insel: vom Bahnhof Lindau-Insel in wenigen Minuten zu Fuß — perfekt als Belohnung nach der Altstadtrunde.',
			en: 'Right on the island: a few minutes on foot from Lindau-Insel station — a perfect treat after the old-town loop.'
		},
		openingHours: { de: 'Mo–Su 10:00–21:00', en: 'Mon–Sun 10am–9pm' },
		url: 'https://kleines-cafe.com'
	},
	{
		id: 'la-dolce-vita-lochau',
		coordinates: [47.513, 9.754],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '🍦',
		nearestStation: 'Bregenz',
		name: { de: 'La Dolce Vita Eis-Manufaktur Lochau', en: 'La Dolce Vita Ice Cream Parlour, Lochau' },
		teaser: {
			de: 'Eismanufaktur in Lochau mit selbst gemachten Eissorten, täglich geöffnet.',
			en: 'Ice cream parlour in Lochau with homemade flavors, open daily.'
		},
		description: {
			de: 'Die Dolce Vita Eis-Manufaktur in der Bregenzer Straße in Lochau ist die Anlaufstelle für selbst gemachtes Eis aus der Region. Täglich von 10 bis 22 Uhr geöffnet — ideal nach einem Strandbadbesuch oder als Zwischenstopp zwischen Bregenz und Lindau.',
			en: 'The Dolce Vita ice cream parlour on Bregenzer Straße in Lochau is the place to go for homemade regional ice cream. Open daily 10am–10pm — ideal after a beach visit or as a stopover between Bregenz and Lindau.'
		},
		tip: {
			de: 'Vom Bahnhof Bregenz aus zu Fuß oder mit dem Bus erreichbar; die Eisdiele liegt an der Bregenzer Straße in Lochau.',
			en: 'Reachable on foot or by bus from Bregenz station; the parlour is on Bregenzer Straße in Lochau.'
		},
		openingHours: { de: 'Mo–Su 10:00–22:00', en: 'Mon–Sun 10am–10pm' },
		url: 'https://www.eismanufaktur-dolcevita.com/'
	},
	{
		id: 'metzgerei-giray',
		coordinates: [47.6044, 9.8901],
		categories: ['butcher', 'culinary'],
		duration: ['short'],
		nearestStation: 'Lindau-Reutin',
		name: { de: 'Metzgerei Giray', en: 'Giray Butcher Shop' },
		teaser: {
			de: 'Metzgerei in Lindenberg im Allgäu mit eigenem Fleisch- und Wurstangebot.',
			en: 'Butcher shop in Lindenberg im Allgäu with its own meat and sausage range.'
		},
		description: {
			de: 'Die Metzgerei Giray in Lindenberg im Allgäu bietet frisches Fleisch und Wurstwaren aus eigener Herstellung. Unter der Woche bis 18 Uhr und samstags bis 12:30 Uhr geöffnet.',
			en: 'Giray butcher shop in Lindenberg im Allgäu offers fresh meat and sausages made in-house. Open until 6pm on weekdays and until 12:30pm on Saturdays.'
		},
		tip: {
			de: 'In Lindenberg im Allgäu gelegen — gut als Zwischenstopp auf einer Tour durch das Allgäu; samstags nur bis Mittag geöffnet.',
			en: 'Located in Lindenberg im Allgäu — a good stop on a tour through the Allgäu; on Saturdays only open until midday.'
		},
		openingHours: { de: 'Mo–Fr 07:30–18:00, Sa 07:00–12:30', en: 'Mon–Fri 7:30am–6pm, Sat 7am–12:30pm' },
		url: 'https://www.metzgerei-giray.de/'
	},
	{
		id: 'acapulco-friedrichshafen',
		coordinates: [47.6501, 9.4674],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Friedrichshafen Stadt',
		name: { de: 'Acapulco', en: 'Acapulco' },
		teaser: {
			de: 'Mexikanisches Restaurant in Friedrichshafen, abends ab 17 Uhr geöffnet.',
			en: 'Mexican restaurant in Friedrichshafen, open evenings from 5pm.'
		},
		description: {
			de: 'Das Acapulco in der Olgastraße ist Friedrichshafens mexikanisches Restaurant: abends ab 17 Uhr geöffnet, montags geschlossen.',
			en: 'Acapulco on Olgastraße is Friedrichshafen’s Mexican restaurant: open evenings from 5pm, closed on Mondays.'
		},
		tip: {
			de: 'Mitten in der Stadt, nur wenige Gehminuten vom Bahnhof Friedrichshafen Stadt entfernt — gut als Abendprogramm nach der Ankunft.',
			en: 'Right in the city, a few minutes on foot from Friedrichshafen Stadt station — good evening plans after arriving.'
		},
		openingHours: { de: 'Di–So 17:00–24:00, Mo geschlossen', en: 'Tue–Sun 5pm–midnight, Mon closed' },
		url: 'https://www.acapulco-restaurant-bar.de/friedrichshafen'
	},
	{
		id: 'cafe-hoepker',
		coordinates: [47.6701, 9.4226],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '☕',
		nearestStation: 'Friedrichshafen Hafen',
		name: { de: 'Cafe Confiserie Höpker', en: 'Cafe Confiserie Höpker' },
		teaser: {
			de: 'Café und Conditorei in Friedrichshafen-Fischbach — Kuchen und Kaffee, auch sonntags.',
			en: 'A café and confisery in Friedrichshafen-Fischbach — cake and coffee, also on Sundays.'
		},
		description: {
			de: 'Die Confiserie Höpker im Fischbacher Birnauweg serviert Kuchen und Kaffee, dazu Plätze im Freien. Mittwochs bis samstags ab 9:30 Uhr und sonntags ab 10 Uhr geöffnet.',
			en: 'The Höpker confisery on Birnauweg in Fischbach serves cake and coffee, with outdoor seats. Open Wednesday to Saturday from 9:30am and Sunday from 10am.'
		},
		tip: {
			de: 'Im Stadtteil Fischbach gelegen — gut mit dem Rad vom Hafen aus zu erreichen; montags und dienstags bleibt das Café zu.',
			en: 'In the Fischbach district — an easy ride from the harbour; the café rests on Mondays and Tuesdays.'
		},
		openingHours: { de: 'Mi–Sa 09:30–18:00, So 10:00–18:00', en: 'Wed–Sat 9:30am–6pm, Sun 10am–6pm' },
		url: 'https://www.cafe-hoepker.de/'
	},
	{
		id: 'webers-backstube-friedrichshafen',
		coordinates: [47.6527, 9.4728],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '🥐',
		nearestStation: 'Friedrichshafen Stadt',
		name: { de: 'Webers Backstube', en: 'Webers Backstube Bakery' },
		teaser: {
			de: 'Bäckerei am Friedrichshafener Stadtbahnhof mit frischem Gebäck und Brezeln.',
			en: 'Bakery at Friedrichshafen’s city station with fresh pastries and pretzels.'
		},
		description: {
			de: 'Die Webers Backstube am Stadtbahnhof backt täglich frisches Brot, Brötchen und Gebäck — ideal für ein Frühstück unterwegs oder einen Kaffee zum Mitnehmen. Montags bis samstags ab 6 Uhr, sonntags vormittags geöffnet.',
			en: 'Webers Backstube at the city station bakes fresh bread, rolls and pastries daily — ideal for breakfast on the go or a coffee to take away. Open from 6am Monday to Saturday and on Sunday mornings.'
		},
		tip: {
			de: 'Nur wenige Gehminuten vom Bahnhof Friedrichshafen Stadt entfernt — gut als erste Station nach der Ankunft.',
			en: 'Just a few minutes on foot from Friedrichshafen Stadt station — a good first stop after arriving.'
		},
		openingHours: { de: 'Mo–Sa 06:00–22:00, So 08:00–11:00', en: 'Mon–Sat 6am–10pm, Sun 8–11am' },
		url: 'https://webers-backstube.de/verkauf/filiale-stadtbahnhof/'
	},
	{
		id: 'backhaus-mahl-ueberlingen',
		coordinates: [47.7654, 9.1638],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '🥐',
		nearestStation: 'Überlingen',
		name: { de: 'Backhaus Mahl', en: 'Backhaus Mahl Bakery' },
		teaser: {
			de: 'Bäckerei in der Überlinger Mühlenstraße — bekannt für Buttergebäck wie Pain au chocolat.',
			en: 'Bakery on Überlingen’s Mühlenstraße — known for buttery pastries like pain au chocolat.'
		},
		description: {
			de: 'Der Backhaus Mahl in der Überlinger Mühlenstraße backt täglich frisches Gebäck. Ein Geheimtipp für einen Pain au chocolat am Morgen oder auf dem Weg zum See.',
			en: 'Backhaus Mahl on Überlingen’s Mühlenstraße bakes fresh pastries daily. An insider tip for a pain au chocolat in the morning or on the way to the lake.'
		},
		tip: {
			de: 'Nur wenige Gehminuten vom Bahnhof Überlingen zur Filiale in der Mühlenstraße — perfekt vor der Fahrt mit dem Schiff.',
			en: 'Just a few minutes on foot from Überlingen station to the Mühlenstraße branch — perfect before a boat trip.'
		}
	},
	{
		id: 'winzerfest-nonnenhorn',
		coordinates: [47.5746, 9.611],
		categories: ['drinks', 'culinary'],
		duration: ['medium'],
		nearestStation: 'Nonnenhorn',
		name: { de: 'Winzerfest Nonnenhorn', en: 'Nonnenhorn Wine Festival' },
		teaser: {
			de: 'Jährliches Winzerfest am Bodensee mit Weinen aus dem bayerischen Seeort.',
			en: 'Annual wine festival on Lake Constance featuring wines from the Bavarian lakeside village.'
		},
		description: {
			de: 'Nonnenhorn ist ein kleines Weindorf am bayerischen Bodenseeufer, bekannt für seine Weinlagen „Sonnenbichl“ und „Seehalde“. Beim Winzerfest am See stellen die örtlichen Winzer ihre Weine aus — ein geselliges Highlight des Jahres im Luftkurort.',
			en: 'Nonnenhorn is a small wine village on the Bavarian shore of Lake Constance, known for its “Sonnenbichl” and “Seehalde” vineyards. At the Winzerfest am See, local winemakers present their wines — a sociable highlight of the year in this climatic health resort.'
		},
		tip: {
			de: 'Termine vor der Anreise prüfen — das Fest findet einmal im Jahr statt. Der Bahnhof Nonnenhorn liegt an der Bodenseegürtelbahn zwischen Friedrichshafen und Lindau.',
			en: 'Check the dates before travelling — the festival takes place once a year. Nonnenhorn station is on the Bodensee ring line between Friedrichshafen and Lindau.'
		},
		openingHours: { de: 'Jährliche Veranstaltung, Termine auf nonnenhorn.de', en: 'Annual event, dates at nonnenhorn.de' },
		url: 'https://www.nonnenhorn.de'
	},
	{
		id: 'marienschlucht',
		coordinates: [47.7653, 9.0948],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Marienschlucht', en: 'Marienschlucht Gorge' },
		teaser: {
			de: 'Begehbare Schlucht am Überlinger See zwischen Bodman und Wallhausen.',
			en: 'Walkable gorge on Lake Überlingen between Bodman and Wallhausen.'
		},
		description: {
			de: 'Die Marienschlucht liegt auf der Halbinsel Bodanrück zwischen Bodman und Wallhausen. Ein Pfad mit Stegen führt durch die Schlucht hindurch; oben winken Ausblicke über den Überlinger See. Seit der Wiedereröffnung im März 2026 führt ein neuer Panoramasteg durch die Schlucht.',
			en: 'The Marienschlucht lies on the Bodanrück peninsula between Bodman and Wallhausen. A path with footbridges leads through the gorge, with views over Lake Überlingen above. Since its reopening in March 2026 a new panoramic footbridge runs through the gorge.'
		},
		tip: {
			de: 'Ab Wallhausen mit dem Bus Richtung Bodman bis zur Haltestelle fahren und von dort zu Fuß zur Schlucht; auf dem Weg über den Bodanrück liegt das Bisongehege am Hofgut Bodenwald.',
			en: 'From Wallhausen take the bus toward Bodman and get off at the stop, then walk to the gorge; on the way across the Bodanrück you pass the bison enclosure at Hofgut Bodenwald.'
		},
		image: {
			url: '/images/locations/marienschlucht.jpg',
			alt: {
				de: 'Blick vom Schiffsanleger zur Marienschlucht am Überlinger See',
				en: 'View from the boat landing toward the Marienschlucht gorge on Lake Überlingen'
			},
			attribution: '© Christine Ferdinand, CC BY-SA 2.5, via Wikimedia Commons'
		},
		url: 'https://www.marienschlucht.info'
	},
	{
		id: 'altbodman',
		coordinates: [47.7947, 9.0321],
		categories: ['nature', 'history'],
		duration: ['medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Ruine Altbodman', en: 'Altbodman Castle Ruin' },
		teaser: {
			de: 'Burgruine auf dem Bodanrück mit Weitblick über den Überlinger See.',
			en: 'Castle ruin on the Bodanrück ridge with sweeping views over Lake Überlingen.'
		},
		description: {
			de: 'Die Ruine Altbodman liegt hoch über dem Überlinger See auf dem Bodanrück. Von den Mauerresten aus hat man einen weiten Blick über den See; die Wanderung führt durch Obstwiesen und Wald vorbei am Bisongehege und der Bisonstube Bodenwald.',
			en: 'The Altbodman ruin sits high above Lake Überlingen on the Bodanrück ridge. From the remains of the walls there is a wide view over the lake; the hike leads through orchards and forest past the bison enclosure and the Bisonstube Bodenwald.'
		},
		tip: {
			de: 'Ab Wallhausen mit dem Bus Richtung Bodman fahren und an der Haltestelle aussteigen, dann zu Fuß über den Bodanrück — das Bisongehege liegt auf dem Weg.',
			en: 'From Wallhausen take the bus toward Bodman and get off at the stop, then hike across the Bodanrück — the bison enclosure is on the way.'
		},
		image: {
			url: '/images/locations/altbodman.jpg',
			alt: {
				de: 'Die Burgruine Altbodman auf dem Bodanrück',
				en: 'The Altbodman castle ruin on the Bodanrück ridge'
			},
			attribution: '© Johannes Robalotoff, CC BY-SA 4.0, via Wikimedia Commons'
		},
	},
	{
		id: 'landmetzgerei-schaedler-oberlangnau',
		coordinates: [47.6316, 9.6592],
		categories: ['butcher', 'culinary'],
		duration: ['short'],
		nearestStation: 'Kressbronn',
		name: { de: 'Landmetzgerei Eugen Schädler', en: 'Eugen Schädler Village Butchery' },
		teaser: {
			de: 'Landmetzgerei in Tettnang-Oberlangnau — bekannt für gutes Fleisch.',
			en: 'Village butchery in Tettnang-Oberlangnau — known for its good meat.'
		},
		description: {
			de: 'Die Landmetzgerei Eugen Schädler in der Argenstraße in Oberlangnau ist die Adresse für gutes Fleisch im Raum Tettnang. Dienstags bis freitags von 7:30 bis 12:30 und 14:00 bis 18 Uhr, samstags von 7 bis 12:30 Uhr geöffnet.',
			en: 'Eugen Schädler village butchery on Argenstraße in Oberlangnau is the place for good meat in the Tettnang area. Open Tuesday to Friday 7:30am–12:30pm and 2–6pm, Saturday 7am–12:30pm.'
		},
		tip: {
			de: 'In Oberlangnau an der Argenstraße — mit dem Bus (Linie 246/7546) bis Haltestelle Oberlangnau; sonntags und montags geschlossen.',
			en: 'In Oberlangnau on Argenstraße — reachable by bus (lines 246/7546) to the Oberlangnau stop; closed Sundays and Mondays.'
		},
		openingHours: {
			de: 'Di–Fr 07:30–12:30 & 14:00–18:00, Sa 07:00–12:30',
			en: 'Tue–Fri 7:30am–12:30pm & 2–6pm, Sat 7am–12:30pm'
		},
		url: 'https://www.metzgerei.org/tettnang/eugen-schaedler-5003439.html'
	},
	{
		id: 'degerseestube',
		coordinates: [47.6133, 9.654],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Kressbronn',
		name: { de: 'Degerseestube', en: 'Degerseestube' },
		teaser: {
			de: 'Restaurant und Strandbad am Degersee mit Terrasse und Blick über den See.',
			en: 'Restaurant and lido by Degersee lake with a terrace and views over the water.'
		},
		description: {
			de: 'Die Degerseestube liegt in Südhanglage direkt am Degersee, einem warmen Moränensee bei Tettnang. Zum Strandbad gehört ein Restaurant mit Terrasse und Seeblick; die Küche bietet regionale und schwäbische Spezialitäten, dazu Wild aus der Region und Burger. In der Saison von April bis Oktober geöffnet.',
			en: 'Degerseestube sits on the southern slope right by Degersee, a warm moraine lake near Tettnang. The lido includes a restaurant with a terrace and lake views; the menu features regional and Swabian specialties, local game and burgers. Open in the season from April to October.'
		},
		tip: {
			de: 'Von Kressbronn mit dem Bus (Linie 235) bis zur Haltestelle Tettnang, Degersee; Parkplatz am Haus (2 €/Tag). Bei schlechtem Wetter kann montags und dienstags geschlossen sein.',
			en: 'From Kressbronn take bus line 235 to the Tettnang, Degersee stop; parking on site (€2/day). In bad weather the restaurant may close on Mondays and Tuesdays.'
		},
		openingHours: {
			de: 'Apr–Okt: Mi–So 10:30–22:00, Mo–Di geschlossen',
			en: 'Apr–Oct: Wed–Sun 10:30am–10pm, Mon–Tue closed'
		},
		image: {
			url: '/images/locations/degerseestube.jpg',
			alt: {
				de: 'Die Degerseestube am Ufer des Degersees, vom Wasser aus gesehen',
				en: 'The Degerseestube on the shore of the Degersee, seen from the water'
			},
			attribution: '© Chrissss, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.degerseestube.de/'
	},
	{
		id: 'weingut-kress-ueberlingen',
		coordinates: [47.7606, 9.1871],
		categories: ['drinks', 'culinary'],
		duration: ['short'],
		icon: '🍷',
		nearestStation: 'Überlingen',
		name: { de: 'Weingut Kress', en: 'Weingut Kress Winery' },
		teaser: {
			de: 'Überlinger Weingut am Bodanrück — Riesling, Burgunder und die Felsengarten-Cuvées.',
			en: 'Überlingen winery on the Bodanrück ridge — Riesling, Pinot and the Felsengarten cuvées.'
		},
		description: {
			de: 'Das Weingut Kress in der Mühlbachstraße in Überlingen wird seit drei Generationen geführt und baut seine Reben am Bodensee an: eiszeitliche Endmoränenböden, der See als Temperaturregulant und die Alpen in Sichtweite. Im Sortiment finden sich Riesling, Burgunder, Lagenweine, Perlwein und Sekt, darunter die Cuvées „Überlinger Felsengarten“.',
			en: 'Weingut Kress on Mühlbachstraße in Überlingen has been family-run for three generations, growing its vines by Lake Constance: glacial moraine soils, the lake as a temperature regulator and the Alps in view. The range includes Riesling, Pinot, single-vineyard wines, sparkling wine and sekt, among them the “Überlinger Felsengarten” cuvées.'
		},
		tip: {
			de: 'In der Vinothek dienstags bis freitags 9–12:30 und 14–18 Uhr, samstags 10–13 Uhr geöffnet. Im Juni und Juli freitags ab 18 Uhr die Besenwirtschaft „Viertel vor Kress“ — vorher anrufen (+49 7551 65855). Besonders empfehlenswert: der Müller-Thurgau.',
			en: 'The vinotheque is open Tuesday to Friday 9am–12:30pm and 2–6pm, Saturday 10am–1pm. In June and July the “Viertel vor Kress” wine bar opens on Fridays from 6pm — call ahead (+49 7551 65855). The Müller-Thurgau in particular comes recommended.'
		},
		openingHours: {
			de: 'Di–Fr 09:00–12:30 & 14:00–18:00, Sa 10:00–13:00, Mo/So/Feiertage geschlossen',
			en: 'Tue–Fri 9am–12:30pm & 2–6pm, Sat 10am–1pm, closed Mon/Sun/holidays'
		},
		url: 'https://www.weingut-kress.de/'
	},
	{
		id: 'hohentwiel',
		coordinates: [47.7647, 8.8189],
		categories: ['history'],
		duration: ['medium', 'long'],
		nearestStation: 'Singen (Hohentwiel)',
		name: { de: 'Festungsruine Hohentwiel', en: 'Hohentwiel Fortress Ruins' },
		teaser: {
			de: 'Mit neun Hektar eine der größten Festungsruinen Deutschlands, hoch über Singen.',
			en: 'With nine hectares, one of Germany’s largest fortress ruins, high above Singen.'
		},
		description: {
			de: 'Erstmals 914/915 befestigt, war der Hohentwiel frühmittelalterlicher Herzogssitz, dann Adelsburg und ab dem 16. Jahrhundert württembergische Staatsfestung. Im Dreißigjährigen Krieg fünfmal erfolglos belagert, diente er später als Staatsgefängnis, bis ihn französische Truppen 1800/1801 schleiften. Heute lockt die Ruine mit Panorama über Bodensee, Hegau und Alpen — im Juli findet hier das Hohentwiel-Festival statt.',
			en: 'First fortified in 914/915, the Hohentwiel was an early medieval ducal seat, then a noble castle and from the 16th century a Württemberg state fortress. It withstood five sieges in the Thirty Years’ War, later served as a state prison, until French troops slighted it in 1800/1801. Today the ruins draw visitors with a panorama over Lake Constance, the Hegau and the Alps — the Hohentwiel Festival takes place here in July.'
		},
		tip: {
			de: 'Der Rundgang startet an der Domäne Hohentwiel unterhalb der Ruine; vom Bahnhof Singen (Hohentwiel) sind es rund 260 Höhenmeter bergauf — feste Schuhe mitnehmen.',
			en: 'The tour starts at the Domäne Hohentwiel estate below the ruins; from Singen (Hohentwiel) station it is roughly 260 metres of ascent — bring sturdy shoes.'
		},
		openingHours: {
			de: '29.3.–31.10. tägl. 9:30–18:30, 19.10.–28.3. Do–So & Feiertage 10:00–16:00; letzter Einlass 30 Min. vorher',
			en: '29 Mar–31 Oct daily 9:30am–6:30pm, 19 Oct–28 Mar Thu–Sun & holidays 10am–4pm; last admission 30 min before'
		},
		image: {
			url: '/images/locations/hohentwiel.jpg',
			alt: {
				de: 'Luftbild der Festungsruine Hohentwiel auf dem Felshoch über Singen',
				en: 'Aerial view of the Hohentwiel fortress ruins on the rock spur above Singen'
			},
			attribution: '© Carsten Steger, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.festungsruine-hohentwiel.de'
	},
	{
		id: 'schoggiparadies-riehen',
		coordinates: [47.58381, 7.648673],
		categories: ['sweets', 'culinary'],
		duration: ['short'],
		icon: '🍫',
		nearestStation: 'Riehen',
		name: {
			de: 'Patrizias Schoggiparadies',
			en: 'Patrizias Schoggiparadies (Chocolate Paradise)'
		},
		teaser: {
			de: 'Handgemachte Pralinés und Schokolade im 500 Jahre alten „Huus bym Kilchhof“.',
			en: 'Handmade pralines and chocolate in the 500-year-old “Huus bym Kilchhof”.'
		},
		description: {
			de: 'Confiserie, Konditorei, Bäckerei und Café in einem 500 Jahre alten Haus am Kirchhof: selbst gemachte Pralinés und Schokolade, dazu Backwaren und Kuchen bei Tee und Kaffee. Bei nur zehn Plätzen im Café blickt man der Backstube direkt in die Arbeit.',
			en: 'A confiserie, patisserie, bakery and café in a 500-year-old house by the churchyard: handmade pralines and chocolate, plus baked goods and cakes with tea and coffee. With only ten seats in the café, you watch the bakery at work right in front of you.'
		},
		tip: {
			de: 'Nur gut 200 Meter vom Bahnhof Riehen entfernt — ein kurzer Abstecher für Schoggi zum Mitnehmen. Die Backstube schließt schon um 12:15 Uhr, frische Ware gibt es vormittags.',
			en: 'Just over 200 metres from Riehen station — a quick detour for chocolate to take away. The bakery counter closes at 12:15pm, so come in the morning for fresh goods.'
		},
		openingHours: {
			de: 'Di–Fr 7:00–12:30 & 14:00–18:00, Sa 8:00–16:00, Mo & So geschlossen',
			en: 'Tue–Fri 7am–12:30pm & 2–6pm, Sat 8am–4pm, closed Mon & Sun'
		},
		url: 'https://www.schoggiparadies.ch'
	},
	{
		id: 'roemerfest-augusta-raurica',
		coordinates: [47.5328, 7.7218],
		categories: ['culture', 'history'],
		duration: ['medium', 'long'],
		nearestStation: 'Kaiseraugst',
		name: { de: 'Römerfest Augusta Raurica', en: 'Augusta Raurica Roman Festival' },
		teaser: {
			de: 'Größtes Römerfest der Schweiz: Gladiatoren, Legionäre, Handwerk und Markt in der Römerstadt.',
			en: 'Switzerland’s biggest Roman festival: gladiators, legionaries, crafts and a market in the Roman city.'
		},
		description: {
			de: 'Jeweils am letzten Augustwochenende verwandelt sich das Gelände der Römerstadt Augusta Raurica in ein lebendiges Römerlager: Gladiatorenkämpfe im Theater, Legionäre in Kampfformation, Handwerker wie Töpfer, Glasbläser und Schneider, römischer Wein und ein Wagenrennen für Familien. Zwischen den Festtagen lohnen Museum, Römerhaus, Amphitheater und Tierpark.',
			en: 'On the last August weekend each year, the grounds of the Roman city of Augusta Raurica turn into a living Roman camp: gladiator fights in the theatre, legionaries in battle formation, craftspeople such as potters, glassblowers and tailors, Roman wine and a chariot race for families. Between festival days, the museum, Roman house, amphitheatre and animal park are worth a look.'
		},
		tip: {
			de: 'Die Plätze in der Gladiatoren- und Legionärsschule sind schnell vergeben — früh anmelden. Anreise mit dem Zug bis Kaiseraugst, von dort rund zehn Minuten zu Fuß; das Freilichtgelände ist kostenlos.',
			en: 'Places in the gladiator and legionary school fill up fast — register early. Take the train to Kaiseraugst, then walk about ten minutes; admission to the outdoor grounds is free.'
		},
		openingHours: {
			de: 'saisonal: Römerfest am letzten Augustwochenende; Museum & Römerhaus Mär–Okt tägl. 10:00–17:00, Nov–Feb Di–So 10:00–15:00; Freilichtgelände jederzeit offen',
			en: 'seasonal: Roman festival on the last August weekend; museum & Roman house Mar–Oct daily 10am–5pm, Nov–Feb Tue–Sun 10am–3pm; outdoor grounds open at all times'
		},
		image: {
			url: '/images/locations/roemerfest-augusta-raurica.jpg',
			alt: {
				de: 'Das Amphitheater der Römerstadt Augusta Raurica',
				en: 'The amphitheatre of the Augusta Raurica Roman city'
			},
			attribution: '© Guido Radig, CC BY-SA 3.0, via Wikimedia Commons'
		},
		url: 'https://www.augustaraurica.ch/roemerfest'
	},
	{
		id: 'gruener-baum-moos',
		coordinates: [47.7261, 8.934],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Radolfzell',
		name: { de: 'Restaurant Grüner Baum, Moos', en: 'Grüner Baum Restaurant, Moos' },
		teaser: {
			de: 'Höri-Gasthof in fünfter Generation: Bodenseefische, Hörigemüse und alles mit der Höri-Bülle.',
			en: 'A fifth-generation inn on the Höri peninsula: Lake Constance fish, Höri vegetables and everything with the Höri Bülle onion.'
		},
		description: {
			de: 'Der seit 1873 bestehende Gasthof an der Halbinsel Höri kocht regionale Klassiker: Bodenseefische und Hörigemüse, allen voran die milde rote Höri-Bülle — von der Büllensuppe über Salate bis zu Soßen. Küchenchef Hubert Neidhart ist Genussbotschafter Baden-Württembergs; die Höri-Bülle ist in der Slow-Food-Arche des Geschmacks verzeichnet.',
			en: 'The inn on the Höri peninsula has been run by the same family for five generations since 1873, cooking regional classics: Lake Constance fish and Höri vegetables, above all the mild red Höri Bülle onion — from Bülle soup over salads to sauces. Chef Hubert Neidhart is a Baden-Württemberg “Genussbotschafter”, and the Höri Bülle is listed in Slow Food’s Ark of Taste.'
		},
		tip: {
			de: 'Die Gerichte mit der Höri-Bülle sind fantastisch — besonders die Büllensuppe. Küche nur abends (Sa & So zusätzlich mittags), Di & Mi Ruhetag; im Lädele gibt es Hörisalz und Konserven mit.',
			en: 'The dishes built around the Höri Bülle onion are fantastic — the Bülle soup in particular. The kitchen serves mainly in the evenings (Sat & Sun also at noon), closed Tue & Wed; the shop sells Höri salt and preserves.'
		},
		openingHours: {
			de: 'Di & Mi Ruhetag, Küche Do–Mo 17:30–21:00, Sa & So zusätzlich 12:00–14:00; an Feiertagen geöffnet',
			en: 'Closed Tue & Wed, kitchen Thu–Mon 5:30–9pm, Sat & Sun also noon–2pm; open on public holidays'
		},
		url: 'https://www.gruenerbaum-moos.de'
	},
	{
		id: 'weingut-teresa-deufel',
		coordinates: [47.5601, 9.6578],
		categories: ['drinks', 'culinary'],
		duration: ['short'],
		icon: '🍷',
		nearestStation: 'Lindau-Insel',
		name: { de: 'Weingut Teresa Deufel', en: 'Teresa Deufel Winery' },
		teaser: {
			de: 'Bio-Weingut in Lindau-Bad Schachen: Bodenseeweine aus einer der südlichsten Lagen Deutschlands.',
			en: 'Organic winery in Lindau-Bad Schachen: Lake Constance wines from one of Germany’s southernmost vineyards.'
		},
		description: {
			de: 'Familienhof in Bad Schachen, umgeben von Weinbergen: Bereits 1975 stiegen Hannes Deufel und Ludwig Haug neben den Obstwiesen auf den Rebanbau um, 1977 folgte der erste Lindauer Wein. Seit 2009 keltert Teresa Deufel eigene Weine und öffnete 2011 den Hofausschank Degelstein im ehemaligen Weinkeller. Sorten wie Cabernet Blanc, Solaris und Johanniter profitieren von der Föhnlage, der Weinberg gehört zu den südlichsten Deutschlands — mit Blick auf den Bodensee.',
			en: 'A family farm in Bad Schachen surrounded by vineyards: as early as 1975 Hannes Deufel and Ludwig Haug turned to vines alongside their orchards, and in 1977 the first Lindau wine was poured. Teresa Deufel has made her own wines since 2009 and opened the Degelstein farm bar in the old wine cellar in 2011. Varieties such as Cabernet Blanc, Solaris and Johanniter benefit from the föhn winds; the vineyard is among Germany’s southernmost, with a view over Lake Constance.'
		},
		tip: {
			de: 'Der Hofverkauf ist vormittags geöffnet, Mo–Sa 9–12 Uhr; die Weinprobe im Degelstein ist nach Absprache möglich. Vom Bahnhof Lindau-Insel sind es gut zwei Kilometer nach Bad Schachen. Besonders empfehlenswert: der Solaris.',
			en: 'The farm shop opens in the morning, Mon–Sat 9am–noon; a tasting at the Degelstein bar is possible by arrangement. From Lindau-Insel station it is a good two kilometres to Bad Schachen. The Solaris in particular comes recommended.'
		},
		openingHours: {
			de: 'Hofverkauf Mo–Sa 9:00–12:00; Degelstein Di–Sa ab 17:00 Uhr, saisonal — vorher prüfen',
			en: 'Farm shop Mon–Sat 9am–noon; Degelstein Tue–Sat from 5pm, seasonal — check ahead'
		},
		url: 'https://www.teresadeufel.de'
	},
	{
		id: 'wendelinskapelle-kinberg',
		coordinates: [47.5949, 9.8293],
		categories: ['viewpoint'],
		duration: ['short'],
		nearestStation: 'Hergatz',
		name: { de: 'Wendelinskapelle Kinberg', en: 'Wendelinskapelle, Kinberg' },
		teaser: {
			de: 'Freistehende Feldkapelle im Weiler Kinberg bei Sigmarszell, wohl um 1698 erbaut — mit Weitblick zum Bodensee.',
			en: 'Free-standing field chapel in the hamlet of Kinberg near Sigmarszell, probably built around 1698 — with far views toward Lake Constance.'
		},
		description: {
			de: 'Die Wendelinskapelle steht frei im Feld im Weiler Kinberg, östlich des Sigmarszeller Hauptorts. Der kleine rechteckige Bau mit dreiseitigem Chorschluss wurde der Überlieferung nach wohl um 1698 von den einheimischen Brüdern King errichtet und dem heiligen Wendelin geweiht, dem Bauernheiligen. Sie ist das älteste Gotteshaus, das man in Kinberg findet. Seit 1931 treffen sich am zweiten Sonntag im Oktober Reitergruppen aus Scheidegg und Niederstaufen zum Wendelinsritt; die Pilgerzüge kommen hier zusammen und feiern eine Festmesse mit Pferdesegnung.',
			en: 'The Wendelinskapelle stands free in a field in the hamlet of Kinberg, east of Sigmarszell’s main town. The small rectangular building with a three-sided apse was, according to tradition, probably built around 1698 by the local Brothers King and dedicated to St. Wendelin, the farmers’ saint. It is the oldest place of worship to be found in Kinberg. Since 1931, on the second Sunday in October, riding groups from Scheidegg and Niederstaufen gather for the Wendelinsritt pilgrimage; the processions meet here for a festive mass with a horse blessing.'
		},
		tip: {
			de: 'Aus dem Weiler Kinberg führt ein kleines Sträßchen zur Kapelle — ein schöner Abstecher zu Fuß oder mit dem Fahrrad, mit Weitblick bis zum Bodensee.',
			en: 'A small lane leads from the hamlet of Kinberg to the chapel — a lovely detour on foot or by bike, with far views as far as Lake Constance.'
		},
		image: {
			url: '/images/locations/wendelinskapelle-kinberg.jpg',
			alt: {
				de: 'Die Wendelinskapelle auf dem Kinberg, frei im Feld stehend',
				en: 'The Wendelinskapelle on the Kinberg, standing free in a field'
			},
			attribution: '© FkMohr, CC BY-SA 3.0 DE, via Wikimedia Commons'
		},
		url: 'https://www.outdooractive.com/de/poi/sigmarszell/wendelinskapelle/1695738/'
	},
	{
		id: 'rhombergstein',
		coordinates: [47.5208, 9.7562],
		categories: ['history'],
		duration: ['short'],
		nearestStation: 'Bregenz',
		name: { de: 'Rhombergstein', en: 'Rhombergstein' },
		teaser: {
			de: 'Gedenkstein am Panoramaweg über Lochau-Haggen für Thomas Rhomberg, der 1647 bei der Bregenzer Klause fiel.',
			en: 'Memorial stone on the panoramic trail above Lochau-Haggen for Thomas Rhomberg, who fell at the Bregenz pass in 1647.'
		},
		description: {
			de: 'Der Rhombergstein liegt am Panoramaweg, der von Lochau-Wellenhof über die Parzellen Stein und Haggen zur Kapelle Altreute und weiter zur Pfänderbergstation führt. Seine Tafel erinnert an Thomas Rhomberg, der am 4. Januar 1647 als tapferer Führer der Dornbirner bei der Verteidigung der Bregenzer Klause gegen die Schweden unter Wrangel fiel. Am Stein wächst die „Dagmar´s Buche“, eine mächtige Rotbuche.',
			en: 'The Rhombergstein lies on the panoramic trail that leads from Lochau-Wellenhof via the Stein and Haggen districts past the Altreute chapel and up to the Pfänder mountain station. Its plaque commemorates Thomas Rhomberg, who fell on 4 January 1647 as the brave leader of the Dornbirn men defending the Bregenz pass against the Swedish troops under Wrangel. The “Dagmar´s Buche”, a large beech tree, grows beside the stone.'
		},
		tip: {
			de: 'Der Stein liegt zwischen den Weilern Stein und Haggen direkt am Panoramaweg — ein kurzer Abstecher ab Lochau-Wellenhof; wer weitergeht, erreicht die Kapelle Altreute und die Pfänderbergstation.',
			en: 'The stone sits between the Stein and Haggen districts right on the panoramic trail — a short detour from Lochau-Wellenhof; continuing on reaches the Altreute chapel and the Pfänder mountain station.'
		},
		image: {
			url: '/images/locations/rhombergstein.jpg',
			alt: {
				de: 'Der Rhombergstein mit der Gedenktafel für Thomas Rhomberg',
				en: 'The Rhombergstein memorial stone with its plaque for Thomas Rhomberg'
			},
			attribution: '© Reinhard Müller, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.bodensee-vorarlberg.com/panoramawandern-von-lochau-auf-den-aussichtsberg-pfaender'
	},
	{
		id: 'nebelhorn-oberstdorf',
		coordinates: [47.4219, 10.3423],
		categories: ['nature'],
		duration: ['medium', 'long'],
		nearestStation: 'Oberstdorf',
		name: { de: 'Nebelhorn Oberstdorf', en: 'Nebelhorn, Oberstdorf' },
		teaser: {
			de: 'Mit 2,224 m ist der Nebelhorn der höchste Berg im Allgäu und bietet ein 400-Grad-Panorama über Bodensee, Allgäu und Alpen.',
			en: 'At 2,224 m, Nebelhorn is the Allgäu\'s highest peak and offers a 400° panorama over Lake Constance, Allgäu and the Alps.'
		},
		description: {
			de: 'Der Nebelhorn ist ein beliebtes Ziel für Bergsteiger und Wanderer. Von Oberstdorf aus führt die Nebelhornbahn (2,224 m) über den Hindelanger Klettersteig, der eine der längsten und spektakulärsten Abfahrten der Alpen ist.',
			en: 'Nebelhorn is a popular destination for climbers and hikers. From Oberstdorf, the Nebelhornbahn (2,224 m) ascends via the Hindelanger climbing route, one of the Alps\' longest and most spectacular descents.'
		},
		tip: {
			de: 'Die Nebelhornbahn fährt von Oberstdorf aus; die letzte Station liegt auf 2,224 m. Der Hindelanger Klettersteig ist bis zu 7,5 km lang und erfordert solide Schuhe und Kondition.',
			en: 'The Nebelhornbahn departs from Oberstdorf and reaches 2,224 m. The Hindelanger climbing route is up to 7.5 km long and requires sturdy shoes and good fitness.'
		},
		openingHours: {
			de: 'Nebelhornbahn 9–18 Uhr (Saison); Wanderwege ganzjährig frei.',
			en: 'Nebelhornbahn 9am–6pm (seasonal); hiking trails are open year-round.'
		},
		image: {
			url: '/images/locations/nebelhorn-oberstdorf.jpg',
			alt: {
				de: 'Der Gipfel des Nebelhorns bei Oberstdorf',
				en: 'The summit of the Nebelhorn near Oberstdorf'
			},
			attribution: '© Johannes Robalotoff, CC BY-SA 3.0 DE, via Wikimedia Commons'
		},
		url: 'https://www.ok-bergbahnen.com/bergbahnen/nebelhornbahn/'
	},
	{
		id: 'seehalde-birnau',
		coordinates: [47.7412, 9.223],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Seehalde Birnau', en: 'Seehalde Birnau (Gruler Seehauspark)' },
		teaser: {
			de: 'Familienrestaurant mit Seeblick direkt unter der Birnau-Wallfahrtskirche.',
			en: 'Family restaurant with a lake view directly below the Birnau pilgrimage church.'
		},
		description: {
			de: 'Die Seehalde ist ein Restaurant der vierten Generation der Familie Gruler, direkt unter der Wallfahrtskirche Birnau gelegen. Die Terrasse, der Strandbereich und der Steg reichen fast bis an das Seeufer heran.',
			en: 'Seehalde is a fourth-generation Gruler family restaurant, located directly below the Birnau pilgrimage church. The terrace, beach area and jetty reach almost to the lakeshore.'
		},
		tip: {
			de: 'Nach dem Besuch der Birnau direkt hinabgehen — oder den Spaziergang von Überlingen aus mit einem Essen hier abschließen.',
			en: 'Come straight down after visiting Birnau — or round off a walk from Überlingen with a meal here.'
		},
		openingHours: {
			de: 'Do–Mo 12:00–14:00 & 18:00–21:00, Di + Mi Ruhetag',
			en: 'Thu–Mon 12pm–2pm & 6–9pm, closed Tue + Wed'
		},
		url: 'https://seehalde.de'
	},
	{
		id: 'waldburger-schinken',
		coordinates: [47.7567, 9.7434],
		categories: ['butcher', 'culinary'],
		duration: ['short'],
		nearestStation: 'Ravensburg',
		name: { de: 'Schinkenstadl Waldburger', en: 'Schinkenstadl Waldburger' },
		teaser: {
			de: 'Hofladen mit Roh- und Kochschinken direkt aus dem Allgäu.',
			en: 'Farm shop selling raw and cooked ham straight from the Allgäu.'
		},
		description: {
			de: 'Der Schinkenstadl in Waldburg/Edensbach (Edensbach 193) ist der Direktverkauf der Waldburger Schinken Spezialitäten: Rohschinken, Vesperwurst und Konserven in unvergleichbarer Frische direkt vor Ort — einzelne Produkte kann man verkosten.',
			en: 'The Schinkenstadl in Waldburg/Edensbach (Edensbach 193) is the direct-sales shop of the Waldburger Schinken specialties: raw ham, Vesperwurst sausage and preserves, sold fresh right on site, with individual products available to taste.'
		},
		tip: {
			de: 'Die Angebote der Woche erscheinen in einer Aktionsbeilage der Schwäbischen Zeitung und unter „News" auf der Homepage.',
			en: 'The weekly specials appear in a Schwäbische Zeitung insert and under “News” on the homepage.'
		},
		openingHours: {
			de: 'Do + Fr 9:00–12:00 & 14:00–18:00, Sa 8:00–12:00',
			en: 'Thu + Fri 9am–noon & 2–6pm, Sat 8am–noon'
		},
		url: 'https://www.waldburger-schinken.de/schinkenstadl/'
	},
	{
		id: 'humpis-ravensburg',
		coordinates: [47.7803, 9.6157],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Ravensburg',
		name: { de: 'Humpis Gaststätte', en: 'Humpis Gaststätte (Ravensburg)' },
		teaser: {
			de: 'Handgeschabte Spätzle und Maultaschen im ehemaligen Humpis-Kaufhaus.',
			en: 'Hand-scraped Spätzle and Maultaschen in the former Humpis trading house.'
		},
		description: {
			de: 'Die Humpis Gaststätte in Ravensburgs Marktstraße 47 ist ein historisches Restaurant im ehemaligen Humpis-Kaufhaus. Auf der Speisekarte stehen klassische Gerichte wie handgeschabte Spätzle, Maultaschen und Kässpätzle.',
			en: 'The Humpis Gaststätte on Ravensburg’s Marktstraße 47 is a historic restaurant inside the former Humpis trading house. The menu features classics such as hand-scraped Spätzle, Maultaschen and Kässpätzle.'
		},
		tip: {
			de: 'Ideal für einen schnellen Zwischenstopp oder eine ausführliche Pause am Seeufer; Öffnungszeiten Mo–Fr 11:00–24:00, Sa 9:00–24:00, So 10:00–24:00.',
			en: 'Ideal for a quick stop or a leisurely break by the lake; opening hours Mon–Fri 11am–midnight, Sat 9am–midnight, Sun 10am–midnight.'
		},
		url: 'https://www.xn--humpis-gaststtte-7nb.de/'
	},
	{
		id: 'alpsee-coaster',
		coordinates: [47.5606, 10.1386],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Immenstadt',
		name: { de: 'Alpsee Coaster Immenstadt', en: 'Alpsee Coaster, Immenstadt' },
		teaser: {
			de: '2,8 km lange Ganzjahres-Rodelbahn mit 68 Kurven und bis zu 40 km/h.',
			en: 'A 2.8 km all-season toboggan run with 68 curves and up to 40 km/h.'
		},
		description: {
			de: 'Der Alpsee Coaster ist eine Ganzjahres-Rodelbahn am Alpsee in Immenstadt. Auf 2,8 km Strecke erwarten dich 68 Kurven, Steilkurven und Sprünge — wetterunabhängig und für Groß und Klein.',
			en: 'The Alpsee Coaster is an all-season toboggan run at the Alpsee in Immenstadt. Over 2.8 km you’ll tackle 68 curves, banked turns and jumps — weather-proof and fun for all ages.'
		},
		tip: {
			de: 'Mit der Bahn bis Immenstadt, dann Bus bis „Ratholz – Jägerhaus“. Im Winter bei Schnee geschlossen.',
			en: 'Take the train to Immenstadt, then the bus to "Ratholz – Jägerhaus". Closed in winter when there is snow.'
		},
		image: {
			url: '/images/locations/alpsee-coaster.jpg',
			alt: {
				de: 'Die Alpsee-Coaster-Rodelbahn bei Immenstadt',
				en: 'The Alpsee Coaster summer toboggan run near Immenstadt'
			},
			attribution: '© qwesy qwesy, CC BY 3.0, via Wikimedia Commons'
		},
		url: 'https://www.alpsee-bergwelt.de/erleben/alpsee-coaster'
	},
	{
		id: 'rappenlochschlucht',
		coordinates: [47.3838, 9.7796],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Dornbirn',
		name: { de: 'Rappenlochschlucht Dornbirn', en: 'Rappenlochschlucht, Dornbirn' },
		teaser: {
			de: 'Wildromantische Klamm mit Wasserfällen — April bis November begehbar.',
			en: 'Wildly romantic gorge with waterfalls — open April through November.'
		},
		description: {
			de: 'Die Rappenlochschlucht bei Dornbirn ist eine spektakuläre Klamm mit tosenden Wasserfällen und steilen Felswänden. Sie ist von April bis November geöffnet und ein beliebtes Wanderziel.',
			en: 'The Rappenlochschlucht near Dornbirn is a spectacular gorge with roaring waterfalls and sheer rock walls. Open from April to November, it is a popular hiking destination.'
		},
		tip: {
			de: 'Der Einstieg liegt am Gütle-Parkplatz — festes Schuhwerk mitnehmen. Im Winter geschlossen.',
			en: 'The entrance is at the Gütle car park — bring sturdy shoes. Closed in winter.'
		},
		image: {
			url: '/images/locations/rappenlochschlucht.jpg',
			alt: {
				de: 'Die Rappenlochschlucht bei Dornbirn mit Felswänden und Wasser',
				en: 'The Rappenloch gorge near Dornbirn with rock walls and water'
			},
			attribution: '© A.Savin, FAL, via Wikimedia Commons'
		},
		url: 'https://www.rappenloch.at'
	},
	{
		id: 'st-gallen-stiftsbezirk',
		coordinates: [47.4232, 9.3775],
		categories: ['culture'],
		duration: ['medium'],
		nearestStation: 'St. Gallen',
		name: { de: 'Stiftsbezirk St. Gallen', en: 'St. Gallen Abbey District' },
		teaser: {
			de: 'UNESCO-Weltkulturerbe: die barocke Stiftsbibliothek und die gotische Kathedrale.',
		en: 'UNESCO World Heritage site: the baroque abbey library and the Gothic cathedral.'
		},
		description: {
			de: 'Der Stiftsbezirk von St. Gallen ist ein UNESCO-Weltkulturerbe und beherbergt die gotische Kathedrale sowie die barocke Stiftsbibliothek, eine der wertvollsten historischen Bibliotheken der Welt.',
			en: 'St. Gallen’s abbey district is a UNESCO World Heritage site housing the Gothic cathedral and the baroque abbey library, one of the world’s most valuable historic libraries.'
		},
		tip: {
			de: 'Die Stiftsbibliothek ist ein absolutes Highlight — die Deckenfresken und Holzdecken lohnen einen Besuch.',
		en: 'The abbey library is an absolute highlight — the ceiling frescoes and wooden ceilings are worth a visit.'
		},
		image: {
			url: '/images/locations/st-gallen-stiftsbezirk.jpg',
			alt: {
				de: 'Der Barocksaal der Stiftsbibliothek St. Gallen',
				en: 'The baroque hall of the St. Gallen Abbey Library'
			},
			attribution: '© Martin Thurnherr, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.stiftsbibliothek.ch'
	},
	{
		id: 'bismarck-denkmal-lindau',
		coordinates: [47.5645, 9.6756],
		categories: ['history'],
		duration: ['short'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Bismarck-Denkmal (Reichsadler)', en: 'Bismarck Monument (Reichsadler)' },
		teaser: {
			de: 'Denkmal für Bismarck mit dem Reichsadler auf dem Hoyerberg.',
			en: 'Bismarck monument with the imperial eagle on the Hoyerberg.'
		},
		description: {
			de: 'Das Bismarck-Denkmal auf dem Hoyerberg bei Lindau zeigt den Reichsadler und gilt als das südlichste Bismarck-Denkmal Deutschlands.',
			en: 'The Bismarck monument on the Hoyerberg near Lindau features the imperial eagle and is considered Germany’s southernmost Bismarck monument.'
		},
		tip: {
			de: 'Der Hoyerberg ist ein kurzer Spaziergang von der Insel aus zu erreichen.',
			en: 'The Hoyerberg is a short walk from the island.'
		},
		image: {
			url: '/images/locations/bismarck-denkmal-lindau.jpg',
			alt: {
				de: 'Das Bismarckdenkmal auf dem Hoyerberg über Lindau',
				en: 'The Bismarck monument on the Hoyerberg above Lindau'
			},
			attribution: '© Mayer Richard, CC BY 3.0, via Wikimedia Commons'
		},
		url: 'https://www.lindau.de/addresses/bismarck-denkmal-reichsadler/'
	},
	{
		id: 'walderlebnispfad-moeggers',
		coordinates: [47.5807, 9.8086],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Walderlebnispfad Möggers', en: 'Walderlebnispfad Möggers' },
		teaser: {
			de: '2,7 km Rundweg mit Hängebrücken und Erlebnisstationen.',
		en: 'A 2.7 km loop with hanging bridges and adventure stations.'
		},
		description: {
			de: 'Der Walderlebnispfad in Möggers ist ein 2,7 km langer Rundweg mit Hängebrücken, Kletterelementen und verschiedenen Erlebnisstationen. Der Eintritt ist frei.',
			en: 'The Walderlebnispfad in Möggers is a 2.7 km loop with hanging bridges, climbing elements and various adventure stations. Admission is free.'
		},
		tip: {
			de: 'Mit dem Landbus 12 zu erreichen. Der Rundweg ist ideal für Familien.',
		en: 'Reachable by Landbus 12. The loop is ideal for families.'
		},
		url: 'https://www.walderlebnispfad.at'
	},
	{
		id: 'schloss-tettnang',
		coordinates: [47.6699, 9.5845],
		categories: ['culture', 'viewpoint'],
		duration: ['medium'],
		nearestStation: 'Markdorf',
		name: { de: 'Neues Schloss Tettnang', en: 'New Palace Tettnang' },
		teaser: {
			de: 'Barockes Schloss mit prächtigen Räumen und Ausblick über das Schussental.',
			en: 'Baroque palace with magnificent rooms and views over the Schussen valley.'
		},
		description: {
			de: 'Das Neue Schloss Tettnang war Residenz der Grafen von Montfort und wurde nach dem Brand 1712 im Barockstil neu erbaut. Es beherbergt heute Museen und bietet einen weiten Blick über das Schussental bis zum Bodensee.',
			en: 'The New Palace Tettnang was the residence of the Counts of Montfort and was rebuilt in Baroque style after a fire in 1712. Today it houses museums and offers sweeping views over the Schussen valley to Lake Constance.'
		},
		tip: {
			de: 'Die Schlosskapelle und das Schlossmuseum sind einen Besuch wert. Vom Bahnhof Markdorf ca. 5 km nach Tettnang.',
			en: 'The palace chapel and museum are worth a visit. From Markdorf station about 5 km to Tettnang.'
		},
		image: {
			url: '/images/locations/schloss-tettnang.jpg',
			alt: {
				de: 'Luftbild von Schloss Tettnang',
				en: 'Aerial view of Tettnang Castle'
			},
			attribution: '© Carsten Steger, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.schloss-tettnang.de/'
	},
	{
		id: 'hopfengut-no20-tettnang',
		coordinates: [47.6904, 9.6166],
		categories: ['drinks', 'culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Markdorf',
		name: { de: 'Hopfengut No20 Tettnang', en: 'Hopfengut No20 Tettnang' },
		teaser: {
			de: 'Brauerei, Gaststätte, Biergarten und Museum auf dem Hopfengut Siggenweiler/Tannau.',
			en: 'Brewery, restaurant, beer garden and museum on the Hopfengut in Siggenweiler/Tannau.'
		},
		description: {
			de: 'Das Hopfengut No20 in Siggenweiler (Tannau) ist ein historisches Hopfengut mit eigener Brauerei, Gaststätte, Biergarten und Museum. Hier wird der Tettnanger Hopfen angebaut und veredelt.',
			en: 'Hopfengut No20 in Siggenweiler (Tannau) is a historic hop farm with its own brewery, restaurant, beer garden and museum. The Tettnang hop is grown and processed here.'
		},
		tip: {
			de: 'Vom Bahnhof Markdorf aus gut erreichbar — ideal für eine Rast mit Hopfenspezialitäten.',
			en: 'Easily reached from Markdorf station — ideal for a stop with hop specialties.'
		},
		image: {
			url: '/images/locations/hopfengut-no20-tettnang.jpg',
			alt: {
				de: 'Hopfenfeld beim Hopfengut No. 20 in Tettnang',
				en: 'Hop field at the Hopfengut No. 20 in Tettnang'
			},
			attribution: '© Anvilaquarius, public domain, via Wikimedia Commons'
		},
		url: 'https://www.hopfengut.de/'
	},
	{
		id: 'festungsmuseum-heldsberg',
		coordinates: [47.4432, 9.6433],
		categories: ['history'],
		duration: ['short', 'medium'],
		nearestStation: 'Hergatz',
		name: { de: 'Festungsmuseum Heldsberg', en: 'Heldsberg Fortress Museum' },
		teaser: {
			de: 'Ehemaliges Artilleriewerk des Zweiten Weltkriegs, seit 1993 Museum.',
			en: 'Former WWII artillery fort, museum since 1993.'
		},
		description: {
			de: 'Das Festungsmuseum Heldsberg bei St. Margrethen (Schweiz) ist ein ehemaliges Artilleriewerk des Zweiten Weltkriegs, das seit 1993 als Museum der Öffentlichkeit zugänglich ist. Es zeigt die Verteidigungsanlagen und das Leben der Besatzung.',
			en: 'The Heldsberg Fortress Museum near St. Margrethen (Switzerland) is a former WWII artillery fort that has been open to the public as a museum since 1993. It displays the defensive installations and the life of the garrison.'
		},
		tip: {
			de: 'Mit dem Bus oder zu Fuß von Hergatz erreichbar. Geführte Touren geben Einblick in die Bunkeranlagen.',
			en: 'Accessible by bus or on foot from Hergatz. Guided tours offer insight into the bunker installations.'
		},
		image: {
			url: '/images/locations/festungsmuseum-heldsberg.jpg',
			alt: {
				de: 'Kanone des Artilleriewerks Heldsberg',
				en: 'Cannon of the Heldsberg artillery fort'
			},
			attribution: '© Kecko, CC BY 2.0, via Wikimedia Commons'
		},
		url: 'https://festung.ch/'
	},
	{
		id: 'pizzeria-lindo-lindau',
		coordinates: [47.5473, 9.6843],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Pizzeria Lindo', en: 'Pizzeria Lindo (Lindau Island)' },
		teaser: {
			de: 'Pizzeria auf der Lindauer Insel in der In der Grub 32.',
			en: 'Pizzeria on the Lindau island at In der Grub 32.'
		},
		description: {
			de: 'Die Pizzeria Lindo liegt direkt auf der Lindauer Insel in der In der Grub 32 und bietet klassische italienische Pizzen in gemütlicher Atmosphäre.',
			en: 'Pizzeria Lindo is located directly on the Lindau island at In der Grub 32 and serves classic Italian pizzas in a cosy atmosphere.'
		},
		tip: {
			de: 'Nur wenige Minuten vom Hafen entfernt — ideal für ein Mittag- oder Abendessen bei der Inselerkundung.',
			en: 'Just a few minutes from the harbour — ideal for lunch or dinner while exploring the island.'
		},
		url: ''
	},
	{
		id: 'la-gondola-nonnenhorn',
		coordinates: [47.5749, 9.6085],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Lindau-Reutin',
		name: { de: 'La Gondola Nonnenhorn', en: 'La Gondola, Nonnenhorn' },
		teaser: {
			de: 'Pizzeria in Nonnenhorn mit Seeblick und großer Terrasse.',
			en: 'Pizzeria in Nonnenhorn with lake view and large terrace.'
		},
		description: {
			de: 'La Gondola in Nonnenhorn (Seehalde 2) ist eine Pizzeria und Ristorante mit einer großen Terrasse direkt am Bodenseeufer.',
			en: 'La Gondola in Nonnenhorn (Seehalde 2) is a pizzeria and restaurant with a large terrace right on the Lake Constance shore.'
		},
		tip: {
			de: 'Vom Bahnhof Lindau-Reutin mit dem Bus oder zu Fuß erreichbar — ideal nach einem Seebesuch.',
			en: 'Reachable from Lindau-Reutin station by bus or on foot — ideal after a lake visit.'
		},
		url: 'https://lagondolaristorantepizzeria.com'
	},
	{
		id: 'bauernhausmuseum-wolfegg',
		coordinates: [47.8185582, 9.7889301],
		categories: ['history'],
		duration: ['medium', 'long'],
		nearestStation: 'Kißlegg',
		name: {
			de: 'Bauernhaus-Museum Allgäu-Oberschwaben Wolfegg',
			en: 'Allgäu-Oberschwaben Farmhouse Museum, Wolfegg'
		},
		teaser: {
			de: 'Freilichtmuseum mit originalgetreu eingerichteten Bauernhäusern aus Oberschwaben und dem westlichen Allgäu.',
			en: 'An open-air museum of faithfully furnished farmhouses from Upper Swabia and the western Allgäu.'
		},
		description: {
			de: 'Zahlreiche historische Bauernhäuser aus Oberschwaben und dem westlichen Allgäu wurden abgetragen und hier wieder aufgebaut – vom Kornspeicher bis zum Fischerhaus. In den originalgetreu eingerichteten Stuben und Kammern wird die ländliche Kulturgeschichte der Region greifbar, ergänzt durch Sonderausstellungen und Mitmachangebote.',
			en: 'Dozens of historic farmhouses from Upper Swabia and the western Allgäu were dismantled and rebuilt here – from granaries to fishing cottages. The faithfully furnished parlours and chambers make the region’s rural history tangible, rounded off by special exhibitions and hands-on activities.'
		},
		tip: {
			de: 'Die Saison läuft nur von Mitte März bis Anfang November – vorher prüfen, ob geöffnet ist. Mit dem Zug bis Kißlegg, von dort mit Bus oder Rad weiter.',
			en: 'The season only runs from mid-March to early November – check opening before you go. Take the train to Kißlegg, then continue by bus or bike.'
		},
		openingHours: {
			de: 'Saison 19. März – 11. November: Di–So 9:00–17:00, letzter Einlass 16:00, montags geschlossen (Oster- und Pfingstmontag geöffnet)',
			en: 'season 19 March – 11 November: Tue–Sun 9am–5pm, last admission 4pm, closed Mondays (open Easter and Whit Monday)'
		},
		url: 'https://www.bauernhausmuseum-wolfegg.de',
		image: {
			url: '/images/locations/bauernhausmuseum-wolfegg.jpg',
			alt: {
				de: 'Kornspeicher und Fischerhaus im Bauernhaus-Museum Wolfegg',
				en: 'Granary and fishing cottage at the Wolfegg farmhouse museum'
			},
			attribution: '© Norbert Kaiser, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'zur-post-wolfegg',
		coordinates: [47.8198472, 9.7939192],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Kißlegg',
		name: { de: 'Gasthof zur Post', en: 'Gasthof zur Post' },
		teaser: {
			de: 'Gasthof mit Biergarten im Wolfegger Ortsteil Wassers, wenige Minuten vom Bauernhaus-Museum.',
			en: 'An inn with a beer garden in Wolfegg’s Wassers district, minutes from the farmhouse museum.'
		},
		description: {
			de: 'Der Gasthof zur Post liegt im Ortsteil Wassers, nur wenige Gehminuten vom Bauernhaus-Museum entfernt. Im Haus gibt es Restaurant und Biergarten – eine naheliegende Einkehr vor oder nach dem Museumsbesuch.',
			en: 'The Gasthof zur Post sits in the Wassers district, just a few minutes’ walk from the farmhouse museum. It has a restaurant and a beer garden – an obvious stop before or after a museum visit.'
		},
		tip: {
			de: 'Mit dem Museumsbesuch kombinieren: erst durch die historischen Häuser, dann in der Nähe einkehren. Die Öffnungszeiten sind saisonal – am besten vorher anrufen.',
			en: 'Combine it with the museum: tour the historic houses first, then eat nearby. Hours are seasonal – best to call ahead.'
		},
		url: 'https://www.hotel-post-wolfegg.de/',
		image: {
			url: '/images/locations/zur-post-wolfegg.jpg',
			alt: {
				de: 'Die grüne Ortsmitte von Wolfegg mit Teich und Bäumen',
				en: 'The green village centre of Wolfegg with its pond and trees'
			},
			attribution: '© Mayer Richard, CC BY 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'gleisneun-kisslegg',
		coordinates: [47.7934006, 9.8819362],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Kißlegg',
		name: { de: 'Gleisneun Bäckerei', en: 'Gleisneun Bakery' },
		teaser: {
			de: 'Bäckerei mit Sitzplätzen an der Bahnhofstraße in Kißlegg.',
			en: 'A bakery with seating on Bahnhofstraße in Kißlegg.'
		},
		description: {
			de: 'Kleine Bäckerei im Ortskern von Kißlegg, wenige Schritte vom Bahnhof entfernt. Frische Backwaren zum Mitnehmen, dazu Sitzplätze drinnen und draußen – praktisch für eine Pause vor oder nach dem Zug.',
			en: 'A small bakery in the centre of Kißlegg, a few steps from the station. Fresh baked goods to take away, plus indoor and outdoor seating – handy for a break before or after the train.'
		},
		tip: {
			de: 'Unkomplizierter Zwischenstopp auf dem Weg ins Allgäu: kurz vor der Abfahrt noch Brot und Gebäck mitnehmen. Sonntags öffnet erst um 7:30 Uhr.',
			en: 'An easy stop on the way into the Allgäu: grab bread and pastries before your train. On Sundays it opens at 7:30am.'
		},
		openingHours: {
			de: 'Mo–Sa 5:30–18:00, So 7:30–18:00, an Feiertagen geschlossen',
			en: 'Mon–Sat 5:30am–6pm, Sun 7:30am–6pm, closed on public holidays'
		},
		image: {
			url: '/images/locations/gleisneun-kisslegg.jpg',
			alt: {
				de: 'Ortsansicht von Kißlegg',
				en: 'View of Kißlegg'
			},
			attribution: '© Ssch, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'fidelisbaeck-wangen',
		coordinates: [47.6857645, 9.8333697],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Wangen (Allgäu)',
		name: { de: 'Fidelisbäck', en: 'Fidelisbäck' },
		teaser: {
			de: 'Traditionsbäckerei von 1505 mit Gaststube und Biergarten in der Wangener Altstadt.',
			en: 'A traditional bakery dating back to 1505, with a tavern and beer garden in the old town of Wangen.'
		},
		description: {
			de: 'Seit über 500 Jahren wird in der Paradiesstraße in Wangen gebacken. Aus der historischen Bäckerei ist ein Haus mit Bäckerei, Gaststube und Biergarten geworden: Fidi-Seelen und Laugenhörnle für unterwegs, Leberkäs frisch aus dem Ofen und dazu ein frisch gezapftes Bier.',
			en: 'Bread has been baked on Paradiesstraße in Wangen for more than 500 years. The historic bakery has grown into a house with a bakery, tavern and beer garden: Fidi-Seelen and pretzel rolls to go, meatloaf fresh from the oven, and a freshly tapped beer alongside.'
		},
		tip: {
			de: 'Für die Pause zwischendurch: morgens früh sind die Laugenhörnle am frischesten. Wer länger bleiben will, setzt sich in den Biergarten unter den Linden.',
			en: 'For a break in between: the pretzel rolls are freshest early in the morning. If you have time to linger, settle into the beer garden under the lime trees.'
		},
		openingHours: {
			de: 'Mo–Fr 6:00–18:30, Sa 6:00–14:00, So und feiertags 8:00–11:00',
			en: 'Mon–Fri 6am–6:30pm, Sat 6am–2pm, Sun and public holidays 8–11am'
		},
		url: 'https://www.fidelisbaeck.de',
		image: {
			url: '/images/locations/fidelisbaeck-wangen.jpg',
			alt: {
				de: 'Der Marktplatz von Wangen im Allgäu',
				en: 'The market square of Wangen im Allgäu'
			},
			attribution: '© Andreas Lorer, CC BY-SA 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'cafe-engel-scheidegg',
		coordinates: [47.5817597, 9.8476776],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Hergatz',
		name: { de: 'Café Engel', en: 'Café Engel' },
		teaser: {
			de: 'Café mit hausgemachtem Kuchen, Kaffee und Eis mitten in Scheidegg.',
			en: 'A café with homemade cake, coffee and ice cream in the centre of Scheidegg.'
		},
		description: {
			de: 'Mitten im Ortszentrum von Scheidegg gelegen, führt Martin das Café Engel. Es gibt hausgemachte Kuchen, Kaffeespezialitäten, kleine Snacks und Eis – drinnen im gemütlichen Café oder bei Sonne auf der Terrasse.',
			en: 'Run by Martin right in the centre of Scheidegg, Café Engel serves homemade cakes, coffee specialities, small snacks and ice cream – inside the cosy café or on the terrace when the sun is out.'
		},
		tip: {
			de: 'Montag und Dienstag ist Ruhetag – an den übrigen Tagen lohnt sich der Nachmittag: Kuchen gibt es bis Ladenschluss, und die Terrasse ist an Sonnentagen schnell besetzt.',
			en: 'Closed on Mondays and Tuesdays – on the other days an afternoon visit works well: cake is served until closing, and the terrace fills up fast on sunny days.'
		},
		openingHours: {
			de: 'Mi–So 10:00–18:00, Mo und Di Ruhetag',
			en: 'Wed–Sun 10am–6pm, closed Mondays and Tuesdays'
		},
		url: 'https://cafe-engel-scheidegg.de/',
		image: {
			url: '/images/locations/cafe-engel-scheidegg.jpg',
			alt: {
				de: 'Die Kirche St. Gallus mit Brunnen im Ortszentrum von Scheidegg',
				en: 'St Gallus church with its fountain in the centre of Scheidegg'
			},
			attribution: '© Dguendel, CC BY 3.0, via Wikimedia Commons'
		}
	},
	{
		id: 'meckatzer-brauestueble',
		coordinates: [47.6307986, 9.8891243],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Heimenkirch',
		name: { de: 'Meckatzer Bräustüble', en: 'Meckatzer Bräustüble' },
		teaser: {
			de: 'Brauereigasthof der Meckatzer Brauerei mit regionaler Küche im Allgäu.',
			en: 'The brewery tavern of Meckatzer, with regional cooking in the Allgäu.'
		},
		description: {
			de: 'Das Bräustüble in Meckatz ist die Wiege der Meckatzer Brauerei: Bereits 1738 wurde an dieser Stelle Bier gebraut, das Gebäude selbst reicht bis ins 14. Jahrhundert zurück. Heute gibt es regionale Küche in den Stuben, im Glaspavillon oder im Saal – und dazu die Biere der Brauerei.',
			en: 'The Bräustüble in Meckatz is where the Meckatzer brewery began: beer was already brewed on this spot in 1738, and the building itself dates back to the 14th century. Today it serves regional cooking in the cosy parlours, the glass pavilion or the hall – with the brewery’s beers alongside.'
		},
		tip: {
			de: 'Wer mehr sehen will, bucht eine Brauereiführung; der Fanshop hat Di–Sa 11:00–16:30 geöffnet. Mit dem Zug bis Heimenkirch, von dort sind es rund zwei Kilometer.',
			en: 'To see more, book a brewery tour; the fan shop is open Tue–Sat 11am–4:30pm. Take the train to Heimenkirch, about two kilometres away.'
		},
		openingHours: {
			de: 'Fanshop: Di–Sa 11:00–16:30; Küchen- und Gastronomiezeiten vorab prüfen',
			en: 'fan shop: Tue–Sat 11am–4:30pm; check kitchen and restaurant hours in advance'
		},
		url: 'https://www.meckatzer-braeustueble.de/',
		image: {
			url: '/images/locations/meckatzer-brauestueble.jpg',
			alt: {
				de: 'Luftbild der Meckatzer Brauerei in Meckatz',
				en: 'Aerial view of the Meckatzer brewery at Meckatz'
			},
			attribution: '© Clemenspool, CC0, via Wikimedia Commons'
		}
	},
	{
		id: 'dornier-museum',
		coordinates: [47.6577, 9.5229],
		categories: ['technology', 'culture'],
		duration: ['medium'],
		nearestStation: 'Friedrichshafen Flughafen',
		name: { de: 'Dornier Museum', en: 'Dornier Museum' },
		teaser: {
			de: 'Luftfahrt- und Raumfahrtgeschichte am Flughafen Friedrichshafen — vom Wasserflugzeug bis zur Raumfahrt.',
			en: 'Aviation and space history at Friedrichshafen airport — from flying boats to spaceflight.'
		},
		description: {
			de: 'In der futuristischen Halle am Flughafen erzählt das Museum die Geschichte von Claude Dornier und seinen Flugzeugen: von den ersten Wasserflugzeugen über die legendäre Do X bis zur Luft- und Raumfahrt von heute. Über 400 Exponate, darunter Originalflugzeuge, sind drinnen und auf dem Freigelände zu sehen.',
			en: 'In the futuristic hall at the airport, the museum tells the story of Claude Dornier and his aircraft: from the first flying boats over the legendary Do X to today’s aviation and spaceflight. More than 400 exhibits, including original aircraft, are on show indoors and on the open-air grounds.'
		},
		tip: {
			de: 'Aktionstage wie die „Do Days“ machen die Technik zum Anfassen — Termine vorher prüfen. Vom Bahnhof Friedrichshafen Flughafen sind es wenige Minuten zu Fuß; bei Regen ist das Museum ein guter Plan B.',
			en: 'Event days such as the “Do Days” make the technology hands-on — check the dates beforehand. It is a few minutes on foot from Friedrichshafen Flughafen station; on a rainy day the museum is a good plan B.'
		},
		openingHours: {
			de: 'Di–So 10:00–17:00, Mo geschlossen; an Feiertagen und in der Saison abweichend',
			en: 'Tue–Sun 10am–5pm, closed Mon; different on public holidays and in season'
		},
		url: 'https://www.dorniermuseum.de'
	},
	{
		id: 'langenargen',
		coordinates: [47.5877, 9.5908],
		categories: ['culture', 'nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Langenargen',
		name: { de: 'Langenargen & Maurischer Kiosk', en: 'Langenargen & Moorish Kiosk' },
		teaser: {
			de: 'Hafenpromenade an der Argenmündung mit dem Maurischen Kiosk aus der Pariser Weltausstellung.',
			en: 'Harbour promenade at the mouth of the Argen, with the Moorish Kiosk from the Paris World’s Fair.'
		},
		description: {
			de: 'Wo die Argen in den Bodensee fließt, liegt Langenargen mit seiner Promenade und der hölzernen Argenbrücke. Im Park am See steht der Maurische Kiosk, ein exotischer Pavillon aus der Pariser Weltausstellung — ein Blickfang mit Blick über den See zur Schweizer Seite.',
			en: 'Where the Argen flows into Lake Constance lies Langenargen, with its promenade and the wooden Argen bridge. In the park by the lake stands the Moorish Kiosk, an exotic pavilion from the Paris World’s Fair — an eye-catcher with a view across the lake to the Swiss shore.'
		},
		tip: {
			de: 'Einmal im Jahr ist Langenargen Schauplatz einer Flugshow — dann ist der Ort voll und die Promenade der beste Aussichtspunkt; Termine vorher prüfen. Sonst lohnt der Spaziergang über die Argenbrücke zum Kiosk im Park.',
			en: 'Once a year Langenargen hosts a plane show — the town is busy then and the promenade is the best vantage point; check the dates beforehand. Otherwise, the walk over the Argen bridge to the kiosk in the park is worth it.'
		},
		url: 'https://www.langenargen.de'
	},
	{
		id: 'open-air-kino-hagnau',
		coordinates: [47.6725, 9.3267],
		categories: ['culture'],
		duration: ['short'],
		nearestStation: 'Uhldingen-Mühlhofen',
		name: { de: 'Open Air Kino Hagnau', en: 'Hagnau Open Air Cinema' },
		teaser: {
			de: 'Sommerliche Filmabende unter freiem Himmel am See.',
			en: 'Summer film evenings under the open sky by the lake.'
		},
		description: {
			de: 'An ausgewählten Sommerabenden wird in Hagnau unter freiem Himmel gefilmt — das Publikum sitzt mit Decken und Getränken am See, während über ihm der Film läuft. Kein Dauerbetrieb, sondern ein saisonales Ereignis für laue Nächte.',
			en: 'On selected summer evenings, films are shown under the open sky in Hagnau — the audience sits by the lake with blankets and drinks while the film runs above them. Not a permanent venue, but a seasonal event for balmy nights.'
		},
		tip: {
			de: 'Decke und etwas Warmes zum Anziehen mitnehmen, auch im Sommer kühlt es am Wasser schnell ab. Bei Regen fällt die Vorstellung aus — Programm und Tickets vorher online prüfen.',
			en: 'Bring a blanket and something warm — it cools down quickly by the water even in summer. Shows are cancelled in rain, so check the programme and tickets online beforehand.'
		},
		icon: '🎥',
		openingHours: {
			de: 'saisonal: ausgewählte Abende im Sommer, Beginn bei Einbruch der Dunkelheit',
			en: 'seasonal: selected summer evenings, starting at dusk'
		}
	},
	{
		id: 'kommprobier-langenargen',
		coordinates: [47.5943, 9.5491],
		categories: ['drinks', 'culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Langenargen',
		name: { de: 'KommproBier Langenargen', en: 'KommproBier Langenargen' },
		teaser: {
			de: 'Craft-Beer-Shop am Bodensee mit bis zu 900 Biersorten, Ausschank und dem monatlichen Tag der offenen Flasche.',
			en: 'Craft beer shop on Lake Constance with up to 900 beers on the shelf, a tasting bar and the monthly Tag der offenen Flasche.'
		},
		description: {
			de: 'Uli und Helmut Heine haben 2015 in der Mühlstraße einen ehemaligen Lebensmittelmarkt in ein Bierparadies verwandelt: 600 bis 900 Craft Biere, Landbiere, Geuzen und Ciders aus aller Welt. Nach dem Prinzip „artgerechte Bierhaltung“ stehen in den Regalen nur leere Musterflaschen, das echte Bier schläft im Kühlhaus. Vor Ort gibt es Selbstbedienungstheke, Wohnzimmer und Biergarten, und Biersommeliers helfen bei der Wahl aus den Kühlregalen.',
			en: 'In 2015 Uli and Helmut Heine turned a former grocery store in Mühlstraße into a beer paradise: 600 to 900 craft beers, regional beers, lambics and ciders from all over the world. In line with their “species-appropriate beer storage” principle, the shelves show only empty sample bottles while the real stock rests in the cool rooms. On site there is a self-service bar, a lounge and a beer garden, and beer sommeliers help you pick from the fridge shelves.'
		},
		tip: {
			de: 'Der Tag der offenen Flasche ist jeden ersten Freitag im Monat von 17 bis 24 Uhr: Biere vom Fass der mitbringenden Brauer, Wurstsalat-Buffet (im Winter Raclette, im Sommer Bratwurst vom Grill) und über 800 gekühlte Biere zum Durchprobieren — pro Flasche 1,50 € Aufschlag, Plätze bis 19:00 Uhr reserviert. Zusätzlich gibt es jeden zweiten Donnerstag eine geführte Themenverkostung um 19:30 Uhr (50 €, mit Reservierung und Anzahlung).',
			en: 'The Tag der offenen Flasche (day of the open bottle) is every first Friday of the month from 5pm to midnight: draft beers from visiting brewers, a sausage-salad buffet (raclette in winter, grilled sausage in summer) and more than 800 chilled beers to taste — a €1.50 surcharge per bottle, seats held until 7pm. On top of that, a guided themed tasting runs every second Thursday at 7:30pm (€50, with reservation and deposit).'
		},
		openingHours: {
			de: 'Di–Fr 13:00–19:00, Sa 11:00–19:00; Mo, So und Feiertage geschlossen; Wohnzimmer und Biergarten je nach Betrieb bis 22:00',
			en: 'Tue–Fri 1–7pm, Sat 11am–7pm; closed Mon, Sun and holidays; lounge and beer garden until 10pm depending on business'
		},
		url: 'https://kommprobier.de'
	},
	{
		id: 'strandbad-eichwald',
		coordinates: [47.5487, 9.7175],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Strandbad Eichwald', en: 'Strandbad Eichwald Lido' },
		teaser: {
			de: 'Strandbad direkt am Bodensee mit Sandstrand, Seezugang und dem 50-Meter-Olympiabecken.',
			en: 'Lido right on Lake Constance with a sandy beach, lake access and the 50-metre Olympic pool.'
		},
		description: {
			de: 'Das Strandbad Eichwald in der Eichwaldstraße ist seit fast 100 Jahren ein beliebtes Badeziel am Bodensee. Neben dem herrlichen Sandstrand und dem direkten Seezugang bietet es ein 50-Meter-Olympiabecken, ein Beachvolleyballfeld, einen Spielplatz und eine Poolbar. Die Wasserwacht Lindau sorgt für die Sicherheit der Badegäste.',
			en: 'Strandbad Eichwald in Eichwaldstraße has been a popular bathing spot on Lake Constance for almost 100 years. Besides the lovely sandy beach and direct lake access, it offers a 50-metre Olympic pool, a beach volleyball court, a playground and a pool bar. The Wasserwacht Lindau lifeguards keep bathers safe.'
		},
		tip: {
			de: 'Der Eintritt kostet 6 € für Erwachsene und 3 € für Kinder (6–17 Jahre). Strandbad-Gäste dürfen die Außen-Poolbar „Lido“ der Therme mitnutzen. Aktuell Winterpause, Öffnung täglich 9 bis 20 Uhr.',
			en: 'Admission is €6 for adults and €3 for children (6–17 years). Lido guests may also use the Therme\'s outdoor pool bar "Lido". Currently winter break, open daily 9am–8pm.'
		},
		openingHours: {
			de: 'saisonal: täglich 9:00–20:00 Uhr, aktuell Winterpause',
			en: 'seasonal: daily 9am–8pm, currently winter break'
		},
		image: {
			url: '/images/locations/strandbad-eichwald.jpg',
			alt: {
				de: 'Strandbad Eichwald am Bodensee mit Sandstrand',
				en: 'Strandbad Eichwald lido on Lake Constance with sandy beach'
			},
			attribution: '© Wald-Burger8, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.therme-lindau.com'
	},
	{
		id: 'freibad-aquamarin-wasserburg',
		coordinates: [47.5662, 9.6409],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Wasserburg (Bodensee)',
		name: { de: 'Freibad Aquamarin Wasserburg', en: 'Freibad Aquamarin Wasserburg' },
		teaser: {
			de: 'Familienfreundliches Freibad direkt am Bodensee mit Alpenblick, beheizten Becken und Wassersportangebot.',
			en: 'Family-friendly lido right on Lake Constance with Alpine views, heated pools and watersports.'
		},
		description: {
			de: 'Das Freibad Aquamarin liegt in Wasserburg am Bodensee und bietet Badespaß mit grandiosem Alpenblick. Es gibt ein Mehrzweckbecken, ein Jugendbecken mit 15 Meter langer Wasserrutsche, ein Kinderbecken und „Augustins Kinderland“ mit Wasserspielgeräten. Zudem können Tretboote, Kanus und SUP-Boards gemietet werden. Die Becken werden auf 26 Grad beheizt.',
			en: 'Freibad Aquamarin in Wasserburg on Lake Constance offers bathing fun with grand Alpine views. There is a multi-purpose pool, a youth pool with a 15-metre water slide, a children\'s pool and "Augustins Kinderland" with water play equipment. Pedal boats, canoes and SUP boards can be rented. The pools are heated to 26 degrees.'
		},
		tip: {
			de: 'Eintritt Erwachsene 6 €, Kinder und Jugendliche bis 18 Jahre 3 €. Geöffnet bis voraussichtlich 20. September 2026. Parkplatz: erste Stunde frei, danach 2 € pro Stunde.',
			en: 'Admission €6 for adults, €3 for children and young people up to 18. Open until 20 September 2026. Parking: first hour free, then €2 per hour.'
		},
		openingHours: {
			de: 'saisonal: Mai–Sept, täglich (Mai 10:30–19:00, Juni–Aug 9:30–20:00)',
			en: 'seasonal: May–Sept, daily (May 10:30am–7pm, Jun–Aug 9:30am–8pm)'
		},
		url: 'https://www.wasserburg-bodensee.de/wassererlebnisse/freibad-aquamarin/'
	},
	{
		id: 'strandbad-degersee',
		coordinates: [47.6131, 9.6540],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Kressbronn',
		name: { de: 'Strandbad Degersee', en: 'Strandbad Degersee Lido' },
		teaser: {
			de: 'Naturbadesee am Degersee bei Tettnang mit Strandbad, Restaurant und Seeblick.',
			en: 'Natural bathing lake at Degersee near Tettnang with lido, restaurant and lake views.'
		},
		description: {
			de: 'Der Degersee ist ein warmer Moränensee bei Tettnang. Das angrenzende Strandbad lädt zum Baden ein, daneben verwöhnt die Degerseestube mit Terrasse und Seeblick mit regionalen und schwäbischen Spezialitäten.',
			en: 'Degersee is a warm moraine lake near Tettnang. The adjacent lido invites swimming, and next door the Degerseestube pampers guests with regional and Swabian specialties on its terrace with lake views.'
		},
		tip: {
			de: 'Von Kressbronn mit dem Bus (Linie 235) bis zur Haltestelle Tettnang, Degersee; Parkplatz am Haus (2 €/Tag).',
			en: 'From Kressbronn take bus line 235 to the Tettnang, Degersee stop; parking on site (€2/day).'
		},
		image: {
			url: '/images/locations/strandbad-degersee.jpg',
			alt: {
				de: 'Badefreude am Degersee mit Schwimmenden',
				en: 'Bathing fun at Degersee with swimmers'
			},
			attribution: '© ANKAWÜ, CC BY-SA 3.0, via Wikimedia Commons'
		},
		url: 'https://www.degerseestube.de/'
	},
	{
		id: 'waldsee-lindenberg',
		coordinates: [47.6027, 9.8700],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Waldsee Lindenberg', en: 'Waldsee Lindenberg' },
		teaser: {
			de: 'Idyllischer Moorwasser-Badesee bei Lindenberg im Allgäu mit freiem Eintritt und Liegewiesen.',
			en: 'Idyllic moor-water bathing lake near Lindenberg im Allgäu with free admission and lawns.'
		},
		description: {
			de: 'Der Waldsee liegt nur wenige Minuten vom Lindenberger Stadtzentrum entfernt und lädt zum Baden im weichen Moorwasser ein. Das Freizeitgelände mit Badestelle bietet Spaß und Erholung für die ganze Familie: Liegewiesen, Kinderspielplatz, Beachvolleyball, Tischtennis und im Sommer einen Kiosk mit Sonnenterrasse.',
			en: 'The Waldsee lies just a few minutes from Lindenberg town centre and invites swimming in soft moor water. The recreational area with bathing spot offers fun and relaxation for the whole family: lawns, children\'s playground, beach volleyball, table tennis and a kiosk with sun terrace in summer.'
		},
		tip: {
			de: 'Eintritt frei, täglich von 5 bis 22 Uhr, Zugang über das Drehkreuz. Hunde sind im Waldseebad nicht gestattet.',
			en: 'Free admission, daily 5am–10pm, access via turnstile. Dogs are not allowed in the Waldseebad.'
		},
		openingHours: {
			de: 'täglich 5:00–22:00 Uhr, Kiosk saisonal Mai–Sept',
			en: 'daily 5am–10pm, kiosk seasonal May–Sept'
		},
		image: {
			url: '/images/locations/waldsee-lindenberg.jpg',
			alt: {
				de: 'Blick auf den Waldsee vom Hotel Waldsee in Lindenberg',
				en: 'View over the Waldsee from Hotel Waldsee in Lindenberg'
			},
			attribution: '© Photographix, GFDL, via Wikimedia Commons'
		},
		url: 'https://www.lindenberg.de/tourismus/waldsee'
	},
	{
		id: 'schloss-sigmaringen',
		coordinates: [48.0878, 9.2165],
		categories: ['history'],
		duration: ['short', 'medium'],
		nearestStation: 'Sigmaringen',
		name: { de: 'Schloss Sigmaringen', en: 'Sigmaringen Castle' },
		teaser: {
			de: 'Das weltberühmte Hohenzollernschloss thront hoch über der Donau in Sigmaringen.',
			en: 'The world-famous Hohenzollern Castle towers high above the Danube in Sigmaringen.'
		},
		description: {
			de: 'Das prächtige Hohenzollernschloss ragt aus der Mitte der ehemaligen Residenzstadt Sigmaringen empor, am Rande der Schwäbischen Alb, wo die Donau ihren Lauf durch mächtige Felsen und Wälder gegraben hat. Es zählt zu den größten privaten Schlössern Europas und ist seit Generationen Wohnsitz der Hohenzollern-Sigmaringen.',
			en: 'The splendid Hohenzollern Castle rises from the centre of the former residence town of Sigmaringen, on the edge of the Swabian Alb, where the Danube has carved its course through mighty rocks and forests. It is one of the largest private castles in Europe and has been the home of the Hohenzollern-Sigmaringen family for generations.'
		},
		tip: {
			de: 'Führungen durch das Schloss und die Schatzkammer werden angeboten; die malerische Altstadt liegt direkt am Fuße des Schlosses.',
			en: 'Guided tours of the castle and treasury are offered; the picturesque old town lies directly at the foot of the castle.'
		},
		image: {
			url: '/images/locations/schloss-sigmaringen.jpg',
			alt: {
				de: 'Schloss Sigmaringen, das Hohenzollernschloss über der Donau',
				en: 'Sigmaringen Castle, the Hohenzollern castle above the Danube'
			},
			attribution: '© Jörg Braukmann, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://tourismus-sigmaringen.de/'
	},
	{
		id: 'gasthaus-zum-rad-aulendorf',
		coordinates: [47.9527611, 9.6383489],
		categories: ['culinary'],
		duration: ['short', 'medium'],
		nearestStation: 'Aulendorf',
		name: { de: 'Gasthaus zum Rad', en: 'Gasthaus zum Rad' },
		teaser: {
			de: 'Schwäbisches Gasthaus in Aulendorf mit regionaler kräuterfrischer Küche, täglich ab 11 Uhr.',
			en: 'Swabian inn in Aulendorf with regional herb-fresh cuisine, open daily from 11am.'
		},
		description: {
			de: 'Das Gasthaus zum Rad gehört zum Hotel Arthus & Ritterkeller in der Radgasse mitten in Aulendorf. „Schwäbisch. Gemütlich. Überraschend“ lautet das Versprechen: Die Kräuter wachsen im hoteleigenen Kräutergarten, die Lebensmittel stammen vorwiegend aus Oberschwaben. Für diese ehrlich regionale Küche wurde das Gasthaus mit 2 Löwen von „Schmeck-den-Süden“ ausgezeichnet. Dazu gibt es eine saisonale Speisekarte, eine Weinkarte und ein tägliches Mittagsessen.',
			en: 'Gasthaus zum Rad is part of Hotel Arthus & Ritterkeller on Radgasse in the centre of Aulendorf. "Swabian. Cosy. Surprising" is its promise: the herbs grow in the hotel’s own herb garden, and the ingredients come predominantly from Oberschwaben. For this honest regional cuisine the inn has been awarded 2 lions by "Schmeck-den-Süden". There is also a seasonal menu, a wine list and a daily lunch dish.'
		},
		tip: {
			de: 'Täglich 11:00–24:00 Uhr geöffnet, warme Küche 11:30–14:00 und 17:30–21:00 Uhr. Barrierefrei mit Außenbereich, WLAN für Gäste. Reservierung telefonisch unter +49 7525 92210.',
			en: 'Open daily 11am–midnight, warm kitchen 11:30am–2pm and 5:30–9pm. Wheelchair accessible with outdoor seating, guest WiFi. Reserve by phone at +49 7525 92210.'
		},
		openingHours: {
			de: 'täglich 11:00–24:00 Uhr, Küche 11:30–14:00 und 17:30–21:00 Uhr',
			en: 'daily 11am–midnight, kitchen 11:30am–2pm and 5:30–9pm'
		},
		url: 'https://www.ritterkeller.de/gasthaus-zum-rad/'
	},
	{
		id: 'bisongehege-bodenwald',
		coordinates: [47.789, 9.0317],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Überlingen',
		name: { de: 'Bisongehege am Hofgut Bodenwald', en: 'Bison Enclosure at Hofgut Bodenwald' },
		teaser: {
			de: 'Kostenlos zugängliche Bisonherde auf dem Hochplateau des Bodanrück zwischen Überlinger See und Untersee.',
			en: 'A freely accessible bison herd on the high plateau of the Bodanrück between Lake Überlingen and the Untersee.'
		},
		description: {
			de: 'Auf dem Hofgut Bodenwald, einem Hochplateau auf dem Bodanrück auf etwa 700 Metern, grasen rund 20 nordamerikanische Bisons auf einer gepachteten Fläche von etwa 12 Hektar. Das Gehege ist kostenlos zugänglich; direkt daneben lädt die Bisonstube Bodenwald mit regionaler Küche und großem Biergarten zur Einkehr ein. Rundwege führen weiter zur Ruine Altbodman und zum Frauenberg mit Blick auf den Bodensee.',
			en: 'On the Hofgut Bodenwald, a high plateau on the Bodanrück ridge at about 700 metres, around 20 North American bisons graze on a leased area of roughly 12 hectares. The enclosure is freely accessible; right next door the Bisonstube Bodenwald invites you to stop for regional dishes and a large beer garden. Circular trails continue to the Altbodman ruin and the Frauenberg with views over Lake Constance.'
		},
		tip: {
			de: 'Von Wallhausen mit dem Bus Richtung Bodman fahren und an der Haltestelle aussteigen, dann zu Fuß hinauf — das Gehege liegt auf dem Weg zur Ruine Altbodman. Der Eintritt ist kostenlos, feste Schuhe empfehlenswert.',
			en: 'From Wallhausen take the bus toward Bodman and get off at the stop, then walk uphill — the enclosure is on the way to the Altbodman ruin. Entry is free; sturdy shoes recommended.'
		},
		url: 'https://www.bisonzuchtbodenwald.com'
	},
	{
		id: 'argen-muendung-langenargen',
		coordinates: [47.5872, 9.5553],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Langenargen',
		name: { de: 'Argenmündung Langenargen', en: 'Argen Delta at Langenargen' },
		teaser: {
			de: 'Naturnahe Mündung der Argen in den Bodensee mit flachen Uferwegen — ein tolles Revier fürs Rad.',
			en: 'Natural mouth of the Argen into Lake Constance with flat lakeside paths — great territory for cycling.'
		},
		description: {
			de: 'Zwischen Langenargen und Kressbronn mündet die Argen, mit rund 20 m³/s der drittgrößte Zufluss des Bodensees, in den See. Flusslauf, Steilufer und Auwälder liegen im Naturschutzgebiet Argen; die Mündung selbst wird von Marinas, Campingplätzen und Freizeiteinrichtungen flankiert. Der Bodensee-Radweg führt direkt durch Langenargen und überquert die Argen auf der historischen Kabelhängebrücke von 1898, die seit etwa 2010 nur noch Fußgängern und Radfahrern vorbehalten ist. Eine ruhigere, seenähere Variante für Radler führt über den Argensteg. Hinter Langenargen öffnet sich das Argental Richtung Tettnang: Die Nachbarstadt gibt dem Hopfenanbaugebiet Tettnang den Namen, und die Region ist noch immer ein bedeutendes Obst- und Hopfenanbaugebiet.',
			en: 'Between Langenargen and Kressbronn, the Argen — with around 20 m³/s the third-largest tributary of Lake Constance — flows into the lake. The river bed, steep banks and riparian forests are part of the Argen nature reserve; the mouth itself is flanked by marinas, campsites and leisure facilities. The Bodensee-Radweg cycle route leads straight through Langenargen and crosses the Argen on the historic cable suspension bridge of 1898, which since about 2010 is reserved for pedestrians and cyclists. A quieter, lake-near alternative for cyclists runs over the Argensteg. Behind Langenargen the Argen valley opens towards Tettnang: the neighbouring town gives the Tettnang hop-growing region its name, and the area is still a significant fruit and hop growing region.'
		},
		tip: {
			de: 'Für die Radtour den Bodensee-Radweg oder die ruhigere Variante über den Argensteg nehmen; die Uferwege sind flach und größtenteils asphaltiert. Von hier aus lohnt ein Abstecher nach Tettnang mit seinen Hopfengärten, dem Hopfenmuseum und dem rund vier Kilometer langen Hopfenpfad. Die Argen wurde 2014/15 zur „Flusslandschaft des Jahres“ gekürt.',
			en: 'For the bike tour take the Bodensee-Radweg or the quieter variant over the Argensteg; the lakeside paths are flat and mostly paved. From here a detour to Tettnang with its hop fields, hop museum and the roughly four-kilometre hop trail is worthwhile. The Argen was named “River Landscape of the Year” 2014/15.'
		},
		image: {
			url: '/images/locations/argen-muendung-langenargen.jpg',
			alt: {
				de: 'Mündung der Argen in den Bodensee bei Langenargen',
				en: 'Mouth of the Argen river into Lake Constance at Langenargen'
			},
			attribution: '© Schusch75, CC BY-SA 3.0, via Wikimedia Commons'
		},
		url: 'https://www.langenargen.de'
	},
	{
		id: 'breitachklamm-oberstdorf',
		coordinates: [47.3935, 10.2321],
		categories: ['nature'],
		duration: ['short', 'medium'],
		nearestStation: 'Oberstdorf',
		name: { de: 'Breitachklamm', en: 'Breitach Gorge' },
		teaser: {
			de: 'Mit 2,5 km Länge und rund 150 m Tiefe eine der tiefsten Felsschluchten Mitteleuropas bei Oberstdorf.',
			en: 'At 2.5 km long and around 150 m deep, one of the deepest rock gorges in Central Europe, near Oberstdorf.'
		},
		description: {
			de: 'Unweit von Tiefenbach bahnt sich die Breitach zwischen Oberstdorf und dem Kleinwalsertal den Weg durch eine enge Schlucht mit teilweise über hundert Meter hohen senkrechten und überhängenden Wänden. Entstanden ist die Klamm beim Abschmelzen der Gletscher in der letzten Eiszeit vor über 8000 Jahren; 1904 machten mutige Tiefenbacher den Wanderweg durch die Klamm zugänglich. Donnernd stürzt das Wasser über hohe Felsbänke, gurgelt in tiefen Gumpen und versprüht sich in feinsten Tröpfchen, in denen das Licht spielt. Im Winter verwandeln meterhohe Eisvorhänge und schneebedeckte Felsen die Klamm in ein Winterwunderland — 2025 wurde sie zum Naturwunder des Jahres gekürt.',
			en: 'Near Tiefenbach, the Breitach forces its way between Oberstdorf and the Kleinwalsertal through a narrow gorge with partly over-hundred-metre-high vertical and overhanging walls. The gorge was formed as the glaciers melted at the end of the last ice age, over 8000 years ago; in 1904, brave men from Tiefenbach made the trail through the gorge accessible. The water thunders over high rock ledges, gurgles in deep pools and sprays into finest droplets in which the light plays. In winter, metre-high curtains of ice and snow-covered rocks turn the gorge into a winter wonderland — in 2025 it was named Nature Wonder of the Year.'
		},
		tip: {
			de: 'Eintritt Erwachsene 7,50 €, Kinder 5–15 Jahre 2,50 € (mit Allgäu-Walser-Card günstiger, ab 10 Personen Gruppenpreis 7 €). Sommer täglich 9–17 Uhr letzter Einlass (Schluss 17:30), Winter 9–16 Uhr (Schluss 16:30); geschlossen Mitte März bis Ende April und nach den bayerischen Herbstferien bis Weihnachten. Festes Schuhwerk tragen; ein Panoramaweg führt über den Zwingsteg zur Alpe Dornach und über die Klammkapelle zurück zum Parkplatz P1.',
			en: 'Admission €7.50 for adults, €2.50 for children 5–15 (cheaper with the Allgäu-Walser-Card; group rate €7 from 10 people). Summer daily 9am–5pm last entry (closes 5:30pm), winter 9am–4pm (closes 4:30pm); closed mid-March to end of April and after the Bavarian autumn holidays until Christmas. Wear sturdy shoes; a panorama trail leads over the Zwingsteg to Alpe Dornach and via the gorge chapel back to car park P1.'
		},
		openingHours: {
			de: 'saisonal: Sommer täglich 9:00–17:00 Uhr (letzter Einlass), Winter 9:00–16:00 Uhr',
			en: 'seasonal: summer daily 9am–5pm (last entry), winter 9am–4pm'
		},
		image: {
			url: '/images/locations/breitachklamm.jpg',
			alt: {
				de: 'Die Breitachklamm bei Oberstdorf mit tosendem Wasser',
				en: 'The Breitach gorge near Oberstdorf with roaring water'
			},
			attribution: '© Laydii, CC BY-SA 4.0, via Wikimedia Commons'
		},
		url: 'https://www.breitachklamm.de/'
	},
	{
		id: 'gerberschanze',
		coordinates: [47.5459, 9.6889],
		categories: ['viewpoint'],
		duration: ['short'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Gerberschanze', en: 'Gerberschanze' },
		teaser: {
			de: 'Aussichtspunkt auf der Lindauer Insel unter einer alten Linde mit Blick über den See.',
			en: 'A viewpoint on Lindau island under an old lime tree with views over the lake.'
		},
		description: {
			de: 'Die Gerberschanze ist einer der beliebtesten Aussichtspunkte der Lindauer Insel. Unter einer alten Linde blickt man über den Bodensee, auf die Alpenkette und hinunter ins Hafenbecken mit Löwe und Leuchtturm.',
			en: 'The Gerberschanze is one of the most popular viewpoints on Lindau island. Under an old lime tree you look across Lake Constance, over the Alps and down into the harbour basin with its lion and lighthouse.'
		},
		tip: {
			de: 'Zum Sonnenuntergang kommen, wenn das Licht auf dem Hafeneingang warm wird.',
			en: 'Come at sunset, when the light on the harbour entrance turns warm.'
		},
		icon: '🌳'
	},
	{
		id: 'lindau-hafen',
		coordinates: [47.5445, 9.6833],
		categories: ['viewpoint'],
		duration: ['short'],
		nearestStation: 'Lindau-Insel',
		name: { de: 'Lindau Hafen & Leuchtturm', en: 'Lindau Harbour & Lighthouse' },
		teaser: {
			de: 'Bayerischer Löwe und Leuchtturm rahmen das bekannteste Seebild der Region.',
			en: 'The Bavarian lion and the lighthouse frame the region’s most famous lake view.'
		},
		description: {
			de: 'Der Lindauer Hafen ist das Postkartenmotiv der Stadt: Der Bayerische Löwe und der Leuchtturm stehen an der Einfahrt, dahinter liegt die Altstadt mit Cavazzen und Marktplatz. Von der Hafenpromenade reicht der Blick über den Bodensee bis zu den Alpen, und in der warmen Jahreszeit legen hier die Ausflugsschiffe an.',
			en: 'The Lindau harbour is the town’s postcard motif: the Bavarian lion and the lighthouse stand at the entrance, with the old town, the Cavazzen house and the market square behind them. From the harbour promenade the view reaches across Lake Constance to the Alps, and in the warmer months the excursion boats call here.'
		},
		tip: {
			de: 'Für das klassische Foto am besten am frühen Morgen oder Abend kommen, wenn weniger Betrieb ist.',
			en: 'For the classic photo come early in the morning or in the evening, when it is quieter.'
		},
		icon: '⚓'
	},
	{
		id: 'obsthof-weber',
		coordinates: [47.5971, 9.7383],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Hergatz',
		name: { de: 'Obsthof Weber Wildberg', en: 'Obsthof Weber Wildberg' },
		teaser: {
			de: 'Obsthof im Weißensberger Ortsteil Wildberg mit Äpfeln, Pflaumen, Williams-Birnen und Apfelbränden.',
			en: 'An orchard farm in Wildberg, part of Weißensberg, with apples, plums, Williams pears and apple spirits.'
		},
		description: {
			de: 'Der Obsthof Weber liegt im kleinen Wildberg, einem Ortsteil von Weißensberg zwischen Lindau und dem Westallgäu. Der Hof baut Äpfel, Pflaumen und Williams-Birnen an und verdistilliert darunter Apfelbrand und Obstler.',
			en: 'Obsthof Weber is in tiny Wildberg, a hamlet of Weißensberg between Lindau and the western Allgäu. The farm grows apples, plums and Williams pears and distills apple brandy and obstler from them.'
		},
		tip: {
			de: 'Die Erntezeit von Spätsommer bis Herbst ist die beste Zeit für einen Abstecher; Angebot und Zeiten wechseln mit der Saison.',
			en: 'Harvest time from late summer to autumn is the best moment for a detour; the offer and the times change with the season.'
		},
		icon: '🍎'
	},
];
