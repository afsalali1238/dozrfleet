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
