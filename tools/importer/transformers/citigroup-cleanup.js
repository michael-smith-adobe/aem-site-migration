/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Citigroup website cleanup
 * Purpose: Remove non-content elements (navigation, footer, spacers, tracking)
 * Applies to: www.citigroup.com (all templates)
 * Generated: 2026-02-12
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of /global/businesses/markets
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation menu
    // EXTRACTED: Found <div id="GpaMenu00" class="lmn-col-lg-12 portlet">
    WebImporter.DOMUtils.remove(element, [
      '#GpaMenu00',
    ]);

    // Remove breadcrumb navigation
    // EXTRACTED: Found <div id="gpaNavigation" class="citigroup-container-center gpaNavigation___InlY7">
    WebImporter.DOMUtils.remove(element, [
      '#gpaNavigation',
    ]);

    // Remove spacer elements used for layout spacing
    // EXTRACTED: Found multiple <div class="Spacer"> elements throughout DOM
    WebImporter.DOMUtils.remove(element, [
      '.Spacer',
    ]);

    // Remove notification space
    // EXTRACTED: Found <div class="notificationSpace___qiwiQ notificationNavigationSpace___5Wrdc">
    WebImporter.DOMUtils.remove(element, [
      '[class*="notificationSpace"]',
    ]);

    // Remove popup and menu content overlays
    // EXTRACTED: Found <div id="popup" class="gpaMenuPopup___glIBi">
    // EXTRACTED: Found <div class="gpaMenuContent___nyWKA">
    WebImporter.DOMUtils.remove(element, [
      '#popup',
      '[class*="gpaMenuContent"]',
      '[class*="gpaMenuPopup"]',
    ]);

    // Remove LinkedIn insight tracking
    // EXTRACTED: Found <div class="lmn-col-lg-12 portlet" id="LinkedInInsightTracking10">
    WebImporter.DOMUtils.remove(element, [
      '#LinkedInInsightTracking10',
    ]);

    // Re-enable scrolling if locked by modals/overlays
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove footer
    // EXTRACTED: Found <div class="lmn-col-lg-12 portlet" id="GpaFooter10">
    WebImporter.DOMUtils.remove(element, [
      '#GpaFooter10',
      '[class*="gpaFooterContainer"]',
    ]);

    // Remove remaining unwanted HTML elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
    ]);

    // Clean up tracking and interaction attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });
  }
}
