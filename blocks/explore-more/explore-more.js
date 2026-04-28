/**
 * Explore More block — a 4-column card grid with image, title, and description.
 * Each row in the block table = one card (collection content model).
 * Cell 1: image, Cell 2: link + title + description text.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('explore-more-card');

    const cells = [...row.children];
    if (cells.length >= 2) {
      cells[0].classList.add('explore-more-card-image');
      cells[1].classList.add('explore-more-card-body');

      // Wrap entire card in the link if one exists in the body cell
      const link = cells[1].querySelector('a');
      if (link) {
        const wrapper = document.createElement('a');
        wrapper.href = link.href;
        wrapper.className = 'explore-more-card-link';
        wrapper.setAttribute('aria-label', link.textContent.trim() || 'Learn more');

        // Move image and body inside the link wrapper
        wrapper.append(cells[0], cells[1]);
        row.append(wrapper);

        // Remove the original link from the body to avoid nested <a>
        // Replace it with a span preserving text
        const span = document.createElement('span');
        span.className = link.className;
        span.textContent = link.textContent;
        link.replaceWith(span);
      }
    }
  });
}
