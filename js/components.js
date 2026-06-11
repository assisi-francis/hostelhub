// Injects shared navbar and footer into every page
// Each HTML page just needs: <div id="navbar"></div> and <div id="footer"></div>

document.addEventListener('DOMContentLoaded', () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  window.handleLogout = function() {
    if (typeof Utils !== 'undefined' && Utils.logout) {
      Utils.logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = (typeof getUrl === 'function') ? getUrl('/index.html') : '/index.html';
    }
  };

  // ── NAVBAR AUGMENTATION ────────────────────────────────────────────
  const navbarActions = document.querySelector('.navbar__actions');
  const navbarDrawer = document.getElementById('nav-drawer');

  // getUrl helper inside components.js if missing
  function getPath(path) {
    return window.location.pathname.includes('/pages/') || window.location.pathname.includes('/support/') 
      ? `../..${path}` 
      : `.${path}`;
  }
  // Some files use getUrl, others might not have it.
  const resolveUrl = (typeof getUrl === 'function') ? getUrl : getPath;

  if (user && navbarActions) {
    const avatarImg = user.avatar || resolveUrl('/assets/images/avatar_adeola.png');
    navbarActions.innerHTML = `
      <a href="${resolveUrl(`/pages/${user.role}/dashboard.html`)}" class="navbar__cta-link" style="margin-right: 15px; font-weight: 600;">Dashboard</a>
      <div style="display: flex; align-items: center; gap: 15px;">
        <button style="background:none; border:none; color:inherit; cursor:pointer;" aria-label="Notifications">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <div style="position: relative;" id="navbar-profile-wrapper">
          <button id="navbarProfileBtn" style="width: 35px; height: 35px; border-radius: 50%; overflow: hidden; display: inline-block; border: none; padding: 0; cursor: pointer; background: none;">
            <img src="${avatarImg}" style="width: 100%; height: 100%; object-fit: cover;" />
          </button>
          <div id="navbarProfileMenu" style="display: none; position: absolute; right: 0; top: 45px; background: white; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 150px; z-index: 100; flex-direction: column; overflow: hidden;">
            <a href="${resolveUrl(`/pages/${user.role}/dashboard.html`)}" style="padding: 12px 16px; text-decoration: none; color: #333; font-weight: 500; border-bottom: 1px solid #eee; display: block;">Dashboard</a>
            <button onclick="window.handleLogout()" style="padding: 12px 16px; text-align: left; background: none; border: none; width: 100%; cursor: pointer; color: #ef4444; font-weight: 500; display: block;">Log Out</button>
          </div>
        </div>
      </div>
    `;

    // Add toggle logic for the profile dropdown
    setTimeout(() => {
      const profileBtn = document.getElementById('navbarProfileBtn');
      const profileMenu = document.getElementById('navbarProfileMenu');
      if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          profileMenu.style.display = profileMenu.style.display === 'none' ? 'flex' : 'none';
        });
        document.addEventListener('click', (e) => {
          if (!profileMenu.contains(e.target)) {
            profileMenu.style.display = 'none';
          }
        });
      }
    }, 0);

    if (navbarDrawer) {
      // Modify the drawer links for logged-in user
      navbarDrawer.innerHTML = `
        <a href="${resolveUrl('/index.html')}" class="navbar__link">Home</a>
        <a href="${resolveUrl('/about.html')}" class="navbar__link">About Us</a>
        <a href="${resolveUrl('/contact.html')}" class="navbar__link">Contact Us</a>
        <a href="${resolveUrl(`/pages/${user.role}/dashboard.html`)}" class="navbar__cta-link w-full" style="margin-top: 15px;">Dashboard</a>
        <button onclick="window.handleLogout()" class="btn btn--danger w-full" style="margin-top: 10px;">Log Out</button>
      `;
    }

    // Redirect all generic 'login' CTAs on the page to the home page for authenticated users
    document.querySelectorAll('a[href*="pages/auth/login.html"]').forEach(link => {
      link.href = resolveUrl('/index.html');
    });

  } else if (!user && navbarActions) {
    // Inject the guest navbar with icons to guarantee consistency across all pages
    navbarActions.innerHTML = `
      <a href="${resolveUrl('/pages/auth/login.html')}" id="btn-for-students" class="navbar__cta-link">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16 11 18 13 22 9"/>
        </svg>
        For Students
      </a>
      <a href="${resolveUrl('/pages/auth/login.html')}" id="btn-for-landlords" class="navbar__cta-link">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="1"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        For Landlords
      </a>
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
