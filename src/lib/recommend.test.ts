import { describe, expect, it } from 'vitest';
import { findMatches, pickRecommendation, type RecommendFilters } from './recommend';
import { locations } from './data/locations';

const noFilters: RecommendFilters = { categories: [], duration: null, station: null };

describe('findMatches', () => {
	it('returns every location when no filters are set', () => {
		expect(findMatches(noFilters)).toHaveLength(locations.length);
	});

	it('excludes locations that do not support the requested duration', () => {
		const matches = findMatches({ categories: [], duration: 'short', station: null });
		expect(matches.every((location) => location.duration.includes('short'))).toBe(true);
		expect(matches.length).toBeGreaterThan(0);
		expect(matches.length).toBeLessThan(locations.length);
	});

	it('excludes locations with no overlapping category', () => {
		const matches = findMatches({ categories: ['technology'], duration: null, station: null });
		expect(matches.every((location) => location.categories.includes('technology'))).toBe(true);
	});

	it('ranks exact station matches above others', () => {
		const matches = findMatches({ categories: [], duration: null, station: 'Bregenz' });
		expect(matches[0]?.nearestStation).toBe('Bregenz');
	});
});

describe('pickRecommendation', () => {
	it('returns null when filters match nothing', () => {
		const result = pickRecommendation({
			categories: ['technology'],
			duration: 'short',
			station: null
		});
		expect(result).toBeNull();
	});

	it('only returns locations matching the filters', () => {
		const filters: RecommendFilters = { categories: ['nature'], duration: null, station: null };
		for (let i = 0; i < 20; i++) {
			const result = pickRecommendation(filters);
			expect(result?.categories).toContain('nature');
		}
	});

	it('avoids repeating an excluded id while alternatives remain', () => {
		const filters: RecommendFilters = { categories: ['culture'], duration: null, station: null };
		const pool = findMatches(filters);
		const excludeIds = pool.slice(0, pool.length - 1).map((location) => location.id);
		const result = pickRecommendation(filters, excludeIds);
		expect(result?.id).toBe(pool[pool.length - 1]?.id);
	});
});
