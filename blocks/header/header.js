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
 * Builds a two-row QVC-style header:
 * Row 1: Logo | Primary actions (Items On Air) | Search | Sign In | Cart
 * Row 2: Category links bar
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Collect sections from fragment (skip <hr> elements)
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  nav.querySelectorAll(':scope > hr').forEach((hr) => hr.remove());
  const sections = [...nav.children];

  // Clear nav and rebuild with two-row structure
  nav.textContent = '';

  // === Extract content from the 3 sections ===
  const brandSection = sections[0]; // Logo
  const linksSection = sections[1]; // Category links
  const toolsSection = sections[2]; // Items On Air, Sign In

  // === ROW 1: Top bar (logo + primary actions + search + tools) ===
  const topRow = document.createElement('div');
  topRow.className = 'nav-top-row';

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
      const img = document.createElement('img');
      img.src = logoImg.src;
      img.alt = logoImg.alt || 'QVC home';
      img.className = 'nav-logo-icon';
      a.append(img);
      const text = document.createElement('span');
      text.className = 'nav-logo-text';
      text.textContent = 'QVC';
      a.append(text);
      brand.append(a);
    }
  }
  topRow.append(brand);

  // Shop & Watch dropdown buttons
  const shopWatch = document.createElement('div');
  shopWatch.className = 'nav-primary-actions';

  const shopBtn = document.createElement('button');
  shopBtn.type = 'button';
  shopBtn.className = 'nav-dropdown-btn';
  shopBtn.innerHTML = 'Shop <span class="nav-caret"></span>';
  shopWatch.append(shopBtn);

  const watchBtn = document.createElement('button');
  watchBtn.type = 'button';
  watchBtn.className = 'nav-dropdown-btn';
  watchBtn.innerHTML = 'Watch <span class="nav-caret"></span>';
  shopWatch.append(watchBtn);

  // Items On Air link
  if (toolsSection) {
    const toolLinks = toolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      if (link.textContent.trim().toLowerCase().includes('items')) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        a.className = 'nav-action-link';
        shopWatch.append(a);
      }
    });
  }
  topRow.append(shopWatch);

  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'nav-search';
  searchBar.innerHTML = `<div class="nav-search-field">
    <input type="text" placeholder="Enter Keyword or Item #" aria-label="Search">
    <button type="button" aria-label="Search" class="nav-search-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" fill="currentColor"/>
      </svg>
    </button>
  </div>`;
  topRow.append(searchBar);

  // Account tools (Sign In, Cart)
  const accountTools = document.createElement('div');
  accountTools.className = 'nav-account-tools';
  if (toolsSection) {
    const toolLinks = toolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      const text = link.textContent.trim();
      if (!text.toLowerCase().includes('items')) {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'nav-account-link';
        // Add person icon for Sign In
        if (text.toLowerCase().includes('sign')) {
          a.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          </svg><span>${text}</span>`;
        } else {
          a.innerHTML = `<span>${text}</span>`;
        }
        accountTools.append(a);
      }
    });
  }

  // Cart link
  const cartLink = document.createElement('a');
  cartLink.href = 'https://www.qvc.com/checkout/cart.html';
  cartLink.className = 'nav-account-link nav-cart-link';
  cartLink.innerHTML = `<span class="nav-cart-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.6 13.5h11.8c.35 0 .69-.12.96-.35.27-.22.45-.54.51-.88L21 6H5.25" fill="currentColor"/>
    <path d="M4.6 1.5h-2.1l3.4 14.4c.09.52.36.99.77 1.33.4.34.9.52 1.43.52h9.15" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="8.6" cy="19.1" r="1.9" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="17.6" cy="19.1" r="1.9" stroke="currentColor" stroke-width="1.5" fill="none"/>
  </svg><span class="nav-cart-badge">0</span></span><span>Cart</span>`;
  accountTools.append(cartLink);

  topRow.append(accountTools);

  nav.append(topRow);

  // === ROW 2: Category links bar ===
  const bottomRow = document.createElement('div');
  bottomRow.className = 'nav-bottom-row';
  const bottomRowInner = document.createElement('div');
  bottomRowInner.className = 'nav-bottom-row-inner';
  if (linksSection) {
    const ul = linksSection.querySelector('ul');
    if (ul) {
      const navUl = ul.cloneNode(true);
      navUl.className = 'nav-category-links';
      // Strip button classes that DA may have added
      navUl.querySelectorAll('.button').forEach((btn) => { btn.className = ''; });
      navUl.querySelectorAll('.button-container').forEach((bc) => { bc.className = ''; });
      bottomRowInner.append(navUl);
    }
  }

  // "Today's Special Value & Deals" link on the right
  const tsvLink = document.createElement('a');
  tsvLink.href = 'https://www.qvc.com/collections/deals-todays-special-value.html';
  tsvLink.className = 'nav-tsv-deals';
  tsvLink.innerHTML = '<span class="nav-tsv-highlight">Today\'s Special Value</span> &amp; Deals <span class="nav-caret"></span>';
  bottomRowInner.append(tsvLink);
  bottomRow.append(bottomRowInner);

  nav.append(bottomRow);

  // === HAMBURGER (mobile) ===
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  topRow.prepend(hamburger);

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
