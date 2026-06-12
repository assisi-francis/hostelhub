import re

files_to_patch = [
    'pages/student/dashboard.html',
    'pages/student/saved.html'
]

modal_html = """
  <div class="db-modal-overlay" id="detailsModal">
    <div class="db-modal-content" style="max-width: 600px; padding: 0; overflow: hidden;">
      <button class="db-modal-close" style="position: absolute; top: 16px; right: 16px; background: white; border-radius: 50%; padding: 4px; z-index: 10;" onclick="closeDetailsModal()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <img id="dm-image" src="" alt="Property" style="width: 100%; height: 250px; object-fit: cover; display: block;" />
      
      <div style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <h2 id="dm-title" style="font-size: 1.5rem; color: #111827; margin: 0; font-weight: 700;">Title</h2>
          <span id="dm-badge" class="db-card-badge" style="position: static;">Badge</span>
        </div>
        
        <div style="display: flex; gap: 16px; color: #6b7280; font-size: 0.9rem; margin-bottom: 24px;">
          <span style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span id="dm-location">Location</span>
          </span>
          <span style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span id="dm-distance">Distance</span>
          </span>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.1rem; color: #374151; margin: 0 0 8px 0; font-weight: 600;">Description</h3>
          <p style="color: #4b5563; line-height: 1.6; margin: 0;">A beautiful and affordable student accommodation featuring 24/7 power supply, secure environment, and easy access to campus. Perfect for students looking for a quiet place to study and live.</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.1rem; color: #374151; margin: 0 0 12px 0; font-weight: 600;">Amenities</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <span style="background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 100px; font-size: 0.85rem; font-weight: 500;">WiFi</span>
            <span style="background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 100px; font-size: 0.85rem; font-weight: 500;">Water Supply</span>
            <span style="background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 100px; font-size: 0.85rem; font-weight: 500;">Security</span>
            <span style="background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 100px; font-size: 0.85rem; font-weight: 500;">Kitchen</span>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; padding-top: 24px;">
          <div id="dm-price" class="db-card-price" style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary); margin:0;">Price</div>
          <button class="db-btn-primary" style="padding: 10px 24px;">Contact Landlord</button>
        </div>
      </div>
    </div>
  </div>
"""

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        html = f.read()
    
    # Add onclick handler to buttons
    html = html.replace('<button class="db-card-btn">View Details</button>', '<button class="db-card-btn" onclick="viewDetails(this)">View Details</button>')
    
    # Inject modal before profileModalOverlay
    if 'id="detailsModal"' not in html:
        html = html.replace('<div class="db-modal-overlay" id="profileModalOverlay"', modal_html + '\n  <div class="db-modal-overlay" id="profileModalOverlay"')
    
    # Inject script reference
    if 'student-details.js' not in html:
        html = html.replace('<script src="../../js/profile.js"></script>', '<script src="../../js/student-details.js"></script>\n  <script src="../../js/profile.js"></script>')
        
    with open(filepath, 'w') as f:
        f.write(html)
    print(f"Patched {filepath}")

