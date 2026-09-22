import { browser } from '$app/environment';
import { SvelteSet } from 'svelte/reactivity';

const VISITED_KEY = 'visited-locations';
const WISHLIST_KEY = 'wishlist-locations';

function loadSet(key: string): SvelteSet<string> {
	if (!browser) return new SvelteSet();
	try {
		const raw = localStorage.getItem(key);
		return raw ? new SvelteSet(JSON.parse(raw)) : new SvelteSet();
	} catch {
		return new SvelteSet();
	}
}

function saveSet(key: string, value: SvelteSet<string>) {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify([...value]));
}

class LocationMarks {
	visited = loadSet(VISITED_KEY);
	wishlist = loadSet(WISHLIST_KEY);

	isVisited(id: string): boolean {
		return this.visited.has(id);
	}

	isWishlisted(id: string): boolean {
		return this.wishlist.has(id);
	}

	toggleVisited(id: string) {
		if (this.visited.has(id)) {
			this.visited.delete(id);
		} else {
			this.visited.add(id);
			this.wishlist.delete(id);
			saveSet(WISHLIST_KEY, this.wishlist);
		}
		saveSet(VISITED_KEY, this.visited);
	}

	toggleWishlist(id: string) {
		if (this.wishlist.has(id)) {
			this.wishlist.delete(id);
		} else {
			this.wishlist.add(id);
		}
		saveSet(WISHLIST_KEY, this.wishlist);
	}
}

export const locationMarks = new LocationMarks();
