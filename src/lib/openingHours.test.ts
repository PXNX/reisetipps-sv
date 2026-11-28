import { describe, expect, it } from 'vitest';
import { openingStatus, type OpenStatus } from './openingHours';

const hours = (de: string) => ({ de, en: de });

function statusOn(de: string, iso: string): OpenStatus {
	return openingStatus(hours(de), new Date(iso));
}

describe('open now', () => {
	// 2026-11-28 is a Saturday; Berlin is UTC+1 in November.
	it('reports open during daily hours', () => {
		expect(statusOn('Mo–Su 10:00–21:00', '2026-11-28T12:00:00Z')).toBe('open');
	});

	it('reports closed after daily hours', () => {
		expect(statusOn('Mo–Su 10:00–21:00', '2026-11-28T20:30:00Z')).toBe('closed');
	});

	it('respects a closed day', () => {
		// Sunday, 2026-11-29.
		expect(statusOn('Mo–Sa 10:00–18:00, So geschlossen', '2026-11-29T12:00:00Z')).toBe('closed');
	});

	it('understands a lunch break', () => {
		// Friday, 2026-11-27, 13:00 in Berlin.
		expect(statusOn('Di–Fr 7:00–12:30 & 14:00–18:00', '2026-11-27T12:00:00Z')).toBe('closed');
	});

	it('stays quiet when the weekday does not match', () => {
		// Saturday is not covered by Mo–Fr.
		expect(statusOn('Mo–Fr 9:00–18:00', '2026-11-28T12:00:00Z')).toBe('unknown');
	});

	it('stays quiet for seasonal or ambiguous hours', () => {
		expect(statusOn('saisonal: Mai–Sep tägl. 9:30–18:00', '2026-11-28T12:00:00Z')).toBe('unknown');
		expect(
			statusOn(
				'Metzgerei Di–Fr 9:00–17:00; Jausenstation Mai–Okt tägl. 10:00–18:00',
				'2026-11-28T12:00:00Z'
			)
		).toBe('unknown');
	});

	it('treats a 24-hour place as open', () => {
		expect(statusOn('täglich 24h geöffnet', '2026-11-28T03:00:00Z')).toBe('open');
	});

	it('has no opinion without hours', () => {
		expect(openingStatus(undefined)).toBe('unknown');
	});
});
