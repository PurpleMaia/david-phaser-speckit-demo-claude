/**
 * Touch Button SVG Generator
 * Creates on-screen control buttons for mobile touch input
 * Phase 3: Mobile / Touch Controls
 */

import { colors } from '../palette.js';

/**
 * Generate SVG string for touch control button
 * @param {Object} config - Button configuration
 * @param {string} config.type - Button type: 'direction' | 'action'
 * @param {string} config.direction - Direction: 'up' | 'down' | 'left' | 'right' (if type === 'direction')
 * @param {number} config.size - Button size in pixels (default: 48)
 * @param {string} config.baseColor - Background color (default: colors.buttonBase)
 * @param {string} config.iconColor - Icon color (default: colors.buttonIcon)
 * @param {string} config.state - Visual state: 'normal' | 'pressed' (default: 'normal')
 * @returns {string} Complete SVG markup string
 */
export function createTouchButtonSvg(config = {}) {
  const {
    type = 'direction',
    direction = 'up',
    size = 48,
    baseColor = colors.buttonBase,
    iconColor = colors.buttonIcon,
    state = 'normal'
  } = config;

  // Use darker color for pressed state
  const bgColor = state === 'pressed' ? colors.buttonBaseDark : baseColor;
  const center = size / 2;
  const radius = size / 2;

  // Generate arrow or action icon based on type
  let iconPath = '';

  if (type === 'direction') {
    // Create arrow triangles for directional buttons
    const arrowSize = size * 0.35; // Arrow takes up 35% of button size

    switch (direction) {
      case 'up':
        // Upward pointing triangle
        iconPath = `<polygon points="${center},${center - arrowSize} ${center - arrowSize * 0.7},${center + arrowSize * 0.5} ${center + arrowSize * 0.7},${center + arrowSize * 0.5}" fill="${iconColor}"/>`;
        break;
      case 'down':
        // Downward pointing triangle
        iconPath = `<polygon points="${center},${center + arrowSize} ${center - arrowSize * 0.7},${center - arrowSize * 0.5} ${center + arrowSize * 0.7},${center - arrowSize * 0.5}" fill="${iconColor}"/>`;
        break;
      case 'left':
        // Left pointing triangle
        iconPath = `<polygon points="${center - arrowSize},${center} ${center + arrowSize * 0.5},${center - arrowSize * 0.7} ${center + arrowSize * 0.5},${center + arrowSize * 0.7}" fill="${iconColor}"/>`;
        break;
      case 'right':
        // Right pointing triangle
        iconPath = `<polygon points="${center + arrowSize},${center} ${center - arrowSize * 0.5},${center - arrowSize * 0.7} ${center - arrowSize * 0.5},${center + arrowSize * 0.7}" fill="${iconColor}"/>`;
        break;
    }
  } else if (type === 'action') {
    // Action button with "A" text
    const fontSize = size * 0.5;
    iconPath = `<text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${iconColor}">A</text>`;
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${center}" cy="${center}" r="${radius - 2}" fill="${bgColor}" stroke="${iconColor}" stroke-width="2"/>
  ${iconPath}
</svg>`;
}
