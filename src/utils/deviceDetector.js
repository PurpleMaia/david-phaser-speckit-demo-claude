/**
 * Device Detection Utility
 * Determines whether on-screen touch controls should be shown
 * Phase 3: Mobile / Touch Controls
 */

/**
 * Detect device capabilities and viewport size
 * @param {Object} config - Configuration options
 * @param {boolean} config.forceShow - Force show controls for testing (default: false)
 * @returns {{ isTouchDevice: boolean, isMobileViewport: boolean, shouldShowControls: boolean }}
 */
export function detectDevice(config = {}) {
  const { forceShow = false } = config;

  // Detect touch capability
  const isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );

  // Detect mobile viewport (width < 768px threshold)
  const isMobileViewport = window.innerWidth < 768;

  // Determine if controls should be shown
  const shouldShowControls = forceShow || isTouchDevice || isMobileViewport;

  return {
    isTouchDevice,
    isMobileViewport,
    shouldShowControls
  };
}
