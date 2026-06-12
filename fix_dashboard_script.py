dashboard_file = 'pages/landlord/dashboard.html'

with open(dashboard_file, 'r') as f:
    dash_html = f.read()

if '<script src="../../js/listing-modal.js"></script>' not in dash_html:
    dash_html = dash_html.replace('  <script>\n    function showTermsModal() {', 
                                  '  <script src="../../js/listing-modal.js"></script>\n  <script>\n    function showTermsModal() {')
    with open(dashboard_file, 'w') as f:
        f.write(dash_html)
    print("Injected script link successfully")
else:
    print("Script link already there")

