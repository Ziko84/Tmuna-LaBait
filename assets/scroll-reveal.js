// Hallmark redesign - premium scroll-reveal micro-interaction.
// Fades/slides each page section in as it scrolls into view. The first
// section is skipped deliberately - it's already visible on load, so
// animating it risks a CLS/LCP hit for no visual benefit since the user
// hasn't scrolled yet. Respects prefers-reduced-motion. See the CSS block
// in layout/theme.liquid (search "has-scroll-reveal") for the styling half.
(function () {
  var sections = document.querySelectorAll('#MainContent .section');
  if (!sections.length) return;

  var targets = Array.prototype.slice.call(sections).slice(1);
  if (!targets.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-revealed');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
