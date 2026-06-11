files_to_patch = [
    'css/student-dashboard.css',
    'css/landlord-dashboard.css'
]

append_css = """

/* Fix for tap-to-click on dropdown menu items */
.db-profile-menu-item * {
  pointer-events: none;
}
"""

for filepath in files_to_patch:
    with open(filepath, 'a') as f:
        f.write(append_css)
    print(f"Appended to {filepath}")

