import { browser } from '$app/environment';
import { allCategories, allDurations } from '$lib/categories';
import type { Category, Duration } from '$lib/data/types';

const KEY = 'recommend-filters';

interface StoredFilters {
	categories: Category[];
	duration: Duration | null;
}

function load(): StoredFilters {
	const empty: StoredFilters = { categories: [], duration: null };
	if (!browser) return empty;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return empty;
		const parsed = JSON.parse(raw) as Partial<StoredFilters>;
		return {
			categories: Array.isArray(parsed.categories)
				? parsed.categories.filter((c): c is Category => (allCategories as string[]).includes(c))
				: [],
			duration:
				parsed.duration && (allDurations as string[]).includes(parsed.duration)
					? (parsed.duration as Duration)
					: null
		};
	} catch {
		return empty;
	}
}

const initial = load();

/** The recommendation choices, kept between visits so they never have to be re-tapped. */
class RecommendFilters {
	categories = $state<Category[]>(initial.categories);
	duration = $state<Duration | null>(initial.duration);

	get active(): boolean {
		return this.categories.length > 0 || this.duration !== null;
	}

	toggleCategory(category: Category) {
		this.categories = this.categories.includes(category)
			? this.categories.filter((c) => c !== category)
			: [...this.categories, category];
		this.save();
	}

	setDuration(duration: Duration) {
		this.duration = this.duration === duration ? null : duration;
		this.save();
	}

	reset() {
		this.categories = [];
		this.duration = null;
		this.save();
	}

	private save() {
		if (!browser) return;
		try {
			localStorage.setItem(
				KEY,
				JSON.stringify({ categories: this.categories, duration: this.duration })
			);
		} catch {
			// Storage can be unavailable; filtering still works for this visit.
		}
	}
}

export const filters = new RecommendFilters();
