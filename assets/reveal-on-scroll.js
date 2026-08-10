import { Component } from '@theme/component';

/**
 * A custom element that fades in its content children one at a time
 * as they scroll into the viewport.
 */
class RevealOnScroll extends Component {
  connectedCallback() {
    super.connectedCallback();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const formatter = this.querySelector(':scope > rte-formatter');
    const items = formatter ? Array.from(formatter.children) : [this];
    if (!items.length) return;

    // Only hide the content once we know this script is live and will reveal it
    // again. Without this the CSS hides content that nothing ever un-hides.
    this.classList.add('is-observing');

    const reveal = (/** @type {Element} */ item) => item.classList.add('is-revealed');
    let delivered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        delivered = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    Array.from(items).forEach((item) => observer.observe(item));

    // Failsafe: if the observer never reports, show everything rather than
    // leaving the page blank.
    setTimeout(() => {
      if (delivered) return;
      items.forEach(reveal);
      observer.disconnect();
    }, 2000);
  }
}

if (!customElements.get('reveal-on-scroll')) {
  customElements.define('reveal-on-scroll', RevealOnScroll);
}
