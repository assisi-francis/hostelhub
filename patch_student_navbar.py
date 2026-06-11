import re

files_to_patch = [
    'pages/student/saved.html',
    'pages/student/messages.html'
]

old_html = """        <button class="db-icon-btn" aria-label="User Profile" id="profileMenuBtn" onclick="toggleProfileMenu()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>"""

new_html = """        <button class="db-icon-btn" aria-label="User Profile" id="profileMenuBtn" onclick="toggleProfileMenu()" style="overflow: hidden; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center;">
          <img id="navbarAvatarImg" src="" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
          <svg id="navbarAvatarSvg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>"""

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if old_html in content:
        content = content.replace(old_html, new_html)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Skipped {filepath} - HTML not found exactly as expected.")

