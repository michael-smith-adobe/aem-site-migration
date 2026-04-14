/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.qvc.com
 * Extracts two-column flex layouts (TSV, Year in Review, QVC+, Easy Pay & Returns).
 * Source DOM: section with FLEX_IMAGE_TEXT or FLEX_IMAGE_IMAGE contains
 *   .flexMod > .row > .flexContent with .image (picture/img) and .text (rich text + button)
 *   OR .flexDoubleImage with two side-by-side linked images
 * Target: Columns block - 2+ columns per row: col1 content | col2 content
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Flex Image + Text (TSV, Year in Review, QVC+)
  const flexContent = element.querySelector('.flexContent');
  if (flexContent) {
    const imageCol = flexContent.querySelector('.image, .col-xs-9, .col-xs-6:first-child');
    const textCol = flexContent.querySelector('.text, .col-xs-3, .col-xs-6:last-child');

    const leftCell = [];
    const rightCell = [];

    // Extract image from left column
    if (imageCol) {
      const img = imageCol.querySelector('img');
      if (img) {
        const realSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (realSrc && !realSrc.startsWith('data:')) {
          img.setAttribute('src', realSrc);
        }
        leftCell.push(img);
      }
      const imgLink = imageCol.querySelector('a[href]');
      if (imgLink && imgLink.href) {
        const link = document.createElement('a');
        link.href = imgLink.href;
        link.textContent = 'Shop Now';
        leftCell.push(link);
      }
    }

    // Extract text content from right column
    if (textCol) {
      const headings = textCol.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((h) => rightCell.push(h));

      const paragraphs = textCol.querySelectorAll('[data-component-type="RICH_TEXT"] p, .qComponent > p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) rightCell.push(p);
      });

      const buttons = textCol.querySelectorAll('a.btn, a[role="button"], [data-component-type="BUTTON"] a');
      buttons.forEach((btn) => {
        const link = document.createElement('a');
        link.href = btn.href;
        link.textContent = btn.textContent.trim();
        rightCell.push(link);
      });
    }

    if (leftCell.length > 0 || rightCell.length > 0) {
      cells.push([leftCell, rightCell]);
    }
  }

  // Pattern 2: Flex Double Image (Easy Pay & Returns)
  if (!flexContent) {
    const flexDouble = element.querySelector('.flexDoubleImage, .flexMod');
    if (flexDouble) {
      const imageItems = element.querySelectorAll('[data-component-type="IMAGE_ITEM"], .flexImageItem');

      if (imageItems.length >= 2) {
        const leftCell = [];
        const rightCell = [];

        imageItems.forEach((item, idx) => {
          const img = item.querySelector('img');
          const link = item.querySelector('a[href]');
          const targetCell = idx === 0 ? leftCell : rightCell;

          if (img) {
            const realSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
            if (realSrc && !realSrc.startsWith('data:')) {
              img.setAttribute('src', realSrc);
            }
            targetCell.push(img);
          }
          if (link && link.href) {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = img && img.alt ? img.alt.trim() : 'Learn More';
            targetCell.push(a);
          }
        });

        cells.push([leftCell, rightCell]);
      } else {
        // Fallback: find any images and links
        const allImgs = element.querySelectorAll('img');
        const allLinks = element.querySelectorAll('a[href]');
        const leftCell = [];
        const rightCell = [];

        allImgs.forEach((img, idx) => {
          const realSrc = img.getAttribute('data-src') || img.getAttribute('src') || '';
          if (realSrc && !realSrc.startsWith('data:')) {
            img.setAttribute('src', realSrc);
          }
          if (idx === 0) leftCell.push(img);
          else rightCell.push(img);
        });

        if (leftCell.length > 0 || rightCell.length > 0) {
          cells.push([leftCell, rightCell]);
        }
      }
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
