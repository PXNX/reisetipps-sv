import { browser, dev } from '$app/environment';
import { inject, track } from '@vercel/analytics';

/**
 * Anonymous, cookieless usage counting. Vercel's script is served from this app's own domain,
 * stores nothing on the device and only produces aggregate numbers — it never identifies a
 * reader and never sees the wishlist, visited marks or a position. Nothing is sent from a local
 * dev build, where the endpoint does not exist.
 */
function enabled(): boolean {
	return browser && !dev;
}

/** Starts the page-view counting. Call once, in the root layout. */
export function initTelemetry() {
	if (!enabled()) return;
	inject({ mode: 'production' });
}

export type TelemetryProperties = Record<string, string | number | boolean | null>;

/**
 * Counts one interaction, e.g. which feature was opened. The values are feature facts (a place
 * id, a travel mode), never anything that points back to a person.
 */
export function trackEvent(name: string, properties: TelemetryProperties = {}) {
	if (!enabled()) return;
	track(name, properties);
}
