import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// The map page moved to the German path /karte; keep old links working.
export const load: PageLoad = ({ url }) => {
	throw redirect(308, `/karte${url.search}`);
};
