/**
 * Draws a small "postcard from the lake" on a canvas. Local photos are same-origin, so the result
 * can be shared or downloaded without tainting the canvas.
 */
import type { Location } from '$lib/data/types';
import { categoryLabel } from '$lib/categories';
import { mediumPhoto } from '$lib/photos';
import { placeholderImage } from '$lib/placeholderImage';

type Locale = 'de' | 'en';

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error('image failed'));
		image.src = src;
	});
}

function wrap(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
	maxLines: number
): string[] {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (ctx.measureText(candidate).width > maxWidth && line) {
			lines.push(line);
			line = word;
			if (lines.length === maxLines) break;
		} else {
			line = candidate;
		}
	}
	if (line && lines.length < maxLines) lines.push(line);
	return lines;
}

export async function renderPostcard(
	location: Location,
	locale: Locale,
	note: string
): Promise<HTMLCanvasElement> {
	const canvas = document.createElement('canvas');
	canvas.width = 1200;
	canvas.height = 675;
	const ctx = canvas.getContext('2d');
	if (!ctx) return canvas;

	const url = location.image
		? mediumPhoto(location.image.url)
		: placeholderImage(location.categories);
	let image: HTMLImageElement | null = null;
	try {
		image = await loadImage(url);
	} catch {
		image = null;
	}

	if (image) {
		// Cover-crop the photo into the top band.
		const scale = Math.max(canvas.width / image.width, 390 / image.height);
		const width = image.width * scale;
		const height = image.height * scale;
		ctx.drawImage(image, (canvas.width - width) / 2, (390 - height) / 2, width, height);
	} else {
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, 390);
		gradient.addColorStop(0, '#16395a');
		gradient.addColorStop(1, '#62c3dd');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, 390);
	}

	const fade = ctx.createLinearGradient(0, 250, 0, 390);
	fade.addColorStop(0, 'rgba(11,31,51,0)');
	fade.addColorStop(1, '#0b1f33');
	ctx.fillStyle = fade;
	ctx.fillRect(0, 250, canvas.width, 140);
	ctx.fillStyle = '#0b1f33';
	ctx.fillRect(0, 390, canvas.width, canvas.height - 390);

	ctx.fillStyle = '#7fd3ea';
	ctx.font = '600 26px system-ui, sans-serif';
	ctx.fillText(
		`${location.nearestStation}  ·  ${categoryLabel(location.categories[0] ?? 'nature')}`,
		64,
		445
	);

	ctx.fillStyle = '#f3f8fb';
	ctx.font = '56px Georgia, serif';
	const titleLines = wrap(
		ctx,
		(location.name[locale] ?? location.name.de).replace(/^Insel /, ''),
		1070,
		2
	);
	titleLines.forEach((line, index) => ctx.fillText(line, 64, 520 + index * 62));

	const textTop = 520 + titleLines.length * 62 + 12;
	if (note.trim()) {
		ctx.fillStyle = '#ffc078';
		ctx.font = 'italic 30px Georgia, serif';
		wrap(ctx, note.trim(), 900, 2).forEach((line, index) =>
			ctx.fillText(line, 64, textTop + index * 38)
		);
	}

	ctx.fillStyle = 'rgba(243,248,251,0.55)';
	ctx.font = '22px system-ui, sans-serif';
	ctx.textAlign = 'right';
	ctx.fillText(
		`${location.coordinates[0].toFixed(4)}° N  ${Math.abs(location.coordinates[1]).toFixed(4)}° ${
			location.coordinates[1] < 0 ? 'W' : 'O'
		}`,
		canvas.width - 64,
		canvas.height - 40
	);
	ctx.textAlign = 'left';
	ctx.fillText('Bodensee Guide', 64, canvas.height - 40);
	return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}
