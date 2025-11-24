# Phase 0: Research Findings

## 1. SVG Design System Architecture

**Decision**: Use flat ES6 modules with named exports for all SVG components

**Rationale**:
- **Color Palette**: Single `palette.js` file with named color constants provides clear single source of truth
- **Shape Helpers**: Pure functions returning SVG element strings (not complete documents) for composition
- **Sprite Generators**: Parametric functions accepting flat config objects (`{ bodyColor, headColor }`) - simpler than nested configs
- **File Organization**: Three-layer structure (palette → shapes → sprites) provides clear dependency hierarchy

**Alternatives Considered**:
- Builder pattern: Rejected (too complex for simple geometric shapes)
- Config objects with nested structure: Rejected (flat parameters more readable)
- Class-based components: Rejected (pure functions align with constitutional simplicity)

**Implementation Notes**:
- All functions pure (no side effects)
- Default parameters for optional config values
- Keep functions under 50 lines for LLM readability

---

## 2. Phaser SVG-to-Texture Pipeline

**Decision**: Wrap data URI conversion in `svgToTexture()` utility that registers textures immediately

**Rationale**:
- Phaser's `load.image()` works with data URIs (`data:image/svg+xml;charset=UTF-8,<encoded>`)
- Loading during `create()` (not `preload()`) keeps texture generation synchronous and simple
- Texture dimensions (32x32 for characters, 64x64 for tiles) chosen for pixel-perfect rendering at integer scales
- Caching handled automatically by Phaser's texture manager (no manual caching needed)

**Alternatives Considered**:
- `textures.addSVG()` API: Rejected (requires XML parsing, more complex than data URI)
- Preload phase loading: Rejected (async complexity not needed for small SVG strings)
- On-demand texture generation: Rejected (prefer upfront loading for predictable performance)

**Best Practices**:
- Load all textures at scene startup (beginning of `create()`)
- Use consistent naming convention: `'player'`, `'npc'`, `'chest'`, `'floor-0'`, `'floor-1'`, etc.
- Generate SVG strings once, reuse texture keys for sprite creation

---

## 3. Idle Animation Approaches

**Decision**: Use Phaser tween-based animation (y-position bob) for idle effects

**Rationale**:
- **Simplicity**: Single tween per sprite vs. generating/managing multiple SVG frames
- **Performance**: Tweens are lightweight (GPU-accelerated transforms) vs. texture swapping
- **Flexibility**: Easy to adjust parameters (duration, offset, easing) without regenerating SVGs
- **Code clarity**: Declarative tween config more readable than frame animation setup

**Parameters**:
```javascript
this.tweens.add({
  targets: sprite,
  y: sprite.y - 4,           // 4px upward offset
  duration: 1000,            // 1 second cycle
  yoyo: true,                // Return to start
  repeat: -1,                // Infinite loop
  ease: 'Sine.easeInOut'     // Smooth motion
});
```

**Alternatives Considered**:
- Frame-based animation (2-3 SVG variants): Rejected (more complex, no visual benefit over smooth tween)
- Scale pulsing: Rejected (y-position bob more natural for "breathing" effect)

**Frame Rate**: 60fps maintained (tweens use requestAnimationFrame, no overhead)

---

## 4. Tile-Based Environment Rendering

**Decision**: Manual sprite placement (not Phaser Tilemap API)

**Rationale**:
- **Simplicity**: Direct sprite creation simpler than Tilemap JSON configuration
- **Collision Preservation**: Maintains Phase 1's physics bodies without Tilemap collision layers
- **Flexibility**: Easy to place individual tile variants without tilemap constraints
- **Scope**: Single room with ~10-20 tiles doesn't justify Tilemap complexity

**Tile Sizes**:
- Floor tiles: 64x64 (visible detail at room scale)
- Wall tiles: 64x64 (consistency with floor)
- Character sprites: 32x32 (maintain Phase 1 dimensions)
- Props: 32x32 or 48x48 (varied sizes for visual interest)

**Rendering Approach**:
```javascript
// Load 3 floor tile variants
for (let x = 0; x < roomWidth; x += 64) {
  for (let y = 0; y < roomHeight; y += 64) {
    const variant = Math.floor(Math.random() * 3); // 0, 1, or 2
    this.add.sprite(x, y, `floor-${variant}`).setOrigin(0, 0).setDepth(0);
  }
}
```

**Alternatives Considered**:
- Phaser Tilemap API: Rejected (requires JSON map, tileset configuration, added complexity)
- Tilemap with collision layers: Rejected (Phase 1 uses physics bodies, no need to migrate)

**Collision Strategy**: Maintain Phase 1 approach (static physics bodies for walls, no tile collision)

---

## 5. Dialog Panel Visual Effects

**Decision**: Use SVG rounded rectangle (`<rect rx="8" ry="8">`) with simple offset shadow rectangle

**Rationale**:
- **Rounded Corners**: Native SVG `rx`/`ry` attributes (no custom path generation needed)
- **Drop Shadow**: Offset rectangle with semi-transparent black simpler than `<filter>` elements
- **LLM Readability**: Simple primitives easier to understand/modify than filter syntax
- **Performance**: Two rectangles more efficient than SVG filters

**Implementation**:
```javascript
export function createDialogPanelSvg({ width = 600, height = 120 } = {}) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Shadow (behind, offset) -->
    <rect x="6" y="6" width="${width-12}" height="${height-12}"
          rx="8" ry="8" fill="#00000080" />
    <!-- Panel (foreground) -->
    <rect x="0" y="0" width="${width-12}" height="${height-12}"
          rx="8" ry="8" fill="#F5F5DC" stroke="#4A4A4A" stroke-width="3" />
  </svg>`;
}
```

**Shadow Parameters**:
- Offset: 6px right, 6px down (suggests depth)
- Opacity: 50% (`#00000080` = rgba(0,0,0,0.5))
- Blur: None (hard-edge shadow simpler, aligns with SNES aesthetic)

**Alternatives Considered**:
- SVG `<filter>` with `<feDropShadow>`: Rejected (more complex, less LLM-readable)
- Phaser Graphics API for panel: Rejected (keep all visuals as code-generated SVGs per constitution)
- Gradient background: Rejected (constitution mandates no gradients)

---

## Summary

All research decisions prioritize **simplicity**, **constitutional compliance**, and **LLM readability**:
- ✅ Pure functions over classes/builders
- ✅ Flat config objects over nested structures
- ✅ Simple SVG primitives over complex filters
- ✅ Manual sprite placement over Tilemap API
- ✅ Tween-based animation over frame-based
- ✅ Data URI loading over async preload

No NEEDS CLARIFICATION items remain - all technical decisions finalized and ready for implementation.
