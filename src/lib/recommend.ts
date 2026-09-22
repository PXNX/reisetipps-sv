import { locations, type Category, type Duration, type Location } from './data/locations';
import { haversineDistanceKm, type Coordinates } from './geo';

export interface RecommendFilters {
	/** Empty array matches any category. */
	categories: Category[];
	/** `null` matches any duration. */
	duration: Duration | null;
	/** User-provided GPS position; `null` when unknown. Used to prefer nearby locations, not as a hard filter. */
	origin: Coordinates | null;
}

/** Returns `null` when the location is excluded by a hard filter, otherwise a relevance score. */
export function scoreLocation(location: Location, filters: RecommendFilters): number | null {
	if (filters.duration && !location.duration.includes(filters.duration)) return null;
	if (
		filters.categories.length > 0 &&
		!location.categories.some((c) => filters.categories.includes(c))
	) {
		return null;
	}

	let score = 0;
	if (filters.categories.length > 0) {
		score += location.categories.filter((c) => filters.categories.includes(c)).length;
	}
	return score;
}

function byDistanceTo(origin: Coordinates | null) {
	return (a: Location, b: Location) => {
		if (!origin) return 0;
		return haversineDistanceKm(origin, a.coordinates) - haversineDistanceKm(origin, b.coordinates);
	};
}

export function findMatches(filters: RecommendFilters): Location[] {
	return locations
		.map((location) => ({ location, score: scoreLocation(location, filters) }))
		.filter((entry): entry is { location: Location; score: number } => entry.score !== null)
		.sort((a, b) => b.score - a.score || byDistanceTo(filters.origin)(a.location, b.location))
		.map((entry) => entry.location);
}

/**
 * Picks one location from the best-scoring tier, skipping ids already shown so
 * repeated "try again" taps cycle through the pool before repeating any pick.
 * When a GPS origin is known, the tier is narrowed down to the closest few
 * locations first so recommendations stay realistically reachable.
 */
export function pickRecommendation(
	filters: RecommendFilters,
	excludeIds: string[] = []
): Location | null {
	const scored = locations
		.map((location) => ({ location, score: scoreLocation(location, filters) }))
		.filter((entry): entry is { location: Location; score: number } => entry.score !== null);

	if (scored.length === 0) return null;

	const topScore = Math.max(...scored.map((entry) => entry.score));
	let topTier = scored.filter((entry) => entry.score === topScore).map((entry) => entry.location);

	if (filters.origin) {
		topTier = [...topTier].sort(byDistanceTo(filters.origin));
		const closestCount = Math.max(1, Math.min(topTier.length, 3));
		topTier = topTier.slice(0, closestCount);
	}

	const unseen = topTier.filter((location) => !excludeIds.includes(location.id));
	const pool = unseen.length > 0 ? unseen : topTier;

	return pool[Math.floor(Math.random() * pool.length)];
}
