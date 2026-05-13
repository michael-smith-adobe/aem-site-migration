import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* Structure: each row has 2 cells — [image] [link text + URL] */
  const ul = document.createElement('ul');
  let isFirst = true;

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];

    // First cell: image (picture or img)
    const imageCell = cells[0];
    // Second cell: link/text
    const textCell = cells[1];

    if (imageCell) {
      const pic = imageCell.querySelector('picture') || imageCell.querySelector('img');
      const link = textCell?.querySelector('a');

      if (isFirst && pic && link) {
        // First item is the banner/hero tile
        isFirst = false;
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'deals-hub-banner';
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.setAttribute('aria-label', link.textContent || pic.querySelector?.('img')?.alt || 'Explore deals');
        anchor.append(pic.cloneNode(true));
        imgWrapper.append(anchor);
        li.append(imgWrapper);
        li.classList.add('deals-hub-banner-item');
      } else if (pic && link) {
        isFirst = false;
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.className = 'deals-hub-card-link';
        anchor.setAttribute('aria-label', pic.querySelector?.('img')?.alt || link.textContent);

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'deals-hub-card-image';
        imgWrapper.append(pic.cloneNode(true));

        const label = document.createElement('div');
        label.className = 'deals-hub-card-label';
        label.textContent = link.textContent.trim() || 'Shop Now';

        anchor.append(imgWrapper);
        anchor.append(label);
        li.append(anchor);
      }
    }

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
