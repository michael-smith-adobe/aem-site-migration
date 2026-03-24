/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-insight block
 *
 * Source: https://www.citigroup.com/global/businesses/markets
 * Base Block: cards
 *
 * Block Structure (from block library):
 * - Row 1: Block name header ("Cards-Insight")
 * - Row 2+: Image (col 1) | Text content (col 2) per card
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="GpaCardCarousel" id="GpaCardCarouselinsights">
 *   <header><h2>Insights</h2></header>
 *   <div class="slick-slider">
 *     <div class="slick-track">
 *       <div class="slick-slide">
 *         <article class="GpaCard___Ndh4B">
 *           <div class="gpa-card-border___VR8hj">
 *             <div class="Card___oAEy+">
 *               <div class="image-link___Xjznl">
 *                 <img class="image-wrapper___Oq4W+" src="..." alt="">
 *               </div>
 *               <section class="text-wrapper___R3Dbm">
 *                 <h3 class="title___Nzf7t">Title</h3>
 *                 <p class="summary___tIomw">Description</p>
 *                 <div class="button-links-container">
 *                   <a class="linkWrapper___LCVDI" href="...">Learn More</a>
 *                 </div>
 *               </section>
 *             </div>
 *           </div>
 *         </article>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Get all card articles - use slick-slide to avoid carousel duplicates
  // VALIDATED: Found <div class="slick-slide"> wrapping <article class="GpaCard___Ndh4B">
  // The carousel duplicates cards after the first set; only get unique ones
  const allSlides = Array.from(element.querySelectorAll('.slick-track > .slick-slide'));

  // Deduplicate by checking href of the CTA link
  const seenHrefs = new Set();
  const uniqueSlides = [];
  allSlides.forEach((slide) => {
    const link = slide.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : null;
    if (href && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      uniqueSlides.push(slide);
    } else if (!href && !seenHrefs.has(slide.textContent.trim())) {
      seenHrefs.add(slide.textContent.trim());
      uniqueSlides.push(slide);
    }
  });

  // Build cells array matching cards block structure (2-column: image | text)
  const cells = [];

  uniqueSlides.forEach((slide) => {
    // Extract image
    // VALIDATED: <img class="image-wrapper___Oq4W+"> inside <div class="image-link___Xjznl">
    const img = slide.querySelector('[class*="image-link"] img') ||
                slide.querySelector('[class*="image-wrapper"]') ||
                slide.querySelector('img');

    // Extract text content
    // VALIDATED: <h3 class="title___Nzf7t"> and <p class="summary___tIomw">
    const title = slide.querySelector('h3[class*="title"]') ||
                  slide.querySelector('h3');

    const summary = slide.querySelector('p[class*="summary"]') ||
                    slide.querySelector('p[class*="Summary"]') ||
                    slide.querySelector('section p');

    // VALIDATED: <a class="linkWrapper___LCVDI"> inside <div class="btnContainer___h3Xq3">
    const ctaLink = slide.querySelector('a[class*="linkWrapper"]') ||
                    slide.querySelector('[class*="btnContainer"] a') ||
                    slide.querySelector('[class*="button-links"] a');

    // Build image cell
    const imageCell = img ? img : '';

    // Build text content cell
    const textCell = document.createElement('div');
    if (title) {
      textCell.appendChild(title.cloneNode(true));
    }
    if (summary) {
      textCell.appendChild(summary.cloneNode(true));
    }
    if (ctaLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href || ctaLink.getAttribute('href');
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Insight', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
