# Fuel page build

**Target tool:** AI coding assistant (Claude Code, Cursor, or similar)
**File being built:** `fleet/fuel.html`

---

Build `fleet/fuel.html` for the Dozr project. Read `fleet/CLAUDE.md` first,
then fill this in. Same nav/sidebar shell as `fleet/index.html` — keep the
header and left sidebar byte-for-byte identical aside from the active-tab
state and selected asset.

Source/reference: `https://telematics-flame.vercel.app/` → Fuel tab.
Layout/data reference only, rebuild under Dozr brand tokens.

What the reference shows:

- Top summary strip: 5 stat cards (Fleet Fuel Today, Avg Efficiency, Theft
  Events, Refuels Today, Low Fuel)
- Grid of per-asset fuel cards (2 rows x 4 in the reference, adjust to
  actual asset count): asset ID + name + site, a fuel-level bar (color-coded
  by level — green/amber/red), current level %, litres/capacity, burn rate
  (L/h), today's consumption (L), lifetime total (L), a status chip (OK /
  LOW / WARN / OFFLINE)

Pull the same asset data from `fleet/data/fleet.js` (built in the Fleet Map
prompt) rather than duplicating it — this page just adds fuel-specific
fields (rate, today, lifetime, status) to the same asset records.

The fuel-level bar is the one place on this page most likely to fail a
contrast check at small sizes — verify the color-coded states (green/amber/
red fill) all have a legible status chip label, don't rely on color alone
(colorblind-safe, also just good practice per the accessibility pass
Marketplace already went through).
