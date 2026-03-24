/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news block
 *
 * Source: https://www.citigroup.com/global/businesses/markets
 * Base Block: cards (no images variant)
 *
 * Block Structure (from block library - cards no images):
 * - Row 1: Block name header ("Cards-News")
 * - Row 2+: Text content (single column) per card
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="GpaArticlesCarousel___zegZI">
 *   <h2 class="sectionTitle___27IJ4">NEWS</h2>
 *   <div class="cardCarousel___N+f1f">
 *     <div class="carouselBody" id="carouselBodyGpaArticlesNEWS">
 *       <div class="articleItem articleItem___Sz3iU">
 *         <div class="articleCard___aORGG noImage___AhErT">
 *           <a href="/global/news/..." class="not-default-link">
 *             <div class="carousel___U8vOP">
 *               <div class="textContainer___UpRuU">
 *                 <div class="category___wdHgd">PRESS RELEASE</div>
 *                 <h3 class="title___8xkF9">Title</h3>
 *                 <div class="publishDate___f6Sfs">Date</div>
 *               </div>
 *             </div>
 *           </a>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Note: The carousel duplicates items (8 unique + 8 duplicates).
 * Deduplication is handled by tracking seen hrefs.
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Get all article items from the carousel
  // VALIDATED: Found <div class="articleItem articleItem___Sz3iU"> in captured DOM
  const articleItems = Array.from(
    element.querySelectorAll('[class*="articleItem___"]')
  );

  // Deduplicate carousel items by href
  const seenHrefs = new Set();
  const uniqueItems = [];
  articleItems.forEach((item) => {
    const link = item.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : null;
    if (href && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      uniqueItems.push(item);
    }
  });

  // Build cells array matching cards (no images) block structure (1-column)
  const cells = [];

  uniqueItems.forEach((item) => {
    // Extract content elements
    // VALIDATED: <div class="category___wdHgd">PRESS RELEASE</div>
    const category = item.querySelector('[class*="category___"]');

    // VALIDATED: <h3 class="title___8xkF9">Article Title</h3>
    const title = item.querySelector('h3[class*="title___"]') ||
                  item.querySelector('h3');

    // VALIDATED: <div class="publishDate___f6Sfs">Date</div>
    const date = item.querySelector('[class*="publishDate___"]');

    // VALIDATED: <a href="/global/news/..." class="not-default-link">
    const link = item.querySelector('a[href]');

    // Build single text cell for this card
    const textCell = document.createElement('div');

    if (category) {
      const catP = document.createElement('p');
      catP.textContent = category.textContent.trim();
      textCell.appendChild(catP);
    }

    if (title) {
      const h = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = title.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = title.textContent.trim();
      }
      textCell.appendChild(h);
    }

    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      textCell.appendChild(dateP);
    }

    cells.push([textCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-News', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
