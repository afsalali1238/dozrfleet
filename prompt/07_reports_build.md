# Reports page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar)
**File being built:** `fleet/reports.html`

---

Build `fleet/reports.html` for the Dozr project — the last screen in the
build order. Read `fleet/CLAUDE.md` first. Same shared nav/sidebar shell as
the other Fleet pages.

Source/reference: `https://telematics-flame.vercel.app/` → Reports tab.

What the reference shows:

- Top summary strip: 3 stat cards (Reports This Month, Next Scheduled,
  Formats available)
- "Available Reports" — 6 cards in a 3x2 grid, each with an icon, name,
  one-line description, and a cadence chip (DAILY · AUTO / WEEKLY · AUTO /
  ON DEMAND): Daily Utilisation, Fuel Consumption, Maintenance Schedule,
  Operator Performance, ESG Emissions, Client Site Report
- "Recently Generated" — a table: Report, Period, Assets, Generated
  (timestamp), Delivery (✓ Email / ✓ WhatsApp chip), Action ("Download PDF")

The 6 report types map directly to the "Six Intelligence Products" and
feature backlog in `LOGISTICS/02_Product/04_Kasper_Telematics.docx` and
`LOGISTICS/03_Engineering/teltonika_telematics_briefing.docx` §3 — keep the
names aligned with those docs (e.g. "ESG Emissions" not a rephrased
variant) since they're referenced product/business terms, not just UI copy.

Since Marketplace is entirely WhatsApp-native for anything that would
otherwise be a form (see `marketplace/js/whatsapp.js`), and this page's
"Delivery" column already shows WhatsApp as a channel, check whether the
"Download PDF" action here should also route through a WhatsApp share deep
link for consistency with the rest of Dozr, rather than a direct file
download — flag this to afzl rather than deciding unilaterally, it's a
product-pattern question, not a styling one.

Build the reports table as a real semantic `<table>`, same rule as
`03_maintenance_build.md`. Data (report list, recently-generated rows) goes
in `fleet/data/fleet.js` or a sibling `fleet/data/reports.js`.
