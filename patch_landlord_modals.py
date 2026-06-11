import re

files_to_patch = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/verification.html'
]

logout_modal_html = """  <!-- Logout Modal -->
  <div class="db-modal-overlay" id="logoutModal">
    <div class="db-modal-content" style="max-width: 400px; text-align: center;">
      <div style="margin-bottom: 20px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--danger-color);">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </div>
      <h3 style="margin-bottom: 10px; font-size: 1.25rem;">Log Out</h3>
      <p style="color: var(--text-light); margin-bottom: 24px;">Are you sure you want to log out of your account?</p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="db-btn-outline" onclick="closeLogoutModal()">Cancel</button>
        <button class="db-btn-primary" onclick="Utils.logout()" style="background-color: var(--danger-color); border-color: var(--danger-color);">Log Out</button>
      </div>
    </div>
  </div>"""

missing_js = """
    function showSettingsModal() {
      switchProfileTab('settings');
      // Close profile menu if open
      const menu = document.getElementById('profileMenu');
      if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
      }
      const modal = document.getElementById('profileModalOverlay');
      if (modal) {
        modal.classList.add('show');
      }
    }

    function showLogoutModal() {
      // Close profile menu if open
      const menu = document.getElementById('profileMenu');
      if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
      }
      
      const modal = document.getElementById('logoutModal');
      if (modal) {
        modal.classList.add('show');
      }
    }

    function closeLogoutModal() {
      const modal = document.getElementById('logoutModal');
      if (modal) {
        modal.classList.remove('show');
      }
    }
"""

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Replace Utils.logout() with showLogoutModal() in the navbar
    content = content.replace("onclick=\"event.preventDefault(); Utils.logout();\"", "onclick=\"event.preventDefault(); showLogoutModal();\"")

    # 2. Add logoutModal html right before <!-- Terms Modal --> or </body> if missing
    if 'id="logoutModal"' not in content:
        if '<!-- Terms Modal -->' in content:
            content = content.replace('<!-- Terms Modal -->', logout_modal_html + '\n\n  <!-- Terms Modal -->')
        elif '<!-- Mobile Navigation -->' in content:
            content = content.replace('<!-- Mobile Navigation -->', logout_modal_html + '\n\n  <!-- Mobile Navigation -->')
        else:
            content = content.replace('</body>', logout_modal_html + '\n</body>')

    # 3. Add JS functions
    if 'function showSettingsModal()' not in content:
        # Find where to inject it. Let's put it right after switchProfileTab
        content = re.sub(r'(function switchProfileTab[^}]+\})', r'\1\n' + missing_js, content)

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Patched {filepath}")

