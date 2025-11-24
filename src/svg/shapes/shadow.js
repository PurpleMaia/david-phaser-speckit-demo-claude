/**
 * Create drop-shadow effect using simple offset rectangle
 * (Simpler than SVG <filter> elements, more LLM-readable)
 * @param {Object} params - Shadow parameters
 * @param {number} params.x - X coordinate of shadowed element
 * @param {number} params.y - Y coordinate of shadowed element
 * @param {number} params.width - Width of shadowed element
 * @param {number} params.height - Height of shadowed element
 * @param {number} [params.offsetX=6] - Shadow offset on X axis (pixels)
 * @param {number} [params.offsetY=6] - Shadow offset on Y axis (pixels)
 * @param {string} [params.color='#00000080'] - Shadow color (with alpha for transparency)
 * @param {number} [params.rx=0] - X-axis corner radius (if rounded shadow needed)
 * @param {number} [params.ry=0] - Y-axis corner radius (if rounded shadow needed)
 * @returns {string} SVG element string (fragment, not complete document)
 */
export function createShadow(params) {
  const {
    x, y, width, height,
    offsetX = 6,
    offsetY = 6,
    color = '#00000080',
    rx = 0,
    ry = 0,
  } = params;

  return `<rect x="${x + offsetX}" y="${y + offsetY}" width="${width}" height="${height}"
    rx="${rx}" ry="${ry}" fill="${color}" />`;
}
