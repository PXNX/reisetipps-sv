import { browser } from '$app/environment';
import { SvelteSet } from 'svelte/reactivity';
import { locations } from '$lib/data/locations';
import type { Location } from '$lib/data/types';

export type TourMode = 'walk' | 'bike';

const STOPS_KEY = 'tour-stops';
const MODE_KEY = 'tour-mode';

function loadStops(): SvelteSet<string> {
	if (!browser) return new SvelteSet();
	try {
		const raw = localStorage.getItem(STOPS_KEY);
		if (!raw) return new SvelteSet();
		// Drop ids that no longer exist, e.g. from an older build.
		const known = new Set(locations.map((location) => location.id));
		return new SvelteSet((JSON.parse(raw) as string[]).filter((id) => known.has(id)));
	} catch {
		return new SvelteSet();
	}
}

function loadMode(): TourMode {
	if (!browser) return 'walk';
	try {
		return localStorage.getItem(MODE_KEY) === 'bike' ? 'bike' : 'walk';
	} catch {
		return 'walk';
	}
}

function saveStops(stops: SvelteSet<string>) {
	if (!browser) return;
	localStorage.setItem(STOPS_KEY, JSON.stringify([...stops]));
}

/**
 * The reader's own tour: an ordered list of stops plus the travel mode. It is planned by adding
 * places from the details view, kept in localStorage and shared by every other view.
 */
class Tour {
	stops = loadStops();
	mode = $state<TourMode>(loadMode());

	/** The stops in order, resolved against the current location list. */
	get plan(): Location[] {
		const byId = new Map(locations.map((location) => [location.id, location]));
		return [...this.stops].flatMap((id) => {
			const location = byId.get(id);
			return location ? [location] : [];
		});
	}

	get count(): number {
		return this.stops.size;
	}

	has(id: string): boolean {
		return this.stops.has(id);
	}

	toggle(id: string) {
		if (this.stops.has(id)) this.stops.delete(id);
		else this.stops.add(id);
		saveStops(this.stops);
	}

	remove(id: string) {
		this.stops.delete(id);
		saveStops(this.stops);
	}

	/** Replaces the whole plan, e.g. when a shared link is opened. Unknown ids are ignored. */
	setStops(ids: string[]) {
		const known = new Set(locations.map((location) => location.id));
		this.stops.clear();
		for (const id of ids) {
			if (known.has(id)) this.stops.add(id);
		}
		saveStops(this.stops);
	}

	move(id: string, direction: -1 | 1) {
		const order = [...this.stops];
		const index = order.indexOf(id);
		const target = index + direction;
		if (index < 0 || target < 0 || target >= order.length) return;
		[order[index], order[target]] = [order[target], order[index]];
		this.stops.clear();
		for (const stop of order) this.stops.add(stop);
		saveStops(this.stops);
	}

	clear() {
		this.stops.clear();
		saveStops(this.stops);
	}

	setMode(mode: TourMode) {
		this.mode = mode;
		if (browser) localStorage.setItem(MODE_KEY, mode);
	}
}

export const tour = new Tour();

/** A Google Maps directions link with every stop as a waypoint, on foot or by bike. */
export function tourRouteUrl(stops: Location[], mode: TourMode): string {
	if (stops.length === 0) return '';
	const point = (location: Location) => `${location.coordinates[0]},${location.coordinates[1]}`;
	const query = [`api=1`, `travelmode=${mode === 'bike' ? 'bicycling' : 'walking'}`];
	if (stops.length === 1) {
		query.push(`destination=${point(stops[0])}`);
	} else {
		query.push(`origin=${point(stops[0])}`);
		query.push(`destination=${point(stops[stops.length - 1])}`);
		const middle = stops.slice(1, -1);
		if (middle.length > 0) query.push(`waypoints=${middle.map(point).join('%7C')}`);
	}
	return `https://www.google.com/maps/dir/?${query.join('&')}`;
}
