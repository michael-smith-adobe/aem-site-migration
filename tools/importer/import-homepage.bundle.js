var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const link = element.querySelector(".largeStaticImage a[href], a[href]");
    const desktopImg = element.querySelector("img.visible-dt, img.cq-dd-largeDisplayImage");
    const mobileImg = element.querySelector("img.visible-mb, img.imageCrop");
    const heroImg = desktopImg || mobileImg || element.querySelector("img");
    const cells = [];
    if (heroImg) {
      const realSrc = heroImg.getAttribute("data-src") || heroImg.getAttribute("src") || "";
      if (realSrc && !realSrc.startsWith("data:")) {
        heroImg.setAttribute("src", realSrc);
      }
      cells.push([heroImg]);
    }
    const contentCell = [];
    if (heroImg && heroImg.alt) {
      const heading = document.createElement("h2");
      heading.textContent = heroImg.alt.trim();
      contentCell.push(heading);
    }
    if (link) {
      const cta = document.createElement("a");
      cta.href = link.href;
      cta.textContent = "Shop Now";
      contentCell.push(cta);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-deal.js
  function parse2(element, { document }) {
    const cells = [];
    const teasers = element.querySelectorAll(".cmp-teaser");
    if (teasers.length > 0) {
      teasers.forEach((teaser) => {
        const link = teaser.querySelector("a.cmp-teaser-link, a[href]");
        const img = teaser.querySelector(".cmp-teaser__image img, img");
        const titleEl = teaser.querySelector(".cmp-teaser__title, .cmp-teaser__pretitle");
        const descEl = teaser.querySelector(".cmp-teaser__description");
        if (img) {
          const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
          if (realSrc && !realSrc.startsWith("data:")) {
            img.setAttribute("src", realSrc);
          }
        }
        const imageCell = img ? [img] : [];
        const textCell = [];
        if (titleEl) {
          const heading = document.createElement("p");
          heading.innerHTML = `<strong>${titleEl.textContent.trim()}</strong>`;
          textCell.push(heading);
        }
        if (descEl) {
          const desc = document.createElement("p");
          desc.textContent = descEl.textContent.trim();
          textCell.push(desc);
        }
        if (link && link.href) {
          const cta = document.createElement("a");
          cta.href = link.href;
          cta.textContent = titleEl ? titleEl.textContent.trim() : "Shop Now";
          textCell.push(cta);
        }
        if (imageCell.length > 0 || textCell.length > 0) {
          cells.push([imageCell, textCell]);
        }
      });
    }
    if (teasers.length === 0) {
      const categoryItems = element.querySelectorAll(".galleryItem");
      categoryItems.forEach((item) => {
        const link = item.querySelector("a[href]");
        const img = item.querySelector("img");
        const label = item.querySelector(".productDesc, .catText, .categoryText, p");
        if (img) {
          const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
          if (realSrc && !realSrc.startsWith("data:")) {
            img.setAttribute("src", realSrc);
          }
        }
        if (!img && !label) return;
        const imageCell = img ? [img] : [];
        const textCell = [];
        if (label && label.textContent.trim()) {
          const heading = document.createElement("p");
          heading.innerHTML = `<strong>${label.textContent.trim()}</strong>`;
          textCell.push(heading);
        }
        if (link && link.href) {
          const cta = document.createElement("a");
          cta.href = link.href;
          cta.textContent = label && label.textContent.trim() ? label.textContent.trim() : "Shop";
          textCell.push(cta);
        }
        if (imageCell.length > 0 && textCell.length > 0) {
          cells.push([imageCell, textCell]);
        }
      });
    }
    if (cells.length === 0) {
      const productItems = element.querySelectorAll(".carouselItem, .productItem");
      productItems.forEach((item) => {
        const img = item.querySelector("img");
        const nameEl = item.querySelector('.productDesc, .productName, a[class*="product"]');
        const priceEl = item.querySelector('.productPrice, [class*="price"]');
        const link = item.querySelector("a[href]");
        if (img) {
          const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
          if (realSrc && !realSrc.startsWith("data:")) {
            img.setAttribute("src", realSrc);
          }
        }
        const imageCell = img ? [img] : [];
        const textCell = [];
        if (nameEl) {
          const heading = document.createElement("p");
          heading.innerHTML = `<strong>${nameEl.textContent.trim()}</strong>`;
          textCell.push(heading);
        }
        if (priceEl) {
          const price = document.createElement("p");
          price.textContent = priceEl.textContent.trim();
          textCell.push(price);
        }
        if (link && link.href) {
          const cta = document.createElement("a");
          cta.href = link.href;
          cta.textContent = "Shop Now";
          textCell.push(cta);
        }
        if (imageCell.length > 0 || textCell.length > 0) {
          cells.push([imageCell, textCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-deal", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".carouselItem");
    items.forEach((item) => {
      const img = item.querySelector("img");
      const nameEl = item.querySelector('.productDesc a, .productName, [class*="productDesc"]');
      const priceEl = item.querySelector('.productPrice, [class*="price"]');
      const link = item.querySelector("a[href]");
      if (img) {
        const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
        if (realSrc && !realSrc.startsWith("data:")) {
          img.setAttribute("src", realSrc);
        }
      }
      const imageCell = img ? [img] : [];
      const textCell = [];
      if (nameEl) {
        const heading = document.createElement("p");
        heading.innerHTML = `<strong>${nameEl.textContent.trim()}</strong>`;
        textCell.push(heading);
      }
      if (priceEl) {
        const price = document.createElement("p");
        price.textContent = priceEl.textContent.trim();
        textCell.push(price);
      }
      if (link && link.href) {
        const cta = document.createElement("a");
        cta.href = link.href;
        cta.textContent = nameEl ? nameEl.textContent.trim() : "View Product";
        textCell.push(cta);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const cells = [];
    const flexContent = element.querySelector(".flexContent");
    if (flexContent) {
      const imageCol = flexContent.querySelector(".image, .col-xs-9, .col-xs-6:first-child");
      const textCol = flexContent.querySelector(".text, .col-xs-3, .col-xs-6:last-child");
      const leftCell = [];
      const rightCell = [];
      if (imageCol) {
        const img = imageCol.querySelector("img");
        if (img) {
          const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
          if (realSrc && !realSrc.startsWith("data:")) {
            img.setAttribute("src", realSrc);
          }
          leftCell.push(img);
        }
        const imgLink = imageCol.querySelector("a[href]");
        if (imgLink && imgLink.href) {
          const link = document.createElement("a");
          link.href = imgLink.href;
          link.textContent = "Shop Now";
          leftCell.push(link);
        }
      }
      if (textCol) {
        const headings = textCol.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((h) => rightCell.push(h));
        const paragraphs = textCol.querySelectorAll('[data-component-type="RICH_TEXT"] p, .qComponent > p');
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) rightCell.push(p);
        });
        const buttons = textCol.querySelectorAll('a.btn, a[role="button"], [data-component-type="BUTTON"] a');
        buttons.forEach((btn) => {
          const link = document.createElement("a");
          link.href = btn.href;
          link.textContent = btn.textContent.trim();
          rightCell.push(link);
        });
      }
      if (leftCell.length > 0 || rightCell.length > 0) {
        cells.push([leftCell, rightCell]);
      }
    }
    if (!flexContent) {
      const flexDouble = element.querySelector(".flexDoubleImage, .flexMod");
      if (flexDouble) {
        const imageItems = element.querySelectorAll('[data-component-type="IMAGE_ITEM"], .flexImageItem');
        if (imageItems.length >= 2) {
          const leftCell = [];
          const rightCell = [];
          imageItems.forEach((item, idx) => {
            const img = item.querySelector("img");
            const link = item.querySelector("a[href]");
            const targetCell = idx === 0 ? leftCell : rightCell;
            if (img) {
              const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
              if (realSrc && !realSrc.startsWith("data:")) {
                img.setAttribute("src", realSrc);
              }
              targetCell.push(img);
            }
            if (link && link.href) {
              const a = document.createElement("a");
              a.href = link.href;
              a.textContent = img && img.alt ? img.alt.trim() : "Learn More";
              targetCell.push(a);
            }
          });
          cells.push([leftCell, rightCell]);
        } else {
          const allImgs = element.querySelectorAll("img");
          const allLinks = element.querySelectorAll("a[href]");
          const leftCell = [];
          const rightCell = [];
          allImgs.forEach((img, idx) => {
            const realSrc = img.getAttribute("data-src") || img.getAttribute("src") || "";
            if (realSrc && !realSrc.startsWith("data:")) {
              img.setAttribute("src", realSrc);
            }
            if (idx === 0) leftCell.push(img);
            else rightCell.push(img);
          });
          if (leftCell.length > 0 || rightCell.length > 0) {
            cells.push([leftCell, rightCell]);
          }
        }
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/qvc-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      element.querySelectorAll("section.hideModule").forEach((el) => el.remove());
      const dynamicSelectors = [
        "#WelcomeBack",
        "#onairmodule",
        '[data-module-feature-name="CRITEOCAROUSELBELOWITSMODULE"]',
        '[data-module-feature-name="CURRENTLYTRENDING"]',
        '[data-module-feature-name="BASEDONYOURVIEWS"]',
        '[data-module-feature-name="IBM_RECOS_PLAYBACK"]',
        '[data-module-feature-name="MULTIRECSZONES"]',
        '[data-module-feature-name="BUYAGAIN"]',
        "#HPlivestreamchannel"
      ];
      WebImporter.DOMUtils.remove(element, dynamicSelectors);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["#pageMasthead"]);
      WebImporter.DOMUtils.remove(element, ["#pageFooter"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript", "svg"]);
      element.querySelectorAll("[data-cs-override-id]").forEach((el) => {
        el.removeAttribute("data-cs-override-id");
      });
      element.querySelectorAll("[onclick]").forEach((el) => {
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/qvc-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-promo": parse,
    "cards-deal": parse2,
    "carousel-product": parse3,
    "columns-feature": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "QVC homepage - main landing page with featured products, promotions, and navigation",
    urls: [
      "https://www.qvc.com"
    ],
    blocks: [
      {
        name: "hero-promo",
        instances: [
          "section[data-module-type='LARGE_STATIC_IMAGE']"
        ]
      },
      {
        name: "cards-deal",
        instances: [
          "#pageContent > section.qModule[data-module-type='CORE_MODULE_CONTAINER']:not(.hideModule):not(.iroaModule)",
          "section[data-module-feature-name='SAVINGSSHOWCASE']",
          "section[data-module-feature-name='INTHESPOTLIGHT']",
          "section[data-module-type='SHOP_BY_CATEGORY']",
          "section[data-module-feature-name='WATCHSHOPFROMANYWHERE']"
        ]
      },
      {
        name: "carousel-product",
        instances: [
          "section[data-module-type='PRODUCT_CAROUSEL']:not(.hideModule)"
        ]
      },
      {
        name: "columns-feature",
        instances: [
          "section[data-module-feature-name='TSV']",
          "section[data-module-type='FLEX_IMAGE_TEXT']:not([data-module-feature-name='TSV'])",
          "section[data-module-type='FLEX_IMAGE_IMAGE']"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: "section[data-module-feature-name='TOP_NEW_YEARS_SALE']",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-2-top-deals",
        name: "Top Deals Grid",
        selector: "section[data-module-feature-name='TOP_DEALS']",
        style: null,
        blocks: ["cards-deal"],
        defaultContent: []
      },
      {
        id: "section-3-tsv",
        name: "Today's Special Value",
        selector: "section[data-module-feature-name='TSV']",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-4-product-carousel",
        name: "Product Carousel - Best Night's Sleep",
        selector: "section[data-module-feature-name='SEC_BEST_NIGHTS_SLEEP']",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-5-year-review",
        name: "Year in Review Promo",
        selector: "section[data-module-feature-name='SEC_YEAR_IN_REVIEW']",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-6-deals-carousel",
        name: "Product Carousel - Deals",
        selector: "section[data-module-feature-name='DEALS']",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-7-savings-showcase",
        name: "Savings Showcase",
        selector: "section[data-module-feature-name='SAVINGSSHOWCASE']",
        style: null,
        blocks: ["cards-deal"],
        defaultContent: ["section[data-module-feature-name='SAVINGSSHOWCASE'] .cmp-title__text"]
      },
      {
        id: "section-8-spotlight",
        name: "In the Spotlight",
        selector: "section[data-module-feature-name='INTHESPOTLIGHT']",
        style: null,
        blocks: ["cards-deal"],
        defaultContent: ["section[data-module-feature-name='INTHESPOTLIGHT'] .cmp-title__text"]
      },
      {
        id: "section-9-prime-time",
        name: "Prime Time Specials",
        selector: "section[data-module-feature-name='PRIMETIMESPECIALS']",
        style: null,
        blocks: ["cards-deal"],
        defaultContent: []
      },
      {
        id: "section-10-shop-category",
        name: "Shop by Category",
        selector: "section[data-module-feature-name='SHOPBYCATEGORY']",
        style: null,
        blocks: ["cards-deal"],
        defaultContent: ["section[data-module-feature-name='SHOPBYCATEGORY'] h2"]
      },
      {
        id: "section-11-qvc-plus",
        name: "QVC+ Streaming Promo",
        selector: "section[data-module-feature-name='QVCPLUS']",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-12-watch-shop",
        name: "Watch & Shop From Anywhere",
        selector: "section[data-module-feature-name='WATCHSHOPFROMANYWHERE']",
        style: null,
        blocks: ["cards-deal"],
        defaultContent: []
      },
      {
        id: "section-13-easy-pay",
        name: "Easy Pay & Returns",
        selector: "section[data-module-feature-name='EASYPAYANDRETURNS']",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-14-footer",
        name: "Footer",
        selector: [
          "section[data-module-type='FOOTER_CHECKOUT_MODULE']",
          "section[data-module-type='FOOTER_TOP_MODULE']",
          "section[data-module-type='FOOTER_MID_MODULE']",
          "section[data-module-type='FOOTER_BTM_MODULE']"
        ],
        style: "light-grey",
        blocks: [],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
