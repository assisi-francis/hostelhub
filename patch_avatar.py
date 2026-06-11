import os

files = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/messages.html',
    'pages/landlord/verification.html'
]

modal_html = """
  <!-- Profile Modal -->
  <div class="db-modal-overlay" id="profileModalOverlay" onclick="if(event.target === this) closeProfileModal()">
    <div class="db-profile-modal-content">
      <div class="db-profile-modal-header">
        <div>
          <h2 class="db-profile-modal-title">Profile</h2>
          <p class="db-profile-modal-subtitle">Manage your profile details and preference settings.</p>
        </div>
        <button class="db-modal-close" aria-label="Close Modal" onclick="closeProfileModal()">×</button>
      </div>
      
      <div class="db-profile-tabs">
        <button class="db-profile-tab active" onclick="switchProfileTab('personal')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Personal Info
        </button>
        <button class="db-profile-tab" onclick="switchProfileTab('settings')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </button>
      </div>

      <div class="db-profile-modal-body">
        <!-- Personal Info Tab Content -->
        <div id="tab-personal" class="profile-tab-content" style="display: block;">
          <div class="db-profile-photo-section">
          <img src="../../assets/images/avatar_adeola.png" alt="Profile Photo" class="db-profile-photo-large" id="profilePhotoImg" />
          <div class="db-profile-photo-info">
            <h3>Profile Photo</h3>
            <p>PNG, JPG or GIF. Max 5MB.</p>
            <div class="db-profile-photo-actions">
              <!-- Hidden file input -->
              <input type="file" id="profileImageInput" accept="image/*" style="display: none;" />
              <button id="uploadAvatarBtn" class="db-btn-primary" onclick="document.getElementById('profileImageInput').click()">Upload New</button>
              <button class="db-btn-light-danger" onclick="document.getElementById('profilePhotoImg').src = '../../assets/images/avatar_adeola.png'">Delete</button>
            </div>
          </div>
        </div>

        <form class="db-profile-form">
          <div class="db-form-group">
            <label>Full Name</label>
            <input type="text" id="profileFullName" value="" readonly />
          </div>
          <div class="db-form-group">
            <label>Email Address</label>
            <input type="email" id="profileEmail" value="" readonly />
          </div>
          <div class="db-form-group">
            <label>Phone Number</label>
            <input type="text" id="profilePhone" value="" readonly />
          </div>
        </form>
        </div>

        <!-- Settings Tab Content -->
        <div id="tab-settings" class="profile-tab-content" style="display: none;">
          <h3 class="db-settings-section-title">Notifications</h3>
          
          <div class="db-settings-card">
            <div class="db-settings-item">
              <div class="db-settings-text">
                <h4>Email Notifications</h4>
                <p>Receive updates about new listings and messages.</p>
              </div>
              <label class="db-toggle-switch">
                <input type="checkbox" checked />
                <span class="db-slider round"></span>
              </label>
            </div>
            
            <div class="db-settings-divider"></div>
            
            <div class="db-settings-item">
              <div class="db-settings-text">
                <h4>SMS Alerts</h4>
                <p>Urgent notifications regarding viewing requests.</p>
              </div>
              <label class="db-toggle-switch">
                <input type="checkbox" checked />
                <span class="db-slider round"></span>
              </label>
            </div>
          </div>

          <div class="db-settings-actions">
            <button class="db-btn-text" onclick="closeProfileModal()">Discard Changes</button>
            <button class="db-btn-primary" onclick="closeProfileModal()">Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  </div>
"""

