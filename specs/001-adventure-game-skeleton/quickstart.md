# Quickstart Guide - Adventure Game Skeleton

**Feature**: Adventure Game Skeleton
**Audience**: Developers extending or modifying the game
**Last Updated**: 2025-11-24

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Development Workflow](#development-workflow)
4. [Project Structure](#project-structure)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Code Editor**: VS Code, Sublime, or any text editor

### Verify Installation

```bash
node --version  # Should show v18.0.0+
npm --version   # Should show v9.0.0+
```

---

## Setup

### 1. Install Dependencies

From the project root:

```bash
npm install
```

**Expected Output**:
```
added 2 packages, and audited 3 packages in 2s
```

**What Gets Installed**:
- `phaser` (~3.80.0) - Game engine
- `vite` (~5.0.0) - Build tool and dev server

### 2. Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Open in Browser

Navigate to `http://localhost:5173/`

**Expected Result**:
- Game loads within 3 seconds
- 800x600 pixel canvas visible
- Player character (blue circle) in center
- Walls visible around edges
- NPC (purple square) visible in room
- Chest (yellow) visible in room

### 4. Verify Functionality

**Movement Test**:
- Press arrow keys or WASD
- Player character should move smoothly
- Character should stop at walls

**NPC Interaction Test**:
- Move player near purple NPC
- Press `E` or `Space`
- Dialog box should appear
- Press `E` or `Space` again to dismiss

**Chest Collection Test**:
- Move player near yellow chest
- Press `E` or `Space`
- "You found a thing!" message appears
- Chest turns gray or disappears
- Pressing `E` again does nothing

---

## Development Workflow

### Hot Reload

Vite provides instant hot module replacement:

1. Edit any file in `src/`
2. Save the file
3. Browser automatically refreshes with changes

**Files Watched**:
- `src/**/*.js` - All JavaScript source files
- `public/index.html` - HTML entry point

### Build for Production

```bash
npm run build
```

**Output**: `dist/` directory with optimized bundle

**Preview Production Build**:
```bash
npm run preview
```

Opens production build at `http://localhost:4173/`

### Development Tips

**Enable Physics Debug**:

Edit `src/main.js`:
```javascript
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 },
    debug: true  // Change to true
  }
}
```

Shows collision boundaries (green boxes) for debugging.

**Console Logging**:

Add debug logs in `src/scenes/MainScene.js`:
```javascript
update() {
  console.log('Player position:', this.player.x, this.player.y);
  // ...
}
```

**Tip**: Remove console.logs before committing (slows down game loop).

---

## Project Structure

```
project-root/
├── src/
│   ├── main.js              # Entry point, Phaser configuration
│   ├── scenes/
│   │   └── MainScene.js     # Primary game scene (all gameplay)
│   ├── svg/
│   │   ├── player.js        # createPlayerSvg() - blue circle
│   │   ├── npc.js           # createNpcSvg() - purple square
│   │   ├── chest.js         # createChestSvg() - yellow chest
│   │   └── wall.js          # createWallSvg() - gray wall
│   └── utils/
│       └── svgLoader.js     # svgToDataUri() utility
├── public/
│   └── index.html           # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite build configuration
├── README.md                # Project overview
└── specs/                   # Design documentation (this guide)
```

### Key Files

**`src/main.js`**:
- Phaser game configuration
- Canvas size (800x600)
- Physics setup
- Scene registration

**`src/scenes/MainScene.js`**:
- `preload()` - Load SVG assets
- `create()` - Initialize game world
- `update()` - Game loop (runs 60 times/second)
- Helper methods for interactions

**`src/svg/*.js`**:
- Functions returning SVG strings
- Called in `MainScene.preload()`
- Modified to change visual appearance

**`public/index.html`**:
- Minimal HTML structure
- Contains `<div id="game-container">`
- Imports `src/main.js`

---

## Common Tasks

### Add a New NPC

**Goal**: Add a second NPC with different dialog

**Steps**:

1. **In `MainScene.create()`** (around line 45):
   ```javascript
   // After existing NPC creation
   this.npc2 = this.add.sprite(300, 450, 'npc');
   this.npc2.interactionRadius = 60;
   this.npc2.dialogText = "Greetings! I am the second NPC.";
   ```

2. **In `MainScene.update()`** proximity check:
   ```javascript
   const nearNPC = this.checkProximity(this.player, this.npc);
   const nearNPC2 = this.checkProximity(this.player, this.npc2);
   const nearChest = this.checkProximity(this.player, this.chest) && !this.chest.isCollected;

   this.gameState.currentInteractable = nearNPC ? this.npc :
                                        nearNPC2 ? this.npc2 :
                                        nearChest ? this.chest : null;
   ```

3. **In `handleInteraction()`**:
   ```javascript
   if (this.gameState.currentInteractable === this.npc ||
       this.gameState.currentInteractable === this.npc2) {
     this.showDialog(this.gameState.currentInteractable.dialogText);
     return;
   }
   ```

4. **Test**: Save, browser auto-refreshes, move to new NPC, press E

---

### Add a New Interactive Object

**Goal**: Add a second chest

**Steps**:

1. **In `MainScene.create()`**:
   ```javascript
   this.chest2 = this.add.sprite(650, 150, 'chest');
   this.chest2.interactionRadius = 60;
   this.chest2.isCollected = false;
   this.chest2.message = "You found another thing!";
   ```

2. **In `MainScene.update()`** proximity check:
   ```javascript
   const nearChest2 = this.checkProximity(this.player, this.chest2) && !this.chest2.isCollected;

   this.gameState.currentInteractable = nearNPC ? this.npc :
                                        nearChest ? this.chest :
                                        nearChest2 ? this.chest2 : null;
   ```

3. **In `collectChest()`, make it generic**:
   ```javascript
   collectObject(obj) {
     obj.isCollected = true;
     obj.setTint(0x888888);
     this.showDialog(obj.message || "You found a thing!");
   }
   ```

4. **In `handleInteraction()`**:
   ```javascript
   if (this.gameState.currentInteractable === this.chest) {
     this.collectObject(this.chest);
     return;
   }
   if (this.gameState.currentInteractable === this.chest2) {
     this.collectObject(this.chest2);
     return;
   }
   ```

---

### Change Player Appearance

**Goal**: Make player character red instead of blue

**Steps**:

1. **Edit `src/svg/player.js`**:
   ```javascript
   export function createPlayerSvg() {
     return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
       <circle cx="16" cy="16" r="14" fill="#FF4444"/>  <!-- Change color -->
       <polygon points="16,4 13,12 19,12" fill="#FFFFFF"/>
     </svg>`;
   }
   ```

2. **Save** - browser auto-refreshes, player is now red

---

### Create a New SVG Asset

**Goal**: Add a new visual asset (e.g., a tree)

**Steps**:

1. **Create `src/svg/tree.js`**:
   ```javascript
   export function createTreeSvg() {
     return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
       <rect x="14" y="20" width="4" height="8" fill="#664422"/>  <!-- Trunk -->
       <circle cx="16" cy="14" r="10" fill="#228822"/>            <!-- Leaves -->
     </svg>`;
   }
   ```

2. **In `MainScene.js`, import**:
   ```javascript
   import { createTreeSvg } from '../svg/tree.js';
   ```

3. **In `preload()`**:
   ```javascript
   const assets = {
     'player': createPlayerSvg(),
     'npc': createNpcSvg(),
     'chest': createChestSvg(),
     'wall': createWallSvg(),
     'tree': createTreeSvg()  // Add new asset
   };
   ```

4. **In `create()`**:
   ```javascript
   this.tree = this.add.sprite(150, 250, 'tree');
   ```

5. **Save and test** - tree appears in game

---

### Adjust Game Speed

**Goal**: Make player move faster/slower

**Steps**:

1. **Edit `MainScene.update()`**:
   ```javascript
   if (this.cursors.left.isDown || this.wasd.A.isDown) {
     this.player.setVelocityX(-200);  // Was -160, now faster
   }
   // ... do same for all directions
   ```

2. **Save** - player now moves at 200 pixels/second

---

### Change Canvas Size

**Goal**: Make game window larger (e.g., 1024x768)

**Steps**:

1. **Edit `src/main.js`**:
   ```javascript
   const config = {
     type: Phaser.AUTO,
     width: 1024,   // Was 800
     height: 768,   // Was 600
     // ...
   };
   ```

2. **Edit `MainScene.create()` wall positions** to match new size

3. **Edit `src/main.js` physics bounds**:
   ```javascript
   this.physics.world.setBounds(0, 0, 1024, 768);
   ```

4. **Save** - game canvas is now larger

---

### Change Interaction Key

**Goal**: Use `F` instead of `E` for interactions

**Steps**:

1. **Edit `MainScene.create()`**:
   ```javascript
   this.interactKey = this.input.keyboard.addKey('F');  // Was 'E'
   ```

2. **Save** - now press `F` to interact

---

## Troubleshooting

### Game Doesn't Load

**Symptom**: Blank screen or "Cannot GET /" error

**Solutions**:
1. Verify dev server is running (`npm run dev`)
2. Check browser console for errors (F12)
3. Ensure `public/index.html` exists
4. Try clearing browser cache (Ctrl+Shift+R)

**Check**:
```bash
# Verify server running
curl http://localhost:5173/
```

---

### Player Passes Through Walls

**Symptom**: Collision detection not working

**Solutions**:
1. Verify physics collider set up:
   ```javascript
   this.physics.add.collider(this.player, this.walls);
   ```
2. Check walls are added to static group:
   ```javascript
   this.walls = this.physics.add.staticGroup();
   ```
3. Enable physics debug to see collision boundaries

---

### SVG Assets Not Appearing

**Symptom**: Sprites invisible or showing placeholder

**Solutions**:
1. Check browser console for load errors
2. Verify SVG function returns valid SVG string:
   ```javascript
   console.log(createPlayerSvg());  // Should show <svg>...</svg>
   ```
3. Verify data URI conversion:
   ```javascript
   console.log(svgToDataUri(createPlayerSvg()));
   ```
4. Check `preload()` is loading asset with correct key

---

### Dialog Box Doesn't Appear

**Symptom**: Press E near NPC, nothing happens

**Solutions**:
1. Check proximity detection:
   ```javascript
   update() {
     const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
     console.log('Distance to NPC:', dist);  // Should be < 60 when near
   }
   ```
2. Verify interaction key handler:
   ```javascript
   if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
     console.log('Interaction key pressed');
   }
   ```
3. Check `dialogBox` initialized in `create()`

---

### Performance Issues

**Symptom**: Game running slow, low FPS

**Solutions**:
1. Remove console.log statements from `update()`
2. Disable physics debug:
   ```javascript
   arcade: { debug: false }
   ```
3. Check browser dev tools Performance tab
4. Reduce number of sprites if many added

---

### Hot Reload Not Working

**Symptom**: Changes don't appear after saving

**Solutions**:
1. Check Vite dev server logs for errors
2. Hard refresh browser (Ctrl+Shift+R)
3. Restart dev server:
   ```bash
   # Stop server (Ctrl+C), then:
   npm run dev
   ```
4. Clear browser cache

---

## Advanced Topics

### Multi-Room Support

To add multiple rooms (future enhancement):

1. Create new Scene class (e.g., `Room2Scene.js`)
2. Load scene in Phaser config:
   ```javascript
   scene: [MainScene, Room2Scene]
   ```
3. Transition between scenes:
   ```javascript
   this.scene.start('Room2Scene');
   ```

**Note**: Multi-room support is outside current scope per spec.

---

### Save/Load State

To persist game state (future enhancement):

1. Use `localStorage` to save state:
   ```javascript
   saveGame() {
     const state = {
       chestCollected: this.chest.isCollected,
       playerX: this.player.x,
       playerY: this.player.y
     };
     localStorage.setItem('gameState', JSON.stringify(state));
   }
   ```

2. Load state in `create()`:
   ```javascript
   const savedState = JSON.parse(localStorage.getItem('gameState'));
   if (savedState) {
     this.player.setPosition(savedState.playerX, savedState.playerY);
     this.chest.isCollected = savedState.chestCollected;
   }
   ```

**Note**: Save/load is outside current scope per spec.

---

## Contributing Guidelines

### Code Style

- Use 2-space indentation
- Use single quotes for strings
- Add comments for non-obvious logic
- Keep functions short (< 30 lines ideal)

### Git Workflow

```bash
git checkout -b feature/my-new-feature
# Make changes
git add .
git commit -m "Add new NPC with quest dialog"
git push origin feature/my-new-feature
```

### Testing Changes

Before committing:
1. Run game and test all three user stories
2. Check browser console for errors
3. Verify no console.log statements left
4. Test movement, NPC interaction, chest collection

---

## Resources

### Official Documentation

- **Phaser 3**: https://photonstorm.github.io/phaser3-docs/
- **Vite**: https://vitejs.dev/guide/
- **MDN SVG Reference**: https://developer.mozilla.org/en-US/docs/Web/SVG

### Example Code

- **Phaser Examples**: https://phaser.io/examples
- **Vite + Phaser Template**: https://github.com/phaserjs/template-vite

### Community

- **Phaser Discord**: https://discord.gg/phaser
- **Phaser Forum**: https://phaser.discourse.group/

---

## Summary

**Key Commands**:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Key Files to Edit**:
- `src/scenes/MainScene.js` - Game logic
- `src/svg/*.js` - Visual assets
- `src/main.js` - Game configuration

**Development Cycle**:
1. Edit file in `src/`
2. Save (browser auto-refreshes)
3. Test in browser
4. Repeat

**Next Steps**:
- Read `data-model.md` for entity structure
- Read `contracts/scene-interface.md` for API details
- Read `plan.md` for implementation roadmap
