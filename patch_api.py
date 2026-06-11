import os

files = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/messages.html',
    'pages/landlord/verification.html'
]

script_tag = '<script src="../../js/api.js"></script>'

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if script_tag not in content:
        # replace <script src="../../js/utils.js"></script> with both
        if '<script src="../../js/utils.js"></script>' in content:
            content = content.replace('<script src="../../js/utils.js"></script>', '<script src="../../js/utils.js"></script>\n  ' + script_tag)
            with open(file_path, 'w') as f:
                f.write(content)
        elif '</body>' in content:
            content = content.replace('</body>', '  <script src="../../js/utils.js"></script>\n  ' + script_tag + '\n</body>')
            with open(file_path, 'w') as f:
                f.write(content)

print("API script injected.")
