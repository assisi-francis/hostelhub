function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  const btn = document.getElementById('profileMenuBtn');
  if (menu) {
    menu.classList.toggle('show');
    if (btn) btn.classList.toggle('active');
  }
}

function showProfileModal() {
  switchProfileTab('personal');
  const menu = document.getElementById('profileMenu');
  if (menu && menu.classList.contains('show')) menu.classList.remove('show');
  const modal = document.getElementById('profileModalOverlay');
  if (modal) modal.classList.add('show');
}

function showSettingsModal() {
  switchProfileTab('settings');
  const menu = document.getElementById('profileMenu');
  if (menu && menu.classList.contains('show')) menu.classList.remove('show');
  const modal = document.getElementById('profileModalOverlay');
  if (modal) modal.classList.add('show');
}

function switchProfileTab(tabId) {
  document.querySelectorAll('.db-profile-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.profile-tab-content').forEach(c => c.style.display = 'none');
  
  const targetTab = document.querySelector(`.db-profile-tab[onclick*="${tabId}"]`);
  if (targetTab) targetTab.classList.add('active');
  
  const content = document.getElementById('tab-' + tabId);
  if (content) content.style.display = 'block';
}

function closeProfileModal() {
  const modal = document.getElementById('profileModalOverlay');
  if (modal) modal.classList.remove('show');
}

function showLogoutModal() {
  const menu = document.getElementById('profileMenu');
  if (menu && menu.classList.contains('show')) menu.classList.remove('show');
  
  const modal = document.getElementById('logoutModal');
  if (modal) modal.classList.add('show');
}

function closeLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) modal.classList.remove('show');
}

document.addEventListener('click', function(event) {
  const profileContainer = document.querySelector('.db-profile-dropdown');
  const menu = document.getElementById('profileMenu');
  const btn = document.getElementById('profileMenuBtn');
  
  if (profileContainer && menu && !profileContainer.contains(event.target)) {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      if (btn) btn.classList.remove('active');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const profileImageInput = document.getElementById('profileImageInput');
  if (profileImageInput) {
    profileImageInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5MB limit. Please choose a smaller image.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
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

            document.getElementById('profilePhotoImg').src = compressedBase64;
            document.getElementById('navbarAvatarImg').src = compressedBase64;
            document.getElementById('navbarAvatarImg').style.display = 'block';
            document.getElementById('navbarAvatarSvg').style.display = 'none';

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
              await API.updateAvatar(compressedBase64);
              if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast("Profile picture updated successfully!", "success");
              }
            } catch (err) {
              console.error(err);
              if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast("Failed to save avatar.", "error");
              } else {
                alert("Failed to save avatar.");
              }
            } finally {
              if (uploadBtn) {
                uploadBtn.innerHTML = originalBtnText;
                uploadBtn.disabled = false;
              }
            }
          };
          img.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
  }

  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    const fullName = (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.name;
    const nameEl = document.getElementById('profileFullName');
    if (nameEl) nameEl.value = fullName || '';
    
    const emailEl = document.getElementById('profileEmail');
    if (emailEl) emailEl.value = user.email || '';
    
    const phoneEl = document.getElementById('profilePhone');
    if (phoneEl) phoneEl.value = user.phone || 'N/A';
    
    const schoolEl = document.getElementById('profileSchool');
    if (schoolEl) schoolEl.value = user.school || 'N/A';
    
    if (user.avatar) {
      const imgEl = document.getElementById('profilePhotoImg');
      if (imgEl) imgEl.src = user.avatar;
      
      const navImg = document.getElementById('navbarAvatarImg');
      if (navImg) {
        navImg.src = user.avatar;
        navImg.style.display = 'block';
      }
      
      const navSvg = document.getElementById('navbarAvatarSvg');
      if (navSvg) navSvg.style.display = 'none';
    } else {
      const imgEl = document.getElementById('profilePhotoImg');
      if (imgEl) imgEl.src = '../../assets/images/avatar_adeola.png';
    }
  }
});
