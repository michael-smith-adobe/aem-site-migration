/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo. Base: hero.
 * Source: https://www.qvc.com
 * Extracts full-width promotional banner image with link.
 * Source DOM: section[data-module-feature-name='TOP_NEW_YEARS_SALE'] contains
 *   .largeStaticImage > .row > .col-tn-12 > a[href] > .background > img
 * Target: Hero block with 1 column - row 1: background image, row 2: (empty or link text)
 */
export default function parse(element, { document }) {
  // Extract the main link wrapping the hero image
  const link = element.querySelector('.largeStaticImage a[href], a[href]');

  // Extract the desktop image (visible-dt) or fallback to any img
  const desktopImg = element.querySelector('img.visible-dt, img.cq-dd-largeDisplayImage');
  const mobileImg = element.querySelector('img.visible-mb, img.imageCrop');
  const heroImg = desktopImg || mobileImg || element.querySelector('img');

  const cells = [];

  // Row 1: Background image
  if (heroImg) {
    // Fix lazy-loaded src if needed
    const realSrc = heroImg.getAttribute('data-src') || heroImg.getAttribute('src') || '';
    if (realSrc && !realSrc.startsWith('data:')) {
      heroImg.setAttribute('src', realSrc);
    }
    cells.push([heroImg]);
  }

  // Row 2: Link as CTA (extract alt text as heading + link)
  const contentCell = [];
  if (heroImg && heroImg.alt) {
    const heading = document.createElement('h2');
    heading.textContent = heroImg.alt.trim();
    contentCell.push(heading);
  }
  if (link) {
    const cta = document.createElement('a');
    cta.href = link.href;
    cta.textContent = 'Shop Now';
    contentCell.push(cta);
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
