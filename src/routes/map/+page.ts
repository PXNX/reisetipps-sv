import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// The map page moved to the German path /karte; keep old links working. The redirect is
// prerendered, so it must not read the request URL — that is only available at runtime.
export const load: PageLoad = () => {
	throw redirect(308, '/karte');
};
