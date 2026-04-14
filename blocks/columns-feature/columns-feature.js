export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-feature-${cols.length}-cols`);

  // setup image columns - first column with an img gets the image-col class
  [...block.children].forEach((row) => {
    const rowCols = [...row.children];
    const imgCol = rowCols.find((col) => col.querySelector('img') && !col.querySelector('h1, h2, h3, h4, h5, h6'));
    if (imgCol) {
      imgCol.classList.add('columns-feature-img-col');
      // Hide the "Shop Now" link in the image column (it's duplicated in text column)
      const imgLink = imgCol.querySelector('a');
      if (imgLink) imgLink.style.display = 'none';
    }
  });
}
