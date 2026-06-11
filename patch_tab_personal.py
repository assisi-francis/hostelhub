import re

files_to_patch = [
    'pages/student/saved.html',
    'pages/student/messages.html'
]

old_html = """        <div id="tab-personal" class="profile-tab-content" style="display: block;">
          <div class="db-profile-photo-section">
          <img src="../../assets/images/avatar_adeola.png" alt="Profile Photo" class="db-profile-photo-large" id="profilePhotoImg" />
          <div class="db-profile-photo-info">
            <h3>Profile Photo</h3>
            <p>PNG, JPG or GIF. Max 5MB.</p>
            <div class="db-profile-photo-actions">
              <!-- Hidden file input -->
              <input type="file" id="profileImageInput" accept="image/*" style="display: none;" />
              <button class="db-btn-primary" onclick="document.getElementById('profileImageInput').click()">Upload New</button>
              <button class="db-btn-light-danger" onclick="document.getElementById('profilePhotoImg').src = '../../assets/images/avatar_adeola.png'">Delete</button>
            </div>
          </div>
        </div>

        <form class="db-profile-form">
          <div class="db-form-group">
            <label>Full Name</label>
            <input type="text" value="Adeola Rotimi" readonly />
          </div>
          <div class="db-form-group">
            <label>Email Address</label>
            <input type="email" value="adeolarotimi@gmail.com" readonly />
          </div>
          <div class="db-form-group">
            <label>Phone Number</label>
            <input type="text" value="0801234567" readonly />
          </div>
          <div class="db-form-group">
            <label>University / School</label>
            <input type="text" value="University of Lagos" readonly />
          </div>
        </form>
        </div>"""

new_html = """        <div id="tab-personal" class="profile-tab-content" style="display: block;">
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
          <div class="db-form-group">
            <label>University / School</label>
            <input type="text" id="profileSchool" value="" readonly />
          </div>
        </form>
        </div>"""

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if old_html in content:
        content = content.replace(old_html, new_html)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Skipped {filepath} - old HTML not found!")

