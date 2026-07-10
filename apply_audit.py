import glob
import re

html_files = glob.glob('*.html')

nav_replacement = '''
        <div class="nav-group-label">Operate</div>
        <a href="index.html"{fleet_map_aria}>Fleet Map</a>
        <a href="timesheet.html"{timesheet_aria}>Timesheet</a>
        
        <div class="nav-group-label">Monitor</div>
        <a href="fuel.html"{fuel_aria}>Fuel</a>
        <a href="maintenance.html"{maintenance_aria}>Maintenance</a>
        <a href="geofences.html"{geofences_aria}>Geofences</a>
        <a href="alerts.html"{alerts_aria}>Alerts Center</a>

        <div class="nav-group-label">Analyze</div>
        <a href="utilisation.html"{utilisation_aria}>Utilisation</a>
        <a href="cost-roi.html"{cost_roi_aria}>Cost &amp; ROI</a>
        <a href="reports.html"{reports_aria}>Reports</a>
'''

def get_action_for_page(page_name):
    if page_name == 'maintenance.html': return 'Book service'
    if page_name == 'reports.html': return 'New Report'
    if page_name == 'geofences.html': return '+ Add Zone'
    if page_name == 'alerts.html': return 'Configure Alerts'
    if page_name == 'timesheet.html': return 'Export Data'
    if page_name == 'fuel.html': return 'Log Fuel Event'
    if page_name in ['utilisation.html', 'cost-roi.html']: return 'Export Data'
    return '+ Add Asset'

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Nav Grouping
    # Find existing links block
    links_match = re.search(r'<nav class="links" aria-label="Primary">(.*?)</nav>', content, re.DOTALL)
    if links_match:
        # Determine which one has aria-current
        arias = {
            'fleet_map_aria': ' aria-current="page"' if 'href="index.html" aria-current="page"' in links_match.group(1) or ('index.html' == f and 'aria-current' not in links_match.group(1)) else '',
            'fuel_aria': ' aria-current="page"' if 'href="fuel.html" aria-current="page"' in links_match.group(1) else '',
            'maintenance_aria': ' aria-current="page"' if 'href="maintenance.html" aria-current="page"' in links_match.group(1) else '',
            'geofences_aria': ' aria-current="page"' if 'href="geofences.html" aria-current="page"' in links_match.group(1) else '',
            'utilisation_aria': ' aria-current="page"' if 'href="utilisation.html" aria-current="page"' in links_match.group(1) else '',
            'timesheet_aria': ' aria-current="page"' if 'href="timesheet.html" aria-current="page"' in links_match.group(1) else '',
            'alerts_aria': ' aria-current="page"' if 'href="alerts.html" aria-current="page"' in links_match.group(1) else '',
            'cost_roi_aria': ' aria-current="page"' if 'href="cost-roi.html" aria-current="page"' in links_match.group(1) else '',
            'reports_aria': ' aria-current="page"' if 'href="reports.html" aria-current="page"' in links_match.group(1) else '',
        }
        new_nav = nav_replacement.format(**arias)
        content = content.replace(links_match.group(1), new_nav)
    
    # 2. Contextual Primary Action
    # <button class="btn btn-primary" type="button">+ Add Asset</button>
    action_text = get_action_for_page(f)
    content = re.sub(r'<button class="btn btn-primary" type="button">.*?</button>', f'<button class="btn btn-primary" type="button">{action_text}</button>', content)

    # 3. Nested Panels in index.html and others
    # In index.html: <div class="panel" style="margin-top:16px;"> <div class="panel-header"><h3>Sites</h3>...
    if f == 'index.html':
        nested_sites = '''<div class="panel" style="margin-top:16px;">
              <div class="panel-header">
                <h3>Sites</h3>
              </div>
              <div class="panel-body">
                <div class="site-list" id="site-list"></div>
              </div>
            </div>'''
        replacement_sites = '''<div class="divider" style="margin-top:16px; margin-bottom:12px; border-top: 1px solid var(--line);"></div>
            <div class="eyebrow" style="margin-bottom: 8px;">Sites</div>
            <div class="site-list" id="site-list"></div>'''
        content = content.replace(nested_sites, replacement_sites)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("HTML transformations done.")

# 4. main.js stat-cards and nested panels
with open('js/main.js', 'r', encoding='utf-8') as file:
    js = file.read()

# Shrink stat-cards (from vertical to horizontal)
# <article class="stat-card clickable" data-filter="${card.id}">\n      <div class="eyebrow">${card.label}</div>\n      <strong>${card.value}</strong>\n      <span>${card.meta}</span>\n    </article>
old_stat_card = '''    <article class="stat-card clickable" data-filter="${card.id}">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>'''
new_stat_card = '''    <article class="stat-card clickable" data-filter="${card.id}" style="display: flex; flex-direction: column; gap: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div class="eyebrow">${card.label}</div>
        <span style="font-size: 10px; color: var(--slate);">${card.meta}</span>
      </div>
      <strong>${card.value}</strong>
    </article>'''
js = js.replace(old_stat_card, new_stat_card)

# Non-clickable stat-cards
old_stat_card_2 = '''    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>'''
new_stat_card_2 = '''    <article class="stat-card" style="display: flex; flex-direction: column; gap: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div class="eyebrow">${card.label}</div>
        <span style="font-size: 10px; color: var(--slate);">${card.meta}</span>
      </div>
      <strong>${card.value}</strong>
    </article>'''
js = js.replace(old_stat_card_2, new_stat_card_2)

old_summary_card = '''    <article class="summary-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>'''
new_summary_card = '''    <article class="summary-card" style="display: flex; flex-direction: column; gap: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div class="eyebrow">${card.label}</div>
        <span style="font-size: 10px; color: var(--slate);">${card.meta}</span>
      </div>
      <strong>${card.value}</strong>
    </article>'''
js = js.replace(old_summary_card, new_summary_card)


# Nested Fuel Status panel
old_fuel_status = '''    <div class="panel" style="margin-top: 16px;">
      <div class="panel-body">
        <div class="eyebrow">Fuel status</div>
        <p><strong>${asset.fuelLevel}%</strong> of tank remaining · ${asset.fuelCapacity}L capacity</p>
      </div>
    </div>'''
new_fuel_status = '''    <div class="divider" style="margin-top: 16px; margin-bottom: 12px; border-top: 1px solid var(--line);"></div>
    <div class="eyebrow" style="margin-bottom: 8px;">Fuel status</div>
    <p><strong>${asset.fuelLevel}%</strong> of tank remaining · ${asset.fuelCapacity}L capacity</p>'''
js = js.replace(old_fuel_status, new_fuel_status)

with open('js/main.js', 'w', encoding='utf-8') as file:
    file.write(js)

print("JS transformations done.")

# 5. CSS updates
with open('css/styles.css', 'r', encoding='utf-8') as file:
    css = file.read()

nav_group_css = '''
.nav-group-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--slate); font-weight: 700; margin: 12px 10px 4px; }
.nav-group-label:first-child { margin-top: 4px; }
'''

if '.nav-group-label' not in css:
    css = css + nav_group_css

# Tighten global padding/margins
css = css.replace('padding: 16px 0 32px;', 'padding: 12px 0 24px;')
css = css.replace('gap: 12px;', 'gap: 8px;')
css = css.replace('margin-top: 16px;', 'margin-top: 12px;')

with open('css/styles.css', 'w', encoding='utf-8') as file:
    file.write(css)

print("CSS transformations done.")
