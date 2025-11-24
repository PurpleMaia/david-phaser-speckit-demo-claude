/**
 * Create rounded rectangle SVG element string
 * @param {Object} params - Shape parameters
 * @param {number} params.x - X coordinate
 * @param {number} params.y - Y coordinate
 * @param {number} params.width - Width in pixels
 * @param {number} params.height - Height in pixels
 * @param {string} params.fill - Fill color (hex)
 * @param {number} [params.rx=0] - X-axis corner radius
 * @param {number} [params.ry=0] - Y-axis corner radius
 * @param {string} [params.stroke='none'] - Stroke color
 * @param {number} [params.strokeWidth=0] - Stroke width
 * @returns {string} SVG element string (fragment, not complete document)
 */
export function createRoundedRect(params) {
  const {
    x, y, width, height, fill,
    rx = 0,
    ry = 0,
    stroke = 'none',
    strokeWidth = 0,
  } = params;

  return `<rect x="${x}" y="${y}" width="${width}" height="${height}"
    rx="${rx}" ry="${ry}" fill="${fill}"
    stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}
