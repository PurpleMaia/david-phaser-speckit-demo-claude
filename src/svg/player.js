import { colors } from './palette.js';

/**
 * Creates SVG for player character
 * - Blue circle (radius 14px) using palette color
 * - Triangle direction indicator pointing up
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createPlayerSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="${colors.playerShirt}"/>
    <polygon points="16,4 13,12 19,12" fill="${colors.playerSkin}"/>
  </svg>`;
}
