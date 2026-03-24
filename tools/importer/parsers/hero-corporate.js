/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-corporate block
 *
 * Source: https://www.citigroup.com/global/businesses/markets
 * Base Block: hero
 *
 * Block Structure (from block library):
 * - Row 1: Block name header ("Hero-Corporate")
 * - Row 2: Background image (optional)
 * - Row 3: Content (heading)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="GpaThirdLevelHero___74geS">
 *   <div class="bannerImage___lfsE0"><img src="..." alt=""></div>
 *   <h1 class="title___KERbd">Markets</h1>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: Found <img> inside <div class="bannerImage___lfsE0"> in captured DOM
  const bgImage = element.querySelector('[class*="bannerImage"] img') ||
                  element.querySelector('.GpaThirdLevelHero___74geS img') ||
                  element.querySelector('img');

  // Extract title heading
  // VALIDATED: Found <h1 class="title___KERbd">Markets</h1> in captured DOM
  const heading = element.querySelector('h1[class*="title"]') ||
                  element.querySelector('h1') ||
                  element.querySelector('h2');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell with heading
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }

  // Look for optional subheading or CTA
  const subheading = element.querySelector('h2, p[class*="subtitle"]');
  if (subheading) {
    contentCell.push(subheading);
  }

  const ctas = Array.from(element.querySelectorAll('a[class*="btn"], a[class*="cta"], a[class*="button"]'));
  contentCell.push(...ctas);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Corporate', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
