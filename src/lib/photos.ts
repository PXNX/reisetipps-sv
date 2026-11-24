import type { Category } from './data/types';
import { placeholderImage } from './placeholderImage';

const ORIGINALS = '/images/locations/';

/** Smaller copy of a bundled photo (see scripts/generate-photo-sizes.mjs); other URLs pass through. */
function resized(url: string, size: 'thumbs' | 'medium'): string {
	if (!url.startsWith(ORIGINALS)) return url;
	return `/images/${size}/${url.slice(ORIGINALS.length).replace(/\.[^./]+$/, '.webp')}`;
}

/** A small square image for list rows, so a list never downloads full-size photos. */
export function thumbnail(location: { image?: { url: string }; categories: Category[] }): string {
	return location.image
		? resized(location.image.url, 'thumbs')
		: placeholderImage(location.categories);
}

/** A screen-sized photo for the top of a place; the gallery still opens the original. */
export function mediumPhoto(url: string): string {
	return resized(url, 'medium');
}
