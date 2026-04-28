function updateActiveSlide(slide) {
  const block = slide.closest('.offers-carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.offers-carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  block.querySelector('.offers-carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.offers-carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.classList.add('offers-carousel-slide');
  slide.setAttribute('role', 'listitem');

  const cols = [...row.children];
  const imageCol = cols[0];
  const contentCol = cols[1];

  if (imageCol) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'offers-carousel-slide-image';
    imageDiv.append(...imageCol.childNodes);
    slide.append(imageDiv);
  }

  if (contentCol) {
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'offers-carousel-slide-body';

    const paragraphs = [...contentCol.querySelectorAll('p')];
    paragraphs.forEach((p, idx) => {
      const text = p.textContent.trim();
      if (!text) return;

      if (idx === 0) {
        // Offer title
        const titleSpan = document.createElement('p');
        titleSpan.className = 'offers-carousel-offer-title';
        titleSpan.innerHTML = p.innerHTML;
        bodyDiv.append(titleSpan);
      } else if (idx === 1) {
        // Brand label (e.g. "myW exclusive")
        const brandSpan = document.createElement('p');
        brandSpan.className = 'offers-carousel-brand-label';
        brandSpan.innerHTML = p.innerHTML;
        bodyDiv.append(brandSpan);
      } else if (idx === 2) {
        // Coupon type (e.g. "myWalgreens", "Manufacturer's coupon")
        const typeSpan = document.createElement('p');
        typeSpan.className = 'offers-carousel-coupon-type';
        typeSpan.innerHTML = p.innerHTML;
        bodyDiv.append(typeSpan);
      }
    });

    // Add clip button
    const clipBtn = document.createElement('button');
    clipBtn.className = 'offers-carousel-clip-btn';
    clipBtn.textContent = 'Clip';
    clipBtn.setAttribute('type', 'button');
    bodyDiv.append(clipBtn);

    slide.append(bodyDiv);
  }

  return slide;
}

export default function decorate(block) {
  // Extract header text from first row if it's a single-cell header
  const rows = [...block.querySelectorAll(':scope > div')];
  let headerText = 'Offers just for you';

  // Check if first row is the header (single cell, no image)
  const firstRow = rows[0];
  if (firstRow) {
    const firstCols = [...firstRow.children];
    const hasImage = firstRow.querySelector('picture, img');
    if (firstCols.length === 1 && !hasImage) {
      headerText = firstRow.textContent.trim() || headerText;
      rows.shift();
      firstRow.remove();
    }
  }

  // Build header
  const header = document.createElement('div');
  header.className = 'offers-carousel-header';
  const h3 = document.createElement('h3');
  h3.textContent = headerText;
  header.append(h3);

  // Build slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'offers-carousel-slides-container';

  const slidesList = document.createElement('ul');
  slidesList.className = 'offers-carousel-slides';
  slidesList.setAttribute('role', 'list');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx);
    slidesList.append(slide);
    row.remove();
  });

  // Navigation buttons
  const navButtons = document.createElement('div');
  navButtons.className = 'offers-carousel-navigation';
  navButtons.innerHTML = `
    <button type="button" class="slide-prev" aria-label="Previous offers"></button>
    <button type="button" class="slide-next" aria-label="Next offers"></button>
  `;

  slidesContainer.append(navButtons);
  slidesContainer.append(slidesList);

  block.textContent = '';
  block.append(header);
  block.append(slidesContainer);
  block.dataset.activeSlide = '0';

  bindEvents(block);
}
