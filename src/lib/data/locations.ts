export type Category = 'nature' | 'culture' | 'culinary' | 'history' | 'technology';

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
	'Überlingen',
	'Radolfzell',
	'Konstanz'
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
	}
];
