/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import cardsDealParser from './parsers/cards-deal.js';
import carouselProductParser from './parsers/carousel-product.js';
import columnsFeatureParser from './parsers/columns-feature.js';

// TRANSFORMER IMPORTS
import qvcCleanupTransformer from './transformers/qvc-cleanup.js';
import qvcSectionsTransformer from './transformers/qvc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'cards-deal': cardsDealParser,
  'carousel-product': carouselProductParser,
  'columns-feature': columnsFeatureParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'QVC homepage - main landing page with featured products, promotions, and navigation',
  urls: [
    'https://www.qvc.com',
  ],
  blocks: [
    {
      name: 'hero-promo',
      instances: [
        "section[data-module-type='LARGE_STATIC_IMAGE']",
      ],
    },
    {
      name: 'cards-deal',
      instances: [
        "#pageContent > section.qModule[data-module-type='CORE_MODULE_CONTAINER']:not(.hideModule):not(.iroaModule)",
        "section[data-module-feature-name='SAVINGSSHOWCASE']",
        "section[data-module-feature-name='INTHESPOTLIGHT']",
        "section[data-module-type='SHOP_BY_CATEGORY']",
        "section[data-module-feature-name='WATCHSHOPFROMANYWHERE']",
      ],
    },
    {
      name: 'carousel-product',
      instances: [
        "section[data-module-type='PRODUCT_CAROUSEL']:not(.hideModule)",
      ],
    },
    {
      name: 'columns-feature',
      instances: [
        "section[data-module-feature-name='TSV']",
        "section[data-module-type='FLEX_IMAGE_TEXT']:not([data-module-feature-name='TSV'])",
        "section[data-module-type='FLEX_IMAGE_IMAGE']",
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: "section[data-module-feature-name='TOP_NEW_YEARS_SALE']",
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2-top-deals',
      name: 'Top Deals Grid',
      selector: "section[data-module-feature-name='TOP_DEALS']",
      style: null,
      blocks: ['cards-deal'],
      defaultContent: [],
    },
    {
      id: 'section-3-tsv',
      name: "Today's Special Value",
      selector: "section[data-module-feature-name='TSV']",
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-4-product-carousel',
      name: "Product Carousel - Best Night's Sleep",
      selector: "section[data-module-feature-name='SEC_BEST_NIGHTS_SLEEP']",
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-5-year-review',
      name: 'Year in Review Promo',
      selector: "section[data-module-feature-name='SEC_YEAR_IN_REVIEW']",
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-6-deals-carousel',
      name: 'Product Carousel - Deals',
      selector: "section[data-module-feature-name='DEALS']",
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-7-savings-showcase',
      name: 'Savings Showcase',
      selector: "section[data-module-feature-name='SAVINGSSHOWCASE']",
      style: null,
      blocks: ['cards-deal'],
      defaultContent: ["section[data-module-feature-name='SAVINGSSHOWCASE'] .cmp-title__text"],
    },
    {
      id: 'section-8-spotlight',
      name: 'In the Spotlight',
      selector: "section[data-module-feature-name='INTHESPOTLIGHT']",
      style: null,
      blocks: ['cards-deal'],
      defaultContent: ["section[data-module-feature-name='INTHESPOTLIGHT'] .cmp-title__text"],
    },
    {
      id: 'section-9-prime-time',
      name: 'Prime Time Specials',
      selector: "section[data-module-feature-name='PRIMETIMESPECIALS']",
      style: null,
      blocks: ['cards-deal'],
      defaultContent: [],
    },
    {
      id: 'section-10-shop-category',
      name: 'Shop by Category',
      selector: "section[data-module-feature-name='SHOPBYCATEGORY']",
      style: null,
      blocks: ['cards-deal'],
      defaultContent: ["section[data-module-feature-name='SHOPBYCATEGORY'] h2"],
    },
    {
      id: 'section-11-qvc-plus',
      name: 'QVC+ Streaming Promo',
      selector: "section[data-module-feature-name='QVCPLUS']",
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-12-watch-shop',
      name: 'Watch & Shop From Anywhere',
      selector: "section[data-module-feature-name='WATCHSHOPFROMANYWHERE']",
      style: null,
      blocks: ['cards-deal'],
      defaultContent: [],
    },
    {
      id: 'section-13-easy-pay',
      name: 'Easy Pay & Returns',
      selector: "section[data-module-feature-name='EASYPAYANDRETURNS']",
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-14-footer',
      name: 'Footer',
      selector: [
        "section[data-module-type='FOOTER_CHECKOUT_MODULE']",
        "section[data-module-type='FOOTER_TOP_MODULE']",
        "section[data-module-type='FOOTER_MID_MODULE']",
        "section[data-module-type='FOOTER_BTM_MODULE']",
      ],
      style: 'light-grey',
      blocks: [],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  qvcCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [qvcSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
