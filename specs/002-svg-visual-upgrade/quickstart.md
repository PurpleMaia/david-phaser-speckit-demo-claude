# Quick Start Guide: SVG Design System

## For Developers Extending Phase 2 Visuals

This guide helps you quickly add new sprites, props, or character variants using the Phase 2 SVG design system.

---

## Architecture Overview

The SVG design system has 4 layers:

1. **Palette Layer** (`src/svg/palette.js`): Color constants
2. **Shapes Layer** (`src/svg/shapes/`): Reusable geometric helpers
3. **Sprites Layer** (`src/svg/sprites/`): Parametric sprite generators
4. **Loader Layer** (`src/utils/textureLoader.js`): SVG→Phaser texture conversion

**Data Flow**: Palette → Sprite Generator → Texture Loader → Phaser Scene

---

## Common Tasks

### 1. Add a New Character Variant

**Time**: ~2 minutes

**Steps**:

1. **Define colors** in `src/svg/palette.js` (if new colors needed):
   ```javascript
   export const colors = {
     // ... existing colors
     guardArmor: '#C0C0C0',      // Silver armor
     guardArmorDark: '#808080',  // Shadow for armor
   }
   ```

2. **Generate sprite** by calling existing generator with new colors:
   ```javascript
   import { createNpcSvg } from '../svg/sprites/createNpcSvg.js';
   import { colors } from '../svg/palette.js';

   const guardSvg = createNpcSvg({
     bodyColor: colors.guardArmor,
     headColor: colors.playerSkin,        // Reuse existing skin tone
     accessoryColor: colors.guardArmorDark,
     type: 'merchant'  // Or extend type enum if needed
   });
   ```

3. **Load texture** in scene `create()`:
   ```javascript
   import { svgToTexture } from '../utils/textureLoader.js';

   // In MainScene.create()
   svgToTexture(this, 'npc-guard', guardSvg, 32, 32);
   ```

4. **Create sprite**:
   ```javascript
   this.guard = this.add.sprite(500, 300, 'npc-guard');

   // Add idle animation (optional)
   this.tweens.add({
     targets: this.guard,
     y: this.guard.y - 4,
     duration: 1000,
     yoyo: true,
     repeat: -1,
     ease: 'Sine.easeInOut',
   });
   ```

**Result**: New guard NPC with idle animation, matching existing art style

---

### 2. Add a New Decorative Prop

**Time**: ~5 minutes

**Steps**:

1. **Extend** `createPropSvg()` in `src/svg/sprites/createPropSvg.js`:
   ```javascript
   import { colors } from '../palette.js';

   export function createPropSvg({ type = 'plant' } = {}) {
     if (type === 'plant') {
       // Existing plant SVG...
     }
     if (type === 'table') {
       // Existing table SVG...
     }
     if (type === 'rug') {
       // Existing rug SVG...
     }

     // ADD NEW PROP TYPE
     if (type === 'bookshelf') {
       return `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
         <!-- Shelf (3 horizontal lines) -->
         <rect x="4" y="8" width="40" height="4" fill="${colors.potBrown}" />
         <rect x="4" y="20" width="40" height="4" fill="${colors.potBrown}" />
         <rect x="4" y="32" width="40" height="4" fill="${colors.potBrown}" />
         <!-- Books (small colored rectangles) -->
         <rect x="8" y="10" width="6" height="8" fill="${colors.chestBase}" />
         <rect x="16" y="10" width="6" height="8" fill="${colors.npcRobe}" />
         <rect x="24" y="10" width="6" height="8" fill="${colors.playerShirt}" />
       </svg>`;
     }

     // Default fallback
     return createPropSvg({ type: 'plant' });
   }
   ```

2. **Load and place** in scene:
   ```javascript
   // In MainScene.create()
   const bookshelfSvg = createPropSvg({ type: 'bookshelf' });
   svgToTexture(this, 'prop-bookshelf', bookshelfSvg, 48, 48);

   // Place in room (non-blocking, decorative)
   this.add.sprite(200, 150, 'prop-bookshelf').setDepth(1);
   ```

**Result**: New bookshelf prop in room, using palette colors

---

### 3. Modify the Color Palette

**Time**: ~30 seconds + testing

**Steps**:

1. **Edit** `src/svg/palette.js`:
   ```javascript
   export const colors = {
     // ... other colors
     playerShirt: '#5A9FE2',  // Change from #4A90E2 (lighter blue)
     // ... rest of colors
   }
   ```

2. **Hard refresh** browser (Ctrl+Shift+R / Cmd+Shift+R) to clear cached textures

