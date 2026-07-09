# Geofences page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar)
**File being built:** `fleet/geofences.html`

---

Build `fleet/geofences.html` for the Dozr project. Read `fleet/CLAUDE.md`
first. Same shared nav/sidebar shell as the other Fleet pages.

Source/reference: `https://telematics-flame.vercel.app/` → Geofences tab.

What the reference shows:

- Top summary strip: 4 stat cards (Active Zones, Entry/Exit Today,
  After-Hours Alerts, Unauthorized)
- "Geofence Manager": a map view with drawn zones (polygon/circle/rectangle
  shapes, each labeled and color-coded), "+ New Zone" / "Polygon" / "Circle"
  buttons
- Right panel: "Zones" list — one card per zone (name, shape type + area +
  operating hours, asset count badge, a colored bottom border matching the
  map shape's color)
- "Recent Events" feed below the zones list — timestamp + asset + zone +
  entered/exited

For v1, the map + drawn zones can be a static/mock rendering (same approach
as the Fleet Map page) — real polygon drawing (Mapbox Draw or similar) is a
later concern once the stack decision in `fleet/CLAUDE.md` is resolved.
Hardcode zone data (name, shape, area, hours, assets) into `fleet/data/
fleet.js` or a sibling `fleet/data/geofences.js`.

Zone color-coding needs a contrast check same as the fuel-bar note in
`02_fuel_build.md` — each zone should be identifiable by its label text, not
color alone.
