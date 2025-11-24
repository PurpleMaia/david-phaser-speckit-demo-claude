# Data Model: Phase 2 Visual Upgrade

## Overview

This document defines the data structures used in the SVG design system. Note: These are **design-time data models** (configuration objects, color palettes) not runtime game state (which remains unchanged from Phase 1).

---

## Color Palette Entity

**Purpose**: Central color constants for consistent theming across all sprites

**File**: `src/svg/palette.js`

**Structure**:
```javascript
export const colors = {
  // Character colors (player)
  playerSkin: '#FFDBAC',      // Light skin tone
  playerSkinDark: '#D4A574',  // Shadow for player skin
  playerShirt: '#4A90E2',     // Blue shirt
  playerShirtDark: '#2E5A8E', // Shadow for shirt
  playerPants: '#5C4033',     // Brown pants
  playerPantsDark: '#3A2920', // Shadow for pants

  // Character colors (NPC)
  npcSkin: '#FFE4C4',         // Different skin tone
  npcSkinDark: '#D4B896',     // Shadow for NPC skin
  npcRobe: '#9B59B6',         // Purple robe
  npcRobeDark: '#6C3483',     // Shadow for robe

  // Environment colors
  floorBase: '#D2B48C',       // Tan floor base
  floorAlt1: '#C9A57B',       // Slightly darker floor variant
  floorAlt2: '#B8956A',       // Darker floor variant
  wallBase: '#8B7355',        // Brown wall
  wallDark: '#5D4C3A',        // Shadow for wall
  doorway: '#6A5ACD',         // Purple archway

  // Interactive object colors
  chestBase: '#D4AF37',       // Gold chest
  chestDark: '#9B7F2A',       // Shadow for chest
  chestGlow: '#FFD700',       // Glow effect (bright gold)

  // Decorative prop colors
  plantGreen: '#7CB342',      // Plant foliage
  plantGreenDark: '#558B2F',  // Shadow for foliage
  potBrown: '#795548',        // Pot base
  potBrownDark: '#4E342E',    // Shadow for pot

  // UI colors
  dialogBg: '#F5F5DC',        // Beige dialog background
  dialogBorder: '#4A4A4A',    // Dark gray border
  dialogShadow: '#00000080',  // Semi-transparent black shadow
  textPrimary: '#2C2C2C',     // Dark gray text
}
```

**Validation Rules**:
- Total distinct colors ≤ 16 (constitutional constraint)
- Each base color has exactly one darker shade companion (e.g., `playerSkin` + `playerSkinDark`)
- All colors use hex format: `'#RRGGBB'` or `'#RRGGBBAA'` with alpha channel
- Naming convention: `[entity][part][variant]` (e.g., `playerSkinDark`, `npcRobe`)

**Relationships**:
- Referenced by all sprite generators in `src/svg/sprites/`
- Imported as `import { colors } from '../palette.js'`
- Single source of truth for all visual theming

**Color Count**: 24 total entries, but pairs reduce to 12 unique base colors + 12 shadow variants = **24 distinct hex values** (exceeds 16 limit - will need consolidation during implementation)

**Consolidation Strategy** (if needed):
- Share skin tones: `npcSkin` → `playerSkin` (reduce by 2)
- Share shadows: Merge similar dark shades (e.g., `wallDark` + `potBrownDark`)
- Props use environment colors: `potBrown` → `wallBase`

---

## SVG Sprite Configuration Models

### Player Character Variant

**Purpose**: Configuration object passed to `createPlayerSvg(config)`

**Structure**:
```javascript
{
  bodyColor: string,    // Base body/shirt color (default: colors.playerShirt)
  headColor: string,    // Head/skin color (default: colors.playerSkin)
  pantsColor: string,   // Pants color (default: colors.playerPants)
  emotion: string,      // Future: 'neutral' | 'happy' | 'sad' (Phase 2: only 'neutral')
}
```

**Defaults**:
```javascript
{
  bodyColor: colors.playerShirt,
  headColor: colors.playerSkin,
  pantsColor: colors.playerPants,
  emotion: 'neutral',
}
```

**Usage**:
```javascript
const playerSvg = createPlayerSvg({
  bodyColor: colors.playerShirt,
  headColor: colors.playerSkin,
});
```

---

### NPC Character Variant

**Purpose**: Configuration object passed to `createNpcSvg(config)`

**Structure**:
```javascript
{
  bodyColor: string,      // Base body/robe color (default: colors.npcRobe)
  headColor: string,      // Head/skin color (default: colors.npcSkin)
  accessoryColor: string, // Accessory/trim color (default: colors.npcRobeDark)
  type: string,           // Future: 'merchant' | 'wizard' | 'guard' (Phase 2: only 'merchant')
}
```

