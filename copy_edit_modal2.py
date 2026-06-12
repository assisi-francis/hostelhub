import re

listings_file = 'pages/landlord/listings.html'
dashboard_file = 'pages/landlord/dashboard.html'
js_file = 'js/listing-modal.js'

with open(listings_file, 'r') as f:
    listings_html = f.read()

# 1. Extract the modals HTML (both addListingModal and amenitiesModal)
modal_match = re.search(r'<div class="ld-modal-overlay" id="addListingModal">.*?(?=<div class="db-modal-overlay" id="profileModalOverlay")', listings_html, re.DOTALL)
if modal_match:
    modal_html = modal_match.group(0).strip()
    print("Found modal HTML")
else:
    print("Could not find modal HTML")
    exit(1)

# 2. Extract the script
script_match = re.search(r'<script>\s*function showAmenitiesModal\(\).*?</script>', listings_html, re.DOTALL)
if script_match:
    # Get just the inner content of the script
    script_content = script_match.group(0).replace('<script>', '').replace('</script>', '').strip()
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

# 5. Add modal HTML to dashboard.html
with open(dashboard_file, 'r') as f:
    dash_html = f.read()

if 'id="addListingModal"' not in dash_html:
    # Insert right before profile modal
    dash_html = dash_html.replace('<div class="db-modal-overlay" id="profileModalOverlay"', 
                                  modal_html + '\n\n  <div class="db-modal-overlay" id="profileModalOverlay"')
    
    # Also add the script link right before profile.js
    dash_html = dash_html.replace('<script src="../../js/profile.js"></script>',
                                  '<script src="../../js/listing-modal.js"></script>\n  <script src="../../js/profile.js"></script>')
    
    # 6. Add onclick="editListing(this)" to Edit buttons
    dash_html = dash_html.replace('<button class="db-card-btn">Edit</button>', '<button class="db-card-btn" onclick="editListing(this)">Edit</button>')
    
    with open(dashboard_file, 'w') as f:
        f.write(dash_html)
    print("Updated dashboard.html with modal and script")
else:
    print("dashboard.html already has the modal")

