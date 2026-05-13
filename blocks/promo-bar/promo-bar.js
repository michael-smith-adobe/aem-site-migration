export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')];
  items.forEach((item) => {
    item.classList.add('promo-bar-item');
    const cell = item.querySelector(':scope > div');
    if (cell) {
      const paragraphs = [...cell.querySelectorAll('p')];
      if (paragraphs.length >= 2) {
        paragraphs[0].classList.add('promo-bar-copy');
        paragraphs[1].classList.add('promo-bar-cta');
      }
    }
  });
}
