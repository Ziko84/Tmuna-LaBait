// Recolours the Shop customer-account avatar in the header from Shop's purple
// to the store's black-and-white palette.
//
// <shopify-account> renders inside an open shadow root, so page CSS cannot
// reach it - the override has to be injected into the shadow root itself. The
// component re-renders on login/logout, so the style is re-applied whenever
// the shadow content changes.
(function () {
  var STYLE_ID = 'tl-account-avatar-theme';

  var CSS = [
    /* The wrapper draws Shop's purple ring via border/outline/box-shadow
       depending on state - clear all three. */
    '.account-button__avatar,',
    '.account-button--shop-customer {',
    '  border-color: #1a1a2e !important;',
    '  outline: none !important;',
    '  box-shadow: none !important;',
    '}',
    /* Front of the coin: the initials badge. */
    '.account-button__coin-front {',
    '  background: #ffffff !important;',
    '  background-image: none !important;',
    '  border: 1px solid #1a1a2e !important;',
    '  color: #1a1a2e !important;',
    '}',
    '.account-button__avatar-initials {',
    '  color: #1a1a2e !important;',
    '  text-transform: lowercase;',
    '}',
    /* Back of the coin: the Shop logo side shown on flip/hover. */
    '.account-button__coin-back {',
    '  background: #1a1a2e !important;',
    '  background-image: none !important;',
    '  border: 1px solid #1a1a2e !important;',
    '}',
    '.account-button__coin-back-logo path {',
    '  fill: #ffffff !important;',
    '}',
    /* Any focus/hover ring the component draws in its own brand colour. */
    '.account-button:focus-visible .account-button__avatar,',
    '.account-button:hover .account-button__avatar {',
    '  outline-color: #1a1a2e !important;',
    '}',
  ].join('\n');

  function apply(root) {
    if (!root || root.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    root.appendChild(style);
  }

  function attach(host) {
    if (!host || !host.shadowRoot) return false;
    apply(host.shadowRoot);

    // The component rebuilds its subtree on auth state changes, which drops
    // the injected style with it.
    new MutationObserver(function () {
      apply(host.shadowRoot);
    }).observe(host.shadowRoot, { childList: true, subtree: true });

    return true;
  }

  function init() {
    if (attach(document.querySelector('shopify-account'))) return;

    // The element is defined by Shopify's script, which may land after ours.
    var observer = new MutationObserver(function () {
      if (attach(document.querySelector('shopify-account'))) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Do not watch forever if the customer is signed out and it never appears.
    setTimeout(function () {
      observer.disconnect();
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
