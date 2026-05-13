import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * BJ's Wholesale Club header:
 * Row 1 (white): Logo | Categories dropdown | Search bar | Buy It Again | Sign In/Join | Cart
 * Row 2 (light): Category nav links | Pickup/Delivery | Coupons | Store location
 * Row 3 (red): Rotating promo pencil banner
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Collect sections from fragment (split by <hr>)
  const sections = [];
  if (fragment) {
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
    nav.querySelectorAll(':scope > hr').forEach((hr) => hr.remove());
    sections.push(...nav.children);
  }

  // Expect 4 sections: [0] brand/logo, [1] nav-bar links, [2] categories dropdown, [3] tools
  const brandSection = sections[0] || null;
  const navBarSection = sections[1] || null;
  const categoriesSection = sections[2] || null;
  const toolsSection = sections[3] || null;

  nav.textContent = '';

  // === ROW 1: Top bar (logo + categories btn + search + account tools) ===
  const topRow = document.createElement('div');
  topRow.className = 'nav-top-row';

  // Hamburger (mobile)
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  topRow.append(hamburger);

  // Brand (logo)
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const logoLink = brandSection.querySelector('a');
    const logoImg = brandSection.querySelector('img');
    if (logoLink && logoImg) {
      const a = document.createElement('a');
      a.href = logoLink.href;
      a.className = 'nav-logo-link';
      a.setAttribute('aria-label', 'BJ\'s Wholesale Club home');
      const img = document.createElement('img');
      img.src = logoImg.src;
      img.alt = logoImg.alt || 'BJ\'s Wholesale Club home';
      img.className = 'nav-logo-icon';
      img.width = 58;
      img.height = 51;
      a.append(img);
      brand.append(a);
    }
  }
  topRow.append(brand);

  // Categories dropdown button
  const catDropdown = document.createElement('div');
  catDropdown.className = 'nav-categories-dropdown';

  const catBtn = document.createElement('button');
  catBtn.type = 'button';
  catBtn.className = 'nav-categories-btn';
  catBtn.setAttribute('aria-expanded', 'false');
  catBtn.innerHTML = `<span class="nav-hamburger-mini"><span></span><span></span><span></span></span> Categories`;

  const catPanel = document.createElement('div');
  catPanel.className = 'nav-categories-panel';
  catPanel.setAttribute('aria-hidden', 'true');

  if (categoriesSection) {
    const ul = categoriesSection.querySelector('ul');
    if (ul) {
      const catUl = ul.cloneNode(true);
      catUl.className = 'nav-categories-list';
      catUl.querySelectorAll('.button').forEach((b) => { b.className = ''; });
      catUl.querySelectorAll('.button-container').forEach((bc) => { bc.className = ''; });
      catPanel.append(catUl);
    }
  }

  catBtn.addEventListener('click', () => {
    const open = catBtn.getAttribute('aria-expanded') === 'true';
    catBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    catPanel.setAttribute('aria-hidden', open ? 'true' : 'false');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!catDropdown.contains(e.target)) {
      catBtn.setAttribute('aria-expanded', 'false');
      catPanel.setAttribute('aria-hidden', 'true');
    }
  });

  catDropdown.append(catBtn);
  catDropdown.append(catPanel);
  topRow.append(catDropdown);

  // Deals & Coupons button
  let dealsLink = null;
  if (toolsSection) {
    const toolLinks = toolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      if (link.textContent.trim().toLowerCase().includes('deals')) {
        dealsLink = document.createElement('a');
        dealsLink.href = link.href;
        dealsLink.className = 'nav-deals-link';
        dealsLink.textContent = link.textContent.trim();
      }
    });
  }
  if (dealsLink) topRow.append(dealsLink);

  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'nav-search';
  searchBar.innerHTML = `<form class="nav-search-field" role="search" action="https://www.bjs.com/search" method="get">
    <input type="text" name="query" placeholder="Search BJ's" aria-label="Search BJ's">
    <button type="submit" aria-label="Search" class="nav-search-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" fill="currentColor"/>
      </svg>
    </button>
  </form>`;
  topRow.append(searchBar);

  // Account tools
  const accountTools = document.createElement('div');
  accountTools.className = 'nav-account-tools';

  if (toolsSection) {
    const toolLinks = toolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      const text = link.textContent.trim();
      if (text.toLowerCase().includes('buy it')) {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'nav-account-link nav-buyagain-link';
        a.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 23l-4-4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg><span>${text}</span>`;
        accountTools.append(a);
      } else if (text.toLowerCase().includes('sign')) {
        const signInWrap = document.createElement('div');
        signInWrap.className = 'nav-signin-wrap';
        signInWrap.innerHTML = `<svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.1 1C6.95 1 5.3 2.68 5.3 4.92C5.3 7.16 6.95 8.84 9.1 8.84C11.25 8.84 12.9 7.16 12.9 4.92C12.9 2.68 11.25 1 9.1 1ZM4.3 4.92C4.3 2.15 6.37 0 9.1 0C11.82 0 13.9 2.15 13.9 4.92C13.9 7.69 11.82 9.84 9.1 9.84C6.37 9.84 4.3 7.69 4.3 4.92ZM1.01 16.56C2.8 19.16 5.76 20.91 9.1 20.91C12.44 20.91 15.4 19.16 17.19 16.56C17.15 16.05 16.88 15.57 16.41 15.1C15.89 14.6 15.14 14.15 14.27 13.77C12.54 13.03 10.46 12.64 9.1 12.64C7.74 12.64 5.65 13.03 3.92 13.77C3.06 14.15 2.31 14.6 1.79 15.1C1.31 15.57 1.05 16.05 1.01 16.56ZM3.53 12.85C5.38 12.06 7.59 11.64 9.1 11.64C10.6 11.64 12.82 12.06 14.67 12.85C15.6 13.25 16.46 13.76 17.11 14.39C17.75 15.01 18.2 15.79 18.2 16.7V16.85L18.11 16.98C16.17 19.9 12.87 21.91 9.1 21.91C5.33 21.91 2.03 19.9 0.08 16.98L0 16.85V16.7C0 15.79 0.45 15.01 1.09 14.39C1.73 13.76 2.6 13.25 3.53 12.85Z" fill="currentColor"/>
        </svg>
        <a href="${link.href}" class="nav-signin-link">${text}</a>
        <span class="nav-signin-divider">|</span>
        <a href="https://www.bjs.com/membership" class="nav-join-link">Join Today</a>`;
        accountTools.append(signInWrap);
      }
    });
  }

  // Cart
  const cartLink = document.createElement('a');
  cartLink.href = 'https://www.bjs.com/cart';
  cartLink.className = 'nav-account-link nav-cart-link';
  cartLink.setAttribute('aria-label', 'Cart');
  cartLink.innerHTML = `<span class="nav-cart-icon-wrap">
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.29 15.45C13.58 15.45 13 16.02 13 16.73C13 17.43 13.58 18 14.29 18C14.99 18 15.57 17.43 15.57 16.73C15.57 16.02 14.99 15.45 14.29 15.45Z" fill="currentColor" stroke="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.57 15.45C5.86 15.45 5.29 16.02 5.29 16.73C5.29 17.43 5.86 18 6.57 18C7.28 18 7.86 17.43 7.86 16.73C7.86 16.02 7.28 15.45 6.57 15.45Z" fill="currentColor" stroke="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1V2.79H2.8L6.04 9.57L4.78 11.71C4.69 11.98 4.6 12.34 4.6 12.6C4.6 13.58 5.41 14.39 6.4 14.39H17.2V12.6H6.76C6.67 12.6 6.58 12.51 6.58 12.42V12.34L7.39 10.82H14.05C14.77 10.82 15.31 10.46 15.58 9.93L18.82 4.12C19 3.95 19 3.86 19 3.68C19 3.14 18.64 2.79 18.1 2.79H4.78L3.97 1H1Z" stroke="currentColor" stroke-width="1"/>
    </svg>
    <span class="nav-cart-badge">0</span>
  </span>`;
  accountTools.append(cartLink);

  topRow.append(accountTools);
  nav.append(topRow);

  // === ROW 2: Category nav links bar ===
  const bottomRow = document.createElement('div');
  bottomRow.className = 'nav-bottom-row';
  const bottomRowInner = document.createElement('div');
  bottomRowInner.className = 'nav-bottom-row-inner';

  // Left: nav links
  if (navBarSection) {
    const ul = navBarSection.querySelector('ul');
    if (ul) {
      const navUl = ul.cloneNode(true);
      navUl.className = 'nav-category-links';
      navUl.querySelectorAll('.button').forEach((btn) => { btn.className = ''; });
      navUl.querySelectorAll('.button-container').forEach((bc) => { bc.className = ''; });
      bottomRowInner.append(navUl);
    }
  }

  // Right: Delivery + Coupons + Store
  const rightNav = document.createElement('div');
  rightNav.className = 'nav-bottom-right';
  rightNav.innerHTML = `<span class="nav-delivery-label">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    Pickup, Delivery or Shipping</span>
    <a href="https://www.bjs.com/myCoupons" class="nav-coupons-link">Coupons</a>`;
  bottomRowInner.append(rightNav);
  bottomRow.append(bottomRowInner);
  nav.append(bottomRow);

  // === ROW 3: Promo pencil banner ===
  const promoRow = document.createElement('div');
  promoRow.className = 'nav-promo-bar';
  promoRow.innerHTML = `<div class="nav-promo-inner">
    <p>Over $1,000 in savings to start your summer. <a href="https://www.bjs.com/deals/promo/red-hot-event/">Shop Red Hot Summer</a></p>
  </div>`;
  nav.append(promoRow);

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
