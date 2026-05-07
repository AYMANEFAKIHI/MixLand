/* ─────────────────────────────────────────
   main.js  –  Mixland Landing Page
   Stack: GSAP 3 + ScrollTrigger
───────────────────────────────────────── */

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
   2. SCROLL PROGRESS BAR
══════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
}, { passive: true });

/* ══════════════════════════════════════
   3. BACK TO TOP BUTTON
══════════════════════════════════════ */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════
   4. BUTTON RIPPLE EFFECT
══════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.5;
    const ripple = document.createElement('span');
    ripple.className  = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ══════════════════════════════════════
   5. FORM SUBMISSION FEEDBACK
══════════════════════════════════════ */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input[type="email"]');
    const btn   = this.querySelector('button[type="submit"]');
    if (!input || !input.value) return;
    const original       = btn.textContent;
    btn.textContent      = '✓ Done!';
    btn.style.background = '#10B981';
    btn.disabled         = true;
    setTimeout(() => {
      btn.textContent      = original;
      btn.style.background = '';
      btn.disabled         = false;
      input.value          = '';
    }, 2500);
  });
});

/* ══════════════════════════════════════
   6. ACTIVE NAV LINK on scroll
══════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav__links a');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--blue)' : '';
      });
    }
  });
}, { threshold: 0.45 });
document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

/* ══════════════════════════════════════
   7. PROGRESS BAR ANIMATION (CSS)
══════════════════════════════════════ */
const fillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      fillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.fm-fill').forEach(el => fillObs.observe(el));

/* ══════════════════════════════════════
   8. GSAP ANIMATIONS
══════════════════════════════════════ */
window.addEventListener('load', () => {
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  /* Give the browser one extra frame to finish painting */
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    /* ── HERO entrance ── */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero__eyebrow',  { y: 20, opacity: 0, duration: .6 })
      .from('.hero__text h1',  { y: 30, opacity: 0, duration: .7 }, '-=.3')
      .from('.hero__desc',     { y: 20, opacity: 0, duration: .6 }, '-=.3')
      .from('.hero__form',     { y: 20, opacity: 0, duration: .6 }, '-=.25')
      .from('.hero__checks',   { y: 15, opacity: 0, duration: .5 }, '-=.2')
      .from('.hero__circle',   { scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, .2)
      .from('.mock-card--main',     { x: -30, y: 20,  opacity: 0, duration: .6 }, '-=.4')
      .from('.mock-card--schedule', { x: 30,  y: -20, opacity: 0, duration: .6 }, '-=.4')
      .from('.mock-card--task',     { x: 20,  y: 30,  opacity: 0, duration: .6 }, '-=.4');

    /* Mock cards float loop */
    document.querySelectorAll('.mock-card').forEach((card, i) => {
      gsap.to(card, { y: '-=10', duration: 2.5 + i * .4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .3 });
    });
    gsap.to('.app-mock', { y: '-=10', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    /* ── Parallax on mouse ── */
    window.addEventListener('mousemove', e => {
      const xP = (e.clientX / window.innerWidth  - .5) * 18;
      const yP = (e.clientY / window.innerHeight - .5) * 18;
      gsap.to('.hero__circle',       { x: xP,       y: yP,       duration: 1,   ease: 'power1.out' });
      gsap.to('.mock-card--main',    { x: xP * .35, y: yP * .35, duration: 1.2, ease: 'power1.out' });
      gsap.to('.mock-card--schedule',{ x: xP * .2,  y: yP * .2,  duration: 1.4, ease: 'power1.out' });
      gsap.to('.mock-card--task',    { x: xP * .45, y: yP * .45, duration: 1,   ease: 'power1.out' });
    }, { passive: true });

    /* ── Helper: safe ScrollTrigger.from ── */
    function st(targets, vars, triggerEl, startPos = 'top 82%') {
      if (!document.querySelector(targets)) return;
      gsap.from(targets, {
        ...vars,
        scrollTrigger: { trigger: triggerEl || targets, start: startPos, once: true }
      });
    }

    /* ── FEATURES ── */
    st('.section-head', { y: 30, opacity: 0, duration: .8 }, '.features', 'top 82%');
    gsap.from('.feature-card', {
      y: 50, opacity: 0, duration: .85, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: '.features__grid', start: 'top 82%', once: true }
    });

    /* ── APP SECTION ── */
    st('.app-circle', { scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.4)' }, '.app-section', 'top 78%');
    st('.app-mock',   { x: -40, opacity: 0, duration: .85 }, '.app-section', 'top 75%');
    gsap.from('.app-section__text h2, .app-section__text p', {
      x: 30, opacity: 0, duration: .75, stagger: .12, ease: 'power3.out',
      scrollTrigger: { trigger: '.app-section__text', start: 'top 78%', once: true }
    });
    gsap.from('.app-task', {
      x: -20, opacity: 0, duration: .55, stagger: .08, ease: 'power2.out',
      scrollTrigger: { trigger: '.app-mock', start: 'top 82%', once: true }
    });

    /* ── ORGANIZE ── */
    gsap.from('.organize-section__text h2, .organize-section__text p', {
      x: -30, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: '.organize-section', start: 'top 78%', once: true }
    });
    st('.org-card',        { y: 30, opacity: 0, duration: .75 }, '.organize-section__visual', 'top 80%');
    st('.org-mini-chart',  { y: 30, opacity: 0, duration: .75, delay: .15 }, '.organize-section__visual', 'top 78%');
    gsap.from('.mini-chart-bars div', {
      scaleY: 0, transformOrigin: 'bottom', duration: .6, stagger: .07, ease: 'power2.out',
      scrollTrigger: { trigger: '.org-mini-chart', start: 'top 82%', once: true }
    });

    /* ── BLUE / TESTIMONIALS ── */
    st('.blue-section__head h2', { y: 30, opacity: 0, duration: .8 }, '.blue-section', 'top 80%');
    gsap.from('.testi-card', {
      y: 40, opacity: 0, duration: .75, stagger: .13, ease: 'power3.out',
      scrollTrigger: { trigger: '.testi__grid', start: 'top 82%', once: true }
    });
    st('.trusted', { y: 20, opacity: 0, duration: .7 }, '.trusted', 'top 88%');
    gsap.from('.t-logo', {
      y: 10, opacity: 0, duration: .5, stagger: .08, ease: 'power2.out',
      scrollTrigger: { trigger: '.trusted__logos', start: 'top 92%', once: true }
    });

    /* ── BLOG ── */
    /* Target elements directly — avoids selector mismatch on GitHub Pages */
    const blogTitle = document.getElementById('blog-title');
    const blogDesc  = blogTitle ? blogTitle.nextElementSibling : null;
    if (blogTitle) gsap.from([blogTitle, blogDesc].filter(Boolean), {
      y: 30, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: blogTitle, start: 'top 85%', once: true }
    });
    gsap.from('.blog-card', {
      y: 40, opacity: 0, duration: .8, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: '.blog__grid', start: 'top 88%', once: true }
    });

    /* ── CTA ── */
    gsap.from('#cta-title, .cta-yellow__inner > p, .cta-form, .cta-note', {
      y: 20, opacity: 0, duration: .65, stagger: .1, ease: 'power2.out',
      scrollTrigger: { trigger: '.cta-yellow', start: 'top 80%', once: true }
    });

    /* ── FOOTER ── */
    gsap.from('.footer__brand, .footer__col', {
      y: 20, opacity: 0, duration: .65, stagger: .08, ease: 'power2.out',
      scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true }
    });

  }); /* end rAF */
}); /* end load */
