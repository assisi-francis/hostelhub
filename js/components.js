// Injects shared navbar and footer into every page
// Each HTML page just needs: <div id="navbar"></div> and <div id="footer"></div>

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.getUser();

  // ── NAVBAR ────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.innerHTML = `
      <nav class="navbar">
        <a href="/index.html" class="navbar__logo">HostelHub</a>
        <ul class="navbar__links">
          <li><a href="/pages/student/listings.html">Browse Hostels</a></li>
          ${user ? `
            <li><a href="/${user.role}/dashboard.html">Dashboard</a></li>
            <li><button onclick="Auth.logout()" class="btn btn--ghost">Logout</button></li>
          ` : `
            <li><a href="/pages/auth/login.html">Sign In</a></li>
            <li><a href="/pages/auth/signup-student.html" class="btn btn--primary">Sign Up</a></li>
          `}
        </ul>
      </nav>
    `;
  }

  // ── FOOTER ────────────────────────────────────────────
  const footer = document.getElementById('footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} HostelHub. All rights reserved.</p>
        <ul class="footer__links">
          <li><a href="/pages/support/about.html">About</a></li>
          <li><a href="/pages/support/faq.html">FAQs</a></li>
          <li><a href="/pages/support/terms.html">Terms</a></li>
          <li><a href="/pages/support/privacy.html">Privacy</a></li>
          <li><a href="/pages/support/contact.html">Contact</a></li>
        </ul>
      </footer>
    `;
  }
});
