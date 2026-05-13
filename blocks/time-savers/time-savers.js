export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row is the header (logo + tagline)
  const headerRow = rows.shift();
  headerRow.classList.add('time-savers-header');

  // Remaining rows are the CTA items
  const nav = document.createElement('ul');
  nav.className = 'time-savers-items';

  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'time-savers-item';

    const cells = [...row.children];
    cells.forEach((cell) => {
      if (cell.querySelector('picture') || cell.querySelector('img')) {
        cell.className = 'time-savers-icon';
      } else {
        cell.className = 'time-savers-label';
      }
    });

    while (row.firstElementChild) li.append(row.firstElementChild);

    // Wrap in a link if one exists in the label cell
    const link = li.querySelector('.time-savers-label a');
    if (link) {
      const wrapper = document.createElement('a');
      wrapper.href = link.href;
      wrapper.className = 'time-savers-link';
      const icon = li.querySelector('.time-savers-icon');
      const label = li.querySelector('.time-savers-label');
      if (icon) wrapper.append(icon);
      // Create a span for the text
      const textSpan = document.createElement('span');
      textSpan.className = 'time-savers-text';
      textSpan.textContent = link.textContent;
      wrapper.append(textSpan);
      li.textContent = '';
      li.append(wrapper);
    }

    nav.append(li);
  });

  // Clear and rebuild
  block.textContent = '';
  block.append(headerRow);
  block.append(nav);
}
