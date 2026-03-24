/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-awards block
 *
 * Source: https://www.citigroup.com/global/businesses/markets
 * Base Block: columns
 *
 * Block Structure (from block library):
 * - Row 1: Block name header ("Columns-Awards")
 * - Row 2+: Multiple columns per row (3 columns in this case)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="GpaAwards___T0QVt">
 *   <h2 class="Title___uGi+y">AWARDS</h2>
 *   <div class="awards___1tepn">
 *     <div class="awardsList___KNUy4">
 *       <div class="awardItem___XQcti">
 *         <h3 class="title___3d2Z8">GlobalCapital</h3>
 *         <ul>
 *           <li><span class="item___zxUke">Award name</span></li>
 *         </ul>
 *       </div>
 *       ... (6 items total, displayed as 3x2 grid)
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-12
 */
export default function parse(element, { document }) {
  // Extract all award items
  // VALIDATED: Found <div class="awardItem___XQcti"> elements in captured DOM
  const awardItems = Array.from(
    element.querySelectorAll('[class*="awardItem"]')
  );

  // Group items into rows of 3 (matching the original 3-column grid)
  const columnsPerRow = 3;
  const cells = [];

  for (let i = 0; i < awardItems.length; i += columnsPerRow) {
    const rowItems = awardItems.slice(i, i + columnsPerRow);
    const row = [];

    rowItems.forEach((item) => {
      // Build cell content for each award item
      const cellContent = document.createElement('div');

      // Extract award organization title
      // VALIDATED: <h3 class="title___3d2Z8">GlobalCapital</h3>
      const title = item.querySelector('h3[class*="title"]') ||
                    item.querySelector('h3');
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent.trim();
        cellContent.appendChild(h);
      }

      // Extract award list items
      // VALIDATED: <ul><li><span class="item___zxUke">Award name</span></li></ul>
      const listItems = Array.from(item.querySelectorAll('li'));
      if (listItems.length > 0) {
        const ul = document.createElement('ul');
        listItems.forEach((li) => {
          const newLi = document.createElement('li');
          newLi.textContent = li.textContent.trim();
          ul.appendChild(newLi);
        });
        cellContent.appendChild(ul);
      }

      row.push(cellContent);
    });

    // Pad row if fewer than 3 items (last row edge case)
    while (row.length < columnsPerRow) {
      row.push('');
    }

    cells.push(row);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Awards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
