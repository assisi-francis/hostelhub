const Utils = {

  // Show a toast notification (success or error)
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
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
};
