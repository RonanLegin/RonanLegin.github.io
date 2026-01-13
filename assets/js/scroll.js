/* Scroll-mode behavior for Dimension (single-page). */

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Remove preload class for initial animation consistency.
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      document.body.classList.remove('is-preload');
    }, 100);
  });

  // Add "use-middle" nav helpers (same behavior as Dimension's main.js).
  function applyMiddleNav(el) {
    if (!el) return;
    const ul = el.querySelector('ul');
    if (!ul) return;
    const lis = Array.from(ul.querySelectorAll('li'));
    if (lis.length % 2 === 0 && lis.length > 0) {
      el.classList.add('use-middle');
      lis[Math.floor(lis.length / 2)].classList.add('is-middle');
    }
  }

  applyMiddleNav(document.querySelector('#header nav'));
  applyMiddleNav(document.querySelector('#topnav nav'));

  // Smooth scroll for in-page anchors.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href === '#top') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    if (!prefersReduced) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }

    // Keep URL hash in sync (without jumping).
    history.pushState(null, '', href);
  });

  // Active nav highlighting (lightweight).
  const sections = Array.from(document.querySelectorAll('#main article[id]'));
  const navLinks = Array.from(document.querySelectorAll('#topnav a[href^="#"]'));

  if (sections.length && navLinks.length) {
    const map = new Map(navLinks.map((a) => [a.getAttribute('href')?.slice(1), a]));

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section.
        let best = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        }
        if (!best) return;

        navLinks.forEach((a) => a.classList.remove('active'));
        const id = best.target.getAttribute('id');
        const link = map.get(id);
        if (link) link.classList.add('active');
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sections.forEach((s) => observer.observe(s));
  }
})();

