# Implementation Plan: Phase 2 – Visual Upgrade (SVG only)

**Branch**: `002-svg-visual-upgrade` | **Date**: 2025-11-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-svg-visual-upgrade/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Phase 2 focuses on visual polish while preserving all Phase 1 gameplay mechanics. We will replace placeholder SVG shapes with characterful sprites featuring head+body structure, add environmental variety through tile sets, enhance the interactive chest with shading/glow effects, and upgrade the dialog UI with rounded corners and drop-shadow. All visuals remain code-generated SVGs using a centralized design system with a 10-16 color palette, parametric sprite generators, and simple shading (one darker shade per base color).

**Technical Approach**: Introduce a layered SVG design system with central color palette (`src/svg/palette.js`), reusable shape helpers (`src/svg/shapes/`), and parametric sprite generators (`src/svg/sprites/`). Refine the existing `svgToDataUri` utility into a centralized `svgToTexture` helper that loads all assets at scene startup. Implement idle animations via Phaser tweens (simple y-position bob) or 2-3 frame sprite sheets. Replace assets incrementally: characters → interactive object → tiles → dialog UI.

## Technical Context

**Language/Version**: JavaScript (ES2020+) with ES6 modules
**Primary Dependencies**: Phaser 3 (latest stable), Vite (build tool)
**Storage**: N/A (frontend-only, no persistence)
**Testing**: Optional minimal sanity tests (not required for Phase 2)
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Frontend-only web app (Phaser 3 game)
**Performance Goals**: 60 fps gameplay, load time ≤ 3.5 seconds (≤0.5s increase from Phase 1)
**Constraints**: 10-16 color palette maximum, simple parametric SVG functions (LLM-readable), no external bitmap files
**Scale/Scope**: Single room, 1 player + 1 NPC + 1 interactive object + decorative props, ~5-10 SVG sprite variants

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Review the project constitution at `.specify/memory/constitution.md` and verify compliance:

- [x] **Simplicity First**: Feature maintains simple implementation (parametric functions, no complex animation systems)
- [x] **Minimal Dependencies**: No new dependencies (uses existing Phaser 3 + Vite)
- [x] **Code-Generated SVG Assets**: All visual assets remain code-generated SVGs per constitutional requirement
- [x] **Local-First Execution**: No changes to local-first architecture (frontend-only, no network)
- [x] **Standard Project Structure**: Extends existing `src/` structure with organized `svg/` subdirectories
- [x] **Visual Style Guide (Phase 2)**: Implements constitutional visual constraints (10-16 colors, one darker shade per base, parametric generators, clean silhouettes)

**Violations Requiring Justification**: None

**Constitutional Alignment**: This feature directly implements the Visual Style Guide added to Constitution v1.1.0 under Principle III. All design decisions (color palette, parametric SVG generators, simple shading) are mandated by constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/002-svg-visual-upgrade/
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
│   └── MainScene.js           # Phaser game scene (existing - will be updated to use new textures)
├── svg/
│   ├── palette.js             # NEW: Central color constants (colors.playerSkin, colors.wallDark, etc.)
│   ├── shapes/                # NEW: Reusable shape helpers
│   │   ├── roundedRect.js     # Helper for rounded rectangles (dialog panel, chest lid)
│   │   ├── circle.js          # Helper for circles (character heads, plant foliage)
│   │   └── shadow.js          # Helper for drop-shadow effects (dialog panel, chest glow)
│   ├── sprites/               # NEW: Parametric sprite generators (refactored from root svg/)
│   │   ├── createPlayerSvg.js      # createPlayerSvg({ bodyColor, headColor, emotion })
│   │   ├── createNpcSvg.js         # createNpcSvg({ bodyColor, accessoryColor, type })
│   │   ├── createChestSvg.js       # createChestSvg({ state: 'closed'|'collected', glowColor })
│   │   ├── createFloorTileSvg.js   # createFloorTileSvg({ variant: 0|1|2 })
│   │   ├── createWallTileSvg.js    # createWallTileSvg({ type: 'solid'|'doorway' })
│   │   ├── createPropSvg.js        # createPropSvg({ type: 'plant'|'table'|'rug' })
│   │   └── createDialogPanelSvg.js # createDialogPanelSvg({ width, height })
│   ├── player.js              # EXISTING (will be moved to sprites/ and refactored)
│   ├── npc.js                 # EXISTING (will be moved to sprites/ and refactored)
│   ├── chest.js               # EXISTING (will be moved to sprites/ and refactored)
│   └── wall.js                # EXISTING (will be moved to sprites/ and refactored)
├── utils/
│   ├── svgLoader.js           # EXISTING: svgToDataUri utility (will be enhanced)
│   └── textureLoader.js       # NEW: svgToTexture(scene, key, svgString, width, height) - central asset loader
└── main.js                    # Entry point (existing - no changes needed)

