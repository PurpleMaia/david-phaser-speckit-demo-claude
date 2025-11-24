/**
 * Creates SVG for wall tiles
 * - Dark gray solid rectangle
 * - Simple border for definition
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createWallSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="32" height="32" fill="#666666"/>
    <rect x="0" y="0" width="32" height="32" fill="none" stroke="#444444" stroke-width="1"/>
  </svg>`;
}
