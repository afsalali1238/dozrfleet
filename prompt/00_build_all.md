# Fleet — full build kickoff prompt

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar — writes real files directly)

---

Copy everything below into your coding assistant to kick off the Fleet/Telematics rebuild.

---

Build the Dozr Fleet/Telematics rebrand, one screen at a time, in this exact
order. This is a sub-project inside the Dozr repo, following the same
process already used for `marketplace/`.

Before writing any code:
1. Read `fleet/CLAUDE.md` — conventions, proposed stack, file layout, and
   three open questions (vendor-portal scope, shared vs. independent
   stylesheet, mock-vs-real data timing). If any of those are still
   unresolved, ask me before scaffolding rather than guessing.
2. Read the root `CLAUDE.md` and `ROADMAP.md`'s "Fleet/Telematics Rebuild"
   section for brand tokens and overall phase status.
3. Open `https://telematics-flame.vercel.app/` and click through all 7 tabs
   — this is the live reference MVP being rebranded. There's no local
   source for it in this repo.

Then work through these build prompts in order, one page per prompt, fully
finishing and reviewing each before moving to the next:

1. `fleet/prompt/01_fleet_map_build.md` → builds `fleet/index.html`
2. `fleet/prompt/02_fuel_build.md` → builds `fleet/fuel.html`
3. `fleet/prompt/03_maintenance_build.md` → builds `fleet/maintenance.html`
4. `fleet/prompt/04_geofences_build.md` → builds `fleet/geofences.html`
5. `fleet/prompt/05_utilisation_build.md` → builds `fleet/utilisation.html`
6. `fleet/prompt/06_cost_roi_build.md` → builds `fleet/cost-roi.html`
7. `fleet/prompt/07_reports_build.md` → builds `fleet/reports.html`

Each prompt file is self-contained (what the reference site shows, what
data goes where, what conventions apply) — read the whole file before
starting that page, don't skip ahead.

Shared rules across every page (also in `fleet/CLAUDE.md`, repeated here
since it matters most):
- Dozr brand tokens only (`var(--ink)`, `var(--yellow)`, etc.) — never a
  hardcoded hex. Flag anything the token set doesn't cover instead of
  inventing a color.
- One shared nav, byte-for-byte identical across all 7 pages aside from the
  active-tab state.
- Semantic HTML — real `<button>`/`<a>`, real `<table>` for data tables,
  `<label for>` on every input, ARIA live regions on anything that
  auto-updates (alerts, live positions).
- Reference `telematics-flame.vercel.app` for layout/data/copy only — don't
  copy its branding, framework, or backend wiring.
- Run a WCAG contrast check on any new status/alert color before shipping
  a page — reuse the darkened `--green`/`--error` tokens already fixed in
  `marketplace/css/styles.css` (2026-07-09), don't reintroduce the lighter
  originals.

Data: hardcode fleet/asset data into `fleet/data/fleet.js` as
`window.DOZR_FLEET` (same pattern as `marketplace/data/equipment.js`), add
page-specific fields as you go rather than duplicating asset identity
across multiple data files.

After all 7 pages are built: update `ROADMAP.md`'s "Fleet/Telematics
Rebuild" section to check off Phase 2, and flag anything from the three
open questions in `fleet/CLAUDE.md` that got resolved along the way so the
doc stays accurate.
