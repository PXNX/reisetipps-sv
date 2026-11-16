import * as m from '$lib/paraglide/messages.js';
import type { Category, Duration } from './data/types';

export const allCategories: Category[] = [
	'nature',
	'culture',
	'culinary',
	'history',
	'technology',
	'viewpoint',
	'cheese',
	'butcher',
	'ruins',
	'drinks',
	'sweets'
];
export const allDurations: Duration[] = ['short', 'medium', 'long'];

export const categoryIcons: Record<Category, string> = {
	nature: '🌿',
	culture: '🏛️',
	culinary: '🍴',
	history: '🏺',
	technology: '⚙️',
	viewpoint: '🌄',
	cheese: '🧀',
	butcher: '🥩',
	ruins: '🏰',
	drinks: '🍷',
	sweets: '🍦'
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
		case 'cheese':
			return m.category_cheese();
		case 'butcher':
			return m.category_butcher();
		case 'ruins':
			return m.category_ruins();
		case 'drinks':
			return m.category_drinks();
		case 'sweets':
			return m.category_sweets();
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
