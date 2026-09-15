import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('static/icons', { recursive: true });

const svg = 'static/icon.svg';

const targets = [
	{ file: 'static/icons/icon-192.png', size: 192 },
	{ file: 'static/icons/icon-512.png', size: 512 },
	{ file: 'static/icons/maskable-512.png', size: 512 },
	{ file: 'static/apple-touch-icon.png', size: 180 },
	{ file: 'static/favicon.png', size: 64 }
];

for (const { file, size } of targets) {
	await sharp(svg, { density: 384 }).resize(size, size).png().toFile(file);
	console.log('wrote', file);
}
