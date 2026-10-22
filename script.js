// js/auth.js

// ── Allowed email domains (NOC agents only) ──────────────────────
const ALLOWED_DOMAINS = ['cmso.com', 'motorolasolutions.com'];

// ── Registered users stored in localStorage (mock backend) ───────
function getUsers() {
  return JSON.parse(localStorage.getItem('noc_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('noc_users', JSON.stringify(users));
}

// ── Tab Switcher ──────────────────────────────────────────────────
function switchTab(tab) {
  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab   = document.getElementById('loginTab');
  const signupTab  = document.getElementById('signupTab');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}

// ── Domain Validator ─────────────────────────────────────────────
function isNOCEmail(email) {
  const domain = email.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
}

// ── Handle Login ─────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl  = document.getElementById('loginError');

  // Domain check
  if (!isNOCEmail(email)) {
    errorEl.textContent = '⚠️ Only NOC team email addresses are allowed.';
    return;
  }

  const users = getUsers();
  const user  = users.find(u => u.email === email && u.password === btoa(password));

  if (!user) {
    errorEl.textContent = '❌ Invalid email or password.';
    return;
  }

  // Save session
  sessionStorage.setItem('noc_session', JSON.stringify({
    name:  user.name,
    email: user.email,
    role:  user.role
  }));

  window.location.href = 'dashboard.html';
}

// ── Handle Signup ─────────────────────────────────────────────────
function handleSignup(e) {
  e.preventDefault();
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const role     = document.getElementById('signupRole').value;
  const password = document.getElementById('signupPassword').value;
  const confirm  = document.getElementById('signupConfirm').value;
  const errorEl  = document.getElementById('signupError');

  // Domain check
  if (!isNOCEmail(email)) {
    errorEl.textContent = '⚠️ Only NOC team email addresses are allowed.';
    return;
  }

  // Password length
  if (password.length < 8) {
    errorEl.textContent = '⚠️ Password must be at least 8 characters.';
    return;
  }

  // Password match
  if (password !== confirm) {
    errorEl.textContent = '❌ Passwords do not match.';
    return;
  }

  const users = getUsers();

  // Duplicate check
  if (users.find(u => u.email === email)) {
    errorEl.textContent = '❌ This email is already registered.';
    return;
  }

  // Save new user
  users.push({ name, email, role, password: btoa(password) });
  saveUsers(users);

  errorEl.style.color = '#3fb950';
  errorEl.textContent = '✅ Account created! Redirecting to login...';

  setTimeout(() => switchTab('login'), 1500);
}

// ── Auto-redirect if already logged in ───────────────────────────
if (sessionStorage.getItem('noc_session')) {
  window.location.href = 'dashboard.html';
}