public/                        # Static assets (index.html, etc.)
tests/                         # Optional minimal tests
```

**Structure Decision**: We extend the existing Phase 1 frontend-only structure with a layered SVG design system:
1. **Palette layer** (`svg/palette.js`): Single source of truth for colors
2. **Shapes layer** (`svg/shapes/`): Reusable geometric primitives
3. **Sprites layer** (`svg/sprites/`): Parametric generators that compose shapes + palette
4. **Loader layer** (`utils/textureLoader.js`): Central utility that converts SVG→Phaser textures

This keeps Phase 1's simplicity while organizing visual assets for maintainability and extension.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitutional violations. All changes align with existing principles and the new Visual Style Guide (Constitution v1.1.0).

---

# Phase 0: Research & Technical Decisions

## Research Topics

### 1. SVG Design System Architecture

**Question**: How should we structure parametric SVG generators to balance reusability, simplicity, and LLM-readability?

**Research Needed**:
- Review best practices for parametric SVG generation in JavaScript
- Evaluate color palette management patterns (constants vs. config objects)
- Investigate simple shape helper patterns (pure functions vs. builder patterns)
- Determine optimal parameter structure for character variants (flat object vs. nested config)

### 2. Phaser SVG-to-Texture Pipeline

**Question**: What's the most efficient way to load multiple SVG assets as Phaser textures at scene startup?

**Research Needed**:
- Review Phaser's texture creation API (`textures.addSVG`, data URI loading, etc.)
- Investigate texture caching strategies (preload vs. on-demand)
- Evaluate best practices for SVG data URI conversion
- Determine optimal texture dimensions for pixel-perfect rendering (32x32, 64x64, etc.)

### 3. Idle Animation Approaches

**Question**: Should we use Phaser tweens or sprite frame animation for character idle effects?

**Research Needed**:
- Compare tween-based animation (y-position bob, scale pulse) vs. frame-based animation (2-3 SVG variants)
- Evaluate performance implications of each approach
- Investigate Phaser tween best practices (yoyo effect, easing functions)
- Determine frame rate requirements for smooth idle animation (1-2 second cycles)

### 4. Tile-Based Environment Rendering

**Question**: How should we render tile variations efficiently while maintaining Phase 1's collision system?

**Research Needed**:
- Review Phaser tilemap API (Tilemap vs. manual sprite placement)
- Investigate best practices for decorative props (static sprites vs. tilemap layers)
- Evaluate collision detection approaches for tile-based environments (existing physics bodies vs. tilemap collisions)
- Determine tile size standards (32x32 vs. 64x64) for visual consistency

### 5. Dialog Panel Visual Effects

**Question**: How should we implement rounded corners and drop-shadow effects using simple SVG primitives?

**Research Needed**:
- Review SVG `<rect rx="..." ry="...">` for rounded corners
- Investigate simple shadow techniques (offset rectangle vs. SVG `<filter>` elements)
- Evaluate Phaser's container/graphics API for UI panel rendering
- Determine optimal shadow parameters (offset, color, opacity) for depth perception

---

# Phase 1: Design Artifacts

## Data Model

### Color Palette Entity

**Purpose**: Central color constants for consistent theming across all sprites

**Structure** (`src/svg/palette.js`):
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
- Total distinct colors ≤ 16 (enforced by palette definition)
- Each base color has exactly one darker shade companion
- All colors use hex format for consistency

**Relationships**: Referenced by all sprite generators in `src/svg/sprites/`

---

### SVG Sprite Variants

**Purpose**: Define parameter structures for each parametric sprite generator

#### Player Character Variant
```javascript
{
  bodyColor: colors.playerShirt,     // Base body/shirt color
  headColor: colors.playerSkin,      // Head/skin color
  pantsColor: colors.playerPants,    // Pants color (optional)
  emotion: 'neutral',                // Future: 'happy', 'sad', etc. (Phase 2: use only 'neutral')
}
```

#### NPC Character Variant
```javascript
{
  bodyColor: colors.npcRobe,         // Base body/robe color
  headColor: colors.npcSkin,         // Head/skin color
  accessoryColor: colors.npcRobeDark, // Accessory/trim color
  type: 'merchant',                  // Future: 'merchant', 'wizard', etc. (Phase 2: use only 'merchant')
}
```

#### Chest State
```javascript
{
  state: 'closed',                   // 'closed' | 'collected'
  glowColor: colors.chestGlow,       // Glow effect color
}
```

#### Floor Tile Variant
```javascript
{
  variant: 0,                        // 0 | 1 | 2 (maps to floorBase, floorAlt1, floorAlt2)
}
```

#### Wall Tile Type
```javascript
{
  type: 'solid',                     // 'solid' | 'doorway'
}
```

#### Decorative Prop Type
```javascript
{
  type: 'plant',                     // 'plant' | 'table' | 'rug'
}
```

#### Dialog Panel Dimensions
```javascript
{
  width: 600,                        // Panel width in pixels
  height: 120,                       // Panel height in pixels
}
```

---

### Animation State Entity

**Purpose**: Define animation parameters for idle character animations

**Structure**:
```javascript
{
  type: 'tween',                     // 'tween' | 'frameAnimation'
  tweenConfig: {                     // Used if type === 'tween'
    property: 'y',                   // Property to animate ('y' for bob, 'scale' for pulse)
    from: 0,                         // Start offset
    to: -4,                          // End offset (4px upward for bob)
    duration: 1000,                  // Animation duration in ms (1 second)
    yoyo: true,                      // Return to start position
    repeat: -1,                      // Infinite loop
    ease: 'Sine.easeInOut',          // Easing function for smoothness
  },
  frameConfig: {                     // Used if type === 'frameAnimation'
    frames: ['player-idle-0', 'player-idle-1', 'player-idle-2'], // Texture keys
    frameRate: 2,                    // Frames per second (slow breathing)
    repeat: -1,                      // Infinite loop
  }
}
```

**Decision**: Start with `type: 'tween'` for simplicity (no need to generate multiple SVG frames). Use frame animation only if tween approach proves insufficient.

---

## API Contracts

### SVG Generation API

All sprite generator functions follow this contract:

```javascript
/**
 * Generate SVG string for [sprite type]
 * @param {Object} config - Configuration object with variant parameters
 * @returns {string} Complete SVG markup string
 */
