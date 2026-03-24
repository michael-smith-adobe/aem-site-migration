import { createOptimizedPicture } from '../../scripts/aem.js';

const cardDetails = [
  'Receive a $125 American Airlines flight discount after spending $20,000 or more in purchases during your cardmembership year and renewing your card.',
  'Earn a one-time statement credit of up to $150 on your first Turo trip when you use your card.',
  'Save 25% on inflight food and beverage purchases as a benefit of your card.',
];

const modalContent = `
  <h2>Additional Information &ndash; Citi<sup>&reg;</sup> / AAdvantage<sup>&reg;</sup> Platinum Select<sup>&reg;</sup> World Elite Mastercard<sup>&reg;</sup></h2>
  <p>When you register for digital access, you will be required to agree to receive monthly statements and some legal notices only electronically if you have not agreed previously. You can change your delivery preferences at any time after registration by managing the paperless settings for your account.</p>
  <h3>Offer Availability</h3>
  <p>American Airlines AAdvantage<sup>&reg;</sup> bonus miles are not available if you have received a new account bonus for a Citi<sup>&reg;</sup> / AAdvantage<sup>&reg;</sup> Platinum Select<sup>&reg;</sup> account in the past 48 months or if you converted another Citi credit card account on which you earned a new account bonus in the last 48 months into a Citi<sup>&reg;</sup> / AAdvantage<sup>&reg;</sup> Platinum Select<sup>&reg;</sup> account. <strong>The card offer referenced in this communication is only available to individuals who reside in the United States and its territories, excluding Puerto Rico and U.S. Virgin Islands.</strong></p>
  <h3>AAdvantage<sup>&reg;</sup> Bonus Miles</h3>
  <p>Balance transfers, cash advances, checks that access your credit card account, items and services returned for credit, unauthorized charges, interest and account fees, traveler&rsquo;s checks, purchases of foreign currency, money orders, wire transfers (and similar cash-like transactions), lottery tickets, and gaming chips (and similar betting transactions) are not purchases. AAdvantage<sup>&reg;</sup> bonus miles typically will appear as a bonus in your AAdvantage<sup>&reg;</sup> account 8&ndash;10 weeks after you have met the purchase requirements. AAdvantage<sup>&reg;</sup> miles may be earned on purchases made by primary credit cardmembers and Authorized Users. Purchases must post to your account during the promotional period. Many merchants will wait for a purchase to ship before they post the purchase to your account. AAdvantage<sup>&reg;</sup> miles earned will be posted to the primary credit cardmember&rsquo;s AAdvantage<sup>&reg;</sup> account.</p>
  <h3>1 AAdvantage<sup>&reg;</sup> Mile Per $1</h3>
  <p>You will earn 1 AAdvantage<sup>&reg;</sup> mile for every eligible $1 spent on purchases. AAdvantage<sup>&reg;</sup> miles may be earned on purchases made by primary credit cardmembers and Authorized Users.</p>
`;

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'cards-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'cards-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cards-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00d7';

  const body = document.createElement('div');
  body.className = 'cards-modal-body';
  body.innerHTML = modalContent;

  const closeFooter = document.createElement('button');
  closeFooter.className = 'cards-modal-close-btn';
  closeFooter.textContent = 'Close';

  modal.append(closeBtn, body, closeFooter);
  overlay.append(modal);

  const close = () => overlay.remove();
  closeBtn.addEventListener('click', close);
  closeFooter.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.body.append(overlay);
}

function createFootnoteButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cards-footnote-link';
  btn.textContent = '\u00B2';
  btn.setAttribute('aria-label', 'Additional information');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    createModal();
  });
  return btn;
}

function setupOverlayCards(block) {
  if (!block.classList.contains('overlay')) return;

  // Replace ² links with buttons wrapped in <sup> for reliable clickability
  block.querySelectorAll('a[href="#additional-info"]').forEach((link) => {
    const sup = document.createElement('sup');
    sup.append(createFootnoteButton());
    link.replaceWith(sup);
  });

  block.querySelectorAll(':scope > ul > li').forEach((card, index) => {
    // Add hidden description paragraph
    const detail = document.createElement('p');
    detail.className = 'cards-card-detail';
    detail.textContent = cardDetails[index] || '';
    const sup = document.createElement('sup');
    sup.append(createFootnoteButton());
    detail.append(sup);
    card.querySelector('.cards-card-body')?.append(detail);

    // Create expand/collapse button (replaces CSS ::after pseudo-element)
    const expandBtn = document.createElement('button');
    expandBtn.type = 'button';
    expandBtn.className = 'cards-expand-btn';
    expandBtn.textContent = '+';
    expandBtn.setAttribute('aria-label', 'Expand card');
    card.append(expandBtn);

    // Toggle expanded state only via the expand button
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.toggle('expanded');
      expandBtn.textContent = isExpanded ? '\u00d7' : '+';
      expandBtn.setAttribute('aria-label', isExpanded ? 'Collapse card' : 'Expand card');
    });
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else if (!div.textContent.trim() && !div.querySelector('picture')) div.remove();
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  // Skip image optimization for explore-section cards (small thumbnails)
  const isExplore = !!block.closest('.section.explore');
  if (!isExplore) {
    ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  }
  block.replaceChildren(ul);

  setupOverlayCards(block);

  // Explore section: move h2 into cards-wrapper and add chevrons
  const exploreSection = block.closest('.section.explore');
  if (exploreSection) {
    const dcw = exploreSection.querySelector('.default-content-wrapper');
    const h2 = dcw?.querySelector('h2');
    const wrapper = block.closest('.cards-wrapper');
    if (h2 && wrapper) {
      wrapper.prepend(h2);
    }
    // Add chevron arrow to each card item
    block.querySelectorAll(':scope > ul > li').forEach((li) => {
      const chevron = document.createElement('span');
      chevron.className = 'cards-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      li.append(chevron);
    });
  }
}
