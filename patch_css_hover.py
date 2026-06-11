import re

files_to_patch = [
    'css/student-dashboard.css',
    'css/landlord-dashboard.css'
]

old_rule_1 = """.db-profile-menu-item:hover {
  background: #f9fafb;
  color: var(--color-primary);
}"""

old_rule_2 = """.db-profile-menu-item:hover svg {
  transform: translateX(4px);
  color: var(--color-primary);
}"""

new_rules = """@media (hover: hover) {
  .db-profile-menu-item:hover {
    background: #f9fafb;
    color: var(--color-primary);
  }
  .db-profile-menu-item:hover svg {
    transform: translateX(4px);
    color: var(--color-primary);
  }
}"""

for filepath in files_to_patch:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Combine the replacements so they don't leave stray rules
        if old_rule_1 in content and old_rule_2 in content:
            # First, replace rule 1 with new_rules
            content = content.replace(old_rule_1, new_rules)
            # Then remove rule 2 entirely
            content = content.replace(old_rule_2, "")
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Patched hover issues in {filepath}")
        else:
            print(f"Rules not found exactly in {filepath}")
    except FileNotFoundError:
        print(f"{filepath} not found.")