js_code = """
    function showProfileModal() {
      const menu = document.getElementById('profileMenu');
      if (menu) menu.classList.remove('show');
      const overlay = document.getElementById('profileModalOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
      }
    }

    function switchProfileTab(tabId) {
      document.querySelectorAll('.db-profile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.profile-tab-content').forEach(c => c.style.display = 'none');
      
      event.currentTarget.classList.add('active');
      const content = document.getElementById('tab-' + tabId);
      if (content) content.style.display = 'block';
    }

    function closeProfileModal() {
      const overlay = document.getElementById('profileModalOverlay');
      if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
      }
    }

    // Profile photo upload logic
    const profileImageInput = document.getElementById('profileImageInput');
    if (profileImageInput) {
      profileImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit. Please choose a smaller image.');
            return;
          }

          const reader = new FileReader();
          reader.onload = function(event) {
            const img = new Image();
            img.onload = async function() {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 256;
              const MAX_HEIGHT = 256;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

              const photoImg = document.getElementById('profilePhotoImg');
              if (photoImg) photoImg.src = compressedBase64;
              
              const navAvatarImg = document.getElementById('navbarAvatarImg');
              if (navAvatarImg) {
                navAvatarImg.src = compressedBase64;
                navAvatarImg.style.display = 'block';
              }
              const navAvatarSvg = document.getElementById('navbarAvatarSvg');
              if (navAvatarSvg) navAvatarSvg.style.display = 'none';

              const uploadBtn = document.getElementById('uploadAvatarBtn');
              const originalBtnText = uploadBtn ? uploadBtn.innerHTML : 'Upload New';
              if (uploadBtn) {
                uploadBtn.innerHTML = '<span class="btn-spinner"></span> Saving...';
                uploadBtn.disabled = true;
              }

              if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast("Uploading profile picture...", "info");
              }

              try {
                if (typeof API !== 'undefined' && API.updateAvatar) {
                  await API.updateAvatar(compressedBase64);
                } else {
                  // Fallback update user in localStorage
                  let user = JSON.parse(localStorage.getItem('user'));
                  user.avatar = compressedBase64;
                  localStorage.setItem('user', JSON.stringify(user));
                }
                if (typeof Utils !== 'undefined' && Utils.showToast) {
                  Utils.showToast("Profile picture updated successfully!", "success");
                }
              } catch (err) {
                console.error("Failed to upload avatar:", err);
                if (typeof Utils !== 'undefined' && Utils.showToast) {
                  Utils.showToast("Failed to save avatar.", "error");
                }
              } finally {
                if (uploadBtn) {
                  uploadBtn.innerHTML = originalBtnText;
                  uploadBtn.disabled = false;
                }
              }
            };
            img.src = event.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
    }

    // Populate user profile details on load
    document.addEventListener('DOMContentLoaded', () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const fullName = (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.name;
        
        const fullNameEl = document.getElementById('profileFullName');
        if (fullNameEl) fullNameEl.value = fullName || '';
        
        const emailEl = document.getElementById('profileEmail');
        if (emailEl) emailEl.value = user.email || '';
        
        const phoneEl = document.getElementById('profilePhone');
        if (phoneEl) phoneEl.value = user.phone || 'N/A';
        
        if (user.avatar) {
          const photoImg = document.getElementById('profilePhotoImg');
          if (photoImg) photoImg.src = user.avatar;
          
          const navAvatarImg = document.getElementById('navbarAvatarImg');
          if (navAvatarImg) {
            navAvatarImg.src = user.avatar;
            navAvatarImg.style.display = 'block';
          }
          const navAvatarSvg = document.getElementById('navbarAvatarSvg');
          if (navAvatarSvg) navAvatarSvg.style.display = 'none';
        } else {
          const photoImg = document.getElementById('profilePhotoImg');
          if (photoImg) photoImg.src = '../../assets/images/avatar_adeola.png';
        }
      }
    });
"""

btn_target = """<button class="db-icon-btn" aria-label="User Profile" id="profileMenuBtn" onclick="toggleProfileMenu()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>"""

btn_replace = """<button class="db-icon-btn" aria-label="User Profile" id="profileMenuBtn" onclick="toggleProfileMenu()" style="overflow: hidden; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center;">
          <img id="navbarAvatarImg" src="" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
          <svg id="navbarAvatarSvg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # 1. Replace button
    if btn_target in content:
        content = content.replace(btn_target, btn_replace)

    # 2. Insert modal right before <script src="../../js/utils.js"></script>
    if 'id="profileModalOverlay"' not in content:
        if '<script src="../../js/utils.js"></script>' in content:
            content = content.replace('<script src="../../js/utils.js"></script>', modal_html + '\n  <script src="../../js/utils.js"></script>')
        else:
            # fallback
            content = content.replace('</body>', modal_html + '\n</body>')

    # 3. Insert JS logic inside existing <script> block, right after toggleProfileMenu() or just before closing tag
    # Let's insert right before </script>\n</body> or similar
    if 'showProfileModal()' not in content:
        if '</script>\n</body>' in content:
            content = content.replace('</script>\n</body>', js_code + '\n</script>\n</body>')
        elif '</script>\n  <script src="../../js/utils.js"></script>' in content:
             content = content.replace('</script>\n  <script src="../../js/utils.js"></script>', js_code + '\n</script>\n  <script src="../../js/utils.js"></script>')
        else:
             # Find last </script>
             parts = content.rsplit('</script>', 1)
             content = parts[0] + js_code + '\n</script>' + parts[1]

    with open(file_path, 'w') as f:
        f.write(content)

print("Patch completed successfully.")
