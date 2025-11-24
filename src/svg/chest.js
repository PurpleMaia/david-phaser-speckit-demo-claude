import { colors } from './palette.js';

/**
 * Creates SVG for interactive chest object
 * - Gold colored chest icon using palette
 * - Simple geometric representation
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createChestSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="20" height="14" fill="${colors.chestBase}" stroke="${colors.wallDark}" stroke-width="1"/>
    <rect x="6" y="10" width="20" height="6" fill="${colors.chestGlow}" stroke="${colors.wallDark}" stroke-width="1" rx="2"/>
    <circle cx="16" cy="17" r="2" fill="${colors.wallDark}"/>
  </svg>`;
}
