import { colors } from '../palette.js';

/**
 * Creates SVG for interactive chest object with parametric state support
 * - Gold colored chest icon using palette
 * - Simple geometric representation
 * - 32x32 pixel canvas
 * @param {Object} config - Configuration object
 * @param {string} [config.state='closed'] - Chest state: 'closed' | 'collected'
 * @param {string} [config.glowColor=colors.chestGlow] - Glow effect color
 * @returns {string} SVG markup
 */
export function createChestSvg(config = {}) {
  const {
    state = 'closed',
    glowColor = colors.chestGlow,
  } = config;

  // Adjust opacity based on state
  const opacity = state === 'collected' ? 0.5 : 1.0;

  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g opacity="${opacity}">
      <rect x="6" y="14" width="20" height="14" fill="${colors.chestBase}" stroke="${colors.wallDark}" stroke-width="1"/>
      <rect x="6" y="10" width="20" height="6" fill="${glowColor}" stroke="${colors.wallDark}" stroke-width="1" rx="2"/>
      <circle cx="16" cy="17" r="2" fill="${colors.wallDark}"/>
    </g>
  </svg>`;
}
