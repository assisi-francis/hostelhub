import os
import glob

files = glob.glob('pages/student/*.html') + glob.glob('pages/landlord/*.html')
auth_script = """  <script>
    if (!localStorage.getItem('user')) {
      window.location.href = '../../index.html';
    }
  </script>"""

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    head_content = content[:content.find('</head>')]
    if "localStorage.getItem('user')" not in head_content:
        content = content.replace('<head>', '<head>\n' + auth_script)
        with open(file, 'w') as f:
            f.write(content)
        print(f"Patched {file}")
    else:
        print(f"Skipped {file} (already patched)")
