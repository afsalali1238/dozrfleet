# UI Audit: Dozr Fleet (all 7 pages)

Date: 2026-07-09. Reviewed as built (HTML shells + `js/main.js` render output +
`css/styles.css`) across Fleet Map, Fuel, Maintenance, Geofences, Utilisation,
Cost & ROI, Reports. This is a design/UX pass, separate from `QA_AUDIT.md`
(brand tokens + Front-End-Checklist) and the marker-collision fix already
shipped.

## Overall Impression

The bones are good — consistent card/panel language, correct brand tokens,
solid accessibility basics — but two systemic issues are almost certainly
what's reading as "not great": a shared summary-card grid that doesn't adapt
to how many cards actually go in it, and one page (Maintenance) showing the
same numbers twice with different, contradicting values. Neither is a
one-off; both repeat across multiple pages.

## Usability

| Finding | Severity | Recommendation |
|---|---|---|
| Maintenance shows two summary sections back-to-back (top strip + "Maintenance status" panel) with overlapping metrics — Overdue is 2 in both, but Due This Week says 4 while Due Soon says 3 for what reads as the same concept | 🔴 Critical | Merge into one summary row, or clearly differentiate what each represents (e.g. "Due This Week" = date-based, "Due Soon" = hours-based) — right now it looks like a data bug |
| `.summary-grid`/`.stats-grid` is a fixed 5-column grid used regardless of item count. Reports (3 cards), Cost & ROI (4 cards), and Utilisation's breakdown (3 cards) all leave visible empty space on the right; Utilisation's 8 asset bars wrap into an unbalanced 5-then-3 second row | 🔴 Critical | Swap to `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` (or a per-section column count) so cards fill their row regardless of how many there are |
| Geofences nests three panels inside each other (Geofence Manager → Zones panel → Recent Events panel), each with its own border/radius/shadow | 🟡 Moderate | Flatten one level — Recent Events probably doesn't need to be a panel-inside-a-panel; a simple divider would read lighter |
| `.nav-actions` (built for the sticky header) is reused for the "+ New Zone / Polygon / Circle" button group inside the Geofences page body | 🟢 Minor | Harmless today (parent flexbox already aligns it), but rename to something content-scoped so it doesn't accidentally inherit header-only rules later |

## Visual Hierarchy

- **What draws the eye first**: on every page, the top summary-strip cards — correct, that's the right instinct for an ops dashboard (numbers first). But the Reports/Cost-ROI/Utilisation-breakdown versions of that same pattern look unfinished because of the grid-fill issue above, which undercuts the hierarchy that's otherwise working.
- **Reading flow**: summary → primary panel → table/chart is consistent and sound on every page. Maintenance breaks this by inserting a second, redundant summary layer between the real summary and the real content.
- **Typography**: `h1`–`h4` have no `font-size` rule anywhere in `fleet/css/styles.css` — only `font-family`, `margin`, and `letter-spacing` are set. Every panel-header `h2`/`h3` is running on unstyled browser defaults rather than an actual type scale. `marketplace/css/styles.css` does set explicit sizes (e.g. `.section-title h2 { font-size:26px; }`); fleet never picked up the equivalent. Not visibly broken (defaults are reasonable), but it means heading size isn't actually art-directed anywhere in this file.

## Consistency

| Element | Issue | Recommendation |
|---|---|---|
| `.stats-grid` vs `.summary-grid` | Two CSS classes with identical rules (`repeat(5, minmax(0,1fr))`, `gap:14px`) | Consolidate to one class — currently a maintenance trap where fixing one and not the other causes drift |
| Per-asset breakdown pattern | Renders three different ways across pages: 5-col card grid (Fleet Map summary), full-width vertical list (Cost & ROI "Cost per Asset"), and 8-card wrapped grid (Utilisation bars) | Pick one pattern for "list of all 8 assets with a metric" and reuse it — right now it's not obvious these are the same kind of data |
| Fuel card's "Lifetime total" | Sits as a lone 5th stat outside the 4-item `detail-grid` instead of inside it | Fold it into the grid as a 5th cell, or give it its own clearly-separated row treatment consistently |
| Trend charts (Utilisation, Cost & ROI) | Hand-drawn static SVG paths, not plotted from real data — the curve never changes regardless of the numbers above it | Fine for this mock-data stage, just flag so nobody mistakes the curve for real | 

## Accessibility

Already covered in `QA_AUDIT.md` and holds up here too: skip links, single `h1` per page, `aria-live` on dynamic feeds, proper `<th scope>` on both data tables, status conveyed by text label as well as color. No new issues found in this pass.

## What Works Well

- Status-chip color semantics (green/yellow/red → operating/idle/offline, on-schedule/due-soon/overdue, etc.) are fully consistent across every page and every table, and correctly reference brand tokens — this is the strongest part of the system.
- Panel/card visual language (16px radius, 1px line border, subtle shadow) is uniform across all 7 pages and matches marketplace's token system exactly.
- The map/geofence/detail nested-panel pattern, while a bit deep on Geofences, is at least applied the same way everywhere it appears.
- Header now matches marketplace's collapse behavior after the nav-toggle fix.

## Priority Recommendations

1. **Fix the Maintenance duplicate/contradicting summary** — this is the one thing that reads as broken rather than just plain. Either merge the two card rows into one, or make the two concepts (weekly schedule vs. hours-based due) visually and numerically distinct.
2. **Make the summary grid fill its row regardless of card count** — one CSS change (`auto-fit` instead of a fixed `repeat(5,...)`) fixes the lopsided look on Reports, Cost & ROI, and Utilisation in one shot.
3. **Pick one "all assets + a metric" pattern** and use it for Fleet Map's asset list, Cost & ROI's per-asset costs, and Utilisation's per-asset bars — three different layouts for the same underlying data shape is the kind of inconsistency that adds up to "doesn't feel finished" even when no single page is wrong.
