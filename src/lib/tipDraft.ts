/** The text a reader can copy or share after suggesting a place. No account, no upload. */
export interface TipFields {
	place: string;
	town: string;
	note: string;
	url: string;
}

export function buildTipMessage(fields: TipFields, locale: 'de' | 'en'): string {
	const place = fields.place.trim();
	const town = fields.town.trim();
	const note = fields.note.trim();
	const url = fields.url.trim();

	if (locale === 'en') {
		return [
			'New tip for the Bodensee Guide',
			`Place: ${place || '—'}`,
			`Town: ${town || '—'}`,
			'',
			note || '—',
			...(url ? ['', url] : [])
		].join('\n');
	}
	return [
		'Neuer Tipp für den Bodensee Guide',
		`Ort: ${place || '—'}`,
		`Ortsteil: ${town || '—'}`,
		'',
		note || '—',
		...(url ? ['', url] : [])
	].join('\n');
}
