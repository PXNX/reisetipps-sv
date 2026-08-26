export const travelCategories = ["culture", "nature", "culinary", "history", "technology"] as const;

export type TravelCategory = (typeof travelCategories)[number];
export type TravelTipKind = "event" | "location";

export type TravelTipView = {
  id: number;
  kind: TravelTipKind;
  title: string;
  description: string;
  location: string;
  externalUrl: string;
  categories: TravelCategory[];
  startsAt: Date | null;
  endsAt: Date | null;
  openingHours: string | null;
  imageKey: string | null;
  imageUrl: string | null;
};

export function arrangeTravelTips(tips: TravelTipView[], currentTime: Date) {
  const currentEvents = tips
    .filter((tip) => tip.kind === "event" && (!tip.endsAt || tip.endsAt >= currentTime))
    .sort((a, b) => (a.startsAt?.getTime() ?? 0) - (b.startsAt?.getTime() ?? 0))
    .slice(0, 2);

  const locations = tips
    .filter((tip) => tip.kind === "location")
    .sort((a, b) => a.title.localeCompare(b.title, "de"));

  return { currentEvents, locations };
}
