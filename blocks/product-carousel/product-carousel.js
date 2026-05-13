function updateActiveSlide(slide) {
  const block = slide.closest('.product-carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const indicators = block.querySelectorAll('.product-carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    const btn = indicator.querySelector('button');
    if (idx !== slideIndex) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.product-carousel-slide');
  let realIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realIndex = 0;
  const activeSlide = slides[realIndex];

  block.querySelector('.product-carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.product-carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const indicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(indicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.product-carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', 'product-carousel-' + carouselId + '-slide-' + slideIndex);
  slide.classList.add('product-carousel-slide');

  const columns = [...row.querySelectorAll(':scope > div')];

  // First column: image
  if (columns[0]) {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('product-carousel-slide-image');
    imageDiv.append(...columns[0].childNodes);
    slide.append(imageDiv);
  }

  // Second column: content (name, price, badge, button)
  if (columns[1]) {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('product-carousel-slide-content');
    contentDiv.append(...columns[1].childNodes);
    slide.append(contentDiv);
  }

  return slide;
}

function decorateContent(block) {
  block.querySelectorAll('.product-carousel-slide-content').forEach((content) => {
    const children = [...content.children];

    children.forEach((child) => {
      const text = child.textContent.trim();

      // Badge line: text in brackets like [FREE Same-Day Delivery]
      if (text.startsWith('[') && text.endsWith(']')) {
        const badgeWrap = document.createElement('div');
        badgeWrap.className = 'product-carousel-badge';
        badgeWrap.textContent = text.slice(1, -1);
        child.replaceWith(badgeWrap);
        return;
      }

      // Savings discount line: "$150 (27%) Off"
      if (/\$[\d,.]+\s*\([\d]+%\)\s*off/i.test(text) && !child.querySelector('a')) {
        child.classList.add('product-carousel-savings');
        child.classList.add('product-carousel-savings-discount');
        return;
      }

      // Savings badge label: "Instant Savings"
      if (/\binstant\s+savings\b/i.test(text) && !child.querySelector('a')) {
        child.classList.add('product-carousel-savings');
        child.classList.add('product-carousel-savings-label');
        return;
      }

      // General savings line
      if (/\boff\b|\bsave\b|\bsavings\b/i.test(text) && !child.querySelector('a')) {
        child.classList.add('product-carousel-savings');
        return;
      }

      // Price line: starts with $ and contains pipe separator for sale|was
      if (/^\$/.test(text) && !child.querySelector('a')) {
        child.classList.add('product-carousel-price-line');

        var priceMatch = text.match(/\$([\d,.]+)\s*\|\s*\$([\d,.]+)/);
        if (priceMatch) {
          var currentP = document.createElement('span');
          currentP.className = 'product-carousel-price-current';
          currentP.textContent = '\x24' + priceMatch[1];

          var wasP = document.createElement('span');
          wasP.className = 'product-carousel-price-was';
          wasP.textContent = '\x24' + priceMatch[2];

          child.textContent = '';
          child.append(currentP, ' ', wasP);
        } else {
          child.classList.add('product-carousel-price-current');
        }
        return;
      }

      // Button / CTA
      var link = child.querySelector('a');
      if (link && (child.querySelector('strong') || child.querySelector('em')
        || child.classList.contains('button-container') || child.classList.contains('button-wrapper'))) {
        child.classList.add('product-carousel-cta');
        link.classList.add('product-carousel-button');
        link.classList.remove('button', 'primary', 'secondary', 'accent');
        return;
      }

      // Product name: remaining text paragraphs
      if (!child.classList.contains('product-carousel-price-line')
        && !child.classList.contains('product-carousel-savings')
        && !child.classList.contains('product-carousel-cta')
        && !child.classList.contains('product-carousel-badge')
        && text.length > 0 && !child.querySelector('picture')) {
        child.classList.add('product-carousel-name');
      }
    });
  });
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', 'product-carousel-' + carouselId);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Product Carousel');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  // Check if first row is a header row (no image, just text)
  let headerRow = null;
  const firstRowHasImage = rows[0].querySelector('picture, img');
  if (!firstRowHasImage && rows.length > 1) {
    headerRow = rows.shift();
  }

  // Build header
  if (headerRow) {
    const header = document.createElement('div');
    header.className = 'product-carousel-header';

    const textDiv = document.createElement('div');
    textDiv.className = 'product-carousel-header-text';

    const actionDiv = document.createElement('div');
    actionDiv.className = 'product-carousel-header-action';

    [...headerRow.querySelectorAll(':scope > div')].forEach((col) => {
      [...col.children].forEach((child) => {
        var colLink = child.querySelector('a');
        if (colLink && (child.querySelector('strong') || child.querySelector('em')
          || child.classList.contains('button-container') || child.classList.contains('button-wrapper'))) {
          colLink.classList.remove('button', 'primary', 'secondary', 'accent');
          actionDiv.append(colLink);
        } else {
          textDiv.append(child);
        }
      });
    });

    header.append(textDiv);
    if (actionDiv.children.length > 0) header.append(actionDiv);
    block.prepend(header);
    headerRow.remove();
  }

  // Build slides container
  const container = document.createElement('div');
  container.classList.add('product-carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('product-carousel-slides');

  const isSingleSlide = rows.length < 2;

  let slideIndicators;
  if (!isSingleSlide) {
    const navButtons = document.createElement('div');
    navButtons.classList.add('product-carousel-navigation-buttons');
    navButtons.innerHTML = '<button type="button" class="slide-prev" aria-label="Previous Slide"></button>'
      + '<button type="button" class="slide-next" aria-label="Next Slide"></button>';
    container.append(navButtons);

    const indicatorsNav = document.createElement('nav');
    indicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('product-carousel-slide-indicators');
    indicatorsNav.append(slideIndicators);
    block.append(indicatorsNav);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('product-carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = '<button type="button" aria-label="Show Slide ' + (idx + 1) + ' of ' + rows.length + '"></button>';
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);

  // Insert after header if it exists
  const headerEl = block.querySelector('.product-carousel-header');
  if (headerEl) {
    headerEl.after(container);
  } else {
    block.prepend(container);
  }

  decorateContent(block);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
