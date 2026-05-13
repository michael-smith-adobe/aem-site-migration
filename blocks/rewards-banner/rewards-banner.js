export default function decorate(block) {
  // The block content is a single row with an image linked to a URL.
  // Structure: div > div > (picture + link text)
  // We wrap the picture in the link for full-width clickable banner behavior.
  const link = block.querySelector('a');
  const picture = block.querySelector('picture');

  if (link && picture) {
    // Move picture inside the link
    const href = link.href;
    const wrapper = document.createElement('a');
    wrapper.href = href;
    wrapper.className = 'rewards-banner-link';
    wrapper.setAttribute('aria-label', picture.querySelector('img')?.alt || 'Promotional banner');
    wrapper.append(picture);

    // Clear block and append the linked picture
    block.textContent = '';
    block.append(wrapper);
  }
}
