---
name: Bulgaria Family Travel Atlas
description: A calm, photographic family travel atlas shaped by the Black Sea and practical route-finding.
colors:
  black-sea-navy: "#052f39"
  black-sea-navy-deep: "#03242c"
  pine: "#155b4a"
  sea-mist: "#dcecf1"
  limestone-paper: "#f6f3ea"
  limestone-bright: "#fffdf7"
  sunflower: "#f4bd32"
  sunflower-hover: "#ffd05b"
  sunflower-ink: "#173237"
  atlas-ink: "#102d32"
  route-muted: "#526b6e"
  cartographic-line: "#d4d9d2"
  activity-wash: "#f4ebcb"
  activity-ink: "#755a10"
  alert-wash: "#fff0c6"
  alert-ink: "#604b12"
  white: "#ffffff"
typography:
  display:
    fontFamily: "\"Avenir Next\", \"Segoe UI\", Arial, sans-serif"
    fontSize: "clamp(4.2rem, 9vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "\"Avenir Next\", \"Segoe UI\", Arial, sans-serif"
    fontSize: "clamp(2.45rem, 5.2vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "\"Avenir Next\", \"Segoe UI\", Arial, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.55rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: "\"Avenir Next\", \"Segoe UI\", Arial, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "\"Avenir Next\", \"Segoe UI\", Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 850
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "10px"
  action: "12px"
  chapter: "16px"
  pill: "999px"
  round: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  action-x: "20px"
  lg: "24px"
  section-gap: "34px"
  xl: "48px"
components:
  button-sun:
    backgroundColor: "{colors.sunflower}"
    textColor: "{colors.sunflower-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 20px"
    height: "48px"
  button-sun-hover:
    backgroundColor: "{colors.sunflower-hover}"
    textColor: "{colors.sunflower-ink}"
    rounded: "{rounded.action}"
  button-ghost:
    backgroundColor: "rgba(3, 36, 44, 0.24)"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 20px"
    height: "48px"
  button-dark:
    backgroundColor: "{colors.black-sea-navy}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 20px"
    height: "48px"
  chip-city:
    backgroundColor: "{colors.sea-mist}"
    textColor: "{colors.pine}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  chip-activity:
    backgroundColor: "{colors.activity-wash}"
    textColor: "{colors.activity-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  card-day:
    backgroundColor: "{colors.limestone-bright}"
    textColor: "{colors.atlas-ink}"
    rounded: "{rounded.chapter}"
    padding: "clamp(28px, 4vw, 48px)"
  alert-important:
    backgroundColor: "{colors.alert-wash}"
    textColor: "{colors.alert-ink}"
    rounded: "{rounded.action}"
    padding: "16px 18px"
---

# Design System: Bulgaria Family Travel Atlas

## Overview

**Creative North Star: "The Living Travel Atlas"**

This system turns a practical family itinerary into an atlas that feels active in the hand. Cinematic destination photography establishes place, while deep coastal color, lodging nodes, route lines, day markers, and map controls keep every screen oriented toward the next useful travel action.

The atmosphere is calm, generous, and nature-led rather than promotional. Large photographic chapters carry emotion; compact metadata, restrained badges, and progressively disclosed map points carry logistics. The visual sequence follows the traveller's mental model: orientation, lodging route, shared map, then daily chapters.

**Key Characteristics:**

- Cinematic Black Sea photography anchored by strong coastal overlays.
- Black Sea Navy and Pine surfaces punctuated by rare Sunflower wayfinding.
- Limestone reading surfaces with fine cartographic lines and soft ambient depth.
- Oversized, tightly tracked headings paired with highly scannable practical labels.
- A persistent day route that makes the itinerary feel navigable, not merely readable.

## Colors

The palette combines deep coastal water, Bulgarian pine, warm limestone, and sunflower wayfinding, with mist and fine lines softening practical information.

### Primary

- **Black Sea Navy:** The principal orientation color for navigation, day markers, map sections, and high-contrast controls.
- **Deep Black Sea Navy:** The cinematic base beneath photography, overlays, and the image lightbox.

### Secondary

- **Bulgarian Pine:** The action and route color for links, icons, lodging nodes, and the closing panel.

### Tertiary

