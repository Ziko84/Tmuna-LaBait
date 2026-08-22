// Toggles a contact channel's value (phone / email / WhatsApp) open and
// closed. By default the card shows only its label until clicked, and each
// click flips it open or shut instead of following the link - this is the
// phone/email cards' behavior, since dialing/mailto aren't things to
// trigger from an unrevealed click.
//
// A card marked with the `data-open-on-reveal` attribute (WhatsApp) still
// requires a first click to reveal its "שלח הודעה" label - only a second
// click, on the now-visible link, actually follows it to wa.me.
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
    const isRevealed = this.classList.contains('is-revealed');

    if (this.hasAttribute('data-open-on-reveal')) {
      if (!isRevealed) {
        event.preventDefault();
        this.classList.add('is-revealed');
      }
      // already revealed: let this click follow the link normally
      return;
    }

    event.preventDefault();
    this.classList.toggle('is-revealed');
  };
}

if (!customElements.get('contact-channel-reveal')) {
  customElements.define('contact-channel-reveal', ContactChannelReveal);
}
