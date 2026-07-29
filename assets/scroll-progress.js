// Hallmark redesign - scroll progress indicator. Creates a hairline bar
// fixed to the top of the viewport and fills it left-to-right based on
// how far down the page the user has scrolled. Purely additive: the
// element doesn't exist until this script runs, so a slow/failed load
// just means no bar, never a missing or hidden piece of real content.
// See .scroll-progress-bar in layout/theme.liquid for the styling half.
//
// This theme's "squeeze layout" scrolls .page-wrapper on desktop
// (>=990px), not window/document - document.scrollingElement has
// overflow:hidden there and never moves. Mirrors the same
// desktopQuery/.page-wrapper lookup already used by the header
// scrolled-shadow script further down this file (search
// initHeaderScrolledShadow) and by assets/scroll-container.js.
(function () {
  var track = document.createElement('div');
  track.className = 'scroll-progress-track';
  document.body.appendChild(track);

  var bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  document.body.appendChild(bar);

  var desktopQuery = window.matchMedia('(min-width: 990px)');

  function getScrollEl() {
    if (desktopQuery.matches) {
      return document.querySelector('.page-wrapper') || document.scrollingElement || document.documentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  var scrollEl = getScrollEl();

  function update() {
    var scrollable = scrollEl.scrollHeight - scrollEl.clientHeight;
    var pct = scrollable > 0 ? (scrollEl.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }

  scrollEl.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  desktopQuery.addEventListener('change', function () {
    scrollEl.removeEventListener('scroll', update);
    scrollEl = getScrollEl();
    update();
    scrollEl.addEventListener('scroll', update, { passive: true });
  });

  update();
})();
