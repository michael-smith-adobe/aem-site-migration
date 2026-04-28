function updateActiveSlide(slide) {
  const block = slide.closest('.deals-carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.deals-carousel-slide');
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.deals-carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.deals-carousel-slides').scrollTo({
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
      showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.deals-carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `deals-carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('deals-carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`deals-carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  return slide;
}

function buildHeaderFromRow(row, block) {
  const cells = row.querySelectorAll(':scope > div');

  const header = document.createElement('div');
  header.className = 'deals-carousel-header';

  const textDiv = document.createElement('div');
  textDiv.className = 'deals-carousel-header-text';

  // Move icon image if present
  const icon = cells[0].querySelector('picture, img');
  if (icon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'deals-carousel-icon';
    iconWrap.append(icon.closest('picture') || icon);
    textDiv.append(iconWrap);
  }

  // Move heading
  const heading = cells[0].querySelector('h2');
  if (heading) textDiv.append(heading);

  // Move subtitle/store info (any remaining <p> in first cell)
  const subtitles = cells[0].querySelectorAll('p');
  subtitles.forEach((p) => {
    p.className = 'deals-carousel-subtitle';
    textDiv.append(p);
  });

  header.append(textDiv);

  // Move "View all" link from second cell
  if (cells[1]) {
    const actionDiv = document.createElement('div');
    actionDiv.className = 'deals-carousel-header-action';
    const link = cells[1].querySelector('a');
    if (link) {
      actionDiv.append(link);
    }
    header.append(actionDiv);
  }

  // Prepend header to block (before slides container)
  block.prepend(header);
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `deals-carousel-${carouselId}`);

  // Extract the header row before processing slides
  const allRows = [...block.querySelectorAll(':scope > div')];
  let headerRow = null;
  const firstRow = allRows[0];
  if (firstRow) {
    const cells = firstRow.querySelectorAll(':scope > div');
    const hasHeading = cells[0] && cells[0].querySelector('h2');
    if (hasHeading) {
      headerRow = firstRow;
      firstRow.remove();
    }
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('deals-carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('deals-carousel-slides');

  if (!isSingleSlide) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('deals-carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.append(container);

  // Build header from the extracted header row
  if (headerRow) {
    buildHeaderFromRow(headerRow, block);
  }

  if (!isSingleSlide) {
    bindEvents(block);
  }

  // Decorate deal prices: bold text is the deal price, regular text is description
  block.querySelectorAll('.deals-carousel-slide-content').forEach((content) => {
    const strong = content.querySelector('p strong');
    if (strong) {
      strong.closest('p').classList.add('deals-carousel-deal-price');
    }
    // The description paragraph (not bold, not a link)
    const paras = content.querySelectorAll('p');
    paras.forEach((p) => {
      if (!p.querySelector('strong') && !p.querySelector('a') && !p.classList.contains('deals-carousel-deal-price')) {
        p.classList.add('deals-carousel-deal-desc');
      }
    });
  });
}
