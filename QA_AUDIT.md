# Fleet Site — Brand + Front-End-Checklist Audit

Date: 2026-07-09. Scope: all 7 pages in `fleet/` against
`LOGISTICS/05_Brand_Design/Dozr_Brand_Guidelines.html`, the
[Front-End-Checklist](https://github.com/thedaviddias/Front-End-Checklist)
categories, and `marketplace/`'s design language (frontend-checklist MCP
server wasn't reachable in this session, so the checklist was applied
manually against its published categories).

## Fixed

- **Logo mark placeholder → real brand mark.** All 7 pages
  (`index.html`, `fuel.html`, `maintenance.html`, `geofences.html`,
  `utilisation.html`, `cost-roi.html`, `reports.html`) rendered the header
  logo as a plain letter "D" in a box, while `marketplace/` and
  `assets/favicon.svg` already use the real Dozr crane/pin mark. Swapped
  the `<span class="logo-mark">D</span>` for the actual inline SVG mark
  (same paths as favicon/marketplace), reusing the existing `.logo-mark`
  CSS — no stylesheet changes needed beyond the icon swap.
- **`.bar-track` hardcoded `border-radius: 999px`** → `var(--radius-pill)`
  in `fleet/css/styles.css`. Same visual result, now token-referenced like
  every other pill/chip in the file.

## Brand token compliance — pass, with one doc-drift note

Fleet's `:root` tokens match `marketplace/css/styles.css` exactly (ink,
yellow, canvas, surface, slate, line, fonts, radii, spacing). No hardcoded
hex colors or inline `font-family` overrides found anywhere in the 7 pages.

One thing worth fixing in the **docs**, not the code: both `fleet/css/
styles.css` and `marketplace/css/styles.css` use `--green: #146447` and
`--error: #A22424` (deliberately darkened for contrast, per ROADMAP's
2026-07-08 note), but `Dozr_Brand_Guidelines.html` still lists the original
`#1F9A6D` / `#D64545`, and still contains ~200 instances of the old
`#9A9CA1` slate value that was replaced site-wide for the same contrast
reason. The code is consistent and correct across both products — the
canonical guidelines file just hasn't been updated to match. Recommend a
follow-up pass on the guidelines doc itself so it stops looking like a
false-positive brand violation on the next audit.

## Front-End-Checklist — pass on everything checked

`<html lang>`, `charset`, `viewport`, `<title>`, meta description, favicon,
font preconnect + `display=swap`, deferred scripts, skip-link, single `<h1>`
per page (screen-reader-only, matching the same pattern `marketplace/browse.
html` and `equipment-detail.html` use), `aria-current="page"` on active nav,
`aria-live="polite"` on the alert feed, real `<label for>` on the search
input, proper `<th scope="col">` on both data tables (Maintenance, Reports),
no `<img>` without `alt` (fleet uses no raster `<img>` tags at all — CSS
backgrounds / inline SVG / live-rendered map only), no `onclick` on
non-interactive elements. Fleet is actually stricter here than marketplace:
3 inline `style=""` attributes total vs. marketplace's 39 — left as-is since
they're one-off spacing tweaks (`padding:20px`, `margin-top:16px`), not
brand or accessibility violations.

Not present on either site: Open Graph tags, `robots.txt`/sitemap. Fine for
marketplace's current stage; doubly fine for fleet, which is an internal
ops tool with no public-SEO surface.

## Fleet vs. marketplace design philosophy — consistent

Same spacing grid (8px multiples), same 3-token radius system for
buttons/cards/pills, same type stack, same minimal/restrained use of yellow
as an accent rather than a base color. Structural differences are
appropriate to the two products rather than drift: marketplace is a
marketing surface (hero video, bold `1.5px solid var(--ink)` bordered CTA
cards, feature-tab showcase) while fleet is a dense internal dashboard
(5-column stat grids, data tables, no hero treatment) — that's the right
call for an ops tool, not inconsistency.

## Flagged, not changed (subjective / low-value to force)

- `aria-current="false"` is explicitly set on inactive marketplace nav
  links; fleet simply omits the attribute on inactive links. Both are valid
  ARIA, but if you want one convention across products, marketplace's
  explicit-false pattern is the stricter one to standardize on.
- Both stylesheets use ad-hoc radius values outside the documented
  10/16/999 set (12px, 14px, 18px, 20px, 32px show up in both files for
  smaller nested elements). Consistent between the two products, just
  undocumented — worth adding to the brand guidelines as an official small
  radius token rather than treating it as three one-off exceptions.

---

## Follow-up audit — 2026-07-10

