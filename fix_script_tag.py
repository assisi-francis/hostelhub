import os

files = [
    'pages/landlord/messages.html',
    'pages/landlord/verification.html'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Find the malformed script tag
    bad_tag_start = '<script src="../../js/api.js">'
    if bad_tag_start in content:
        # We know it was originally <script src="../../js/api.js"></script>
        # and we injected code inside it.
        # We should split at the bad tag start
        parts = content.split(bad_tag_start)
        
        # parts[0] is everything before <script src="../../js/api.js">
        # parts[1] is everything inside it + the rest of the file
        
        # we want to close the api.js script tag properly, then start a new one
        fixed_content = parts[0] + '<script src="../../js/api.js"></script>\n<script>' + parts[1]
        
        with open(file_path, 'w') as f:
            f.write(fixed_content)
        print(f"Fixed {file_path}")

