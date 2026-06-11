/*
  405 Cabinets & Stone Header Shell
  Purpose: render the reusable header/logo/mobile-button shell while keeping each page's menu dynamic.

  Required page markup:
  <div id="cs-header-root">
    <nav class="cs-nav" aria-label="Report navigation">
      <a href="#overview">Overview</a>
      <a href="#photos">Photos</a>
    </nav>
  </div>
*/

(function () {
  'use strict';

  const LOGO_URL = 'https://405cs.com/wp-content/uploads/2025/04/405-logo-version-1.png';
  const HOME_URL = 'https://405cs.com/';

  function buildHeader(root) {
    if (!root || root.dataset.csHeaderReady === 'true') return;

    const nav = root.querySelector('.cs-nav');
    if (!nav) {
      console.warn('405-header.js: missing .cs-nav inside #cs-header-root.');
      return;
    }

    root.dataset.csHeaderReady = 'true';

    const topbar = document.createElement('div');
    topbar.className = 'cs-topbar';

    const header = document.createElement('header');
    header.className = 'cs-header';

    const inner = document.createElement('div');
    inner.className = 'cs-header-inner';

    const logo = document.createElement('a');
    logo.className = 'cs-logo';
    logo.href = HOME_URL;
    logo.setAttribute('aria-label', '405 Cabinets & Stone home');

    const img = document.createElement('img');
    img.src = LOGO_URL;
    img.alt = '405 Cabinets & Stone logo';
    img.loading = 'eager';
    logo.appendChild(img);

    const menuBtn = document.createElement('button');
    menuBtn.className = 'cs-menu-btn';
    menuBtn.type = 'button';
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('data-cs-menu-btn', '');
    menuBtn.innerHTML = '<span></span><span></span><span></span>';

    inner.appendChild(logo);
    inner.appendChild(nav);
    inner.appendChild(menuBtn);
    header.appendChild(inner);

    root.innerHTML = '';
    root.appendChild(topbar);
    root.appendChild(header);

    if (window.CS405 && typeof window.CS405.init === 'function') {
      window.CS405.init(root);
      window.CS405.updateActiveNav();
    }
  }

  function initHeader() {
    buildHeader(document.querySelector('#cs-header-root'));
  }

  window.CS405 = window.CS405 || {};
  window.CS405.initHeader = initHeader;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
