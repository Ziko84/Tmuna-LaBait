/**
 * LED color swatches on product cards and the product page (night-mode
 * products only). Recolors only the bright glow in the photo (not the whole
 * image) by using the night photo itself as a luminance mask under a
 * mix-blend-mode:color overlay, so no per-color product photography is
 * needed. Tint opacity is controlled entirely by CSS :hover on the same
 * container that drives the day/night crossfade - this script only sets
 * which color the tint should be.
 */
document.addEventListener('click', (event) => {
  const swatch = event.target.closest('.led-swatch');
  if (!swatch) return;

  event.preventDefault();
  event.stopPropagation();

  const scope = swatch.closest('.product-media-container');
  if (!scope) return;

  const tint = scope.querySelector('.led-tint');
  if (!tint) return;

  scope.querySelectorAll('.led-swatch').forEach((button) => {
    button.classList.remove('led-swatch--active');
    button.setAttribute('aria-pressed', 'false');
  });
  swatch.classList.add('led-swatch--active');
  swatch.setAttribute('aria-pressed', 'true');

  tint.style.backgroundColor = swatch.dataset.ledColor || 'transparent';
});
