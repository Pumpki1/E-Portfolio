document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const links = document.querySelectorAll('.nav-links a');

  // ============================================
  //   SERIF FONT (loads on every page)
  // ============================================
  if (!document.querySelector('link[href*="Source+Serif"]')) {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&display=swap';
    document.head.appendChild(font);
  }

  // ============================================
  //   ACTIVE NAV LINK
  // ============================================
  const normalize = (path) => {
    const file = path.split('?')[0].split('#')[0].split('/').pop();
    return file === '' ? 'index.html' : file;
  };
  const current = normalize(window.location.pathname);

  links.forEach(link => {
    if (normalize(link.getAttribute('href')) === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ============================================
  //   NAVBAR: MOBILE MENU AND SCROLL STATE
  // ============================================
  if (nav) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span>';
    nav.appendChild(toggle);

    const setOpen = (open) => {
      nav.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
    links.forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 860) setOpen(false); });

    const onScroll = () => nav.classList.toggle('nav-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ============================================
  //   PAGE TRANSITION (fade out before leaving)
  // ============================================
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || reduceMotion) return;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

    e.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = a.href; }, 260);
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) document.body.classList.remove('page-leaving');
  });

  // ============================================
  //   FADE-IN ON SCROLL
  // ============================================
  const faders = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(el => observer.observe(el));

  // ============================================
  //   COURSE TABS (Relevant Works page)
  // ============================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
    });
  });
});
