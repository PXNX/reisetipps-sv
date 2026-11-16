import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Legacy English path: the single map screen lives at /. The redirect is prerendered,
// so it must not read the request URL.
export const load: PageLoad = () => {
	throw redirect(308, '/');
};