**Defaults**:
```javascript
{
  bodyColor: colors.npcRobe,
  headColor: colors.npcSkin,
  accessoryColor: colors.npcRobeDark,
  type: 'merchant',
}
```

---

### Chest State Configuration

**Purpose**: Configuration object passed to `createChestSvg(config)`

**Structure**:
```javascript
{
  state: string,      // 'closed' | 'collected' (affects opacity/visibility)
  glowColor: string,  // Glow effect color (default: colors.chestGlow)
}
```

**Defaults**:
```javascript
{
  state: 'closed',
  glowColor: colors.chestGlow,
}
```

**State Behavior**:
- `'closed'`: Full opacity, glow effect active
- `'collected'`: Reduced opacity (50%) or hidden, glow effect removed

---

### Floor Tile Variant

**Purpose**: Configuration object passed to `createFloorTileSvg(config)`

**Structure**:
```javascript
{
  variant: number,  // 0 | 1 | 2 (maps to floorBase, floorAlt1, floorAlt2)
}
```

**Defaults**:
```javascript
{
  variant: 0,  // floorBase
}
```

**Variant Mapping**:
- `0`: `colors.floorBase` (solid tan)
- `1`: `colors.floorAlt1` (checkerboard pattern)
- `2`: `colors.floorAlt2` (stone texture with lines)

---

### Wall Tile Type

**Purpose**: Configuration object passed to `createWallTileSvg(config)`

**Structure**:
```javascript
{
  type: string,  // 'solid' | 'doorway'
}
```

**Defaults**:
```javascript
{
  type: 'solid',
}
```

**Type Behavior**:
- `'solid'`: Plain wall tile with shading on edges
- `'doorway'`: Archway cutout with `colors.doorway` accent

---

### Decorative Prop Type

**Purpose**: Configuration object passed to `createPropSvg(config)`

**Structure**:
```javascript
{
  type: string,  // 'plant' | 'table' | 'rug'
}
```

**Defaults**:
```javascript
{
  type: 'plant',
}
```

**Type Rendering**:
- `'plant'`: Green circle foliage (`colors.plantGreen`) + brown pot (`colors.potBrown`)
- `'table'`: Rectangle top + two leg rectangles (`colors.potBrown`)
- `'rug'`: Oval or rectangle with simple pattern (`colors.floorAlt2`)

---

### Dialog Panel Dimensions

**Purpose**: Configuration object passed to `createDialogPanelSvg(config)`

**Structure**:
```javascript
{
  width: number,   // Panel width in pixels (default: 600)
  height: number,  // Panel height in pixels (default: 120)
}
```

**Defaults**:
```javascript
{
  width: 600,
  height: 120,
}
```

**Fixed Properties** (not configurable):
- Background color: `colors.dialogBg`
- Border color: `colors.dialogBorder`
- Border width: 3px
- Corner radius: 8px (`rx="8" ry="8"`)
- Shadow offset: 6px right, 6px down
- Shadow color: `colors.dialogShadow`

---

## Animation Configuration Model

**Purpose**: Define parameters for character idle animations

**Structure**:
```javascript
{
  type: string,           // 'tween' | 'frameAnimation'
  tweenConfig: {          // Used if type === 'tween'
    property: string,     // 'y' | 'scale' | 'angle'
    from: number,         // Start value (relative to sprite property)
    to: number,           // End value
    duration: number,     // Animation duration in milliseconds
    yoyo: boolean,        // Return to start position
    repeat: number,       // -1 for infinite, or specific count
    ease: string,         // Phaser easing function name
  },
  frameConfig: {          // Used if type === 'frameAnimation'
    frames: string[],     // Array of texture keys
    frameRate: number,    // Frames per second
    repeat: number,       // -1 for infinite
  }
}
```

**Phase 2 Default** (tween-based):
```javascript
{
  type: 'tween',
  tweenConfig: {
    property: 'y',
    from: 0,               // Current y position
    to: -4,                // 4px upward
    duration: 1000,        // 1 second cycle
    yoyo: true,            // Bob up and down
    repeat: -1,            // Infinite
    ease: 'Sine.easeInOut',// Smooth motion
  },
}
```

**Usage in Scene**:
```javascript
// Assuming sprite already created at (x, y)
this.tweens.add({
  targets: this.player,
  y: this.player.y - 4,
  duration: 1000,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
});
```

---

## Texture Registration Model

**Purpose**: Track which textures are registered in Phaser's texture manager

