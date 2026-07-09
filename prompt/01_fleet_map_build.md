# Fleet Map page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar — writes real files directly)
**File being built:** `fleet/index.html`

---

Build `fleet/index.html` for the Dozr project — the Fleet Map screen, the
default/landing view of the Fleet/Telematics dashboard. Read `fleet/CLAUDE.md`
first for conventions and open questions, then the root `CLAUDE.md` and
`ROADMAP.md`'s "Fleet/Telematics Rebuild" section for brand tokens and phase
status.

Source/reference: open `https://telematics-flame.vercel.app/` (the Fleet Map
tab, default view) and inspect it directly — layout, data fields, and
interaction only. Do not copy its branding (orange/dark "Kasper Fleet"
look), its framework, or any of its backend wiring.

What the reference shows, to rebuild under Dozr brand tokens:

- Top nav: logo + 7 tabs (Fleet Map / Fuel / Maintenance / Geofences /
  Utilisation / Cost & ROI / Reports), search bar, live-status pill, alert
  count badge, "+ Add Asset" button, user avatar/name
- Left sidebar: fleet asset list (name, ID/type, a status bar — color-coded
  by fuel or health), grouped "Sites" list with per-site asset counts
- Top summary strip: 5 stat cards (Active Assets, Engine Hrs Today, Fuel
  Today, Active Alerts, Maint Due)
- Center: live map with per-asset markers, zoom controls, legend
  (Active/Idle/Alert/Offline/Zone), map/satellite toggle, "+ Geofence" and
  "Route Replay" buttons
- Right panel: selected-asset detail card (name, type, site, status chips,
  engine hours/RPM/fuel rate/engine load in a 2x2 stat grid)
- Bottom: tabbed panel (Active Alerts / Event Log / Fuel Events) — alerts
  show a severity dot, DTC code + description, asset, "live" tag

Build as real vanilla HTML/CSS/JS (or the stack decided in `fleet/CLAUDE.md`
if that's been resolved by the time you read this — check first). Map can
be a static/mock rendering for v1 (no real Mapbox/Google Maps key wiring
required yet unless that's been decided) — position the asset markers as
absolutely-positioned dots over a static map image or simple SVG, matching
the reference's layout, not its exact map provider.

Data: hardcode the 8 sample assets (or however many exist by the time you
build this) into `fleet/data/fleet.js` as `window.DOZR_FLEET`, same pattern
as `marketplace/data/equipment.js`. Every field the right-panel detail card
and summary strip need (engine hours, RPM, fuel rate, engine load, status,
site, alerts) should live there, not hardcoded into the page markup.

Semantic HTML, real `<button>`/`<a>`, ARIA live region on the alerts feed
(it's meant to update). Run the WCAG contrast check on any new status color
before shipping (see `fleet/CLAUDE.md` — reuse the darkened `--green`/
`--error` tokens from `marketplace/css/styles.css`, don't reintroduce the
lighter originals).
