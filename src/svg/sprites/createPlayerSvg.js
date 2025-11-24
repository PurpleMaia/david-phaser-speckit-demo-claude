import { colors } from '../palette.js';

/**
 * Creates SVG for player character with head + body structure and shading
 * Phase 2 upgrade: Characterful design with 2-3 colors and simple shading
 * - Head (circle) at top
 * - Body (rounded rectangle) below head
 * - Simple shading using darker color variants
 * - 32x32 pixel canvas
 * @param {Object} config - Configuration object
 * @param {string} [config.bodyColor=colors.playerShirt] - Body/shirt color
 * @param {string} [config.headColor=colors.playerSkin] - Head/skin color
 * @param {string} [config.pantsColor] - Pants color (for future use)
 * @returns {string} SVG markup
 */
export function createPlayerSvg(config = {}) {
  const {
    bodyColor = colors.playerShirt,
    headColor = colors.playerSkin,
    pantsColor = colors.playerShirt,
  } = config;

  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (shirt) - rounded rectangle -->
    <rect x="10" y="14" width="12" height="16" rx="2" fill="${bodyColor}"/>
    <!-- Body shading (darker right edge for depth) -->
    <rect x="20" y="14" width="2" height="16" rx="2" fill="${colors.playerShirtDark}"/>

    <!-- Head (circle) -->
    <circle cx="16" cy="10" r="6" fill="${headColor}"/>
    <!-- Head shading (darker bottom half) -->
    <ellipse cx="16" cy="12" rx="6" ry="3" fill="${colors.playerSkinDark}"/>
  </svg>`;
}
