import re

with open('css/student-dashboard.css', 'r') as f:
    student_css = f.read()

# We need to extract the modal overlay and profile CSS
# Look for /* --- Profile Dropdown & Modal --- */ or similar.
# Let's just find everything from .db-modal-overlay { down to the end of profile related stuff.
# Actually, I can just copy the block that starts around .db-profile-modal-content and includes the form and settings.

# Let's extract from .db-modal-overlay down to the last profile setting.
match = re.search(r'(\.db-modal-overlay\s*\{.*?\n)\s*/\* --- Footer ---\s*\*/', student_css, re.DOTALL)
if match:
    css_to_append = match.group(1)
    
    with open('css/landlord-dashboard.css', 'r') as f:
        landlord_css = f.read()
        
    if '.db-profile-modal-content' not in landlord_css:
        # Append before footer or at end
        with open('css/landlord-dashboard.css', 'a') as f:
            f.write("\n/* --- Profile Modal Styles Ported from Student --- */\n")
            f.write(css_to_append)
        print("CSS appended.")
    else:
        print("CSS already present.")
else:
    print("Could not find the block to extract in student-dashboard.css")

