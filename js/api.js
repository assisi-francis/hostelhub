// Central place for ALL API calls
// Every team member uses these functions — nobody writes raw fetch calls in their page files

const API = {

  // ── AUTH ──────────────────────────────────────────────
  async login(email, password) {
    const { logInUser, getUserProfile } = await import('./firebase-auth.js');
    try {
      const fbUser = await logInUser(email, password);
      const profile = await getUserProfile(fbUser.uid);
      if (!profile) throw new Error("Profile not found");
      return {
        token: fbUser.accessToken,
        user: profile
      };
    } catch (err) {
      console.error(err);
      throw new Error(err.message || 'Incorrect email or password. Please try again.');
    }
  },

  async registerStudent(data) {
    const { signUpUser } = await import('./firebase-auth.js');
    const fullname = data.firstName + ' ' + data.lastName;
    const additionalData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || data.phoneNumber || '',
      school: data.school || ''
    };
    return signUpUser(data.email, data.password, fullname, 'student', additionalData);
  },

  async registerLandlord(data) {
    const { signUpUser } = await import('./firebase-auth.js');
    const fullname = data.firstName + ' ' + data.lastName;
    const additionalData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || data.phoneNumber || ''
    };
    return signUpUser(data.email, data.password, fullname, 'landlord', additionalData);
  },

  async forgotPassword(email) {
    const { resetPassword } = await import('./firebase-auth.js');
    return resetPassword(email);
  },

  // ── HOSTELS ───────────────────────────────────────────
  async getHostels(filters = {}) {
    const { getAllListings } = await import('./firebase-db.js');
    return getAllListings();
  },

  async getHostelById(id) {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const { db } = await import('./firebase-config.js');
    const docSnap = await getDoc(doc(db, "listings", id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async updateAvatar(base64Str) {
    const { uploadAvatar } = await import('./firebase-db.js');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error("Not logged in");
    const url = await uploadAvatar(base64Str, user.uid);
    user.avatar = url;
    localStorage.setItem('user', JSON.stringify(user));
    return url;
  },

  // ── REVIEWS ───────────────────────────────────────────
  getReviews: (hostelId) =>
    request('GET', `/hostels/${hostelId}/reviews`),

  submitReview: (hostelId, data) =>
    request('POST', `/hostels/${hostelId}/reviews`, data, {}, true),

  // ── LANDLORD ──────────────────────────────────────────
  async getMyListings() {
    const { getLandlordListings } = await import('./firebase-db.js');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error("Not logged in");
    return getLandlordListings(user.uid);
  },

  async addHostel(data) {
    const { createListing } = await import('./firebase-db.js');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error("Not logged in");
    data.landlordId = user.uid;
    return createListing(data);
  },

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
