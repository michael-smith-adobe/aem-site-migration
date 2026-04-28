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

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-dropdown-open').forEach((el) => {
    el.classList.remove('nav-dropdown-open');
  });
}

/**
 * Builds a Walgreens-style header:
 * Row 0: Promo banner (offers)
 * Row 1: Logo | Search | Store | Account | Cart
 * Row 2: Main navigation links (Pharmacy, Health Services, Shop, etc.)
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

  // Expected sections: [0] brand/logo, [1] promo, [2] nav links, [3] tools (account/cart)
  const brandSection = sections[0] || null;
  const promoSection = sections[1] || null;
  const linksSection = sections[2] || null;
  const toolsSection = sections[3] || null;

  // Clear nav and rebuild
  nav.textContent = '';

  // === PROMO BANNER (Row 0) ===
  const promoBanner = document.createElement('div');
  promoBanner.className = 'nav-promo-banner';
  if (promoSection) {
    const ul = promoSection.querySelector('ul');
    if (ul) {
      const promoUl = ul.cloneNode(true);
      promoUl.className = 'nav-promo-list';
      promoUl.querySelectorAll('.button').forEach((btn) => { btn.className = ''; });
      promoUl.querySelectorAll('.button-container').forEach((bc) => { bc.className = ''; });
      promoBanner.append(promoUl);
    }
  }
  nav.append(promoBanner);

  // === TOP ROW (Row 1): Logo | Search | Store | Account | Cart ===
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
      a.setAttribute('aria-label', 'Walgreens Home');
      const img = document.createElement('img');
      img.src = logoImg.src;
      img.alt = logoImg.alt || 'Walgreens: Trusted since 1901';
      img.className = 'nav-logo-icon';
      a.append(img);
      brand.append(a);
    }
  }
  topRow.append(brand);

  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'nav-search';
  searchBar.innerHTML = `<form class="nav-search-form">
    <input type="text" placeholder="Search" aria-label="Search by keyword or item number" autocomplete="off">
    <button type="submit" aria-label="Search" class="nav-search-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" fill="currentColor"/>
      </svg>
    </button>
  </form>`;
  topRow.append(searchBar);

  // Store locator
  const storeLocator = document.createElement('div');
  storeLocator.className = 'nav-store';
  storeLocator.innerHTML = `<a href="/store/findastore" class="nav-store-link" aria-label="Find a store">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
    </svg>
    <span class="nav-store-text">Store</span>
  </a>`;
  topRow.append(storeLocator);

  // Account
  const accountSection = document.createElement('div');
  accountSection.className = 'nav-account';
  if (toolsSection) {
    const toolLinks = toolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      if (link.textContent.trim().toLowerCase().includes('account')) {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'nav-account-link';
        a.setAttribute('aria-label', 'Account');
        a.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg><span class="nav-account-text">Account</span>`;
        accountSection.append(a);
      }
    });
  }
  topRow.append(accountSection);

  // Cart
  const cartSection = document.createElement('div');
  cartSection.className = 'nav-cart';
  if (toolsSection) {
    const toolLinks = toolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      if (link.textContent.trim().toLowerCase().includes('cart')) {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'nav-cart-link';
        a.setAttribute('aria-label', 'View shopping cart');
        a.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12.94-1.7h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20.04 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42a.25.25 0 0 1-.26-.24z" fill="currentColor"/>
        </svg><span class="nav-cart-badge">0</span>`;
        cartSection.append(a);
      }
    });
  }
  topRow.append(cartSection);

  nav.append(topRow);

  // === BOTTOM ROW (Row 2): Main navigation links ===
  const bottomRow = document.createElement('div');
  bottomRow.className = 'nav-bottom-row';
  const bottomRowInner = document.createElement('div');
  bottomRowInner.className = 'nav-bottom-row-inner';

  if (linksSection) {
    const ul = linksSection.querySelector('ul');
    if (ul) {
      const navUl = document.createElement('ul');
      navUl.className = 'nav-main-links';
      const items = ul.querySelectorAll(':scope > li');
      items.forEach((li) => {
        const navLi = document.createElement('li');
        navLi.className = 'nav-main-item';
        const link = li.querySelector(':scope > a');
        if (link) {
          const subUl = li.querySelector(':scope > ul');
          if (subUl) {
            // Has dropdown
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'nav-main-link nav-has-dropdown';
            btn.textContent = link.textContent.trim();
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const isOpen = navLi.classList.contains('nav-dropdown-open');
              closeAllDropdowns(nav);
              if (!isOpen) navLi.classList.add('nav-dropdown-open');
            });
            navLi.append(btn);

            // Dropdown panel
            const dropdown = document.createElement('div');
            dropdown.className = 'nav-dropdown-panel';
            const dropUl = document.createElement('ul');
            dropUl.className = 'nav-dropdown-list';
            subUl.querySelectorAll(':scope > li > a').forEach((subLink) => {
              const dropLi = document.createElement('li');
              const a = document.createElement('a');
              a.href = subLink.href;
              a.textContent = subLink.textContent.trim();
              dropLi.append(a);
              dropUl.append(dropLi);
            });
            dropdown.append(dropUl);
            navLi.append(dropdown);
          } else {
            // Simple link
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'nav-main-link';
            a.textContent = link.textContent.trim();
            navLi.append(a);
          }
        }
        navUl.append(navLi);
      });
      bottomRowInner.append(navUl);
    }
  }
  bottomRow.append(bottomRowInner);
  nav.append(bottomRow);

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => closeAllDropdowns(nav));

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
