# Cost & ROI page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar)
**File being built:** `fleet/cost-roi.html`

---

Build `fleet/cost-roi.html` for the Dozr project. Read `fleet/CLAUDE.md`
first. Same shared nav/sidebar shell as the other Fleet pages.

Source/reference: `https://telematics-flame.vercel.app/` → Cost & ROI tab.

What the reference shows:

- Top summary strip: 4 stat cards (Net Savings This Month, Subscription
  Cost, ROI Multiple, Year-End Forecast)
- A large hero panel: month label, big headline savings figure, "net
  savings vs. pre-Kasper baseline · ROI multiple", "Share" and "Generate
  Report" buttons, and 4 sub-metrics (Fuel Saved, Theft Prevented, Idle
  Reduction, Breakdowns Avoided — each with an AED value underneath)
- "Cost per Asset" — horizontal bar list, one row per asset (ID + name,
  colored bar, AED total)
- "Savings Trend · Last 6mo" — a line chart from a low starting value up to
  the current month's figure

This is the highest-stakes page visually — it's the one meant to be shared
with a client/decision-maker ("Share"/"Generate Report" buttons), so hold it
to the same visual bar as Marketplace's polished pages, not the denser
operational tabs (Fuel/Maintenance/Geofences). Reuse the chart approach
decided for the Utilisation page rather than introducing a second charting
method.

Pull per-asset cost figures from `fleet/data/fleet.js`; this page is
entirely presentational math on top of data other pages already have (fuel
saved, theft prevented, idle reduction, breakdowns avoided all trace back to
figures shown on Fuel/Utilisation/Maintenance) — don't invent a second
source of truth for numbers that exist elsewhere.
