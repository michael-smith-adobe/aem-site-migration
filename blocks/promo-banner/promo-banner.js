/**
 * Promo Banner Block
 *
 * Each row in the block represents one promotional banner.
 * Row structure (3 columns):
 *   Col 1: Background image (<picture>)
 *   Col 2: Lockup/overlay image with optional link
 *   Col 3: Carousel cards — multiple <p> elements each containing a linked image
 *
 * The block renders as a full-width banner with a background image,
 * a centered promotional lockup overlaid on top, and a horizontally
 * scrolling card carousel beneath the lockup.
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const columns = [...row.querySelectorAll(':scope > div')];
    if (columns.length < 2) return;

    const [bgCol, lockupCol, carouselCol] = columns;

    // Background image
    const bgPicture = bgCol.querySelector('picture');
    if (bgPicture) {
      const bgImg = bgPicture.querySelector('img');
      if (bgImg) {
        row.style.backgroundImage = `url('${bgImg.src}')`;
        row.style.backgroundSize = 'cover';
        row.style.backgroundPosition = 'center';
      }
      bgCol.remove();
    }

    // Lockup overlay
    if (lockupCol) {
      lockupCol.classList.add('promo-banner-lockup');
      const lockupLink = lockupCol.querySelector('a');
      const lockupPicture = lockupCol.querySelector('picture');
      if (lockupLink && lockupPicture) {
        // Wrap picture inside the link
        lockupLink.textContent = '';
        lockupLink.append(lockupPicture);
        lockupCol.textContent = '';
        lockupCol.append(lockupLink);
      }
    }

    // Carousel
    if (carouselCol) {
      carouselCol.classList.add('promo-banner-carousel');
      const cards = [...carouselCol.querySelectorAll('p')].filter(
        (p) => p.querySelector('a') || p.querySelector('picture'),
      );

      if (cards.length > 0) {
        const track = document.createElement('div');
        track.className = 'promo-banner-track';

        cards.forEach((card) => {
          const cardEl = document.createElement('div');
          cardEl.className = 'promo-banner-card';

          const link = card.querySelector('a');
          const picture = card.querySelector('picture');

          if (link && picture) {
            link.textContent = '';
            link.append(picture);
            cardEl.append(link);
            // Add label below card
            const img = picture.querySelector('img');
            if (img && img.alt) {
              const label = document.createElement('span');
              label.className = 'promo-banner-card-label';
              label.textContent = img.alt;
              cardEl.append(label);
            }
          } else if (link) {
            cardEl.append(link.cloneNode(true));
          } else if (picture) {
            cardEl.append(picture);
          }

          track.append(cardEl);
        });

        // Navigation arrows
        const nav = document.createElement('div');
        nav.className = 'promo-banner-nav';
        nav.innerHTML = `
          <button class="promo-banner-prev" aria-label="Previous">&lsaquo;</button>
          <button class="promo-banner-next" aria-label="Next">&rsaquo;</button>
        `;

        carouselCol.textContent = '';
        carouselCol.append(track, nav);

        // Scroll behavior
        const prevBtn = nav.querySelector('.promo-banner-prev');
        const nextBtn = nav.querySelector('.promo-banner-next');
        prevBtn.addEventListener('click', () => {
          track.scrollBy({ left: -280, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
          track.scrollBy({ left: 280, behavior: 'smooth' });
        });
      }
    }

    row.classList.add('promo-banner-row');
  });
}
