/**
 * A deliberately cautious reading of the opening-hours text. The entries are written by hand and
 * often mention seasons or holidays, so this only reports open/closed when the text is clear.
 * Anything ambiguous gets no badge at all — a wrong "open" is worse than no badge.
 */
import type { LocalizedText } from '$lib/data/types';

export type OpenStatus = 'open' | 'closed' | 'unknown';

const dayIndex: Record<string, number> = {
	mo: 0,
	di: 1,
	mi: 2,
	do: 3,
	fr: 4,
	sa: 5,
	so: 6,
	su: 6
};
const dayPattern = 'mo|di|mi|do|fr|sa|so|su';

/** Berlin time, not the reader's device time — the places are all in the same region. */
function berlinNow(now: Date): { day: number; minutes: number } {
	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Berlin',
		weekday: 'short',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).formatToParts(now);
	const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
	const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	return {
		day: Math.max(0, weekdays.indexOf(value('weekday'))),
		minutes: Number(value('hour')) * 60 + Number(value('minute'))
	};
}

function daysIn(segment: string): Set<number> {
	const days = new Set<number>();
	const regex = new RegExp(
		`(${dayPattern})(?:\\s*(?:[–\\-/&]|\\sund\\s|bis)\\s*(${dayPattern}))?`,
		'g'
	);
	for (const match of segment.matchAll(regex)) {
		const from = dayIndex[match[1]];
		const to = match[2] ? dayIndex[match[2]] : from;
		if ((from + 7 - to) % 7 === 0 && from !== to) {
			// A backwards range such as "Sa–Mo" wraps around the weekend.
			for (let i = from; i !== to; i = (i + 1) % 7) days.add(i);
			days.add(to);
		} else if (from <= to) {
			for (let i = from; i <= to; i++) days.add(i);
		} else {
			days.add(from);
			days.add(to);
		}
	}
	return days;
}

function timeRanges(segment: string): [number, number][] {
	const ranges: [number, number][] = [];
	const regex = /(\d{1,2})(?::(\d{2}))?\s*(?:uhr\s*)?[–\-–]\s*(\d{1,2})(?::(\d{2}))?/g;
	for (const match of segment.matchAll(regex)) {
		const start = Number(match[1]) * 60 + Number(match[2] ?? 0);
		const end = Number(match[3]) * 60 + Number(match[4] ?? 0);
		if (start >= 0 && end <= 24 * 60 && end > start) ranges.push([start, end]);
	}
	return ranges;
}

export function openingStatus(hours: LocalizedText | undefined, now = new Date()): OpenStatus {
	if (!hours) return 'unknown';
	const text = hours.de.toLocaleLowerCase();
	if (
		/saisonal|wetterabhängig|voranmeldung|vereinbarung|jährliche veranstaltung|termin|winterpause|auf anfrage|bitte prüfen|vorher prüfen/.test(
			text
		)
	) {
		return 'unknown';
	}
	// Several businesses in one string (e.g. shop, snack station, vending machine) have
	// different hours; there is no safe single answer.
	if (text.includes(';')) return 'unknown';

	const { day, minutes } = berlinNow(now);
	const segments = text
		.split(/[,.]/)
		.map((part) => part.trim())
		.filter(Boolean);

	for (const segment of segments) {
		const days = daysIn(segment);
		if (days.has(day) && /geschlossen|ruhetag/.test(segment)) return 'closed';
	}

	if (
		/\b24\s*(?:h|std|stunden)\b|rund\s*um\s*die\s*uhr/.test(text) &&
		!/geschlossen|ruhetag/.test(text)
	) {
		return 'open';
	}

	let appliesToday = false;
	const ranges: [number, number][] = [];
	for (const segment of segments) {
		const found = timeRanges(segment);
		if (found.length === 0) continue;
		const days = daysIn(segment);
		// No weekday in the segment means "daily" (e.g. "täglich 10:00–17:00").
		if (days.size === 0 || days.has(day)) {
			appliesToday = true;
			ranges.push(...found);
		}
	}
	if (!appliesToday) return 'unknown';
	return ranges.some(([start, end]) => minutes >= start && minutes < end) ? 'open' : 'closed';
}
