import { describe, expect, it } from 'vitest';
import { locations } from './data/locations';
import { matchesQuery, normalizeText } from './search';

function namesFor(query: string): string[] {
	return locations
		.filter((location) => matchesQuery(location, query, 'de'))
		.map((location) => location.name.de);
}

describe('place search', () => {
	it('normalises umlauts and sharp s', () => {
		expect(normalizeText('Käse, Straße & Weißensberg')).toBe('kase strasse weissensberg');
	});

	it('finds a place through its English keyword', () => {
		expect(namesFor('cheese')).toContain('Alma Käslädele Hörbranz');
	});

	it('finds a place through a local everyday word', () => {
		expect(namesFor('Aussicht')).toContain('Weißensberger Halde');
	});

	it('tolerates a small typo', () => {
		expect(namesFor('maniau')).toContain('Insel Mainau');
	});

	it('matches every word of a longer query', () => {
		const matches = namesFor('Käse Hörbranz');
		expect(matches).toContain('Alma Käslädele Hörbranz');
		expect(matches.length).toBeLessThan(10);
	});
});
