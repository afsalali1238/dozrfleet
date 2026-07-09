# Fleet Feature Plan — from kasper-gps-platform-tour.html

Source: uploaded reference spec (`kasper-gps-platform-tour.html`), 9 screens
with Must/Should/Could notes per screen. This plan maps that spec onto the
current 7-page `fleet/` build and scopes what to add. **Nothing in this file
has been built yet — this is the plan to review before any code changes.**

## Scope decisions already made

- **Client Tracking Link (tour screen 8) stays out as a full page.**
  `ROADMAP.md` already decided the client/vendor-facing portal is a separate
  product surface, out of scope for this rebuild. Instead: a **"Share
  tracking link" button** on the Fleet Map asset detail panel and on
  Vehicle Detail, matching marketplace's pattern — opens a `wa.me` deep
  link or copies a URL, no new page, no new UI surface to design/maintain.
- **Tier-gating UI (locked/greyed "Upgrade" teasers) is dropped.** The tour
  is written for Kasper as a multi-tenant vendor SaaS with paid hardware
  tiers. `fleet/` is Dozr's own internal ops dashboard — there's no
  upsell surface here, so every feature just shows, full stop. (Flag if
  this assumption is wrong — if fleet/ is meant to preview the vendor
  product, tier-gating comes back into scope.)
- **Predictive/ML alerts (tour's own "Could — Phase 4" tag on Maintenance)
  stays out.** The tour itself marks this as future work, not v1.

## New pages (3)

### Trip History & Playback (`trip-history.html`)
Per-vehicle, per-date trip log with route playback.
- Vehicle + date picker, trip list (start/stop/end times, distance)
- Route polyline on the existing map-surface pattern, colour-coded by
  speed/event (start=green, stops=amber, end=red — reuse `.map-marker`
  dot colors)
- Playback scrubber: drag to move a marker along the route, event markers
  (depart/stop/overspeed) plotted on the timeline
- **Data needed:** a `trips` array per asset — `{date, distance, startTime,
  endTime, stops: [{time, duration, location}], events: [{time, type,
  detail}], route: [{x,y}, ...]}`. Nothing like this exists in
  `data/fleet.js` today; needs to be added for at least 2-3 sample assets.

### Alerts Center (`alerts.html`)
Currently alerts only show inline on Fleet Map's detail panel (per
selected asset). This pulls every asset's alerts into one severity-tiered
feed, matching the `.alert-item` pattern already used inline.
- Severity tiers already exist in data (`warning`/`critical`) — extend with
  `info` (device health) and `ok` (resolved) to match the tour's 4-tier
  model, reusing the `.alert-item.warn/.info/.ok` CSS classes that already
  exist in `fleet/css/styles.css` (currently unused by any page)
- Out-of-hours geofence logic and WhatsApp-routing-rules explainer can be
  static copy (a note block), since there's no real backend yet — same
  pattern as `marketplace`'s "Request Quote" being a WhatsApp deep link
  stand-in for a real workflow
- **Data needed:** flatten all assets' `alerts[]` into one feed with
  timestamps (currently alerts have no `time` field — needs adding) plus
  a couple of `info`/`ok` sample entries (device offline/back online) to
  demonstrate all 4 tiers

### Timesheet (`timesheet.html`)
Driver hours derived from vehicle activity — not asset-centric like every
other page, this one's driver-centric.
- Table: Driver, Vehicle, Start, End, Total, Moving/Idle/Stopped hours,
  mini stacked-bar activity indicator, daily totals row
- **Data needed:** a new `drivers`/`timesheet` array — nothing like this
  exists in `data/fleet.js` today. Needs `{driverName, assetId, shiftStart,
  shiftEnd, movingHours, idleHours, stoppedHours}` for ~5 sample drivers,
  matching the tour's format exactly (it's a good template to copy).

## Enhancements to existing pages

### Fleet Map (`index.html`)
- Make the top KPI cards (Active Assets/Engine Hrs/Fuel/Alerts/Maint Due)
  clickable filters that highlight matching markers on the map (tour's
  "Should" — clicking a KPI filters the map)
- Click a map marker → richer inline popup (speed, driver, ignition, last
  update) instead of only updating the side detail panel — keep the side
  panel too, add the popup as a faster glance
- Add the "Share tracking link" button here (see scope decision above)

### Vehicle Detail (currently the `#asset-detail` panel on Fleet Map, not
its own page — the tour treats this as a full screen)
- Add CAN gauges (coolant temp, oil pressure) alongside the existing
  RPM/fuel-rate mini-stats — `fleet/css/styles.css` doesn't have a gauge
  component yet, would need a new one (the tour's conic-gradient arc is a
  reasonable pattern to port)
- Fault code → plain-language translation: current `alerts[].description`
  already does this (e.g. "Diesel particulate filter pressure high"
  instead of a raw DTC) — just needs the raw code shown alongside, which
  it already does (`code: "P20E0"`). This one's mostly already done.
- Data freshness indicator ("Last data 14 seconds ago") — currently shows
  a static "Updated [date]" on the sidebar; would need a live-feeling
  relative-time string

### Fuel (`fuel.html`)
- Idle cost in AED per asset (currently shows litres/rates, not a
  dirham cost) — straightforward since `cost.idleReduction` already
  exists in the data, just needs surfacing on this page instead of only
  Cost & ROI
- Fuel theft detection: a dedicated alert type (sudden drop while
  ignition off) — reuse the Alerts Center's alert-item pattern, surfaced
  here as a page-specific callout
- Per-vehicle comparison bar chart — `fleet/css/styles.css` already has
  `.bar-chart`/`.bar` classes defined (currently unused by any page),
  this is mostly a JS render function away from done

### Maintenance (`maintenance.html`)
- Add km-based service rules alongside the existing hours-based ones
  (construction equipment services by hours, trucks by km — current data
  model is hours-only for every asset type)
- WhatsApp reminder UI element (a static "reminder sent" row, matching the
  tour's `alert-item ok` pattern) — cosmetic/demo since there's no real
  backend, same spirit as the rest of the mock-data build

### Reports (`reports.html`)
- Current 6 reports (Daily Utilisation, Fuel Consumption, Maintenance
  Schedule, Operator Performance, ESG Emissions, Client Site Report) don't
  line up with the tour's 6 (Trip, Fuel, Idling, Utilisation, Driver
  Behaviour, Geofence). Recommend keeping Dozr's own list rather than
  copying the tour's 1:1 — Dozr's set already covers the same ground
  (Operator Performance ≈ Driver Behaviour, Client Site Report ≈
  Geofence) and ESG Emissions is Dozr-specific value the tour doesn't
  have. Flag for confirmation rather than assuming.

## Nav impact — worth deciding before building

Going from 7 pages to 10 makes the nav-crowding problem (just fixed) worse
before it gets better. Options once the new pages exist: raise the
hamburger-collapse breakpoint further, or group less-frequent items
(Timesheet, Reports) behind a "More" menu instead of flat top-level links.
Not solving this now — flagging so it's not a surprise.

## Suggested build order

1. Data model additions to `data/fleet.js` (trips, alert timestamps,
   driver/timesheet records, coolant/oil-pressure fields) — everything
   else depends on this existing first
2. Alerts Center (smallest new page, reuses existing CSS classes that are
   already defined but unused)
3. Timesheet (self-contained, mostly a new table pattern)
4. Trip History & Playback (largest new page — route rendering + scrubber)
5. Existing-page enhancements (Fleet Map, Fuel, Maintenance, Vehicle
   Detail gauges) last, once the new pages prove out the patterns

Say which of these you want built, in what order — or approve the whole
plan and I'll go in the order above.
