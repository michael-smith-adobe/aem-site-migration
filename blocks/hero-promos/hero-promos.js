/**
 * Hero Promos block — a row of promotional cards.
 * The first row is "featured" (spans double width on desktop).
 * Each row has two cells: text content | image.
 * @param {Element} block The hero-promos block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row, index) => {
    row.classList.add('hero-promos-card');
    if (index === 0) row.classList.add('hero-promos-featured');

    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]) cells[0].classList.add('hero-promos-text');
    if (cells[1]) cells[1].classList.add('hero-promos-image');

    // Wrap the entire card in its link if one exists
    const link = row.querySelector('a');
    if (link) {
      const wrapper = document.createElement('a');
      wrapper.href = link.href;
      wrapper.className = 'hero-promos-link';
      wrapper.setAttribute('aria-label', link.textContent || 'View promotion');
      // Move all children into the wrapper
      while (row.firstChild) wrapper.appendChild(row.firstChild);
      row.appendChild(wrapper);
      // Remove the original inline link from text to avoid duplication
      const inlineLink = wrapper.querySelector('.hero-promos-text a');
      if (inlineLink) {
        const parent = inlineLink.parentElement;
        if (parent && parent.tagName === 'P' && parent.children.length === 1) {
          parent.remove();
        }
      }
    }
  });
}
