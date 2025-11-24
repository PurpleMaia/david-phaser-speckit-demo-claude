# Implementation Plan: Phase 3 – Mobile / Touch Controls

**Branch**: `003-mobile-touch-controls` | **Date**: 2025-11-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-mobile-touch-controls/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Phase 3 adds mobile/touch control support while preserving 100% keyboard functionality. We will implement on-screen D-pad (4 directional buttons) and Action button using SVG-based UI, introduce a unified input abstraction layer to combine keyboard and touch inputs, detect device capabilities to show/hide controls appropriately, and ensure responsive layout for mobile viewports. Desktop keyboard controls remain unchanged and primary.

**Technical Approach**: Introduce a small input abstraction layer (`src/input/PlayerInput.js`) that exposes a unified interface (`getMovementVector()`, `isActionPressed()`) combining keyboard and virtual button inputs. Create a dedicated virtual controls module (`src/ui/VirtualControls.js`) that renders SVG-based touch buttons, hooks Phaser pointer events (pointerdown, pointerup, pointerout), and handles multi-touch via `this.input.addPointer()`. Anchor controls using Phaser's camera/container positioning relative to game dimensions. Add device detection logic (pointer capabilities or viewport width) to show/hide controls. Integrate with existing Phaser Scale Manager for responsive layout.

## Technical Context

**Language/Version**: JavaScript (ES2020+) with ES6 modules
**Primary Dependencies**: Phaser 3 (latest stable), Vite (build tool)
**Storage**: N/A (frontend-only, no persistence)
**Testing**: Optional minimal sanity tests (not required for Phase 3)
**Target Platform**: Modern desktop browsers + modern mobile browsers (Chrome, Firefox, Safari, Edge mobile)
**Project Type**: Frontend-only web app (Phaser 3 game)
**Performance Goals**: 60 fps gameplay with touch controls, touch latency <100ms, load time ≤4 seconds (≤0.5s increase from Phase 2)
**Constraints**: No new dependencies, keyboard controls unchanged, touch buttons ≥48×48px, landscape-first (portrait optional)
**Scale/Scope**: 1 D-pad (4 buttons) + 1 Action button, single input abstraction layer, device detection logic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Review the project constitution at `.specify/memory/constitution.md` and verify compliance:

- [x] **Simplicity First**: Feature uses simple input abstraction (state-based), no complex gesture system
- [x] **Minimal Dependencies**: No new dependencies (uses existing Phaser 3 pointer API + Vite)
- [x] **Code-Generated SVG Assets**: Touch button visuals are code-generated SVGs per constitutional requirement
- [x] **Local-First Execution**: No changes to local-first architecture (frontend-only, no network)
- [x] **Standard Project Structure**: Extends existing `src/` structure with `input/` and `ui/` subdirectories
- [x] **Cross-Platform Playability (Phase 3 - NEW)**: Implements constitutional requirement for keyboard preservation + mobile touch support

**Violations Requiring Justification**: None