export function create[SpriteName]Svg(config = {}) {
  // Returns: '<svg width="..." height="..." viewBox="..." xmlns="http://www.w3.org/2000/svg">...</svg>'
}
```

**Input**: Configuration object with optional parameters (defaults provided)
**Output**: Complete SVG string ready for data URI conversion
**Side Effects**: None (pure function)
**Error Handling**: Use defaults for missing/invalid parameters (no exceptions thrown)

---

### Shape Helper API

All shape helper functions follow this contract:

```javascript
/**
 * Generate SVG element string for [shape type]
 * @param {Object} params - Shape parameters (dimensions, colors, etc.)
 * @returns {string} SVG element string (not complete SVG document)
 */
export function create[ShapeName](params) {
  // Returns: '<rect x="..." y="..." ... />' or '<circle cx="..." ... />'
}
```

**Input**: Shape-specific parameters (x, y, width, height, fill, etc.)
**Output**: SVG element string (to be composed into larger SVG)
**Side Effects**: None (pure function)
**Error Handling**: Assume valid parameters (called by sprite generators, not directly by scenes)

---

### Texture Loader API

```javascript
/**
 * Convert SVG string to Phaser texture and register it
 * @param {Phaser.Scene} scene - Phaser scene with texture manager
 * @param {string} key - Unique texture key for retrieval
 * @param {string} svgString - Complete SVG markup
 * @param {number} width - Texture width in pixels
 * @param {number} height - Texture height in pixels
 * @returns {void}
 */
