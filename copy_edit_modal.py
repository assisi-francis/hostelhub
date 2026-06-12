import re

listings_file = 'pages/landlord/listings.html'
dashboard_file = 'pages/landlord/dashboard.html'
js_file = 'js/listing-modal.js'

with open(listings_file, 'r') as f:
    listings_html = f.read()

# 1. Extract the modal HTML
# It starts at <div class="ld-modal-overlay" id="addListingModal">
# and ends before <div class="db-profile-dropdown" id="profileModalOverlay"> (Wait, does it?)
# Let's use regex to grab the addListingModal block
modal_match = re.search(r'<div class="ld-modal-overlay" id="addListingModal">.*?(?=<div class="db-profile-dropdown" id="profileModalOverlay">|<script)', listings_html, re.DOTALL)
if modal_match:
    modal_html = modal_match.group(0).strip()
    print("Found modal HTML")
else:
    print("Could not find modal HTML")
    exit(1)

# 2. Extract the script
script_match = re.search(r'<script>\s*(const dropZone.*?)</script>', listings_html, re.DOTALL)
if script_match:
    script_content = script_match.group(1).strip()
    print("Found script content")
else:
    print("Could not find script content")
    exit(1)

# 3. Write script to js/listing-modal.js
with open(js_file, 'w') as f:
    f.write(script_content)
print("Wrote js/listing-modal.js")

# 4. Remove script from listings.html and add link
new_listings_html = listings_html.replace(script_match.group(0), '<script src="../../js/listing-modal.js"></script>')
with open(listings_file, 'w') as f:
    f.write(new_listings_html)
print("Updated listings.html script link")

# 5. Add modal HTML to dashboard.html right before <script src="../../js/profile.js">
with open(dashboard_file, 'r') as f:
    dash_html = f.read()

# Make sure it doesn't already have it
if 'id="addListingModal"' not in dash_html:
    dash_html = dash_html.replace('<script src="../../js/profile.js"></script>', 
                                  modal_html + '\n\n  <script src="../../js/listing-modal.js"></script>\n  <script src="../../js/profile.js"></script>')
    
    # 6. Add onclick="editListing(this)" to Edit buttons
    dash_html = dash_html.replace('<button class="db-card-btn">Edit</button>', '<button class="db-card-btn" onclick="editListing(this)">Edit</button>')
    
    with open(dashboard_file, 'w') as f:
        f.write(dash_html)
    print("Updated dashboard.html with modal and script")
else:
    print("dashboard.html already has the modal")

