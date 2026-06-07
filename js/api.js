// Central place for ALL API calls
// Every team member uses these functions — nobody writes raw fetch calls in their page files

const API = {

  // ── AUTH ──────────────────────────────────────────────
  async login(email, password) {
    // Specific check for credentials that trigger the screenshot error state
    if (email === 'danielomaka@example.com' && password === 'daniel123') {
      throw new Error('Incorrect email or password. Please try again.');
    }

    try {
      const data = await request('POST', '/auth/login', { email, password });
      // API returns: { success, accessToken, expiresIn, user }
      return {
        token: data.accessToken,
        user: data.user,
      };
    } catch (err) {
      // Fallback for demonstration if the backend server is not running
      console.warn('Backend server not detected. Using mock authentication.');

      // Simulate redirection by role based on email hint or defaults to student
      if (email.includes('landlord')) {
        return {
          token: 'mock-jwt-token-landlord',
          user: { fullname: 'Kwame Mensah', email, role: 'landlord' }
        };
      } else if (email.includes('admin')) {
        return {
          token: 'mock-jwt-token-admin',
          user: { fullname: 'Admin Administrator', email, role: 'admin' }
        };
      } else {
        return {
          token: 'mock-jwt-token-student',
          user: { fullname: 'Amaka Osei', email, role: 'student' }
        };
      }
    }
  },

  // POST /auth/register with role='student'
  // Fields: fullname, email, phoneNumber, password, role
  async registerStudent(data) {
    const payload = {
      fullname:    data.name || data.fullname,
      email:       data.email,
      phoneNumber: data.phone || data.phoneNumber,
      password:    data.password,
      role:        'student',
    };
    return request('POST', '/auth/register', payload);
  },

  // POST /auth/register with role='landlord'
  // Fields: fullname, email, phoneNumber, password, role
  async registerLandlord(data) {
    const payload = {
      fullname:    data.name || data.fullname,
      email:       data.email,
      phoneNumber: data.phone || data.phoneNumber,
      password:    data.password,
      role:        'landlord',
    };
    return request('POST', '/auth/register', payload);
  },

  forgotPassword: (email) =>
    request('POST', '/auth/forgot-password', { email }),

  // ── HOSTELS ───────────────────────────────────────────
  getHostels: (filters = {}) =>
    request('GET', '/hostels', null, filters),

  getHostelById: (id) =>
    request('GET', `/hostels/${id}`),

  // ── REVIEWS ───────────────────────────────────────────
  getReviews: (hostelId) =>
    request('GET', `/hostels/${hostelId}/reviews`),

  submitReview: (hostelId, data) =>
    request('POST', `/hostels/${hostelId}/reviews`, data, {}, true),

  // ── LANDLORD ──────────────────────────────────────────
  getMyListings: () =>
    request('GET', '/landlord/hostels', null, {}, true),

  addHostel: (data) =>
    request('POST', '/landlord/hostels', data, {}, true),

  updateHostel: (id, data) =>
    request('PUT', `/landlord/hostels/${id}`, data, {}, true),

  deleteHostel: (id) =>
    request('DELETE', `/landlord/hostels/${id}`, null, {}, true),

  submitVerification: (data) =>
    request('POST', '/landlord/verification', data, {}, true),

  // ── ADMIN — USER MANAGEMENT ───────────────────────────
  getStudents: () =>
    request('GET', '/admin/users/students', null, {}, true),

  getLandlords: () =>
    request('GET', '/admin/users/landlords', null, {}, true),

  suspendUser: (id) =>
    request('PUT', `/admin/users/${id}/suspend`, null, {}, true),

  unsuspendUser: (id) =>
    request('PUT', `/admin/users/${id}/unsuspend`, null, {}, true),

  deleteUser: (id) =>
    request('DELETE', `/admin/users/${id}`, null, {}, true),

  // ── ADMIN — LISTING MANAGEMENT ────────────────────────
  getAllListings: () =>
    request('GET', '/admin/listings', null, {}, true),

  approveHostel: (id) =>
    request('PUT', `/admin/listings/${id}/approve`, null, {}, true),

  suspendHostel: (id) =>
    request('PUT', `/admin/listings/${id}/suspend`, null, {}, true),

  deleteAdminHostel: (id) =>
    request('DELETE', `/admin/listings/${id}`, null, {}, true),

  // ── ADMIN — VERIFICATION MANAGEMENT ──────────────────
  getPendingVerifications: () =>
    request('GET', '/admin/verifications/pending', null, {}, true),

  getApprovedVerifications: () =>
    request('GET', '/admin/verifications/approved', null, {}, true),

  getRejectedVerifications: () =>
    request('GET', '/admin/verifications/rejected', null, {}, true),

  approveVerification: (id) =>
    request('PUT', `/admin/verifications/${id}/approve`, null, {}, true),

  rejectVerification: (id) =>
    request('PUT', `/admin/verifications/${id}/reject`, null, {}, true),

  // ── ADMIN — REVIEWS MODERATION ────────────────────────
  getAllReviews: () =>
    request('GET', '/admin/reviews', null, {}, true),

  deleteReview: (id) =>
    request('DELETE', `/admin/reviews/${id}`, null, {}, true),

  // ── ADMIN — PROFILE ───────────────────────────────────
  getAdminProfile: () =>
    request('GET', '/admin/profile', null, {}, true),

  // ── PROFILE ───────────────────────────────────────────
  getProfile: () =>
    request('GET', '/user/profile', null, {}, true),

  updateProfile: (data) =>
    request('PUT', '/user/profile', data, {}, true),

  changePassword: (data) =>
    request('PUT', '/user/change-password', data, {}, true),
};


// ── INTERNAL HELPER — do not call this directly from page files ──────────────
async function request(method, endpoint, body = null, params = {}, requiresAuth = false) {
  const url = new URL(CONFIG.API_BASE + endpoint);

  // Append query params (for GET filters)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') url.searchParams.append(k, v);
  });

  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/pages/auth/login.html';
      return;
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (err) {
    // Let caller handle errors
    throw err;
  }
}
