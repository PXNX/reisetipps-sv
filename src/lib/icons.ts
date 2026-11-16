import { iconData } from './iconData';
import type { Category } from './data/types';

/** Short names used by the shared Icon component and the map markers. */
export const fluentNames: Record<string, string> = {
	'star-filled': 'star-20-filled',
	star: 'star-20-regular',
	settings: 'settings-20-regular',
	list: 'apps-list-20-regular',
	location: 'location-20-regular',
	filter: 'filter-20-regular',
	map: 'map-20-regular',
	terrain: 'mountain-trail-20-regular',
	search: 'search-20-regular',
	close: 'dismiss-20-regular',
	compass: 'compass-northwest-20-regular',
	walk: 'person-walking-20-regular',
	bike: 'vehicle-bicycle-20-regular',
	globe: 'globe-20-regular',
	image: 'image-20-regular',
	check: 'checkmark-20-regular',
	add: 'add-20-regular',
	remove: 'delete-20-regular',
	download: 'arrow-download-20-regular',
	refresh: 'arrow-clockwise-20-regular',
	language: 'local-language-20-regular',
	text: 'text-paragraph-20-regular',
	'chevron-right': 'chevron-right-20-regular',
	'chevron-left': 'chevron-left-20-regular',
	'chevron-up': 'chevron-up-20-regular',
	'chevron-down': 'chevron-down-20-regular',
	'arrow-right': 'arrow-right-20-regular',
	info: 'info-20-regular',
	shield: 'shield-20-regular',
	navigation: 'navigation-20-regular',
	pin: 'pin-20-regular',
	film: 'filmstrip-20-regular',
	lighthouse: 'building-lighthouse-20-regular',
	nature: 'emoji:deciduous-tree',
	culture: 'emoji:classical-building',
	food: 'emoji:fork-and-knife',
	history: 'emoji:scroll',
	technology: 'emoji:gear',
	viewpoint: 'emoji:mountain',
	cheese: 'emoji:cheese-wedge',
	butcher: 'emoji:cut-of-meat',
	ruins: 'emoji:castle',
	drinks: 'emoji:wine-glass',
	sweets: 'emoji:ice-cream',
	bus: 'emoji:bus',
	fallback: 'info-20-regular'
};

export const categoryIcons: Record<Category, string> = {
	nature: 'nature',
	culture: 'culture',
	culinary: 'food',
	history: 'history',
	technology: 'technology',
	viewpoint: 'viewpoint',
	cheese: 'cheese',
	butcher: 'butcher',
	ruins: 'ruins',
	drinks: 'drinks',
	sweets: 'sweets'
};

/** A few entries carry a hand-picked emoji; map them to matching Fluent names. */
const locationEmoji: Record<string, string> = {
	'🎥': 'film',
	'⚓': 'lighthouse',
	'🍎': 'nature',
	'🌳': 'nature',
	'🌿': 'nature',
	'☕': 'drinks',
	'🥐': 'sweets',
	'🍫': 'sweets'
};

export function locationIconName(location: { icon?: string; categories: Category[] }): string {
	return (
		(location.icon && locationEmoji[location.icon]) ||
		categoryIcons[location.categories[0] ?? 'nature']
	);
}

/** Fluent SVG markup for Leaflet's HTML-based markers. */
export function fluentSvg(name: string, size = 22): string {
	const iconName = fluentNames[name] ?? name;
	const icon = iconData[iconName];
	if (!icon) return '';
	const width = icon.width;
	const height = icon.height;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${size}" height="${size}" aria-hidden="true">${icon.body}</svg>`;
}
