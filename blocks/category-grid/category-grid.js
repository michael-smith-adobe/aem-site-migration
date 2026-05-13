import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    /* first cell: image */
    const imgCell = cols[0];
    const pic = imgCell && imgCell.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      const imgWrap = document.createElement('div');
      imgWrap.className = 'category-grid-image';
      imgWrap.append(optimized);
      li.append(imgWrap);
    }

    /* second cell: label (may be a link) */
    const textCell = cols[1];
    if (textCell) {
      const label = document.createElement('div');
      label.className = 'category-grid-label';
      const link = textCell.querySelector('a');
      if (link) {
        label.append(link);
      } else {
        label.textContent = textCell.textContent.trim();
      }
      li.append(label);
    }

    /* wrap entire li in the first link found, for click-ability */
    const anchor = li.querySelector('a');
    if (anchor) {
      const wrapper = document.createElement('a');
      wrapper.href = anchor.href;
      wrapper.className = 'category-grid-tile';
      wrapper.title = anchor.textContent.trim();
      /* move children into the wrapper */
      while (li.firstChild) wrapper.append(li.firstChild);
      /* replace text link with plain span */
      const textLink = wrapper.querySelector('.category-grid-label a');
      if (textLink) {
        const span = document.createElement('span');
        span.textContent = textLink.textContent;
        textLink.replaceWith(span);
      }
      li.append(wrapper);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
