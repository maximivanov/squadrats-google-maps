# Squadrats on Google Maps

A userscript that overlays your [Squadrats](https://squadrats.com) and Squadratinhos grid on top of **Google Maps**, so you can hunt tiles while planning trips with the map that actually has the places, ratings and reviews.

Squadrats officially supports Strava, Garmin, Komoot, gpx.studio, RideWithGPS and friends — but **not** Google Maps. This fills that gap.

- 🟪 **Mauve** — squadrats you've collected (OSM zoom‑14 tiles)
- 🟩 **Green** — squadratinhos you've collected (zoom‑17 tiles; shown from zoom ~13)
- Full Google Maps underneath — search, POIs, reviews, directions, all intact

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Safari).
2. Open [`squadrats-google-maps.user.js`](squadrats-google-maps.user.js) → **Raw**. Tampermonkey will offer to install it. (Or: Tampermonkey dashboard → **+** → paste the file contents → save.)
3. **Set your UID** — see below.
4. Open [google.com/maps](https://www.google.com/maps). Your tiles appear within a second.

## Set your UID

Your tiles are served per‑account, keyed by your Squadrats (Firebase) user id. You need to paste yours into the script once.

1. Open [squadrats.com](https://squadrats.com), log in, and open the **Map**.
2. Open DevTools (`F12`) → **Network** tab → type `pbf` in the filter box.
3. Pan the map so tiles load. Click any request to `tiles1.squadrats.com/.../trophies/...`.
4. In the URL, the path segment right after the hostname is your UID:
   ```
   https://tiles1.squadrats.com/<THIS_IS_YOUR_UID>/trophies/1779.../12/1948/1556.pbf
   ```
5. In the userscript (Tampermonkey → edit), replace the placeholder near the top:
   ```js
   const UID = 'YOUR_SQUADRATS_UID';
   ```
   with your UID, and save.

## Controls

| Key | Action |
| --- | --- |
| **Squadrats** button (top-right of the map) | Toggle the overlay on/off |
| `S` | Toggle the overlay on/off |
| `O` | Toggle the collected‑region outline |

## How it works

- **Data.** Squadrats serves your collected tiles as [Mapbox Vector Tiles](https://github.com/mapbox/vector-tile-spec) at `tiles1.squadrats.com/<uid>/trophies/<timestamp>/{z}/{x}/{y}.pbf`. CORS is open, so the script fetches them directly. The decoder (`@mapbox/vector-tile` + `pbf`) is bundled into the file — no external dependencies, no build step.
- **Positioning.** Google Maps keeps the map center + zoom in the page URL (`@lat,lng,zoomz`) and updates it via `history.replaceState`. The script hooks that, parses the view, works out which tiles are visible, and paints them onto a full‑screen `<canvas>` using standard Web‑Mercator math. No Google Maps API key or internal hooks required.
- It redraws when the map settles and hides while you're dragging, so the overlay never shows a stale position.

## Limitations

- **2D top‑down only.** In tilted/3D/globe view the URL format changes and the overlay simply hides itself.
- **If shading disappears:** your UID changed (rare) or Google changed their URL scheme. Re‑grab your UID (above); if the URL format changed, the regex in `getView()` needs a tweak.
- Front‑end maintenance: Google occasionally reshuffles their site, which can require a small selector/regex fix. The tile math never changes.

## Privacy note

The `trophies` tile endpoint has **no authentication** — the UID in the path is the only thing gating access, so anyone who knows your UID can read your collected‑tile map (effectively a heatmap of where you ride). Your UID isn't normally exposed publicly, but treat it like a secret link: don't commit it, screenshot it, or paste it anywhere shared. This repo ships a placeholder, never a real UID.

## License

MIT (this script). Bundled `@mapbox/vector-tile` and `pbf` are MIT / ISC respectively.

Not affiliated with Squadrats. "Squadrats" and "Squadratinhos" belong to their owners.
