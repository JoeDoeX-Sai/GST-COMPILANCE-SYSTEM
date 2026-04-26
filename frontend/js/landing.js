// ── Nav scroll effect ──
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });
}

// ── Smooth scroll for on-page anchor links only ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Handle Create Account links → set flag then navigate to index.html ──
document.querySelectorAll('a[href="index.html#signup"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('gst_open_signup', '1');
    window.location.href = 'index.html';
  });
});

// ── Login button — ensure navigation works ──
document.querySelectorAll('a[href="index.html"]').forEach(a => {
  // Only attach to nav/button login links, not footer or logo links
  if (a.textContent.trim() === 'Login') {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }
});

// ── Generate mock bar chart ──
const barsEl = document.getElementById('mock-bars');
if (barsEl) {
  const heights = [30, 45, 35, 55, 42, 60, 48, 70, 52, 65];
  barsEl.innerHTML = heights.map((h, i) =>
    `<div class="mock-bar" style="height:${h}%;opacity:${0.4 + i * 0.06}"></div>`
  ).join('');
}

// ── Intersection Observer for fade-in animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── FAQ Toggles ──
document.querySelectorAll('.faq-item').forEach(faq => {
  faq.addEventListener('click', () => faq.classList.toggle('open'));
});
