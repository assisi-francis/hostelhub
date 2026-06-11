import os

files = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/verification.html'
]

toggle_js = """
    function toggleProfileMenu() {
      const menu = document.getElementById('profileMenu');
      if (menu) menu.classList.toggle('show');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      const menu = document.getElementById('profileMenu');
      const btn = document.getElementById('profileMenuBtn');
      if (menu && btn && !btn.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('show');
      }
    });
"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if 'function toggleProfileMenu()' not in content:
        # insert before function showProfileModal()
        content = content.replace('function showProfileModal() {', toggle_js + '\n    function showProfileModal() {')
        with open(file_path, 'w') as f:
            f.write(content)

print("Toggle patched.")
