import re

filepath = 'pages/landlord/messages.html'

with open(filepath, 'r') as f:
    content = f.read()

# Replace the entire switchProfileTab function
old_func_regex = r"function switchProfileTab\(tabName\) \{.*?\}\s*\}"
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

content = re.sub(old_func_regex, new_func, content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)
print(f"Patched {filepath}")

