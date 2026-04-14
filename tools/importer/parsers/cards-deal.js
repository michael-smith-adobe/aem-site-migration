/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-deal. Base: cards.
 * Source: https://www.qvc.com
 * Extracts teaser card grids (deal categories, spotlight, shop by category, etc.)
 * Source DOM: section with CORE_MODULE_CONTAINER or SHOP_BY_CATEGORY contains
 *   .cmp-teaser with .cmp-teaser__image (picture > img) and .cmp-teaser__content (p.cmp-teaser__title)
 *   OR .galleryItem with category images and text labels
 * Target: Cards block - 2 columns per row: image | title + description + link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Core Teaser cards (TOP_DEALS, SAVINGSSHOWCASE, INTHESPOTLIGHT, WATCHSHOPFROMANYWHERE)
  const teasers = element.querySelectorAll('.cmp-teaser');

  if (teasers.length > 0) {
    teasers.forEach((teaser) => {
      const link = teaser.querySelector('a.cmp-teaser-link, a[href]');
      const img = teaser.querySelector('.cmp-teaser__image img, img');
      const titleEl = teaser.querySelector('.cmp-teaser__title, .cmp-teaser__pretitle');
      const descEl = teaser.querySelector('.cmp-teaser__description');

      // Fix lazy-loaded images
      if (img) {
        const realSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (realSrc && !realSrc.startsWith('data:')) {
          img.setAttribute('src', realSrc);
        }
      }

      const imageCell = img ? [img] : [];
      const textCell = [];

      if (titleEl) {
        const heading = document.createElement('p');
        heading.innerHTML = `<strong>${titleEl.textContent.trim()}</strong>`;
        textCell.push(heading);
      }
      if (descEl) {
        const desc = document.createElement('p');
        desc.textContent = descEl.textContent.trim();
        textCell.push(desc);
      }
      if (link && link.href) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = titleEl ? titleEl.textContent.trim() : 'Shop Now';
        textCell.push(cta);
      }

      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
  }

  // Pattern 2: Shop by Category items (galleryItem with category images)
  if (teasers.length === 0) {
    const categoryItems = element.querySelectorAll('.galleryItem');
    categoryItems.forEach((item) => {
      const link = item.querySelector('a[href]');
      const img = item.querySelector('img');
      const label = item.querySelector('.productDesc, .catText, .categoryText, p');

      if (img) {
        const realSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (realSrc && !realSrc.startsWith('data:')) {
          img.setAttribute('src', realSrc);
        }
      }

      // Skip items without both image and label
      if (!img && !label) return;

      const imageCell = img ? [img] : [];
      const textCell = [];

      if (label && label.textContent.trim()) {
        const heading = document.createElement('p');
        heading.innerHTML = `<strong>${label.textContent.trim()}</strong>`;
        textCell.push(heading);
      }
      if (link && link.href) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = label && label.textContent.trim() ? label.textContent.trim() : 'Shop';
        textCell.push(cta);
      }

      if (imageCell.length > 0 && textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
  }

  // Pattern 3: Lunch time / Prime time specials product tiles
  if (cells.length === 0) {
    const productItems = element.querySelectorAll('.carouselItem, .productItem');
    productItems.forEach((item) => {
      const img = item.querySelector('img');
      const nameEl = item.querySelector('.productDesc, .productName, a[class*="product"]');
      const priceEl = item.querySelector('.productPrice, [class*="price"]');
      const link = item.querySelector('a[href]');

      if (img) {
        const realSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (realSrc && !realSrc.startsWith('data:')) {
          img.setAttribute('src', realSrc);
        }
      }

      const imageCell = img ? [img] : [];
      const textCell = [];

      if (nameEl) {
        const heading = document.createElement('p');
        heading.innerHTML = `<strong>${nameEl.textContent.trim()}</strong>`;
        textCell.push(heading);
      }
      if (priceEl) {
        const price = document.createElement('p');
        price.textContent = priceEl.textContent.trim();
        textCell.push(price);
      }
      if (link && link.href) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = 'Shop Now';
        textCell.push(cta);
      }

      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-deal', cells });
  element.replaceWith(block);
}
