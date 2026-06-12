import re

dashboard_file = 'pages/landlord/dashboard.html'
listings_file = 'pages/landlord/listings.html'

with open(listings_file, 'r') as f:
    listings_html = f.read()

# 1. Extract the modals HTML (addListingModal and amenitiesModal) from listings.html
modal_match = re.search(r'<div class="ld-modal-overlay" id="addListingModal">.*?(?=<div class="db-modal-overlay" id="profileModalOverlay")', listings_html, re.DOTALL)
if modal_match:
    modal_html = modal_match.group(0).strip()
else:
    print("Could not find modal HTML")
    exit(1)

with open(dashboard_file, 'r') as f:
    dash_html = f.read()

# 2. Add modal HTML to dashboard.html right before <div class="db-modal-overlay" id="profileModalOverlay">
if 'id="addListingModal"' not in dash_html:
    dash_html = dash_html.replace('<div class="db-modal-overlay" id="profileModalOverlay"', 
                                  modal_html + '\n\n  <div class="db-modal-overlay" id="profileModalOverlay"')
    
    # 3. Add <script src="../../js/listing-modal.js"></script> before <script>
    dash_html = dash_html.replace('  <script>\n    function showTermsModal', 
                                  '  <script src="../../js/listing-modal.js"></script>\n  <script>\n    function showTermsModal')
    
    # 4. Add onclick="editListing(this)" to Edit buttons
    dash_html = dash_html.replace('<button class="db-card-btn">Edit</button>', '<button class="db-card-btn" onclick="editListing(this)">Edit</button>')
    
    with open(dashboard_file, 'w') as f:
        f.write(dash_html)
    print("Injected modal into dashboard.html successfully")
else:
    print("Modal already injected")

