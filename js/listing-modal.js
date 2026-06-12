function showAmenitiesModal() {
  const modal = document.getElementById('amenitiesModal');
  if (modal) modal.classList.add('show');
}

function closeAmenitiesModal() {
  const modal = document.getElementById('amenitiesModal');
  if (modal) modal.classList.remove('show');
}

function applyAmenities() {
  const modal = document.getElementById('amenitiesModal');
  const checkboxes = modal.querySelectorAll('.ld-checkbox:checked');
  
  const container = document.getElementById('amenityPillsContainer');
  if (!container) return;
  container.innerHTML = ''; 
  
  checkboxes.forEach(cb => {
    const pill = document.createElement('button');
    pill.className = 'ld-pill ld-pill--amenity';
    pill.textContent = cb.value;
    container.appendChild(pill);
  });
  
  const addBtn = document.createElement('button');
  addBtn.className = 'ld-pill ld-pill--add';
  addBtn.textContent = '+ Add';
  addBtn.onclick = showAmenitiesModal;
  container.appendChild(addBtn);
  
  closeAmenitiesModal();
}

function editListing(btn) {
  // Find the card element (supports both listings.html and dashboard.html structure)
  const card = btn.closest('.ld-listing-card') || btn.closest('.db-card');
  if (!card) return;

  // Extract basic info from the card
  const title = card.querySelector('.ld-listing-title')?.innerText || card.querySelector('.db-card-title')?.innerText || '';
  const address = card.querySelector('.ld-info-item')?.innerText.trim() || card.querySelector('.db-info-item')?.innerText.trim() || '';
  
  // Extract price
  const priceElem = card.querySelector('.ld-listing-price') || card.querySelector('.db-card-price');
  let priceText = '';
  if (priceElem) {
    priceText = priceElem.childNodes[0].nodeValue || '';
  }

  const modal = document.getElementById('addListingModal');
  if (!modal) return;

  const modalTitle = modal.querySelector('.ld-modal-title');
  if (modalTitle) modalTitle.innerText = 'Edit Listing';
  const modalSubtitle = modal.querySelector('.ld-modal-subtitle');
  if (modalSubtitle) modalSubtitle.innerText = 'Update details and save changes for this listing.';

  const inputs = modal.querySelectorAll('.ld-form-group input');
  if (inputs.length >= 5) {
    inputs[0].value = title;            
    inputs[1].value = address;          
    inputs[2].value = '';               
    inputs[3].value = '';               
    inputs[4].value = priceText;        
  }

  modal.classList.add('show');
}

function showAddListingModal() {
  const modal = document.getElementById('addListingModal');
  if (!modal) return;
  
  const modalTitle = modal.querySelector('.ld-modal-title');
  if (modalTitle) modalTitle.innerText = 'Add Listing';
  const modalSubtitle = modal.querySelector('.ld-modal-subtitle');
  if (modalSubtitle) modalSubtitle.innerText = 'Manage your profile details and preference settings.';
  
  const inputs = modal.querySelectorAll('.ld-form-group input');
  inputs.forEach(input => input.value = '');

  modal.classList.add('show');
}

function closeAddListingModal() {
  const modal = document.getElementById('addListingModal');
  if (modal) modal.classList.remove('show');
}

function saveListing() {
  closeAddListingModal();
  if (typeof Utils !== 'undefined') {
    Utils.showToast('Listing saved successfully!', 'success');
  }
}

function showTermsModal() {
  const modal = document.getElementById('termsModal');
  if (modal) modal.classList.add('show');
}

function closeTermsModal() {
  const modal = document.getElementById('termsModal');
  if (modal) modal.classList.remove('show');
}

document.addEventListener('click', function(event) {
  const termsModal = document.getElementById('termsModal');
  if (termsModal && event.target === termsModal) {
    closeTermsModal();
  }
  const addModal = document.getElementById('addListingModal');
  if (addModal && event.target === addModal) {
    closeAddListingModal();
  }
  const amenitiesModal = document.getElementById('amenitiesModal');
  if (amenitiesModal && event.target === amenitiesModal) {
    closeAmenitiesModal();
  }
});

function selectStatus(btn) {
  const container = btn.parentElement;
  const pills = container.querySelectorAll('.ld-pill');
  pills.forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
}

function handlePhotoUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const grid = document.getElementById('listingPhotosGrid');
  const uploadBtn = document.getElementById('photoUploadBtn');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;

    const reader = new FileReader();
    reader.onload = function(e) {
      const div = document.createElement('div');
      div.className = 'ld-photo-item';

      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Uploaded Photo';

      const btn = document.createElement('button');
      btn.className = 'ld-photo-remove';
      btn.onclick = function() {
        this.parentElement.remove();
      };
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

      div.appendChild(img);
      div.appendChild(btn);

      grid.insertBefore(div, uploadBtn);
    };
    reader.readAsDataURL(file);
  }
  event.target.value = '';
}