import { describe, expect, it } from 'vitest';
import { findMatches, pickRecommendation, type RecommendFilters } from './recommend';
import { locations } from './data/locations';
import { haversineDistanceKm } from './geo';

const noFilters: RecommendFilters = { categories: [], duration: null, origin: null };

describe('findMatches', () => {
	it('returns every location when no filters are set', () => {
		expect(findMatches(noFilters)).toHaveLength(locations.length);
	});

	it('excludes locations that do not support the requested duration', () => {
		const matches = findMatches({ categories: [], duration: 'short', origin: null });
		expect(matches.every((location) => location.duration.includes('short'))).toBe(true);
		expect(matches.length).toBeGreaterThan(0);
		expect(matches.length).toBeLessThan(locations.length);
	});

	it('excludes locations with no overlapping category', () => {
		const matches = findMatches({ categories: ['technology'], duration: null, origin: null });
		expect(matches.every((location) => location.categories.includes('technology'))).toBe(true);
	});

	it('sorts same-score matches by distance to the given origin', () => {
		const konstanz = locations.find((l) => l.id === 'konstanz-altstadt')!;
		const matches = findMatches({ categories: [], duration: null, origin: konstanz.coordinates });
		const distances = matches.map((l) => haversineDistanceKm(konstanz.coordinates, l.coordinates));
		expect([...distances].sort((a, b) => a - b)).toEqual(distances);
	});
});

describe('pickRecommendation', () => {
	it('returns null when filters match nothing', () => {
		const result = pickRecommendation({
			categories: ['technology'],
			duration: 'short',
			origin: null
		});
		expect(result).toBeNull();
	});

	it('only returns locations matching the filters', () => {
		const filters: RecommendFilters = { categories: ['nature'], duration: null, origin: null };
		for (let i = 0; i < 20; i++) {
			const result = pickRecommendation(filters);
			expect(result?.categories).toContain('nature');
		}
	});

	it('avoids repeating an excluded id while alternatives remain', () => {
		const filters: RecommendFilters = { categories: ['culture'], duration: null, origin: null };
		const pool = findMatches(filters);
		const excludeIds = pool.slice(0, pool.length - 1).map((location) => location.id);
		const result = pickRecommendation(filters, excludeIds);
		expect(result?.id).toBe(pool[pool.length - 1]?.id);
	});

	it('prefers locations closest to the given origin', () => {
		const mainau = locations.find((l) => l.id === 'mainau')!;
		const filters: RecommendFilters = {
			categories: [],
			duration: null,
			origin: mainau.coordinates
		};
		const results = new Set<string>();
		for (let i = 0; i < 30; i++) {
			const result = pickRecommendation(filters);
			if (result) results.add(result.id);
		}
		const distances = [...results]
			.map((id) => locations.find((l) => l.id === id)!)
			.map((l) => haversineDistanceKm(mainau.coordinates, l.coordinates));
		expect(Math.max(...distances)).toBeLessThan(15);
	});
});