export function svgToTexture(scene, key, svgString, width, height) {
  // Side effect: Registers texture in scene.textures
}
```

**Input**: Scene instance, texture key, SVG string, dimensions
**Output**: None (side effect: texture registration)
**Usage**: Call during scene `preload()` or `create()` phase
**Error Handling**: Phaser will throw error if key already exists (caller responsible for unique keys)

---

## Quickstart: Developer Guide

### Adding a New Character Variant

1. **Define colors** in `src/svg/palette.js` (if new colors needed):
   ```javascript
   export const colors = {
     // ... existing colors
     newCharacterBase: '#HEXCODE',
     newCharacterDark: '#HEXCODE',  // Darker shade for shadows
   }
   ```

2. **Call sprite generator** with new color parameters:
   ```javascript
   import { createNpcSvg } from '../svg/sprites/createNpcSvg.js';
   import { colors } from '../svg/palette.js';

   const guardSvg = createNpcSvg({
     bodyColor: colors.newCharacterBase,
     headColor: colors.npcSkin,
     accessoryColor: colors.newCharacterDark,
     type: 'merchant'  // Or extend with new type: 'guard'
   });
   ```

3. **Load texture** in scene:
   ```javascript
   import { svgToTexture } from '../utils/textureLoader.js';

   svgToTexture(this, 'npc-guard', guardSvg, 32, 32);
   ```

4. **Use texture** in sprite creation:
   ```javascript
   this.guard = this.physics.add.sprite(x, y, 'npc-guard');
   ```

**Total time**: ~2 minutes (matches Success Criteria SC-004)

---

### Adding a New Decorative Prop

1. **Extend** `createPropSvg.js` with new prop type:
   ```javascript
   export function createPropSvg({ type = 'plant' } = {}) {
     if (type === 'plant') { /* existing plant SVG */ }
     if (type === 'table') { /* existing table SVG */ }
     if (type === 'newProp') {
       return `<svg>...</svg>`;  // Add new prop SVG here
     }
   }
   ```

2. **Load and place** in scene:
   ```javascript
   const newPropSvg = createPropSvg({ type: 'newProp' });
   svgToTexture(this, 'prop-newProp', newPropSvg, 32, 32);
   this.add.sprite(x, y, 'prop-newProp').setDepth(1);
   ```

---

### Modifying the Color Palette

1. **Edit** `src/svg/palette.js` (ensure ≤16 total colors)
2. **No other changes needed** - all sprites automatically use updated colors
3. **Verify** in browser - hard refresh to clear cached textures

**Warning**: Changing palette requires testing all sprite generators to ensure color contrast remains acceptable.

---

## Implementation Sequence

### Phase 1: SVG Design System Foundation (Tasks 1-5)

1. **Create central color palette** (`src/svg/palette.js`)
   - Define 10-16 colors following Visual Style Guide
   - Each base color + one darker shade
   - Export as named constants

2. **Create shape helper utilities** (`src/svg/shapes/`)
   - `roundedRect.js`: Rounded rectangle helper
   - `circle.js`: Circle helper
   - `shadow.js`: Drop-shadow helper (offset rectangle)

3. **Create texture loader utility** (`src/utils/textureLoader.js`)
   - Implement `svgToTexture(scene, key, svgString, width, height)`
   - Wraps existing `svgToDataUri` utility
   - Handles Phaser texture registration

4. **Refactor existing SVG files** to use palette
   - Update `src/svg/player.js` to import `colors` from `palette.js`
   - Update `src/svg/npc.js` to import `colors` from `palette.js`
   - Update `src/svg/chest.js` to import `colors` from `palette.js`
   - Update `src/svg/wall.js` to import `colors` from `palette.js`

5. **Move and refactor sprite files** to `src/svg/sprites/`
   - Move `player.js` → `sprites/createPlayerSvg.js` and add parameters
   - Move `npc.js` → `sprites/createNpcSvg.js` and add parameters
   - Move `chest.js` → `sprites/createChestSvg.js` and add parameters
   - Move `wall.js` → `sprites/createWallTileSvg.js` and add parameters

**Deliverable**: Organized SVG design system with palette, helpers, and parametric generators

---

### Phase 2: Enhanced Character Sprites (Tasks 6-8)

6. **Upgrade player character sprite**
   - Refactor `createPlayerSvg` to render head + body structure
   - Use `colors.playerSkin`, `colors.playerShirt`, `colors.playerPants`
   - Add shading using darker variants
   - Accept variant parameters: `{ bodyColor, headColor, pantsColor }`

7. **Upgrade NPC sprite**
   - Refactor `createNpcSvg` to render head + body structure
   - Use `colors.npcSkin`, `colors.npcRobe`, `colors.npcRobeDark`
   - Add shading using darker variants
   - Accept variant parameters: `{ bodyColor, headColor, accessoryColor, type }`

8. **Implement character idle animations**
   - Add tween animation in `MainScene.js` for player sprite
   - Animate `y` property: -4px offset, 1s duration, yoyo, infinite repeat
   - Add tween animation for NPC sprite (same parameters)
   - Test animation performance (must maintain 60fps)

**Deliverable**: Characterful player and NPC sprites with idle animations

---

### Phase 3: Environment Tiles & Props (Tasks 9-12)

9. **Create floor tile sprites**
   - Implement `createFloorTileSvg({ variant })` in `src/svg/sprites/`
   - Generate 3 variants using `colors.floorBase`, `colors.floorAlt1`, `colors.floorAlt2`
   - Use simple patterns: solid, checkerboard, stone texture (lines)
   - Tile size: 64x64 pixels

10. **Create wall tile sprites**
    - Implement `createWallTileSvg({ type })` in `src/svg/sprites/`
    - Types: `'solid'` (plain wall) and `'doorway'` (archway)
    - Use `colors.wallBase`, `colors.wallDark`, `colors.doorway`
    - Add shading on edges for depth

11. **Create decorative prop sprites**
    - Implement `createPropSvg({ type })` in `src/svg/sprites/`
    - Types: `'plant'` (green circle foliage + brown pot), `'table'` (rectangle top + legs), `'rug'` (oval with pattern)
    - Use appropriate palette colors for each prop

12. **Update MainScene to render environment**
    - Load floor tile textures (3 variants)
    - Load wall tile textures (solid + doorway)
    - Load prop textures (plant + table or rug)
    - Replace existing floor/wall rendering with tile-based approach
    - Place 1-2 decorative props in room (non-blocking, depth=1)

**Deliverable**: Visually varied environment with tiles and props

---

### Phase 4: Enhanced Interactive Object (Tasks 13-14)

13. **Upgrade chest sprite with shading**
    - Refactor `createChestSvg({ state, glowColor })` with body + lid structure
    - Add shading using `colors.chestDark` on bottom/side edges
    - Maintain `state` parameter: `'closed'` vs `'collected'` (dimmed or hidden)

14. **Add glow effect to chest**
    - Add halo rectangle behind chest (120% scale, `colors.chestGlow` fill, low opacity)
    - OR add outer stroke to chest shape (2-3px, `colors.chestGlow` color)
    - Test glow visibility against different floor tile variants

**Deliverable**: Visually distinct and rewarding chest sprite

---

### Phase 5: Dialog UI Upgrade (Tasks 15-16)

15. **Create dialog panel sprite**
    - Implement `createDialogPanelSvg({ width, height })` in `src/svg/sprites/`
    - Use rounded rectangle helper from `src/svg/shapes/roundedRect.js`
    - Apply `colors.dialogBg` background, `colors.dialogBorder` border
    - Add drop-shadow via offset rectangle helper from `src/svg/shapes/shadow.js`

16. **Update MainScene dialog rendering**
    - Replace existing `createDialogBox()` rectangle with dialog panel texture
    - Load dialog panel SVG as texture during scene `create()`
    - Ensure text remains readable (adjust text position if needed)
    - Verify shadow effect is visible against game background

**Deliverable**: Polished dialog UI with rounded corners and drop-shadow

---

### Phase 6: Testing & Polish (Tasks 17-18)

17. **Visual consistency pass**
    - Verify all sprites use palette colors (no hardcoded hex values outside palette)
    - Check color contrast between player, NPCs, environment (clear distinction)
    - Count total distinct colors (must be ≤16)
    - Test shading visibility (darker shades provide noticeable depth)

18. **Performance & integration testing**
    - Verify game load time ≤3.5 seconds (≤0.5s increase from Phase 1)
    - Verify idle animations run at 60fps without stutter
    - Test all Phase 1 gameplay mechanics (movement, collision, interaction)
    - Ensure collision boundaries unchanged (characters move identically to Phase 1)
    - Verify interactive object behavior identical to Phase 1 (same messages, state changes)

**Deliverable**: Polished, performant visual upgrade with verified Phase 1 parity

---

## Testing Strategy

### Visual Quality Tests (Manual)

1. **Color Palette Compliance**
   - Open `src/svg/palette.js` and count distinct colors (must be ≤16)
   - Visually inspect all sprites to verify palette usage (no stray colors)

2. **Silhouette Clarity**
   - Screenshot game with all entities visible
   - Convert to grayscale - player, NPC, props should remain distinct

3. **Shading Effectiveness**
   - Zoom in on character sprites - darker shades should be visible on body edges
   - Chest shading should suggest depth (bottom/sides darker)

4. **Aesthetic Alignment**
   - Compare game to SNES-era reference (Zelda: Link to the Past, Secret of Mana)
   - Verify "simple but charming" feel (not too plain, not overly detailed)

---

### Performance Tests (Automated)

1. **Load Time Test**
   - Open browser DevTools → Network tab
   - Hard refresh page and measure time to `DOMContentLoaded`
   - Verify ≤3.5 seconds (≤0.5s increase from Phase 1 baseline of ~3s)

2. **Frame Rate Test**
   - Open browser DevTools → Performance tab
   - Record 10 seconds of gameplay (player moving + idle animations running)
   - Analyze FPS graph - should maintain 60fps with no significant drops

3. **Animation Smoothness Test**
   - Observe character idle animation for 10 seconds
   - Verify smooth bob/breathing effect (no jitter or stuttering)
   - Verify animation doesn't interrupt when player starts moving

---

### Functional Regression Tests (Manual)

1. **Movement Test**
   - Use arrow keys and WASD to move character
   - Verify movement speed identical to Phase 1
   - Verify collision detection unchanged (character stops at walls)

2. **Interaction Test**
   - Approach NPC and press interaction key (E or space)
   - Verify dialog appears in new styled panel
   - Verify dialog dismissal works identically to Phase 1
   - Approach chest and interact - verify "You found a thing!" message
   - Verify chest state change behavior identical to Phase 1

3. **Edge Case Tests**
   - Start moving during idle animation - verify smooth transition
   - Stand on boundary between floor tile variants - verify no visual glitches
   - Interact while moving - verify same behavior as Phase 1

---

## Risk Assessment

### High-Impact Risks

1. **Color Palette Constraint Violation**
   - **Risk**: Exceeding 16 color limit during sprite development
   - **Mitigation**: Document color count in `palette.js` comments, validate before PR
   - **Fallback**: Merge similar colors (e.g., reduce prop colors if needed)

2. **Performance Regression**
   - **Risk**: Multiple SVG textures or tween animations cause FPS drops
   - **Mitigation**: Profile early (Task 8), optimize texture sizes if needed
   - **Fallback**: Reduce tile variations or remove idle animations if critical

3. **Visual Inconsistency**
   - **Risk**: Sprites feel mismatched or break "simple but charming" aesthetic
   - **Mitigation**: Review all sprites together before finalizing (Task 17)
   - **Fallback**: Iterate on specific sprites until visual harmony achieved

---

### Medium-Impact Risks

4. **Collision Boundary Changes**
   - **Risk**: Visual updates accidentally modify sprite dimensions or collision physics
   - **Mitigation**: Maintain 32x32 sprite dimensions, test collision explicitly (Task 18)
   - **Fallback**: Revert to Phase 1 collision configuration if issues detected

5. **Dialog Panel Readability**
   - **Risk**: New styled panel reduces text contrast or readability
   - **Mitigation**: Use light background (`colors.dialogBg`) with dark text (`colors.textPrimary`)
   - **Fallback**: Increase border thickness or adjust background opacity

6. **SVG Complexity Creep**
   - **Risk**: Parametric generators become too complex for LLM understanding
   - **Mitigation**: Keep functions under 50 lines, avoid nested conditionals
   - **Fallback**: Simplify sprite designs if generators exceed complexity threshold

---

### Low-Impact Risks

7. **Browser Compatibility**
   - **Risk**: SVG rendering differs across browsers (Chrome vs Firefox vs Safari)
   - **Mitigation**: Test in all major browsers during Task 18
   - **Fallback**: Simplify SVG features if compatibility issues arise

8. **Glow Effect Visibility**
   - **Risk**: Chest glow not visible against certain floor tile variants
   - **Mitigation**: Test glow against all 3 floor variants during Task 14
   - **Fallback**: Increase glow opacity or use outer stroke instead of halo

---

## Open Questions for Task Generation

1. **Idle Animation Implementation**: Should we generate 2-3 SVG frames per character or rely solely on Phaser tweens? (Recommendation: Start with tweens for simplicity, evaluate during Task 8)

2. **Tile Rendering Approach**: Should we use Phaser's Tilemap API or manually place tile sprites? (Recommendation: Manual sprite placement for simplicity, avoid Tilemap complexity)

3. **Decorative Prop Placement**: Should props be placed programmatically (random positions) or hardcoded (fixed positions)? (Recommendation: Hardcoded for Phase 2, evaluate randomization in future phases)

4. **Shadow Implementation**: Should we use SVG `<filter>` elements or simple offset rectangles for drop-shadow effects? (Recommendation: Offset rectangles per constitution preference for LLM clarity)

5. **Color Palette Expansion**: If 16 colors prove insufficient, which sprites should share colors? (Recommendation: Props share environment colors, NPCs share player skin tones)

---

## Constitution Re-Check (Post-Design)

- [x] **Simplicity First**: Design maintains simple parametric functions (≤50 lines each), no complex animation system
- [x] **Minimal Dependencies**: Zero new dependencies added (uses existing Phaser 3 tween API)
- [x] **Code-Generated SVG Assets**: 100% code-generated SVGs (palette + generators + helpers)
- [x] **Local-First Execution**: No changes to local-first architecture
- [x] **Standard Project Structure**: Extends existing structure with clear `svg/` organization
- [x] **Visual Style Guide Compliance**:
  - ✅ 10-16 color palette (defined in `palette.js`)
  - ✅ One darker shade per base color (enforced by palette structure)
  - ✅ Parametric SVG generators (all `create*Svg` functions accept config objects)
  - ✅ Simple shading only (no gradients, no complex lighting)
  - ✅ Clean silhouettes (head+body structure, clear shapes)

**Final Gate Status**: ✅ PASS - Ready for task generation via `/speckit.tasks`

---

## Next Steps

1. Run `/speckit.tasks` to generate actionable task breakdown from this plan
2. Execute tasks sequentially following the 6-phase implementation sequence
3. Validate against Success Criteria from spec.md after each phase
4. Final QA pass using Testing Strategy section before marking feature complete
