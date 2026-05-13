import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    /* first cell: icon image */
    const imgCell = cols[0];
    const pic = imgCell && imgCell.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const imgWrap = document.createElement('div');
      imgWrap.className = 'services-grid-icon';
      imgWrap.append(optimized);
      li.append(imgWrap);
    }

    /* second cell: title + CTA link */
    const textCell = cols[1];
    if (textCell) {
      const body = document.createElement('div');
      body.className = 'services-grid-body';

      const title = textCell.querySelector('strong, h4, h3');
      if (title) {
        const titleEl = document.createElement('p');
        titleEl.className = 'services-grid-title';
        titleEl.textContent = title.textContent.trim();
        body.append(titleEl);
      }

      const link = textCell.querySelector('a');
      if (link) {
        const cta = document.createElement('p');
        cta.className = 'services-grid-cta';
        cta.append(link);
        body.append(cta);
      }

      li.append(body);
    }

    /* wrap the whole li in a link if one exists */
    const anchor = li.querySelector('a');
    if (anchor) {
      const wrapper = document.createElement('a');
      wrapper.href = anchor.href;
      wrapper.className = 'services-grid-tile';
      wrapper.title = li.querySelector('.services-grid-title')?.textContent || '';
      if (anchor.target) wrapper.target = anchor.target;
      if (anchor.rel) wrapper.rel = anchor.rel;

      while (li.firstChild) wrapper.append(li.firstChild);

      /* replace the inner link with a span to avoid nested anchors */
      const innerLink = wrapper.querySelector('.services-grid-cta a');
      if (innerLink) {
        const span = document.createElement('span');
        span.textContent = innerLink.textContent;
        innerLink.replaceWith(span);
      }

      li.append(wrapper);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