Scope: all 9 current pages (`index`, `fuel`, `maintenance`, `geofences`,
`utilisation`, `timesheet`, `alerts`, `cost-roi`, `reports`), `css/styles.css`
(232 lines), and a full line-by-line read of `js/main.js` (827 lines after
fixes). `frontend-checklist` MCP server unreachable in this session too —
applied its categories manually again, same as the 2026-07-09 pass, plus a
full JS re-read prompted by two runtime bugs found and fixed earlier the same
day (mojibake corruption from a bad `fix2.py` find-replace, and escaped
template-literal backticks that silently broke every page's data rendering).

### Fixed this pass

- **Dead "Play" button in Trip History modal.** `index.html`'s
  `#trip-play-btn` had no event listener anywhere in `main.js` — clicking it
  did nothing. The scrubber was drag-only. Added real play/pause animation:
  extracted the drag handler's percent-to-UI logic into a shared
  `setScrubberPercent()`, wired the button to auto-advance the scrubber
  (~80ms tick), toggle Play/Pause label, stop at trip end, and reset on
  vehicle/date change.
- **Wrong domain in "Share tracking link."** `renderDetail()` in `main.js`
  built the share URL as `https://dozr-fleet.vercel.app/track/{id}` (with a
  hyphen) — that domain doesn't exist. The real deployment is
  `dozrfleet.vercel.app`. Fixed the template string.
- **Hardcoded hex outside the token set.** `css/styles.css` had
  `background: #FDEDED` inline on the critical/offline/overdue status-chip
  rule instead of a custom property, unlike every other color in the file.
  Added `--error-tint: #FDEDED` to `:root` and pointed the rule at it.
- **Timesheet date input skipped the site's label convention.**
  `timesheet.html` used `aria-label="Date Picker"` plus one-off inline styles
  (`border-radius: 8px` — off the 10/16/999 token set, duplicating what
  `.search-field` already provides) instead of the `<label for>` pattern used
  everywhere else (see the search field in the header). Replaced with a real
  `<label class="search-field" for="timesheet-date">` wrapping the input,
  matching the existing pill-shaped search field exactly — no new CSS needed,
  and it removes the last off-token radius introduced by inline styles.

### Checked, no issue found

- No duplicate `id` attributes within any single page.
- No `target="_blank"` links anywhere (nothing to add `rel="noopener"` to).
- No `outline: none` in the stylesheet — default focus rings are intact on
  every interactive element (buttons, nav links, tabs, asset/zone/site
  rows). Only `.nav-toggle` has a custom `:focus-visible` treatment; nothing
  else needs one since nothing suppresses the browser default.
- All 9 pages: consistent `<html lang>`, charset, viewport, per-page
  `<title>`/meta description, favicon, font preconnect + `display=swap`,
  deferred scripts, skip-link, screen-reader-only `<h1>`, `aria-current` on
  the active nav item, proper `<th scope="col">` on both data tables.
  Byte-for-byte identical shared sidebar/header markup across all 9 (same
  rule as marketplace's shared header/footer).
- `data/fleet.js` defines every key `main.js` reads across all 9 pages
  (`sites`, `assets`, `geofences`, `events`, `maintenance`, `reports`,
  `recentReports`, `alertsFeed`, `drivers`) — no more silent-empty-render
  risk from a missing data key.
- Responsive breakpoints present (`max-width: 1150px / 1100px / 760px`) —
  sidebar collapses to an off-canvas drawer with `data-open` state below
  1100px.

### Known/deliberate, not changed

- Ad-hoc radius values (12px/14px/18px/20px) outside the 10/16/999 token set
  remain, same as flagged 2026-07-09 — this is an established, consistent
  pattern across both `fleet/` and `marketplace/`, not new drift. Still
  recommend formalizing a documented "small" radius token rather than
  treating each as a one-off.
- `filter-maint` KPI click handler uses `Math.random()` to fake which map
  markers dim (explicitly commented `// Mock filter` in the source) — left
  as-is, it's marked placeholder behavior tied to mock data, not a bug.

### Platform note for future edits in this folder

`Edit` on files in this mounted folder silently truncated writes twice this
session (`main.js` cut off mid-statement at line 792 of an intended 827;
`styles.css` cut off mid-word in the last media query). Both were caught by
running `node --check` / `diff` immediately after and rebuilt safely by
reconstructing the full file from `git show HEAD:<path>` plus the intended
change in a scratch directory, verifying there, then overwriting the mounted
file with `cat fixed.js > target.js` (which doesn't require deleting the
original, unlike whatever `Edit` does under the hood). Worth doing that
verify-after-write step by default for any further edits here, not just when
something looks obviously wrong.
