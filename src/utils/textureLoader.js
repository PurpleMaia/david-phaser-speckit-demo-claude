import { svgToDataUri } from './svgLoader.js';

/**
 * Convert SVG string to Phaser texture and register it
 * Wraps existing svgToDataUri utility and handles Phaser texture registration
 *
 * @param {Phaser.Scene} scene - Phaser scene with texture manager
 * @param {string} key - Unique texture key for retrieval (e.g., 'player', 'npc')
 * @param {string} svgString - Complete SVG markup string
 * @param {number} width - Texture width in pixels (must match SVG viewBox width)
 * @param {number} height - Texture height in pixels (must match SVG viewBox height)
 * @returns {void}
 * @throws {Error} If texture key already exists (Phaser error, not custom)
 *
 * @example
 * // In scene create() method:
 * const playerSvg = createPlayerSvg();
 * svgToTexture(this, 'player', playerSvg, 32, 32);
 * this.player = this.physics.add.sprite(400, 300, 'player');
 */
export function svgToTexture(scene, key, svgString, width, height) {
  // Convert SVG to data URI
  const dataUri = svgToDataUri(svgString);

  // Register texture with Phaser using load.image (synchronous after data URI conversion)
  // Using textures.addImage or loading via data URI
  scene.textures.once('addtexture', () => {
    // Texture added successfully
  });

  // Load texture from data URI
  scene.load.image(key, dataUri);
  scene.load.once('complete', () => {
    // Loading complete
  });
  scene.load.start();
}
