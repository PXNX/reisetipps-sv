import type { Category } from './data/locations';
import { categoryIcons } from './categories';

const categoryGradients: Record<Category, [string, string]> = {
	nature: ['#1f4d3a', '#62c3dd'],
	culture: ['#3d2c5e', '#f2a65a'],
	culinary: ['#7a3418', '#f2a65a'],
	history: ['#0b1f33', '#62c3dd'],
	technology: ['#0b1f33', '#9db4c9']
};

/**
 * Generates a small SVG cover image on the fly so every location has a visual
 * even without a real photo on file. Keeps the app fully offline-capable and
 * avoids hot-linking third-party photos we can't verify the rights/URL for.
 */
export function placeholderImage(categories: Category[]): string {
	const primary = categories[0] ?? 'nature';
	const [from, to] = categoryGradients[primary];
	const icon = categoryIcons[primary];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
</linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<circle cx="540" cy="90" r="120" fill="#ffffff" opacity="0.06"/>
<circle cx="90" cy="300" r="160" fill="#000000" opacity="0.08"/>
<text x="50%" y="54%" font-size="120" text-anchor="middle" dominant-baseline="middle">${icon}</text>
</svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
