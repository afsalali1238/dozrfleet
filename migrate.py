import os
import re

files = [
    'alerts.html', 'cost-roi.html', 'fuel.html', 'geofences.html',
    'index.html', 'maintenance.html', 'reports.html', 'timesheet.html', 'utilisation.html'
]

# 1. HTML Migration
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    links_match = re.search(r'<nav class="links"[^>]*>(.*?)</nav>', content, re.DOTALL)
    links_html = links_match.group(1) if links_match else ''
    links_html = re.sub(r'<a href="trip-history\.html"[^>]*>Trip History</a>\s*', '', links_html)

    actions_match = re.search(r'<div class="nav-actions">(.*?)</div>\s*</div>\s*</header>', content, re.DOTALL)
    actions_html = actions_match.group(1) if actions_match else ''

    new_header = f'''  <div class="app-layout">
    <aside class="app-sidebar" data-nav-menu data-open="false">
      <a class="logo" href="index.html" aria-label="Dozr Fleet home">
        <span class="logo-mark"><svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M12 6c-2 0-3.2 1.3-3.2 3.4V18.5h4.4V11c0-1.1.5-1.7 1.5-1.7H17V6z" fill="var(--yellow)"/><path d="M14.5 14.5 21.5 18" stroke="var(--yellow)" stroke-width="3" stroke-linecap="round"/><circle cx="22.5" cy="20.5" r="2.6" fill="var(--yellow)"/><path d="M6.5 24H18" stroke="var(--yellow)" stroke-width="3" stroke-linecap="round"/></svg></span>
        <span>dozr fleet</span>
      </a>
      <nav class="links" aria-label="Primary">
{links_html}
      </nav>
    </aside>

    <div class="app-content">
      <header class="app-header">
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false">Menu</button>
        <div class="nav-actions">
{actions_html}
        </div>
      </header>

      <main id="main-content">'''

    content = re.sub(r'<header class="site-nav">.*?</header>\s*<main id="main-content">', new_header, content, flags=re.DOTALL)
    content = re.sub(r'</main>\s*(<script)', r'      </main>\n    </div>\n  </div>\n\n  \1', content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Add Modal to index.html
modal_html = '''
  <dialog id="trip-history-modal" class="modal">
    <div class="modal-content" style="width: 1000px;">
      <div class="modal-header">
        <h3>Trip History & Playback</h3>
        <button class="close-btn" onclick="document.getElementById('trip-history-modal').close()">×</button>
      </div>
      <div class="modal-body">
        <div class="sidebar-layout">
          <aside class="panel">
            <div class="panel-header">
              <h3>Trip Selection</h3>
            </div>
            <div class="panel-body" style="display: flex; flex-direction: column; gap: 16px;">
              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span class="eyebrow">Vehicle</span>
                <select id="trip-vehicle-select" class="form-input">
                  <!-- Populated by JS -->
                </select>
              </label>
              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span class="eyebrow">Date</span>
                <input type="date" id="trip-date-select" value="2026-07-09" class="form-input">
              </label>
            </div>
            <div class="panel-header" style="margin-top: 16px; border-top: 1px solid var(--line); padding-top: 16px;">
              <h3>Trip Details</h3>
            </div>
            <div class="panel-body" id="trip-details-panel">
              <p class="text-muted">Select a vehicle and date to view trip history.</p>
            </div>
          </aside>

          <section class="panel map-card" aria-label="Trip playback view" style="flex: 1; display: flex; flex-direction: column; grid-template-columns: 1fr;">
            <div class="map-surface" role="img" aria-label="Trip route map" style="flex: 1; min-height: 400px; position: relative;">
              <svg viewBox="0 0 640 480" aria-hidden="true" id="trip-map-svg">
                <rect x="0" y="0" width="640" height="480" fill="rgba(255,255,255,0.35)"></rect>
              </svg>
              <div id="trip-map-markers" class="map-markers"></div>
            </div>
            
            <div style="padding: 16px; background: var(--surface); border-top: 1px solid var(--line);">
              <div style="display: flex; align-items: center; gap: 16px;">
                <button class="btn btn-secondary" id="trip-play-btn" type="button" style="min-width: 80px;">Play</button>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-size: 13px; font-family: 'Space Mono', monospace; color: var(--slate);">
                    <span id="trip-start-time">--:--</span>
                    <span id="trip-current-time" style="color: var(--ink); font-weight: bold;">--:--</span>
                    <span id="trip-end-time">--:--</span>
                  </div>
                  <div id="trip-scrubber-track" style="position: relative; width: 100%; height: 6px; background: var(--line); border-radius: 3px; margin: 8px 0; cursor: pointer;">
                    <div id="trip-scrubber-fill" style="position: absolute; top: 0; left: 0; height: 100%; background: var(--green); border-radius: 3px; width: 0%;"></div>
                    <div id="trip-scrubber-handle" style="position: absolute; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: var(--surface); border: 2px solid var(--ink); border-radius: 50%; left: 0%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </dialog>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()
idx_content = idx_content.replace('      </main>', f'{modal_html}\n      </main>')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)

# 3. CSS Migration
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Strip out .site-nav block and .links row-based styles completely
css = re.sub(r'\.site-nav \{.*?\}\n', '', css)
css = re.sub(r'\.site-nav \.container \{.*?\}\n', '', css)
css = re.sub(r'\.links \{ display: flex; align-items: center; gap: 18px; margin-left: 12px; flex-wrap: wrap; \}\n', '', css)
css = re.sub(r'\.links a \{ text-decoration: none; color: var\(--slate\); font-size: 14px; \}\n', '', css)
css = re.sub(r'\.links a\[aria-current="page"\] \{ color: var\(--ink\); font-weight: 700; \}\n', '', css)
css = re.sub(r'\.site-nav \.links \{.*?z-index: 50;\n\}\n', '', css, flags=re.DOTALL)
css = re.sub(r'\.site-nav \.links\[data-open="true"\] \{ display: flex; \}\n', '', css)

# Make nav-toggle hidden by default
css = css.replace('.nav-toggle {\n  display: inline-flex;', '.nav-toggle {\n  display: none;')

app_css = '''
/* App Layout */
.app-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.app-sidebar { background: var(--surface); border-right: 1px solid var(--line); display: flex; flex-direction: column; padding: var(--space-3) 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; z-index: 50; transition: transform 0.3s; }
.app-sidebar .logo { padding: 0 var(--space-3); margin-bottom: var(--space-4); }
.app-sidebar .links { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0 var(--space-2); }
.app-sidebar .links a { display: flex; align-items: center; padding: 10px 16px; border-radius: var(--radius-button); text-decoration: none; color: var(--slate); font-weight: 600; font-size: 14px; transition: background 0.2s, color 0.2s; }
.app-sidebar .links a:hover { background: var(--canvas); color: var(--ink); }
.app-sidebar .links a[aria-current="page"] { background: var(--yellow-tint); color: var(--ink); }

.app-content { display: flex; flex-direction: column; min-width: 0; }
.app-header { background: var(--canvas); padding: 16px 24px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 40; }
.app-header .nav-actions { margin-left: auto; display: flex; align-items: center; gap: 12px; }

/* Modal */
.modal { padding: 0; border: 0; border-radius: var(--radius-card); background: transparent; }
.modal::backdrop { background: rgba(20, 21, 24, 0.6); backdrop-filter: blur(4px); }
.modal-content { background: var(--canvas); width: 90vw; max-width: 1000px; border-radius: var(--radius-card); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
.modal-header { padding: 16px 24px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--surface); }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.close-btn { background: transparent; border: 0; font-size: 24px; line-height: 1; cursor: pointer; color: var(--slate); padding: 4px 8px; border-radius: 8px; }
.close-btn:hover { background: var(--line); color: var(--ink); }

@media (max-width: 1100px) {
  .app-layout { grid-template-columns: 1fr; }
  .app-sidebar { position: fixed; transform: translateX(-100%); width: 280px; box-shadow: 0 0 40px rgba(0,0,0,0.1); }
  .app-sidebar[data-open="true"] { transform: translateX(0); }
  .nav-toggle { display: inline-flex; margin-right: auto; }
}
'''
with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css + app_css)

# 4. Update main.js
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = re.sub(r'if \(page === "trip-history"\) renderTripHistory\(fleet\);\n', '', js)
js = js.replace('initMobileNav();', 'initMobileNav();\n  renderTripHistory(fleet);')

add_btn = '''
  const replayBtn = Array.from(document.querySelectorAll(".map-control button")).find(b => b.textContent.includes("Route Replay"));
  const modal = document.getElementById("trip-history-modal");
  if (replayBtn && modal) {
    replayBtn.addEventListener("click", () => {
      modal.showModal();
      loadTrip();
    });
  }
'''
js = js.replace('select.addEventListener("change", loadTrip);', 'select.addEventListener("change", loadTrip);\n' + add_btn)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 5. Delete trip-history.html
if os.path.exists('trip-history.html'):
    os.remove('trip-history.html')

print("Migration completed cleanly.")
