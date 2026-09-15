import { locations, type Category, type Duration, type Location } from './data/locations';

export interface RecommendFilters {
	/** Empty array matches any category. */
	categories: Category[];
	/** `null` matches any duration. */
	duration: Duration | null;
	/** `null` matches any station; an exact match is scored higher. */
	station: string | null;
}

/** Returns `null` when the location is excluded by a hard filter, otherwise a relevance score. */
export function scoreLocation(location: Location, filters: RecommendFilters): number | null {
	if (filters.duration && !location.duration.includes(filters.duration)) return null;
	if (filters.categories.length > 0 && !location.categories.some((c) => filters.categories.includes(c))) {
		return null;
	}

	let score = 0;
	if (filters.categories.length > 0) {
		score += location.categories.filter((c) => filters.categories.includes(c)).length;
	}
	if (filters.station && location.nearestStation === filters.station) {
		score += 5;
	}
	return score;
}

export function findMatches(filters: RecommendFilters): Location[] {
	return locations
		.map((location) => ({ location, score: scoreLocation(location, filters) }))
		.filter((entry): entry is { location: Location; score: number } => entry.score !== null)
		.sort((a, b) => b.score - a.score)
		.map((entry) => entry.location);
}

/**
 * Picks one location from the best-scoring tier, skipping ids already shown so
 * repeated "try again" taps cycle through the pool before repeating any pick.
 */
export function pickRecommendation(filters: RecommendFilters, excludeIds: string[] = []): Location | null {
	const scored = locations
		.map((location) => ({ location, score: scoreLocation(location, filters) }))
		.filter((entry): entry is { location: Location; score: number } => entry.score !== null);

	if (scored.length === 0) return null;

	const topScore = Math.max(...scored.map((entry) => entry.score));
	const topTier = scored.filter((entry) => entry.score === topScore).map((entry) => entry.location);

	const unseen = topTier.filter((location) => !excludeIds.includes(location.id));
	const pool = unseen.length > 0 ? unseen : topTier;

	return pool[Math.floor(Math.random() * pool.length)];
}