**Constitutional Alignment**: This feature directly implements Principle VI: Cross-Platform Playability added in Constitution v1.2.0. All design decisions (keyboard-first, simple touch UI, SVG-based buttons, no fancy effects) are mandated by constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/003-mobile-touch-controls/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality checklist (already completed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── scenes/
│   └── MainScene.js              # Phaser game scene (existing - will integrate PlayerInput and VirtualControls)
├── input/                        # NEW: Input abstraction layer
│   └── PlayerInput.js            # NEW: Unified input interface (keyboard + touch)
├── ui/                           # NEW: UI components
│   └── VirtualControls.js        # NEW: On-screen touch buttons (D-pad + Action button)
├── svg/
│   ├── palette.js                # EXISTING: Color palette (Phase 2)
│   ├── sprites/                  # EXISTING: Sprite generators (Phase 2)
│   │   └── createTouchButtonSvg.js  # NEW: Touch button SVG generator
│   └── ...                       # Other existing SVG modules
├── utils/
│   ├── svgLoader.js              # EXISTING: svgToDataUri utility
│   ├── textureLoader.js          # EXISTING: svgToTexture helper (Phase 2)
│   └── deviceDetector.js         # NEW: Detect touch capability / mobile viewport
└── main.js                       # Entry point (existing - no changes needed)

public/                           # Static assets (index.html, etc.)
tests/                            # Optional minimal tests
```

**Structure Decision**: We extend the existing Phase 1/2 frontend-only structure with two new subdirectories:
1. **Input layer** (`src/input/`): Abstraction that unifies keyboard and touch inputs into a single interface
2. **UI layer** (`src/ui/`): Virtual controls component that manages on-screen buttons

This keeps Phase 1/2's simplicity while cleanly separating input logic from rendering logic. MainScene interacts only with PlayerInput, not directly with keyboard or touch APIs.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitutional violations. All changes align with existing principles and the new Cross-Platform Playability principle (Constitution v1.2.0).

---

# Phase 0: Research & Technical Decisions

## Research Topics

### 1. Phaser Pointer Input API

**Question**: How should we handle touch events in Phaser to support multi-touch (moving + action simultaneously)?

**Research Needed**:
- Review Phaser's pointer input API (`this.input.pointer1`, `this.input.addPointer()`)
- Investigate best practices for handling simultaneous touch inputs (multiple pointers)
- Evaluate `pointerdown`, `pointerup`, `pointerout`, `pointerover` event handling
- Determine how to map pointer events to stateful button state (pressed/released)

### 2. Input Abstraction Architecture

**Question**: What interface should PlayerInput expose to MainScene for unified keyboard + touch control?

**Research Needed**:
- Review input abstraction patterns (state-based vs. event-based)
- Evaluate API design: `getMovementVector()` returning `{ x, y }` vs. separate `isUpPressed()` methods
- Investigate whether to use Phaser's Input Plugin or custom state management
- Determine update frequency (every frame in `update()` vs. event-driven)

### 3. Device Detection Strategy

**Question**: How should we detect whether to show on-screen controls (desktop vs. mobile)?

**Research Needed**:
- Review browser APIs for touch capability detection (`navigator.maxTouchPoints`, `'ontouchstart' in window`)
- Evaluate viewport width detection (`window.innerWidth < 768px` threshold)
- Investigate Phaser's built-in device detection (`this.game.device.input.touch`)
- Determine whether to use config flag for testing (`FORCE_VIRTUAL_CONTROLS = true`)

### 4. Virtual Control Positioning & Anchoring

**Question**: How should we anchor on-screen controls to ensure they remain visible and correctly positioned across different screen sizes?

**Research Needed**:
- Review Phaser's camera and container positioning API
- Investigate `setScrollFactor(0)` for UI elements (HUD-style anchoring)
- Evaluate positioning strategies: absolute pixels vs. relative to game dimensions vs. camera bounds
- Determine margin values for bottom-left and bottom-right anchoring (16-24px)

### 5. Phaser Scale Manager Integration

**Question**: How should virtual controls integrate with the existing Phaser Scale Manager / Vite scaling setup?

**Research Needed**:
- Review current Phaser Scale Manager configuration in `main.js`
- Investigate how scale mode affects UI element positioning (FIT, RESIZE, etc.)
- Evaluate whether controls should be part of the game scene or a separate UI scene
- Determine if canvas CSS scaling requires special handling for touch coordinates

### 6. SVG Button Visual Design

**Question**: What SVG shapes and styles should be used for D-pad and Action button to match Phase 2 visual style?

**Research Needed**:
- Review Phase 2 color palette (`src/svg/palette.js`) for button colors
- Evaluate button shape options: circle vs. rounded square vs. plain square
- Investigate arrow icon designs for directional buttons (triangle, chevron, arrow)
- Determine active state visual feedback (darker color, opacity change, scale change)

---

# Phase 1: Design Artifacts

## Data Model

### PlayerInput State Entity

**Purpose**: Central input state that combines keyboard and virtual button inputs

**Structure** (`src/input/PlayerInput.js` internal state):
```javascript
{
  // Movement state (true = pressed, false = released)
  up: false,
  down: false,
  left: false,
  right: false,

  // Action state
  action: false,
  actionJustPressed: false,  // True for one frame on press (for dialog trigger)

  // Reference to scene and keyboard/virtual sources
  scene: Phaser.Scene,
  keyboard: Phaser.Input.Keyboard,
  virtualControls: VirtualControls | null,
}
```

**Validation Rules**:
- Movement directions are mutually exclusive in keyboard input (Phaser handles this)
- Touch input may have multiple directions pressed (diagonal movement allowed)
- `actionJustPressed` must reset to false after one frame

**Relationships**: Used by MainScene to query current input state every frame

---

### VirtualControls State Entity

**Purpose**: Manages on-screen button state and rendering

**Structure** (`src/ui/VirtualControls.js` internal state):
```javascript
{
  // Button sprites (Phaser.GameObjects.Sprite or Image)
  upButton: Phaser.GameObjects.Sprite,
  downButton: Phaser.GameObjects.Sprite,
  leftButton: Phaser.GameObjects.Sprite,
  rightButton: Phaser.GameObjects.Sprite,
  actionButton: Phaser.GameObjects.Sprite,

  // Button pressed state (true = currently touched)
  upPressed: false,
  downPressed: false,
  leftPressed: false,
  rightPressed: false,
  actionPressed: false,

  // Container for positioning (optional)
  container: Phaser.GameObjects.Container | null,

  // Configuration
  visible: boolean,  // Show/hide based on device detection
  buttonSize: 48,    // Button size in pixels (minimum 48×48)
  margin: 20,        // Margin from screen edges
}
```

**Validation Rules**:
- All buttons must be at least 48×48 pixels
- Buttons must not overlap with gameplay area (centered character region)
- Visible state must match device detection (mobile = visible, desktop = hidden)

**Relationships**: Provides button state to PlayerInput via public API

---

### Touch Button Visual Variant

**Purpose**: Define parameter structure for touch button SVG generator

**Structure** (parameter object for `createTouchButtonSvg`):
```javascript
{
  type: 'direction',              // 'direction' | 'action'
  direction: 'up',                // 'up' | 'down' | 'left' | 'right' (if type === 'direction')
  size: 48,                       // Button size in pixels (width and height)
  baseColor: colors.buttonBase,   // Background color from palette
  iconColor: colors.buttonIcon,   // Arrow/icon color from palette
  state: 'normal',                // 'normal' | 'pressed' (for visual feedback)
}
```

**Example Usage**:
```javascript
// D-pad up button (normal state)
createTouchButtonSvg({ type: 'direction', direction: 'up', size: 48, baseColor: colors.buttonBase, iconColor: colors.buttonIcon, state: 'normal' })

// Action button (pressed state)
createTouchButtonSvg({ type: 'action', size: 48, baseColor: colors.buttonBase, iconColor: colors.buttonIcon, state: 'pressed' })
```

---

### Device Detection Result

**Purpose**: Determine whether on-screen controls should be shown

**Structure** (`src/utils/deviceDetector.js` return value):
```javascript
{
  isTouchDevice: boolean,        // Based on navigator.maxTouchPoints or 'ontouchstart' detection
  isMobileViewport: boolean,     // Based on window.innerWidth < 768px threshold
  shouldShowControls: boolean,   // Logical OR of isTouchDevice and isMobileViewport
}
```

**Decision Logic**:
```javascript
shouldShowControls = isTouchDevice || isMobileViewport || FORCE_VIRTUAL_CONTROLS
```

**Configuration Override**:
```javascript
// For testing on desktop
const FORCE_VIRTUAL_CONTROLS = false;  // Set to true to force show controls
```

---

## API Contracts

### PlayerInput API

```javascript
/**
 * Unified input abstraction for keyboard and touch controls
 */
export class PlayerInput {
  /**
   * Initialize input system
   * @param {Phaser.Scene} scene - Phaser scene instance
   * @param {VirtualControls|null} virtualControls - Optional virtual controls instance
   */
  constructor(scene, virtualControls = null) { }

  /**
   * Update input state (call every frame in scene.update())
   * @returns {void}
   */
  update() { }

  /**
   * Get current movement direction as normalized vector
   * @returns {{ x: number, y: number }} Movement vector (-1 to 1 for each axis)
   */
  getMovementVector() {
    // Returns: { x: 0, y: -1 } for up, { x: 1, y: 0 } for right, etc.
    // Returns: { x: 0, y: 0 } for no movement
    // Supports diagonal: { x: 1, y: -1 } for up-right
  }

  /**
   * Check if action button is currently pressed
   * @returns {boolean} True if action button held down
   */
  isActionPressed() { }

  /**
   * Check if action button was just pressed this frame
   * @returns {boolean} True for one frame on press
   */
  isActionJustPressed() { }
}
```

**Input**: Scene instance, optional VirtualControls instance
**Output**: Movement vector and action state
**Side Effects**: None (read-only queries)
**Error Handling**: Returns zero vector if inputs unavailable

---

### VirtualControls API

```javascript
/**
 * On-screen touch controls (D-pad + Action button)
 */
export class VirtualControls {
  /**
   * Initialize virtual controls
   * @param {Phaser.Scene} scene - Phaser scene instance
   * @param {Object} config - Configuration options
   * @param {boolean} config.visible - Show/hide controls (based on device detection)
   * @param {number} config.buttonSize - Button size in pixels (default: 48)
   * @param {number} config.margin - Margin from screen edges (default: 20)
   */
  constructor(scene, config = {}) { }

  /**
   * Create and position all touch buttons
   * @returns {void}
   */
  create() { }

  /**
   * Get current button press states
   * @returns {{ up: boolean, down: boolean, left: boolean, right: boolean, action: boolean }}
   */
  getButtonStates() { }

  /**
   * Check if action button was just pressed (for dialog trigger)
   * @returns {boolean} True for one frame on press
   */
  isActionJustPressed() { }

  /**
   * Show or hide controls
   * @param {boolean} visible - Show (true) or hide (false)
   * @returns {void}
   */
  setVisible(visible) { }

  /**
   * Destroy all button sprites and cleanup
   * @returns {void}
   */
  destroy() { }
}
```

**Input**: Scene instance, configuration object
**Output**: Button state queries
**Side Effects**: Creates Phaser sprites, registers pointer event listeners
**Error Handling**: Graceful degradation if scene or textures unavailable

---

### Touch Button SVG Generator API

```javascript
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
  // Returns: '<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">...</svg>'
}
```

**Input**: Configuration object with button type, direction, size, colors, state
**Output**: Complete SVG string ready for data URI conversion
**Side Effects**: None (pure function)
**Error Handling**: Use defaults for missing/invalid parameters (no exceptions thrown)

---

### Device Detector API

```javascript
/**
 * Detect device capabilities and viewport size
 * @param {Object} config - Configuration options
 * @param {boolean} config.forceShow - Force show controls for testing (default: false)
 * @returns {{ isTouchDevice: boolean, isMobileViewport: boolean, shouldShowControls: boolean }}
 */
