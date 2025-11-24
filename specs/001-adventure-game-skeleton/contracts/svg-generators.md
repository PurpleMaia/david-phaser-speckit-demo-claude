# Contract: SVG Generator Functions

**Purpose**: Define the interface for code-generated SVG asset functions.

**Location**: `src/svg/*.js`

**Constitutional Requirement**: All visual assets MUST be code-generated SVGs (no bitmap files).

---

## Contract Interface

### Function Signature

```javascript
/**
 * Generates an SVG string for a game asset
 * @returns {string} Complete SVG markup including <svg> tags
 */
function createAssetSvg(): string
```

### Requirements

1. **Return Type**: MUST return a complete SVG string starting with `<svg>` tag
2. **Self-Contained**: SVG MUST include width, height, and viewBox attributes
3. **Encoding Safe**: SVG MUST use double quotes for attributes (for data URI encoding)
4. **No External Dependencies**: No references to external files or URLs
5. **Inline Styles Only**: Use `fill`, `stroke` attributes or inline `style`, no CSS classes

---

## Contracts

### `createPlayerSvg()`

**File**: `src/svg/player.js`

**Purpose**: Generate player character sprite

**Contract**:
```javascript
/**
 * Creates SVG for player character
 * - Blue circle (radius 14px)
 * - Triangle direction indicator pointing up
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createPlayerSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Implementation goes here -->
  </svg>`;
}
```

**Visual Specification**:
- **Base Shape**: Circle centered at (16, 16), radius 14px
- **Color**: Blue (#4444FF)
- **Direction Indicator**: Triangle pointing upward, 8px height, 6px base width
- **Indicator Position**: Centered horizontally, touching top of circle

**Example Implementation**:
```javascript
export function createPlayerSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#4444FF"/>
    <polygon points="16,4 13,12 19,12" fill="#FFFFFF"/>
  </svg>`;
}
```

---

### `createNpcSvg()`

**File**: `src/svg/npc.js`

**Purpose**: Generate NPC character sprite

**Contract**:
```javascript
/**
 * Creates SVG for NPC character
 * - Purple square or circle (distinct from player)
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createNpcSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Implementation goes here -->
  </svg>`;
}
```

**Visual Specification**:
- **Base Shape**: Square 28x28 pixels OR circle radius 14px
- **Color**: Purple (#AA44AA)
- **Position**: Centered at (16, 16)
- **Distinguishing Feature**: Different shape or additional element (e.g., small square "face")

**Example Implementation**:
```javascript
export function createNpcSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" fill="#AA44AA" rx="2"/>
    <circle cx="16" cy="16" r="4" fill="#FFFFFF"/>
  </svg>`;
}
```

---

### `createChestSvg()`

**File**: `src/svg/chest.js`

**Purpose**: Generate interactive object (chest) sprite

**Contract**:
```javascript
/**
 * Creates SVG for interactive chest object
 * - Gold/yellow colored chest icon
 * - Simple geometric representation
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createChestSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Implementation goes here -->
  </svg>`;
}
```

**Visual Specification**:
- **Base Color**: Gold (#FFAA00)
- **Shape**: Rectangle (chest body) + smaller rectangle (lid)
- **Size**: Approximately 24x20 pixels total
- **Details**: Simple lock or handle optional
- **Style**: Flat, no gradients

**Example Implementation**:
```javascript
export function createChestSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="20" height="14" fill="#FFAA00" stroke="#886600" stroke-width="1"/>
    <rect x="6" y="10" width="20" height="6" fill="#FFCC44" stroke="#886600" stroke-width="1" rx="2"/>
    <circle cx="16" cy="17" r="2" fill="#886600"/>
  </svg>`;
}
```

---

### `createWallSvg()`

**File**: `src/svg/wall.js`

**Purpose**: Generate wall tile sprite

**Contract**:
```javascript
/**
 * Creates SVG for wall tiles
 * - Dark gray solid rectangle
 * - Tileable pattern
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createWallSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Implementation goes here -->
  </svg>`;
}
```

**Visual Specification**:
- **Color**: Dark gray (#666666)
- **Shape**: Solid rectangle filling canvas
- **Border**: Optional slightly darker border for definition
- **Pattern**: Simple brick or stone pattern optional

**Example Implementation**:
```javascript
export function createWallSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="32" height="32" fill="#666666"/>
    <rect x="0" y="0" width="32" height="32" fill="none" stroke="#444444" stroke-width="1"/>
  </svg>`;
}
```

