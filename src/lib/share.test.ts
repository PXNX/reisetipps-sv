import { describe, expect, it } from 'vitest';
import { parseShareState, sharePath } from './share';

describe('shareable links', () => {
	it('restores a tour, its travel mode and the filters', () => {
		const state = parseShareState(
			new URLSearchParams('tour=mainau,unknown-id&mode=bike&cat=nature,culinary&dur=short&q=Käse')
		);
		expect(state.tour).toEqual(['mainau']);
		expect(state.mode).toBe('bike');
		expect(state.categories).toEqual(['nature', 'culinary']);
		expect(state.duration).toBe('short');
		expect(state.query).toBe('Käse');
	});

	it('drops values it does not recognise', () => {
		const state = parseShareState(
			new URLSearchParams('tour=nope&cat=not-a-category&dur=forever&mode=rocket&focus=gone')
		);
		expect(state.tour).toEqual([]);
		expect(state.categories).toEqual([]);
		expect(state.duration).toBeUndefined();
		expect(state.mode).toBeUndefined();
		expect(state.focus).toBeNull();
	});

	it('round-trips a state through the URL', () => {
		const state = {
			tour: ['mainau'],
			mode: 'walk' as const,
			categories: ['nature' as const],
			duration: 'medium' as const
		};
		const parsed = parseShareState(new URLSearchParams(sharePath(state).split('?')[1]));
		expect(parsed.tour).toEqual(state.tour);
		expect(parsed.mode).toBe(state.mode);
		expect(parsed.categories).toEqual(state.categories);
		expect(parsed.duration).toBe(state.duration);
	});

	it('keeps an empty link clean', () => {
		expect(sharePath({ categories: [], duration: null, query: '  ' })).toBe('/');
	});
});
