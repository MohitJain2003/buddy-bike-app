import os
import glob

html_files = glob.glob('*.html')
for file in html_files:
    if file == 'index.html':
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Replace three-bg.js with particles-bg.js
    if 'src="js/three-bg.js"' in content:
        content = content.replace('src="js/three-bg.js"', 'src="js/particles-bg.js"')
        modified = True
    
    # Check if particles-bg is there now
    if 'js/particles-bg.js' not in content:
        # Check if three.min.js is there
        three_js_tag = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
        particles_tag = '    <script src="js/particles-bg.js"></script>\n'
        
        insert_string = ''
        if 'three.min.js' not in content:
            insert_string += '    ' + three_js_tag
        insert_string += particles_tag
        
        # Insert before </head>
        content = content.replace('</head>', f'{insert_string}</head>')
        modified = True
        
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