- **Sunflower Marker:** The high-salience wayfinding accent for dates, active progress, focus, primary actions, and key icon details.

### Neutral

- **Limestone Paper:** The warm page field that makes long itinerary reading feel relaxed.
- **Bright Limestone:** The card, table, and active-navigation surface.
- **Atlas Ink:** The darkest reading color for body copy and titles on light surfaces.
- **Route Muted:** The supporting text color for descriptions, dates, and metadata.
- **Cartographic Line:** The fine connective stroke used for timelines, borders, dividers, and route structure.
- **Sea Mist:** The cool informational wash used behind travel notes and city chips.
- **White:** High-contrast copy and icons on coastal surfaces.

### Named Rules

**The Sunflower Marker Rule.** Use Sunflower for wayfinding, focus, progress, and moments that advance the journey; its rarity makes it navigational.

**The Limestone Reading Rule.** Long-form itinerary content lives on warm Limestone surfaces, while Navy and Pine organize orientation and transitions.

## Typography

**Display Font:** Avenir Next (with Segoe UI, Arial, and sans-serif fallbacks)

**Body Font:** Avenir Next (with Segoe UI, Arial, and sans-serif fallbacks)

**Character:** A single humanist sans-serif family keeps the atlas contemporary and operational. Weight, scale, and compact tracking create hierarchy without introducing a decorative typeface that would compete with the photography.

### Hierarchy

- **Display** (800, fluid hero scale, 0.94 line-height): Reserved for the photographic trip title; balance short lines and allow the Sunflower phrase to carry the destination.
- **Headline** (800, fluid section scale, 1.04 line-height): Opens route, map, itinerary, and closing chapters with editorial presence.
- **Title** (700, fluid chapter scale, 1.08 line-height): Names each daily destination or activity inside the timeline.
- **Body** (400, 1.02rem, 1.65 line-height): Handles itinerary descriptions and practical reading, generally within 66–68 characters per line.
- **Label** (850, 0.82rem, 0.05em letter-spacing): Carries dates, section labels, facts, and compact wayfinding with strong scan contrast.

### Named Rules

**The One-Family Rule.** Create hierarchy through Avenir Next's weight, size, tracking, and color; do not add a display face that competes with the atlas photography.

## Layout

The primary reading frame is a centered 1180px container with 40–48px desktop gutters and 28px mobile gutters. The hero may expand to 1320px for navigation, while route, map, and itinerary content return to the calmer reading frame. Major sections use fluid vertical space, typically 80–150px, so the experience alternates between cinematic orientation and focused practical reading.

Desktop chapters use a three-part grid: an 84px day marker rail, a destination image, and a flexible itinerary body. At 960px the hero and map become single-column, lodging nodes become a two-column route, and day chapters tighten their rail. At 760px each chapter becomes a two-column stack with a persistent marker rail spanning image and content. At 520px controls become full-width where useful, metadata remains aligned, and route links simplify to protect readability.

The sticky day navigator is the global positional spine. Its horizontal track scrolls natively on small screens, and its Sunflower progress line plus active Limestone tab show where the traveller is in the trip.

**The Route-Before-Detail Rule.** Establish the whole journey and lodging sequence before asking the traveller to parse individual days.

## Elevation & Depth

Depth is ambient rather than structural. Warm paper cards lift gently from the Limestone field; overlays and blur separate facts from hero photography; map and lightbox surfaces receive stronger shadows because they temporarily become the focal plane. Fine lines and tonal contrast carry most hierarchy at rest.

### Shadow Vocabulary

- **Chapter Ambient** (`0 24px 64px rgba(4, 39, 47, 0.16)`): The standard lift for day chapters and expanded table surfaces.
- **Sticky Route** (`0 8px 24px rgba(3, 36, 44, 0.18)`): Keeps the day navigator legible while it tracks the viewport.
- **Sunflower Action** (`0 12px 28px rgba(244, 189, 50, 0.22)`): A restrained glow reserved for the principal yellow action.
- **Map Focus** (`0 34px 72px rgba(0, 0, 0, 0.28)`): Gives the embedded map a clear focal plane on Navy.
- **Lightbox Focus** (`0 30px 90px rgba(0, 0, 0, 0.48)`): Separates expanded photography from the darkened backdrop.

### Named Rules

