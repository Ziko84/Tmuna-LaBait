// Header menu font shrinks continuously while scrolling down, down to 50%
// of its base size, fully back to 100% at the top of the page.
//
// The scrollable element differs by viewport: at >= 990px width, html/body
// have overflow: hidden and .page-wrapper is the actual scroll container
// (see assets/base.css); below that breakpoint the document itself scrolls.
// Listening on window alone misses every scroll event on desktop, so this
// listens on both and just takes whichever scroll position is larger.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SHRINK_DISTANCE = 1200; // px of scroll to reach the minimum size
  var root = document.documentElement;
  var pageWrapper = document.querySelector('.page-wrapper');
  var ticking = false;

  function update() {
    var scrollTop = Math.max(window.scrollY, pageWrapper ? pageWrapper.scrollTop : 0);
    var progress = Math.min(scrollTop / SHRINK_DISTANCE, 1);
    root.style.setProperty('--menu-scroll-shrink', progress.toFixed(3));
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  if (pageWrapper) pageWrapper.addEventListener('scroll', onScroll, { passive: true });

  update();
})();
