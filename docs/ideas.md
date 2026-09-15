# reisetipps.sv — Design Direction

## Three stylistic approaches

### 1. Alpine Field Notes

**Very Brief Intro:** An editorial travel notebook with a dark-blue night-water atmosphere, luminous lake-blue accents, and field-guide information density. It borrows the reference app's clear, technical calm without copying its station interface.  
**Probability:** 0.06

### 2. Orchard & Limestone

**Very Brief Intro:** A sun-washed regional journal inspired by vineyard signs, old ferry timetables, and limestone architecture. It feels tactile, generous, and food-led.  
**Probability:** 0.04

### 3. Lake Signal

**Very Brief Intro:** A contemporary event signal board using compact route markers, bold time bands, and a strong public-information rhythm. It is energetic and useful, with an intentionally reduced visual language.  
**Probability:** 0.08

## Chosen approach: Alpine Field Notes

### Reference interpretation

The supplied `pxnx/station-sv` reference is treated as inspiration rather than a clone. Its dark, soft-glass surfaces, cool atmospheric gradients, high information clarity, accessible focus treatment, and service-oriented feeling inform the interface. The application will be a distinctly original Bodensee travel journal: imagery and editorial hierarchy replace the station data interface.

### Design Movement

**New Alpine Editorialism** — a digital field guide combining the restraint of Swiss transport graphics with an atmospheric regional magazine.

### Core Principles

1. **Useful beauty:** Every visual decision supports choosing a place or event quickly.
2. **Night-water contrast:** Deep lake surfaces make warm photography and small travel details feel tangible.
3. **Editorial asymmetry:** A dominant feature and a tightly organized information rail create movement without a generic centered landing page.
4. **Quiet locality:** Copy stays specific, restrained, and rooted in the Bodensee region.

### Color Philosophy

The interface uses midnight navy and blue-black as the lake after sunset, avoiding generic neon. Glacial blue is the navigational signal, while a single apricot-orange highlight represents evening light, seasonal food, and the human moment behind a listing. Warm-white text gives the content paper-like legibility against the dark water.

### Layout Paradigm

The page is a **shoreline reading route**, not a conventional centered grid. A thin vertical "lake line" guides the desktop composition. The hero runs wide and offset; an upcoming-event ledger travels beside a large featured card; later listings alternate in scale and image position. On small screens the line becomes a compact horizontal route strip.

### Signature Elements

1. A small, recurring **Bodensee coordinate marker** with latitude/longitude-style numerals.
2. **Lake-line dividers**: slim blue rules with a dot marker that link events and places.
3. **Date tiles** that evoke ferry timetable plaques, with a large day and compact month.

### Interaction Philosophy

Interactions are informational rather than decorative. Filter controls instantly clarify the route; cards rise a few pixels to reveal their active state; external links stay explicit. The saved-list control is intentionally not included because this is a fixed, static publication.

### Animation

Use short, restrained 160–240ms transitions with a custom ease-out. Featured cards fade and lift on first view only; content cards receive a staggered 40ms entry when filters change. Hover moves only transform and opacity. All non-essential motion is suppressed for reduced-motion preferences.

### Typography System

**DM Serif Display** provides memorable, editorial display headlines; **Manrope** handles compact, highly legible body and metadata. Headlines use a measured serif scale with no all-caps. Dates, coordinates, tags, and navigation use Manrope with subtle tracking and semibold weight.

### Brand Essence

**reisetipps.sv is a considered, fixed travel signal for people looking beyond the obvious around Lake Constance.**  
Personality: **observant, grounded, luminous**.

### Brand Voice

Headlines read like a confident local note; CTAs are direct, human, and specific; microcopy names the practical next step.

Example lines:

> "Ein Abend, der am See beginnt und nicht nach Plan endet."

> "Route öffnen — und den kleinen Umweg einplanen."

### Wordmark & Logo

The wordmark pairs a low, wide serif `reisetipps` with a small technical `.sv` suffix. The mark is an abstract **harbour signal**: three stepped blue ripples held inside an open circular waypoint, designed as a distinctive symbol with no text.

### Signature Brand Color

**Signal Water — `#62C3DD`**: a clear, cool blue used only for navigation, focus, and the lake-line marker.
