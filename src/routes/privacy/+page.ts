import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// The privacy page moved to the German path /datenschutz; keep old links working.
export const load: PageLoad = ({ url }) => {
	throw redirect(308, `/datenschutz${url.search}`);
};
