export default function decorate(block) {
  const rows = [...block.children];
  // Last row contains the action links, preceding rows are cards
  const actionRow = rows.pop();
  const cardRows = rows;

  // Build cards list
  const cardsUl = document.createElement('ul');
  cardsUl.classList.add('health-module-cards');

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('health-module-card');

    const cols = [...row.children];
    const imageCol = cols[0];
    const textCol = cols[1];

    // Wrap card in anchor from the "Learn more" link
    const link = textCol?.querySelector('a');
    const href = link?.href || '#';

    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.classList.add('health-module-card-link');

    // Image
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('health-module-card-image');
    const picture = imageCol?.querySelector('picture');
    if (picture) imageDiv.append(picture);
    anchor.append(imageDiv);

    // Text body
    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('health-module-card-body');

    if (textCol) {
      [...textCol.children].forEach((child) => {
        // Skip the "Learn more" paragraph (the link we already extracted)
        if (child.tagName === 'P' && child.querySelector('a') && child.children.length === 1) return;
        bodyDiv.append(child.cloneNode(true));
      });
    }
    anchor.append(bodyDiv);

    li.append(anchor);
    cardsUl.append(li);
  });

  // Build actions bar
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('health-module-actions');

  const actionCols = [...actionRow.children];
  actionCols.forEach((col) => {
    const actionLink = document.createElement('a');
    const origLink = col.querySelector('a');
    actionLink.href = origLink?.href || '#';
    actionLink.classList.add('health-module-action');

    const icon = col.querySelector('picture');
    if (icon) {
      const iconDiv = document.createElement('span');
      iconDiv.classList.add('health-module-action-icon');
      iconDiv.append(icon);
      actionLink.append(iconDiv);
    }

    const text = origLink?.textContent?.trim() || col.textContent?.trim() || '';
    const textSpan = document.createElement('span');
    textSpan.classList.add('health-module-action-text');
    textSpan.textContent = text;
    actionLink.append(textSpan);

    actionsDiv.append(actionLink);
  });

  block.textContent = '';
  block.append(cardsUl);
  block.append(actionsDiv);
}
