# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are a family of four adults and one 12-year-old using a private travel plan before and during their Bulgaria trip. They need to understand the route, scan each day quickly, and open the correct map links while planning or travelling.

## Product Purpose

The site is a private static catalogue for personal pages. Its Bulgaria 2026 section is the family’s single, practical source for the trip’s dates, lodging sequence, daily destinations, driving expectations, map points, and downloadable route data.

## Positioning

The trip page combines a real family itinerary with direct day-by-day Google Maps routes and a complete layered trip map, rather than presenting generic destination inspiration.

## Operating Context

The trip page is read on desktop during planning and on phones and tablets while travelling. Visitors move between the overview, the full map, individual days, external Google Maps routes, and the downloadable KML file.

## Capabilities and Constraints

- The project remains a dependency-free static website with no build step.
- Preserve every existing itinerary fact, date, place, link, map embed, and download.
- Keep JavaScript lightweight and progressively enhanced.
- Preserve SEO metadata and the existing Cloudflare Pages deployment model.
- Do not implement authentication in client-side code.

## Brand Commitments

The experience should feel like a premium modern travel product: immersive, polished, nature-led, calm, generous, and highly readable. It must remain practical rather than promotional.

## Evidence on Hand

- The complete Bulgaria itinerary is in `trips/bulgaria-2026/index.html`.
- Destination photography is linked from Wikimedia Commons in the itinerary.
- The interactive Google My Maps embed and all daily Google Maps route links are present.
- `trips/bulgaria-2026/bulgaria-2026.kml` contains downloadable route data.
- Three Booking.com confirmations provide verified hotel names, stay dates, check-in/out windows, addresses, room counts, included meals, parking notes, and booking totals for 30 July through 8 August.
- The supplied flight itinerary confirms direct Sun d'Or flights LY5155 and LY5156 with departure, arrival, and duration details.
- No hotel confirmation is available for the final Varna night on 8-9 August, and no confirmed weather data is present; future work must not fabricate either.
- Booking.com confirmation numbers, PINs, guest identity, email, and account-management details must not be published in this publicly readable repository.

## Product Principles

- Make the next useful travel action obvious.
- Preserve itinerary truth while improving how quickly it can be understood.
- Support relaxed planning and on-the-road use equally well.
- Let destination photography create atmosphere without slowing the page.
- Prefer resilient native web behavior over heavy dependencies.

## Accessibility & Inclusion

Maintain readable type, strong contrast, keyboard operability, visible focus states, semantic landmarks, reduced-motion support, and responsive layouts suitable for phone, tablet, and desktop use.
