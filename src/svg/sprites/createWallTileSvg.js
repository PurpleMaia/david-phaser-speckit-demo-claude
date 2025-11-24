import { colors } from '../palette.js';

/**
 * Creates SVG for wall tiles with parametric type support
 * - Brown solid rectangle using palette
 * - Simple border for definition
 * - 32x32 or 64x64 pixel canvas (Phase 2 will use 64x64)
 * @param {Object} config - Configuration object
 * @param {string} [config.type='solid'] - Wall type: 'solid' | 'doorway'
 * @returns {string} SVG markup
 */
export function createWallTileSvg(config = {}) {
  const {
    type = 'solid',
  } = config;

  // Phase 1: Simple 32x32 solid wall
  // Phase 2 will expand to 64x64 with doorway type
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="32" height="32" fill="${colors.wallBase}"/>
    <rect x="0" y="0" width="32" height="32" fill="none" stroke="${colors.wallDark}" stroke-width="1"/>
  </svg>`;
}
