/*
  405 Cabinets & Stone Universal JavaScript
  Purpose: reusable interactions for 405-branded HTML pages.
  Supported components:
  - mobile navigation
  - active nav by section scroll
  - print buttons
  - reveal-on-scroll
  - count-up metrics
  - progress bars
  - tabs
  - accordions
  - sliders/galleries
*/

(function () {
  'use strict';

  const body = document.body;
  const menuBtn = document.querySelector('[data-cs-menu-btn]');
  const navLinks = document.querySelectorAll('.cs-nav a');

  function closeNav() {
    body.classList.remove('cs-nav-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      const isOpen = body.classList.toggle('cs-nav-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeNav();
  });

  document.querySelectorAll('[data-cs-print]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.print();
    });
  });

  function animateCounter(el) {
    if (el.dataset.csDone === 'true') return;
    el.dataset.csDone = 'true';

    const target = parseFloat(el.getAttribute('data-cs-count')) || 0;
    const decimals = Number.isInteger(target) ? 0 : 1;
    const suffix = el.getAttribute('data-cs-suffix') || '';
    const prefix = el.getAttribute('data-cs-prefix') || '';
    const duration = parseInt(el.getAttribute('data-cs-duration'), 10) || 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setProgress(el) {
    const value = Math.max(0, Math.min(100, parseInt(el.getAttribute('data-cs-progress'), 10) || 0));
    el.style.width = value + '%';
  }

  const revealItems = document.querySelectorAll('.cs-reveal');
  const counters = document.querySelectorAll('[data-cs-count]');
  const progressBars = document.querySelectorAll('[data-cs-progress]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-cs-count]').forEach(animateCounter);
        entry.target.querySelectorAll('[data-cs-progress]').forEach(setProgress);
      });
    }, { threshold: 0.18 });

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  counters.forEach(function (el) {
    const parent = el.closest('.cs-reveal');
    if (!parent) animateCounter(el);
  });

  progressBars.forEach(function (el) {
    const parent = el.closest('.cs-reveal');
    if (!parent) setProgress(el);
  });

  const sections = Array.from(document.querySelectorAll('main section[id], .cs-section[id]'));

  function updateActiveNav() {
    const y = window.scrollY + 130;
    let activeId = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= y) activeId = section.id;
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === '#' + activeId);
    });
  }

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  document.querySelectorAll('[data-cs-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tab = btn.getAttribute('data-cs-tab');
      const scope = btn.closest('[data-cs-tabs-scope]') || document;

      scope.querySelectorAll('[data-cs-tab]').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });

      scope.querySelectorAll('[data-cs-panel]').forEach(function (panel) {
        const active = panel.getAttribute('data-cs-panel') === tab;
        panel.classList.toggle('is-active', active);
        if (active) panel.querySelectorAll('[data-cs-progress]').forEach(setProgress);
      });
    });
  });

  document.querySelectorAll('[data-cs-accordion]').forEach(function (accordion) {
    const single = accordion.hasAttribute('data-cs-single');

    accordion.querySelectorAll('.cs-acc-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.cs-acc-item');
        if (!item) return;

        if (single && !item.classList.contains('is-open')) {
          accordion.querySelectorAll('.cs-acc-item').forEach(function (other) {
            other.classList.remove('is-open');
          });
        }

        item.classList.toggle('is-open');
      });
    });
  });

  document.querySelectorAll('[data-cs-slider]').forEach(function (slider) {
    const track = slider.querySelector('.cs-slides');
    const slides = slider.querySelectorAll('.cs-slide');
    const prev = slider.querySelector('[data-cs-prev]');
    const next = slider.querySelector('[data-cs-next]');
    const auto = parseInt(slider.getAttribute('data-cs-autoplay'), 10) || 0;
    let index = 0;
    let timer = null;

    if (!track || !slides.length) return;

    function go(delta) {
      index = (index + delta + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
    }

    function restartTimer() {
      if (!auto) return;
      clearInterval(timer);
      timer = setInterval(function () { go(1); }, auto);
    }

    if (prev) prev.addEventListener('click', function () { go(-1); restartTimer(); });
    if (next) next.addEventListener('click', function () { go(1); restartTimer(); });
    restartTimer();
  });
})();
