export default function decorate(block) {
  // First row is the banner header (image + link)
  // Remaining rows are brand cards
  const rows = [...block.children];
  if (rows.length < 2) return;

  const bannerRow = rows[0];
  bannerRow.classList.add('exclusive-brands-banner');

  const cardRows = rows.slice(1);
  const cardList = document.createElement('ul');
  cardList.className = 'exclusive-brands-cards';

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'exclusive-brands-card';
    while (row.firstElementChild) li.append(row.firstElementChild);
    cardList.append(li);
    row.remove();
  });

  block.append(cardList);
}
