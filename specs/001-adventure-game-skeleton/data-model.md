# Data Model - Adventure Game Skeleton

**Feature**: Adventure Game Skeleton
**Date**: 2025-11-24
**Phase**: Design

## Overview

This document defines the data structures and entities for the adventure game skeleton. All entities are client-side only (no persistence, no backend).

## Core Entities

### Player Character

**Purpose**: Represents the player-controlled sprite with movement and interaction capabilities.

**Properties**:
- `x`: number - X coordinate position in pixels
- `y`: number - Y coordinate position in pixels
- `velocityX`: number - Horizontal movement speed (-1, 0, or 1 normalized)
- `velocityY`: number - Vertical movement speed (-1, 0, or 1 normalized)
- `speed`: number - Movement speed multiplier (e.g., 160 pixels/second)
- `interactionRadius`: number - Distance in pixels for interaction detection (60px default)
- `sprite`: Phaser.Physics.Arcade.Sprite - Phaser sprite object reference

**Behaviors**:
- Responds to keyboard input (arrow keys, WASD)
- Moves continuously while keys are pressed
- Stops at wall boundaries (collision)
- Can detect proximity to interactable entities

**State**: Always active (no disabled/hidden states)

---

### Room / Map

**Purpose**: The game environment containing floor, walls, and boundaries.

**Properties**:
- `width`: number - Canvas width in pixels (800)
- `height`: number - Canvas height in pixels (600)
- `walls`: Array<{x, y, width, height}> - Wall boundaries for collision
- `floor`: {x, y, width, height} - Playable floor area

**Walls Configuration**:
```javascript
// Example wall layout (top, right, bottom, left)
walls: [
  { x: 0, y: 0, width: 800, height: 32 },      // Top wall
  { x: 768, y: 0, width: 32, height: 600 },    // Right wall
  { x: 0, y: 568, width: 800, height: 32 },    // Bottom wall
  { x: 0, y: 0, width: 32, height: 600 }       // Left wall
]
```

**Behaviors**:
- Static (no changes during gameplay)
- Provides collision bodies for physics system
- Renders background and wall sprites

**State**: Always rendered (no dynamic visibility)

---

### NPC (Non-Player Character)

**Purpose**: A stationary character the player can interact with for dialog.

**Properties**:
- `x`: number - X coordinate position in pixels
- `y`: number - Y coordinate position in pixels
- `interactionRadius`: number - Distance for interaction (60px)
- `dialogText`: string - Message displayed when interacted with
- `sprite`: Phaser.GameObjects.Sprite - Phaser sprite object reference
- `hasInteracted`: boolean - Tracks if player has talked to NPC (for future use)

**Example Configuration**:
```javascript
{
  x: 400,
  y: 300,
  interactionRadius: 60,
  dialogText: "Hello, traveler! Welcome to this demo world.",
  hasInteracted: false
}
```

**Behaviors**:
- Stationary (no movement)
- Detects player proximity
- Displays dialog box when player presses interaction key while nearby
- Dialog can be dismissed by pressing interaction key again

**State Transitions**:
1. `idle` → Player far away
2. `interactable` → Player within radius
3. `talking` → Dialog box visible

---

### Interactive Object

**Purpose**: A collectible item that provides feedback and changes state when collected.

**Properties**:
- `x`: number - X coordinate position in pixels
- `y`: number - Y coordinate position in pixels
- `interactionRadius`: number - Distance for interaction (60px)
- `message`: string - Message shown when collected ("You found a thing!")
- `isCollected`: boolean - Whether object has been collected
- `sprite`: Phaser.GameObjects.Sprite - Phaser sprite object reference
- `collectedColor`: string - Color/tint when collected (e.g., "#888888")

**Example Configuration**:
```javascript
{
  x: 600,
  y: 200,
  interactionRadius: 60,
  message: "You found a thing!",
  isCollected: false,
  collectedColor: "#888888"  // Gray out when collected
}
```

