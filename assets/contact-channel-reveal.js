// Hides a contact channel's value (phone / email / WhatsApp number) behind a
// blur until the visitor clicks once. The first click only reveals it; a
// second click on the now-revealed link follows through (call, mail, chat).
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
    if (this.classList.contains('is-revealed')) return;

    event.preventDefault();
    this.classList.add('is-revealed');
  };
}

if (!customElements.get('contact-channel-reveal')) {
  customElements.define('contact-channel-reveal', ContactChannelReveal);
}
