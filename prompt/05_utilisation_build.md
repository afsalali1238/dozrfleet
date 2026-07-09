# Utilisation page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar)
**File being built:** `fleet/utilisation.html`

---

Build `fleet/utilisation.html` for the Dozr project. Read `fleet/CLAUDE.md`
first. Same shared nav/sidebar shell as the other Fleet pages.

Source/reference: `https://telematics-flame.vercel.app/` → Utilisation tab.

What the reference shows:

- Top summary strip: 5 stat cards (Fleet Avg Utilisation vs. target, Best
  Performer, Idle Hours Today + cost, Total Engine Hrs, Deadhead Est.)
- 3 breakdown cards (Working [load > 20%] / Idle [engine on] / Engine Off)
  each with hours + a sub-stat (% of active hours, AED wasted, % downtime)
- "Today's Utilisation" — one vertical bar per asset (stacked/segmented:
  green=working, amber=idle, red=low, with the asset ID below and % above)
- "7-Day Trend" — a line chart against a target line (dashed, at 75% in the
  reference)

Charts can be built with a lightweight approach — inline SVG, a small canvas
script, or Chart.js if a charting library gets added to the stack (check
`fleet/CLAUDE.md`/ROADMAP for whether that decision's been made; don't add a
new dependency unilaterally). Pull per-asset numbers from `fleet/data/
fleet.js`; add a `utilisation` field per asset (working/idle/off hours, plus
a 7-value trend array) rather than a separate data file, since it's small.

Per `LOGISTICS/03_Engineering/teltonika_telematics_briefing.docx` §3.2, this
whole screen maps to future "Billing Automation" (engine hours → invoice) —
keep that in mind for field naming even though v1 has no real billing wired
up.
