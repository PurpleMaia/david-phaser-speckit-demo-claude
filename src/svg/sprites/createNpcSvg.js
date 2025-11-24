import { colors } from '../palette.js';

/**
 * Creates SVG for NPC character with head + body structure and shading
 * Phase 2 upgrade: Characterful design with 2-3 colors and simple shading
 * - Head (circle) at top
 * - Body (robe/rounded rectangle) below head
 * - Simple shading using darker color variants
 * - 32x32 pixel canvas
 * @param {Object} config - Configuration object
 * @param {string} [config.bodyColor=colors.npcRobe] - Body/robe color
 * @param {string} [config.headColor=colors.playerSkin] - Head/skin color (reuse player skin)
 * @param {string} [config.accessoryColor=colors.npcRobeDark] - Accessory/trim color
 * @param {string} [config.type='merchant'] - NPC type (for future expansion)
 * @returns {string} SVG markup
 */
export function createNpcSvg(config = {}) {
  const {
    bodyColor = colors.npcRobe,
    headColor = colors.playerSkin,  // Reuse player skin to save colors
    accessoryColor = colors.npcRobeDark,
    type = 'merchant',
  } = config;

  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (robe) - rounded rectangle -->
    <rect x="8" y="14" width="16" height="16" rx="3" fill="${bodyColor}"/>
    <!-- Body shading (darker right edge for depth) -->
    <rect x="22" y="14" width="2" height="16" rx="3" fill="${accessoryColor}"/>
    <!-- Robe trim (accent at bottom) -->
    <rect x="8" y="28" width="16" height="2" fill="${accessoryColor}"/>

    <!-- Head (circle) -->
    <circle cx="16" cy="9" r="5" fill="${headColor}"/>
    <!-- Head shading (darker bottom half) -->
    <ellipse cx="16" cy="11" rx="5" ry="2.5" fill="${colors.playerSkinDark}"/>
  </svg>`;
}
