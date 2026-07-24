/**
 * LED color swatches on product cards and the product page (night-mode
 * products only). Recolors only the bright glow in the photo (not the whole
 * image) by using the night photo itself as a luminance mask under a
 * mix-blend-mode:color overlay, so no per-color product photography is
 * needed. Tint opacity is controlled entirely by CSS :hover on the same
 * container that drives the day/night crossfade - this script only sets
 * which color the tint should be.
 *
 * Hovering a swatch previews its color immediately; moving away reverts to
 * whichever color was last actually clicked (defaulting to warm white/none
 * until a choice is made). Clicking commits the color as that new default.
 */
function getScope(swatch) {
  // .product-media-container on product images/cards, .media-block on the
  // homepage banners (their night image is a static theme asset, not
  // product media, so it's a different container).
  return swatch.closest('.product-media-container, .media-block');
}

function getTint(scope) {
  return scope.querySelector('.led-tint');
}

document.addEventListener('click', (event) => {
  const swatchesRow = event.target.closest('.led-swatches');
  if (!swatchesRow) return;

  // Block the underlying product image link for ANY click that lands
  // inside the swatches row - including the small gaps between dots, not
  // just the dots themselves - so a near-miss never opens the product page.
  event.preventDefault();
  event.stopPropagation();

  const swatch = event.target.closest('.led-swatch');
  if (!swatch) return;

  const scope = getScope(swatch);
  if (!scope) return;

  const tint = getTint(scope);
  if (!tint) return;

  scope.querySelectorAll('.led-swatch').forEach((button) => {
    button.classList.remove('led-swatch--active');
    button.setAttribute('aria-pressed', 'false');
  });
  swatch.classList.add('led-swatch--active');
  swatch.setAttribute('aria-pressed', 'true');

  const color = swatch.dataset.ledColor || 'transparent';
  tint.style.backgroundColor = color;
  scope.dataset.ledSelectedColor = color;
});

document.addEventListener('pointerover', (event) => {
  const swatch = event.target.closest('.led-swatch');
  if (!swatch) return;

  const scope = getScope(swatch);
  if (!scope) return;

  const tint = getTint(scope);
  if (!tint) return;

  tint.style.backgroundColor = swatch.dataset.ledColor || 'transparent';
});

document.addEventListener('pointerout', (event) => {
  const swatch = event.target.closest('.led-swatch');
  if (!swatch) return;

  const scope = getScope(swatch);
  if (!scope) return;

  const tint = getTint(scope);
  if (!tint) return;

  tint.style.backgroundColor = scope.dataset.ledSelectedColor || 'transparent';
});
