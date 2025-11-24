/**
 * PlayerInput - Unified input abstraction layer
 * Combines keyboard and virtual button inputs into a single interface
 * Phase 3: Mobile / Touch Controls
 */

export class PlayerInput {
  constructor(scene, virtualControls = null) {
    this.scene = scene;
    this.virtualControls = virtualControls;

    // Movement state (true = pressed, false = released)
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    // Action state
    this.action = false;
    this.actionJustPressed = false;
    this.lastActionState = false;

    // Set up keyboard input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = this.scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE');
    this.eKey = this.scene.input.keyboard.addKey('E');
  }

  /**
   * Update input state (call every frame in scene.update())
   */
  update() {
    // Update keyboard state
    const keyboardUp = this.cursors.up.isDown || this.wasd.W.isDown;
    const keyboardDown = this.cursors.down.isDown || this.wasd.S.isDown;
    const keyboardLeft = this.cursors.left.isDown || this.wasd.A.isDown;
    const keyboardRight = this.cursors.right.isDown || this.wasd.D.isDown;
    const keyboardAction = this.spaceKey.isDown || this.eKey.isDown;

    // Get virtual controls state (if exists)
    let virtualUp = false;
    let virtualDown = false;
    let virtualLeft = false;
    let virtualRight = false;
    let virtualAction = false;

    if (this.virtualControls) {
      this.virtualControls.update();
      const buttonStates = this.virtualControls.getButtonStates();
      virtualUp = buttonStates.up;
      virtualDown = buttonStates.down;
      virtualLeft = buttonStates.left;
      virtualRight = buttonStates.right;
      virtualAction = buttonStates.action;
    }

    // Combine keyboard and virtual inputs (logical OR)
    this.up = keyboardUp || virtualUp;
    this.down = keyboardDown || virtualDown;
    this.left = keyboardLeft || virtualLeft;
    this.right = keyboardRight || virtualRight;
    this.action = keyboardAction || virtualAction;

    // Track actionJustPressed (true for one frame on press)
    const actionNowPressed = this.action;
    this.actionJustPressed = actionNowPressed && !this.lastActionState;
    this.lastActionState = actionNowPressed;
  }

  /**
   * Get current movement direction as normalized vector
   * @returns {{ x: number, y: number }} Movement vector (-1 to 1 for each axis)
   */
  getMovementVector() {
    let x = 0;
    let y = 0;

    if (this.left) x -= 1;
    if (this.right) x += 1;
    if (this.up) y -= 1;
    if (this.down) y += 1;

    // Normalize diagonal movement (optional - keep speed consistent)
    if (x !== 0 && y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  /**
   * Check if action button is currently pressed
   * @returns {boolean} True if action button held down
   */
  isActionPressed() {
    return this.action;
  }

  /**
   * Check if action button was just pressed this frame
   * @returns {boolean} True for one frame on press
   */
  isActionJustPressed() {
    return this.actionJustPressed;
  }
}
