const CONFIG = {
  // Local development — matches the API spec mock server at localhost:4000/api/v1
  API_BASE: 'http://localhost:4000/api/v1',
  // Uncomment the line below when deploying to production:
  // API_BASE: 'https://hostelhub-api.onrender.com/api/v1',
};

// Helper to resolve absolute-like root paths dynamically for file protocol or local server
function getUrl(path) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const loc = window.location;
  
  if (loc.protocol === 'file:') {
    const parts = loc.pathname.split('/hostelhub/');
    if (parts.length > 1) {
      return 'file://' + parts[0] + '/hostelhub/' + cleanPath;
    }
    // Fallback if the folder is named differently or nested
    const authParts = loc.pathname.split('/pages/auth/');
    if (authParts.length > 1) {
      return 'file://' + authParts[0] + '/' + cleanPath;
    }
    const studentParts = loc.pathname.split('/pages/student/');
    if (studentParts.length > 1) {
      return 'file://' + studentParts[0] + '/' + cleanPath;
    }
    const landlordParts = loc.pathname.split('/pages/landlord/');
    if (landlordParts.length > 1) {
      return 'file://' + landlordParts[0] + '/' + cleanPath;
    }
    const adminParts = loc.pathname.split('/pages/admin/');
    if (adminParts.length > 1) {
      return 'file://' + adminParts[0] + '/' + cleanPath;
    }
  }
  
  // If hosted on a server sub-directory (e.g. GitHub Pages /hostelhub/)
  if (loc.pathname.includes('/hostelhub/')) {
    return '/hostelhub/' + cleanPath;
  }
  
  return '/' + cleanPath;
}