---

### `createFloorSvg()`

**File**: `src/svg/floor.js`

**Purpose**: Generate floor tile sprite (or use solid background color)

**Contract**:
```javascript
/**
 * Creates SVG for floor tiles
 * - Light neutral color
 * - Tileable pattern
 * - 32x32 pixel canvas
 * @returns {string} SVG markup
 */
export function createFloorSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Implementation goes here -->
  </svg>`;
}
```

**Visual Specification**:
- **Color**: Light beige (#CCCCBB)
- **Shape**: Solid rectangle OR simple pattern
- **Pattern**: Optional subtle variation (different shades, simple lines)

**Example Implementation**:
```javascript
export function createFloorSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="32" height="32" fill="#CCCCBB"/>
  </svg>`;
}
```

**Note**: Floor may be implemented as simple `backgroundColor` in Phaser config instead of sprite if simpler.

---

## Usage Contract

### Integration with Phaser

**Utility Function**: `src/utils/svgLoader.js`

```javascript
/**
 * Converts SVG string to data URI for Phaser loading
 * @param {string} svgString - Complete SVG markup
 * @returns {string} Data URI string
 */
export function svgToDataUri(svgString) {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
}
```

**Usage in MainScene.preload()**:
```javascript
import { createPlayerSvg } from '../svg/player.js';
import { createNpcSvg } from '../svg/npc.js';
import { createChestSvg } from '../svg/chest.js';
import { createWallSvg } from '../svg/wall.js';
import { svgToDataUri } from '../utils/svgLoader.js';

preload() {
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

---

## Testing Contract

### Manual Verification

Each SVG function MUST be verifiable by:

1. **Browser Test**:
   ```html
   <div id="test"></div>
   <script>
     document.getElementById('test').innerHTML = createPlayerSvg();
   </script>
   ```
   Expected: SVG renders as 32x32 pixel graphic

2. **Data URI Test**:
   ```javascript
   const uri = svgToDataUri(createPlayerSvg());
   console.log(uri); // Should start with "data:image/svg+xml..."
   ```

3. **Phaser Integration Test**:
   - Load SVG in scene
   - Create sprite from texture
   - Verify sprite displays correctly at 32x32 pixels

### Visual Validation Checklist

For each asset:
- [ ] Renders at correct size (32x32 pixels)
- [ ] Uses specified colors
- [ ] Visually distinct from other assets
- [ ] Looks acceptable at game scale (tiny but recognizable)
- [ ] No rendering errors or missing elements

---

## Extension Contract

### Adding New Assets

To add a new SVG asset:

1. Create new file in `src/svg/`:
   ```javascript
   // src/svg/newAsset.js
   export function createNewAssetSvg() {
     return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
       <!-- Your SVG markup -->
     </svg>`;
   }
   ```

2. Import and load in `MainScene.preload()`:
   ```javascript
   import { createNewAssetSvg } from '../svg/newAsset.js';
   // ...
   this.load.svg('newAsset', svgToDataUri(createNewAssetSvg()));
   ```

3. Use in scene:
   ```javascript
   this.add.sprite(x, y, 'newAsset');
   ```

---

## Constitutional Compliance

✅ **Code-Generated SVG Assets**: All assets are JavaScript functions returning SVG strings
✅ **No Bitmap Files**: Zero .png, .jpg, or .gif files in repository
✅ **Simplicity First**: Each function is ~10 lines, no complex logic
✅ **Minimal Dependencies**: No external SVG libraries needed
✅ **Standard Patterns**: ES6 modules, standard export/import

---

## Summary

**Total Contracts**: 5 SVG generator functions + 1 utility function
**Complexity**: Low - each function returns a simple string
**Testability**: High - pure functions with no side effects
**Extensibility**: Easy - follow pattern to add new assets

**Next**: Define scene lifecycle contracts and Phaser integration patterns.
