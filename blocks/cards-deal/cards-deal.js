import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'cards-deal-card-image';
      } else {
        div.className = 'cards-deal-card-body';
      }
    });

    // Wrap card image in the link from the body, hide the link paragraph
    const imageDiv = li.querySelector('.cards-deal-card-image');
    const bodyDiv = li.querySelector('.cards-deal-card-body');
    if (imageDiv && bodyDiv) {
      const link = bodyDiv.querySelector('a');
      if (link && imageDiv.querySelector('img')) {
        const wrapper = document.createElement('a');
        wrapper.href = link.href;
        wrapper.className = 'cards-deal-card-link';
        while (imageDiv.firstChild) wrapper.append(imageDiv.firstChild);
        imageDiv.append(wrapper);
        // Hide the link paragraph, keep only the title
        const linkP = link.closest('p');
        if (linkP) linkP.style.display = 'none';
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