**Structure** (conceptual, not stored):
```javascript
{
  key: string,        // Unique texture identifier (e.g., 'player', 'floor-0')
  svgString: string,  // Complete SVG markup
  width: number,      // Texture width in pixels
  height: number,     // Texture height in pixels
  dataUri: string,    // Computed data URI (internal to textureLoader)
}
```

**Standard Sizes**:
- Character sprites: 32x32
- Tile sprites: 64x64
- Prop sprites: 32x32 or 48x48 (varied)
- Dialog panel: 600x120 (or dynamic based on config)

**Naming Conventions**:
- Characters: `'player'`, `'npc'`
- Interactive objects: `'chest'`, `'chest-collected'`
- Tiles: `'floor-0'`, `'floor-1'`, `'floor-2'`, `'wall-solid'`, `'wall-doorway'`
- Props: `'prop-plant'`, `'prop-table'`, `'prop-rug'`
- UI: `'dialog-panel'`

---

## Relationships Diagram

```
colors (palette.js)
  ↓
  ├─→ createPlayerSvg(config) → SVG string → svgToTexture(..., 'player', ...) → Phaser texture
  ├─→ createNpcSvg(config) → SVG string → svgToTexture(..., 'npc', ...)
  ├─→ createChestSvg(config) → SVG string → svgToTexture(..., 'chest', ...)
  ├─→ createFloorTileSvg(config) → SVG string → svgToTexture(..., 'floor-N', ...)
  ├─→ createWallTileSvg(config) → SVG string → svgToTexture(..., 'wall-*', ...)
  ├─→ createPropSvg(config) → SVG string → svgToTexture(..., 'prop-*', ...)
  └─→ createDialogPanelSvg(config) → SVG string → svgToTexture(..., 'dialog-panel', ...)

Phaser texture manager
  ↓
MainScene.create()
  ├─→ this.player = this.physics.add.sprite(x, y, 'player')
  ├─→ this.npc = this.add.sprite(x, y, 'npc')
  ├─→ this.chest = this.add.sprite(x, y, 'chest')
  ├─→ this.add.sprite(x, y, 'floor-0').setDepth(0)
  └─→ this.dialogPanel = this.add.sprite(x, y, 'dialog-panel')
```

---

## Validation Rules Summary

### Color Palette
- ✅ Maximum 16 distinct colors (constitutional constraint)
- ✅ Each base color paired with darker shade
- ✅ Hex format only (`'#RRGGBB'` or `'#RRGGBBAA'`)
- ✅ Named export: `export const colors = { ... }`

### Sprite Configurations
- ✅ All parameters optional (defaults provided)
- ✅ Color parameters reference `colors.*` from palette
- ✅ State/type parameters use string literals (e.g., `'closed'`, `'merchant'`)
- ✅ Numeric parameters (dimensions) positive integers

### Animation Configurations
- ✅ Duration ≥ 500ms (smooth animations)
- ✅ Offset values reasonable (4px bob, not 100px jump)
- ✅ Easing functions valid Phaser names (`'Sine.easeInOut'`, `'Linear'`, etc.)

### Texture Registration
- ✅ Unique keys (no duplicates)
- ✅ Dimensions match SVG viewBox (32x32, 64x64, etc.)
- ✅ Naming convention followed (`'entity-variant'` format)

---

## Migration from Phase 1

### Existing Data Preserved
- Player position, velocity (no changes)
- NPC position, interaction radius (no changes)
- Chest position, collected state (no changes)
- Wall collision bodies (no changes)
- Dialog state management (no changes)

### New Data Added
- Color palette constants (`colors` object)
- Sprite configuration objects (passed to generators)
- Animation tween configurations (for idle effects)
- Multiple texture keys (instead of single `'player'`, now `'player'`, `'npc'`, `'floor-0'`, etc.)

### Deprecated Data
- Hardcoded hex colors in old `src/svg/player.js`, `npc.js`, etc. (replaced by palette references)

---

## Open Questions

1. **Color Count**: Current palette has 24 entries (exceeds 16 limit). Consolidation plan:
   - Share `npcSkin` → `playerSkin` (reduce by 2)
   - Merge similar shadows: `wallDark` + `potBrownDark` → `shadowDark` (reduce by 1-2)
   - Props use environment colors: `potBrown` → `wallBase`
   - **Target**: 14-16 distinct colors after consolidation

2. **Prop Dimensions**: Should all props be 32x32 or allow varied sizes (48x48 for larger props)?
   - **Recommendation**: Start with 32x32 for consistency, allow 48x48 if visual scale demands

3. **Dialog Panel Texture**: Should dialog panel be pre-generated texture or dynamically created each time?
   - **Recommendation**: Pre-generate single texture at scene startup (600x120), reuse for all dialogs