3. **Verify** changes:
   - Player shirt now lighter blue
   - All sprites using `colors.playerShirt` updated automatically
   - Check color contrast still adequate

**Warning**: Ensure total color count remains ≤16. Check shading visibility after color changes.

---

### 4. Change Character Idle Animation

**Time**: ~1 minute

**Steps**:

1. **Locate tween** in `MainScene.create()`:
   ```javascript
   // Existing player idle animation
   this.tweens.add({
     targets: this.player,
     y: this.player.y - 4,  // Current: 4px bob
     duration: 1000,
     yoyo: true,
     repeat: -1,
     ease: 'Sine.easeInOut',
   });
   ```

2. **Modify parameters**:
   ```javascript
   // Change to scale pulsing instead of y-bob
   this.tweens.add({
     targets: this.player,
     scale: 1.05,           // Pulse to 105% size
     duration: 800,         // Faster cycle (0.8s)
     yoyo: true,
     repeat: -1,
     ease: 'Sine.easeInOut',
   });
   ```

   **Or** adjust bob distance:
   ```javascript
   this.tweens.add({
     targets: this.player,
     y: this.player.y - 8,  // Larger bob (8px instead of 4px)
     duration: 1500,        // Slower cycle (1.5s)
     yoyo: true,
     repeat: -1,
     ease: 'Sine.easeInOut',
   });
   ```

**Result**: Character animation updated without changing sprite art

---

### 5. Add a New Floor Tile Variation

**Time**: ~3 minutes

**Steps**:

1. **Add color** to palette (if new color needed):
   ```javascript
   // In src/svg/palette.js
   export const colors = {
     // ... existing colors
     floorAlt3: '#A6895A',  // Even darker floor variant
   }
   ```

2. **Extend** `createFloorTileSvg()` in `src/svg/sprites/createFloorTileSvg.js`:
   ```javascript
   export function createFloorTileSvg({ variant = 0 } = {}) {
     const colors = [
       colors.floorBase,   // variant 0
       colors.floorAlt1,   // variant 1
       colors.floorAlt2,   // variant 2
       colors.floorAlt3,   // variant 3 (NEW)
     ];

     const color = colors[variant] || colors[0];

     // Add unique pattern for variant 3
     if (variant === 3) {
       return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
         <rect width="64" height="64" fill="${color}" />
         <!-- Diagonal lines pattern -->
         <line x1="0" y1="0" x2="64" y2="64" stroke="${colors.floorBase}" stroke-width="2" />
         <line x1="0" y1="32" x2="32" y2="64" stroke="${colors.floorBase}" stroke-width="2" />
         <line x1="32" y1="0" x2="64" y2="32" stroke="${colors.floorBase}" stroke-width="2" />
       </svg>`;
     }

     // ... existing variant 0, 1, 2 logic
   }
   ```

3. **Use new variant** in scene:
   ```javascript
   // In MainScene.create(), floor rendering loop
   const variant = Math.floor(Math.random() * 4);  // Now 0-3 instead of 0-2
   const tileSvg = createFloorTileSvg({ variant });
   svgToTexture(this, `floor-${variant}`, tileSvg, 64, 64);
   this.add.sprite(x, y, `floor-${variant}`).setOrigin(0, 0).setDepth(0);
   ```

**Result**: New floor tile pattern appears randomly in room

---

## Best Practices

### Do's ✅

- **Reuse existing palette colors** before adding new ones (stay under 16 color limit)
- **Test sprites in browser** after each change (hard refresh to clear cache)
- **Keep sprite generators under 50 lines** (constitutional LLM-readability requirement)
- **Use named constants from palette** (`colors.playerShirt` not `'#4A90E2'`)
- **Provide default parameters** for all sprite generator functions
- **Match texture dimensions to SVG viewBox** (32x32 for characters, 64x64 for tiles)
- **Add JSDoc comments** to new sprite generators

### Don'ts ❌

- **Don't hardcode hex colors** in sprite generators (use `colors.*` from palette)
- **Don't exceed 16 total palette colors** (constitutional constraint)
- **Don't use gradients or complex lighting** (constitution mandates simple shading only)
- **Don't create bitmap files** (all art must be code-generated SVGs)
- **Don't add external dependencies** for SVG generation (keep it vanilla JS)
- **Don't generate textures on-demand** during gameplay (load all upfront in `create()`)
- **Don't nest sprite generator functions deeply** (keep flat, readable code)

---

## Troubleshooting

### Problem: Sprite not appearing

**Checklist**:
1. Texture key matches between `svgToTexture()` and `this.add.sprite()` calls
2. SVG string is valid (check browser console for errors)
3. Texture dimensions match SVG viewBox (`width="32"` → `svgToTexture(..., 32, 32)`)
4. Sprite depth set correctly (use `.setDepth(2)` for characters, `1` for props, `0` for tiles)
5. Hard refresh browser to clear cached textures

### Problem: Colors look wrong

**Checklist**:
1. Palette imported correctly: `import { colors } from '../palette.js'`
2. Color names spelled correctly (check for typos like `playerShrit` instead of `playerShirt`)
3. Hard refresh browser after palette changes
4. Check hex values are valid (6 or 8 characters after `#`)

