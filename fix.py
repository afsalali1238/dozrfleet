import os
import re

files = [
    'alerts.html', 'cost-roi.html', 'fuel.html', 'geofences.html',
    'index.html', 'maintenance.html', 'reports.html', 'timesheet.html', 'utilisation.html'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove inline style display:none from nav-toggle
    content = content.replace('style="display: none;"', '')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# Clean up styles.css
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove old site-nav and links styles that conflict
css = re.sub(r'\.site-nav.*?z-index: 50;\n}', '', css, flags=re.DOTALL)
css = re.sub(r'\.site-nav \.links\[data-open="true"\] \{ display: flex; \}', '', css)
css = re.sub(r'\.links \{ display: flex; align-items: center; gap: 18px; margin-left: 12px; flex-wrap: wrap; \}\n\.links a \{ text-decoration: none; color: var\(--slate\); font-size: 14px; \}\n\.links a\[aria-current="page"\] \{ color: var\(--ink\); font-weight: 700; \}', '', css)

# Make nav-toggle hidden by default, and visible only on mobile
css = re.sub(r'\.nav-toggle \{\n  display: inline-flex;', '.nav-toggle {\n  display: none;', css)

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
