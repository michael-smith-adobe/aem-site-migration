import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'photo-gifts-card-image';
      } else {
        div.className = 'photo-gifts-card-body';
      }
    });

    // Wrap the whole card in its link for clickability
    const bodyDiv = li.querySelector('.photo-gifts-card-body');
    const imageDiv = li.querySelector('.photo-gifts-card-image');
    if (bodyDiv && imageDiv) {
      const link = bodyDiv.querySelector('a');
      if (link) {
        const wrapper = document.createElement('a');
        wrapper.href = link.href;
        wrapper.className = 'photo-gifts-card-link';
        while (li.firstChild) wrapper.append(li.firstChild);
        li.append(wrapper);
        // Remove the original link text to avoid duplicate
        const linkP = link.closest('p');
        if (linkP) linkP.remove();
      }
    }

    ul.append(li);
  });

  // Mark first card as featured (double-wide)
  const firstLi = ul.querySelector('li');
  if (firstLi) firstLi.classList.add('photo-gifts-featured');

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(ul);
}
