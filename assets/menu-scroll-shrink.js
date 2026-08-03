// Header menu font shrinks continuously while scrolling down, down to 50%
// of its base size, fully back to 100% at the top of the page.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SHRINK_DISTANCE = 300; // px of scroll to reach the minimum size
  var root = document.documentElement;
  var ticking = false;

  function update() {
    var progress = Math.min(window.scrollY / SHRINK_DISTANCE, 1);
    root.style.setProperty('--menu-scroll-shrink', progress.toFixed(3));
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
})();
