import re
import glob

files = glob.glob('pages/landlord/*.html') + glob.glob('pages/student/*.html')

auth_script_pattern = re.compile(r'<script>\s*function checkAuth\(\)\s*\{\s*if \(\!localStorage\.getItem\(\'user\'\)\)\s*\{\s*window\.location\.replace\(\'\.\./\.\./index\.html\'\);\s*\}\s*\}\s*checkAuth\(\);\s*window\.addEventListener\(\'pageshow\', function\(event\)\s*\{\s*if \(event\.persisted\)\s*\{\s*checkAuth\(\);\s*\}\s*\}\);\s*</script>', re.DOTALL)

profile_script_pattern = re.compile(r'<script>\s*(?:// Toggle Profile Menu\s*)?function toggleProfileMenu\(\).*?</script>', re.DOTALL)

# Patterns for robotic HTML comments to remove
html_comments_to_remove = [
    r'<!-- Main Content Container -->\s*',
    r'<!-- Search Bar Section -->\s*',
    r'<!-- Header -->\s*',
    r'<!-- Tabs -->\s*',
    r'<!-- Cards Grid -->\s*',
    r'<!-- Card \d+ -->\s*',
    r'<!-- Footer -->\s*',
    r'<!-- Profile Modal -->\s*',
    r'<!-- Logout Confirmation Modal -->\s*',
    r'<!-- Script for toggling Profile Menu & Modals -->\s*',
    r'<!-- Left: Logo -->\s*',
    r'<!-- Center: Navigation Links -->\s*',
    r'<!-- Right: Icons -->\s*',
    r'<!-- User Profile Dropdown Container -->\s*',
    r'<!-- Dropdown Menu -->\s*',
    r'<!-- Personal Info Tab Content -->\s*',
    r'<!-- Settings Tab Content -->\s*',
    r'<!-- Tab Navigation -->\s*',
    r'<!-- Page Header -->\s*',
    r'<!-- Welcome Header -->\s*',
    r'<!-- Stats Grid -->\s*',
    r'<!-- Filters -->\s*',
    r'<!-- Add Listing Modal -->\s*',
    r'<!-- Photo Upload -->\s*',
    r'<!-- Amenities Section -->\s*',
    r'<!-- Modals -->\s*'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # 1. Replace auth guard
    content = auth_script_pattern.sub('<script src="../../js/auth-guard.js"></script>', content)

    # 2. Replace profile scripts
    content = profile_script_pattern.sub('<script src="../../js/profile.js"></script>', content)

    # 3. Clean up HTML comments
    for comment_regex in html_comments_to_remove:
        content = re.sub(comment_regex, '', content, flags=re.IGNORECASE)

    with open(file_path, 'w') as f:
        f.write(content)
        
    print(f"Cleaned up {file_path}")

