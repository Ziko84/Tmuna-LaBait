import { Component } from '@theme/component';
import { formatMoney } from '@theme/money-formatting';
import '@theme/theme-drawer';

const STORAGE_KEY = 'tmuna-labait:favorites';
const CHANGE_EVENT = 'favorites:change';

function readHandles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHandles(handles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { handles } }));
}

export const Favorites = {
  getAll: readHandles,
  has(handle) {
    return readHandles().includes(handle);
  },
  toggle(handle) {
    const handles = readHandles();
    const index = handles.indexOf(handle);
    if (index === -1) {
      handles.unshift(handle);
    } else {
      handles.splice(index, 1);
    }
    writeHandles(handles);
    return index === -1;
  },
  remove(handle) {
    writeHandles(readHandles().filter((existing) => existing !== handle));
  },
};

class FavoriteToggle extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#sync();
    window.addEventListener(CHANGE_EVENT, this.#sync);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(CHANGE_EVENT, this.#sync);
  }

  /**
   * @param {PointerEvent} event
   */
  toggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const handle = this.dataset.productHandle;
    if (!handle) return;

    const isFavorite = Favorites.toggle(handle);
    this.classList.toggle('is-favorite', isFavorite);
    this.setAttribute('aria-pressed', String(isFavorite));

    this.classList.remove('favorite-toggle--pulse');
    // Force reflow so the animation can restart on rapid re-clicks.
    void this.offsetWidth;
    this.classList.add('favorite-toggle--pulse');
  }

  #sync = () => {
    const handle = this.dataset.productHandle;
    if (!handle) return;
    const isFavorite = Favorites.has(handle);
    this.classList.toggle('is-favorite', isFavorite);
    this.setAttribute('aria-pressed', String(isFavorite));
  };
}

if (!customElements.get('favorite-toggle')) {
  customElements.define('favorite-toggle', FavoriteToggle);
}

class FavoritesCount extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#sync();
    window.addEventListener(CHANGE_EVENT, this.#sync);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(CHANGE_EVENT, this.#sync);
  }

  #sync = () => {
    const count = Favorites.getAll().length;
    this.textContent = count > 0 ? String(count) : '';
    this.classList.toggle('visually-hidden', count === 0);
  };
}

if (!customElements.get('favorites-count')) {
  customElements.define('favorites-count', FavoritesCount);
}

class FavoritesIndicator extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#sync();
    window.addEventListener(CHANGE_EVENT, this.#sync);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(CHANGE_EVENT, this.#sync);
  }

  #sync = () => {
    this.classList.toggle('has-favorites', Favorites.getAll().length > 0);
  };
}

if (!customElements.get('favorites-indicator')) {
  customElements.define('favorites-indicator', FavoritesIndicator);
}

/**
 * @typedef {Object} FavoritesDrawerRefs
 * @property {HTMLElement} list
 */

/**
 * @extends {Component<FavoritesDrawerRefs>}
 */
class FavoritesDrawerComponent extends Component {
  requiredRefs = ['list'];

  connectedCallback() {
    super.connectedCallback();
    this.#render();
    window.addEventListener(CHANGE_EVENT, this.#render);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(CHANGE_EVENT, this.#render);
  }

  /**
   * @param {PointerEvent} event
   */
  removeItem(event) {
    const target = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[data-remove-handle]') : null);
    if (!target) return;
    const handle = target.getAttribute('data-remove-handle');
    if (handle) Favorites.remove(handle);
  }

  #render = async () => {
    const handles = Favorites.getAll();
    const { list } = this.refs;

    if (handles.length === 0) {
      list.innerHTML = `<p class="favorites-drawer__empty">${this.dataset.emptyText ?? ''}</p>`;
      return;
    }

    const moneyFormat = this.dataset.moneyFormat ?? '{{amount}}';
    const currency = this.dataset.currency ?? '';

    const products = await Promise.all(
      handles.map((handle) =>
        fetch(`/products/${handle}.js`, { headers: { accept: 'application/json' } })
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null)
      )
    );

    list.innerHTML = handles
      .map((handle, index) => {
        const product = products[index];
        if (!product) return '';

        const image = product.featured_image
          ? product.featured_image.replace(/(\.[a-zA-Z0-9]+)(\?.*)?$/, '_160x$1$2')
          : '';
        const price = formatMoney(product.price, moneyFormat, currency);
        const url = product.url ?? `/products/${handle}`;

        return `
          <div class="favorites-drawer__item">
            <a href="${url}" class="favorites-drawer__item-media">
              ${image ? `<img src="${image}" alt="" loading="lazy" width="72" height="72">` : ''}
            </a>
            <div class="favorites-drawer__item-info">
              <a href="${url}" class="favorites-drawer__item-title">${product.title}</a>
              <span class="favorites-drawer__item-price">${price}</span>
            </div>
            <button type="button" class="favorites-drawer__item-remove button-unstyled" data-remove-handle="${handle}" aria-label="${this.dataset.removeText ?? ''}" on:click="/removeItem">
              <span class="svg-wrapper">${this.querySelector('template[data-close-icon]')?.innerHTML ?? '×'}</span>
            </button>
          </div>
        `;
      })
      .join('');
  };
}

if (!customElements.get('favorites-drawer-component')) {
  customElements.define('favorites-drawer-component', FavoritesDrawerComponent);
}
