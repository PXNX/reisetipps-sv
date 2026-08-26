import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Search, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { arrangeTravelTips, travelCategories, type TravelCategory, type TravelTipView } from "@shared/travelTips";

/**
 * STYLE REMINDER — Alpine Field Notes, concise edition:
 * A quiet lake surface, short signals, and matching cards. Events gain only one extra
 * date-range element; places show opening times. Data comes from DATABASE_URL and S3 URLs.
 */

const categoryLabels: Record<TravelCategory, string> = {
  culture: "Kultur",
  nature: "Natur",
  culinary: "Kulinarik",
  history: "Geschichte",
  technology: "Technik",
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" });

function formatRange(tip: TravelTipView) {
  if (!tip.startsAt || !tip.endsAt) return "";
  return `${dateFormatter.format(tip.startsAt)} — ${dateFormatter.format(tip.endsAt)} 2026`;
}

function TipCard({ tip }: { tip: TravelTipView }) {
  const isEvent = tip.kind === "event";
  const firstCategory = tip.categories[0] ? categoryLabels[tip.categories[0]] : "Tipp";

  return (
    <article className="signal-card">
      {tip.imageUrl ? (
        <div className="signal-card__image">
          <img src={tip.imageUrl} alt={tip.title} />
        </div>
      ) : (
        <div className="signal-card__plate" aria-hidden="true">
          <span>47° 34′ N</span>
          <i />
          <b>ROUTE 09</b>
        </div>
      )}
      <div className="signal-card__body">
        <div className="signal-card__topline">
          <span className={`signal-card__kind ${isEvent ? "signal-card__kind--event" : ""}`}>
            {isEvent ? "VERANSTALTUNG" : "ORT"}
          </span>
          {isEvent ? (
            <span className="signal-card__range signal-card__range--event"><CalendarDays size={13} /><span><small>VON — BIS</small><strong>{formatRange(tip)}</strong></span></span>
          ) : (
            <span className="signal-card__range"><Clock3 size={13} /> {tip.openingHours}</span>
          )}
        </div>
        <h3>{tip.title}</h3>
        <p>{tip.description}</p>
        <div className="signal-card__meta">
          <span><MapPin size={14} /> {tip.location}</span>
          <span className="signal-card__topic">{firstCategory}</span>
        </div>
        <a href={tip.externalUrl} target="_blank" rel="noreferrer">
          {isEvent ? "Programm" : "Details"} <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<TravelCategory | "all">("all");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = trpc.travelTips.list.useQuery();

  const { events, locations } = useMemo(() => {
    const visibleTips = (data ?? []).filter((tip) => {
      const categoryMatch = activeCategory === "all" || tip.categories.includes(activeCategory);
      const term = search.trim().toLocaleLowerCase("de-DE");
      const text = `${tip.title} ${tip.description} ${tip.location} ${tip.categories.join(" ")}`.toLocaleLowerCase("de-DE");
      return categoryMatch && (!term || text.includes(term));
    });
    const arranged = arrangeTravelTips(visibleTips, new Date());
    return { events: arranged.currentEvents, locations: arranged.locations };
  }, [activeCategory, data, search]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-[#f5f0e8]">
      <header className="site-header">
        <a className="brand" href="#start" aria-label="reisetipps.sv Startseite">
          <span className="brand__signal" aria-hidden="true"><img src="/manus-storage/reisetipps-harbour-signal_be27078a.png" alt="" /><span className="brand__signal-ring" /></span>
          <span className="brand__wordmark"><b>reisetipps</b><i>.sv</i></span>
        </a>
        <nav className="site-nav" aria-label="Seitennavigation"><a href="#termine">Termine</a><a href="#orte">Orte</a></nav>
        <span className="header-status"><span className="header-status__dot" /> Auswahl 08.26</span>
      </header>

      <main id="start">
        <section className="compact-hero" aria-labelledby="hero-title">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> Bodensee, weiterempfohlen</span>
            <h1 id="hero-title">Gute Orte.<br /><em>Gute Gründe.</em></h1>
            <p>Entstanden aus Zuggesprächen und kleinen Umwegen.</p>
          </div>
          <img src="/manus-storage/bodensee-evening-hero_717d937c.jpg" alt="Abendstimmung am Bodensee" />
        </section>

        <section className="tip-section" id="termine" aria-labelledby="events-title">
          <div className="tip-section__head">
            <div><span className="section-kicker">AB HEUTE · DATUMSREIHENFOLGE</span><h2 id="events-title">Die nächsten zwei.</h2></div>
            <label className="compact-search">
              <Search size={15} /><span className="sr-only">Suche</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Suchen" />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Suche löschen"><X size={14} /></button>}
            </label>
          </div>
          <div className="category-strip" aria-label="Themen filtern">
            <button type="button" className={activeCategory === "all" ? "is-active" : ""} onClick={() => setActiveCategory("all")}>Alles</button>
            {travelCategories.map((category) => <button type="button" key={category} className={activeCategory === category ? "is-active" : ""} onClick={() => setActiveCategory(category)}>{categoryLabels[category]}</button>)}
          </div>
          {isLoading && <p className="data-state">Auswahl wird geladen.</p>}
          {error && <p className="data-state">Die Auswahl ist gerade nicht erreichbar.</p>}
          {!isLoading && !error && <div className="signal-grid">{events.map((tip) => <TipCard key={tip.id} tip={tip} />)}</div>}
        </section>

        <section className="tip-section tip-section--locations" id="orte" aria-labelledby="locations-title">
          <div className="tip-section__head"><div><span className="section-kicker">OHNE LAUFZEIT · ÖFFNUNGSZEITEN</span><h2 id="locations-title">Orte, die bleiben.</h2></div></div>
          {!isLoading && !error && <div className="signal-grid">{locations.map((tip) => <TipCard key={tip.id} tip={tip} />)}</div>}
          {!isLoading && !error && events.length === 0 && locations.length === 0 && <p className="data-state">Kein Treffer für diese Auswahl.</p>}
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__brand"><span className="brand__signal" aria-hidden="true"><img src="/manus-storage/reisetipps-harbour-signal_be27078a.png" alt="" /><span className="brand__signal-ring" /></span><span className="brand__wordmark"><b>reisetipps</b><i>.sv</i></span></div>
        <p>Feste Auswahl. Daten und Bilder werden über die Projekt-Datenbank und den verwalteten Speicher bereitgestellt.</p>
      </footer>
    </div>
  );
}
