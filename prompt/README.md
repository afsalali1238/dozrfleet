# Dozr Fleet — Build Prompts

Ready-to-paste prompts for building the Fleet/Telematics rebrand, one per
screen. Same pattern as `../../prompt/` used for the Marketplace build:
copy the whole prompt into the tool noted at the top of each file, don't
mix prompts across tools.

Read `../CLAUDE.md` first (this folder's conventions) and `ROADMAP.md`'s
"Fleet/Telematics Rebuild" section (phase status, open questions) before
running any of these — two open questions there (vendor-portal scope,
shared vs. independent stylesheet) affect several of these prompts and
should be resolved with afzl first if not already.

| File | Task | Tool |
|---|---|---|
| `01_fleet_map_build.md` | Build `fleet/index.html` | AI coding assistant (Claude Code, Cursor, etc.) |
| `02_fuel_build.md` | Build `fleet/fuel.html` | AI coding assistant |
| `03_maintenance_build.md` | Build `fleet/maintenance.html` | AI coding assistant |
| `04_geofences_build.md` | Build `fleet/geofences.html` | AI coding assistant |
| `05_utilisation_build.md` | Build `fleet/utilisation.html` | AI coding assistant |
| `06_cost_roi_build.md` | Build `fleet/cost-roi.html` | AI coding assistant |
| `07_reports_build.md` | Build `fleet/reports.html` | AI coding assistant |

Build order: Fleet Map → Fuel → Maintenance → Geofences → Utilisation →
Cost & ROI → Reports — same order the tabs appear on the reference site, so
each prompt can be checked against it in sequence.

**Every prompt below depends on a live reference site**
(`https://telematics-flame.vercel.app/`) instead of a local prototype file
— there's no source code for it in this repo, only the deployed site. Each
prompt tells the assistant to inspect the relevant tab live before building.
If that site becomes unavailable, screenshots would need to be captured and
attached instead.

Update this file if a prompt gets revised or a new one is added — keep it
as the index, not a duplicate of the prompt content itself.
