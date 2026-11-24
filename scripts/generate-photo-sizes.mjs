/**
 * Writes smaller copies of every place photo next to the originals:
 * - static/images/thumbs/…webp  (144 px square, for list rows and search results)
 * - static/images/medium/…webp  (900 px wide, for the photo at the top of a place)
 * The originals stay for the full-screen gallery. Run after adding photos:
 *   bun scripts/generate-photo-sizes.mjs
 */
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const source = 'static/images/locations';

function* walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* walk(path);
		else if (/\.(jpe?g|png|webp)$/i.test(name)) yield path;
	}
}

const sizes = [
	{
		dir: 'static/images/thumbs',
		apply: (img) => img.resize(144, 144, { fit: 'cover' }),
		quality: 72
	},
	{
		dir: 'static/images/medium',
		apply: (img) => img.resize({ width: 900, withoutEnlargement: true }),
		quality: 74
	}
];

let written = 0;
for (const file of walk(source)) {
	const rel = relative(source, file).replace(/\.[^.]+$/, '.webp');
	for (const { dir, apply, quality } of sizes) {
		const out = join(dir, rel);
		if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) continue;
		mkdirSync(dirname(out), { recursive: true });
		await apply(sharp(file).rotate()).webp({ quality }).toFile(out);
		written++;
	}
}
console.log(`wrote ${written} files`);
