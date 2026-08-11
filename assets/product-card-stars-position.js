/**
 * The star row is rendered by blocks/_product-card-gallery.liquid, which can
 * only append to the card, not into the title and price group block that the
 * template JSON owns. CSS ordering cannot cross that boundary either, so the
 * node is moved into place here: directly after the title, above the price.
 */
(function () {
  function place(root) {
    (root || document).querySelectorAll('.product-card__stars:not(.is-positioned)').forEach(function (stars) {
      var card = stars.closest('.product-card');
      if (!card) return;
      var title = card.querySelector("a[ref='productTitleLink']");
      if (!title) return;
      var anchor = title.closest('.group-block') || title;
      anchor.insertAdjacentElement('afterend', stars);
      stars.classList.add('is-positioned');
    });
  }

  function start() {
    place(document);
    new MutationObserver(function () {
      place(document);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
