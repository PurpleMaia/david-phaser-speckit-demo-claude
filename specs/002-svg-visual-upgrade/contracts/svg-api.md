# SVG API Contracts

## Overview

All SVG generation functions follow consistent contracts to ensure predictable behavior, composability, and ease of extension.

---

## Sprite Generator Contract

**All files in `src/svg/sprites/`**

```javascript
/**
 * Generate SVG string for [sprite name]
 * @param {Object} config - Configuration object with variant parameters
 * @param {string} config.[param1] - Description of parameter 1
 * @param {string} config.[param2] - Description of parameter 2
 * @returns {string} Complete SVG markup string
 */
export function create[SpriteName]Svg(config = {}) {
  // Destructure with defaults
  const {
    param1 = defaultValue1,
    param2 = defaultValue2,
  } = config;

  // Return complete SVG document string
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- SVG elements here -->
  </svg>`;
}
```

**Contract Properties**:
- **Pure Function**: No side effects, same input always produces same output
- **Default Parameters**: All config properties have sensible defaults (function callable with no args)
- **Complete SVG**: Returns full `<svg>` document with namespace, not fragments
- **Standard Dimensions**: Character sprites 32x32, tiles 64x64 (document in JSDoc)
- **Palette Usage**: All colors reference `colors` from `palette.js` (no hardcoded hex)

**Example Usage**:
```javascript
import { createPlayerSvg } from '../svg/sprites/createPlayerSvg.js';
import { colors } from '../svg/palette.js';

// Use defaults
const defaultPlayer = createPlayerSvg();

// Override specific colors
const customPlayer = createPlayerSvg({
  bodyColor: colors.playerShirt,
  headColor: colors.playerSkin,
});
```

---

## Shape Helper Contract

**All files in `src/svg/shapes/`**

```javascript
/**
 * Generate SVG element string for [shape name]
 * @param {Object} params - Shape parameters
 * @param {number} params.x - X coordinate
 * @param {number} params.y - Y coordinate
 * @param {number} params.width - Width in pixels
 * @param {number} params.height - Height in pixels
 * @param {string} params.fill - Fill color (hex)
 * @param {string} [params.stroke] - Optional stroke color
 * @param {number} [params.strokeWidth] - Optional stroke width
 * @returns {string} SVG element string (not complete document)
 */
export function create[ShapeName](params) {
  const {
    x, y, width, height, fill,
    stroke = 'none',
    strokeWidth = 0,
  } = params;

  // Return SVG element string (fragment, not document)
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}"
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}
```

**Contract Properties**:
- **Pure Function**: No side effects
- **Required Parameters**: Core dimensions/colors required (no defaults for these)
- **Optional Parameters**: Styling properties (stroke, etc.) have defaults
- **Fragment Output**: Returns element string to be embedded in larger SVG (no `<svg>` wrapper)
- **Composability**: Designed to be concatenated into sprite generator SVGs

**Example Usage**:
```javascript
import { createRoundedRect } from '../svg/shapes/roundedRect.js';
import { createShadow } from '../svg/shapes/shadow.js';
import { colors } from '../svg/palette.js';

