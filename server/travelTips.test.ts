import { describe, expect, it } from "vitest";
import { arrangeTravelTips, type TravelTipView } from "../shared/travelTips";

const now = new Date("2026-08-26T12:00:00.000Z");

const baseTip = {
  description: "Kurz und konkret.",
  location: "Bodensee",
  externalUrl: "https://example.com",
  categories: ["culture"] as const,
  openingHours: null,
  imageKey: null,
  imageUrl: null,
};

describe("arrangeTravelTips", () => {
  it("returns no more than two current or future events in start-date order", () => {
    const tips: TravelTipView[] = [
      { ...baseTip, id: 1, kind: "event", title: "Vergangen", startsAt: new Date("2026-08-01"), endsAt: new Date("2026-08-02") },
      { ...baseTip, id: 2, kind: "event", title: "Zweiter", startsAt: new Date("2026-08-27"), endsAt: new Date("2026-08-29") },
      { ...baseTip, id: 3, kind: "event", title: "Erster", startsAt: new Date("2026-08-23"), endsAt: new Date("2026-08-30") },
      { ...baseTip, id: 4, kind: "event", title: "Dritter", startsAt: new Date("2026-09-01"), endsAt: new Date("2026-09-02") },
    ];

    expect(arrangeTravelTips(tips, now).currentEvents.map((tip) => tip.title)).toEqual(["Erster", "Zweiter"]);
  });

  it("keeps permanent locations separate from the event list", () => {
    const tips: TravelTipView[] = [
      { ...baseTip, id: 1, kind: "location", title: "Zeppelin Museum", startsAt: null, endsAt: null, openingHours: "09:00–17:00" },
      { ...baseTip, id: 2, kind: "location", title: "Käserei Zurwies", startsAt: null, endsAt: null, openingHours: "08:30–13:00" },
    ];

    expect(arrangeTravelTips(tips, now).locations.map((tip) => tip.title)).toEqual(["Käserei Zurwies", "Zeppelin Museum"]);
  });
});
