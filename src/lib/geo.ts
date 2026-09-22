export type Coordinates = [number, number];

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two [lat, lng] points, in kilometers. */
export function haversineDistanceKm([lat1, lng1]: Coordinates, [lat2, lng2]: Coordinates): number {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}
