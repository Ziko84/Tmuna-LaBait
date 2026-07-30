// Hallmark redesign - magnetic button hover. On mouse (pointer:fine)
// devices, pill buttons nudge a few px toward the cursor while hovered,
// snapping back on mouseleave. Pure progressive enhancement: the CSS
// var it drives (--magnet-x/--magnet-y, see .button:hover in
// layout/theme.liquid) defaults to 0px, so this file loading or failing
// changes nothing about the default lift-on-hover state.
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Add-to-cart is excluded: the playful magnet pull read as too
  // casual for this store's tone on the primary purchase action.
  var buttons = document.querySelectorAll(
    '.button:not(.add-to-cart-button), a.button:not(.add-to-cart-button), .button-secondary:not(.add-to-cart-button), .button-custom:not(.add-to-cart-button)'
  );
  if (!buttons.length) return;

  var STRENGTH = 0.25;
  var MAX_PULL = 8;

  function clamp(value) {
    return Math.max(-MAX_PULL, Math.min(MAX_PULL, value));
  }

  buttons.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var offsetX = e.clientX - (rect.left + rect.width / 2);
      var offsetY = e.clientY - (rect.top + rect.height / 2);
      el.style.setProperty('--magnet-x', clamp(offsetX * STRENGTH).toFixed(1) + 'px');
      el.style.setProperty('--magnet-y', clamp(offsetY * STRENGTH).toFixed(1) + 'px');
    });
    el.addEventListener('mouseleave', function () {
      el.style.setProperty('--magnet-x', '0px');
      el.style.setProperty('--magnet-y', '0px');
    });
  });
})();
