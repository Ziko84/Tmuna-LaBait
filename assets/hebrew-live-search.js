// As-you-type search results, filtered locally.
//
// Shopify's Predictive Search API refuses Hebrew buyer locales: every
// /he-il/search/suggest request returns HTTP 417 "Unsupported buyer locale",
// including suggest.json and every section_id. (The page's shopify-features
// tag still reports predictiveSearch: true because that flag reflects the
// shop's primary locale, English, not the locale customers actually browse
// in - so the theme keeps issuing requests that can never succeed and the
// panel stays empty until Enter runs a normal search.)
//
// This filters an inlined catalog instead. The theme binds its own input
// handler by delegation on document, so a capture-phase listener that stops
// propagation cleanly takes over the field and suppresses the doomed fetch.
(function () {
  var MAX_RESULTS = 8;

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function matches(product, terms) {
    // Every term must appear somewhere, so "מלך אריות" still finds
    // "מלך האריות" regardless of word order.
    return terms.every(function (term) {
      return product.s.indexOf(term) !== -1;
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderResults(products) {
    return (
      '<ul class="live-search-results list-unstyled" data-live-search-rendered>' +
      products
        .map(function (product) {
          return (
            '<li class="live-search-results__item">' +
            '<a class="live-search-results__link" href="' + escapeHtml(product.u) + '">' +
            (product.i
              ? '<img class="live-search-results__image" src="' + escapeHtml(product.i) + '" alt="" loading="lazy" width="48" height="48">'
              : '<span class="live-search-results__image"></span>') +
            '<span class="live-search-results__text">' +
            '<span class="live-search-results__title">' + escapeHtml(product.t) + '</span>' +
            '<span class="live-search-results__price">' + escapeHtml(product.p) + '</span>' +
            '</span>' +
            '</a>' +
            '</li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function setup(component) {
    var catalogTag = component.querySelector('[data-live-search-catalog]');
    var input = component.querySelector('.search-input');
    var results = component.querySelector('[ref="predictiveSearchResults"]');
    if (!catalogTag || !input || !results) return;

    var catalog;
    try {
      catalog = JSON.parse(catalogTag.textContent);
    } catch (error) {
      return; // leave the theme's own behaviour untouched rather than break the field
    }
    if (!Array.isArray(catalog) || !catalog.length) return;

    // The default panel (recently viewed / empty state) is restored whenever
    // the field is cleared, so clearing looks the same as never having typed.
    var defaultMarkup = results.innerHTML;
    var timer = null;
    var writing = false;

    function currentQuery() {
      return normalize(input.value);
    }

    function ourResultsPresent() {
      return !!results.querySelector('[data-live-search-rendered]');
    }

    function update() {
      var query = currentQuery();

      writing = true;
      if (!query) {
        results.innerHTML = defaultMarkup;
      } else {
        var terms = query.split(' ');
        var found = [];
        for (var i = 0; i < catalog.length && found.length < MAX_RESULTS; i++) {
          if (matches(catalog[i], terms)) found.push(catalog[i]);
        }

        results.innerHTML = found.length
          ? renderResults(found)
          : '<p class="live-search-results__empty" data-live-search-rendered>לא נמצאו תוצאות</p>';
      }
      // Let the mutations we just caused settle before the observer resumes,
      // otherwise it sees its own write and loops.
      requestAnimationFrame(function () {
        writing = false;
      });
    }

    input.addEventListener(
      'input',
      function (event) {
        // Stops the theme's delegated document-level handler, and with it the
        // /search/suggest fetch that can only ever 417 on this locale.
        event.stopPropagation();
        clearTimeout(timer);
        timer = setTimeout(update, 120);
      },
      true
    );

    // stopPropagation alone isn't enough: the component re-renders this panel
    // from its own lifecycle too (empty state, recently-viewed, the failed
    // request settling), which wiped our results a moment after they appeared.
    // Rather than chase each of those paths, reassert our results whenever
    // something else replaces them while a query is active.
    new MutationObserver(function () {
      if (writing) return;
      if (!currentQuery()) return;
      if (ourResultsPresent()) return;
      update();
    }).observe(results, { childList: true, subtree: true });
  }

  function init() {
    document.querySelectorAll('predictive-search-component').forEach(setup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
