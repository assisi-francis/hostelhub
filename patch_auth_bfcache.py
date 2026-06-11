import glob

files = glob.glob('pages/student/*.html') + glob.glob('pages/landlord/*.html')

old_script = """  <script>
    if (!localStorage.getItem('user')) {
      window.location.href = '../../index.html';
    }
  </script>"""

new_script = """  <script>
    function checkAuth() {
      if (!localStorage.getItem('user')) {
        window.location.replace('../../index.html');
      }
    }
    checkAuth();
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
        checkAuth();
      }
    });
  </script>"""

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    if old_script in content:
        content = content.replace(old_script, new_script)
        with open(file, 'w') as f:
            f.write(content)
        print(f"Patched {file}")
    else:
        print(f"Skipped {file} (old script not found)")

