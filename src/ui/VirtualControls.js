/**
 * VirtualControls - On-screen touch controls for mobile
 * Creates D-pad (4 directional buttons) and Action button
 * Phase 3: Mobile / Touch Controls
 */

import { createTouchButtonSvg } from '../svg/sprites/createTouchButtonSvg.js';
import { svgToTexture } from '../utils/textureLoader.js';

export class VirtualControls {
  constructor(scene, config = {}) {
    this.scene = scene;

    // Configuration
    this.visible = config.visible !== undefined ? config.visible : true;
    this.buttonSize = config.buttonSize || 48;
    this.margin = config.margin || 20;

    // Button sprites (will be created in create())
    this.upButton = null;
    this.downButton = null;
    this.leftButton = null;
    this.rightButton = null;
    this.actionButton = null;

    // Button pressed state
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.actionPressed = false;

    // Track actionJustPressed for one-frame trigger
    this.actionJustPressed = false;
    this.lastActionPressed = false;
  }

  /**
   * Create and position all touch buttons
   */
  create() {
    // Generate and load button textures
    this.loadButtonTextures();

    // Get game dimensions for positioning
    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;

    // Create D-pad buttons (bottom-left, cross arrangement)
    const dpadCenterX = this.margin + this.buttonSize;
    const dpadCenterY = gameHeight - this.margin - this.buttonSize;

    // Up button
    this.upButton = this.scene.add.sprite(
      dpadCenterX,
      dpadCenterY - this.buttonSize,
      'button-up'
    );
    this.upButton.setScrollFactor(0);
    this.upButton.setDepth(1000);

    // Down button
    this.downButton = this.scene.add.sprite(
      dpadCenterX,
      dpadCenterY + this.buttonSize,
      'button-down'
    );
    this.downButton.setScrollFactor(0);
    this.downButton.setDepth(1000);

    // Left button
    this.leftButton = this.scene.add.sprite(
      dpadCenterX - this.buttonSize,
      dpadCenterY,
      'button-left'
    );
    this.leftButton.setScrollFactor(0);
    this.leftButton.setDepth(1000);

    // Right button
    this.rightButton = this.scene.add.sprite(
      dpadCenterX + this.buttonSize,
      dpadCenterY,
      'button-right'
    );
    this.rightButton.setScrollFactor(0);
    this.rightButton.setDepth(1000);

    // Action button (bottom-right)
    this.actionButton = this.scene.add.sprite(
      gameWidth - this.margin - this.buttonSize / 2,
      gameHeight - this.margin - this.buttonSize / 2,
      'button-action'
    );
    this.actionButton.setScrollFactor(0);
    this.actionButton.setDepth(1000);

    // Set initial visibility
    this.setVisible(this.visible);

    // Wire up touch event handlers
    this.setupTouchHandlers();
  }

  /**
   * Set up touch event handlers for all buttons
   * Phase 3 - T020-T021: Touch event handling
   */
  setupTouchHandlers() {
    // Up button
    this.upButton.setInteractive();
    this.upButton.on('pointerdown', () => {
      this.upPressed = true;
      this.upButton.setTexture('button-up-pressed');
    });
    this.upButton.on('pointerup', () => {
      this.upPressed = false;
      this.upButton.setTexture('button-up');
    });
    this.upButton.on('pointerout', () => {
      this.upPressed = false;
      this.upButton.setTexture('button-up');
    });

    // Down button
    this.downButton.setInteractive();
    this.downButton.on('pointerdown', () => {
      this.downPressed = true;
      this.downButton.setTexture('button-down-pressed');
    });
    this.downButton.on('pointerup', () => {
      this.downPressed = false;
      this.downButton.setTexture('button-down');
    });
    this.downButton.on('pointerout', () => {
      this.downPressed = false;
      this.downButton.setTexture('button-down');
    });

    // Left button
    this.leftButton.setInteractive();
    this.leftButton.on('pointerdown', () => {
      this.leftPressed = true;
      this.leftButton.setTexture('button-left-pressed');
    });
    this.leftButton.on('pointerup', () => {
      this.leftPressed = false;
      this.leftButton.setTexture('button-left');
    });
    this.leftButton.on('pointerout', () => {
      this.leftPressed = false;
      this.leftButton.setTexture('button-left');
    });

    // Right button
    this.rightButton.setInteractive();
    this.rightButton.on('pointerdown', () => {
      this.rightPressed = true;
      this.rightButton.setTexture('button-right-pressed');
    });
    this.rightButton.on('pointerup', () => {
      this.rightPressed = false;
      this.rightButton.setTexture('button-right');
    });
    this.rightButton.on('pointerout', () => {
      this.rightPressed = false;
      this.rightButton.setTexture('button-right');
    });

    // Action button
    this.actionButton.setInteractive();
    this.actionButton.on('pointerdown', () => {
      this.actionPressed = true;
      this.actionButton.setTexture('button-action-pressed');
    });
    this.actionButton.on('pointerup', () => {
      this.actionPressed = false;
      this.actionButton.setTexture('button-action');
    });
    this.actionButton.on('pointerout', () => {
      this.actionPressed = false;
      this.actionButton.setTexture('button-action');
    });
  }

