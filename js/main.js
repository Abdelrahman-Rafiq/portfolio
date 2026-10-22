document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const hamburgerIcon = hamburger ? hamburger.querySelector('i') : null;

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  const setMenu = (open) => {
    if (!navLinks || !hamburger) return;
    navLinks.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    if (hamburgerIcon) {
      hamburgerIcon.classList.toggle('fa-bars', !open);
      hamburgerIcon.classList.toggle('fa-xmark', open);
    }
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      setMenu(!navLinks.classList.contains('active'));
    });

    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('active')) return;
      if (navLinks.contains(e.target) || hamburger.contains(e.target)) return;
      setMenu(false);
    });

    // Close with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });

    // Reset when resizing up to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     Navbar border once the page is scrolled
     ------------------------------------------------------------------ */
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     Highlight the nav link of the section currently in view
     (smooth scrolling and the sticky-header offset are handled in CSS)
     ------------------------------------------------------------------ */
  const sectionLinks = new Map();
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    sectionLinks.set(link.getAttribute('href').slice(1), link);
  });

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.classList.remove('active'));
        const link = sectionLinks.get(entry.target.id);
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    document.querySelectorAll('main section[id]').forEach((section) => spy.observe(section));
  }

  /* ------------------------------------------------------------------
     Scroll reveal (adds .visible; CSS does the animating)
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ------------------------------------------------------------------
     Contact form: send in the background and show a status message
     ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form && statusEl && submitBtn && window.fetch) {
    const setStatus = (message, type) => {
      statusEl.textContent = message;
      statusEl.className = 'form-status' + (type ? ' ' + type : '');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      setStatus('Sending...', '');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          form.reset();
          setStatus('Thank you! Your message was sent. I will get back to you soon.', 'success');
        } else {
          setStatus('Something went wrong. Please email me directly at abdelrahmanrafiq983@gmail.com.', 'error');
        }
      } catch (err) {
        setStatus('Network error. Please try again or email me directly at abdelrahmanrafiq983@gmail.com.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});