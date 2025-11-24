# Contract: MainScene Interface

**Purpose**: Define the contract for the primary game scene implementing all gameplay.

**Location**: `src/scenes/MainScene.js`

**Phaser Base**: Extends `Phaser.Scene`

---

## Scene Lifecycle Contract

### Constructor

```javascript
/**
 * Scene constructor
 * Initializes scene with unique key
 */
constructor() {
  super({ key: 'MainScene' });
}
```

**Requirements**:
- MUST call `super()` with scene key
- MUST use key 'MainScene' for consistency
- NO initialization logic (use `init()` or `create()`)

---

### init()

```javascript
/**
 * Initialize scene data
 * Called before preload()
 * @param {Object} data - Optional data passed from previous scene
 */
init(data) {
  // Initialize scene-level variables
  this.gameState = {
    dialogOpen: false,
    currentInteractable: null
  };
}
```

**Requirements**:
- MUST initialize scene-level state variables
- SHOULD set up configuration constants
- MUST NOT create game objects (use `create()`)

**State Variables**:
- `dialogOpen`: boolean - Whether dialog box is currently visible
- `currentInteractable`: object|null - Reference to NPC or object player can interact with

---

### preload()

```javascript
/**
 * Load all game assets
 * Called after init(), before create()
 */
preload() {
  // Load SVG assets as data URIs
  const assets = {
    'player': createPlayerSvg(),
    'npc': createNpcSvg(),
    'chest': createChestSvg(),
    'wall': createWallSvg()
  };

  Object.entries(assets).forEach(([key, svgString]) => {
    this.load.svg(key, svgToDataUri(svgString));
  });
}
```

**Requirements**:
- MUST load all visual assets before `create()`
- MUST use `svgToDataUri()` for SVG conversion
- MUST load with unique string keys
- MUST NOT create game objects

**Asset Keys**:
- `'player'` - Player character sprite
- `'npc'` - NPC character sprite
- `'chest'` - Interactive object sprite
- `'wall'` - Wall tile sprite

---

### create()

```javascript
/**
 * Create game world and entities
 * Called after preload() completes
 */
create() {
  // 1. Set up physics world
  // 2. Create walls with collision
  // 3. Create player sprite
  // 4. Create NPC sprite
  // 5. Create interactive object sprite
  // 6. Create dialog box (initially hidden)
  // 7. Set up input handlers
  // 8. Configure camera
}
```

**Requirements**:
- MUST create all game entities
- MUST configure physics and collision
- MUST set up input handling
- MUST initialize UI elements (dialog box)

**Detailed Responsibilities**:

1. **Physics World**:
   ```javascript
   this.physics.world.setBounds(0, 0, 800, 600);
   ```

2. **Walls**:
   ```javascript
   this.walls = this.physics.add.staticGroup();
   // Create 4 wall rectangles using 'wall' texture
   // Top, Right, Bottom, Left
   ```

3. **Player**:
   ```javascript
   this.player = this.physics.add.sprite(400, 300, 'player');
   this.player.setCollideWorldBounds(true);
   this.physics.add.collider(this.player, this.walls);
   ```

4. **NPC**:
   ```javascript
   this.npc = this.add.sprite(500, 200, 'npc');
   this.npc.interactionRadius = 60;
   this.npc.dialogText = "Hello, traveler! Welcome to this demo world.";
   ```

5. **Interactive Object**:
   ```javascript
   this.chest = this.add.sprite(200, 400, 'chest');
   this.chest.interactionRadius = 60;
   this.chest.isCollected = false;
   ```

6. **Dialog Box**:
   ```javascript
   this.dialogBox = this.createDialogBox();
   this.dialogBox.setVisible(false);
   ```

7. **Input**:
   ```javascript
   this.cursors = this.input.keyboard.createCursorKeys();
   this.wasd = this.input.keyboard.addKeys('W,A,S,D');
   this.interactKey = this.input.keyboard.addKey('E');
   this.spaceKey = this.input.keyboard.addKey('SPACE');
   ```

---

### update()

```javascript
/**
 * Game loop called every frame (~60 FPS)
 * @param {number} time - Total elapsed time in ms
 * @param {number} delta - Time since last frame in ms
 */
update(time, delta) {
  // 1. Handle player movement input
  // 2. Check proximity to interactables
  // 3. Handle interaction key presses
  // 4. Update game state
}
```