export function detectDevice(config = {}) {
  // Returns device detection result (see Data Model section)
}
```

**Input**: Optional config object with forceShow flag
**Output**: Device detection result object
**Side Effects**: None (read-only browser API queries)
**Error Handling**: Returns safe defaults if browser APIs unavailable

---

## Quickstart: Developer Guide

### Integrating Touch Controls into a Scene

1. **Import required modules**:
   ```javascript
   import { PlayerInput } from '../input/PlayerInput.js';
   import { VirtualControls } from '../ui/VirtualControls.js';
   import { detectDevice } from '../utils/deviceDetector.js';
   ```

2. **Create input system in scene `create()` method**:
   ```javascript
   create() {
     // Detect device and determine if controls should be shown
     const device = detectDevice({ forceShow: false });

     // Create virtual controls (if on mobile)
     this.virtualControls = device.shouldShowControls
       ? new VirtualControls(this, { visible: true, buttonSize: 48, margin: 20 })
       : null;

     // Create unified input system
     this.playerInput = new PlayerInput(this, this.virtualControls);

     // Create virtual control buttons (if applicable)
     if (this.virtualControls) {
       this.virtualControls.create();
     }
   }
   ```

3. **Query input in scene `update()` method**:
   ```javascript
   update(time, delta) {
     // Update input state
     this.playerInput.update();

     // Get movement direction
     const movement = this.playerInput.getMovementVector();

     // Move player based on input
     if (movement.x !== 0 || movement.y !== 0) {
       this.player.setVelocity(movement.x * 100, movement.y * 100);
     } else {
       this.player.setVelocity(0, 0);
     }

     // Check for action press (dialog trigger)
     if (this.playerInput.isActionJustPressed()) {
       // Trigger interaction (NPC dialog, chest collection, etc.)
       this.checkInteractions();
     }
   }
   ```

**Total integration time**: ~5 minutes to replace direct keyboard input with PlayerInput

---

### Testing Virtual Controls on Desktop

1. **Enable force-show mode** in `src/utils/deviceDetector.js`:
   ```javascript
   export function detectDevice(config = {}) {
     const FORCE_VIRTUAL_CONTROLS = true;  // Set to true for testing
     // ... rest of detection logic
   }
   ```

2. **Resize browser window** to mobile width (<768px) to trigger mobile viewport detection

3. **Open browser console** and verify `navigator.maxTouchPoints` is detected correctly

4. **Use Chrome DevTools** device emulation to simulate touch events:
   - Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
   - Select a mobile device preset (e.g., iPhone 12)
   - Click and drag on virtual buttons to test touch input

---

### Adding Custom Button Styles

1. **Update color palette** in `src/svg/palette.js`:
   ```javascript
   export const colors = {
     // ... existing colors
     buttonBase: '#4A5568',        // Button background (gray)
     buttonBaseDark: '#2D3748',    // Pressed state background (darker gray)
     buttonIcon: '#E2E8F0',        // Icon color (light gray)
   }
   ```

2. **Modify button size or margin** in VirtualControls instantiation:
   ```javascript
   this.virtualControls = new VirtualControls(this, {
     visible: true,
     buttonSize: 56,   // Larger buttons (default: 48)
     margin: 24,       // More margin (default: 20)
   });
   ```

3. **Customize button appearance** by editing `src/svg/sprites/createTouchButtonSvg.js`:
   ```javascript
   // Change button shape from circle to rounded square
   // Change arrow style from triangle to chevron
   // Adjust opacity for pressed state
   ```

---

## Implementation Sequence

### Phase 1: Input Abstraction Layer (Tasks 1-3)

1. **Create PlayerInput class skeleton**
   - Implement `src/input/PlayerInput.js` with constructor and empty methods
   - Add keyboard input handling (arrow keys + WASD for movement, spacebar for action)
   - Implement `getMovementVector()` returning normalized vector based on keyboard state
   - Implement `isActionPressed()` and `isActionJustPressed()` for keyboard spacebar
   - Add `update()` method to track `actionJustPressed` state (reset after one frame)

2. **Create device detection utility**
   - Implement `src/utils/deviceDetector.js`
   - Add touch capability detection (`navigator.maxTouchPoints`, `'ontouchstart' in window`)
   - Add mobile viewport detection (`window.innerWidth < 768px`)
   - Add `FORCE_VIRTUAL_CONTROLS` config flag for testing
   - Return structured result: `{ isTouchDevice, isMobileViewport, shouldShowControls }`

3. **Integrate PlayerInput into MainScene**
   - Import `PlayerInput` and `detectDevice` in `MainScene.js`
   - Replace direct keyboard input (`this.cursors`, `this.keys`) with `this.playerInput`
   - Update movement logic to use `this.playerInput.getMovementVector()`
   - Update interaction logic to use `this.playerInput.isActionJustPressed()`
   - Test keyboard controls work identically to Phase 2 (regression test)

**Deliverable**: Keyboard-only input abstraction working identically to Phase 2

---

### Phase 2: Virtual Controls Foundation (Tasks 4-7)

4. **Create touch button color palette**
   - Add button colors to `src/svg/palette.js`:
     - `buttonBase`: Background color (light gray or beige)
     - `buttonBaseDark`: Pressed state background (darker shade)
     - `buttonIcon`: Arrow/icon color (dark gray or black)
   - Ensure button colors fit within existing 10-16 color limit (may reuse existing colors)

5. **Create touch button SVG generator**
   - Implement `src/svg/sprites/createTouchButtonSvg.js`
   - Accept parameters: `{ type, direction, size, baseColor, iconColor, state }`
   - For `type === 'direction'`: Render circle or rounded square with arrow icon
     - Arrow directions: up (▲), down (▼), left (◀), right (▶) as simple triangles
   - For `type === 'action'`: Render circle or rounded square with "A" text or hand icon
   - Implement `state === 'pressed'`: Darker background color or reduced opacity
   - Return complete SVG string ready for texture loading

6. **Create VirtualControls class skeleton**
   - Implement `src/ui/VirtualControls.js` with constructor and empty methods
   - Accept config: `{ visible, buttonSize, margin }`
   - Add properties for button sprites (up, down, left, right, action)
   - Add properties for button pressed state (booleans)
   - Implement `create()` method skeleton (no sprites yet)
   - Implement `getButtonStates()` returning current button state object
   - Implement `setVisible()` to show/hide all button sprites

7. **Load touch button textures**
   - In `VirtualControls.create()`, generate SVGs for all 5 buttons:
     - 4 directional buttons (up, down, left, right)
     - 1 action button
   - Use `svgToTexture()` from `src/utils/textureLoader.js` to load each SVG
   - Generate both normal and pressed state textures (10 textures total)
   - Texture keys: `'button-up'`, `'button-up-pressed'`, etc.

**Deliverable**: Touch button SVG generator and VirtualControls class foundation

---

### Phase 3: Virtual Controls Positioning & Rendering (Tasks 8-10)

8. **Implement D-pad button positioning**
   - In `VirtualControls.create()`, create 4 direction button sprites using loaded textures
   - Position buttons in D-pad layout (cross arrangement) near bottom-left corner:
     - Up button: `x = margin + buttonSize`, `y = gameHeight - margin - buttonSize * 2`
     - Down button: `x = margin + buttonSize`, `y = gameHeight - margin`
     - Left button: `x = margin`, `y = gameHeight - margin - buttonSize`
     - Right button: `x = margin + buttonSize * 2`, `y = gameHeight - margin - buttonSize`
   - Use `setScrollFactor(0)` to anchor buttons to camera (HUD-style)
   - Set button depth to high value (e.g., 1000) to render above gameplay
   - Store button sprites in class properties

9. **Implement Action button positioning**
   - Create action button sprite using loaded texture
   - Position near bottom-right corner:
     - `x = gameWidth - margin - buttonSize`
     - `y = gameHeight - margin - buttonSize`
   - Use `setScrollFactor(0)` and high depth value (same as D-pad)
   - Store button sprite in class property

10. **Implement button visibility toggle**
    - In `VirtualControls.setVisible(visible)`, iterate through all button sprites
    - Call `sprite.setVisible(visible)` for each button
    - Test hiding controls on desktop (visible: false from detectDevice)
    - Test showing controls on mobile or when forced (visible: true)

**Deliverable**: On-screen buttons rendered and positioned correctly

---

### Phase 4: Touch Event Handling (Tasks 11-14)

11. **Add multi-touch pointer support**
    - In `MainScene.create()`, call `this.input.addPointer(4)` to support up to 5 simultaneous touches
    - Verify Phaser creates pointer objects (`this.input.pointer1`, `this.input.pointer2`, etc.)

12. **Implement D-pad touch event handlers**
    - For each direction button sprite, add interactive area:
      - `sprite.setInteractive()`
    - Hook `pointerdown` event: Set corresponding button pressed state to `true`
    - Hook `pointerup` event: Set corresponding button pressed state to `false`
    - Hook `pointerout` event: Set corresponding button pressed state to `false` (handle finger drift)
    - Update button texture to pressed state on pointerdown (e.g., `sprite.setTexture('button-up-pressed')`)
    - Restore button texture to normal state on pointerup/pointerout

13. **Implement Action button touch event handlers**
    - Add interactive area: `this.actionButton.setInteractive()`
    - Hook `pointerdown` event: Set `this.actionPressed = true`, track `actionJustPressed` flag
    - Hook `pointerup` event: Set `this.actionPressed = false`
    - Hook `pointerout` event: Set `this.actionPressed = false`
    - Update button texture to pressed state on pointerdown
    - Restore button texture to normal state on pointerup/pointerout

14. **Integrate virtual button state into PlayerInput**
    - In `PlayerInput.update()`, check if `this.virtualControls` exists
    - If exists, call `this.virtualControls.getButtonStates()` to get touch button states
    - Combine keyboard and virtual button states:
      - Movement: `this.up = keyboardUp || virtualUp` (logical OR)
      - Action: `this.action = keyboardAction || virtualAction` (logical OR)
    - Ensure `actionJustPressed` works for both keyboard and touch (trigger on first press only)

**Deliverable**: Functional touch controls with multi-touch support

---

### Phase 5: Responsive Layout & Integration (Tasks 15-17)

15. **Verify Phaser Scale Manager integration**
    - Check current Scale Manager config in `src/main.js`
    - Verify scale mode (likely `Phaser.Scale.FIT` or `Phaser.Scale.RESIZE`)
    - Test virtual controls on different viewport sizes (desktop, tablet, phone)
    - If controls are mispositioned, adjust positioning logic to use:
      - `this.scale.width` and `this.scale.height` instead of hardcoded game dimensions
      - OR use camera bounds: `this.cameras.main.width` and `this.cameras.main.height`

16. **Implement viewport change handling (optional)**
    - Add window resize listener in `MainScene.create()`:
      - `this.scale.on('resize', this.handleResize, this);`
    - Implement `handleResize(gameSize)` method:
      - Re-detect device with `detectDevice()`
      - Update `this.virtualControls.setVisible()` based on new viewport
      - Reposition buttons if needed (call `this.virtualControls.updatePositions()` if implemented)
    - Test rotating device or resizing browser window (controls remain visible and positioned)

17. **Test responsive layout on multiple devices**
    - Test on desktop browser (keyboard only, controls hidden)
    - Test on desktop browser with forced controls (controls visible, clickable)
    - Test on Chrome DevTools mobile emulation (multiple device sizes)
    - Test on actual mobile device if available (iOS Safari, Android Chrome)
    - Verify controls fit within viewport without scrolling (landscape orientation)
    - Document any portrait orientation limitations in README (if portrait not supported)

**Deliverable**: Responsive layout working across desktop and mobile viewports

---

### Phase 6: Testing, Polish & Documentation (Tasks 18-20)

18. **Regression testing: Keyboard controls**
    - Load game on desktop (controls hidden or de-emphasized)
    - Test all Phase 1 gameplay with keyboard only:
      - Character movement (arrow keys, WASD)
      - NPC dialog interaction (spacebar)
      - Chest interaction (spacebar)
    - Verify movement speed, collision detection, interaction ranges identical to Phase 2
    - Verify no visual changes to game besides hidden/de-emphasized controls

19. **Integration testing: Touch controls**
    - Load game on touch device or mobile emulator
    - Test all Phase 1 gameplay with touch only:
      - Character movement (D-pad buttons)
      - NPC dialog interaction (Action button)
      - Chest interaction (Action button)
    - Test multi-touch: Hold direction button + tap Action button simultaneously
    - Verify touch latency <100ms (controls feel responsive)
    - Verify button size ≥48×48px (measure in browser DevTools)
    - Verify controls fit within viewport without scrolling (landscape)

20. **Update README with mobile controls documentation**
    - Add "Mobile Controls" section to README.md:
      - "The game supports touch controls on mobile devices"
      - "On-screen D-pad (bottom-left) for character movement"
      - "Action button (bottom-right) for interactions"
      - "Landscape orientation recommended (portrait support may be limited)"
      - "Keyboard controls remain fully functional on desktop"
    - Add screenshot or diagram of control layout (optional, if simple to generate)
    - Document any known limitations (e.g., "Portrait mode not yet supported")
    - Add testing instructions: "To test touch controls on desktop, resize window to <768px width or enable DevTools device emulation"

**Deliverable**: Fully tested and documented mobile/touch controls feature

---

## Testing Strategy

### Input Abstraction Tests (Manual)

1. **Keyboard-Only Test (Desktop)**
   - Load game on desktop browser (viewport >768px)
   - Verify on-screen controls are hidden or de-emphasized
   - Use arrow keys to move character in all 4 directions
   - Use WASD keys to move character in all 4 directions
   - Press spacebar near NPC to trigger dialog
   - Press spacebar near chest to trigger interaction
   - Verify behavior identical to Phase 2 (no regression)

2. **Touch-Only Test (Mobile)**
   - Load game on mobile device or DevTools emulation
   - Verify on-screen controls are visible (D-pad + Action button)
   - Tap and hold each direction button (up, down, left, right) individually
   - Verify character moves continuously in pressed direction
   - Release button and verify character stops immediately
   - Tap Action button near NPC to trigger dialog
   - Tap Action button near chest to trigger interaction
   - Verify behavior identical to keyboard controls

3. **Multi-Touch Test**
   - Hold down direction button (e.g., right) with left thumb
   - Tap Action button with right thumb (e.g., to trigger dialog)
   - Verify both inputs work simultaneously (character keeps moving while dialog opens)
   - Test diagonal movement by tapping up + right buttons simultaneously
   - Verify smooth movement in diagonal direction

---

### Visual & Layout Tests (Manual)

4. **Button Size Test**
   - Open browser DevTools → Elements panel
   - Inspect each touch button (D-pad + Action)
   - Measure button dimensions (width × height)
   - Verify each button is at least 48×48 CSS pixels

5. **Viewport Fit Test (Landscape)**
   - Load game on mobile device in landscape orientation
   - Verify game canvas and controls fit within viewport
   - Verify no horizontal scrolling required
   - Verify no vertical scrolling required
   - Verify controls don't cover player, NPCs, or chest (main gameplay area)

6. **Responsive Resize Test**
   - Load game on desktop browser
   - Resize browser window from desktop width (>768px) to mobile width (<768px)
   - Verify controls appear when viewport crosses mobile threshold
   - Resize back to desktop width and verify controls hide again
   - Test on multiple viewport sizes (phone, tablet, desktop)

---

### Device Detection Tests (Automated/Manual)

7. **Touch Capability Detection**
   - Open browser console on touch device (or emulator)
   - Check `navigator.maxTouchPoints` value (should be >0 on touch devices)
   - Verify `detectDevice().isTouchDevice === true` on touch devices
   - Verify `detectDevice().isTouchDevice === false` on desktop without touch

8. **Mobile Viewport Detection**
   - Load game on desktop and resize window to 767px width (just below threshold)
   - Verify `detectDevice().isMobileViewport === true`
   - Resize to 768px width and verify `detectDevice().isMobileViewport === false`

9. **Force Show Controls Test (Desktop Testing)**
   - Set `FORCE_VIRTUAL_CONTROLS = true` in `src/utils/deviceDetector.js`
   - Load game on desktop browser (>768px viewport, no touch)
   - Verify on-screen controls are visible
   - Click on direction buttons with mouse and verify character moves
   - Click on Action button and verify interactions trigger

---

### Performance Tests (Manual/Automated)

10. **Touch Latency Test**
    - Load game on mobile device
    - Tap direction button and observe character response time
    - Verify character starts moving within 100ms of tap (feel responsive)
    - Tap Action button and observe dialog/interaction response time
    - Verify interaction triggers within 100ms of tap

11. **Frame Rate Test (with Touch Controls)**
    - Open browser DevTools → Performance tab (if available on mobile)
    - OR observe visual smoothness manually
    - Move character continuously while idle animations play
    - Verify 60fps gameplay (smooth movement and animations)
    - Verify no frame drops or stuttering

12. **Load Time Test**
    - Open browser DevTools → Network tab
    - Hard refresh page and measure time to `DOMContentLoaded`
    - Verify ≤4 seconds (≤0.5s increase from Phase 2 baseline of ~3.5s)

---

## Risk Assessment

### High-Impact Risks

1. **Multi-Touch Conflicts**
   - **Risk**: Multiple simultaneous touches cause input conflicts or dropped events
   - **Mitigation**: Add `this.input.addPointer(4)` early (Task 11), test multi-touch explicitly (Task 19)
   - **Fallback**: Limit to single-touch if conflicts persist (disable multi-touch, require sequential input)

2. **Keyboard Control Regression**
   - **Risk**: Input abstraction layer breaks or degrades keyboard controls
   - **Mitigation**: Implement keyboard-only PlayerInput first (Task 1-3), test regression before adding touch (Task 18)
   - **Fallback**: Revert to direct keyboard input in MainScene if abstraction causes issues

3. **Touch Coordinate Mapping Issues**
   - **Risk**: Phaser Scale Manager scaling causes touch coordinates to misalign with button positions
   - **Mitigation**: Test on multiple viewports early (Task 15), use Phaser's built-in pointer coordinate system
   - **Fallback**: Adjust button positioning to use absolute coordinates or separate UI scene

---

### Medium-Impact Risks

4. **Device Detection False Positives/Negatives**
   - **Risk**: Desktop detected as mobile (shows unwanted controls) or mobile detected as desktop (hides needed controls)
   - **Mitigation**: Use multiple detection signals (touch capability + viewport width), provide `FORCE_VIRTUAL_CONTROLS` override (Task 2)
   - **Fallback**: Add manual toggle in game UI (not in Phase 3 scope, defer to future)

5. **Button Overlap with Gameplay Area**
   - **Risk**: Touch buttons cover important gameplay elements (player, NPCs, chest)
   - **Mitigation**: Position buttons in corners with sufficient margin (Task 8-9), test visibility during gameplay (Task 19)
   - **Fallback**: Reduce button size or increase transparency (adjust opacity to 0.7-0.8)

6. **Portrait Orientation Layout Issues**
   - **Risk**: Controls don't fit or overlap gameplay area in portrait orientation
   - **Mitigation**: Document landscape-first approach in spec, defer portrait support (Task 20)
   - **Fallback**: Hide controls or show warning message in portrait mode (not in Phase 3 scope)

---

### Low-Impact Risks

7. **Button Visual Inconsistency**
   - **Risk**: Touch button style doesn't match Phase 2 visual aesthetic
   - **Mitigation**: Use Phase 2 color palette and simple shapes (Task 4-5), visual review during Task 18
   - **Fallback**: Iterate on button SVG design until style matches (adjust colors, shapes, strokes)

8. **Touch Event Performance**
   - **Risk**: High-frequency touch events cause performance degradation
   - **Mitigation**: Use Phaser's pointer system (optimized), profile performance during Task 11
   - **Fallback**: Throttle touch event handlers or reduce button texture complexity

9. **README Documentation Gaps**
   - **Risk**: Users don't know how to use touch controls or test on desktop
   - **Mitigation**: Write clear, concise mobile controls section (Task 20)
   - **Fallback**: Add in-game tutorial or tooltip (not in Phase 3 scope, defer to future)

---

## Open Questions for Task Generation

1. **Button Layout**: Should D-pad buttons be in strict cross arrangement or flexible grid layout? (Recommendation: Strict cross for consistency with mobile game conventions)

2. **Action Button Icon**: Should we use letter "A", hand icon, or speech bubble icon? (Recommendation: Letter "A" for simplicity and clarity)

3. **Button Pressed State**: Should pressed state use darker color, reduced opacity, or scale animation? (Recommendation: Darker color for simplicity, avoid scale animation per Simplicity First principle)

4. **Portrait Orientation**: Should we block portrait mode with a warning or attempt to support it? (Recommendation: Defer portrait support to future phase, document limitation in README)

5. **Virtual Controls Visibility on Desktop**: Should controls be completely hidden or just de-emphasized (low opacity)? (Recommendation: Completely hidden to avoid clutter, provide `FORCE_VIRTUAL_CONTROLS` for testing)

6. **Touch Button Colors**: Should buttons reuse existing palette colors or add new button-specific colors? (Recommendation: Reuse existing colors if possible to stay within 16-color limit, add new colors only if contrast insufficient)

---

## Constitution Re-Check (Post-Design)

- [x] **Simplicity First**: Design uses simple state-based input abstraction (no complex gesture system), simple SVG buttons (no fancy effects)
- [x] **Minimal Dependencies**: Zero new dependencies added (uses existing Phaser 3 pointer API)
- [x] **Code-Generated SVG Assets**: Touch buttons are 100% code-generated SVGs (createTouchButtonSvg generator)
- [x] **Local-First Execution**: No changes to local-first architecture (frontend-only, no network)
- [x] **Standard Project Structure**: Extends existing structure with organized `input/` and `ui/` subdirectories
- [x] **Cross-Platform Playability Compliance**:
  - ✅ Keyboard controls remain primary and unchanged (regression testing enforced)
  - ✅ Touch controls added as additional input method (not replacement)
  - ✅ On-screen controls are visually simple SVGs (consistent with Phase 2 style)
  - ✅ Controls avoid covering gameplay area (positioned in corners with margin)
  - ✅ Design prefers clarity and reliability (no fancy effects, simple shapes)
  - ✅ Both desktop and mobile remain usable (keyboard preserved, touch added)

**Final Gate Status**: ✅ PASS - Ready for task generation via `/speckit.tasks`

---

## Next Steps

1. Run `/speckit.tasks` to generate actionable task breakdown from this plan
2. Execute tasks sequentially following the 6-phase implementation sequence
3. Validate against Success Criteria from spec.md after each phase
4. Final QA pass using Testing Strategy section before marking feature complete