  /**
   * Load all button textures (normal and pressed states)
   */
  loadButtonTextures() {
    const size = this.buttonSize;

    // Direction buttons (normal state)
    const upSvg = createTouchButtonSvg({ type: 'direction', direction: 'up', size, state: 'normal' });
    const downSvg = createTouchButtonSvg({ type: 'direction', direction: 'down', size, state: 'normal' });
    const leftSvg = createTouchButtonSvg({ type: 'direction', direction: 'left', size, state: 'normal' });
    const rightSvg = createTouchButtonSvg({ type: 'direction', direction: 'right', size, state: 'normal' });

    // Direction buttons (pressed state)
    const upPressedSvg = createTouchButtonSvg({ type: 'direction', direction: 'up', size, state: 'pressed' });
    const downPressedSvg = createTouchButtonSvg({ type: 'direction', direction: 'down', size, state: 'pressed' });
    const leftPressedSvg = createTouchButtonSvg({ type: 'direction', direction: 'left', size, state: 'pressed' });
    const rightPressedSvg = createTouchButtonSvg({ type: 'direction', direction: 'right', size, state: 'pressed' });

    // Action button (normal and pressed)
    const actionSvg = createTouchButtonSvg({ type: 'action', size, state: 'normal' });
    const actionPressedSvg = createTouchButtonSvg({ type: 'action', size, state: 'pressed' });

    // Load textures using svgToTexture
    svgToTexture(this.scene, 'button-up', upSvg, size, size);
    svgToTexture(this.scene, 'button-down', downSvg, size, size);
    svgToTexture(this.scene, 'button-left', leftSvg, size, size);
    svgToTexture(this.scene, 'button-right', rightSvg, size, size);
    svgToTexture(this.scene, 'button-up-pressed', upPressedSvg, size, size);
    svgToTexture(this.scene, 'button-down-pressed', downPressedSvg, size, size);
    svgToTexture(this.scene, 'button-left-pressed', leftPressedSvg, size, size);
    svgToTexture(this.scene, 'button-right-pressed', rightPressedSvg, size, size);
    svgToTexture(this.scene, 'button-action', actionSvg, size, size);
    svgToTexture(this.scene, 'button-action-pressed', actionPressedSvg, size, size);
  }

  /**
   * Update button state (call every frame)
   */
  update() {
    // Track actionJustPressed (true for one frame on press)
    const actionNowPressed = this.actionPressed;
    this.actionJustPressed = actionNowPressed && !this.lastActionPressed;
    this.lastActionPressed = actionNowPressed;
  }

  /**
   * Get current button press states
   * @returns {{ up: boolean, down: boolean, left: boolean, right: boolean, action: boolean }}
   */
  getButtonStates() {
    return {
      up: this.upPressed,
      down: this.downPressed,
      left: this.leftPressed,
      right: this.rightPressed,
      action: this.actionPressed
    };
  }

  /**
   * Check if action button was just pressed (for dialog trigger)
   * @returns {boolean} True for one frame on press
   */
  isActionJustPressed() {
    return this.actionJustPressed;
  }

  /**
   * Show or hide controls
   * @param {boolean} visible - Show (true) or hide (false)
   */
  setVisible(visible) {
    if (this.upButton) this.upButton.setVisible(visible);
    if (this.downButton) this.downButton.setVisible(visible);
    if (this.leftButton) this.leftButton.setVisible(visible);
    if (this.rightButton) this.rightButton.setVisible(visible);
    if (this.actionButton) this.actionButton.setVisible(visible);
  }

  /**
   * Destroy all button sprites and cleanup
   */
  destroy() {
    if (this.upButton) this.upButton.destroy();
    if (this.downButton) this.downButton.destroy();
    if (this.leftButton) this.leftButton.destroy();
    if (this.rightButton) this.rightButton.destroy();
    if (this.actionButton) this.actionButton.destroy();
  }
}
