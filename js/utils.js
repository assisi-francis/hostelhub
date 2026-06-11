const Utils = {

  // Show a toast notification (success or error)
  showToast(message, type = 'success') {
    // Remove existing toast first if any
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  },

  // Format a date string nicely
  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  },

  // Show a loading spinner inside any container
  showLoader(container) {
    container.innerHTML = '<div class="loader"></div>';
  },

  // Show an empty state message
  showEmpty(container, message = 'Nothing to show yet.') {
    container.innerHTML = `<p class="empty-state">${message}</p>`;
  },

  // Get a query param from the URL
  // Usage: Utils.getParam('id') → "abc123"
  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  // Render star rating HTML
  renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) =>
      `<span class="star ${i < rating ? 'star--filled' : ''}">★</span>`
    ).join('');
  },

  // Sync aria-invalid with the visual state for accessibility
  syncAria(input) {
    if (!input || !input.setAttribute) return;
    const isInvalid = input.matches(':user-invalid') || 
                      input.closest('.form-group--error') !== null ||
                      input.classList.contains('user-invalid-fallback');
    
    input.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  },

  // Perform a full logout (localStorage + Firebase)
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    try {
      const isPagesDir = window.location.pathname.includes('/pages/');
      const authPath = isPagesDir ? '../../js/firebase-auth.js' : 'js/firebase-auth.js';
      const { logOutUser } = await import(authPath);
      await logOutUser();
    } catch (e) {
      console.warn("Firebase logout failed or module not found", e);
    }
    const isPagesDir = window.location.pathname.includes('/pages/');
    window.location.href = isPagesDir ? '../../index.html' : 'index.html';
  }
};
