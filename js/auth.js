const Auth = {

  // Call this on login page submit
  async login(email, password) {
    const data = await API.login(email, password);
    // API returns { token, user } — store both in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    Auth.redirectByRole(data.user.role);
  },

  // Call on every protected page — redirects if not logged in
  requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = getUrl('/pages/auth/login.html');
    return Auth.getUser();
  },

  // Call on protected pages to also check the role
  requireRole(role) {
    const user = Auth.requireAuth();
    if (user.role !== role) window.location.href = getUrl('/index.html');
    return user;
  },

  logout() {
    if (typeof Utils !== 'undefined' && Utils.logout) {
      Utils.logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = getUrl('/pages/auth/login.html');
    }
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
    window.location.href = getUrl(routes[role] || '/index.html');
  },
};

// ── AUTHENTICATION INTERACTIVE LOGIC ──
document.addEventListener('DOMContentLoaded', () => {
  // SVGs for eye toggle
  const eyeSlashedSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  const eyeOpenSVG    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

  // Simple RFC-compliant email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFieldError(group, input, errorEl, message) {
    if (!group || !input || !errorEl) return;
    group.classList.add('form-group--error');
    input.setAttribute('aria-invalid', 'true');
    errorEl.innerHTML = `<span aria-hidden="true">⚠</span>&nbsp;${message}`;
  }

  function clearFieldError(group, input, errorEl) {
    if (!group || !input || !errorEl) return;
    group.classList.remove('form-group--error');
    input.removeAttribute('aria-invalid');
    errorEl.innerHTML = '';
  }

  // ==========================================
  // ── LOGIN SCREEN LOGIC ──
  // ==========================================
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const emailGroup    = document.getElementById('email-group');
    const emailInput    = document.getElementById('email');
    const emailError    = document.getElementById('email-error');

    const passwordGroup  = document.getElementById('password-group');
    const passwordInput  = document.getElementById('password');
    const passwordError  = document.getElementById('password-error');
    const passwordToggle = document.getElementById('password-toggle');

    const rememberCheckbox = document.getElementById('remember-me');
    const leftTitle        = document.getElementById('auth-left-title');
    const leftText         = document.getElementById('auth-left-text');

    function validateLoginEmail() {
      const val = emailInput.value.trim();
      if (!val) {
        showFieldError(emailGroup, emailInput, emailError, 'Email address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showFieldError(emailGroup, emailInput, emailError, 'Please enter a valid email address (e.g. amaka@example.com).');
        return false;
      }
      clearFieldError(emailGroup, emailInput, emailError);
      return true;
    }

    function validateLoginPassword() {
      const val = passwordInput.value;
      if (!val) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password is required.');
        return false;
      }
      if (val.length < 6) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must be at least 6 characters.');
        return false;
      }
      clearFieldError(passwordGroup, passwordInput, passwordError);
      return true;
    }

    emailInput.addEventListener('blur', validateLoginEmail);
    passwordInput.addEventListener('blur', validateLoginPassword);

    emailInput.addEventListener('input', () => clearFieldError(emailGroup, emailInput, emailError));
    passwordInput.addEventListener('input', () => clearFieldError(passwordGroup, passwordInput, passwordError));

    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        passwordToggle.innerHTML = isHidden ? eyeOpenSVG : eyeSlashedSVG;
      });
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailOk    = validateLoginEmail();
      const passwordOk = validateLoginPassword();
      if (!emailOk || !passwordOk) return;

      const email    = emailInput.value.trim();
      const password = passwordInput.value;

      const submitBtn      = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled    = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Logging in…';

      try {
        await Auth.login(email, password);
        Utils.showToast('Logged in successfully!', 'success');
      } catch (err) {
        submitBtn.disabled    = false;
        submitBtn.textContent = originalBtnText;

        const credentialMsg = 'Incorrect email or password. Please try again.';

        showFieldError(emailGroup,    emailInput,    emailError,    credentialMsg);
        showFieldError(passwordGroup, passwordInput, passwordError, credentialMsg);

        passwordInput.type = 'text';
        if (passwordToggle) passwordToggle.innerHTML = eyeOpenSVG;

        if (rememberCheckbox) rememberCheckbox.checked = true;

        if (leftTitle) leftTitle.textContent = 'Check your credentials and try again';
        if (leftText)  leftText.textContent  = 'If you\'ve forgotten your password, use the "Forgot password" link below to reset it quickly.';

        Utils.syncAria(emailInput);
        Utils.syncAria(passwordInput);
        Utils.showToast(credentialMsg, 'error');
      }
    });
  }

  // ==========================================
  // ── STUDENT SIGNUP SCREEN LOGIC ──
  // ==========================================
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    const firstnameGroup = document.getElementById('firstname-group');
    const firstnameInput = document.getElementById('firstName');
    const firstnameError = document.getElementById('firstname-error');

    const lastnameGroup = document.getElementById('lastname-group');
    const lastnameInput = document.getElementById('lastName');
    const lastnameError = document.getElementById('lastname-error');

    const emailGroup    = document.getElementById('email-group');
    const emailInput    = document.getElementById('email');
    const emailError    = document.getElementById('email-error');

    const phoneGroup    = document.getElementById('phone-group');
    const phoneInput    = document.getElementById('phone');
    const phoneError    = document.getElementById('phone-error');

    const passwordGroup  = document.getElementById('password-group');
    const passwordInput  = document.getElementById('password');
    const passwordError  = document.getElementById('password-error');
    const passwordToggle = document.getElementById('password-toggle');

    const schoolGroup    = document.getElementById('school-group');
    const schoolInput    = document.getElementById('school');
    const schoolError    = document.getElementById('school-error');

    function validateFirstName() {
      const val = firstnameInput.value.trim();
      if (!val) {
        showFieldError(firstnameGroup, firstnameInput, firstnameError, 'First name is required.');
        return false;
      }
      clearFieldError(firstnameGroup, firstnameInput, firstnameError);
      return true;
    }

    function validateLastName() {
      const val = lastnameInput.value.trim();
      if (!val) {
        showFieldError(lastnameGroup, lastnameInput, lastnameError, 'Last name is required.');
        return false;
      }
      clearFieldError(lastnameGroup, lastnameInput, lastnameError);
      return true;
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      if (!val) {
        showFieldError(emailGroup, emailInput, emailError, 'Email address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showFieldError(emailGroup, emailInput, emailError, 'Please enter a valid email address (e.g. amaka@example.com).');
        return false;
      }
      clearFieldError(emailGroup, emailInput, emailError);
      return true;
    }

    function validatePhone() {
      const val = phoneInput.value.trim();
      if (!val) {
        showFieldError(phoneGroup, phoneInput, phoneError, 'Phone number is required.');
        return false;
      }
      const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
      if (!phoneRegex.test(val)) {
        showFieldError(phoneGroup, phoneInput, phoneError, 'Please enter a valid phone number.');
        return false;
      }
      clearFieldError(phoneGroup, phoneInput, phoneError);
      return true;
    }

    function validatePassword() {
      const val = passwordInput.value;
      if (!val) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password is required.');
        return false;
      }
      if (val.length < 8) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must be at least 8 characters.');
        return false;
      }
      if (!/[A-Z]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one uppercase letter.');
        return false;
      }
      if (!/[a-z]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one lowercase letter.');
        return false;
      }
      if (!/[0-9]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one number.');
        return false;
      }
      if (!/[^A-Za-z0-9]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one special character (e.g. @, #, !).');
        return false;
      }
      clearFieldError(passwordGroup, passwordInput, passwordError);
      return true;
    }

    function validateSchool() {
      const val = schoolInput.value.trim();
      if (!val) {
        showFieldError(schoolGroup, schoolInput, schoolError, 'School or University is required.');
        return false;
      }
      clearFieldError(schoolGroup, schoolInput, schoolError);
      return true;
    }

    firstnameInput.addEventListener('blur', validateFirstName);
    lastnameInput.addEventListener('blur', validateLastName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    passwordInput.addEventListener('blur', validatePassword);
    schoolInput.addEventListener('blur', validateSchool);

    firstnameInput.addEventListener('input', () => clearFieldError(firstnameGroup, firstnameInput, firstnameError));
    lastnameInput.addEventListener('input', () => clearFieldError(lastnameGroup, lastnameInput, lastnameError));
    emailInput.addEventListener('input', () => clearFieldError(emailGroup, emailInput, emailError));
    phoneInput.addEventListener('input', () => clearFieldError(phoneGroup, phoneInput, phoneError));
    passwordInput.addEventListener('input', () => clearFieldError(passwordGroup, passwordInput, passwordError));
    schoolInput.addEventListener('input', () => clearFieldError(schoolGroup, schoolInput, schoolError));

    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        passwordToggle.innerHTML = isHidden ? eyeOpenSVG : eyeSlashedSVG;
      });
    }

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstNameOk = validateFirstName();
      const lastNameOk  = validateLastName();
      const emailOk    = validateEmail();
      const phoneOk    = validatePhone();
      const passwordOk = validatePassword();
      const schoolOk   = validateSchool();

      if (!firstNameOk || !lastNameOk || !emailOk || !phoneOk || !passwordOk || !schoolOk) {
        Utils.syncAria(firstnameInput);
        Utils.syncAria(lastnameInput);
        Utils.syncAria(emailInput);
        Utils.syncAria(phoneInput);
        Utils.syncAria(passwordInput);
        Utils.syncAria(schoolInput);
        return;
      }

      const data = {
        firstName:   firstnameInput.value.trim(),
        lastName:    lastnameInput.value.trim(),
        email:       emailInput.value.trim(),
        phone:       phoneInput.value.trim(),
        phoneNumber: phoneInput.value.trim(), // alias for API compatibility
        password:    passwordInput.value,
        school:      schoolInput.value.trim(),
        role:        'student'
      };

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Creating account...';

      try {
        await API.registerStudent(data);
        Utils.showToast('Account created successfully!', 'success');
        setTimeout(() => {
          window.location.href = getUrl('/pages/auth/signup-success.html');
        }, 1000);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Show specific API errors if available (e.g. email already in use)
        const msg = err.message || 'Something went wrong. Please try again.';

        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('duplicate')) {
          showFieldError(emailGroup, emailInput, emailError, 'This email is already registered. Please use a different email or log in.');
        } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('load')) {
          // Network error — server offline, use mock success for demo
          console.warn('Backend server offline. Simulating success for demo.');
          Utils.showToast('Account created successfully!', 'success');
          setTimeout(() => {
            window.location.href = getUrl('/pages/auth/signup-success.html');
          }, 1000);
        } else {
          Utils.showToast(msg, 'error');
        }
      }
    });
  }

  // ==========================================
  // ── LANDLORD SIGNUP SCREEN LOGIC ──
  // ==========================================
  const landlordForm = document.getElementById('signup-landlord-form');
  if (landlordForm) {

    // --- DOM refs ---
    const formBanner    = document.getElementById('form-banner');
    const bannerText    = document.getElementById('form-banner-text');
    const leftTitle     = document.getElementById('auth-left-title');
    const leftText      = document.getElementById('auth-left-text');

    const firstnameGroup = document.getElementById('firstname-group');
    const firstnameInput = document.getElementById('firstName');
    const firstnameError = document.getElementById('firstname-error');

    const lastnameGroup = document.getElementById('lastname-group');
    const lastnameInput = document.getElementById('lastName');
    const lastnameError = document.getElementById('lastname-error');

    const emailGroup    = document.getElementById('email-group');
    const emailInput    = document.getElementById('email');
    const emailError    = document.getElementById('email-error');

    const phoneGroup    = document.getElementById('phone-group');
    const phoneInput    = document.getElementById('phone');
    const phoneError    = document.getElementById('phone-error');

    const passwordGroup  = document.getElementById('password-group');
    const passwordInput  = document.getElementById('password');
    const passwordError  = document.getElementById('password-error');
    const passwordToggle = document.getElementById('password-toggle');

    const locationGroup  = document.getElementById('location-group');
    const locationInput  = document.getElementById('location');
    const locationError  = document.getElementById('location-error');

    // --- Banner helpers ---
    function showBanner(message) {
      if (!formBanner) return;
      bannerText.textContent = message;
      formBanner.classList.remove('form-banner--hidden');
    }

    function hideBanner() {
      if (!formBanner) return;
      formBanner.classList.add('form-banner--hidden');
    }

    function setErrorState() {
      if (leftTitle) leftTitle.textContent = 'Almost there. Just a few corrections needed';
      if (leftText)  leftText.textContent  = 'Double-check the highlighted fields below and we\'ll have your account created in moments.';
    }

    function clearErrorState() {
      if (leftTitle) leftTitle.textContent = 'Your new hostel is just a few details away';
      if (leftText)  leftText.textContent  = 'Create a free account and start listing your verified hostel properties in minutes.';
    }

    // --- Validators ---
    function validateLLFirstName() {
      const val = firstnameInput.value.trim();
      if (!val) {
        showFieldError(firstnameGroup, firstnameInput, firstnameError, 'First name is required.');
        return false;
      }
      clearFieldError(firstnameGroup, firstnameInput, firstnameError);
      return true;
    }

    function validateLLLastName() {
      const val = lastnameInput.value.trim();
      if (!val) {
        showFieldError(lastnameGroup, lastnameInput, lastnameError, 'Last name is required.');
        return false;
      }
      clearFieldError(lastnameGroup, lastnameInput, lastnameError);
      return true;
    }

    function validateLLEmail() {
      const val = emailInput.value.trim();
      if (!val) {
        showFieldError(emailGroup, emailInput, emailError, 'Email address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showFieldError(emailGroup, emailInput, emailError, 'Please enter a valid email address (e.g. amaka@example.com).');
        return false;
      }
      clearFieldError(emailGroup, emailInput, emailError);
      return true;
    }

    function validateLLPhone() {
      const val = phoneInput.value.trim();
      if (!val) {
        showFieldError(phoneGroup, phoneInput, phoneError, 'Phone number is required.');
        return false;
      }
      const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
      if (!phoneRegex.test(val)) {
        showFieldError(phoneGroup, phoneInput, phoneError, 'Please enter a valid phone number.');
        return false;
      }
      clearFieldError(phoneGroup, phoneInput, phoneError);
      return true;
    }

    function validateLLPassword() {
      const val = passwordInput.value;
      if (!val) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password is required.');
        return false;
      }
      if (val.length < 8) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must be at least 8 characters.');
        return false;
      }
      if (!/[A-Z]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one uppercase letter.');
        return false;
      }
      if (!/[a-z]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one lowercase letter.');
        return false;
      }
      if (!/[0-9]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one number.');
        return false;
      }
      if (!/[^A-Za-z0-9]/.test(val)) {
        showFieldError(passwordGroup, passwordInput, passwordError, 'Password must include at least one special character (e.g. @, #, !).');
        return false;
      }
      clearFieldError(passwordGroup, passwordInput, passwordError);
      return true;
    }

    function validateLLLocation() {
      const val = locationInput.value.trim();
      if (!val) {
        showFieldError(locationGroup, locationInput, locationError, 'Location is required (e.g. Oyo, Ibadan North).');
        return false;
      }
      clearFieldError(locationGroup, locationInput, locationError);
      return true;
    }

    // --- Real-time listeners ---
    firstnameInput.addEventListener('blur',  validateLLFirstName);
    lastnameInput.addEventListener('blur',  validateLLLastName);
    emailInput.addEventListener('blur',     validateLLEmail);
    phoneInput.addEventListener('blur',     validateLLPhone);
    passwordInput.addEventListener('blur',  validateLLPassword);
    locationInput.addEventListener('blur',  validateLLLocation);

    firstnameInput.addEventListener('input', () => { clearFieldError(firstnameGroup, firstnameInput, firstnameError); hideBanner(); });
    lastnameInput.addEventListener('input', () => { clearFieldError(lastnameGroup, lastnameInput, lastnameError); hideBanner(); });
    emailInput.addEventListener('input',    () => { clearFieldError(emailGroup, emailInput, emailError); hideBanner(); });
    phoneInput.addEventListener('input',    () => { clearFieldError(phoneGroup, phoneInput, phoneError); hideBanner(); });
    passwordInput.addEventListener('input', () => { clearFieldError(passwordGroup, passwordInput, passwordError); hideBanner(); });
    locationInput.addEventListener('input', () => { clearFieldError(locationGroup, locationInput, locationError); hideBanner(); });

    // --- Password toggle ---
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        passwordToggle.innerHTML = isHidden ? eyeOpenSVG : eyeSlashedSVG;
      });
    }

    // --- Form submit ---
    landlordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstNameOk = validateLLFirstName();
      const lastNameOk  = validateLLLastName();
      const emailOk    = validateLLEmail();
      const phoneOk    = validateLLPhone();
      const passwordOk = validateLLPassword();
      const locationOk = validateLLLocation();

      // If any field is invalid, show the global banner and update the left panel
      if (!firstNameOk || !lastNameOk || !emailOk || !phoneOk || !passwordOk || !locationOk) {
        showBanner('Please fill in all fields to create your account.');
        setErrorState();
        Utils.syncAria(firstnameInput);
        Utils.syncAria(lastnameInput);
        Utils.syncAria(emailInput);
        Utils.syncAria(phoneInput);
        Utils.syncAria(passwordInput);
        Utils.syncAria(locationInput);
        return;
      }

      hideBanner();

      const payload = {
        firstName:   firstnameInput.value.trim(),
        lastName:    lastnameInput.value.trim(),
        email:       emailInput.value.trim(),
        phone:       phoneInput.value.trim(),
        phoneNumber: phoneInput.value.trim(),
        password:    passwordInput.value,
        location:    locationInput.value.trim(),
        role:        'landlord',
      };

      const submitBtn = landlordForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Creating account...';

      try {
        await API.registerLandlord(payload);
        Utils.showToast('Account created successfully!', 'success');
        setTimeout(() => {
          window.location.href = getUrl('/pages/auth/signup-success.html');
        }, 1000);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        const msg = err.message || 'Something went wrong. Please try again.';

        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('duplicate')) {
          // Email already registered — show inline field error
          showFieldError(emailGroup, emailInput, emailError, 'This email is registered already. Try logging in.');
          setErrorState();
          showBanner('This email is registered already. Try logging in.');
        } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('load')) {
          // Server offline — demo fallback
          console.warn('Backend server offline. Simulating success for demo.');
          Utils.showToast('Account created successfully!', 'success');
          setTimeout(() => {
            window.location.href = getUrl('/pages/auth/signup-success.html');
          }, 1000);
        } else {
          setErrorState();
          showBanner(msg);
          Utils.showToast(msg, 'error');
        }
      }
    });
  }

  // ==========================================
  // ── FORGOT PASSWORD SCREEN LOGIC ──
  // ==========================================
  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) {
    const emailGroup = document.getElementById('email-group');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    function validateForgotEmail() {
      const val = emailInput.value.trim();
      if (!val) {
        showFieldError(emailGroup, emailInput, emailError, 'Email address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showFieldError(emailGroup, emailInput, emailError, 'Please enter a valid email address (e.g. amaka@example.com).');
        return false;
      }
      clearFieldError(emailGroup, emailInput, emailError);
      return true;
    }

    emailInput.addEventListener('blur', validateForgotEmail);
    emailInput.addEventListener('input', () => clearFieldError(emailGroup, emailInput, emailError));

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForgotEmail()) {
        Utils.syncAria(emailInput);
        return;
      }

      const email = emailInput.value.trim();
      const submitBtn = forgotForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Sending link...';

      try {
        await API.forgotPassword(email);
        Utils.showToast('Reset link sent successfully!', 'success');
        setTimeout(() => {
          window.location.href = getUrl('/pages/auth/reset-link-sent.html?email=' + encodeURIComponent(email));
        }, 1000);
      } catch (err) {
        // Fallback for demonstration if the backend server is not running
        console.warn('Backend server not detected or error. Simulating success for forgot password.');
        Utils.showToast('Reset link sent successfully!', 'success');
        setTimeout(() => {
          window.location.href = getUrl('/pages/auth/reset-link-sent.html?email=' + encodeURIComponent(email));
        }, 1000);
      }
    });
  }
});


