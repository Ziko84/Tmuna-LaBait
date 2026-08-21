// Toggles a contact channel's value (phone / email / WhatsApp number) open
// and closed. The card shows only its label until clicked; each click flips
// it open or shut instead of following the link.
class ContactChannelReveal extends HTMLElement {
  #controller = new AbortController();

  connectedCallback() {
    const { signal } = this.#controller;
    this.addEventListener('click', this.#handleClick, { signal });
  }

  disconnectedCallback() {
    this.#controller.abort();
  }

  #handleClick = (event) => {
    event.preventDefault();
    this.classList.toggle('is-revealed');
  };
}

if (!customElements.get('contact-channel-reveal')) {
  customElements.define('contact-channel-reveal', ContactChannelReveal);
}
