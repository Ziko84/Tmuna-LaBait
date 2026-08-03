// Drives the product-card add-to-cart button's lift via a JS-toggled class
// instead of native CSS :hover, since :hover on .product-card__quick-add-row
// was observed genuinely dropping mid-hover (confirmed via
// element.matches(':hover') going false) while the row's own position never
// moved - a transform-vs-hover-geometry re-evaluation glitch, not a layout
// bug. mouseenter/mouseleave fire once on real DOM boundary crossings and
// aren't re-checked every animation frame the way :hover can be.
(function () {
  document.addEventListener(
    'mouseover',
    function (event) {
      var row = event.target.closest('.product-card__quick-add-row');
      if (row) row.classList.add('is-hovering');
    },
    { passive: true }
  );

  document.addEventListener(
    'mouseout',
    function (event) {
      var row = event.target.closest('.product-card__quick-add-row');
      if (!row) return;
      var related = event.relatedTarget;
      if (related && row.contains(related)) return; // still inside the row
      row.classList.remove('is-hovering');
    },
    { passive: true }
  );
})();
