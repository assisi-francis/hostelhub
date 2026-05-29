const Auth = {

  // Call this on login page submit
  async login(email, password) {
    const data = await API.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    Auth.redirectByRole(data.user.role);
  },

  // Call on every protected page — redirects if not logged in
  requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/pages/auth/login.html';
    return Auth.getUser();
  },

  // Call on protected pages to also check the role
  requireRole(role) {
    const user = Auth.requireAuth();
    if (user.role !== role) window.location.href = '/index.html';
    return user;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/auth/login.html';
  },

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  redirectByRole(role) {
    const routes = {
      student:  '/pages/student/dashboard.html',
      landlord: '/pages/landlord/dashboard.html',
      admin:    '/pages/admin/dashboard.html',
    };
    window.location.href = routes[role] || '/index.html';
  },
};
