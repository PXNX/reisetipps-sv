import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  MoveUpRight,
  Search,
  Sparkles,
  TrainFront,
  X,
} from "lucide-react";

/**
 * STYLE REMINDER — Alpine Field Notes:
 * A dark, high-clarity Bodensee field guide with editorial asymmetry, lake-line markers,
 * information-first cards, Signal Water blue, and restrained warm-light accents.
 */

type Kind = "event" | "place";
type Category = "culture" | "nature" | "culinary" | "history";

type GuideItem = {
  id: string;
  kind: Kind;
  status: string;
  month: string;
  day: string;
  range: string;
  title: string;
  description: string;
  location: string;
  href: string;
  image?: string;
  source: string;
  categories: Category[];
  openingHours?: string;
  featured?: boolean;
  wide?: boolean;
};

const guideItems: GuideItem[] = [
  {
    id: "hafenfest",
    kind: "event",
    status: "läuft jetzt",
    month: "AUG",
    day: "23—30",
    range: "23. — 30. August 2026",
    title: "Bregenzer Hafenfest",
    description:
      "Eine Woche Uferkante: Musik, Kulinarik und ein spätsommerlicher Treffpunkt direkt am Hafen.",
    location: "Hafen Bregenz · Österreich",
    href: "https://www.bodensee.eu/de/was-erleben/bodensee-highlights/top-veranstaltungen",
    source: "Bodensee.eu",
    categories: ["culture", "culinary"],
    featured: true,
  },
  {
    id: "wiiprob",
    kind: "event",
    status: "diese Woche",
    month: "AUG",
    day: "27—29",
    range: "27. — 29. August 2026",
    title: "Schafuuser Wiiprob",
    description:
      "Über dreissig Weinbaubetriebe öffnen ihre Gläser im Kreuzgang zu Allerheiligen — eine gute Ausrede für den Abstecher nach Schaffhausen.",
    location: "Kloster Allerheiligen · Schaffhausen",
    href: "https://www.bodensee.eu/de/was-erleben/bodensee-highlights/top-veranstaltungen",
    source: "Bodensee.eu",
    categories: ["culinary", "culture"],
  },
  {
    id: "home-garden",
    kind: "event",
    status: "vormerken",
    month: "SEP",
    day: "10—13",
    range: "10. — 13. September 2026",
    title: "HOME & GARDEN",
    description:
      "Im Schlosspark Salem treffen Gestaltung, Gartenkultur und feine regionale Entdeckungen aufeinander.",
    location: "Kloster & Schloss Salem · DE",
    href: "https://www.bodensee.eu/de/was-erleben/bodensee-highlights/top-veranstaltungen",
    source: "Bodensee.eu",
    categories: ["nature", "culture"],
  },
  {
    id: "open-air-kino",
    kind: "event",
    status: "Saisonmoment 2026",
    month: "AUG",
    day: "12—21",
    range: "12. — 21. August 2026",
    title: "Open Air Kino Wasserburg",
    description:
      "Große Leinwand, Liegewiese und die Bergwelt im Rücken: Kinoabende im Freibad Aquamarin direkt am See.",
    location: "Freibad Aquamarin · Wasserburg (Bodensee)",
    href: "https://www.wasserburg-bodensee.de/highlights-in-wasserburg/open-air-kino/",
    source: "Wasserburg Bodensee",
    image: "/manus-storage/open-air-kino-wasserburg_327d0769.jpg",
    categories: ["culture", "nature"],
  },
  {
    id: "zurwies",
    kind: "place",
    status: "besuchbar",
    month: "GANZ",
    day: "JÄHRIG",
    range: "Ganzjährig besuchbar",
    title: "Käserei Zurwies",
    description:
      "Bio-Weichkäse aus Heumilch, ein offener Besuchergang und ein Käseladen für den Umweg ins Allgäu.",
    location: "Zurwies 11 · 88239 Wangen im Allgäu",
    href: "https://www.zurwies.com/",
    source: "Käserei Zurwies",
    image: "/manus-storage/cheesemaker-bodensee_2376f594.jpg",
    categories: ["culinary"],
    openingHours: "Mo–Fr 08:30–13:00 · Sa 08:30–12:00",
  },
  {
    id: "stein-am-rhein",
    kind: "event",
    status: "Winter vormerken",
    month: "DEZ",
    day: "02—02",
    range: "2. Dez. 2026 — 2. Jan. 2027",
    title: "Märlistadt Stein am Rhein",
    description:
      "Beleuchtete Marktstände, Altstadt und Kloster St. Georgen machen aus einem Winterabend eine kleine Zeitreise.",
    location: "Altstadt & Kloster St. Georgen · Stein am Rhein",
    href: "https://www.bodensee.eu/de/was-erleben/bodensee-highlights/top-veranstaltungen",
    source: "Bodensee.eu",
    categories: ["history", "culture"],
    wide: true,
  },
];