**Requirements**:
- MUST handle continuous input (movement)
- MUST check proximity every frame
- MUST process interaction key events
- MUST be performant (< 16ms execution time for 60 FPS)

**Detailed Responsibilities**:

1. **Movement Input**:
   ```javascript
   if (!this.gameState.dialogOpen) {
     this.player.setVelocity(0);

     if (this.cursors.left.isDown || this.wasd.A.isDown) {
       this.player.setVelocityX(-160);
     } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
       this.player.setVelocityX(160);
     }

     if (this.cursors.up.isDown || this.wasd.W.isDown) {
       this.player.setVelocityY(-160);
     } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
       this.player.setVelocityY(160);
     }
   }
   ```

2. **Proximity Detection**:
   ```javascript
   const nearNPC = this.checkProximity(this.player, this.npc);
   const nearChest = this.checkProximity(this.player, this.chest) && !this.chest.isCollected;

   this.gameState.currentInteractable = nearNPC ? this.npc : (nearChest ? this.chest : null);
   ```

3. **Interaction Handling**:
   ```javascript
   if (Phaser.Input.Keyboard.JustDown(this.interactKey) ||
       Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
     this.handleInteraction();
   }
   ```

---

## Helper Method Contracts

### createDialogBox()

```javascript
/**
 * Creates dialog box UI element
 * @returns {Phaser.GameObjects.Container} Dialog box container
 */
createDialogBox() {
  const container = this.add.container(100, 420);

  const background = this.add.rectangle(0, 0, 600, 120, 0x000000);
  background.setStrokeStyle(4, 0xFFFFFF);
  background.setOrigin(0, 0);

  const text = this.add.text(20, 20, '', {
    fontSize: '18px',
    color: '#FFFFFF',
    wordWrap: { width: 560 }
  });

  container.add([background, text]);
  container.textObject = text;

  return container;
}
```

**Requirements**:
- MUST return Phaser Container
- MUST include background rectangle
- MUST include text object
- MUST be positioned in lower third of screen
- MUST store text reference for updates

---

### checkProximity()

```javascript
/**
 * Check if player is within interaction range of target
 * @param {Phaser.GameObjects.Sprite} player - Player sprite
 * @param {Phaser.GameObjects.Sprite} target - Target entity
 * @returns {boolean} True if within interaction radius
 */
checkProximity(player, target) {
  if (!target || !target.active) return false;

  const distance = Phaser.Math.Distance.Between(
    player.x, player.y,
    target.x, target.y
  );

  return distance < (target.interactionRadius || 60);
}
```

**Requirements**:
- MUST return boolean
- MUST handle null/undefined targets
- MUST use target's `interactionRadius` property
- MUST use Phaser's distance utility

---

### handleInteraction()

```javascript
/**
 * Process interaction key press
 * Shows/hides dialog, triggers collection
 */
handleInteraction() {
  // If dialog open, close it
  if (this.gameState.dialogOpen) {
    this.hideDialog();
    return;
  }

  // If near NPC, show NPC dialog
  if (this.gameState.currentInteractable === this.npc) {
    this.showDialog(this.npc.dialogText);
    return;
  }

  // If near chest and not collected, collect it
  if (this.gameState.currentInteractable === this.chest) {
    this.collectChest();
    return;
  }
}
```

**Requirements**:
- MUST check dialog state first (priority: dismiss dialog)
- MUST check NPC interaction second
- MUST check object interaction third
- MUST prevent multiple simultaneous interactions

---

### showDialog()

```javascript
/**
 * Display dialog box with message
 * @param {string} message - Text to display
 */
showDialog(message) {
  this.dialogBox.textObject.setText(message);
  this.dialogBox.setVisible(true);
  this.gameState.dialogOpen = true;
  this.player.setVelocity(0); // Stop player movement
}
```

**Requirements**:
- MUST set dialog text
- MUST make dialog visible
- MUST update game state
- MUST stop player movement

---

### hideDialog()

```javascript
/**
 * Hide dialog box
 */
hideDialog() {
  this.dialogBox.setVisible(false);
  this.gameState.dialogOpen = false;
}
```

