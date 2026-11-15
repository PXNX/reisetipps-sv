export type Category = 'nature' | 'culture' | 'culinary' | 'history' | 'technology' | 'viewpoint';

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
	'Markdorf'
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
			de: 'Zehn Minuten hinaufgehen und oben oder unten bei einem der Weingüter eine Rast einlegen.',
			en: 'Walk ten minutes up and rest at one of the vineyard estates at the top or bottom.'
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
			de: 'Kompakte Altstadt direkt am Bahnhof, mit gotischem Münster und geschnitztem Ratssaal. Die Promenade lädt zu einem langen Spaziergang mit Seeblick ein.',
			en: 'A compact old town right by the station, with a Gothic minster and a carved council chamber. The promenade invites a long lakeside walk.'
		},
		tip: {
			de: 'Am späten Nachmittag an der Promenade entlang zur Therme spazieren — schöner Blick bei Sonnenuntergang.',
			en: 'Walk the promenade toward the thermal baths in the late afternoon — the sunset views are worth it.'
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
			de: 'Die Insel Lindau ist zu Fuß in einer Stunde umrundet. Der Hafeneingang mit Löwe und Leuchtturm ist eines der bekanntesten Bodensee-Motive.',
			en: 'The island town of Lindau can be circled on foot in about an hour. The harbour entrance with its lion and lighthouse is one of the most photographed views on the lake.'
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
		categories: ['nature'],
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
		categories: ['culinary'],
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
		coordinates: [47.5662, 9.6409],
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
		coordinates: [47.5487, 9.7175],
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
		url: 'https://www.gartendenkmal-lindenhofpark.de/page/lindenhofpark.html'
	},
	{
		id: 'fesslerhof-eichenberg',
		coordinates: [47.5447, 9.7968],
		categories: ['culinary'],
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
		id: 'alma-kaeslaedele-lochau',
		coordinates: [47.5315, 9.7509],
		categories: ['culinary'],
		duration: ['short'],
		nearestStation: 'Bregenz',
		name: { de: 'Alma Käslädele Lochau', en: 'Alma Käslädele, Lochau' },
		teaser: {
			de: 'Käseladen von Alma und Rupp mit Vorarlberger Bergkäse direkt vom Senner — und dem Jersey Blue.',
			en: 'A cheese shop by Alma and Rupp with Vorarlberg mountain cheese straight from the alpine dairy — including the Jersey Blue.'
		},
		description: {
			de: 'Das gemeinsame Lädele von Alma und der Ölmühle Sailer führt Vorarlberger Käsespezialitäten direkt von den Sennern: den ursprungsgeschützten Berg- und Alpkäse g.U. aus den Alma-Bergsennereien, gereift auf Fichtenbrettern. Mit dabei ist der Jersey Blue, ein cremiger Blauschimmelkäse aus Jersey-Kuhmilch, dazu kaltgepresste Öle aus der Sailer Mühle. Der Laden liegt an der Alberlochstraße, nur wenige Minuten vom Bodensee entfernt.',
			en: 'The joint shop by Alma and the Sailer mill carries Vorarlberg cheese specialties straight from the alpine dairies: the protected-origin Bergkäse and Alpkäse g.U. from Alma’s mountain dairies, ripened on spruce boards. Also on the shelf: the Jersey Blue, a creamy blue cheese made from Jersey cow’s milk, plus cold-pressed oils from the Sailer mill. The shop sits on Alberlochstraße, minutes from Lake Constance.'
		},
		tip: {
			de: 'Die Öffnungszeiten sind knapp bemessen und ändern sich gelegentlich — vorher kurz prüfen oder anrufen. Von Bregenz aus ist das Lädele mit Bus oder Rad in wenigen Minuten am Fuß des Pfänders erreicht.',
			en: 'Opening hours are slim and change from time to time — check or call ahead. From Bregenz the shop at the foot of the Pfänder is a few minutes away by bus or bike.'
		},
		openingHours: {
			de: 'Do 13:00–19:00, Fr 8:00–19:00, Sa 8:00–12:00 (Angabe von 2014 — vorher prüfen)',
			en: 'Thu 1–7pm, Fri 8am–7pm, Sat 8am–noon (as of 2014 — check ahead)'
		},
		url: 'https://www.alma.at'
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
		categories: ['culinary'],
		duration: ['short'],
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
			de: 'Es gibt keinen Hofladen — Besuche nur nach Voranmeldung. Die Produkte sind in über 50 Geschäften rund um den Bodensee und online erhältlich; vom Bahnhof Friedrichshafen Hafen sind es wenige Kilometer mit dem Rad.',
			en: 'There is no farm shop — visits by appointment only. The products are stocked in more than 50 shops around Lake Constance and online; from Friedrichshafen Hafen station it is a few kilometres by bike.'
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
		categories: ['culinary'],
		duration: ['short'],
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
		}
	},
	{
		id: 'kleines-cafe',
		coordinates: [47.5463, 9.6883],
		categories: ['culinary'],
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
		categories: ['culinary'],
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
		categories: ['culinary'],
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
		categories: ['culinary'],
		duration: ['short'],
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
		categories: ['culinary'],
		duration: ['short'],
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
		categories: ['culinary'],
		duration: ['short'],
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
		categories: ['culinary'],
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
		}
	},
	{
		id: 'landmetzgerei-schaedler-oberlangnau',
		coordinates: [47.6316, 9.6592],
		categories: ['culinary'],
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
		url: 'https://www.degerseestube.de/'
	},
	{
		id: 'weingut-kress-ueberlingen',
		coordinates: [47.7606, 9.1871],
		categories: ['culinary'],
		duration: ['short'],
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
			de: 'In der Vinothek dienstags bis freitags 9–12:30 und 14–18 Uhr, samstags 10–13 Uhr geöffnet. Im Juni und Juli freitags ab 18 Uhr die Besenwirtschaft „Viertel vor Kress“ — vorher anrufen (+49 7551 65855).',
			en: 'The vinotheque is open Tuesday to Friday 9am–12:30pm and 2–6pm, Saturday 10am–1pm. In June and July the “Viertel vor Kress” wine bar opens on Fridays from 6pm — call ahead (+49 7551 65855).'
		},
		openingHours: {
			de: 'Di–Fr 09:00–12:30 & 14:00–18:00, Sa 10:00–13:00, Mo/So/Feiertage geschlossen',
			en: 'Tue–Fri 9am–12:30pm & 2–6pm, Sat 10am–1pm, closed Mon/Sun/holidays'
		},
		url: 'https://www.weingut-kress.de/'
	}
];
