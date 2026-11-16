import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// The map is now the app's single screen at /. Keep old bookmarks working.
// The redirect is prerendered, so it must not read the request URL.
export const load: PageLoad = () => {
	throw redirect(308, '/');
};
