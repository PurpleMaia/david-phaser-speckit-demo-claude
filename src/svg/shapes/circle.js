/**
 * Create circle SVG element string
 * @param {Object} params - Shape parameters
 * @param {number} params.cx - Center X coordinate
 * @param {number} params.cy - Center Y coordinate
 * @param {number} params.r - Radius
 * @param {string} params.fill - Fill color (hex)
 * @param {string} [params.stroke='none'] - Stroke color
 * @param {number} [params.strokeWidth=0] - Stroke width
 * @returns {string} SVG element string (fragment, not complete document)
 */
export function createCircle(params) {
  const {
    cx, cy, r, fill,
    stroke = 'none',
    strokeWidth = 0,
  } = params;

  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"
    stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}
