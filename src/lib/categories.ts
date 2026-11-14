import * as m from '$lib/paraglide/messages.js';
import type { Category, Duration } from './data/locations';

export const allCategories: Category[] = [
	'nature',
	'culture',
	'culinary',
	'history',
	'technology',
	'viewpoint'
];
export const allDurations: Duration[] = ['short', 'medium', 'long'];

export const categoryIcons: Record<Category, string> = {
	nature: '🌿',
	culture: '🏛️',
	culinary: '🍷',
	history: '🏺',
	technology: '⚙️',
	viewpoint: '🌄'
};

export function categoryLabel(category: Category): string {
	switch (category) {
		case 'nature':
			return m.category_nature();
		case 'culture':
			return m.category_culture();
		case 'culinary':
			return m.category_culinary();
		case 'history':
			return m.category_history();
		case 'technology':
			return m.category_technology();
		case 'viewpoint':
			return m.category_viewpoint();
	}
}

export function durationLabel(duration: Duration): string {
	switch (duration) {
		case 'short':
			return m.duration_short();
		case 'medium':
			return m.duration_medium();
		case 'long':
			return m.duration_long();
	}
}
