import { Component } from '@theme/component';

/**
 * Shows a notice only while a size that ships without LED lighting is selected.
 *
 * Rather than trusting a variant-change event payload, this reads the variant
 * picker's own current value and compares it against a list supplied by Liquid.
 * That works for both the dropdown and button picker styles, and survives the
 * section being re-rendered.
 */
class LedNoticeComponent extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.container =
      this.closest('[id*="ProductInformation-"], [id*="QuickAdd-"], product-card') || document;

    try {
      this.noLedValues = JSON.parse(this.dataset.noLedValues || '[]');
    } catch {
      this.noLedValues = [];
    }

    this.#sync();
    this.container.addEventListener('change', this.#sync, true);
    this.container.addEventListener('click', this.#deferredSync, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.container?.removeEventListener('change', this.#sync, true);
    this.container?.removeEventListener('click', this.#deferredSync, true);
  }

  /** Reads whichever picker control the theme rendered. */
  #selectedValue() {
    const select = this.container.querySelector?.('.variant-option__select');
    if (select && select.value) return select.value.trim();

    const checked = this.container.querySelector?.(
      '.variant-option input[type="radio"]:checked, fieldset input[type="radio"]:checked'
    );
    if (checked) {
      const label = checked.closest('label') || this.container.querySelector(`label[for="${checked.id}"]`);
      return (label?.textContent || checked.value || '').trim();
    }
    return '';
  }

  #sync = () => {
    if (!this.noLedValues.length) return;
    const current = this.#selectedValue();
    if (!current) return;
    this.hidden = !this.noLedValues.some((value) => current.includes(value));
  };

  /** Button pickers update state after the click handler, so re-check next tick. */
  #deferredSync = () => {
    setTimeout(this.#sync, 0);
  };
}

if (!customElements.get('led-notice-component')) {
  customElements.define('led-notice-component', LedNoticeComponent);
}
