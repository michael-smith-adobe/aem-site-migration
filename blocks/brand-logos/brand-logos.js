export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'brand-logos-image';
      } else {
        div.className = 'brand-logos-body';
      }
    });

    // Wrap entire card in the link from the body
    const imageDiv = li.querySelector('.brand-logos-image');
    const bodyDiv = li.querySelector('.brand-logos-body');
    if (imageDiv && bodyDiv) {
      const link = bodyDiv.querySelector('a');
      if (link) {
        const wrapper = document.createElement('a');
        wrapper.href = link.href;
        wrapper.className = 'brand-logos-link';
        wrapper.append(imageDiv.cloneNode(true));
        wrapper.append(bodyDiv.cloneNode(true));
        li.textContent = '';
        li.append(wrapper);
      }
    }

    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
