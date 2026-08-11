// Flashes the product page price when a variant change moves it:
// red (repeated) when the price goes up, green (once) when it goes down.
//
// Observes document.body rather than the price's own container. A variant
// change can re-render the whole product-information section, which detaches
// any container captured at init time - an observer bound to it would then
// never fire again. Watching a root that always survives, and re-querying the
// price element on every batch, keeps this working across re-renders.
(function () {
  var TARGETS = [
    { selector: '.product-details product-price', last: null },
    { selector: 'sticky-add-to-cart .sticky-add-to-cart__price', last: null },
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

  function check() {
    TARGETS.forEach(function (target) {
      var el = document.querySelector(target.selector);
      var current = readPrice(el);
      if (current == null) return;
      if (target.last != null && current !== target.last) flash(el, current - target.last);
      target.last = current;
    });
  }

  function init() {
    // Diagnostic handles: whether this ever initialised, and a way to run the
    // comparison by hand from the console.
    window.__priceFlashReady = true;
    window.__priceFlashCheck = check;
    window.__priceFlashState = TARGETS;

    check(); // seed the baseline

    document.addEventListener('animationend', function (event) {
      if (event.target instanceof Element) event.target.classList.remove(UP_CLASS, DOWN_CLASS);
    });

    var pending = null;
    new MutationObserver(function () {
      // One variant update fires many mutations as the subtree is rewritten -
      // coalesce them so a single change flashes once. The wait also has to
      // outlast the re-render itself: flashing too early puts the class on a
      // price node the theme is about to replace, and the replacement drops
      // the class before the animation is ever painted.
      clearTimeout(pending);
      pending = setTimeout(check, 250);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
