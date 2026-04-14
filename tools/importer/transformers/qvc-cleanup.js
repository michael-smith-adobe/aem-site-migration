/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: QVC site cleanup.
 * Removes non-authorable content (masthead, footer, hidden modules, dynamic modules).
 * Selectors from captured DOM of https://www.qvc.com (Wayback Machine archive).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove hidden/dynamic modules that are JS-populated (not authorable)
    // Found in captured HTML: sections with class "hideModule"
    element.querySelectorAll('section.hideModule').forEach((el) => el.remove());

    // Remove personalized/recommendation modules (not authorable)
    // Found: WELCOMEBACK, ONAIRMODULE, CRITEOCAROUSEL, CURRENTLYTRENDING,
    //        BASEDONYOURVIEWS, IBM_RECOS_PLAYBACK, MULTIRECSZONES, BUYAGAIN
    const dynamicSelectors = [
      '#WelcomeBack',
      '#onairmodule',
      '[data-module-feature-name="CRITEOCAROUSELBELOWITSMODULE"]',
      '[data-module-feature-name="CURRENTLYTRENDING"]',
      '[data-module-feature-name="BASEDONYOURVIEWS"]',
      '[data-module-feature-name="IBM_RECOS_PLAYBACK"]',
      '[data-module-feature-name="MULTIRECSZONES"]',
      '[data-module-feature-name="BUYAGAIN"]',
      '#HPlivestreamchannel',
    ];
    WebImporter.DOMUtils.remove(element, dynamicSelectors);
  }

  if (hookName === H.after) {
    // Remove masthead/header (non-authorable site chrome)
    // Found in captured HTML: <div id="pageMasthead">
    WebImporter.DOMUtils.remove(element, ['#pageMasthead']);

    // Remove footer (non-authorable, handled by EDS footer auto-blocking)
    // Found in captured HTML: <div id="pageFooter">
    WebImporter.DOMUtils.remove(element, ['#pageFooter']);

    // Remove safe non-content elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript', 'svg']);

    // Clean tracking attributes
    element.querySelectorAll('[data-cs-override-id]').forEach((el) => {
      el.removeAttribute('data-cs-override-id');
    });
    element.querySelectorAll('[onclick]').forEach((el) => {
      el.removeAttribute('onclick');
    });
  }
}
