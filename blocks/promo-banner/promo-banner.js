/**
 * Promo Banner Block
 * Displays a horizontal row of icon+text quick-link pills.
 * Each row in the block table is one pill: icon (col 1), linked text (col 2).
 */
export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')];
  const list = document.createElement('ul');

  items.forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');

    // Column 1: icon (may be a span.icon or a picture/img)
    const iconCol = cols[0];
    const icon = iconCol?.querySelector('.icon, picture, img');
    if (icon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'promo-banner-icon';
      iconWrap.append(icon);
      li.append(iconWrap);
    }

    // Column 2: link text
    const textCol = cols[1];
    if (textCol) {
      const link = textCol.querySelector('a');
      if (link) {
        link.className = 'promo-banner-link';
        li.append(link);
      } else {
        const span = document.createElement('span');
        span.className = 'promo-banner-link';
        span.textContent = textCol.textContent.trim();
        li.append(span);
      }
    }

    list.append(li);
  });

  block.textContent = '';
  block.append(list);
}
