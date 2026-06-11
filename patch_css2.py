import sys

with open('css/student-dashboard.css', 'r') as f:
    student_lines = f.readlines()

css_to_append = "".join(student_lines[896:]) # lines 897 to end

with open('css/landlord-dashboard.css', 'r') as f:
    landlord_css = f.read()

if '.db-profile-modal-content' not in landlord_css:
    with open('css/landlord-dashboard.css', 'a') as f:
        f.write("\n/* --- Profile Modal Styles Ported from Student --- */\n")
        f.write(css_to_append)
    print("CSS successfully appended.")
else:
    print("CSS already present.")

