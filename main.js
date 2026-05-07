/* ─────────────────────────────────────────
   main.js  –  Mixland Landing Page
   Stack: GSAP 3 + ScrollTrigger
───────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── Reduced-motion guard ── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════
   1. NAV – blur on scroll + burger
══════════════════════════════════════ */
const nav        = document.getElementById('nav');
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open navigation menu');
  });
});

/* ══════════════════════════════════════
   2. HERO – staggered entrance
══════════════════════════════════════ */
if (!prefersReduced) {
  // Text side
  gsap.from('.hero__eyebrow', {
    y: 20, opacity: 0, duration: .7, ease: 'power3.out', delay: .1
  });
  gsap.from('.hero__text h1', {
    y: 30, opacity: 0, duration: .8, ease: 'power3.out', delay: .22
  });
  gsap.from('.hero__desc', {
    y: 20, opacity: 0, duration: .7, ease: 'power3.out', delay: .36
  });
  gsap.from('.hero__form', {
    y: 20, opacity: 0, duration: .7, ease: 'power3.out', delay: .48
  });
  gsap.from('.hero__checks', {
    y: 15, opacity: 0, duration: .6, ease: 'power3.out', delay: .58
  });

  // Mock cards – cascade from circle
  gsap.from('.hero__circle', {
    scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.6)', delay: .2
  });
  gsap.from('.mock-card--main', {
    x: -30, y: 20, opacity: 0, duration: .7, ease: 'power3.out', delay: .5
  });
  gsap.from('.mock-card--schedule', {
    x: 30, y: -20, opacity: 0, duration: .7, ease: 'power3.out', delay: .65
  });
  gsap.from('.mock-card--task', {
    x: 20, y: 30, opacity: 0, duration: .7, ease: 'power3.out', delay: .78
  });

  // Floating loop for mock cards
  document.querySelectorAll('.mock-card').forEach((card, i) => {
    gsap.to(card, {
      y: '-=10',
      duration: 2.5 + i * .4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * .3
    });
  });

  // App mock float
  gsap.to('.app-mock', {
    y: '-=10',
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
}

/* ══════════════════════════════════════
   3. FEATURES – stagger cards
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.section-head', {
    y: 30, opacity: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.features',
      start: 'top 82%'
    }
  });

  gsap.from('.feature-card', {
    y: 50, opacity: 0,
    duration: .85,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.features__grid',
      start: 'top 80%'
    }
  });
}

/* ── Animate progress bars when visible ── */
const fillEls = document.querySelectorAll('.fm-fill');
const fillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      fillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
fillEls.forEach(el => fillObs.observe(el));

/* ══════════════════════════════════════
   4. APP SECTION
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.app-circle', {
    scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.app-section', start: 'top 78%' }
  });
  gsap.from('.app-mock', {
    x: -40, opacity: 0, duration: .85, ease: 'power3.out',
    scrollTrigger: { trigger: '.app-section', start: 'top 75%' }
  });
  gsap.from('.app-section__text h2, .app-section__text p', {
    x: 30, opacity: 0, duration: .75,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.app-section__text', start: 'top 78%' }
  });

  // App tasks stagger
  gsap.from('.app-task', {
    x: -20, opacity: 0,
    duration: .55,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.app-mock', start: 'top 80%' }
  });
}

/* ══════════════════════════════════════
   5. ORGANIZE SECTION
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.organize-section__text h2, .organize-section__text p', {
    x: -30, opacity: 0, duration: .8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.organize-section', start: 'top 78%' }
  });
  gsap.from('.org-card', {
    y: 30, opacity: 0, duration: .75, ease: 'power3.out',
    scrollTrigger: { trigger: '.organize-section__visual', start: 'top 80%' }
  });
  gsap.from('.org-mini-chart', {
    y: 30, opacity: 0, duration: .75, delay: .15, ease: 'power3.out',
    scrollTrigger: { trigger: '.organize-section__visual', start: 'top 78%' }
  });

  // Chart bars grow up
  gsap.from('.mini-chart-bars div', {
    scaleY: 0, transformOrigin: 'bottom',
    duration: .6,
    stagger: 0.07,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.org-mini-chart', start: 'top 82%' }
  });
}

/* ══════════════════════════════════════
   6. BLUE SECTION – testimonials
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.blue-section__head h2', {
    y: 30, opacity: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '.blue-section', start: 'top 80%' }
  });
  gsap.from('.testi-card', {
    y: 40, opacity: 0,
    duration: .75,
    stagger: 0.13,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.testi__grid', start: 'top 82%' }
  });
  gsap.from('.trusted', {
    y: 20, opacity: 0, duration: .7, ease: 'power2.out',
    scrollTrigger: { trigger: '.trusted', start: 'top 85%' }
  });
  gsap.from('.t-logo', {
    y: 10, opacity: 0,
    duration: .5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.trusted__logos', start: 'top 88%' }
  });
}

/* ══════════════════════════════════════
   7. BLOG
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.blog .section-head', {
    y: 30, opacity: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '.blog', start: 'top 80%' }
  });
  gsap.from('.blog-card', {
    y: 40, opacity: 0,
    duration: .8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.blog__grid', start: 'top 82%' }
  });
}

/* ══════════════════════════════════════
   8. CTA YELLOW
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.cta-yellow__inner h2', {
    y: 25, opacity: 0, duration: .75, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-yellow', start: 'top 80%' }
  });
  gsap.from('.cta-yellow__inner p, .cta-form, .cta-note', {
    y: 20, opacity: 0,
    duration: .65,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-yellow', start: 'top 78%' }
  });
}

/* ══════════════════════════════════════
   9. FOOTER
══════════════════════════════════════ */
if (!prefersReduced) {
  gsap.from('.footer__brand, .footer__col', {
    y: 20, opacity: 0,
    duration: .65,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 90%' }
  });
}

/* ══════════════════════════════════════
   10. ACTIVE NAV LINK on scroll
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--blue)'
          : '';
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObs.observe(s));

/* ══════════════════════════════════════
   11. PARALLAX HERO CIRCLE (subtle)
══════════════════════════════════════ */
if (!prefersReduced) {
  window.addEventListener('mousemove', e => {
    const xPct = (e.clientX / window.innerWidth  - 0.5) * 18;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 18;
    gsap.to('.hero__circle', { x: xPct, y: yPct, duration: 1, ease: 'power1.out' });
    gsap.to('.mock-card--main',     { x: xPct * .35, y: yPct * .35, duration: 1.2, ease: 'power1.out' });
    gsap.to('.mock-card--schedule', { x: xPct * .2,  y: yPct * .2,  duration: 1.4, ease: 'power1.out' });
    gsap.to('.mock-card--task',     { x: xPct * .45, y: yPct * .45, duration: 1,   ease: 'power1.out' });
  }, { passive: true });
}

/* ══════════════════════════════════════
   12. SCROLL PROGRESS BAR
══════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ══════════════════════════════════════
   13. BACK TO TOP BUTTON
══════════════════════════════════════ */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════
   14. BUTTON RIPPLE EFFECT
══════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
    `;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ══════════════════════════════════════
   15. FORM SUBMISSION FEEDBACK
══════════════════════════════════════ */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input[type="email"]');
    const btn   = this.querySelector('button[type="submit"]');
    if (!input || !input.value) return;

    const original = btn.textContent;
    btn.textContent = '✓ Done!';
    btn.style.background = '#10B981';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      input.value = '';
    }, 2500);
  });
});