**Behaviors**:
- Stationary (no movement)
- Detects player proximity
- Shows message when player interacts
- Changes visual appearance after collection
- Can only be collected once

**State Transitions**:
1. `uncollected` → Initial state, normal color
2. `interactable` → Player within radius (visual hint optional)
3. `collected` → Changed color/hidden, no further interactions

---

### Dialog Box

**Purpose**: UI element for displaying NPC dialog or item collection messages.

**Properties**:
- `x`: number - X position (centered, e.g., 100)
- `y`: number - Y position (bottom third, e.g., 420)
- `width`: number - Box width (600)
- `height`: number - Box height (120)
- `text`: string - Current message being displayed
- `isVisible`: boolean - Whether dialog is currently shown
- `background`: Phaser.GameObjects.Rectangle - Box background
- `textObject`: Phaser.GameObjects.Text - Text display

**Styling**:
```javascript
{
  backgroundColor: 0x000000,  // Black
  borderColor: 0xFFFFFF,      // White
  borderThickness: 4,
  textColor: '#FFFFFF',
  fontSize: '18px',
  fontFamily: 'Arial',
  padding: 20
}
```

**Behaviors**:
- Appears when NPC/object interaction triggered
- Displays message text
- Dismissed when player presses interaction key again
- Blocks further interactions while visible (prevents spam)

**State**:
- `hidden` → Default state, no dialog
- `visible` → Showing message, awaiting dismissal

---

## Interaction State Machine

### Proximity Detection

**Trigger**: Every frame in `update()` loop

**Logic**:
```javascript
function checkProximity(player, target) {
  const distance = Phaser.Math.Distance.Between(
    player.x, player.y,
    target.x, target.y
  );
  return distance < target.interactionRadius;
}
```

**Result**: Boolean indicating if player can interact with entity

---

### Interaction Flow

**User Story 1: Movement**
```
Player Input (Arrow/WASD)
→ Update player velocity
→ Physics engine moves sprite
→ Collision check with walls
→ Render at new position
```

**User Story 2: NPC Dialog**
```
Player near NPC (< 60px)
→ Player presses E/Space
→ Create dialog box with NPC.dialogText
→ Set dialogBox.isVisible = true
→ Disable movement/interactions
→ Player presses E/Space again
→ Set dialogBox.isVisible = false
→ Enable movement/interactions
```

**User Story 3: Object Collection**
```
Player near Object (< 60px) AND object.isCollected == false
→ Player presses E/Space
→ Create dialog box with object.message
→ Set object.isCollected = true
→ Change object sprite color/hide sprite
→ Set dialogBox.isVisible = true
→ Player presses E/Space again
→ Set dialogBox.isVisible = false
→ Object remains collected (no further interactions)
```

---

## Configuration Objects

### Phaser Game Config

```javascript
{
  type: Phaser.AUTO,              // WebGL or Canvas
  width: 800,
  height: 600,
  parent: 'game-container',       // HTML element ID
  backgroundColor: '#2d2d2d',     // Dark gray background
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },          // Top-down = no gravity
      debug: false                // Set true for collision boxes
    }
  },
  scene: MainScene                // Primary game scene
}
```

### SVG Asset Registry

**Data Structure**: Map of asset keys to SVG generator functions

```javascript
const svgAssets = {
  'player': createPlayerSvg,      // Blue circle with triangle indicator
  'npc': createNpcSvg,            // Purple square
  'chest': createChestSvg,        // Yellow/gold chest icon
  'wall': createWallSvg,          // Gray rectangle
  'floor': createFloorSvg         // Light gray background
};
```

**Usage in Scene**:
```javascript
preload() {
  Object.entries(svgAssets).forEach(([key, generator]) => {
    const svgString = generator();
    const dataUri = svgToDataUri(svgString);
    this.load.svg(key, dataUri);
  });
}
```

---

## Game State

### Global State (Scene Level)

