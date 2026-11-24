export type MapLayer = 'standard' | 'topo' | 'transit';

/** Tile sources for the map. The credits are shown in Settings rather than on the map. */
export const mapTiles: Record<
	MapLayer,
	{
		url: string;
		attribution: string;
		maxZoom: number;
		/** Server sends CORS headers, so the service worker can cache real (non-opaque) responses. */
		cors: boolean;
	}
> = {
	standard: {
		// One host instead of a/b/c: OSM asks for it, and each tile then has a single cache key.
		url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: '© OpenStreetMap contributors',
		maxZoom: 18,
		cors: true
	},
	topo: {
		url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
		attribution: '© OpenTopoMap (CC BY-SA), © OpenStreetMap contributors',
		maxZoom: 17,
		cors: true
	},
	transit: {
		url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
		attribution: '© memomaps.de (CC BY-SA), © OpenStreetMap contributors',
		maxZoom: 18,
		cors: false
	}
};
