/**
 * Creates SVG for interactive chest object
 * - Gold/yellow colored chest icon
 * - Simple geometric representation
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createChestSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="20" height="14" fill="#FFAA00" stroke="#886600" stroke-width="1"/>
    <rect x="6" y="10" width="20" height="6" fill="#FFCC44" stroke="#886600" stroke-width="1" rx="2"/>
    <circle cx="16" cy="17" r="2" fill="#886600"/>
  </svg>`;
}