**Properties**:
```javascript
{
  player: Player,                 // Player entity reference
  npc: NPC,                       // NPC entity reference
  interactiveObject: InteractiveObject,  // Object entity reference
  dialogBox: DialogBox,           // Dialog UI reference
  walls: Array<StaticBody>,       // Wall collision bodies
  cursors: CursorKeys,            // Arrow key input
  wasd: Object,                   // WASD key input
  interactionKey: Key             // E or Space key input
}
```

**Persistence**: None (state resets on page refresh per spec assumptions)

**State Management**: Simple scene properties (no state management library needed)

---

## Data Flow

### Input → State → Render Pipeline

```
1. INPUT PHASE (update() loop)
   - Read keyboard state
   - Calculate player velocity
   - Check proximity to interactables
   - Detect interaction key press

2. STATE UPDATE PHASE
   - Apply velocity to player (physics engine)
   - Resolve collisions with walls
   - Update entity states (isCollected, hasInteracted)
   - Toggle dialog visibility

3. RENDER PHASE (automatic)
   - Phaser renders all sprites at current positions
   - Dialog box shows/hides based on isVisible
   - Object sprite reflects collected state
```

### Frame Timing

- Target: 60 FPS (16.67ms per frame)
- `update()` called every frame
- Physics updates synchronized with render

---

## Edge Case Handling

### Rapid Input

**Issue**: Player presses multiple movement keys simultaneously

**Solution**: Phaser's input system handles this automatically - last processed key takes precedence or velocities combine (diagonal movement)

### Boundary Interactions

**Issue**: Player standing exactly at interaction radius boundary

**Solution**: Use `<` (less than) not `<=` for consistent behavior. Distance 59.9px = interactable, 60.1px = not interactable.

### Simultaneous Interactions

**Issue**: Player near both NPC and object, presses interaction key

**Solution**: Priority system - check NPC first, then object. Only one interaction fires per key press.

```javascript
if (dialogBox.isVisible) {
  // Dismiss dialog
} else if (nearNPC) {
  // Show NPC dialog
} else if (nearObject && !object.isCollected) {
  // Show object message
}
```

### Dialog Spam

**Issue**: Player rapidly presses interaction key

**Solution**: Disable interaction key processing while dialog is visible. Only allow dismiss action.

---

## Visual Asset Specifications

### Player SVG

- **Size**: 32x32 pixels
- **Shape**: Circle (radius 14px) + triangle indicator (8px height)
- **Color**: Blue (#4444FF)
- **Direction Indicator**: Small triangle pointing up (default facing)

### NPC SVG

- **Size**: 32x32 pixels
- **Shape**: Square or circle
- **Color**: Purple (#AA44AA)
- **Distinguishing Feature**: Different shape/color from player

### Interactive Object SVG

- **Size**: 32x32 pixels
- **Shape**: Chest (rectangle with lid) or glowing tile
- **Color**: Gold/Yellow (#FFAA00)
- **Collected State**: Gray (#888888) or 50% opacity

### Wall SVG

- **Size**: 32x32 pixels (tiled)
- **Shape**: Solid rectangle
- **Color**: Dark gray (#666666)

### Floor SVG

- **Size**: 32x32 pixels (tiled) or full background
- **Shape**: Solid rectangle or simple pattern
- **Color**: Light beige (#CCCCBB)

---

## Summary

**Total Entities**: 5 (Player, Room, NPC, Object, DialogBox)
**Total States**: ~10 simple states across all entities
**Complexity**: Low - no nested state machines, no async operations
**Persistence**: None - all state is ephemeral (session-based)

**Constitutional Compliance**:
- ✅ Simplicity First: Flat data structures, no complex relationships
- ✅ Minimal Dependencies: All structures are plain JavaScript objects
- ✅ Standard Patterns: Common game entity pattern (properties + behaviors)

**Next Steps**: Create API contracts for SVG generators and scene methods.