export function createDialogPanelSvg({ width = 600, height = 120 } = {}) {
  const shadow = createShadow({ x: 6, y: 6, width, height, opacity: 0.5 });
  const panel = createRoundedRect({
    x: 0, y: 0, width, height,
    fill: colors.dialogBg,
    stroke: colors.dialogBorder,
    strokeWidth: 3,
    rx: 8, ry: 8,
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    ${shadow}
    ${panel}
  </svg>`;
}
```

---

## Texture Loader Contract

**File: `src/utils/textureLoader.js`**

```javascript
/**
 * Convert SVG string to Phaser texture and register it
 * @param {Phaser.Scene} scene - Phaser scene with texture manager
 * @param {string} key - Unique texture key for retrieval (e.g., 'player', 'npc')
 * @param {string} svgString - Complete SVG markup string
 * @param {number} width - Texture width in pixels (must match SVG viewBox width)
 * @param {number} height - Texture height in pixels (must match SVG viewBox height)
 * @returns {void}
 * @throws {Error} If texture key already exists (Phaser error, not custom)
 */
export function svgToTexture(scene, key, svgString, width, height) {
  // Convert SVG to data URI
  const dataUri = svgToDataUri(svgString);

  // Register texture with Phaser (side effect)
  scene.textures.addBase64(key, dataUri);
}
```

**Contract Properties**:
- **Side Effect**: Registers texture in scene's texture manager (not pure)
- **Synchronous**: No async/await, immediate registration
- **Idempotency**: Calling twice with same key will error (Phaser enforcement)
- **Validation**: Assumes valid SVG string and positive dimensions (no input validation)
- **Usage Context**: Call during scene `create()` phase, before sprite creation

**Example Usage**:
```javascript
import { svgToTexture } from '../utils/textureLoader.js';
import { createPlayerSvg } from '../svg/sprites/createPlayerSvg.js';

class MainScene extends Phaser.Scene {
  create() {
    // Generate SVG string
    const playerSvg = createPlayerSvg();

    // Register as Phaser texture
    svgToTexture(this, 'player', playerSvg, 32, 32);

    // Use texture in sprite creation
    this.player = this.physics.add.sprite(400, 300, 'player');
  }
}
```

---

## Color Palette Contract

**File: `src/svg/palette.js`**

```javascript
/**
 * Central color palette for all game sprites
 * @constant {Object} colors
 * @property {string} [colorName] - Hex color code (7 or 9 characters with alpha)
 */
export const colors = {
  // Character colors
  playerSkin: '#FFDBAC',
  playerSkinDark: '#D4A574',  // Darker shade for shadows

  // Environment colors
  floorBase: '#D2B48C',
  floorAlt1: '#C9A57B',

  // ... (max 16 total colors)
};
```

**Contract Properties**:
- **Named Export**: `export const colors` (not default export)
- **Flat Object**: No nesting, all colors at root level
- **Naming Convention**: `[entity][part][variant]` (e.g., `playerSkinDark`, `npcRobe`)
- **Shading Pairs**: Each base color followed by its `Dark` variant (e.g., `playerSkin` + `playerSkinDark`)
- **Format**: Hex strings (`'#RRGGBB'` or `'#RRGGBBAA'` with alpha)
- **Limit**: Maximum 16 distinct colors (enforced by palette definition, counted in comments)

**Usage Pattern**:
```javascript
import { colors } from '../svg/palette.js';

// Use in sprite generator
export function createPlayerSvg() {
  return `<svg>
    <circle cx="16" cy="10" r="6" fill="${colors.playerSkin}" />
    <circle cx="16" cy="12" r="5" fill="${colors.playerSkinDark}" />  <!-- Shadow -->
    <rect x="10" y="16" width="12" height="14" fill="${colors.playerShirt}" />
  </svg>`;
}
```

---

## Error Handling Strategy

### Sprite Generators
- **Invalid config**: Use defaults (no exceptions)
- **Missing color**: Fallback to palette default or visible error color (`'#FF00FF'` magenta)
- **Invalid dimensions**: Clamp to valid range or use standard size

### Shape Helpers
- **Missing required param**: Assume caller (sprite generator) provides valid values (no validation)
- **Invalid values**: Pass through to SVG (browser will handle/ignore)

### Texture Loader
- **Duplicate key**: Phaser throws error (let it propagate, don't catch)
- **Invalid SVG**: Browser will render blank/broken texture (visible during testing)
- **Invalid dimensions**: Phaser may scale/distort (caller responsible for matching SVG viewBox)

**Rationale**: Fail fast during development (errors visible immediately), trust callers in production (sprite generators → shape helpers → palette).

---

## Contract Validation Checklist

Before merging sprite generator code:

- [ ] Function exported with `export function create*Svg(config = {})`
- [ ] All config parameters have defaults (function callable with `create*Svg()`)
- [ ] Returns complete SVG string with `<svg>` wrapper and `xmlns` attribute
- [ ] All colors use `colors.*` from palette (no hardcoded hex except error fallbacks)
- [ ] Function ≤50 lines (constitutional LLM-readability requirement)
- [ ] JSDoc comment with `@param` and `@returns` tags
- [ ] Tested in browser (texture renders correctly)

Before merging shape helper code:

- [ ] Function exported with `export function create*ShapeName(params)`
- [ ] Returns SVG element string (fragment, no `<svg>` wrapper)
- [ ] Required parameters documented with `@param` tags
- [ ] Optional parameters have sensible defaults
- [ ] Composable with other helpers (can concatenate into sprite SVG)

Before merging texture loader changes:

- [ ] `svgToTexture` signature unchanged: `(scene, key, svgString, width, height)`
- [ ] Synchronous execution (no `async`/`await`)
- [ ] Side effect documented in JSDoc
- [ ] Works with all existing sprite generators
