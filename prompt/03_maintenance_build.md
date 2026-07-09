# Maintenance page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar)
**File being built:** `fleet/maintenance.html`

---

Build `fleet/maintenance.html` for the Dozr project. Read `fleet/CLAUDE.md`
first. Same shared nav/sidebar shell as the other Fleet pages.

Source/reference: `https://telematics-flame.vercel.app/` → Maintenance tab.

What the reference shows:

- Top summary strip: 5 stat cards (Overdue, Due This Week, On Schedule, Est.
  Cost This Week, Breakdowns Prevented)
- 4 status cards (Overdue / Due Soon / On Schedule / Completed This Month)
  with counts
- A "Maintenance Schedule — All Assets" table: Asset (ID + name), Type,
  Service Item, Last/Due (hours or km), Current (hours/km), Remaining
  (color-coded: red "OVERDUE", amber "due soon" count, green count), Status
  chip, Action (a "Book" button)

Build the table as a real semantic `<table>` with proper `<thead>`/`<th
scope="col">` — not styled divs. Pull asset identity (ID, name, type) from
`fleet/data/fleet.js`; add maintenance-specific fields (service item,
last/due, current, remaining, status) either to that same file or a
sibling `fleet/data/maintenance.js` if it makes the data file too cluttered
— your call, but keep asset identity in one place, don't duplicate it.

Per `LOGISTICS/03_Engineering/teltonika_telematics_briefing.docx` §3.5, real
maintenance data eventually comes from engine-hours thresholds (CAN AVL ID
253) — for this rebrand pass the numbers are still mock/hardcoded, but keep
the field names consistent with that doc (`engine hours`, not something
else) so wiring real data later doesn't require a rename.
