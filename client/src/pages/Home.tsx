import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  MoveUpRight,
  Sparkles,
} from "lucide-react";

/**
 * STYLE REMINDER — Alpine Field Notes:
 * A dark, high-clarity Bodensee field guide with editorial asymmetry, lake-line markers,
 * information-first cards, Signal Water blue, and restrained warm-light accents.
 */

type Kind = "event" | "place";

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
  featured?: boolean;
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
  },
  {
    id: "zurwies",
    kind: "place",
    status: "besuchbar",
    month: "GANZ",
    day: "JÄHRIG",
    range: "Mo–Fr 08:30–13:00 · Sa 08:30–12:00",
    title: "Käserei Zurwies",
    description:
      "Bio-Weichkäse aus Heumilch, ein offener Besuchergang und ein Käseladen für den Umweg ins Allgäu.",
    location: "Zurwies 11 · 88239 Wangen im Allgäu",
    href: "https://www.zurwies.com/",
    source: "Käserei Zurwies",
    image: "/manus-storage/cheesemaker-bodensee_2376f594.jpg",
  },
];

const filters: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "Alles" },
  { id: "event", label: "Termine" },
  { id: "place", label: "Orte" },
];

function DateTile({ item, large = false }: { item: GuideItem; large?: boolean }) {
  return (
    <div className={`date-tile ${large ? "date-tile--large" : ""}`} aria-label={item.range}>
      <span>{item.month}</span>
      <strong>{item.day}</strong>
    </div>
  );
}

function ItemCard({ item, index }: { item: GuideItem; index: number }) {
  const isPlace = item.kind === "place";

  return (
    <article className={`listing-card listing-card--${item.kind}`} style={{ animationDelay: `${index * 45}ms` }}>
      {item.image ? (
        <div className="listing-card__image-wrap">
          <img className="listing-card__image" src={item.image} alt="" />
          <div className="listing-card__image-shade" />
          <span className="image-kind-label">{isPlace ? "ORT" : "KINO"}</span>
        </div>
      ) : (
        <div className="listing-card__wash" aria-hidden="true">
          <span className="wash-orbit wash-orbit--one" />
          <span className="wash-orbit wash-orbit--two" />
          <span className="wash-coordinate">47° 32′ N</span>
        </div>
      )}
      <div className="listing-card__body">
        <div className="listing-card__topline">
          <span className="status-pill">{item.status}</span>
          <DateTile item={item} />
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="listing-card__meta">
          <span><MapPin size={14} strokeWidth={1.8} /> {item.location}</span>
          <span><Clock3 size={14} strokeWidth={1.8} /> {item.range}</span>
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
  const [activeFilter, setActiveFilter] = useState<"all" | Kind>("all");
  const featured = guideItems.find((item) => item.featured) as GuideItem;
  const filteredItems = useMemo(
    () => guideItems.filter((item) => !item.featured && (activeFilter === "all" || item.kind === activeFilter)),
    [activeFilter],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-[#f5f0e8]">
      <div className="site-grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#anfang" aria-label="reisetipps.sv Startseite">
          <img src="/manus-storage/reisetipps-harbour-signal_be27078a.png" alt="" />
          <span>reisetipps<i>.sv</i></span>
        </a>
        <nav className="site-nav" aria-label="Seitennavigation">
          <a href="#auswahl">Auswahl</a>
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

        <section className="guide-section" id="auswahl" aria-labelledby="guide-title">
          <div className="guide-section__header">
            <div>
              <span className="section-kicker">KURZE WEGE, LANGE ABENDE</span>
              <h2 id="guide-title">Was am See ansteht.</h2>
            </div>
            <div className="filter-bar" aria-label="Inhalte filtern">
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
          <div className="guide-section__subline">
            <span><CalendarDays size={15} /> Auswahl aus dem Spätsommer 2026</span>
            <span>{filteredItems.length.toString().padStart(2, "0")} Hinweise</span>
          </div>
          <div className="listing-grid">
            {filteredItems.map((item, index) => <ItemCard key={item.id} item={item} index={index} />)}
          </div>
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
          <img src="/manus-storage/reisetipps-harbour-signal_be27078a.png" alt="" />
          <span>reisetipps<i>.sv</i></span>
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
