import re

dashboard_path = 'pages/student/dashboard.html'
saved_path = 'pages/student/saved.html'
messages_path = 'pages/student/messages.html'

with open(dashboard_path, 'r') as f:
    dashboard_content = f.read()

# Extract from the <script> just before toggleProfileMenu to the end of file
match = re.search(r'(<script>\s*function toggleProfileMenu\(\).*?</html>)', dashboard_content, flags=re.DOTALL)
if not match:
    print("Could not find script block in dashboard.html")
    exit(1)

extracted_block = match.group(1)

for filepath in [saved_path, messages_path]:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We might have different preceding comments or whitespace.
    # We match <script>\s*(?:// Toggle Profile Menu\s*)?function toggleProfileMenu\(\)
    replace_match = re.search(r'(<script>\s*(?:// Toggle Profile Menu\s*)?function toggleProfileMenu\(\).*?</html>)', content, flags=re.DOTALL)
    if replace_match:
        content = content[:replace_match.start()] + extracted_block
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Successfully patched {filepath}")
    else:
        print(f"Could not find target script block in {filepath}")

