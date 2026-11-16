# Accessibility & interaction decisions

The app is designed for readers who do not live on a phone — including people over 50 who want
large, unambiguous controls and no gesture-only navigation.

## Text and zoom

- The root font size is 17px; everything is sized in `rem`, so text, spacing and controls grow
  together. Settings offers a Large mode (20px root) that is saved between visits.
- Pinch-zoom is explicitly allowed in the viewport meta. Body copy never falls below 16px.
- Muted text uses a high-contrast token (`text-base-content/80` instead of /50 or /60).
- Keyboard focus has a visible 3px ring.

## Controls

- Buttons are at least ~44px tall, primary actions ~53px. Every action has a visible text label —
  no icon-only close buttons or unlabelled arrows.
- The greeting, filters, wishlist, tour, install and update views are bottom sheets with a large
  labelled Close button. Dragging is a convenience, never the only way to dismiss.
- The map is the single screen. Search, list, filters, the layer switcher and the nearby
  recommendation float over it, so no navigation row competes with the map for space.
- The primary action works without any setup: it tries a rough location, then falls back to the
  centre of the map and says so.

## Motion

- Entrance animations are short (≤240ms), movement is a few pixels, and the pin highlight is a calm
  pulse. Under `prefers-reduced-motion: reduce` all CSS animation and the bottom-sheet spring are
  disabled, and result scrolling becomes instant.

## Privacy

- Location is rough, optional and never stored or transmitted. Wishlist, visited marks, filters and
  tour stops stay in localStorage. Analytics is cookieless and receives only page views and feature
  facts — never a place list or coordinates.
