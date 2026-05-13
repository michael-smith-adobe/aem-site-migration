function createSlide(row, slideIndex) {
  const slide = document.createElement('li');
  slide.classList.add('coupons-carousel-slide');
  slide.dataset.slideIndex = slideIndex;

  const columns = [...row.children];
  const imageCol = columns[0];
  const bodyCol = columns[1];

  if (!bodyCol) return slide;

  // Extract image from first column
  const picture = imageCol?.querySelector('picture');

  // Classify body paragraphs
  const paragraphs = [...bodyCol.querySelectorAll('p')];
  const discountP = paragraphs[0];
  const expiryP = paragraphs[1];
  const descP = paragraphs[2];
  const actionP = paragraphs[paragraphs.length - 1];

  // Build card structure
  // 1. Discount + Expiry header area
  const headerArea = document.createElement('div');
  headerArea.classList.add('coupons-carousel-card-header');
  if (discountP) {
    discountP.classList.add('coupons-carousel-discount');
    headerArea.append(discountP);
  }
  if (expiryP) {
    expiryP.classList.add('coupons-carousel-expiry');
    headerArea.append(expiryP);
  }

  // 2. Product info area — image + description side by side
  const productArea = document.createElement('div');
  productArea.classList.add('coupons-carousel-product');
  if (picture) {
    const imgWrap = document.createElement('div');
    imgWrap.classList.add('coupons-carousel-product-image');
    imgWrap.append(picture);
    productArea.append(imgWrap);
  }
  if (descP) {
    descP.classList.add('coupons-carousel-description');
    productArea.append(descP);
  }

  // 3. Action area — clip button
  const actionArea = document.createElement('div');
  actionArea.classList.add('coupons-carousel-action');
  if (actionP && actionP !== descP) {
    const link = actionP.querySelector('a');
    if (link) {
      link.classList.add('coupons-carousel-clip-btn');
    }
    actionArea.append(actionP);
  }

  slide.append(headerArea, productArea, actionArea);
  return slide;
}

function scrollToSlide(slidesWrapper, direction) {
  const slideWidth = slidesWrapper.querySelector('.coupons-carousel-slide')?.offsetWidth || 280;
  const gap = 16;
  const scrollAmount = (slideWidth + gap) * 2;
  slidesWrapper.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  });
}

function updateArrows(slidesWrapper, prevBtn, nextBtn) {
  const { scrollLeft, scrollWidth, clientWidth } = slidesWrapper;
  prevBtn.disabled = scrollLeft <= 0;
  nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Build header
  const header = document.createElement('div');
  header.classList.add('coupons-carousel-header');
  header.innerHTML = `
    <h2 class="coupons-carousel-title">Trending Coupons</h2>
    <a href="/coupons" class="coupons-carousel-view-all">View All Coupons</a>
  `;

  // Build slides container
  const container = document.createElement('div');
  container.classList.add('coupons-carousel-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('coupons-carousel-slides');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx);
    slidesWrapper.append(slide);
  });

  // Navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('coupons-carousel-arrow', 'coupons-carousel-arrow-prev');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-label', 'Previous coupons');
  prevBtn.disabled = true;

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('coupons-carousel-arrow', 'coupons-carousel-arrow-next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-label', 'Next coupons');

  prevBtn.addEventListener('click', () => scrollToSlide(slidesWrapper, 'prev'));
  nextBtn.addEventListener('click', () => scrollToSlide(slidesWrapper, 'next'));
  slidesWrapper.addEventListener('scroll', () => updateArrows(slidesWrapper, prevBtn, nextBtn));

  container.append(prevBtn, slidesWrapper, nextBtn);

  block.textContent = '';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Coupon carousel');
  block.append(header, container);

  // Initial arrow state
  requestAnimationFrame(() => updateArrows(slidesWrapper, prevBtn, nextBtn));
}
