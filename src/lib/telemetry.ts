import { browser, dev } from '$app/environment';
import { injectAnalytics, track } from '@vercel/analytics/sveltekit';

/**
 * Anonymous, cookieless usage counting. The SvelteKit helper sends a page view for every client-side
 * navigation with the route id, and disables the script's own pushState tracking so we never count a
 * route twice. It also sets up the event queue immediately, so interactions during mount are kept.
 * The script comes from this app's own domain, stores nothing on the device, and never sees the
 * wishlist, visited marks or a position. Nothing is sent from a local dev build.
 */
const active = browser && !dev;

if (active) {
	injectAnalytics({ mode: 'production' });
}

export type TelemetryProperties = Record<string, string | number | boolean | null>;

/** Counts one interaction, e.g. which feature was opened. Values are feature facts only. */
export function trackEvent(name: string, properties: TelemetryProperties = {}) {
	if (dev && browser) {
		// In development, show what would be sent without contacting Vercel.
		console.debug('[telemetry]', name, properties);
		return;
	}
	if (!active) return;
	track(name, properties);
}
