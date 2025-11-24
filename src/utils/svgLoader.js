/**
 * Converts SVG string to data URI for Phaser loading
 * @param {string} svgString - Complete SVG markup
 * @returns {string} Data URI string
 */
export function svgToDataUri(svgString) {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
}
