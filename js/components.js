// Injects shared navbar and footer into every page
// Each HTML page just needs: <div id="navbar"></div> and <div id="footer"></div>

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.getUser();

  // ── NAVBAR ────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar && navbar.innerHTML.trim() === '') {
    navbar.innerHTML = `
      <nav class="navbar">
        <a href="${getUrl('/index.html')}" class="navbar__logo">HostelHub</a>
        <ul class="navbar__links">
          <li><a href="${getUrl('/pages/student/listings.html')}">Browse Hostels</a></li>
          ${user ? `
            <li><a href="${getUrl(`/pages/${user.role}/dashboard.html`)}">Dashboard</a></li>
            <li><button onclick="Auth.logout()" class="btn btn--ghost">Logout</button></li>
          ` : `
            <li><a href="${getUrl('/pages/auth/login.html')}">Sign In</a></li>
            <li><a href="${getUrl('/pages/auth/signup-student.html')}" class="btn btn--primary">Sign Up</a></li>
          `}
        </ul>
      </nav>
    `;
  }

  // ── FOOTER ────────────────────────────────────────────
  const footer = document.getElementById('footer');
  if (footer) {
    footer.innerHTML = `
      <section class="trust-bar" aria-label="Trust indicators">
        <div class="container trust-bar__grid">
          <div class="trust-item">
            <svg class="trust-item__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <strong>Verified Only</strong>
            <p>Every hostel is physically inspected for safety and quality.</p>
          </div>
          <div class="trust-item">
            <svg class="trust-item__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <strong>Student Safe</strong>
            <p>Strict focus on student-safe and scholar-friendly environments.</p>
          </div>
          <div class="trust-item">
            <svg class="trust-item__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <strong>Fair Pricing</strong>
            <p>Direct-to-hostel pricing with no hidden brokerage fees.</p>
          </div>
          <div class="trust-item">
            <svg class="trust-item__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
            <strong>500+ Campus</strong>
            <p>Wide network covering all major academic hubs.</p>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <div class="container site-footer__inner">
          <div class="site-footer__left">
            <a href="${getUrl('/index.html')}" class="navbar__logo site-footer__logo">
              <div class="site-footer__logo-icon">
                <img src="${getUrl('/assets/icons/logo.svg')}" alt="HostelHub Logo" width="24" height="24" />
              </div>
              <span>Hostel<span style="color: #7b38ed;">Hub</span></span>
            </a>
            <p class="site-footer__copyright">&copy; ${new Date().getFullYear()} HostelHub. All rights reserved.</p>
          </div>

          <div class="site-footer__center">
            <a href="${getUrl('/pages/support/terms.html')}">Terms, Privacy & Policies</a>
            <a href="${getUrl('/pages/support/contact.html')}">Contact Support</a>
            <a href="${getUrl('/pages/support/about.html')}">About Us</a>
          </div>

          <div class="site-footer__right">
            <svg class="site-footer__globe" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
        </div>
      </footer>
    `;
  }
});
