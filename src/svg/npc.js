import { colors } from './palette.js';

/**
 * Creates SVG for NPC character
 * - Purple square with rounded corners using palette color
 * - Skin-colored circle for face
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createNpcSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" fill="${colors.npcRobe}" rx="2"/>
    <circle cx="16" cy="16" r="4" fill="${colors.playerSkin}"/>
  </svg>`;
}
