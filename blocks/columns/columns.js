export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Feature section: move preceding h2 into text column for unified centering
  const section = block.closest('.section.feature');
  if (section) {
    const dcw = section.querySelector('.default-content-wrapper');
    const h2 = dcw?.querySelector('h2');
    const textCol = block.querySelector(':scope > div > div:not(.columns-img-col)');
    if (h2 && textCol) {
      textCol.prepend(h2);
    }
  }
}
