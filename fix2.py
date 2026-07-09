import glob

files = glob.glob('*.html') + ['css/styles.css', 'js/main.js']

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if '' in content:
        # Replace the close button specifically first
        content = content.replace('<button class="close-btn" onclick="document.getElementById(\'trip-history-modal\').close()"></button>', '<button class="close-btn" onclick="document.getElementById(\'trip-history-modal\').close()">×</button>')
        
        # Replace the rest with em-dash
        content = content.replace('', '—')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Fixed {f}')
