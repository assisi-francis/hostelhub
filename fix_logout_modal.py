import re

files_to_patch = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/verification.html'
]

correct_html = """  <div class="db-modal-overlay" id="logoutModal">
    <div class="db-modal-content">
      <div class="db-modal-icon-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </div>
      <h2 class="db-modal-title">Log out?</h2>
      <p class="db-modal-text">Are you sure you want to log out?<br/>You can always log back in anytime.</p>
      <div class="db-modal-actions">
        <button class="db-btn-danger" onclick="Utils.logout()">Yes, Log Out</button>
        <button class="db-btn-outline" onclick="closeLogoutModal()">Cancel</button>
      </div>
    </div>
  </div>"""

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()

    # The regex matches from <div class="db-modal-overlay" id="logoutModal"> up to the second </div>\n  </div>
    # It's easier to just match the start and look for the end of the modal.
    # The modal we injected had <div class="db-modal-overlay" id="logoutModal"> ... </div>  </div>
    
    new_content = re.sub(
        r'<div class="db-modal-overlay" id="logoutModal">.*?</div>\s*</div>', 
        correct_html, 
        content, 
        flags=re.DOTALL
    )
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"Fixed {filepath}")

