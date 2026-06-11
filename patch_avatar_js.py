import os

files = [
    'pages/landlord/dashboard.html',
    'pages/landlord/listings.html',
    'pages/landlord/messages.html',
    'pages/landlord/verification.html'
]

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

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    if 'function showProfileModal' not in content:
        # Find last </script>
        parts = content.rsplit('</script>', 1)
        content = parts[0] + js_code + '\n</script>' + parts[1]

    with open(file_path, 'w') as f:
        f.write(content)

print("JS patch completed successfully.")
