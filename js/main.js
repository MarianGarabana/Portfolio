/* ============================================================
   MARIAN GARABANA — Portfolio JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR scroll behaviour ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu-links a, .mobile-menu-sub a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── STAT COUNTERS ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();
    function update(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + (p >= 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── HERO PARALLAX ── */
  const heroImg = document.querySelector('.hero-img-wrap img');
  const hero = document.getElementById('hero');
  if (heroImg && hero) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < hero.offsetHeight) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - (navbar.offsetHeight + 16);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── PROJECT ROW HOVER IMAGE PREVIEW ── */
  const previewEl = document.createElement('div');
  previewEl.id = 'img-preview';
  previewEl.style.cssText = 'position:fixed;pointer-events:none;z-index:50;width:260px;aspect-ratio:4/3;overflow:hidden;opacity:0;transform:scale(0.88) rotate(-2deg);transition:opacity 0.28s,transform 0.28s;box-shadow:0 16px 50px rgba(0,0,0,0.18);';
  const previewImg = document.createElement('img');
  previewImg.style.cssText = 'width:100%;height:100%;object-fit:cover;';
  previewEl.appendChild(previewImg);
  document.body.appendChild(previewEl);

  document.addEventListener('mousemove', e => {
    previewEl.style.left = (e.clientX + 24) + 'px';
    previewEl.style.top  = (e.clientY - 40) + 'px';
  });

  document.querySelectorAll('.project-row[data-img]').forEach(row => {
    row.addEventListener('mouseenter', () => {
      previewImg.src = row.dataset.img;
      previewEl.style.opacity = '1';
      previewEl.style.transform = 'scale(1) rotate(0deg)';
    });
    row.addEventListener('mouseleave', () => {
      previewEl.style.opacity = '0';
      previewEl.style.transform = 'scale(0.88) rotate(-2deg)';
    });
  });

  /* ── SKILL CARD SUBTLE TILT ── */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 6;
      card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform = '';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  /* ── ACTIVE NAV ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 }).observe && sections.forEach(s =>
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) navLinks.forEach(l =>
          l.style.color = l.getAttribute('href') === '#' + e.target.id ? 'var(--ink)' : '');
      });
    }, { threshold: 0.35 }).observe(s)
  );

});
