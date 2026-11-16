import { browser } from '$app/environment';

export type TextSize = 'normal' | 'large';

const KEY = 'text-size';

function load(): TextSize {
	if (!browser) return 'normal';
	try {
		return localStorage.getItem(KEY) === 'large' ? 'large' : 'normal';
	} catch {
		return 'normal';
	}
}

/**
 * The reader's preferred text size. The class is applied to the root element so
 * every rem-based size in the app (text, spacing, controls) grows together.
 */
class TextSizeStore {
	value = $state<TextSize>(load());

	constructor() {
		if (browser) this.apply();
	}

	set(value: TextSize) {
		this.value = value;
		if (!browser) return;
		try {
			localStorage.setItem(KEY, value);
		} catch {
			// Private mode can refuse storage; the choice still applies for this visit.
		}
		this.apply();
	}

	private apply() {
		document.documentElement.classList.toggle('text-large', this.value === 'large');
	}
}

export const textSize = new TextSizeStore();
