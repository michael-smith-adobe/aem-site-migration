/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-services block
 *
 * Source: https://www.citigroup.com/global/businesses/markets
 * Base Block: tabs
 *
 * Block Structure (from block library):
 * - Row 1: Block name header ("Tabs-Services")
 * - Row 2+: Tab label (col 1) | Tab content (col 2) per row
 *
 * Source HTML Pattern (from captured DOM):
 * <div id="GpaBusinessSolutions" class="GpaBusinessSolutions___Y0We9">
 *   <div class="solution-container___NcpyW">
 *     <h2 class="section-title___4ndbY">what we offer</h2>
 *     <div class="content-container___veXne">
 *       <div class="tab-list___VSAdB">
 *         <button class="tab-button___V3BgO"><span>Commodities</span></button>
 *         ...
 *       </div>
 *       <div class="tab-contents___J6lzS">
 *         <div class="tab-content___2JxDp">
 *           <h3 class="header___ojJKk">Commodities</h3>
 *           <div class="body___gVIkJ"><p>...</p></div>
 *           <!-- optional: <a class="link-button___wn145">Learn More</a> -->
 *         </div>
 *         ...
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract tab content panels
  // VALIDATED: Found <div class="tab-content___2JxDp"> elements in captured DOM
  const tabPanels = Array.from(
    element.querySelectorAll('[class*="tab-content___"]') ||
    element.querySelectorAll('[class*="tab-content"]')
  );

  // Extract tab button labels as fallback for tab names
  // VALIDATED: Found <button class="tab-button___V3BgO"><span>Label</span></button>
  const tabButtons = Array.from(
    element.querySelectorAll('[class*="tab-button"] span')
  );

  // Build cells array matching tabs block structure
  const cells = [];

  tabPanels.forEach((panel, index) => {
    // Get tab label from button text or panel heading
    // VALIDATED: <h3 class="header___ojJKk"> matches tab name in captured DOM
    const panelHeading = panel.querySelector('h3[class*="header"]') ||
                         panel.querySelector('h3');

    let tabLabel;
    if (tabButtons[index]) {
      tabLabel = tabButtons[index].textContent.trim();
    } else if (panelHeading) {
      tabLabel = panelHeading.textContent.trim();
    } else {
      tabLabel = `Tab ${index + 1}`;
    }

    // Build content cell from panel body
    // VALIDATED: <div class="body___gVIkJ"> contains <p> elements in captured DOM
    const contentContainer = document.createElement('div');

    const bodyDiv = panel.querySelector('[class*="body___"]');
    if (bodyDiv) {
      const paragraphs = Array.from(bodyDiv.querySelectorAll('p'));
      paragraphs.forEach((p) => {
        contentContainer.appendChild(p.cloneNode(true));
      });
    }

    // Check for optional CTA link
    // VALIDATED: Found <a class="link-button___wn145"> on Foreign Exchange tab
    const ctaLink = panel.querySelector('a[class*="link-button"]') ||
                    panel.querySelector('a[class*="btn"]');
    if (ctaLink) {
      const link = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href || ctaLink.getAttribute('href');
      a.textContent = ctaLink.textContent.trim();
      link.appendChild(a);
      contentContainer.appendChild(link);
    }

    // Row: [Tab Label, Tab Content]
    cells.push([tabLabel, contentContainer]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Services', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
