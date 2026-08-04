// Flashes the product page price when a variant change moves it:
// red when the price goes up, green when it goes down.
//
// Watches a stable container rather than the price element itself, because
// the theme swaps the price node out on variant change (morph). Observing
// the price element directly would leave the observer bound to a detached
// node after the first switch.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // [container that survives variant updates, price element inside it]
  var WATCH = [
    ['.product-details', 'product-price'],
    ['sticky-add-to-cart', '.sticky-add-to-cart__price'],
  ];

  var UP_CLASS = 'price-flash--up';
  var DOWN_CLASS = 'price-flash--down';

  function readPrice(el) {
    if (!el) return null;
    // Prefer the regular price node; .price__sale is display:none when
    // inactive, so its text would otherwise be picked up by textContent.
    var visible = el.querySelector('.price__regular .price') || el.querySelector('.price') || el;
    var digits = (visible.textContent || '').replace(/[^\d.,]/g, '').replace(/,/g, '');
    if (!digits) return null;
    var value = parseFloat(digits);
    return isNaN(value) ? null : value;
  }

  function flash(el, direction) {
    // Pin the element's own resolved colour so the keyframes can return to
    // exactly it. Using `inherit` in the keyframe would resolve to the
    // parent's colour instead and cause a visible jump on the first frame.
    el.style.setProperty('--price-flash-base', getComputedStyle(el).color);

    el.classList.remove(UP_CLASS, DOWN_CLASS);
    void el.offsetWidth; // restart the animation if one is already running
    el.classList.add(direction > 0 ? UP_CLASS : DOWN_CLASS);
  }

  function watch(container, priceSelector) {
    var last = readPrice(container.querySelector(priceSelector));
    var pending = null;

    container.addEventListener('animationend', function (event) {
      event.target.classList.remove(UP_CLASS, DOWN_CLASS);
    });

    new MutationObserver(function () {
      // A single variant update fires many mutations as the subtree is
      // rewritten - coalesce them so one change flashes once.
      clearTimeout(pending);
      pending = setTimeout(function () {
        var priceEl = container.querySelector(priceSelector);
        var current = readPrice(priceEl);
        if (current == null) return;
        if (last != null && current !== last) flash(priceEl, current - last);
        last = current;
      }, 60);
    }).observe(container, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    WATCH.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (container) {
        watch(container, pair[1]);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
