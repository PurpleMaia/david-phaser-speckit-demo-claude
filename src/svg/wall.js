import { colors } from './palette.js';

/**
 * Creates SVG for wall tiles
 * - Brown solid rectangle using palette
 * - Simple border for definition
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createWallSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="32" height="32" fill="${colors.wallBase}"/>
    <rect x="0" y="0" width="32" height="32" fill="none" stroke="${colors.wallDark}" stroke-width="1"/>
  </svg>`;
}