### Problem: Idle animation not working

**Checklist**:
1. Tween added after sprite created (must happen in or after `create()`)
2. `targets` references correct sprite variable
3. Property being animated exists on sprite (`y`, `scale`, `angle`)
4. Animation visible (if bob is 1px, increase to 4-8px for testing)
5. No errors in browser console

### Problem: Performance issues (FPS drops)

**Checklist**:
1. Count total tweens (too many simultaneous tweens can cause lag)
2. Reduce texture sizes if very large (stick to 32x32, 64x64)
3. Profile in browser DevTools → Performance tab
4. Remove complex SVG features (filters, masks) if present
5. Ensure tile sprites reuse textures (don't create duplicate textures)

---

## File Reference

### Core Files
- **Color Palette**: `src/svg/palette.js`
- **Texture Loader**: `src/utils/textureLoader.js`
- **Main Scene**: `src/scenes/MainScene.js`

### Sprite Generators (src/svg/sprites/)
- `createPlayerSvg.js` - Player character
- `createNpcSvg.js` - NPC characters
- `createChestSvg.js` - Interactive chest
- `createFloorTileSvg.js` - Floor tiles (3 variants)
- `createWallTileSvg.js` - Wall tiles (solid, doorway)
- `createPropSvg.js` - Decorative props (plant, table, rug)
- `createDialogPanelSvg.js` - Dialog UI panel

### Shape Helpers (src/svg/shapes/)
- `roundedRect.js` - Rounded rectangle helper
- `circle.js` - Circle helper
- `shadow.js` - Drop-shadow helper

---

## Examples: Real Code Snippets

### Example 1: Create a Red Variant of the Player

```javascript
// In MainScene.create()
import { createPlayerSvg } from '../svg/sprites/createPlayerSvg.js';
import { svgToTexture } from '../utils/textureLoader.js';
import { colors } from '../svg/palette.js';

// Generate red player variant
const redPlayerSvg = createPlayerSvg({
  bodyColor: colors.npcRobe,       // Reuse purple as red substitute
  headColor: colors.playerSkin,
  pantsColor: colors.playerPants,
});

// Load texture
svgToTexture(this, 'player-red', redPlayerSvg, 32, 32);

// Create sprite
this.redPlayer = this.physics.add.sprite(300, 300, 'player-red');

// Add idle animation
this.tweens.add({
  targets: this.redPlayer,
  y: this.redPlayer.y - 4,
  duration: 1000,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
});
```

### Example 2: Add a Carpet Prop

```javascript
// In src/svg/sprites/createPropSvg.js
if (type === 'carpet') {
  return `<svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Base carpet rectangle -->
    <rect x="0" y="0" width="64" height="32" fill="${colors.floorAlt2}" />
    <!-- Fringe (lines on short edges) -->
    <line x1="0" y1="4" x2="0" y2="8" stroke="${colors.floorAlt1}" stroke-width="2" />
    <line x1="4" y1="4" x2="4" y2="8" stroke="${colors.floorAlt1}" stroke-width="2" />
    <line x1="60" y1="4" x2="60" y2="8" stroke="${colors.floorAlt1}" stroke-width="2" />
    <line x1="64" y1="4" x2="64" y2="8" stroke="${colors.floorAlt1}" stroke-width="2" />
  </svg>`;
}

// In MainScene.create()
const carpetSvg = createPropSvg({ type: 'carpet' });
svgToTexture(this, 'prop-carpet', carpetSvg, 64, 32);  // Non-square texture
this.add.sprite(400, 300, 'prop-carpet').setDepth(1);
```

---

## Next Steps

- **Implement tasks**: Follow `tasks.md` (generated by `/speckit.tasks`) for systematic implementation
- **Review contracts**: See `contracts/svg-api.md` for detailed API specifications
- **Check data model**: See `data-model.md` for configuration object structures
- **Validate visually**: Load game after each change, verify sprites match "simple but charming" aesthetic

---

**Questions?** Review the full implementation plan at `specs/002-svg-visual-upgrade/plan.md`
