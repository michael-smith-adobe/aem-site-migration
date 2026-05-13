export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1: background image
  const bgRow = rows[0];
  const bgPic = bgRow.querySelector('picture');
  if (bgPic) {
    const bgImg = bgPic.querySelector('img');
    if (bgImg) {
      block.style.backgroundImage = `url("${bgImg.src}")`;
      block.style.backgroundSize = 'cover';
      block.style.backgroundPosition = 'center';
    }
    bgRow.remove();
  }

  // Row 2: foreground content (image + link)
  const contentRow = rows[1];
  if (contentRow) {
    const link = contentRow.querySelector('a');
    const picture = contentRow.querySelector('picture');

    if (link && picture) {
      // Wrap picture in the link
      link.textContent = '';
      link.appendChild(picture);
      link.classList.add('hero-banner-link');
      contentRow.textContent = '';
      contentRow.appendChild(link);
    } else if (picture) {
      contentRow.textContent = '';
      contentRow.appendChild(picture);
    }

    contentRow.classList.add('hero-banner-content');
  }
}
