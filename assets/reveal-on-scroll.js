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

    // When the children are the ones animating, the host itself never gets
    // .is-revealed. Any rule that hides the host would then never be undone and
    // would hide the revealed children with it, since opacity multiplies down
    // the tree. Reveal the host up front so only the children animate.
    if (formatter) this.classList.add('is-revealed');

    // Only hide the content once we know this script is live and will reveal it
    // again. Without this the CSS hides content that nothing ever un-hides.
    this.classList.add('is-observing');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    /** @param {Element} item */
    function reveal(item) {
      item.classList.add('is-revealed');
      observer.unobserve(item);
    }

    items.forEach((item) => observer.observe(item));

    // Failsafe: reveal anything that is already on screen but which the
    // observer has not reported. In a healthy browser the observer gets there
    // first and this is a no-op; if a callback is ever missed, content is still
    // visible instead of being stranded at opacity 0. Items below the fold keep
    // their observer and still animate in on scroll.
    const revealOnScreen = () => {
      const pending = items.filter((item) => !item.classList.contains('is-revealed'));
      pending.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) reveal(item);
      });
      if (!pending.length) window.removeEventListener('scroll', revealOnScreen);
    };

    setTimeout(revealOnScreen, 2000);
    window.addEventListener('scroll', revealOnScreen, { passive: true });
  }
}

if (!customElements.get('reveal-on-scroll')) {
  customElements.define('reveal-on-scroll', RevealOnScroll);
}
