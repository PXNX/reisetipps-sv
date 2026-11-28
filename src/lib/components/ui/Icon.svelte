<script lang="ts">
	/**
	 * One shared Fluent icon component. Callers use short names, so content data and templates can
	 * pick an icon without importing dozens of components individually.
	 */
	import type { Component } from 'svelte';
	import StarFilled from '~icons/fluent/star-20-filled';
	import Star from '~icons/fluent/star-20-regular';
	import Settings from '~icons/fluent/settings-20-regular';
	import List from '~icons/fluent/apps-list-20-regular';
	import Location from '~icons/fluent/location-20-regular';
	import Filter from '~icons/fluent/filter-20-regular';
	import Map from '~icons/fluent/map-20-regular';
	import Terrain from '~icons/fluent/mountain-trail-20-regular';
	import Search from '~icons/fluent/search-20-regular';
	import Close from '~icons/fluent/dismiss-20-regular';
	import Compass from '~icons/fluent/compass-northwest-20-regular';
	import Walk from '~icons/fluent/person-walking-20-regular';
	import Bike from '~icons/fluent/vehicle-bicycle-20-regular';
	import Globe from '~icons/fluent/globe-20-regular';
	import Image from '~icons/fluent/image-20-regular';
	import Check from '~icons/fluent/checkmark-20-regular';
	import Add from '~icons/fluent/add-20-regular';
	import Remove from '~icons/fluent/delete-20-regular';
	import Download from '~icons/fluent/arrow-download-20-regular';
	import Refresh from '~icons/fluent/arrow-clockwise-20-regular';
	import Language from '~icons/fluent/local-language-20-regular';
	import Text from '~icons/fluent/text-paragraph-20-regular';
	import ChevronRight from '~icons/fluent/chevron-right-20-regular';
	import ChevronLeft from '~icons/fluent/chevron-left-20-regular';
	import ChevronUp from '~icons/fluent/chevron-up-20-regular';
	import ChevronDown from '~icons/fluent/chevron-down-20-regular';
	import ArrowRight from '~icons/fluent/arrow-right-20-regular';
	import Info from '~icons/fluent/info-20-regular';
	import Shield from '~icons/fluent/shield-20-regular';
	import Navigation from '~icons/fluent/navigation-20-regular';
	import Pin from '~icons/fluent/pin-20-regular';
	import Film from '~icons/fluent/filmstrip-20-regular';
	import Lighthouse from '~icons/fluent/building-lighthouse-20-regular';
	// Colored Fluent (emoji) icons make places easy to recognise at a glance.
	import NatureColor from '~icons/fluent-emoji/deciduous-tree';
	import CultureColor from '~icons/fluent-emoji/classical-building';
	import FoodColor from '~icons/fluent-emoji/fork-and-knife';
	import HistoryColor from '~icons/fluent-emoji/scroll';
	import TechnologyColor from '~icons/fluent-emoji/gear';
	import ViewpointColor from '~icons/fluent-emoji/mountain';
	import CheeseColor from '~icons/fluent-emoji/cheese-wedge';
	import ButcherColor from '~icons/fluent-emoji/cut-of-meat';
	import RuinsColor from '~icons/fluent-emoji/castle';
	import DrinksColor from '~icons/fluent-emoji/wine-glass';
	import SweetsColor from '~icons/fluent-emoji/ice-cream';
	import BusColor from '~icons/fluent-emoji/bus';
	import Transit from '~icons/fluent/vehicle-bus-20-regular';
	import ArrowLeft from '~icons/fluent/arrow-left-20-regular';
	import Sparkle from '~icons/fluent/sparkle-20-filled';
	import CheckCircle from '~icons/fluent/checkmark-circle-20-filled';
	import Lightbulb from '~icons/fluent/lightbulb-20-regular';
	import LocationFilled from '~icons/fluent/location-20-filled';
	import Eye from '~icons/fluent/eye-20-regular';
	import EyeOff from '~icons/fluent/eye-off-20-regular';
	import Mic from '~icons/fluent/mic-20-regular';

	const icons: Record<string, Component> = {
		'star-filled': StarFilled,
		star: Star,
		settings: Settings,
		list: List,
		location: Location,
		filter: Filter,
		map: Map,
		terrain: Terrain,
		search: Search,
		close: Close,
		compass: Compass,
		walk: Walk,
		bike: Bike,
		globe: Globe,
		image: Image,
		check: Check,
		add: Add,
		remove: Remove,
		download: Download,
		refresh: Refresh,
		language: Language,
		text: Text,
		'chevron-right': ChevronRight,
		'chevron-left': ChevronLeft,
		'chevron-up': ChevronUp,
		'chevron-down': ChevronDown,
		'arrow-right': ArrowRight,
		info: Info,
		shield: Shield,
		navigation: Navigation,
		pin: Pin,
		film: Film,
		lighthouse: Lighthouse,
		nature: NatureColor,
		culture: CultureColor,
		food: FoodColor,
		history: HistoryColor,
		technology: TechnologyColor,
		viewpoint: ViewpointColor,
		cheese: CheeseColor,
		butcher: ButcherColor,
		ruins: RuinsColor,
		drinks: DrinksColor,
		sweets: SweetsColor,
		bus: BusColor,
		transit: Transit,
		'arrow-left': ArrowLeft,
		sparkle: Sparkle,
		'check-circle': CheckCircle,
		bulb: Lightbulb,
		'location-filled': LocationFilled,
		eye: Eye,
		'eye-off': EyeOff,
		mic: Mic,
		fallback: Info
	};

	interface Props {
		name: string;
		class?: string;
		size?: number;
	}

	let { name, class: className = '', size = 20 }: Props = $props();
	const Icon = $derived(icons[name] ?? icons.fallback);
</script>

<Icon class={className} width={size} height={size} aria-hidden="true" />
