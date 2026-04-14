/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product. Base: carousel.
 * Source: https://www.qvc.com
 * Extracts product carousels (Best Night's Sleep, Deals).
 * Source DOM: section with PRODUCT_CAROUSEL contains
 *   .carouselItem with product image, .productDesc (name), .productPrice
 * Target: Carousel block - 2 columns per row: image | title + description + link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all carousel product items
  const items = element.querySelectorAll('.carouselItem');

  items.forEach((item) => {
    const img = item.querySelector('img');
    const nameEl = item.querySelector('.productDesc a, .productName, [class*="productDesc"]');
    const priceEl = item.querySelector('.productPrice, [class*="price"]');
    const link = item.querySelector('a[href]');

    // Fix lazy-loaded images
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
      cta.textContent = nameEl ? nameEl.textContent.trim() : 'View Product';
      textCell.push(cta);
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
