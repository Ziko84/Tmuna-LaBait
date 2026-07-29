// Hallmark redesign - scroll progress indicator. Creates a hairline bar
// fixed to the top of the viewport and fills it left-to-right based on
// how far down the page the user has scrolled. Purely additive: the
// element doesn't exist until this script runs, so a slow/failed load
// just means no bar, never a missing or hidden piece of real content.
// See .scroll-progress-bar in layout/theme.liquid for the styling half.
(function () {
  var track = document.createElement('div');
  track.className = 'scroll-progress-track';
  document.body.appendChild(track);

  var bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  document.body.appendChild(bar);

  function update() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
