import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'promo-cards-card-image';
      } else {
        div.className = 'promo-cards-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  // Wrap each li in a card link if body contains a link
  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.promo-cards-card-body');
    if (!body) return;
    const links = body.querySelectorAll('a');
    if (links.length >= 1) {
      const a = links[0];
      const wrapper = document.createElement('a');
      wrapper.href = a.href;
      wrapper.className = 'promo-cards-card-link';
      // Remove the paragraph containing the link
      const linkP = a.closest('p');
      if (linkP) linkP.remove();
      // Move all remaining children of li into the wrapper
      while (li.firstChild) wrapper.append(li.firstChild);
      li.append(wrapper);
    }
  });

  block.replaceChildren(ul);
}
