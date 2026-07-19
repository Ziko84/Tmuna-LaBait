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

    const formatter = this.querySelector('rte-formatter');
    const items = formatter ? formatter.children : this.children;
    if (!items || !items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    Array.from(items).forEach((item) => observer.observe(item));
  }
}

if (!customElements.get('reveal-on-scroll')) {
  customElements.define('reveal-on-scroll', RevealOnScroll);
}
