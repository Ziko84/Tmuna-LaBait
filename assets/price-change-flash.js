// Flashes the product page price when a variant change moves it:
// red (repeated) when the price goes up, green (once) when it goes down.
//
// Two things make this harder than it looks:
//
// 1. A variant change re-renders the section via fetch + morph, so any node
//    captured up front is detached afterwards. Everything here re-queries.
// 2. While that update is in flight the theme puts a `shimmer` attribute on
//    text blocks, which sets `color: transparent` and paints the text through
//    a ::after overlay. Animating colour during that window is invisible, so
//    the flash waits until the shimmer has cleared before it runs.
(function () {
  var TARGETS = [
    { selector: '.product-details product-price', last: null },
    { selector: 'sticky-add-to-cart .sticky-add-to-cart__price', last: null },
  ];

  var UP_CLASS = 'price-flash--up';
  var DOWN_CLASS = 'price-flash--down';
  var SHIMMER_TIMEOUT = 3000;

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

  function isShimmering(el) {
    return Boolean(el.closest('[shimmer]') || el.querySelector('[shimmer]'));
  }

  function paint(selector, direction) {
    var el = document.querySelector(selector);
    if (!el) return;

    // Pin the element's own resolved colour so the keyframes can return to
    // exactly it. `inherit` in the keyframe would resolve to the parent's
    // colour instead and jump on the first frame.
    el.style.setProperty('--price-flash-base', getComputedStyle(el).color);
    el.classList.remove(UP_CLASS, DOWN_CLASS);
    void el.offsetWidth; // restart if an animation is already running
    el.classList.add(direction > 0 ? UP_CLASS : DOWN_CLASS);
  }

  /** Runs the flash once the shimmer overlay has cleared, so it is visible. */
  function flashWhenReady(selector, direction) {
    var startedAt = Date.now();

    (function attempt() {
      var el = document.querySelector(selector);
      if (!el) return;

      if (isShimmering(el) && Date.now() - startedAt < SHIMMER_TIMEOUT) {
        setTimeout(attempt, 50);
        return;
      }

      paint(selector, direction);
    })();
  }

  function check() {
    TARGETS.forEach(function (target) {
      var el = document.querySelector(target.selector);
      var current = readPrice(el);
      if (current == null) return;
      if (target.last != null && current !== target.last) {
        flashWhenReady(target.selector, current - target.last);
      }
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
      // Only clean up after our own animation - the theme runs other
      // animations that bubble to document.
      if (String(event.animationName).indexOf('price-flash') !== 0) return;
      if (event.target instanceof Element) event.target.classList.remove(UP_CLASS, DOWN_CLASS);
    });

    var pending = null;
    new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(check, 150);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
