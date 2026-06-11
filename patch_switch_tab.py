import re

files_to_patch = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/messages.html',
    'pages/landlord/verification.html'
]

old_func_regex = r"function switchProfileTab\(tabId\)\s*\{\s*document\.querySelectorAll\('.db-profile-tab'\)\.forEach\(t\s*=>\s*t\.classList\.remove\('active'\)\);\s*document\.querySelectorAll\('.profile-tab-content'\)\.forEach\(c\s*=>\s*c\.style\.display\s*=\s*'none'\);\s*event\.currentTarget\.classList\.add\('active'\);\s*const content\s*=\s*document\.getElementById\('tab-'\s*\+\s*tabId\);\s*if \(content\)\s*content\.style\.display\s*=\s*'block';\s*\}"

new_func = """function switchProfileTab(tabId) {
      document.querySelectorAll('.db-profile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.profile-tab-content').forEach(c => c.style.display = 'none');
      
      const targetTab = document.querySelector(`.db-profile-tab[onclick*="${tabId}"]`);
      if (targetTab) {
        targetTab.classList.add('active');
      }
      
      const content = document.getElementById('tab-' + tabId);
      if (content) content.style.display = 'block';
    }"""

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()

    # If it still uses event.currentTarget, replace it
    if "event.currentTarget.classList.add('active');" in content:
        content = re.sub(old_func_regex, new_func, content, flags=re.MULTILINE)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Skipped {filepath}")