**The Ambient Atlas Rule.** Use shadow to establish a focal reading plane, never as a border substitute on every element.

## Shapes

Gently rounded rectangles form the durable atlas surfaces. Day chapters, map frames, tables, notes, and the lightbox use the 16px chapter radius; actions and alerts use a tighter 12px radius; compact chips and photo actions are fully pill-shaped. Route nodes, day timeline points, back-to-top controls, and lightbox controls are circular so they read as map markers.

Thin one-pixel dividers and route lines provide cartographic precision inside the softer silhouettes. Photography clips cleanly to its chapter or lightbox container, and icons use rounded line caps to match the approachable geometry.

**The Map-Marker Geometry Rule.** Reserve circles for position, progress, or compact controls; reserve pills for labels; use rounded rectangles for content and action surfaces.

## Components

### Buttons

Actions are tactile, compact, and directional.

- **Shape:** Gently rounded action rectangle (12px) with a 48px minimum height.
- **Primary:** Sunflower surface, deep teal ink, strong label weight, and 20px horizontal padding.
- **Hover / Focus:** Lift 2px on hover, return to rest on active, and use a 3px Sunflower focus outline with 4px offset.
- **Secondary / Ghost:** Translucent Navy with a light border over photography; hover increases the white tint without losing the background scene.
- **Dark:** Black Sea Navy on light or Sunflower-adjacent surfaces; hover shifts to Pine.
- **Route Link:** A low-chrome Pine text action anchored at the end of a day chapter, with map and directional arrow icons.

### Chips

- **Style:** Compact fully rounded labels with 5px by 10px padding and heavy small type.
- **State:** City chips use Sea Mist and Pine; activity chips use a warm limestone-gold wash and brown ink.

### Cards / Containers

- **Corner Style:** Gently rounded chapter corners (16px), tightening to 14px on the smallest screens.
- **Background:** Bright Limestone for itinerary and table surfaces; translucent Navy for photographic facts; Sea Mist or warm washes for supporting notes.
- **Shadow Strategy:** Chapter Ambient at rest, with stronger elevation only for maps and modal photography.
- **Border:** Cartographic one-pixel lines divide internal rows and connect route structures.
- **Internal Padding:** Fluid chapter padding from 28px to 48px; compact notes use 24–26px.

### Navigation

The top navigation is transparent over the hero, with white links shifting to Sunflower on hover. The day navigator is a sticky Navy route strip with horizontally scrollable day stops, Sunflower day numbers and progress, and a Bright Limestone active state. On phones, the top link group disappears while the brand and native horizontal day scrolling preserve orientation.

### Day Chapter

Each chapter combines a numbered Navy marker rail, a zoomable destination photograph, and a structured itinerary body. City and activity chips introduce the day, metadata pairs line icons with direct labels, map points expand natively, and the Google Maps route remains the final action. On mobile, the marker rail spans the photograph and body so the timeline never loses continuity.

### Expandable Map Points

Native disclosure rows sit between Cartographic Line dividers. The summary presents a label, count, and rotating chevron; opening reveals compact destination links with their attraction types aligned opposite.

### Image Lightbox

Destination photographs open into a large Deep Navy dialog with a blurred dark backdrop, contained image scaling, a caption, and a circular close control. The trigger retains a visible pill action over every photograph so zoom is discoverable.

## Do's and Don'ts

### Do:

- **Do** let destination photography establish atmosphere before practical detail begins.
- **Do** keep orientation visible through route lines, numbered markers, map icons, active-day state, and sticky progress.
- **Do** use Sunflower sparingly for the next useful action, keyboard focus, and current position.
- **Do** preserve generous Limestone space around dense itinerary information.
- **Do** collapse the chapter grid responsively while keeping the day marker rail continuous.
- **Do** respect reduced-motion preferences and retain usable native disclosure, scrolling, and dialog behavior.

### Don't:

- **Don't** turn the family itinerary into a generic grid of interchangeable travel cards.
- **Don't** use decorative color where a map-like line, label, or positional marker communicates more clearly.
- **Don't** place long practical reading directly over photography.
- **Don't** add ornamental typefaces, heavy dependencies, or animation that competes with route-finding.
- **Don't** invent live weather, hotel, reservation, ticket, or cost states without verified trip data.
