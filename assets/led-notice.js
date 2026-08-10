import { Component } from '@theme/component';
import { StandardEvents } from '@shopify/events';

/**
 * Shows a notice only while a variant that ships without LED lighting is
 * selected. Which variants those are is driven by data, not by size text: the
 * element carries a data-match-suffix and the notice shows when the selected
 * variant's SKU ends with it.
 *
 * Mirrors the event wiring used by product-sku.js.
 */
class LedNoticeComponent extends Component {
  connectedCallback() {
    super.connectedCallback();
    const target = this.closest('[id*="ProductInformation-"], [id*="QuickAdd-"], product-card');
    if (!target) return;
    target.addEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const target = this.closest('[id*="ProductInformation-"], [id*="QuickAdd-"], product-card');
    if (!target) return;
    target.removeEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  /** @param {string} sku */
  #matches(sku) {
    const suffix = this.dataset.matchSuffix || '';
    return Boolean(suffix) && typeof sku === 'string' && sku.endsWith(suffix);
  }

  #handleProductSelect = (event) => {
    event.promise
      .then(({ detail }) => {
        if (!detail) return;

        const { newProduct, resource } = detail;
        if (newProduct) this.dataset.productId = newProduct.id;
        if (detail.productId && detail.productId !== this.dataset.productId) return;
        if (!resource) return;

        this.hidden = !this.#matches(resource.sku || '');
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[led-notice] Event promise rejected:', error);
      });
  };
}

if (!customElements.get('led-notice-component')) {
  customElements.define('led-notice-component', LedNoticeComponent);
}