**Requirements**:
- MUST hide dialog
- MUST update game state
- MUST allow player movement to resume

---

### collectChest()

```javascript
/**
 * Collect interactive object
 */
collectChest() {
  this.chest.isCollected = true;
  this.chest.setTint(0x888888); // Gray out
  // OR: this.chest.setVisible(false); // Hide completely

  this.showDialog("You found a thing!");
}
```

**Requirements**:
- MUST mark object as collected
- MUST change visual appearance (tint OR hide)
- MUST show collection message
- MUST prevent re-collection

---

## Scene Configuration Contract

### Phaser Game Config

**File**: `src/main.js`

```javascript
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: MainScene
};

const game = new Phaser.Game(config);
```

**Requirements**:
- MUST set canvas dimensions to 800x600
- MUST use Arcade physics with zero gravity
- MUST reference MainScene as the primary scene
- MUST attach to HTML element with id 'game-container'

---

## State Management Contract

### Scene-Level State

```javascript
this.gameState = {
  dialogOpen: boolean,         // Is dialog currently visible?
  currentInteractable: object  // NPC or chest player can interact with
};
```

**Requirements**:
- MUST be initialized in `init()` or `create()`
- MUST be updated in `update()` loop
- MUST NOT use external state management library

### Entity State

**Player**:
- Position (x, y) - managed by Phaser physics
- Velocity (vx, vy) - managed by Phaser physics

**NPC**:
- `interactionRadius`: number
- `dialogText`: string
- `hasInteracted`: boolean (optional, for future use)

**Chest**:
- `interactionRadius`: number
- `isCollected`: boolean

**Requirements**:
- MUST store state as properties on sprite objects
- MUST NOT use separate state objects (keep it simple)

---

## Performance Contract

### Frame Budget

- Target FPS: 60 (16.67ms per frame)
- `update()` execution: < 5ms
- Render time: < 11ms
- Total frame time: < 16.67ms

### Optimization Requirements

- MUST reuse game objects (no `create()` in `update()`)
- MUST avoid heavy calculations in `update()`
- MUST use Phaser's built-in physics (no custom collision)
- SHOULD disable physics debug in production

---

## Testing Contract

### Manual Test Cases

1. **Movement Test**:
   - Press arrow keys → Player moves
   - Press WASD → Player moves
   - Hit wall → Player stops
   - Release keys → Player stops

2. **NPC Interaction Test**:
   - Move near NPC → (proximity detected)
   - Press E → Dialog appears
   - Press E again → Dialog disappears
   - Move away → Dialog disappears

3. **Chest Interaction Test**:
   - Move near chest → (proximity detected)
   - Press E → "You found a thing!" message
   - Chest changes color/hides
   - Press E again → No response (already collected)

4. **Edge Case Tests**:
   - Rapid key presses → No crashes
   - Multiple simultaneous keys → Diagonal movement
   - Interact at edge of radius → Consistent behavior

---

## Extension Contract

### Adding New Interactables

To add a new NPC or object:

1. In `create()`:
   ```javascript
   this.newNPC = this.add.sprite(x, y, 'npc');
   this.newNPC.interactionRadius = 60;
   this.newNPC.dialogText = "New dialog text";
   ```

2. In `update()` proximity check:
   ```javascript
   const nearNewNPC = this.checkProximity(this.player, this.newNPC);
   ```

3. In `handleInteraction()`:
   ```javascript
   if (this.gameState.currentInteractable === this.newNPC) {
     this.showDialog(this.newNPC.dialogText);
   }
   ```

---

## Constitutional Compliance

✅ **Simplicity First**: Single scene, flat structure, no complex patterns
✅ **Minimal Dependencies**: Only Phaser, no state management libraries
✅ **Standard Patterns**: Phaser scene lifecycle, standard game loop
✅ **Local-First**: All state client-side, no network calls

---

## Summary

**Scene Methods**: 10 (constructor + lifecycle + 6 helpers)
**Complexity**: Low - straightforward game loop pattern
**Testability**: Manual testing sufficient for this scope
**Extensibility**: Easy to add new NPCs/objects following pattern

**Next**: Create quickstart guide for development workflow.
