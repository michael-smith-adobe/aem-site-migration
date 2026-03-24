import { createOptimizedPicture } from '../../scripts/aem.js';

function updateArrowState(ul, prevBtn, nextBtn) {
  const { scrollLeft, scrollWidth, clientWidth } = ul;
  prevBtn.disabled = scrollLeft <= 0;
  nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-insight-card-image';
      else div.className = 'cards-insight-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  /* add navigation arrows */
  const nav = document.createElement('div');
  nav.className = 'cards-insight-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'cards-insight-arrow cards-insight-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  prevBtn.disabled = true;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-insight-arrow cards-insight-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  prevBtn.addEventListener('click', () => {
    const card = ul.querySelector('li');
    if (card) {
      ul.scrollBy({ left: -(card.offsetWidth + 24), behavior: 'smooth' });
    }
  });

  nextBtn.addEventListener('click', () => {
    const card = ul.querySelector('li');
    if (card) {
      ul.scrollBy({ left: card.offsetWidth + 24, behavior: 'smooth' });
    }
  });

  ul.addEventListener('scroll', () => {
    updateArrowState(ul, prevBtn, nextBtn);
  });

  // Initial state
  setTimeout(() => updateArrowState(ul, prevBtn, nextBtn), 100);

  nav.append(prevBtn, nextBtn);
  block.append(nav);
}