const filters: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "Alles" },
  { id: "culture", label: "Kultur" },
  { id: "nature", label: "Natur" },
  { id: "culinary", label: "Kulinarik" },
  { id: "history", label: "Geschichte" },
];

const categoryLabels: Record<Category, string> = {
  culture: "Kultur",
  nature: "Natur",
  culinary: "Kulinarik",
  history: "Geschichte",
};

function DateTile({ item, large = false }: { item: GuideItem; large?: boolean }) {
  const isPlace = item.kind === "place";
  return (
    <div className={`date-tile ${large ? "date-tile--large" : ""} ${isPlace ? "date-tile--place" : ""}`} aria-label={isPlace ? item.openingHours : item.range}>
      <span>{isPlace ? "ZEITEN" : item.month}</span>
      <strong>{isPlace ? "MO–SA" : item.day}</strong>
    </div>
  );
}

function ItemCard({ item, index }: { item: GuideItem; index: number }) {
  const isPlace = item.kind === "place";

  return (
    <article className={`listing-card listing-card--${item.kind} ${item.wide ? "listing-card--wide" : ""}`} style={{ animationDelay: `${index * 45}ms` }}>
      {item.image ? (
        <div className="listing-card__image-wrap">
          <img className="listing-card__image" src={item.image} alt="" />
          <div className="listing-card__image-shade" />
          <span className="image-kind-label">{isPlace ? "ORT" : "KINO"}</span>
        </div>
      ) : (
        <div className="listing-card__wash" aria-hidden="true">
          <span className="wash-route-no">ROUTE 09</span>
          <span className="wash-orbit wash-orbit--one" />
          <span className="wash-orbit wash-orbit--two" />
          <span className="wash-coordinate">47° 32′ N</span>
          <span className="wash-route-label">UFERKARTE / BODENSEE</span>
        </div>
      )}
      <div className="listing-card__body">
        <div className="listing-card__topline">
          <span className="status-pill">{item.status}</span>
          <DateTile item={item} />
        </div>
        <h3>{item.title}</h3>
        <div className="category-tags" aria-label="Themen">
          {item.categories.map((category) => <span key={category}>{categoryLabels[category]}</span>)}
        </div>
        <p>{item.description}</p>
        <div className="listing-card__meta">
          <span><MapPin size={14} strokeWidth={1.8} /> {item.location}</span>
          <span><Clock3 size={14} strokeWidth={1.8} /> {isPlace ? item.openingHours : item.range}</span>
        </div>
        <a className="listing-card__link" href={item.href} target="_blank" rel="noreferrer">
          {isPlace ? "Ort ansehen" : "Details ansehen"}
          <ArrowUpRight size={16} strokeWidth={1.8} />
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"all" | Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const featured = guideItems.find((item) => item.featured) as GuideItem;
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase("de-DE");
  const shouldHideFeaturedFromResults = activeFilter === "all" && normalizedSearch.length === 0;
  const filteredItems = useMemo(
    () => guideItems.filter((item) => {
      if (shouldHideFeaturedFromResults && item.featured) return false;
      const matchesCategory = activeFilter === "all" || item.categories.includes(activeFilter);
      const searchableText = [item.title, item.description, item.location, ...item.categories.map((category) => categoryLabels[category])]
        .join(" ")
        .toLocaleLowerCase("de-DE");
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch));
    }),
    [activeFilter, normalizedSearch, shouldHideFeaturedFromResults],
  );
  const eventItems = filteredItems.filter((item) => item.kind === "event");
  const placeItems = filteredItems.filter((item) => item.kind === "place");
  const hasNoResults = eventItems.length === 0 && placeItems.length === 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-[#f5f0e8]">
      <div className="site-grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#anfang" aria-label="reisetipps.sv Startseite">
          <span className="brand__signal" aria-hidden="true">
            <img src="/manus-storage/reisetipps-harbour-signal_be27078a.png" alt="" />
            <span className="brand__signal-ring" />
          </span>
          <span className="brand__wordmark"><b>reisetipps</b><i>.sv</i></span>
        </a>
        <nav className="site-nav" aria-label="Seitennavigation">
          <a href="#auswahl">Auswahl</a>
          <a href="#idee">Warum</a>
          <a href="#ort">Ort der Woche</a>
          <a href="#hinweis">Hinweis</a>
        </nav>
        <a className="header-status" href="#auswahl">
          <span className="header-status__dot" />
          Ausgabe 08.26
        </a>
      </header>

      <main id="anfang">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-section__map-markers" aria-hidden="true">
            <span>WASSERBURG</span>
            <span>BREGENZ</span>
            <span>SALEM</span>
          </div>
          <div className="hero-section__copy">
            <div className="eyebrow"><Sparkles size={14} /> Bodensee, handverlesen</div>
            <h1 id="hero-title">Der See kann<br /><em>auch leise.</em></h1>
            <p>
              Drei Länder, eine Uferlinie und eine Auswahl für Abende, die nach Meer aussehen — nur mit Alpen im Blick.
            </p>
            <a className="quiet-link" href="#auswahl">Zur aktuellen Auswahl <ArrowDownRight size={17} /></a>
          </div>
          <figure className="hero-section__image-wrap">
            <img
              className="hero-section__image"
              src="/manus-storage/bodensee-evening-hero_717d937c.jpg"
              alt="Sommerabend am Bodensee mit stiller Wasserfläche und Alpen am Horizont"
            />
            <figcaption>47.596° N · 9.572° E</figcaption>
          </figure>
          <div className="hero-section__bottom-note">
            <span>Feste Momentaufnahme</span>
            <span>Stand 26. August 2026</span>
          </div>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="section-rail" aria-hidden="true"><span /></div>
          <div className="section-intro">
            <span className="section-kicker">JETZT AM UFER</span>
            <h2 id="featured-title">Ein guter Grund,<br />den Tag zu verlängern.</h2>
            <p>Der aktuelle Haupttipp für diese Ausgabe. Öffnungszeiten und Programm bitte vor dem Aufbruch noch einmal beim Veranstalter prüfen.</p>
          </div>
          <article className="feature-card">
            <div className="feature-card__backdrop" aria-hidden="true">
              <span className="feature-card__ripple feature-card__ripple--a" />
              <span className="feature-card__ripple feature-card__ripple--b" />
              <span className="feature-card__coordinates">BREGENZ / 47.503° N</span>
            </div>
            <div className="feature-card__content">
              <div className="feature-card__context">
                <span>{featured.status}</span>
                <span>Bodensee · AT</span>
              </div>
              <DateTile item={featured} large />
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <div className="feature-card__footer">
                <span><MapPin size={15} /> {featured.location}</span>
                <a href={featured.href} target="_blank" rel="noreferrer">Programm <MoveUpRight size={17} /></a>
              </div>
            </div>
          </article>
        </section>

        <section className="origin-section" id="idee" aria-labelledby="origin-title">
          <div className="origin-section__marker" aria-hidden="true"><TrainFront size={22} /></div>
          <div className="origin-section__title">
            <span className="section-kicker">WARUM DIESE SEITE?</span>
            <h2 id="origin-title">Empfehlungen, die<br /><em>mitfahren.</em></h2>
          </div>
          <div className="origin-section__copy">
            <p>
              Ich habe reisetipps.sv gemacht, weil so viele Zuggespräche irgendwann bei derselben Frage landen: <strong>„Kennst du einen schönen Ort?“</strong>
            </p>
            <p>
              Zwischen Fenstern, Waggons und einem Kaffee sammle ich diese kleinen Empfehlungen schon lange. Hier bekommen sie einen festen Platz — zum Weitererzählen, Vormerken und Losfahren.
            </p>
          </div>
        </section>

        <section className="guide-section" id="auswahl" aria-labelledby="guide-title">
          <div className="guide-section__header">
            <div>
              <span className="section-kicker">TERMINE MIT ZEITFENSTER</span>
              <h2 id="guide-title">Was am See ansteht.</h2>
            </div>
            <div className="guide-section__actions">
              <label className="search-field">
                <Search size={16} strokeWidth={1.8} />
                <span className="sr-only">Reisetipps durchsuchen</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Ort, Thema oder Stichwort"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} aria-label="Suche löschen">
                    <X size={15} strokeWidth={2} />
                  </button>
                )}
              </label>
              <div className="filter-bar" aria-label="Inhalte nach Thema filtern">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={activeFilter === filter.id ? "is-active" : ""}
                    aria-pressed={activeFilter === filter.id}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="guide-section__subline">
            <span><CalendarDays size={15} /> Auswahl aus dem Spätsommer 2026</span>
            <span>{eventItems.length.toString().padStart(2, "0")} Veranstaltungen</span>
          </div>
          <div className="listing-grid">
            {eventItems.map((item, index) => <ItemCard key={item.id} item={item} index={index} />)}
          </div>
          {placeItems.length > 0 && (
            <section className="locations-section" aria-labelledby="locations-title">
              <div className="locations-section__heading">
                <div>
                  <span className="section-kicker">ORTE OHNE LAUFZEIT</span>
                  <h3 id="locations-title">Orte, die bleiben.</h3>
                </div>
                <p>Keine Tickets, kein Enddatum. Hier zählt nur: Wann ist die Tür offen?</p>
              </div>
              <div className="listing-grid listing-grid--locations">
                {placeItems.map((item, index) => <ItemCard key={item.id} item={item} index={index} />)}
              </div>
            </section>
          )}
          {hasNoResults && (
            <div className="empty-results">
              <Search size={21} strokeWidth={1.6} />
              <p>Kein Tipp passt gerade zu dieser Suche.</p>
              <button type="button" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}>Alles zeigen</button>
            </div>
          )}
        </section>

        <section className="place-feature" id="ort" aria-labelledby="place-title">
          <div className="place-feature__headline">
            <span className="section-kicker">ORT DER WOCHE</span>
            <h2 id="place-title">Für den<br /><em>kleinen Umweg.</em></h2>
          </div>
          <div className="place-feature__rule" aria-hidden="true"><span /></div>
          <div className="place-feature__copy">
            <span className="place-feature__number">05 / 2026</span>
            <p>Der beste Fund liegt nicht immer direkt am Wasser. Zurwies nimmt sich Zeit für Weichkäse aus Bio-Heumilch — und Besucherinnen und Besucher dürfen beim Käsen zusehen.</p>
            <a href="https://www.zurwies.com/" target="_blank" rel="noreferrer">Besuch planen <ChevronRight size={16} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="hinweis">
        <div className="site-footer__brand">
          <span className="brand__signal" aria-hidden="true">
            <img src="/manus-storage/reisetipps-harbour-signal_be27078a.png" alt="" />
            <span className="brand__signal-ring" />
          </span>
          <span className="brand__wordmark"><b>reisetipps</b><i>.sv</i></span>
        </div>
        <p>Eine feste Reiseauswahl für die Bodenseeregion. Zeiten, Eintritt und Durchführbarkeit können sich ändern.</p>
        <div className="site-footer__meta">
          <span>Recherche: Veranstalter & regionale Tourismuspartner</span>
          <span>Keine Live-Daten · Ausgabe 08.26</span>
        </div>
      </footer>
    </div>
  );
}
