// Toggles a contact channel's value (phone / email / WhatsApp) open and
// closed. By default the card shows only its label until clicked, and each
// click flips it open or shut instead of following the link - this is the
// phone card's behavior, since dialing isn't something to trigger from a
// page click.
//
// A card marked with the `data-open-on-reveal` attribute (email, WhatsApp)
// instead reveals its value AND lets the click continue through to the
// link, opening the mail client / wa.me in the same click.
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
    if (this.hasAttribute('data-open-on-reveal')) {
      this.classList.add('is-revealed');
      return;
    }
    event.preventDefault();
    this.classList.toggle('is-revealed');
  };
}

if (!customElements.get('contact-channel-reveal')) {
  customElements.define('contact-channel-reveal', ContactChannelReveal);
}
