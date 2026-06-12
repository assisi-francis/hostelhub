function viewDetails(btn) {
  const card = btn.closest('.db-card');
  if (!card) return;

  const title = card.querySelector('.db-card-title')?.innerText || '';
  const infos = card.querySelectorAll('.db-info-item');
  const location = infos[0]?.innerText.trim() || '';
  const distance = infos[1]?.innerText.trim() || '';
  const priceHtml = card.querySelector('.db-card-price')?.innerHTML || '';
  const imageSrc = card.querySelector('.db-card-image')?.src || '';
  
  const badge = card.querySelector('.db-card-badge');
  const badgeText = badge?.innerText || '';
  const badgeClass = badge?.className || 'db-card-badge';
  const badgeStyle = badge?.getAttribute('style') || '';

  const modal = document.getElementById('detailsModal');
  if (!modal) return;

  document.getElementById('dm-title').innerText = title;
  document.getElementById('dm-location').innerText = location;
  document.getElementById('dm-distance').innerText = distance;
  document.getElementById('dm-price').innerHTML = priceHtml;
  document.getElementById('dm-image').src = imageSrc;
  
  const badgeEl = document.getElementById('dm-badge');
  if (badgeEl) {
    badgeEl.innerText = badgeText;
    badgeEl.className = badgeClass;
    badgeEl.setAttribute('style', badgeStyle + (badgeStyle.includes(';') ? ' ' : '; ') + 'position: static;');
  }

  modal.style.display = 'flex';
  // Small delay to allow CSS display: flex to apply before opacity transition
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function closeDetailsModal() {
  const modal = document.getElementById('detailsModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Wait for transition
  }
}

// Close on outside click
document.addEventListener('click', function(event) {
  const detailsModal = document.getElementById('detailsModal');
  if (detailsModal && event.target === detailsModal) {
    closeDetailsModal();
  }
});
