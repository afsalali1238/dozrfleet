# Dozr Fleet — Telematics/GPS Frontend

Real, deployable frontend for the Dozr Fleet/Telematics rebrand. This is a
sub-scaffold inside the main Dozr project — see the root `CLAUDE.md` and
`ROADMAP.md` (Fleet/Telematics Rebuild section) for brand tokens, phase
status, and overall project context. This file only covers conventions
specific to the code in this folder.

## What this is

A rebrand of the existing `telematics-flame.vercel.app` ("Kasper Fleet") MVP
under the Dozr brand. That MVP is a working hi-fi prototype (orange/dark
"Kasper Fleet" look, mock Supabase-backed data) with 7 screens already
proven out: Fleet Map, Fuel, Maintenance, Geofences, Utilisation, Cost & ROI,
Reports. This folder is NOT a from-scratch design — it's a faithful port of
that IA and data shape onto Dozr's visual system.

**Before building anything**, open `https://telematics-flame.vercel.app/` and
click through all 7 tabs to see the real layout, data fields, and
interaction patterns. There is no local source for it in this repo — it's a
separate deployment. Treat it the same way `marketplace/` treated
`Dozr_Marketplace_Prototype.html`: reference for layout/data/copy, rebuild
as real code, don't copy any framework/runtime it depends on.

## Stack (proposed, not yet decided — confirm with afzl before scaffolding)

Same pragmatic default as `marketplace/`: vanilla HTML/CSS/JS, no bundler,
matching the sibling MVPs. Two differences from Marketplace that make this
decision less automatic:

- This dashboard needs **live data** (map positions, engine hours, fuel
  levels), not a static brochure. Even a v1 rebrand needs a decision on
  whether it stays on mock/hardcoded data (fastest, matches Marketplace's
  approach) or wires up early against Traccar/Supabase.
- The real backend path (per `LOGISTICS/03_Engineering/
  teltonika_telematics_briefing.docx`) is Traccar (self-hosted, AWS Bahrain)
  in front of TimescaleDB/Postgres+PostGIS, consumed via Traccar's REST API
  — this is a live-data pipeline, not something a static page can fake
  forever the way `data/equipment.js` does for Marketplace.

**Recommendation for v1 of this folder:** rebrand-only pass first, same
hardcoded-mock-data pattern as Marketplace (`data/fleet.js` holding the 8
sample assets/alerts/etc. seen on telematics-flame), so the visual rebuild
can ship independent of the hardware/Traccar timeline. Swap to real data
later behind the same data functions, same pattern used for Marketplace's
eventual Supabase migration.

## Where things should go (mirrors `marketplace/`)

- `index.html` — Fleet Map (live map + per-asset panel: engine hours, RPM,
  fuel rate, engine load; active alerts with J1939 DTC codes; asset list
  with status bars; sites list)
- `fuel.html` — per-asset fuel level/rate/theft/refuel event cards, fleet
  fuel summary strip
- `maintenance.html` — overdue/due-soon/on-schedule summary + maintenance
  schedule table per asset
- `geofences.html` — zone manager (polygon/circle draw), zone list, entry/
  exit event log
- `utilisation.html` — working/idle/off-hours breakdown, per-asset daily
  bars, 7-day trend chart
- `cost-roi.html` — net savings, ROI multiple, cost-per-asset breakdown,
  savings trend chart
- `reports.html` — available report cards (daily/weekly/on-demand), recently
  generated table
- `css/styles.css` — same brand-token approach as `marketplace/css/
  styles.css` — check whether to share one stylesheet across both folders
  or keep them independent (ask afzl; sharing risks coupling two products
  that ship on different timelines)
- `js/` — page-specific behavior, same shared/`main.js` pattern as Marketplace
- `data/fleet.js` — hardcoded assets/alerts/geofences/reports (mirrors
  `data/equipment.js`'s role) until a real backend lands
- `assets/` — icons/images as produced

## Conventions (same non-negotiables as `marketplace/`)

- **Brand tokens are non-negotiable** — reference `css/styles.css` custom
  properties (`var(--ink)`, `var(--yellow)`, etc.), never hardcode a hex.
  Flag anything the token set doesn't cover instead of improvising —
  dashboards commonly need extra semantic colors (status states: OK/DUE
  SOON/OVERDUE/OFFLINE, alert severities) that don't exist in the current
  brand guideline. Confirm new tokens with brand-guardian before inventing
  them.
- **Semantic HTML only** — real `<button>`/`<a>`, real `<label for>` on
  every input, proper table markup for data tables (not styled divs), ARIA
  live regions for anything that auto-updates (alerts feed, live map
  positions).
- **Reference, don't copy, telematics-flame** — it's someone else's build
  (unknown framework/backend). Treat it purely as a layout/IA/copy
  reference, same rule Marketplace applied to the Claude Design prototype.
- **One shared nav** across all 7 pages, byte-for-byte identical aside from
  the active-tab state — same rule as Marketplace's header/footer.
- **Contrast matters more here than on Marketplace** — this is an on-site,
  outdoor-glare-viewed dashboard. Run every new status/alert color through
  a WCAG contrast check before shipping (Marketplace's `--green`/`--error`
  tokens were darkened on 2026-07-09 for exactly this reason — reuse those
  updated values, don't reintroduce the old lighter ones).

## Open questions — resolve before Phase 4 build starts

- Is v1 scope the internal ops dashboard only, or does it include the
  vendor-facing GPS-as-a-Service white-label portal too? (See ROADMAP.md
  Fleet/Telematics Phase 1.) Changes page count and IA.
- Share `css/styles.css` with `marketplace/`, or keep independent? Sharing
  = automatic brand-token consistency; independent = the two products can
  ship/iterate on separate timelines without risk of one breaking the other.
- Mock data now vs. wait for Traccar pilot? Affects whether `data/fleet.js`
  is meant to be temporary scaffolding or semi-permanent (Marketplace's
  `data/equipment.js` was explicitly designed to be swapped later without
  touching markup — do the same here).

## Build order

Fleet Map → Fuel → Maintenance → Geofences → Utilisation → Cost & ROI →
Reports — same order as the tabs appear on telematics-flame, so each build
prompt can be checked against the live reference site in sequence. See
`prompt/README.md` in this folder for ready-to-paste build prompts, one per
screen, same pattern as `../prompt/` used for Marketplace.
